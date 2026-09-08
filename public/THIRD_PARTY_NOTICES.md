# Third-party notices

## Pollen Robotics Microduck

The runtime and source code in `upstream/microduck` and the reinforcement-learning code in `upstream/microduck_rl` are Apache License 2.0. Their own `LICENSE` files are authoritative.

The original Microduck 3D geometry and MJCF-derived mesh exports are distributed by the upstream projects and the derivative `fanhao375/microduck-replica` under Creative Commons Attribution-NonCommercial-ShareAlike 4.0. The geometry exports in `public/models/`, assembly images and reference CAD/print packs retain that noncommercial, share-alike restriction. Attribution: Pollen Robotics and the contributors to `fanhao375/microduck-replica`. The full text is included in [LICENSES/CC-BY-NC-SA-4.0.txt](LICENSES/CC-BY-NC-SA-4.0.txt); see also <https://creativecommons.org/licenses/by-nc-sa/4.0/>. The HAT quote ZIP is an exception: its electronics files retain their original Apache-2.0 license.

The app's original TypeScript, Python bridge, scripts, tests and original integration documentation are Apache License 2.0. Community documentation and any adaptations of it retain CC BY-NC-SA 4.0; citing factual dimensions or a supplier link does not relicense the upstream document. The browser uses [Three.js](https://github.com/mrdoob/three.js) and React under MIT licences and [Lucide](https://github.com/lucide-icons/lucide) under ISC. Dependency licences remain with their packages. The CPU bridge calls the unchanged BAM loader from the pinned Pollen Robotics inference script and uses Rhoban's [BAM](https://github.com/Rhoban/bam) at `62bd8ce12154340be97e06f7f41a0ca8f116d967`, Apache-2.0.

`public/reference/assembly-hero.png`, `exploded-side.png` and `color-map.png` are copies of community assembly drawings from `fanhao375/microduck-replica` at the locked revision, CC BY-NC-SA 4.0. Published ONNX files in `policies/` are from `pollen-robotics/microduck-policies`, whose model card declares Apache-2.0.

## Distribution map

| Material | License / attribution |
|---|---|
| Original app, bridge, scripts and tests in `src/`, `lab/`, `scripts/`, `tests/` | Apache-2.0; Microduck Replica Lab contributors |
| `policies/*.onnx` and source policy manifest | Apache-2.0; Pollen Robotics, exact revision and checksums in `upstream.lock.json` |
| STL/GLB exports, geometry-derived manifests and CSVs, design/print/fit ZIPs | CC BY-NC-SA 4.0; Pollen Robotics geometry, transformed to millimetres and packaged by this project's exporters |
| `public/reference/*.png` and `docs/images/workbench.png` | CC BY-NC-SA 4.0; Pollen Robotics geometry and community assembly drawings; the workbench screenshot is rendered by this project |
| `public/models/microduck-hat-quote.zip` | Apache-2.0; unmodified Pollen Robotics HAT production files with original license included |
| Community reverse-engineering prose, copied or adapted | CC BY-NC-SA 4.0; fanhao375/microduck-replica contributors, with source links in the applicable guide |

The `public/` document mirrors carry the same terms as their source files. See [LICENSES/Microduck-reference-attribution.md](LICENSES/Microduck-reference-attribution.md) for the retained upstream attribution statement. Original software changes, millimetre conversion, model transforms, quantity corrections and the local simulation/website integration were made by Microduck Replica Lab; they are not an official Pollen Robotics release.

This repository is a non-commercial study and personal-replication workbench. Do not sell the derivative geometry or use the project as a claim of Pollen Robotics endorsement.
