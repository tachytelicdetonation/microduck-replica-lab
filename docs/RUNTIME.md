# Robot runtime

The `upstream/microduck` checkout is Pollen Robotics' Rust workspace at the pinned revision. It contains robotd, robotctl, the IPC protocol, kinematics, policy loader and the other service crates.

```bash
cd upstream/microduck
cargo build --locked -p robotd -p robotctl
cd ../..
uv run python scripts/check_runtime.py
```

The check starts the actual binary with `--fake --no-policy`, waits for its Unix socket, requests `robot.health`, saves `artifacts/runtime-health.json`, and shuts it down. It does not touch a serial device. Use the upstream installation and board docs for a Radxa deployment.

## Runtime invariants

- `robotd` is the exclusive writer to the motor bus and runs the 50 Hz control loop.
- Inputs are high-level intents over Unix socket JSON-RPC; clients do not write servo registers.
- The ONNX policy input is float32 `[1, 61]`; output is float32 `[1, 14]`.
- The 14-action order is left leg 0–4, neck/head 5–8, right leg 9–13. The physical mouth servo is slot 9 in the 15-target array and is not a policy action.
- Deploy ONNX exported through the upstream normalizer-aware path. Do not hand-convert a checkpoint.
- `--fake` means no bus. `--no-policy` alone still allows hardware paths.

The web CPU bridge is intentionally separate from robotd. It exists to rehearse the same policy and sensor contract without pretending that a Rust fake device is a physics simulator.
