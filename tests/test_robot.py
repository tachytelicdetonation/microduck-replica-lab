"""Regression checks for the policy contract, physical rollout, and CAD transforms."""
import hashlib
import json

import mujoco
import numpy as np
import pytest
import trimesh

from lab.robot import ROOT, MODELS, JOINT_NAMES, Robot, official_inference, policy_session, runtime_targets


def test_mouth_does_not_shift_the_right_leg():
    targets = runtime_targets(np.arange(14), np.zeros(14), mouth=-0.3)
    assert targets.shape == (15,)
    assert targets[9] == -0.3
    np.testing.assert_equal(targets[10:], [9, 10, 11, 12, 13])
    with pytest.raises(ValueError):
        runtime_targets([float('nan')] * 14, np.zeros(14))


def test_all_official_policy_hashes_and_contracts():
    lock = json.loads((ROOT / 'upstream.lock.json').read_text())
    for file in lock['policies']['files']:
        path = ROOT / 'policies' / file['file']
        assert hashlib.sha256(path.read_bytes()).hexdigest() == file['sha256']
        if path.suffix == '.onnx':
            policy_session(path)  # checks shape, dtype, and finite warmup


def test_observation_matches_official_inference_at_tilted_pose():
    robot = Robot()
    reference = official_inference().PolicyInference(
        robot.model, robot.data,
        walking_onnx_path=str(ROOT / 'policies/alpha_walking.onnx'),
        use_projected_gravity=True, new_cmd_obs=True)
    robot.data.qpos[3:7] = [np.cos(0.2), np.sin(0.2), 0, 0]
    robot.data.qvel[3:6] = [0.1, -0.2, 0.3]
    mujoco.mj_forward(robot.model, robot.data)
    np.testing.assert_allclose(robot.observation(), reference.get_observations(), atol=1e-6)
    with pytest.raises(ValueError):
        robot.set_command([1, 0, 0])
    with pytest.raises(ValueError):
        robot.set_command([0, float('nan'), 0])


def test_stand_then_walk_is_finite_upright_and_moves_forward():
    robot = Robot()
    for _ in range(250):
        robot.step()
    assert robot.snapshot()['tilt'] < 8
    assert robot.snapshot()['height'] > 95
    assert robot.data.ncon > 0
    start_x = robot.data.qpos[0]
    # The published policy has a low-speed dead zone on this CPU model.
    # 0.30 m/s is a verified forward command; see docs/VALIDATION.md.
    robot.set_command([0.3, 0, 0])
    for _ in range(500):
        robot.step()
    assert np.isfinite(robot.data.qpos).all()
    assert robot.data.qpos[0] - start_x > 0.5
    assert robot.snapshot()['tilt'] < 30
    assert robot.snapshot()['height'] > 90
    robot.reset()
    assert robot.paused and robot.steps == 0 and robot.data.time == 0


def test_exported_glb_matches_mujoco_part_poses():
    manifest = json.loads((ROOT / 'public/models/manifest.json').read_text())
    scene = trimesh.load_scene(ROOT / 'public/models/microduck.glb')
    model = mujoco.MjModel.from_xml_path(str(MODELS / 'robot_allcollisions.xml'))
    data = mujoco.MjData(model)
    data.qpos[:7] = [0, 0, 0.125, 1, 0, 0, 0]
    for name, angle in zip(JOINT_NAMES, official_inference().DEFAULT_POSE):
        data.qpos[model.joint(name).qposadr[0]] = angle
    mujoco.mj_forward(model, data)
    visual_geoms = np.where(model.geom_group == 2)[0]
    assert len(manifest['parts']) == len(visual_geoms) == 70
    assert len(manifest['bodies']) == 15
    for part, g in zip(manifest['parts'], visual_geoms):
        matrix, geometry = scene.graph[part['id']]
        np.testing.assert_allclose(matrix[:3, 3], data.geom_xpos[g] * 1000, atol=0.001)
        np.testing.assert_allclose(matrix[:3, :3], data.geom_xmat[g].reshape(3, 3), atol=1e-6)
        assert len(scene.geometry[geometry].faces) == part['triangles']
