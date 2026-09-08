# Third-party notices

## Pollen Robotics Microduck

The runtime and source code in `upstream/microduck` and the reinforcement-learning code in `upstream/microduck_rl` are Apache License 2.0. Their own `LICENSE` files are authoritative.

The original Microduck 3D geometry and MJCF-derived mesh exports are distributed by the upstream projects and the derivative `fanhao375/microduck-replica` under Creative Commons Attribution-NonCommercial-ShareAlike 4.0. The local exports in `public/models/`, assembly images and the reference CAD pack retain that non-commercial, share-alike restriction. Attribution: Pollen Robotics and the contributors to `fanhao375/microduck-replica`. Full text: <https://creativecommons.org/licenses/by-nc-sa/4.0/>.

The app's original TypeScript, Python bridge and documentation are Apache License 2.0. The browser uses [Three.js](https://github.com/mrdoob/three.js) and React under MIT licences and [Lucide](https://github.com/lucide-icons/lucide) under ISC. Dependency licences remain with their packages. The CPU bridge calls the unchanged BAM loader from the pinned Pollen Robotics inference script and uses Rhoban's [BAM](https://github.com/Rhoban/bam) at `62bd8ce12154340be97e06f7f41a0ca8f116d967`, Apache-2.0.

`public/reference/assembly-hero.png`, `exploded-side.png` and `color-map.png` are copies of community assembly drawings from `fanhao375/microduck-replica` at the locked revision, CC BY-NC-SA 4.0. Published ONNX files in `policies/` are from `pollen-robotics/microduck-policies`, whose model card declares Apache-2.0.

This repository is a non-commercial study and personal-replication workbench. Do not sell the derivative geometry or use the project as a claim of Pollen Robotics endorsement.
