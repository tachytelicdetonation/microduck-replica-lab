# Electrical bench and calibration gates

This document is a measurement plan, not permission to energize an unverified build. Use a current-limited bench supply, a physical disconnect, a fuse, a protected battery bag and a fixture that catches the robot.

## Bus bring-up

- The Microduck XL330 path is a three-pin, single-wire, half-duplex Dynamixel TTL bus at 1 Mbps and Protocol 2.0.
- The HAT also exposes RS-485; that does not make it the correct XL330 interface.
- Keep one bus owner. Stop robotd, debug scripts and USB adapters before another tool transmits.
- Confirm the UART2 login console is disabled only after identifying its owner; do not blindly stop unrelated services.
- Configure IDs one servo at a time: left leg 20–24, neck/head/mouth 30–34, right leg 10–14.

## Power gate

Measure the servo rail during startup and a controlled movement. Confirm it remains inside the purchased actuator datasheet range under load. Verify the host's 5 V regulator separately while the servo rail moves. The HAT's input range and the actuator's voltage rating are separate constraints.

## IMU gate

The runtime expects an `imu_to_dxl` v2 peripheral at Dynamixel ID 200. Its consumed block is 12 bytes at address 124: three little-endian `i16` gyro axes at ±500 dps and three IEEE half-precision SFLP quaternion components, with `w` reconstructed. The full diagnostic block is 20 bytes. The reference bridge drawings are not a validated production board or firmware.

Confirm at least 25 live fused quaternion samples, the mounting rotation, rad/s gyro units and projected gravity `[0, 0, -1]` while upright. Confirm one `sync_read` covers all 15 servos plus ID 200 at 50 Hz with no persistent dropped blocks.

## Calibration sequence

Use [calibration.csv](../hardware/calibration.csv) and [bringup-checklist.csv](../hardware/bringup-checklist.csv). Record model, firmware, ID, baud, mode, return delay, limits, sign, zero, voltage and temperature for every actuator. Set `return_delay_time=0`, baud code `3` (1 Mbps), `pwm_slope=255` and the documented shutdown mask only when they match the purchased firmware.

Raw position conversion used by the runtime is `q = 2π × raw / 4096 − π`; raw 2048 corresponds to zero under this convention. Mechanical home still depends on horn installation and sign. Verify each positive command at ±5° unloaded.

## Ten physical tests

1. One servo, no linkage.
2. One leg supported and unloaded.
3. Fifteen IDs online, torque off.
4. Add ID 200 IMU.
5. Slow home interpolation on a hanging fixture.
6. Policy output with feet off the ground.
7. Feet contact with external support.
8. Five to ten seconds tethered stand.
9. Supported walking at low command.
10. A short free walk on a soft surface with an emergency disconnect in reach.

At any sign of wrong direction, collision, heat, voltage sag, dropped packets or unstable timing, stop at that level and correct it before continuing.
