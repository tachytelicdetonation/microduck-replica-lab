# Contributing

Thank you for helping make this Microduck study reproducible. Open an issue first for a substantial change so its source, license and hardware assumptions can be reviewed.

## Before a pull request

Install the pinned environments, then run the checks relevant to your change:

```bash
uv sync --locked
npm ci
uv run python -m pytest -q
npm run build
```

For browser changes, run `npm run test:e2e` with the CPU service running. For model or source changes, run the appropriate exporter and report the exact upstream revision. Do not run a full GPU training job as part of a pull request unless the experiment is explicitly requested; a smoke check and reproducible command are usually sufficient.

## Changes to hardware and procurement

Keep quantities tied to the source model and label estimates, checked pages, community snapshots and supplier quotes separately. Never present a marketplace listing as a verified equivalent actuator, connector, bearing or battery. Do not upload files, contact a supplier or place an order from a pull request.

## Licensing

Code authored in this repository is Apache-2.0. Upstream Pollen Robotics geometry and derivative CAD/images are CC BY-NC-SA 4.0 and must remain noncommercial, attributed and share-alike. Preserve [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the notices of any upstream material you modify. A contribution that mixes code and geometry should identify which license applies to each file.

Use clear commit messages, keep generated files synchronized, and include test output or a concise explanation when a check cannot run.
