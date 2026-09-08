# Microduck Replica Lab

A local replication project for the seven-part Microduck series by [yishan / @tspy](https://x.com/tspy). It brings together the original Pollen Robotics geometry, published policies, robot runtime, electronics sources and an English build guide.

**Start with the assembly explorer and CPU simulation.** The physical robot still requires fabrication, components, calibration and a validated IMU bridge. No hardware has been assembled or tested by this project.

## Original series sources

These are the seven source posts this replica workbench follows:

1. [Microduck Robot Software Architecture Analysis](https://x.com/tspy/status/2093222346501107739)
2. [Microduck Robot Structure Exploded View](https://x.com/tspy/status/2094249218735300630)
3. [Microduck Robot Component Cost Estimation](https://x.com/tspy/status/2094591561908748588)
4. [Microduck Robot Reverse-Engineered 3D Materials](https://x.com/tspy/status/2094709164501254518)
5. [Microduck Robot Structure Visualization](https://x.com/tspy/status/2096238855519453662)
6. [Microduck Robot Reinforcement Training and Simulation](https://x.com/tspy/status/2095728806971806133)
7. [DIY Replicating the Microduck Robot from Scratch](https://x.com/tspy/status/2094963381220622638)

For purchasing in the **United States**, use the [shopping and assembly supply guide](docs/PROCUREMENT_US.md), [shopping checklist CSV](hardware/procurement-us.csv), and [print quote pack](public/models/microduck-print-quote.zip). You can order prints from a service without buying a printer. The pack contains 30 reference design types for 36 modeled pieces; it requires a fit-check batch before a full fabrication order.

For China procurement delivered to the US, use the [China sourcing and landed-cost comparison](docs/PROCUREMENT_CN.md), [China checklist CSV](hardware/procurement-cn.csv) and delivered-cost calculator on the Parts & costs page. The addendum distinguishes community price snapshots from checked service pages and quotes still needed. China printing options include domestic JLC, JLC3DP and PCBWay; compare the same materials and quantities with freight and import charges. The US guide and fabrication packs are retained. Regenerate only the China CSV with `python3 scripts/export_china_procurement.py`.

## Run the workbench

Prerequisites: Node.js 22+, Git, and [uv](https://docs.astral.sh/uv/getting-started/installation/). `uv` installs Python 3.12, required by the pinned BAM actuator package. CPU playback does not require CUDA.

This workspace has uv in `~/.local/bin` and Rust in `~/.cargo/bin`. If your shell does not find them, add these existing installations to the current terminal's path:

```bash
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
```

```bash
python3 scripts/fetch_upstream.py
uv sync --locked
npm ci
uv run python -m lab.server
```

In another terminal:

```bash
npm run dev
```

Open the URL Vite prints (default `http://localhost:5174`). The Assembly, Architecture, Parts and Guide pages work without the physics server. The Simulation page connects to the local service through Vite's `/api` proxy; it starts paused.

## What is included

| Series topic | Deliverable |
|---|---|
| Software architecture | Actual Rust runtime checkout, local build and fake-I/O health check; architecture view and [runtime guide](docs/RUNTIME.md) |
| Exploded structure | Original 70-part GLB with orbit, selection, explosion, isolation and searchable parts |
| Component costs | Editable USD worksheet, CSV export and [cost basis](docs/BOM.md) |
| Reverse-engineered materials | 38 individual reference STL types in **millimetres**, assembled STL, GLB, manifest and [CAD pack](public/models/microduck-designs.zip) |
| Structure visualization | Original MJCF-derived transforms, colours and geometry; no replacement cartoon geometry |
| RL and simulation | Published ONNX weights, CPU MuJoCo + BAM rehearsal, live telemetry and official GPU training recipe |
| DIY build | [Build guide](docs/BUILD_GUIDE.md), [electrical guide](docs/HARDWARE.md), calibration and mass worksheets |

## Check the project

```bash
uv run python -m pytest -q
uv run python -m lab.simulate --seconds 10 --vx 0.3 --log artifacts/forward.jsonl
npm run build
```

Browser checks: `npx playwright install --with-deps chromium`, then `npm run test:e2e` with the CPU service running. On a minimal Linux image, Playwright's shared-library installation may need system-package access.

The tests check all nine policy checksums and the `[1,61] → [1,14]` contract, the independent mouth slot, observation parity with upstream, a standing/forward physics rollout, and every exported part transform against MuJoCo.

For the actual Rust control service, install [Rust](https://rustup.rs/) (at least 1.89):

```bash
cd upstream/microduck
cargo build --locked -p robotd -p robotctl
cd ../..
uv run python scripts/check_runtime.py
```

That check runs **`robotd --fake --no-policy`**, queries its real JSON-RPC socket, and shuts it down. It neither opens a motor port nor proves hardware operation. This pinned runtime does not expose a `--sim` option; the web physics adapter is a separate CPU rehearsal, not the Rust daemon's hardware abstraction.

## Designs, training and provenance

Regenerate the designs with `uv run python scripts/export_models.py`. Source MJCF/STL use metres; exported reference STLs use millimetres. An assembled STL includes purchased components and overlapping bodies and should not be printed as one piece. Fit and manufacturing work are described in [MECHANICAL.md](docs/MECHANICAL.md).

Training needs a CUDA GPU. `python3 scripts/train.py --smoke` runs the 64-environment, 5-iteration check. A full run through `scripts/train.py` also runs that check first. See [TRAINING.md](docs/TRAINING.md). No new GPU training was performed in this CPU-only workspace.

The published walking policy moves forward at a 0.30 m/s command in the tested CPU setup. It can settle in place at lower forward speeds and at reverse/lateral commands. See [VALIDATION.md](docs/VALIDATION.md) for measured results and limits; the workbench does not substitute animation for a failed rollout.

[upstream.lock.json](upstream.lock.json) records four exact repository revisions and nine policy SHA-256 digests. `upstream/` is populated locally by the fetcher and ignored by this repository; the included fetch script reproduces it without overwriting different or modified checkouts. See [SOURCES.md](docs/SOURCES.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Original integration code: Apache-2.0. Original Pollen Robotics geometry and derivative CAD/images: **CC BY-NC-SA 4.0**. Community reference documentation retains its own attribution and licence.
