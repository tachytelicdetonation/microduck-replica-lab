# PPO and sim-to-real

The upstream task is `Mjlab-Velocity-Flat-MicroDuck`. It uses MuJoCo / MuJoCo Warp, PPO, BAM actuator dynamics and domain randomization at 50 Hz. The shared actor observation is 61 values: angular velocity (3), projected gravity (3), 14 relative joint positions, 14 joint velocities, 14 previous actions, and a 13-value command block (twist 3, head pose 4, body pose 6).

The action is 14 values. Runtime adds those offsets to the home frame and inserts the mouth at physical slot 9. The policy contract must remain `[1,61] → [1,14]`; command slots are zero-padded when a task does not use them.

## Reproducible run

```bash
python3 scripts/train.py --dry-run
python3 scripts/train.py --smoke
python3 scripts/train.py --iterations 5000 --envs 4096
```

PPO settings from the source recipe include 4096 parallel environments, 24 steps per environment per iteration, 512/256/128 ELU actor and critic layers, learning rate 0.001, clip 0.2, entropy 0.01, discount 0.99, GAE 0.95, target KL 0.01, five learning epochs and four mini-batches. A reference run in the series reports 5000 iterations, 491,520,000 simulation steps and 1 h 59 m 52 s on an RTX 4090; expect hardware and task revisions to change this.

## What to randomize

Keep actuator voltage sag, back-EMF, Coulomb/Stribeck/load friction, command delay, encoder bias, IMU noise, observation noise and optional ±1° backlash aligned with the physical build. Update mass, inertia, geometry, joint limits, sole friction and control timing after measurement. An action-scale tweak is not a replacement for retraining when the dynamics changed.

## Export gate

Use the upstream exporter, then run the exported model in the local CPU bridge. Check graph shape, warm-up latency, finite values, command slots, home pose, action scale and policy-specific filtering. The training viewer can apply normalization for you; hardware cannot.

The official exporter accepts a local checkpoint or a Weights & Biases run. For a local checkpoint:

```bash
cd upstream/microduck_rl
uv run scripts/export.py Mjlab-Velocity-Flat-MicroDuck \
  --checkpoint-file /absolute/path/to/model_5000.pt \
  --onnx-file /absolute/path/to/walk.onnx
cd ../..
uv run python -m lab.simulate --walking /absolute/path/to/walk.onnx --seconds 20 --vx 0.30
uv run python -m lab.server --walking /absolute/path/to/walk.onnx
```

The web adapter supports walk, stand and sit/stand at action scale 1.0. For the other supplied skills (rollers, kicks, ground pick, roulade), use the upstream `scripts/infer_policy.py` and its matching scene, command encoding and action scale. All nine supplied policies pass shape/checksum/warm-up checks; this project has not completed behavioural validation for those extra skills.
