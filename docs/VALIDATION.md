# Validation record

This is the evidence produced in the current workspace on 2026-09-08. It separates reproducible software checks from physical claims.

| Check | Result | Evidence |
|---|---|---|
| Python regression suite | PASS — 5 tests | `uv run python -m pytest -q`; policy contracts, mouth mapping, observations, real rollout and mesh transforms |
| Browser integration suite | PASS — 5 tests | `npm run test:e2e`; assembly/downloads, BOM/CSV/persistence, checklist, mobile layout, live physics controls |
| TypeScript / Vite production build | PASS | `npm run build`; built output in `dist/` |
| 70-part geometry export | PASS | `scripts/export_models.py`; `public/models/manifest.json` |
| All 38 unique meshes | PASS | `public/models/parts-mm/` and manifest |
| CAD pack and mass worksheet | PASS | ZIP integrity checked, 49 files; all 15 reference body masses and centres agree with MJCF; physical measurement fields remain blank |
| US procurement exports | PASS | 55 purchasing checklist rows; 30 reference print types / 36 visual occurrences; four-part fit pack; ZIP integrity and STL bytes/units checked against source; HAT production files copied unchanged |
| Readable US shopping guide | PASS | All local guide/CSV/ZIP links respond; six supplier tables; desktop and 390 px layouts checked without document overflow or page errors; full browser suite passes after UI addition |
| China procurement addendum | PASS | 25 checklist rows; 19 public source checks plus 7 unavailable price checks; community prices labeled unverified; required bearing quantities and FX arithmetic checked |
| China delivered-cost calculator and retained budget | PASS — 3 relevant browser tests | China calculator covers pending charges, savings, losses and invalid exchange rate; existing budget/CSV/persistence and mobile checks pass. CPU/robot-runtime suites were not repeated for this procurement addition |
| China and US document navigation | PASS | 34 local link checks return HTTP 200; China/US document layouts at 390 px and Parts with expanded calculator at 390/768/1024/1440 px have no document overflow or page errors; artifacts/china-browser-audit.json |
| Existing US resources preserved | PASS | SHA-256 unchanged for docs/PROCUREMENT_US.md, hardware/procurement-us.csv and all three full-print/fit-check/HAT quote ZIPs; no model regeneration |
| Policy hashes / `[1,61] → [1,14]` | PASS | `uv run python -m pytest -q` |
| Upstream observation parity | PASS | `tests/test_robot.py` |
| 20 s standing CPU rollout | PASS | `docs/validation-results.json` |
| ONNX file overrides | PASS for supplied policies | Custom-path flags load walk, stand and sit/stand files; finite 0.2 s CLI smoke run in `artifacts/custom-policy-summary.json` |
| Forward 0.30 m/s command | PASS in tested CPU setup | `tests/test_robot.py`; 20 s: x +1.782 m, y −0.862 m, final tilt 3.01°; see validation-results.json |
| Lower forward, reverse, lateral commands | **Not cleared** | Several tested commands settled in place in this setup |
| Rust robotd fake health | PASS | `scripts/check_runtime.py`; `artifacts/runtime-health.json` |
| Fresh GPU training | **Not run** | No CUDA GPU in this workspace; smoke-first training wrapper and official export instructions provided |
| Real servo bus, IMU, power or gait | **Not tested** | Requires a physical build and staged bring-up |

The CPU forward result is a behaviour observation, not a promise about your hardware. The local test uses the official BAM M6 actuator and scene. It deliberately does not mark the physical robot as assembled or safe.

The browser suite ran with Chromium and software WebGL. The production build reports Vite's size warning for the Three.js-containing JavaScript chunk (about 862 kB minified / 236 kB gzip); it completes successfully. Runtime health is from the actual compiled Rust daemon with fake I/O, not from the Python web bridge.

## Recorded 20-second rollouts

[validation-results.json](validation-results.json) contains the exact source lock and per-case results. All six cases remained finite. Standing ended at 116.21 mm trunk height, 0.32° tilt and 3.1 mm horizontal displacement. Forward 0.30 m/s moved about 1.98 m horizontally with lateral drift; this is locomotion, not accurate speed or heading tracking. Forward 0.15, reverse −0.30 and lateral 0.20 produced less than 10 mm horizontal displacement. A 1.0 rad/s turn command remained upright, but this record does not establish yaw tracking.

Reproduce with `uv run python scripts/record_validation.py`. Nominal BAM voltage is a simulation parameter and does not establish a safe physical servo rail. No fresh CUDA training or physical build was performed.
