#!/usr/bin/env python3
"""Generate purchasing CSVs and print-quotation ZIPs from local reference data.

Does not upload files, request quotes, order parts, or change upstream sources.
Run after scripts/export_models.py if the geometry changes.
"""
from collections import Counter
import csv
import json
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PRINT_KINDS = {'Structure', 'Shell', 'Soft part'}
SOFT = {'sole_left', 'sole_right', 'jaw_soft', 'soft_mouth_top'}
FIT_SET = {'yaw2roll', 'bearing_roll', 'leg', 'motor_support'}


def csv_text(rows, fields):
    import io
    stream = io.StringIO(newline='')
    writer = csv.DictWriter(stream, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)
    return stream.getvalue()


def main():
    out = ROOT / 'public/models'
    manifest = json.loads((out / 'manifest.json').read_text())
    lock = json.loads((ROOT / 'upstream.lock.json').read_text())
    if manifest['revision'] != lock['repos'][0]['commit']:
        raise RuntimeError('Manifest and source lock differ; regenerate the CAD first.')
    parts = [p for p in manifest['parts'] if p['kind'] in PRINT_KINDS]
    quantities = Counter(p['mesh'] for p in parts)
    by_name = {p['mesh']: p for p in parts}
    if len(quantities) != 30 or sum(quantities.values()) != 36:
        raise RuntimeError('Geometry quantities changed; review the shopping/print brief before exporting.')
    rows = []
    for mesh in sorted(quantities):
        p = by_name[mesh]
        folder = 'flexible' if mesh in SOFT else 'rigid'
        material = 'TPU around 95A: proposed' if mesh in SOFT else 'PA12 MJF/SLS: proposed; PETG fit prototype alternative'
        note = 'Reference geometry; validate fit, process, mass and finish.'
        if mesh == 'm12_lens_holder':
            folder = 'review-before-order'
            note = 'HOLD: confirm selected camera, lens thread and whether this part is bought or made.'
        elif mesh == 'upper_leg_rigidity_plate':
            note = '1 mm thin reinforcement: service must review material/strength/process.'
        elif mesh == 'power_support':
            note = 'Confirm actual battery/contacts: mounting adaptation may change this part.'
        elif mesh in SOFT:
            note = 'No validated hardness/friction specification; test material and contact behavior.'
        rows.append({
            'mesh': mesh, 'name': p['name'], 'quantity': quantities[mesh],
            'file_in_zip': f'{folder}/{mesh}.stl', 'proposed_material': material,
            'source_dimensions_mm': ' x '.join(map(str, p['dimensionsMm'])),
            'notes': note,
        })
    fields = list(rows[0])
    (ROOT / 'hardware/print-order.csv').write_text(csv_text(rows, fields))
    for name, selection in [
        ('microduck-print-quote.zip', rows),
        ('microduck-fit-check.zip', [{**r, 'quantity': 1} for r in rows if r['mesh'] in FIT_SET]),
    ]:
        with zipfile.ZipFile(out / name, 'w', zipfile.ZIP_DEFLATED) as archive:
            archive.writestr('print-order.csv', csv_text(selection, fields))
            archive.writestr('README.txt',
                'MICRODUCK PRINT QUOTATION / FIT REFERENCE\n'
                'Not released or physically validated manufacturing CAD.\n'
                f'{len(selection)} STL types; {sum(r["quantity"] for r in selection)} modeled pieces.\n'
                'STL units: MILLIMETRES. Do not rescale or print as an assembly.\n'
                'Set copies from print-order.csv: uploading each STL once is not the full quantity.\n'
                'Materials are proposals. Get a manufacturability review and small fit batch first.\n'
                'review-before-order/ files require a component decision before ordering.\n'
                'The fit-check subset is included in the full set; do not order it twice by accident.\n'
                'See PRINT_SERVICE_BRIEF.md. Excludes servos, bearings, boards, battery, lens and speaker.\n'
                f'Source: pollen-robotics/microduck_rl @ {manifest["revision"]}\n'
                'Geometry: Pollen Robotics, CC BY-NC-SA 4.0. Attribution included.\n')
            for row in selection:
                archive.write(out / 'parts-mm' / f'{row["mesh"]}.stl', row['file_in_zip'])
            archive.write(ROOT / 'docs/PRINT_SERVICE_BRIEF.md', 'PRINT_SERVICE_BRIEF.md')
            archive.write(ROOT / 'THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_NOTICES.md')
    shopping, section = [], ''
    for line in (ROOT / 'docs/PROCUREMENT_US.md').read_text().splitlines():
        if line.startswith('## '):
            section = line[3:]
        if not line.startswith('|'):
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if not cells or not re.match(r'\d|as specified|as fitted', cells[0]):
            continue
        urls = re.findall(r'\]\((https?://[^)]+)\)', line)
        shopping.append({
            'section': section, 'quantity_or_condition': cells[0],
            'item': cells[1].replace('**', ''), 'supplier_urls': ' ; '.join(urls),
            'guide_details': ' | '.join(cells[2:]),
            'actual_order_quantity': '', 'actual_cost_usd': '',
            'ordered_date': '', 'received_date': '', 'fit_verified': '', 'notes': '',
        })
    (ROOT / 'hardware/procurement-us.csv').write_text(csv_text(shopping, list(shopping[0])))
    hat = ROOT / 'upstream/robot-hat'
    with zipfile.ZipFile(out / 'microduck-hat-quote.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        for name in [
            'PCB01186-C1_elec_RPI_Robot_HAT_PCB.zip',
            'ASE01187-C1_elec_RPI_Robot_HAT_BOM.csv',
            'ASE01187-C1_elec_RPI_Robot_HAT_POS.csv',
            'ASE01187-C1_elec_RPI_Robot_HAT_SCH.pdf',
            'PCB01186-C1_elec_RPI_Robot_HAT_PCB.pdf',
            'ASE01187-C1_elec_RPI_Robot_HAT_STEP.zip',
        ]:
            archive.write(hat / 'production' / name, name)
        archive.write(hat / 'LICENSE', 'LICENSE')
        archive.writestr('README.txt',
            'POLLEN ROBOTICS RPI ROBOT HAT - QUOTATION INPUTS\n'
            'Upstream revision: ' + next(r['commit'] for r in lock['repos'] if r['name'] == 'robot-hat') + '\n'
            'Official production files copied unchanged. See LICENSE.\n'
            'PCB: 4 layers, 1.0 mm, approximately 65.0 x 30.9 mm.\n'
            'Request one completed board; quote board/panel minimums separately.\n'
            'The nested PCB ZIP is the Gerber/drill upload. BOM and POS are assembly inputs.\n'
            'Have the service review BOM mapping, rotation, both sides, DNP rows, fiducials, logos and through-hole work.\n'
            'Do not treat every position row as a fitted electronic component.\n'
            'Do not populate DNP components or accept substitutions without review.\n'
            'This board does not supply tested ID-200 IMU bridge firmware or a battery charger.\n'
            'The robot power distribution and servo voltage still need engineering review.\n'
            'No fabrication quote or order has been submitted by this project.\n')
    print(f'Prints: {len(rows)} reference STL types, {sum(quantities.values())} modeled pieces; fit batch {len(FIT_SET)} types.')
    print(f'Shopping checklist: {len(shopping)} rows; order and measured fields intentionally blank.')


if __name__ == '__main__':
    main()
