#!/usr/bin/env python3
"""Export exact compiled MJCF geometry to an interactive GLB and reference CAD.

The GLB uses millimetres and Z-up, and retains one named node per visible part.
Body transforms come from MuJoCo, including its mesh-centering transforms.
"""
import csv
import json
from pathlib import Path
import sys
import zipfile

import mujoco
import numpy as np
import trimesh

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from lab.robot import ROOT, MODELS, JOINT_NAMES, SERVO_IDS, official_inference

NAMES = {
    'np_f970': ('Battery envelope', 'Electronics', 'Battery envelope from the CAD export. The series describes an NP-F550-class pack; this mesh is named NP-F970. Verify the purchased pack and power design.'),
    'elec_rpi_robot_hat_pcb': ('Robot interface HAT', 'Electronics', 'Power conversion, half-duplex Dynamixel interface, audio and expansion. Use the pinned KiCad production files for fabrication dimensions.'),
    'pcb__raspberry_pi_zero_2_w': ('Main computer envelope', 'Electronics', 'The mesh is named Raspberry Pi Zero 2 W. The current runtime targets Radxa Zero 3W; verify actual board dimensions and connectors.'),
    'xl330': ('Dynamixel XL330', 'Actuator', 'Smart servo on the 1 Mbps TTL bus. Fifteen physical servos: fourteen policy joints plus the independently controlled mouth.'),
    'seeed_bearing__configuration__22x16x4': ('22 × 16 × 4 bearing', 'Hardware', 'Thin-section bearing represented in the source CAD. Confirm the seat and actual bearing fit before ordering.'),
    'seeed_bearing__configuration_default': ('Joint bearing', 'Hardware', 'Bearing geometry from the original assembly. Measure dimensions and fit; the filename does not establish a supplier specification.'),
    'lens': ('Camera lens', 'Electronics', 'Wide-angle lens at the front of the head; verify compatibility with the actual camera module.'),
    'speaker': ('Speaker', 'Electronics', 'Audio output component. Optional for the first walking build.'),
    'top_head_shell': ('Upper head shell', 'Shell', 'Upper protective cover around the head electronics and camera. Check openings, fasteners and cable access before printing.'),
    'bottom_head_shell': ('Lower head shell', 'Shell', 'Lower half of the head enclosure and attachment points for the face and neck assembly.'),
    'left_shell': ('Left body shell', 'Shell', 'Left exterior cover. Check the sweep of the legs, fastener access, and battery fit.'),
    'right_shell': ('Right body shell', 'Shell', 'Right exterior cover. Check the sweep of the legs, fastener access, and battery fit.'),
    'jaw': ('Jaw structure', 'Structure', 'Rigid beak structure. The walking MJCF fixes this assembly; the physical mouth has its own servo.'),
    'jaw_soft': ('Soft lower beak', 'Soft part', 'Compliant lower beak. Material hardness and print orientation require physical validation.'),
    'soft_mouth_top': ('Soft upper beak', 'Soft part', 'Compliant contact surface on the upper beak.'),
    'noenoeil': ('Eye insert', 'Structure', 'Small face insert from the original geometry.'),
    'face_part': ('Face panel', 'Shell', 'Front face around the camera and beak.'),
    'trunk_base': ('Torso base', 'Structure', 'Root structural frame that carries the electronics, battery and three articulated chains.'),
    'neck': ('Neck root', 'Structure', 'Base of the neck pitch chain.'),
    'neck_pitch': ('Neck pitch link', 'Structure', 'Link joining the neck base to the head pitch mechanism.'),
    'yaw_roll_motion': ('Head yaw–roll frame', 'Structure', 'Compact frame supporting the head yaw and roll axes.'),
    'yaw2roll': ('Hip yaw–roll bracket', 'Structure', 'Transfers the hip yaw axis to the hip roll joint.'),
    'hip_l': ('Hip roll link', 'Structure', 'Hip roll link. Used on both sides with distinct assembly transforms.'),
    'upper_leg_left': ('Left upper leg', 'Structure', 'Load-bearing left thigh link between hip and knee.'),
    'upper_leg_right': ('Right upper leg', 'Structure', 'Load-bearing right thigh link between hip and knee.'),
    'leg': ('Lower leg link', 'Structure', 'Knee-to-ankle linkage. Check its full travel and wire clearance.'),
    'ankle_left': ('Left ankle', 'Structure', 'Left ankle link and foot attachment.'),
    'ankle_right': ('Right ankle', 'Structure', 'Right ankle link and foot attachment.'),
    'foot_left': ('Left foot', 'Structure', 'Rigid left foot. Its contact geometry and sole friction affect the trained gait.'),
    'foot_right': ('Right foot', 'Structure', 'Rigid right foot. Its contact geometry and sole friction affect the trained gait.'),
    'sole_left': ('Left sole', 'Soft part', 'Compliant ground-contact layer. Measure friction and compliance for sim-to-real tuning.'),
    'sole_right': ('Right sole', 'Soft part', 'Compliant ground-contact layer. Measure friction and compliance for sim-to-real tuning.'),
    'upper_leg_rigidity_plate': ('Thigh reinforcement', 'Structure', 'Stiffening plate for the upper leg assembly.'),
    'motor_support': ('Servo support', 'Structure', 'Printed servo mount. Trial-fit one actual XL330 before duplicating it.'),
    'power_support': ('Power board support', 'Structure', 'Support for power and battery components in the torso.'),
    'banana_pcb_locker': ('Curved PCB retainer', 'Structure', 'Curved retainer securing the head electronics.'),
    'bearing_roll': ('Roll bearing retainer', 'Structure', 'Retains the bearing on the roll axis.'),
    'm12_lens_holder': ('M12 lens holder', 'Structure', 'Lens mounting reference. Validate threads, camera alignment and focus travel in CAD.'),
}


