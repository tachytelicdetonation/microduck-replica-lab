# CPU simulation

The web simulation server loads `scene.xml`, the published `alpha_walking`, `alpha_stand` and `alpha_sitstand` ONNX policies, and BAM's M6 XL330 actuator model. It advances MuJoCo at 200 Hz and runs the policy at 50 Hz. The server binds to loopback only.

```bash
uv sync --locked
uv run python -m lab.server
# in a second terminal
npm run dev
```

The page starts paused. Send a zero command to validate standing, then use the command sliders. Export telemetry as NDJSON from the Simulation page. To run headless:

```bash
uv run python -m lab.simulate --seconds 10 --log artifacts/stand.jsonl
uv run python -m lab.simulate --seconds 10 --vx 0.30 --log artifacts/forward.jsonl
```

The bridge rejects non-finite states and out-of-range velocity commands. It warms the ONNX session and verifies the input/output shapes. Its target conversion inserts the independent mouth slot before the right-leg actions.

To rehearse a newly exported gait, pass `--walking /absolute/path/to/walk.onnx` to either `lab.server` or `lab.simulate`. `--standing` and `--sitstand` can similarly override those slots. These are action-scale-1.0 policies; use the upstream inference tool for the different roller and trick contracts.

## Training

Training is performed by the upstream `microduck_rl` project with MuJoCo Warp, PPO and the 50 Hz recipe. A GPU is required:

```bash
python3 scripts/train.py --dry-run
python3 scripts/train.py --smoke
python3 scripts/train.py --iterations 5000 --envs 4096
```

The wrapper always runs a 64-environment, 5-iteration smoke test before a full run, verifies the pinned checkout and uses `uv sync --locked`. Export checkpoints only through `upstream/microduck_rl/scripts/export.py`; that path bakes the observation normalizer into ONNX. Never deploy a hand-converted `.pt`.
