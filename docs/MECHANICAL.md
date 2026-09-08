# Mechanical reconstruction

The included `public/models/microduck.glb` is compiled from `robot_allcollisions.xml` at the pinned `microduck_rl` revision. It preserves MuJoCo world transforms and exposes one node for every visual mesh instance. `public/models/parts-mm/` contains 38 unique reference meshes exported in millimetres; `assembled-reference-mm.stl` is an inspection assembly.

## Read the model correctly

- The model has 70 visual instances, 38 unique mesh types and 15 rigid-body groups. Several instances share a mesh. 70 is not a print count.
- The print quotation worksheet has **30 reference design types / 36 modeled pieces**, including a lens holder requiring camera review. It excludes eight bought-part mesh types and counts each visual occurrence once. The community's 41-piece count also includes five collision duplicates in `robot_walk.xml`; those duplicates occupy the same poses as the physical visuals.
- MJCF source coordinates are metres. The exported reference pack is millimetres. Keep units explicit in CAD.
- Visual meshes describe envelope and inertia. They do not prove screw engagement, threads, heat-set bosses, press fits, strength or cable clearance.
- The all-collision model is a visualization and contact reference. Do not treat collision faces as a production drawing.

The body order is torso; left hip yaw/roll, left upper leg, lower leg and ankle/foot; neck and head; then the mirrored right-leg chain. The policy joint order is in [hardware/calibration.csv](../hardware/calibration.csv) and is a protocol contract.

## Trial-fit checklist

1. Print one motor support and one bearing seat at the chosen layer height and material.
2. Verify the purchased XL330 body, connector and screw head clearances.
3. Check M2 screw diameter, length, thread engagement and insert pull-out on the actual printed process.
4. Move the joint through its complete MJCF range with no motor powered. Check hard stops, collisions and cable bend radius.
5. Weigh the test part and record the material, infill, orientation and measured dimensions. Compare complete rigid-body assemblies with [hardware/mass-properties.csv](../hardware/mass-properties.csv); its reference centres of mass use each body's local MJCF frame.
6. Repeat the check with the electronics, battery holder and shell installed. The head and battery shift centre of mass.
7. Only after a joint passes should you duplicate it for the mirrored side.

## Reference exports

```bash
uv run python scripts/export_models.py
```

The exporter also writes `public/models/manifest.json`, `parts.csv` and `microduck-designs.zip`. It requires the pinned source checkout. Regenerate after changing the MJCF; never mix a new XML with an old CAD manifest.

For outsourced prints, run `python3 scripts/export_procurement.py` after exporting geometry. It writes a full quotation ZIP, a four-piece fit-test ZIP and [print-order.csv](../hardware/print-order.csv). See the [US shopping guide](PROCUREMENT_US.md) and [print-service brief](PRINT_SERVICE_BRIEF.md). These packages prepare a service quote and physical fit checks; they do not establish manufacturing approval.

## Material plan

Use a rigid, dimensionally stable material for motor brackets and load paths. Use a compliant, replaceable material for soles and soft beak surfaces. Select material, layer height and infill from measured joint loads and test coupons. The files contain no validated material recipe.

## Sources

The derivative assembly and print organization are based on [fanhao375/microduck-replica](https://github.com/fanhao375/microduck-replica). Its licence and attribution are in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). The original upstream mesh and MJCF source is Pollen Robotics' `microduck_rl`.
