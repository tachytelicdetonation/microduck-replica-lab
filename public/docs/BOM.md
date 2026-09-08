# Parts and cost basis

US product links, small hardware, bench tools, custom-board services and outsourced printing: [PROCUREMENT_US.md](PROCUREMENT_US.md). The $689.75 worksheet below excludes the cost of paying a print service and acquiring tools; use actual supplier quotes for an all-in budget.

The web Parts page is an editable worksheet. Its default core estimate is a planning model, not a quote. It intentionally separates the published community range from a new, auditable allowance:

| Category | Basis |
|---|---|
| 15 XL330 servos | `$27.49 × 15 = $412` US allowance from the community BOM; the international figure is about $359, while EU figures are €603–629 including VAT. |
| Radxa Zero 3W | `$45` planning allowance; select the RAM/eMMC SKU yourself. |
| RPI Robot HAT | `$60` small-batch PCBA allowance; production files are in `upstream/robot-hat/`. |
| IMU bridge | `$50` allowance for an unvalidated board and assembly; firmware is an open physical gap. |
| Battery / protection | `$45` allowance for an NP-F550-class pack, holder, regulation, fuse and switch. |
| Bearings | `$1.60 × 14`; verify every seat and supplier size. |
| Fasteners / wiring | `$25` project allowance; determine lengths and connectors during trial assembly. |
| Printed structure | `$30` material allowance; excludes printer and labour. |

The default worksheet core total is **$689.75**, plus **$55.00** for the optional camera, ToF sensor and speaker. The total is computed from its item rows.

The community articles quote an individual build at roughly `$450–580`. Your actual amount can exceed that through shipping, VAT, PCBA minimums, safety equipment, tools and failed prototypes. The HAT, power rail and IMU bridge are not solved by a low servo price.

## Electrical warnings

The upstream simulation uses a 7.4 V nominal BAM model, while the ROBOTIS XL330-M288 datasheet lists 3.7–6.0 V. A charged 2S lithium pack can reach 8.4 V. Confirm the purchased servo variant and design a protected rail before connection. The simulated voltage is not an electrical approval.

The source mesh called `np_f970` is documented by the community reconstruction as an NP-F550-sized envelope. Verify the pack and contacts; do not order an F970 because of the mesh filename alone.
