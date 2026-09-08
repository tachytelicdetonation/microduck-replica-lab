# Pinned sources

`upstream.lock.json` is the machine-readable source lock. `python3 scripts/fetch_upstream.py` retrieves these exact revisions without overwriting modified directories:

| Source | Revision | Use |
|---|---|---|
| [pollen-robotics/microduck_rl](https://github.com/pollen-robotics/microduck_rl) | `2b25a48b08f1f17bc38c90bb03144c81fbd9ed07` | MJCF, tasks, PPO, exporter and CPU inference |
| [pollen-robotics/microduck](https://github.com/pollen-robotics/microduck) | `5984efb770855432b03dafd3d879e9929981e45b` | Rust runtime and service architecture |
| [fanhao375/microduck-replica](https://github.com/fanhao375/microduck-replica) | `73e2118dc0b5bf463ab7d422e5274c29adfd9ea7` | Reverse-engineered CAD organization, BOM and assembly references |
| [pollen-robotics/elec_RPI_Robot_HAT](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) | `23eab11927f95ceca0dfa35bf182caeb7db39ea0` | Official KiCad, Gerbers, BOM, placement and STEP |
| [microduck-policies](https://huggingface.co/pollen-robotics/microduck-policies) | `088524a64e2557dc453256b6071dbb9d23888802` | Published ONNX policies and schema-2 manifest |

The X posts are linked in the app sidebar. Articles are used as context for this build's scope; the source repositories are the authority for code and model interfaces.
