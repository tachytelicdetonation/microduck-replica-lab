"""Export the China addendum only; never rewrite the existing US list or ZIPs."""
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = {
    "China shopping links",
    "China 3D printing without owning a printer",
    "China PCB fabrication and assembly",
}


def main():
    rows = []
    section = ""
    for line in (ROOT / "docs/PROCUREMENT_CN.md").read_text().splitlines():
        if line.startswith("## "):
            section = line[3:]
        elif line.startswith("### "):
            section = ""  # Excluded alternatives are not orderable checklist rows.
        if section not in SECTIONS or not line.startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if all(re.fullmatch(r":?-+:?", cell) for cell in cells):
            continue
        if cells[0] in {"Qty / order unit", "Service", "Service / item"}:
            continue
        if section == "China shopping links":
            quantity, item, supplier, evidence, notes = cells
        else:
            item, supplier, evidence, notes = cells
            quantity = "Alternative service; quote exact fit/full batch"
        urls = re.findall(r"\]\(([^)]+)\)", supplier)
        urls = ["../docs/" + url if url.endswith(".md") and "://" not in url
                and not url.startswith("../") else url for url in urls]
        for cell in (item, quantity):
            assert not cell.startswith(("=", "+", "-", "@")), "Unexpected spreadsheet formula"
        rows.append([section, quantity, item.replace("**", ""), " ; ".join(urls),
                     supplier, evidence, notes] + [""] * 9)
    assert len(rows) == 25, f"Review guide table changes: {len(rows)} rows"
    target = ROOT / "hardware/procurement-cn.csv"
    with target.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.writer(handle)
        writer.writerow([
            "section", "required_quantity_or_order_unit", "item_or_service", "source_links",
            "supplier_and_selection", "price_and_evidence", "compatibility_and_minimum_notes",
            "selected_sku_or_service", "actual_order_quantity", "actual_goods_total_currency",
            "actual_goods_total", "actual_shipping_usd", "actual_other_fees_and_import_usd",
            "actual_landed_total_usd", "ordered", "received_and_fit_checked",
        ])
        writer.writerows(rows)
    print(f"Wrote {target.relative_to(ROOT)}: {len(rows)} rows; actual costs remain blank")


if __name__ == "__main__":
    main()