def group_for(body):
    if body == 'trunk_base':
        return 'Torso'
    if body in ('neck', 'neck_pitch', 'yaw_roll_motion', 'jaw_soft'):
        return 'Head & neck'
    if body in ('bearing_roll', 'hip_l_2', 'upper_leg_right', 'leg_2', 'ankle_right'):
        return 'Right leg'
    return 'Left leg'


def transform(position, rotation):
    matrix = np.eye(4)
    matrix[:3, :3] = np.asarray(rotation).reshape(3, 3)
    matrix[:3, 3] = np.asarray(position) * 1000
    return matrix


def main():
    out = ROOT / 'public/models'
    out.mkdir(parents=True, exist_ok=True)
    part_dir = out / 'parts-mm'
    part_dir.mkdir(exist_ok=True)
    model = mujoco.MjModel.from_xml_path(str(MODELS / 'robot_allcollisions.xml'))
    data = mujoco.MjData(model)
    home = official_inference().DEFAULT_POSE
    data.qpos[:7] = [0, 0, 0.125, 1, 0, 0, 0]
    for name, angle in zip(JOINT_NAMES, home):
        data.qpos[model.joint(name).qposadr[0]] = angle
    mujoco.mj_forward(model, data)

    scene = trimesh.Scene(base_frame='world')
    source_dimensions = {}
    parts, bodies, all_meshes = [], [], []
    for b in range(1, model.nbody):
        name = model.body(b).name
        matrix = transform(data.xpos[b], data.xmat[b])
        scene.graph.update(frame_to=f'body_{name}', frame_from='world', matrix=matrix)
        bodies.append({'name': name, 'group': group_for(name), 'position': data.xpos[b].tolist(),
                       'quaternion': data.xquat[b].tolist(), 'massGrams': round(float(model.body_mass[b] * 1000), 3)})

    for g in range(model.ngeom):
        if model.geom_group[g] != 2 or model.geom_type[g] != mujoco.mjtGeom.mjGEOM_MESH:
            continue
        mid, b = int(model.geom_dataid[g]), int(model.geom_bodyid[g])
        mesh_name, body_name = model.mesh(mid).name, model.body(b).name
        va, vn = model.mesh_vertadr[mid], model.mesh_vertnum[mid]
        fa, fn = model.mesh_faceadr[mid], model.mesh_facenum[mid]
        vertices = model.mesh_vert[va:va + vn].astype(float) * 1000
        faces = model.mesh_face[fa:fa + fn]
        rgba = model.geom_rgba[g].copy()
        if model.geom_matid[g] >= 0:
            rgba = model.mat_rgba[model.geom_matid[g]].copy()
        mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
        mesh.visual = trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(
            baseColorFactor=np.rint(rgba * 255).astype(np.uint8), metallicFactor=0.05, roughnessFactor=0.65))
        pid = f'part_{len(parts):03d}'
        scene.add_geometry(mesh, node_name=pid, geom_name=pid, parent_node_name=f'body_{body_name}',
                           transform=transform(model.geom_pos[g], _quat_matrix(model.geom_quat[g])))
        world_mesh = mesh.copy()
        world_mesh.apply_transform(transform(data.geom_xpos[g], data.geom_xmat[g]))
        all_meshes.append(world_mesh)
        label, kind, description = NAMES.get(mesh_name, (mesh_name.replace('_', ' ').title(), 'Structure', 'Original Microduck assembly reference geometry.'))
        if mesh_name not in source_dimensions:
            source = trimesh.load_mesh(MODELS / 'assets' / f'{mesh_name}.stl', process=False)
            source_dimensions[mesh_name] = source.extents * 1000
        extent = source_dimensions[mesh_name]
        parts.append({'id': pid, 'name': label, 'mesh': mesh_name, 'body': body_name,
                      'group': group_for(body_name), 'kind': kind, 'description': description,
                      'triangles': int(fn), 'dimensionsMm': np.round(extent, 2).tolist(),
                      'center': world_mesh.centroid.tolist(), 'color': rgba.tolist(),
                      'download': f'/models/parts-mm/{mesh_name}.stl'})

    for name in sorted({p['mesh'] for p in parts}):
        mesh = trimesh.load_mesh(MODELS / 'assets' / f'{name}.stl', process=False)
        mesh.apply_scale(1000)  # Upstream STL vertices are metres; slicers usually assume mm.
        mesh.export(part_dir / f'{name}.stl')
    scene.export(out / 'microduck.glb')
    assembled = trimesh.util.concatenate(all_meshes)
    assembled.export(out / 'assembled-reference-mm.stl')
    joints = []
    for i, name in enumerate(JOINT_NAMES):
        joint = model.joint(name)
        joints.append({'name': name, 'actionIndex': i, 'servoId': SERVO_IDS[i],
                       'body': model.body(int(model.jnt_bodyid[joint.id])).name,
                       'home': float(home[i]), 'range': joint.range.tolist(),
                       'axis': joint.axis.tolist(), 'position': joint.pos.tolist()})
    manifest = {
        'title': 'Microduck · original geometry', 'units': 'millimetres', 'upAxis': 'Z',
        'source': 'pollen-robotics/microduck_rl',
        'revision': json.loads((ROOT / 'upstream.lock.json').read_text())['repos'][0]['commit'],
        'license': 'CC BY-NC-SA 4.0', 'pose': 'HOME at trunk z = 125 mm',
        'partCount': len(parts), 'uniqueMeshCount': len({p['mesh'] for p in parts}),
        'modelMassGrams': round(float(model.body_mass.sum() * 1000), 2),
        'boundsMm': np.round(assembled.extents, 2).tolist(),
        'parts': parts, 'bodies': bodies, 'joints': joints,
    }
    (out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    with (out / 'parts.csv').open('w') as handle:
        writer = csv.writer(handle)
        writer.writerow(['instance', 'name', 'source_mesh', 'body', 'assembly', 'category'])
        for p in parts:
            writer.writerow([p[k] for k in ['id', 'name', 'mesh', 'body', 'group', 'kind']])
    (out / 'README.txt').write_text(
        'Microduck reference geometry — Pollen Robotics, CC BY-NC-SA 4.0.\n'
        'Derived from the revision in manifest.json. Exported by scripts/export_models.py.\n'
        'parts-mm/*.stl and assembled-reference-mm.stl use MILLIMETRES. GLB is Z-up, millimetres.\n'
        'These are simulation-derived reference meshes, not validated manufacturing drawings.\n'
        'Assembled STL contains electronics and overlapping rigid-body meshes; do not print it as one part.\n'
        'Individual reference meshes need tolerance, fastener, fit, material and cable-clearance checks.\n'
        'Simulation source in upstream/microduck_rl uses METRES; preserve its original units.\n'
        'Mechanical guide: docs/MECHANICAL.md. Measurement templates: hardware/.\n'
        'Attribution and full license: see THIRD_PARTY_NOTICES.md and https://creativecommons.org/licenses/by-nc-sa/4.0/\n')
    with zipfile.ZipFile(out / 'microduck-designs.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        for file in [out / 'README.txt', out / 'manifest.json', out / 'parts.csv', out / 'microduck.glb', out / 'assembled-reference-mm.stl', *sorted(part_dir.glob('*.stl'))]:
            archive.write(file, file.relative_to(out))
        archive.write(ROOT / 'THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_NOTICES.md')
        archive.write(ROOT / 'docs/MECHANICAL.md', 'docs/MECHANICAL.md')
        for file in sorted((ROOT / 'hardware').iterdir()):
            if file.is_file():
                archive.write(file, file.relative_to(ROOT))
    print(f'Exported {len(parts)} instances, {manifest["uniqueMeshCount"]} meshes, {len(bodies)} bodies.')
    print(f'Model mass: {manifest["modelMassGrams"]} g; HOME envelope: {manifest["boundsMm"]} mm.')


def _quat_matrix(quaternion):
    rotation = np.zeros(9)
    mujoco.mju_quat2Mat(rotation, quaternion)
    return rotation.reshape(3, 3)


if __name__ == '__main__':
    main()
