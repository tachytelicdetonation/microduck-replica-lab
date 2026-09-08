# Build a Microduck replica

US purchasing and outsourced fabrication: [shopping guide](PROCUREMENT_US.md), [shopping checklist](../hardware/procurement-us.csv), [print quantities](../hardware/print-order.csv).

This guide follows the original seven posts, but uses the pinned official source as the authority for interfaces. The target is a two-legged Microduck with 15 XL330 servos, a Radxa Zero 3W, and the original 14-joint learned controller. Perception and interaction can be added after the walking core works.

The software, original reference geometry and test tools are provided here. A validated manufactured robot is not. In particular, the community IMU bridge has no verified, ready-to-flash firmware in this snapshot, and simulation meshes do not establish manufacturing tolerances.

## 1. Establish a repeatable software baseline

Follow the root README. Fetch exact commits, verify policy checksums, install the locked Python and npm environments, and run CPU tests. Save a standing rollout and a forward rollout. Inspect model contacts and displacement; finite output alone is not command tracking.

Open the assembly explorer. Distinguish **70 visual instances**, **38 unique mesh files**, **15 rigid-body groups**, **14 simulated actuated joints**, and **15 physical servos**. The mouth is a separate physical servo but fixed in this walking/assembly model.

## 2. Prototype one joint

Use [MECHANICAL.md](MECHANICAL.md) to reconstruct the joint hierarchy and validate a bracket, bearing seat and screw stack against an actual servo. Use the individual millimetre reference STL files for inspection. Use the original MJCF for axes, joint origins, limits, masses and inertia.

Trial-fit before printing the complete robot. Verify threads and insert geometry, through-hole sizes, bearing fits, cable sweep, removal access and full travel. Then build the torso, left and right leg chains, and the head/neck chain. Record actual mass and centre of mass; a shell that looks right can still invalidate a learned policy.

## 3. Build the electrical bench

The main HAT design is in `upstream/robot-hat/`, including KiCad, Gerbers, BOM and component placement. Community IMU drawings and STEP references are in `upstream/replica-reference/hardware/imu_to_dxl/`.

Start with a current-limited supply, one servo, a verified half-duplex TTL adapter and a multimeter. Stock XL330-M288-T operating voltage is 3.7–6.0 V according to ROBOTIS. A charged 2S battery can reach 8.4 V. The upstream 7.4 V nominal BAM model does **not** authorize that voltage on purchased stock servos. Design and verify the servo rail for the purchased variant.

The runtime needs the IMU bridge at ID 200, not simply a generic I²C IMU. Finish and validate its firmware/register protocol before attempting closed-loop standing. See [HARDWARE.md](HARDWARE.md).

## 4. Prepare the controller

Build and test the actual Rust runtime with fake I/O. Provision the Radxa using the upstream board guide and check UART2 ownership. Do not run another servo utility while `robotd` owns the port. Use the current upstream deployment configuration; this project does not replace its signed update service.

`--fake` avoids real devices. `--no-policy` by itself still permits hardware I/O. The test script always supplies both. See [RUNTIME.md](RUNTIME.md).

## 5. Calibrate with support

Use [hardware/calibration.csv](../hardware/calibration.csv). Configure servo IDs one at a time, with other default-ID units disconnected. Establish encoder zero, positive direction and mechanical range on a supported, unloaded joint, then on one leg. Compare every angle with the MJCF home frame.

Runtime slots 0–8 are policy actions 0–8, slot 9 is the mouth, and slots 10–14 are policy actions 9–13. An index error here can send right-leg targets to the wrong device. Check all 15 positions and the IMU before supported home-pose interpolation.

## 6. Transfer in stages

Test one unloaded servo; one supported leg; the full bus with torque off; the full bus plus IMU; slow home interpolation on a fixture; policy output with feet off the ground; supported standing; tethered standing; supported low-speed steps; then very short free walking. Record position, velocity, gravity, action, bus timing, voltage, temperatures and video.

Power interruption must be available, and a fixture must support the robot when torque is removed. Proceed only after the prior stage's measured results are acceptable. Use [hardware/bringup-checklist.csv](../hardware/bringup-checklist.csv) to record evidence; opening a guide page does not mark a test complete.

## When to retrain

Retrain if the actuator response, mass distribution, geometry, sole friction, delay, filter or control frequency changes materially. Measure first, update MJCF and actuator parameters, run the official short smoke test, then PPO training and the normalizer-aware ONNX export. Rehearse the exported ONNX on CPU before hardware. See [TRAINING.md](TRAINING.md).

## Assumptions and unresolved work

| Item | Current basis | Work still needed |
|---|---|---|
| Computer | Runtime targets Radxa Zero 3W / RK3566 | Select the actual RAM/eMMC SKU and verify connectors |
| Servo | Source specifies XL330; suffix M288-T is inferred by the series | Confirm purchased variant, rail and performance |
| Battery | Runtime describes NP-F550; mesh is misleadingly named NP-F970 | Verify dimensions, contacts, regulation and protection |
| HAT | Official production sources available | Order/assemble a matching revision and validate |
| IMU | Runtime expects `imu_to_dxl` v2 / LSM6DSV16X, ID 200 | Implement/obtain bridge firmware and test hardware |
| Structure | Original simulation geometry and body transforms | Manufacturing CAD, tolerances, fit, strength and mass checks |
| Gait | Published ONNX, tested on CPU with BAM | Better command tracking/retraining and physical validation |
