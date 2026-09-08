"""CPU rehearsal using the official ONNX policies and BAM M6 actuator implementation.

No serial devices are opened by this module. Real hardware runs upstream robotd.
"""
from __future__ import annotations

import importlib.util
import json
import math
from pathlib import Path
import time

import mujoco
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parents[1]
RL = ROOT / 'upstream/microduck_rl'
MODELS = RL / 'src/mjlab_microduck/robot/microduck'
JOINT_NAMES = (
    'left_hip_yaw', 'left_hip_roll', 'left_hip_pitch', 'left_knee', 'left_ankle',
    'neck_pitch', 'head_pitch', 'head_yaw', 'head_roll',
    'right_hip_yaw', 'right_hip_roll', 'right_hip_pitch', 'right_knee', 'right_ankle',
)
SERVO_IDS = (20, 21, 22, 23, 24, 30, 31, 32, 33, 10, 11, 12, 13, 14)
CONTROL_DT = 0.02


def official_inference():
    path = RL / 'scripts/infer_policy.py'
    if not path.exists():
        raise RuntimeError('Missing upstream source. Run python3 scripts/fetch_upstream.py first.')
    spec = importlib.util.spec_from_file_location('microduck_official_infer', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def runtime_targets(action, home, mouth=0.0):
    """14 policy offsets -> 15 runtime slots; mouth is independent at index 9."""
    action = np.asarray(action, dtype=np.float64)
    home = np.asarray(home, dtype=np.float64)
    if action.shape != (14,) or home.shape != (14,):
        raise ValueError('Expected exactly 14 policy actions and 14 home angles.')
    if not np.isfinite(action).all() or not np.isfinite(home).all() or not math.isfinite(mouth):
        raise ValueError('Non-finite joint target rejected.')
    return np.insert(home + action, 9, mouth)


def policy_session(path):
    options = ort.SessionOptions()
    options.intra_op_num_threads = 1
    options.inter_op_num_threads = 1
    session = ort.InferenceSession(str(path), sess_options=options, providers=['CPUExecutionProvider'])
    inputs, outputs = session.get_inputs(), session.get_outputs()
    if len(inputs) != 1 or inputs[0].shape != [1, 61] or inputs[0].type != 'tensor(float)':
        raise ValueError(f'{path}: expected one float32 input [1, 61].')
    if len(outputs) != 1 or outputs[0].shape != [1, 14] or outputs[0].type != 'tensor(float)':
        raise ValueError(f'{path}: expected one float32 output [1, 14].')
    warmup = np.zeros((1, 61), dtype=np.float32)
    warmup[0, 5] = -1.0
    result = session.run(None, {inputs[0].name: warmup})[0]
    if not np.isfinite(result).all():
        raise ValueError(f'{path}: non-finite warm-up output.')
    return session


class Robot:
    def __init__(self, walking: Path | None = None, standing: Path | None = None, sitstand: Path | None = None):
        official = official_inference()
        self.home = official.DEFAULT_POSE.copy()
        bam = official.load_bam_model(200.0, 7.4, None)
        self.model, self.data, self.motor, _ = official.load_mujoco_with_bam(
            str(MODELS / 'scene.xml'), bam, 0.005, 0.0, 6.0)
        self.joint_ids = [self.model.joint(name).id for name in JOINT_NAMES]
        self.qpos_ids = self.model.jnt_qposadr[self.joint_ids]
        self.qvel_ids = self.model.jnt_dofadr[self.joint_ids]
        actual = [self.model.joint(int(j)).name for j in self.model.actuator_trnid[:, 0]]
        if actual != list(JOINT_NAMES):
            raise ValueError(f'Actuator order changed: {actual}')
        self.trunk = self.model.body('trunk_base').id
        self.gyro = self.model.sensor('imu_ang_vel').id
        self.sessions = {name: policy_session(path) for name, path in {
            'walk': walking or ROOT / 'policies/alpha_walking.onnx',
            'stand': standing or ROOT / 'policies/alpha_stand.onnx',
            'posture': sitstand or ROOT / 'policies/alpha_sitstand.onnx',
        }.items()}
        self.reset()

    def reset(self):
        mujoco.mj_resetData(self.model, self.data)
        self.data.qpos[:7] = [0, 0, 0.125, 1, 0, 0, 0]
        self.data.qpos[self.qpos_ids] = self.home
        self.motor.reset(self.data.qpos)
        self.motor.q_target[:] = self.home
        self.last_action = np.zeros(14, dtype=np.float32)
        self.command = np.zeros(13, dtype=np.float32)
        self.mode = 'stand'
        self.posture_until = 0.0
        self.paused = True
        self.fault = None
        self.inference_ms = 0.0
        self.steps = 0
        mujoco.mj_forward(self.model, self.data)

    def set_command(self, velocity):
        velocity = np.asarray(velocity, dtype=np.float64)
        if velocity.shape != (3,) or not np.isfinite(velocity).all():
            raise ValueError('velocity must contain 3 finite numbers: vx, vy, yaw.')
        if np.any(np.abs(velocity) > [0.3, 0.2, 1.5]):
            raise ValueError('Command exceeds rehearsal ranges: ±0.3 m/s, ±0.2 m/s, ±1.5 rad/s.')
        self.command[:3] = velocity
        self.mode = 'walk' if np.linalg.norm(velocity) > 0.05 else 'stand'
        self.posture_until = 0.0

    def set_posture(self, sit):
        self.mode = 'posture'
        self.command[:] = 0
        self.command[0] = 1.0 if sit else 0.0
        self.posture_until = float('inf') if sit else self.data.time + 3.0

    def observation(self):
        gyro_start = self.model.sensor_adr[self.gyro]
        gravity = -self.data.xmat[self.trunk].reshape(3, 3)[2, :]
        obs = np.concatenate([
            self.data.sensordata[gyro_start:gyro_start + 3], gravity,
            self.data.qpos[self.qpos_ids] - self.home,
            self.data.qvel[self.qvel_ids], self.last_action, self.command,
        ]).astype(np.float32)
        if obs.shape != (61,) or not np.isfinite(obs).all():
            raise ValueError('Invalid 61-dimensional observation; simulation paused.')
        return obs

    def step(self):
        if self.fault:
            raise RuntimeError(self.fault)
        if self.mode == 'posture' and self.data.time >= self.posture_until:
            self.mode = 'stand'
        session = self.sessions[self.mode]
        obs = self.observation()
        start = time.perf_counter()
        action = session.run(None, {session.get_inputs()[0].name: obs[None, :]})[0][0]
        self.inference_ms = (time.perf_counter() - start) * 1000
        targets = runtime_targets(action, self.home)
        self.last_action[:] = action
        self.motor.q_target[:] = np.delete(targets, 9)
        for _ in range(4):
            self.motor.update()
            mujoco.mj_step(self.model, self.data)
            if not np.isfinite(self.data.qpos).all() or not np.isfinite(self.data.qvel).all():
                self.fault = 'Non-finite physics state; reset the simulation.'
                self.paused = True
                raise RuntimeError(self.fault)
        mujoco.mj_forward(self.model, self.data)
        self.steps += 1

    def snapshot(self):
        rotation = self.data.xmat[self.trunk].reshape(3, 3)
        return {
            'time': round(float(self.data.time), 3), 'steps': self.steps,
            'paused': self.paused, 'mode': self.mode, 'fault': self.fault,
            'engine': f'MuJoCo {mujoco.__version__} · BAM M6 · ONNX CPU',
            'controlHz': 50, 'physicsHz': 200, 'inferenceMs': round(self.inference_ms, 3),
            'height': round(float(self.data.xpos[self.trunk, 2] * 1000), 2),
            'tilt': round(math.degrees(math.acos(float(np.clip(rotation[2, 2], -1, 1)))), 2),
            'contacts': self.data.ncon, 'command': self.command[:3].tolist(),
            'joints': self.data.qpos[self.qpos_ids].tolist(),
            'positions': self.data.xpos[1:].tolist(),
            'quaternions': self.data.xquat[1:].tolist(),
            'bodies': [self.model.body(i).name for i in range(1, self.model.nbody)],
            'basePosition': self.data.xpos[self.trunk].tolist(),
        }
