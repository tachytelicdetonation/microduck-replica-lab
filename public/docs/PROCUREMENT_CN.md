# China sourcing for delivery to the United States

Keep using the [US shopping and assembly guide](PROCUREMENT_US.md). This companion adds China options, supplier links, printing services and a way to compare the full delivered cost. **The strongest potential saving is bearings. Genuine servos have no verified China price advantage; printing and PCB assembly need quotes.** The existing US shopping list, budget defaults and fabrication packs are retained.

Research date: **2026-09-08**. USD conversions use **¥6.711 per $1**, the [Frankfurter reference rate dated 2026-09-07](https://api.frankfurter.dev/v1/2026-09-07?base=USD&symbols=CNY). The [ECB daily publication](https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml) shows CNY 7.7995 and USD 1.1622 per euro, consistent with that rounded cross-rate. This is a reference rate, not your card or agent's exchange rate.

**Evidence labels:** “Checked page” means the stated information was visible on a supplier page on September 8; it does not guarantee stock or checkout price. “Community snapshot” means the pinned reference notes report a September 4 price that has not been independently confirmed. Taobao/Tmall returned empty script pages during the checks, and AliExpress did not expose a usable price. “Quote required” means no robot-specific price is available. No files were uploaded, quotes submitted or purchases made.

## Where China could save money

| Purchase | China goods price | Existing US guide comparison | Recommendation |
|---|---:|---:|---|
| 11 large + 3 small bearings | Community snapshot: **¥39.20–70 / $5.84–10.43** | **$339.84** purchased basket | Best candidate for substantial savings. Different brands/closures; sample-test before using. The US basket includes seven spare small bearings. |
| 15 genuine XL330-M288-T servos | Community general estimate: about **¥299 each**, ¥4,485 total / **$668.31**; no matched China quote | Checked ROBOTIS US: **$27.49 each / $412.35** | Retain US route unless a genuine quantity-15 delivered quote beats it. Cheap Feetech servos require a redesign. |
| Radxa ZERO 3W, 2 GB / 16 GB eMMC | Checked ALLNET China: **$32.90**, no-header SKU sold out; header version $33.90 also sold out | The same ALLNET source is already in the US list | No additional saving from relabeling the same supplier as China. Check available authorized SKUs. |
| 600-piece screw assortment | Community snapshot **¥23–26.80 / $3.43–3.99 per box** | US guide supplies quantities and catalogue links, no priced basket | Worth checking during consolidation. Head types and quantity per length may be wrong; no quantified savings claim. |
| Generic IMX219 camera, optional | Community snapshot **¥32.80 / $4.89** | Radxa camera checked **$15.99** | At most $11.10 goods-price difference before FPC/freight. Board, lens, cable and driver fit need verification. |
| VL53L8CX, optional | Community snapshot **¥70–78.50 / $10.43–11.70** | SparkFun VL53L5CX checked **$32.50** | Different sensor/module, with module-versus-bare-chip uncertainty. No like-for-like saving established. |
| Prints and assembled HAT | **Quote required** from domestic JLC, JLC3DP/JLCPCB or PCBWay | US print services also need a quote; JLCPCB/PCBWay already appear in US guide | Compare the same files, materials, batch quantities and delivered terms. |
| NP-F550 battery and charger | No current compatible battery/export quote verified | US battery $25–60 and charger $15–40 are allowances | Prefer US sourcing unless lithium shipping and discharge-current suitability are confirmed. |

The US bearing baseline is one available supplier route, not the lowest possible US price. It uses [11 EZO ET2216 bearings at $26.35](https://www.123bearing.com/bearing-housing/deep-groove-bearing/single-row/et2216-ezo) plus a [VXB 10-pack at displayed $49.99](https://vxb.com/products/10x15x3-open-bearing-pack-of-10). The VXB page has a conflicting price field; confirm the cart. Comparing generic China bearings with EZO does not establish equivalent quality or a universal China-versus-US discount.

The [ROBOTIS international product page](https://en.robotis.com/shop_en/item.php?it_id=902-0163-000) does show genuine XL330-M288-T at **$23.90**, or **$358.50 for fifteen**, with Korea stated as origin; its [XL-series catalogue](https://en.robotis.com/shop_en/list.php?ca_id=202030) shows a **40-day lead time**. This is an additional international option, not a verified China discount. The goods-price advantage is only **$53.85 / 13.1%** over ROBOTIS US, before delivery/import differences. Its shipping terms specify DHL from Korea and exclude destination tax/customs charges. Confirm destination eligibility and delivery cost; shipping via China adds a freight leg and does not change origin. ROBOTIS's own region selector links to the [China Taobao store](https://shop292418244.taobao.com/index.htm), but no usable product prices were exposed there during this check.

## Bearing savings after delivery charges

The two community leads imply:

- Two sellers: 11 × ¥2.20 + 3 × ¥5 = **¥39.20**, approximately **$5.84**.
- One seller, if both exact SKUs are ¥5 each: 14 × ¥5 = **¥70**, approximately **$10.43**.
- Including seven spare small bearings to match the US purchase quantities: **¥74.20–105**, approximately **$11.06–15.65**.

These calculations assume per-bearing prices and no extra order minimum. Confirm both before paying. For the 14-piece basket, the remaining budget for all China domestic freight, agent/payment fees, international shipping, insurance, duty/tax and handling is **$334.00–329.41** before matching the $339.84 US goods baseline.

As an explicit planning choice, a **20% saving target** permits at most **$266.03–261.44** in those additional charges. This is a break-even calculation, not a freight quote. For example, if all additional charges were $50, the basket would be $55.84–60.43 delivered, a potential $284.00–279.41 saving against that baseline. The $50 is illustrative. Replace the US baseline with an actual US delivered quote and the China inputs with actual quotes in the Parts & costs calculator.

## China shopping links

Quantities are for one robot unless described as starter stock or alternatives. All dimensions below are **inner diameter × outer diameter × width**, in millimetres. MOQ means minimum order quantity. A blank or unknown MOQ is not confirmation that a seller accepts one piece.

| Qty / order unit | Item and Chinese search terms | China supplier link | Price evidence | Fit and order checks |
|---|---|---|---|---|
| 11 installed; sample 1–2 first | Bearing 16 × 22 × 4; 薄壁轴承 ET2216ZZ MR16224 SET2216 | [NBZH 永天轴承 / 539024647147](https://item.taobao.com/item.htm?id=539024647147) | Community snapshot ¥2.20 each; MOQ unknown | Confirm exact size, steel, shields, clearance and lubricant. No EZO equivalence or authenticity established. |
| 3 installed; optional 7 spares | Bearing 10 × 15 × 3; 微型轴承 10x15x3 | [鑫燚轴承 / 670727787832](https://item.taobao.com/item.htm?id=670727787832) | Community snapshot ¥5 each; MOQ unknown | Listing reportedly also has 16 × 22 × 4. Select sizes separately; do not assume the headline price applies to both. NSK wording in the source is not proof of genuine NSK. |
| 1 starter assortment, only if correct SKU | M2/M2.5 screws and nuts; M2 内六角圆柱头 螺丝 螺母 | [广州信邦 600-piece box](https://item.taobao.com/item.htm?id=842110292995) · [alternate 600-piece box](https://item.taobao.com/item.htm?id=842400332284) | Community snapshots ¥26.80 / ¥23 per box | Listings describe countersunk/flat heads. They are leads for selection, not a complete matching screw kit. Verify M2×4/6/8/12 and M2.5×6 socket-head quantities against the US starter list. |
| 0 initially; 1 pack only with redesigned pockets | M2 heat-set inserts; M2 热熔铜螺母 | [400-piece M2/M3 pack](https://item.taobao.com/item.htm?id=1000673642588) | Community snapshot ¥22 per pack | Source holes have no validated insert pockets. Select insert dimensions before redesigning; do not force inserts into the meshes. |
| 1 set if using inserts | Insert tool; 热熔螺母 压头 M2 | [936/T12/T65 candidate tip set](https://item.taobao.com/item.htm?id=902798112263) | Community snapshot ¥13 per set | Match the selected iron and insert, not just the product title. |
| 1 bottle if specified | Removable threadlocker; 乐泰243 螺纹锁固剂 | [Tmall listing 653848839737](https://detail.tmall.com/item.htm?id=653848839737) | Community snapshot ¥19.11; bottle/SKU unverified | Verify manufacturer traceability and shelf life. Use only at permitted metal joints; protect plastics. Can remain a US purchase. |
| 15; buy 1 first | Genuine DYNAMIXEL XL330-M288-T; 原装 XL330-M288-T | [ROBOTIS-linked China store](https://shop292418244.taobao.com/index.htm) · [AliExpress product lead](https://www.aliexpress.com/item/1005004403336577.html) · [ROBOTIS US](https://www.robotis.us/dynamixel-xl330-m288-t/) · [international product](https://en.robotis.com/shop_en/item.php?it_id=902-0163-000) | China price/MOQ/stock unverified; US checked $27.49, international checked $23.90 with 40-day catalogue lead | Obtain a genuine-M288-T quote for 1 and 15. General community ¥299 is not verified for either China link. AliExpress authenticity unverified. No servo swap assumed. |
| 1 | Radxa ZERO 3W 2 GB / 16 GB eMMC; 瑞莎 ZERO 3W | [ALLNET China](https://shop.allnetchina.cn/products/copy-of-radxa-zero-3w) · [authorized distributor list](https://radxa.com/distributors/) | Checked page $32.90 no-header / $33.90 header, both sold out | Avoid overpriced Taobao bundles or larger RK3566 boards that do not fit. Confirm RAM/eMMC, wireless/OS revision and actual HAT stacking height. |
| 1 optional; choose one camera | Radxa Camera 8M 219 for ZERO 3W/3E | [Arace export listing](https://arace.tech/products/radxa-camera-8m-219) | Checked page $15.99, in stock; default Zero 3W/3E FPC | More directly supported host connection than generic camera. Enclosure/lens fit is still unvalidated. Already linked in US guide. |
| 1 optional alternative | IMX219 camera; IMX219 摄像头 树莓派 | [DECXIN Tmall](https://detail.tmall.com/item.htm?id=775872575316) · [Taobao alternative](https://item.taobao.com/item.htm?id=771618094322) | Community snapshot ¥32.80; selected SKU unknown | Check board outline, lens position, driver, CSI pinout and optical fit; not automatically the source camera. |
| 1 only if camera needs it | CSI FPC; 15P 1.0 转 22P 0.5 排线 | [4 cm candidate](https://item.taobao.com/item.htm?id=654755002992) · [explicit 15 cm pitch listing](https://item.taobao.com/item.htm?id=678057486394) | Community snapshots ¥1.88 / ¥2.50 | Confirm pin count, pitch, contact side and routing. Do not add a redundant FPC if included with the camera. |
| 1 optional | VL53L8CX module; VL53L8CX 模块 8x8 | [¥70 source lead](https://item.taobao.com/item.htm?id=1025775539663) · [¥78.50 source lead](https://item.taobao.com/item.htm?id=967946231167) | Community snapshots; exact SKU/module status unknown | Require populated module, documentation, voltage, pull-ups, interface/cable and sensor marking. A bare IC or L0X/L7CX listing does not meet the same requirement. |
| 1 candidate; choose one plate | NP-F holder; NP-F 电池仓 取电座 | [holder](https://detail.tmall.com/item.htm?id=658975825526) · [Type-C plate alternative](https://detail.tmall.com/item.htm?id=926961598924) | Community snapshots ¥17.80 / ¥19 | Mounting, contact current and power path unvalidated. Type-C is not proof of appropriate servo regulation or battery charging. |
| 1 battery and 1 external charger | NP-F550 7.4 V; 唯卓仕 NP-F550 | [existing US battery and charger choices](PROCUREMENT_US.md) | No verified China SKU; source ¥52.80 battery was a first-order promotion without an exact link | Do not budget the promotion. Source envelope is 38.6 × 20.6 × 70.8 mm, despite the misleading np_f970 mesh name. Confirm discharge current and protected shipping route. |
| 1 each after design review | 5 V servo regulator, fuse/switch, rated wire and connectors | [Pololu regulator candidate](https://www.pololu.com/product/2881) · [existing power/harness choices](PROCUREMENT_US.md) | No reviewed China replacement or landed quote | Retain existing candidates. A generic “15 A buck” title does not prove fit, thermal/current performance or dropout. |
| 0 extra initially | X3P cables; DYNAMIXEL X3P 180mm | [genuine ROBOTIS 10-pack](https://www.robotis.us/robot-cable-x3p-180mm-10pcs/) | Checked US $21.85 per pack; China saving unverified | Each retail servo already includes one 180 mm cable plus tapping screws. Buy extra lengths only after routing. |
| 1 bench tool | ROBOTIS U2D2 | [genuine U2D2](https://www.robotis.us/u2d2/) | Checked US $36.92; China saving unverified | Retain known protocol/interface compatibility. A cheap ST/SC USB adapter is not an established replacement. |

Speaker, Qwiic/JST-SH cable, SWD programmer, headers, standoffs, tools and consumables remain in the [complete US guide](PROCUREMENT_US.md) and [US CSV](../hardware/procurement-us.csv). No material China saving or exact compatible SKU was verified for them. Ask a domestic electronics assembler to include these in a reviewed harness/assembly quote when appropriate; avoid ordering parts twice when PCBA already includes them.

### Cheap listings that are not established replacements

The [Feetech 5264 cable lead](https://item.taobao.com/item.htm?id=616460581906) was reported at ¥1.80, and [FE-URT1](https://item.taobao.com/item.htm?id=603181554943) at ¥45. These are excluded from the shopping basket. **5264 is not JST-EH/X3P**, even if the nominal pitch looks similar. FE-URT1/ST/SC adapters need electrical and DYNAMIXEL protocol verification before any proposed replacement; a source price does not establish compatibility.

STS3215, STS3032, SCS0009 and Unitree alternatives also need mechanical, protocol, actuator-model and policy work. Their lower prices are not counted as savings on the existing Microduck design. The required actuator suffix M288-T is inferred from the public series/model evidence; buy one genuine unit and verify a joint before buying fifteen.

## China 3D printing without owning a printer

| Service | Link | Checked capability / order basis | What to compare |
|---|---|---|---|
| 嘉立创3D domestic China | [jlc-3dp.cn](https://www.jlc-3dp.cn/) | Checked page lists PA12 MJF, nylon SLS and TPU FDM; model-specific quote and minimum charge unknown | Use a domestic address/forwarder only if you have that arrangement. Account/payment/export support must be confirmed. |
| JLC3DP export-facing | [JLC3DP](https://jlc3dp.com/) · [shipping calculator](https://jlc3dp.com/shipping) | Checked PA12-HP MJF page: from $1, 72-hour build, ±0.3 mm within 100 mm, 1 mm wall; [TPU FDM](https://jlc3dp.com/help/article/tpu): from $3, 95A, nominal 15% infill | “From” prices do not quote 36 pieces. Obtain packed weight, freight, actual dispatch/delivery and import terms; build time excludes delivery. |
| PCBWay export-facing | [3D printing](https://www.pcbway.com/rapid-prototyping/3d-printing/) | Checked page lists PA12 SLS/MJF, PETG FDM and TPU options; quote required | Compare identical materials, quantity per STL, finishing, fit work and US delivered total. |
| Existing US-oriented alternatives | [Craftcloud](https://craftcloud3d.com/) · [Xometry](https://www.xometry.com/capabilities/3d-printing-service/) | Existing alternatives; no matching quote obtained | Include local reprint/support and freight costs when judging the saving. |

Send the [four-part fit-check ZIP](../public/models/microduck-fit-check.zip) first: one each yaw2roll, bearing_roll, leg and motor_support. After adjusting fits, quote the [full print pack](../public/models/microduck-print-quote.zip) using [print-order.csv](../hardware/print-order.csv) and the [print-service brief](PRINT_SERVICE_BRIEF.md). Extract and upload the individual STLs if the service does not accept ZIP. Units are millimetres. You do not need filament or a printer.

The full reference pack is **30 design types / 36 visual pieces**, not the community's 41-piece count, which includes five collision duplicates. There are four soft parts; separate their TPU quote from rigid material. Rigid PA12 MJF/SLS and TPU around 95A are trial choices, not validated final material specifications. PETG fit prototypes can be quoted where offered. Lens-holder procurement depends on the camera decision, and thin reinforcement plates need process/strength review.

JLC3DP's [TPU page](https://jlc3dp.com/help/article/tpu) states a **30 × 30 × 15 mm minimum build size** and **1.2 mm minimum wall** (1.6 mm recommended). Small/thin soft pieces may need a supplier-approved combined build or another process/service. Its advertised default infill is not an approved Microduck specification. Standard ±0.3 mm printing tolerance also does not guarantee bearing-seat fit. Record dimensions/mass, inspect a sample joint and have the shop quote any approved finishing.

## China PCB fabrication and assembly

| Service / item | Link | Price / minimum evidence | Request |
|---|---|---|---|
| 嘉立创 domestic PCB + SMT | [PCB](https://www.jlc.com/) · [SMT](https://www.jlc-smt.com/) | Checked main site advertises FR-4 from ¥20 / five boards and SMT from ¥50; HAT eligibility and actual minimum assembly count unverified | Quote one populated HAT, listing the payable bare-board batch, assembly count, setup, components and shipping separately. |
| JLCPCB international PCBA | [PCB assembly](https://jlcpcb.com/pcb-assembly) | Checked page advertises $8 setup + $0.0016 per solder joint starting charges; exact minimum/batch price requires the files | Use the official HAT files. Include components, extended-part/setup charges, top/bottom work and through-hole connectors. |
| PCBWay PCBA | [PCB assembly](https://www.pcbway.com/pcb-assembly.html) | Service checked; no HAT-specific price or applicable MOQ verified | Obtain the same BOM, finish and delivery basis as JLC for comparison. |
| Custom ID-200 IMU bridge | [pinned reference design notes](https://github.com/fanhao375/microduck-replica/tree/73e2118dc0b5bf463ab7d422e5274c29adfd9ea7/hardware/imu_to_dxl) · [LCSC component sourcing](https://www.lcsc.com/) | No validated assembled SKU or firmware; source blank-PCB allowance excludes components and assembly | An engineer must release the design and firmware before a production order. Quote that work separately. |

Use the [unchanged HAT quote pack](../public/models/microduck-hat-quote.zip): official Gerbers/drill, BOM, placement, PDFs and STEP reference. Specify **four layers, 1.0 mm thickness, about 65.0 × 30.9 mm**. The assembler must reconcile orientation, DNP items, BOM/placement mapping and connector work before manufacture. A cheap bare PCB is not an assembled HAT, and an assembled HAT does not supply the missing IMU bridge firmware.

The stock XL330 rating is **3.7–6.0 V**. The reviewed design still needs a regulated servo supply near 5 V: raw NP-F voltage and the source simulation's 7.4 V parameter are not authorization to overvolt physical servos. HAT battery and motor power share a raw supply net; its host buck cannot supply fifteen servos. Include power-path review, fuse/wire/connector selection and current testing in the builder's work.

## Getting the order from China to your US address

1. Confirm the exact selected SKU, count per pack, minimum order, stock and current CNY price. “包邮” usually describes domestic delivery; “起” means “from,” and “首单” is a first-order promotion. Do not treat any of them as a US delivered price.
2. For Taobao/1688-style domestic purchasing, use your existing China contact or a forwarder that accepts the goods. Ask for seller-to-warehouse freight, consolidation/inspection photos, packed weight and dimensions, insurance, agent fees and the exchange rate. No specific forwarding service was validated here.
3. Obtain both export-direct and domestic-plus-forwarder quotes for prints/PCBA. Request quantities separately for a fit batch and the full set. Do not amortize a five-board batch across hypothetical future robots; one robot pays for the complete mandatory batch.
4. Request written **DDP** terms (seller arranges import and pays duty) or **DAP** terms (buyer handles import charges), and confirm what is included. Add duty, brokerage/handling and any applicable tax once; avoid double-counting charges already included in DDP.
5. The [CBP e-commerce FAQ](https://www.cbp.gov/trade/basic-import-export/e-commerce/faqs), checked September 8 and last modified September 2, states that the de minimis exemption is suspended for goods from all countries/modes unless an exception applies. **Do not assume an under-$800 order enters duty-free.** Use the carrier/broker's actual classification, country-of-origin and entry-date charges. This guide does not assume one blanket China tariff percentage.
6. Ship NP-F batteries only on a confirmed lithium route with the seller/carrier's required transport documents, including applicable UN38.3 test-summary information. Keep a US battery/charger order as the practical baseline; a low battery goods price alone does not establish savings.
7. Receive and inspect samples: measure bearing ID/OD/width and play, confirm authentic actuator model/communication, check connector polarity, inspect prints and weigh the parts. Record results in [assembly-fit.csv](../hardware/assembly-fit.csv) and [harness.csv](../hardware/harness.csv). Order the full quantities after the relevant checks.

## Quote request to copy for a Chinese supplier

Please quote the exact selected items and quantities for one Microduck prototype. State current unit price, quantity per pack, MOQ, stock/lead time, domestic freight, packed weight/size and delivery to a United States address. For fabrication, follow the attached per-file quantity sheet, state material/process/tolerance, identify any unmanufacturable features and separate setup, parts, assembly/finishing and shipping. Quote both the fit-check batch and full set. Do not substitute servos, connectors, bearing dimensions or electronics without a reviewed revised specification. State DDP or DAP and all charges included. No manufacturing should start from an estimate alone.

请按所选型号及数量报价，用于一台 Microduck 样机。请注明现价、每包数量、最低起订量、库存及交期、国内运费、包装重量和尺寸，以及发往美国的运费。加工件请按附件逐文件数量表报价，注明材料、工艺、公差及不能加工的特征，分别列出打样费、零件费、贴片或后处理费。请分别报价配合测试小批次及整套。未经确认请勿替换舵机、连接器、轴承尺寸或电子元件。请注明 DDP 或 DAP 及包含的税费。报价不代表授权生产。

Use the existing [print-service brief](PRINT_SERVICE_BRIEF.md) for geometry details and the [US guide](PROCUREMENT_US.md) for assembly tools. Print/PCB services normally fabricate parts; a separate robotics/electronics builder must handle the IMU firmware, power harness, fit decisions and calibration. There is still no tested order-and-assemble kit.

## Evidence and downloads

- [China comparison CSV](../hardware/procurement-cn.csv) includes evidence status, pack/minimum notes and blank order/landed-cost fields.
- [Pinned Chinese mechanical procurement notes](https://github.com/fanhao375/microduck-replica/blob/73e2118dc0b5bf463ab7d422e5274c29adfd9ea7/docs/机械采购清单.md), [electronics procurement notes](https://github.com/fanhao375/microduck-replica/blob/73e2118dc0b5bf463ab7d422e5274c29adfd9ea7/docs/电控采购清单.md) and [actuator-selection notes](https://github.com/fanhao375/microduck-replica/blob/73e2118dc0b5bf463ab7d422e5274c29adfd9ea7/docs/执行器选型.md) provide the September 4 community leads. These notes mark prices and links unverified and contain manufacturing/electrical suggestions that require review.
- [Source-check register](../hardware/procurement-cn-sources.json) records checked pages, inaccessible price data, FX and the pinned community revision. Retained US product prices are the baseline researched on September 8, not newly guaranteed checkout quotes.
