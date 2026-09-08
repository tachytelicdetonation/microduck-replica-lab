# US shopping, printing, and assembly list

This is a US-oriented purchasing worksheet for the pinned Microduck reference in this project, researched on **2026-09-08**. Product prices explicitly marked “checked page” were read from the supplier. Other dollar ranges are **planning allowances set for this guide**, not supplier quotes. Search/catalogue links require you to select a product; Amazon, McMaster, Digi-Key/Mouser and B&H inventory was not verified. International suppliers are included where a US source was unavailable; enter your US ZIP code to price delivery and imports.

There is no complete, tested “order everything and assemble” kit in the public files. The remaining obstacles are the IMU bridge and firmware, the battery/power harness, and manufacturing fit. A print shop makes parts; a PCB assembler populates boards. Neither service normally finishes the robot's electronics design, firmware or calibration. Ask a robotics/electronics builder to take those tasks if you want assembly help.

## Buy the walking core first

Buy one servo and make one supported joint before ordering all fifteen. The servo suffix is inferred from the public model: use **DYNAMIXEL XL330-M288-T** and do not substitute an XL330-M077, XC330, hobby servo, or Feetech unit without changing the model, calibration, and policy.

| Qty | Item to order | US source | Planning price | Check before ordering |
|---:|---|---|---:|---|
| 15 | ROBOTIS DYNAMIXEL **XL330-M288-T** | [ROBOTIS US product page](https://www.robotis.us/dynamixel-xl330-m288-t/) · [specification](https://emanual.robotis.com/docs/en/dxl/x/xl330-m288/) | $27.49 each on the checked page | 3.7–6.0 V rating, M288-T suffix, X3P cable and included screws. Buy one first. |
| 1 | Radxa **ZERO 3W**, preferably 2 GB / 16 GB eMMC | [ALLNET listing](https://shop.allnetchina.cn/products/copy-of-radxa-zero-3w) · [Radxa distributor list](https://radxa.com/distributors/) | $32.90 listed for 2 GB / 16 GB | Select the Zero 3W form factor and the actual RAM/eMMC SKU. The checked listing had some variants sold out; use the distributor list if unavailable. |
| 1 | RPI Robot HAT, fabricated from the official files | [official KiCad/Gerber repository](https://github.com/pollen-robotics/elec_RPI_Robot_HAT) · [JLCPCB assembly](https://jlcpcb.com/pcb-assembly) · [PCBWay assembly](https://www.pcbway.com/pcb-assembly.html) | Quote required | Upload the `production/` Gerber, BOM and pick-and-place files. It is not the Raspberry Pi HAT mesh; it is a custom board that must be fabricated and assembled. |
| 1 | IMU-to-Dynamixel bridge, custom board | [reference board and protocol](https://github.com/fanhao375/microduck-replica/tree/master/hardware/imu_to_dxl) · [JLCPCB assembly](https://jlcpcb.com/pcb-assembly) | Quote required | No tested, ready-to-buy board or firmware is included. A generic MPU6050/Adafruit IMU is **not** a drop-in replacement: `robotd` expects an `imu_to_dxl` peripheral at ID 200. |
| 1 | NP-F550-class 7.4 V battery | [Watson B-4203 at B&H](https://www.bhphotovideo.com/c/product/835995-REG/watson_b_4203_np_f550_lithium_ion_battery_pack.html) · [Amazon NP-F550 search](https://www.amazon.com/s?k=NP-F550+battery+7.4V) | $25–60 allowance | B&H listing found in search; direct page blocked automated access. Size-class candidate only: confirm discharge-current capability, dimensions, weight and protection. Camera-battery capacity in mAh does not establish servo-current capability. |
| 1 | External NP-F charger | [B&H charger search](https://www.bhphotovideo.com/c/search?Ntt=NP-F550%20charger&N=0&InitialSearch=yes) · [Amazon charger search](https://www.amazon.com/s?k=NP-F550+battery+charger) | $15–40 allowance | The HAT has no battery charger. Charge the battery outside the robot with the charger’s instructions. |
| 1, after mounting/current review | NP-F battery plate / contacts | [SmallRig NP-F plate 3018](https://www.smallrig.com/smallrig-np-f-battery-adapter-plate-lite-3018.html) · [Amazon NP-F plate search](https://www.amazon.com/s?k=NP-F+battery+plate+7.4V) | $20–45 allowance | Source has no contact design. The SmallRig page shows 7.4 V and 12 V outputs and may regionalize; it is a reference candidate, not a matched mount or sufficient-current guarantee. The 12 V output must not feed the servos. Measure size, mass and current rating before ordering. |
| 1, after power design | **5 V** servo regulator candidate | [Pololu D24V150F5 5 V / 15 A](https://www.pololu.com/product/2881) · [specifications](https://www.pololu.com/product/2881/specs) | Quote current price | Bench/design candidate, not a proven robot rail. “15 A” depends on input voltage and cooling; 15 servos can exceed it at simultaneous stall. Check dropout as the battery discharges, transient response, enclosure fit, fuse, connectors and thermal limits. 5 V leaves margin below the stock servo's 6 V upper limit. |
| 1 | Fuse, holder, switch, and protected power leads | [Amazon inline ATO fuse search](https://www.amazon.com/s?k=inline+ATO+fuse+holder+automotive) · [Amazon DC switch search](https://www.amazon.com/s?k=DC+rocker+switch+15A) · [Amazon 16 AWG silicone wire](https://www.amazon.com/s?k=16+AWG+silicone+wire+red+black) | $20–45 allowance | Example searches; size the fuse, switch and wire from measured current and the weakest conductor/connector rating. Put a physical disconnect where you can reach it while the robot is supported. |
| 11 | ET2216-EZO bearings, **ID 16 / OD 22 / width 4 mm** | [123Bearing product](https://www.123bearing.com/bearing-housing/deep-groove-bearing/single-row/et2216-ezo) · [SMB alternative quotation](https://www.smbbearings.com/products/thin-section-bearings.html) | $26.35 each on checked 123Bearing page | 11 × $26.35 = $289.85 before shipping/tax. Verify clearance, closure, lubricant and fit. SMB is a UK quote alternative. A 16 × 22 × 4 oil seal is a different product. |
| 3 | 10 × 15 × 3 mm bearings | [VXB 10-pack exact size](https://vxb.com/products/10x15x3-open-bearing-pack-of-10) | $49.99 / 10-pack on checked page | The model uses three. The VXB item is an open bearing; verify seals and lubricant against your intended environment. |
| 0–1 extra pack after measuring | Dynamixel X3P spare cables, 180 mm | [ROBOTIS US 10-pack](https://www.robotis.us/robot-cable-x3p-180mm-10pcs/) | $21.85 / 10-pack on checked page | Each servo listing includes one 180 mm X3P cable, so 15 servo boxes already provide 15 cables. Order additional lengths after routing the servo/IMU bus. Avoid HRS-convertible or 4-pin RS-485 cables unless an actual connector requires them. |
| 1 | ROBOTIS U2D2 USB interface for setup | [ROBOTIS US U2D2](https://www.robotis.us/u2d2/) | $36.92 on checked page | Bench tool for assigning IDs and reading servos. It is not the robot’s runtime computer. |
| 1 | U2D2 Power Hub (optional bench harness) | [ROBOTIS US Power Hub](https://www.robotis.us/u2d2-power-hub-board-set/) | $21.85 on checked page | Useful for a one-servo bench, but do not use it as a substitute for the validated robot power design. |

### Bearing quantity correction

The source `robot_walk.xml` has **11** visual instances of the 22 × 16 × 4 bearing and **3** of the 10 × 15 × 3 bearing. The two `bearing_roll` meshes are printed bearing covers, not bearings.

### Cost and power decisions before the full order

The checked servo order is **$412.35**. The 123Bearing large-bearing order plus VXB's 10-pack of small bearings is **$339.84** at the displayed $49.99 VXB price (the page also contains another price field, so confirm the cart). Those purchases alone are **$752.19**, excluding shipping/tax. This is one available sourcing route, not the cheapest possible route. The original $689.75 worksheet is an older allowance and cannot cover this basket plus electronics, outsourced fabrication and tools. Get quotes before setting the full budget; custom firmware/design labor has no established price here.

The HAT's motor connectors share the supply net used by its input. A regulated servo rail requires a reviewed power-distribution/harness design; attaching a converter must not reconnect raw battery voltage to the servo rail through another cable. Confirm the host's 5 V power separately, keep signal ground common where required, and avoid back-feeding USB power. Use the purchased servo's 3.7–6.0 V rating even though the source's simulated BAM parameter is 7.4 V. Lowering the physical rail changes actuator behavior and can require retraining.

## Optional perception and interaction

These are not required to run the basic walking policy. Add them after the walking core is stable.

| Qty | Item | US source | Notes |
|---:|---|---|---|
| 1 | Radxa Camera 8M 219 for Zero 3E/3W | [Arace product page](https://arace.tech/products/radxa-camera-8m-219) | The checked page listed it in stock at $15.99. Confirm the supplied FPC orientation and connector. |
| 1 | Short CSI camera cable, only if not included | [Adafruit Pi Zero camera cable](https://www.adafruit.com/product/3157) · [Amazon Pi Zero CSI cable search](https://www.amazon.com/s?k=Raspberry+Pi+Zero+camera+cable) | The Radxa camera page may include the correct FPC. Do not assume a 15-pin Raspberry Pi cable fits the Zero 3W; compare connector pitch and contacts first. |
| 1 | VL53L5CX 8 × 8 ToF module | [SparkFun Qwiic VL53L5CX](https://www.sparkfun.com/sparkfun-qwiic-tof-imager-vl53l5cx.html) | The checked page listed $32.50 and in stock. The software also documents VL53L8CX compatibility; this sensor is optional. |
| 1, after fit check | Miniature speaker matched to the HAT | [Digi-Key speaker search](https://www.digikey.com/en/products?keywords=35mm%2025mm%20speaker) · [Adafruit bench speaker](https://www.adafruit.com/product/3351) | Reference envelope is 35 × 25 × 7 mm. Exact original SKU is unknown. Adafruit 3351 is about 71 × 30 mm and is an external bench option only; it does not fit the source envelope. Select impedance/power from the HAT amplifier design and actual enclosure. |
| 1 | STEMMA-QT/Qwiic 4-pin cable | [Adafruit 100 mm cable](https://www.adafruit.com/product/4210) | For the optional ToF board if its supplied cable does not fit. The HAT headers are 1 mm JST-SH. |

## Fasteners, printed inserts, and consumables

These are **community starter-stock quantities**, not verified installed screw counts. Review the joint stack before selecting a length. Each retail XL330 includes 6 × M2×6 TAP and 10 × M2×8 TAP screws: fifteen boxes supply 90 and 150 respectively. Those tapping screws are different from ordinary M2 machine screws. Use the actuator manufacturer's fasteners at its plastic/horn interfaces; do not force machine screws into those holes.

| Suggested quantity | Item | US source |
|---:|---|---|
| 60 | M2 × 4 socket-head cap screws | [McMaster M2 screws](https://www.mcmaster.com/products/m2-screws/) |
| 80 | M2 × 6 socket-head cap screws | [McMaster M2 screws](https://www.mcmaster.com/products/m2-screws/) |
| 40 | M2 × 8 socket-head cap screws | [McMaster M2 screws](https://www.mcmaster.com/products/m2-screws/) |
| 15 | M2 × 12 socket-head cap screws | [McMaster M2 screws](https://www.mcmaster.com/products/m2-screws/) |
| 50 | M2 nuts | [McMaster metric nuts](https://www.mcmaster.com/products/metric-nuts/) |
| 0 initially; up to 60 only with redesigned pockets | M2 heat-set inserts | [McMaster heat-set inserts](https://www.mcmaster.com/products/heat-set-inserts/) · [Amazon M2 insert search](https://www.amazon.com/s?k=M2+heat+set+inserts+3D+printing) |
| 20 | M2.5 × 6 socket-head cap screws | [McMaster M2.5 screws](https://www.mcmaster.com/products/m2.5-screws/) |
| 1 if installing inserts | Insert-installation tip matching M2 insert and your iron | [Amazon insert tip search](https://www.amazon.com/s?k=heat+set+insert+soldering+tip+M2) |
| 0 for outsourced printing | Filament | The print service supplies its material. You do not need to purchase filament, resin, a printer or printer accessories. |
| 1 if specified at a metal joint | Removable threadlocker | [McMaster threadlocker](https://www.mcmaster.com/products/threadlocker/) — only where the fastener/material instructions permit; keep unsuitable threadlocker away from plastic. |

The reference meshes do not contain validated heat-set insert pockets. Have the builder design the pocket for the selected insert and check surrounding wall thickness. The screw lengths above do not identify a screw for every joint; record actual length, head type, washers and engagement in [assembly-fit.csv](../hardware/assembly-fit.csv).

## Ordering the HAT without soldering its tiny components

Download the [HAT quote pack](../public/models/microduck-hat-quote.zip). It contains the unmodified official production Gerbers/drill ZIP, BOM, placement CSV, PCB/schematic PDFs, STEP reference and licence. Ask [JLCPCB](https://jlcpcb.com/pcb-assembly) or [PCBWay](https://www.pcbway.com/pcb-assembly.html) for **one fully assembled board**, with any PCB/panel minimum billed separately. These are international services; obtain US delivery and duty charges in the quote.

Specify the source **4-layer, 1.0 mm** board (approximately 65.0 × 30.9 mm), and have the service reconcile BOM/placement mapping, orientation, top/bottom assembly, DNP components and through-hole connectors. Fiducials/logos are not ordinary fitted parts. Approve the supplier's component mapping and any substitutions before manufacture. The included LGA/QFN components make professional assembly useful; a soldering iron alone is not the recommended route.

This HAT does not replace the ID-200 IMU bridge or an external battery charger. Get the IMU and power-distribution plan agreed before paying for the complete electronics batch.

## Custom IMU bridge component leads

These are **early community design suggestions for an engineer to review**, not a released fabrication BOM. The exact MCU, board revision and firmware are still an engineering task. Do not order these in addition to a turnkey assembly quote that already includes components. The distributor searches below do not establish availability or a matching part in that distributor's catalogue.

| Qty | Reference part | US distributor search |
|---:|---|---|
| 1 | STM32G031F8P6, TSSOP-20 MCU | [Digi-Key](https://www.digikey.com/en/products/result?keywords=STM32G031F8P6) · [Mouser](https://www.mouser.com/c/?q=STM32G031F8P6) |
| 1 | LSM6DSV16XTR, LGA-14 IMU | [Digi-Key](https://www.digikey.com/en/products/result?keywords=LSM6DSV16XTR) · [Mouser](https://www.mouser.com/c/?q=LSM6DSV16XTR) |
| 1 | SN74LVC2G241, tri-state buffer | [Digi-Key](https://www.digikey.com/en/products/result?keywords=SN74LVC2G241) · [Mouser](https://www.mouser.com/c/?q=SN74LVC2G241) |
| 1 | HT7533-1 or another regulator rated above the fully charged battery | [Digi-Key search](https://www.digikey.com/en/products/result?keywords=HT7533-1) |
| 2 | JST-EH 3-pin board connectors, B3B-EH-A | [Digi-Key C160259 search](https://www.digikey.com/en/products/result?keywords=B3B-EH-A) |
| 1 | SWD header and 3.3 V programming lead | [Amazon SWD header search](https://www.amazon.com/s?k=SWD+2.54mm+header) |
| as specified | 100 nF / 10 µF capacitors, 10 kΩ resistors, PCB | [Digi-Key passives](https://www.digikey.com/en/products/filter/ceramic-capacitors/60) · [JLCPCB assembly](https://jlcpcb.com/pcb-assembly) |

Use a **25 V or higher** input capacitor on the bridge if it connects directly to an NP-F battery. The 3.3 V output capacitor can use a lower rating. This table does not establish a tested schematic, firmware, or assembled board.

## A safe bring-up bench

Borrow these from a makerspace or have your assembler provide them where possible. The links are example product searches, not checked stock. A 5 A bench supply is useful for initial one-joint work; it does not establish adequate supply for all fifteen servos.

| Qty | Tool or consumable | Purchase/search link and selection |
|---:|---|---|
| 1 | Adjustable current-limited bench supply | [US retailer search](https://www.amazon.com/s?k=bench+power+supply+30V+5A+current+limiting) — DC voltage/current display and adjustable current limit |
| 1 | Multimeter with continuity and DC voltage | [US retailer search](https://www.amazon.com/s?k=digital+multimeter+continuity+DC+voltage) |
| 1 set | Small Phillips drivers and 1.5 / 2 mm hex drivers | [US retailer search](https://www.amazon.com/s?k=precision+Phillips+hex+1.5mm+2mm+screwdriver+set) — match actual screw heads |
| 1 | Digital caliper | [US retailer search](https://www.amazon.com/s?k=digital+caliper+metric) — measure bearings, printed holes and enclosure clearances |
| 1 | Scale with 0.1 g resolution | [US retailer search](https://www.amazon.com/s?k=scale+0.1g+500g) — compare assembled body masses with the reference |
| 1 set | Flush cutters, wire stripper and fine pliers | [US retailer search](https://www.amazon.com/s?k=electronics+flush+cutter+wire+stripper+pliers) |
| 1 set | Small files, pin vise and metric drill bits | [US retailer search](https://www.amazon.com/s?k=pin+vise+metric+drill+bits+1.6+2.2) — controlled fit work, not arbitrary enlargement of bearing seats |
| 1 station | Temperature-controlled soldering iron, stand and fume extraction | [US retailer search](https://www.amazon.com/s?k=soldering+station+fume+extractor) — for wiring/header work; order the fine-pitch boards assembled |
| 1 set | Electronics solder, flux and desoldering braid | [US retailer search](https://www.amazon.com/s?k=electronics+solder+flux+desoldering+braid) |
| 1 set | Heat shrink, cable ties and labels | [US retailer search](https://www.amazon.com/s?k=heat+shrink+small+cable+ties+wire+labels) |
| 1 set after routing | Silicone wire, rated connector pair and fused bench leads | [wire search](https://www.amazon.com/s?k=silicone+wire+red+black+16+20+AWG) · [connector search](https://www.amazon.com/s?k=XT30+connector+pigtail) · [lead search](https://www.amazon.com/s?k=fused+bench+power+supply+test+leads) — gauge and connector rating come from measured current and routing |
| 1, if needed | 3.3 V logic USB serial console cable | [Adafruit 954](https://www.adafruit.com/product/954) — checked $9.95; use signal/ground per board pinout and leave its power lead disconnected when separately powering the board |
| 1, if developing bridge firmware | ST-Link SWD programmer | [Digi-Key STLINK-V3MINIE search](https://www.digikey.com/en/products?keywords=STLINK-V3MINIE) — engineer must match SWD pinout/voltage and chosen MCU |
| 1 set | USB data cable and board setup power adapter | [USB data cable search](https://www.amazon.com/s?k=USB+C+data+cable) · [5 V USB supply search](https://www.amazon.com/s?k=5V+3A+USB+C+power+supply) — match actual Radxa/U2D2 revision; a charger-only cable cannot flash or enumerate devices |
| 1, optional recovery medium | 32 GB microSD and USB reader | [US retailer search](https://www.amazon.com/s?k=32GB+microSD+USB+reader) — not extra onboard storage when eMMC is used |
| as fitted | Board header, insulating spacers/standoffs, screws | [2×20 header search](https://www.amazon.com/s?k=2x20+2.54mm+male+header) · [M2.5 spacer search](https://www.amazon.com/s?k=M2.5+nylon+spacer+standoff) — check supplied headers and real HAT stacking height before ordering |
| 1 set | Eye protection, battery charging/storage bag, nonflammable charging surface | [eye protection](https://www.amazon.com/s?k=ANSI+Z87+safety+glasses) · [battery bag](https://www.amazon.com/s?k=lithium+battery+charging+bag) — follow battery/charger instructions; a bag does not make unattended charging safe |
| 1 fixture | Padded support/tether and soft test mat | [clamp/support search](https://www.amazon.com/s?k=bench+clamp+robot+support) · [mat search](https://www.amazon.com/s?k=foam+exercise+mat) — builder must make a fixture that supports the robot when torque disappears |
| 1 if using padd | Linux-compatible USB/Bluetooth gamepad | [US retailer search](https://www.amazon.com/s?k=Linux+compatible+USB+gamepad) — verify the upstream mapping before first powered movement |

The laptop running this project is also your development computer. Do not connect a second Dynamixel utility while `robotd` owns the same bus.

Use the ten stages in [HARDWARE.md](HARDWARE.md) and record evidence in [hardware/bringup-checklist.csv](../hardware/bringup-checklist.csv). Stop if a servo moves in the wrong direction, the rail leaves the purchased actuator’s range, packets drop, a part collides, or a motor heats unexpectedly.

## If you do not own a 3D printer

Download [microduck-print-quote.zip](../public/models/microduck-print-quote.zip), extract it, and use [print-order.csv](../hardware/print-order.csv) to set quantity and material for every STL. It contains **30 design files / 36 modeled pieces**, including the lens-holder reference that needs review against your camera. It excludes all eight purchased-component mesh types. The full assembly STL must not be submitted as one print. Ask the service for a quote and manufacturability review before releasing the full job.

| Service | Link | Best use |
|---|---|---|
| Craftcloud | [US/global instant comparison](https://craftcloud3d.com/) | Upload the STL set once and compare regional suppliers, materials, and shipping. |
| Xometry | [US 3D-printing quote](https://www.xometry.com/capabilities/3d-printing-service/) | Functional PA12 nylon/MJF/SLS or TPU quote with inspection options. |
| Protolabs | [US online 3D-printing quote](https://www.protolabs.com/services/3d-printing/) | Higher-cost production-style quote; offers nylon, TPU and FDM options. |
| JLC3DP | [Online quote](https://jlc3dp.com/) · [SLS](https://jlc3dp.com/3d-printing/selective-laser-sintering) | Often economical for a complete PA12 batch; confirm US shipping and customs at checkout. |
| PCBWay | [3D-printing service](https://www.pcbway.com/rapid-prototyping/3D-Printing/3D-Printing-SLS.html) | Alternative online quote for nylon and other processes. |
| Local makerspace / library lab | [FabLabs directory](https://www.fablabs.io/labs) | Search your city and verify public access, staff help, material choices and fees. Not every lab offers printing or assembly as a paid service. |

### Material request to send with the files

1. **PA12 nylon by MJF or SLS** for motor supports, hip/leg links, feet, bearing covers, torso structure and other load paths.
2. **PETG FDM** for a low-cost first fit of shells and brackets. Use it to find clearance problems, not to assume final strength.
3. **TPU around 95A** for `sole_left`, `sole_right`, `jaw_soft`, and `soft_mouth_top` if the service supports it. The source does not publish a validated hardness or print recipe, so test the result.
4. Ask for the parts at **100% scale**, with no automatic inch conversion. Print one motor support and one bearing seat first; measure holes and test an actual XL330 before ordering the remaining batch.

These are proposed trial materials, not the original validated manufacturing recipe. A 1 mm reinforcement plate may require a different process/material. Ask the service to review thin walls, bearing seats, holes and support removal, preserve individual part orientation/handedness, and state its tolerance. Changing material or infill changes mass, stiffness, friction and the simulation match. Do not accept automatic model repair that closes holes or changes mating geometry without reviewing it.

For a smaller first order, use [microduck-fit-check.zip](../public/models/microduck-fit-check.zip): one `yaw2roll`, one `bearing_roll`, one `leg` and one `motor_support`. It is a fit-test set, not an additional set to include twice in the full order. Send the [print-service brief](PRINT_SERVICE_BRIEF.md) with it.

The community's 41-piece figure counts five collision duplicates: a second `power_support`, a second left and right `leg`, and a second left and right sole. In the pinned `robot_walk.xml`, each duplicate occupies the same physical pose as its `class="visual"` counterpart. This project's 36-piece worksheet counts visual occurrences once. That establishes model quantities, not a fabrication release.

The source meshes are reference geometry, not manufacturing drawings. The service cannot infer screw lengths, heat-set insert pockets, tolerances, strength, cable clearance, or the missing battery-contact design. Budget for one prototype batch and a second batch after fit measurements.

## What is still a custom engineering task

- The RPI Robot HAT is orderable as a small-batch PCBA from its official production files.
- The `imu_to_dxl` bridge is documented but has no validated assembled product in this project. It needs a PCB, firmware, connector pinout, calibration, and a test at ID 200.
- Battery contacts, cable lengths, mounting tolerances, and the final regulated power rail must be designed around the parts you actually receive.
- No supplier link makes the robot hardware-tested. Complete the staged bring-up and physical walking validation before unsupervised operation.

If you hire an assembler, ask for separate prices for: CAD/fit revisions; prints and post-processing; assembled HAT; validated IMU board **and firmware**; battery/servo/host power distribution; measured cable harness; physical assembly; Radxa provisioning; ID/zero/direction calibration; and supported standing/walking tests with logs. Send [BUILD_GUIDE.md](BUILD_GUIDE.md), [HARDWARE.md](HARDWARE.md), [RUNTIME.md](RUNTIME.md), the calibration/mass templates, and the [assembly-fit](../hardware/assembly-fit.csv) / [harness](../hardware/harness.csv) worksheets. A print-only quote excludes those engineering/assembly tasks unless explicitly included.

### Practical order of work

1. Obtain the IMU/firmware and power-design solution or an engineer's quote for completing them.
2. Borrow/buy bench tools, **one** XL330, the U2D2 interface and a sample of each required bearing size. Leave the other 14 servos for the next purchase.
3. Order the four-piece fit-check print pack; measure actual servo, bearing and screw fit. Review battery contacts, head electronics, lens holder and the thin reinforcement plates.
4. Revise and approve the parts that need manufacturing changes. Order the remaining actuators, exact-size bearings, hardware, full print batch and assembled electronics.
5. Measure and make the harness; provision the Radxa and test IDs one at a time. Fill the worksheets as parts are measured, received and assembled.
6. Follow the supported bring-up stages in the build guide. Add optional camera/ToF/audio after the walking core behaves correctly.

For the source basis and license details, see [BOM.md](BOM.md), [HARDWARE.md](HARDWARE.md), [MECHANICAL.md](MECHANICAL.md), and [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).
