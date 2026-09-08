export const groups = ["Head & neck", "Torso", "Left leg", "Right leg"];
export const groupColors: Record<string, string> = {
  "Head & neck": "#bba9ef",
  Torso: "#c8f879",
  "Left leg": "#edaa76",
  "Right leg": "#7ecbd3",
};
export const sources = [
  {
    title: "Software architecture analysis",
    id: "2093222346501107739",
    topic: "ARCHITECTURE",
  },
  {
    title: "Structure exploded view",
    id: "2094249218735300630",
    topic: "MECHANICAL",
  },
  {
    title: "Component cost estimation",
    id: "2094591561908748588",
    topic: "BILL OF MATERIALS",
  },
  {
    title: "Reverse-engineered 3D materials",
    id: "2094709164501254518",
    topic: "CAD & FABRICATION",
  },
  {
    title: "Structure visualization",
    id: "2096238855519453662",
    topic: "ASSEMBLY",
  },
  {
    title: "Reinforcement training & simulation",
    id: "2095728806971806133",
    topic: "REINFORCEMENT LEARNING",
  },
  {
    title: "DIY Microduck from scratch",
    id: "2094963381220622638",
    topic: "BUILD GUIDE",
  },
];
export const services = [
  {
    name: "robotd",
    label: "Motion & control",
    tag: "50 Hz",
    description:
      "The only service that owns the motor bus. Reads joint and IMU state, assembles 61 observations, runs a 14-action ONNX policy, applies limits, and writes 15 servo targets.",
    detail:
      "14 policy joints + the independent mouth servo. All incoming intents pass through the control state machine and safety checks.",
    source: "robotd/src/main.rs",
  },
  {
    name: "padd",
    label: "Gamepad input",
    tag: "INTENT",
    description:
      "Converts gamepad buttons and sticks into high-level motion intents for robotd.",
    detail:
      "Gamepad input requests a movement. It does not write directly to the Dynamixel bus.",
    source: "padd/src/main.rs",
  },
  {
    name: "btd",
    label: "Bluetooth gateway",
    tag: "BLE",
    description:
      "Handles Bluetooth advertising, pairing, and the mobile control connection.",
    detail:
      "BLE commands cross the IPC boundary before the control daemon acts on them.",
    source: "btd/src/main.rs",
  },
  {
    name: "mediad",
    label: "Vision & audio",
    tag: "WebRTC",
    description:
      "Captures camera and audio streams and handles low-latency media transport.",
    detail:
      "The head camera, speaker, and microphone are optional for a first walking replica.",
    source: "mediad/src/main.rs",
  },
  {
    name: "tofd",
    label: "Depth sensing",
    tag: "8 × 8",
    description:
      "Reads the multi-zone time-of-flight sensor and publishes a depth stream.",
    detail:
      "VL53L5CX / VL53L8CX support lives in the upstream tof crate. Sensor bring-up follows motor and IMU bring-up.",
    source: "tof/src/main.rs",
  },
  {
    name: "configd",
    label: "Device configuration",
    tag: "CONFIG",
    description:
      "Owns network settings, robot identity, pairing, and system configuration.",
    detail:
      "Runs as a separate daemon so network activity is kept out of the motion control loop.",
    source: "configd/src/main.rs",
  },
  {
    name: "updaterd",
    label: "Updates & recovery",
    tag: "OTA",
    description:
      "Verifies signed releases, activates components, runs health checks, and rolls back failed updates.",
    detail:
      "Use the actual upstream update mechanism. The local workbench does not flash a robot.",
    source: "updater/src/main.rs",
  },
];
export const bom = [
  {
    id: "servo",
    name: "Dynamixel XL330 servos",
    spec: "14 policy joints + 1 mouth",
    quantity: 15,
    unitPrice: 27.49,
    category: "Actuation",
    optional: false,
    note: "US price reported in the Sep 4 community BOM; exact suffix is inferred. Verify the purchased servo voltage rating.",
    source:
      "https://github.com/fanhao375/microduck-replica/blob/master/BOM.en.md",
  },
  {
    id: "compute",
    name: "Radxa Zero 3W",
    spec: "RK3566 · choose RAM / eMMC SKU",
    quantity: 1,
    unitPrice: 45,
    category: "Electronics",
    optional: false,
    note: "Planning allowance, not a supplier quote. The current runtime targets Radxa, despite the Raspberry Pi mesh name.",
    source: "https://github.com/pollen-robotics/microduck",
  },
  {
    id: "hat",
    name: "RPI Robot HAT",
    spec: "Interface, power, audio & expansion",
    quantity: 1,
    unitPrice: 60,
    category: "Electronics",
    optional: false,
    note: "Small-batch PCBA allowance. Official KiCad, Gerbers, BOM and placement files are available.",
    source: "https://github.com/pollen-robotics/elec_RPI_Robot_HAT",
  },
  {
    id: "imu",
    name: "IMU → Dynamixel bridge",
    spec: "LSM6DSV16X · bus ID 200",
    quantity: 1,
    unitPrice: 50,
    category: "Electronics",
    optional: false,
    note: "Unvalidated community hardware. Firmware and a tested board remain a physical-build gap; this is a budget allowance.",
    source:
      "https://github.com/fanhao375/microduck-replica/tree/master/hardware/imu_to_dxl",
  },
  {
    id: "power",
    name: "Battery & protected power",
    spec: "NP-F550-class pack, holder, regulator",
    quantity: 1,
    unitPrice: 45,
    category: "Power",
    optional: false,
    note: "Includes a planning allowance for regulation and protection. Do not directly connect a 2S pack to a stock 6.0 V-rated XL330.",
    source: "https://emanual.robotis.com/docs/en/dxl/x/xl330-m288/",
  },
  {
    id: "bearings",
    name: "Joint bearings",
    spec: "Verify seats and dimensions",
    quantity: 14,
    unitPrice: 1.6,
    category: "Mechanical",
    optional: false,
    note: "Reconstructed quantity; verify each bearing against the parts and full-travel fit.",
    source:
      "https://github.com/fanhao375/microduck-replica/blob/master/BOM.en.md",
  },
  {
    id: "fasteners",
    name: "Fasteners & wiring",
    spec: "M2 hardware, connectors, harness",
    quantity: 1,
    unitPrice: 25,
    category: "Mechanical",
    optional: false,
    note: "One project allowance; detailed screw lengths need trial assembly and engagement checks.",
    source:
      "https://github.com/fanhao375/microduck-replica/blob/master/docs/fastener-reconstruction.en.md",
  },
  {
    id: "print",
    name: "Printed structure & soft parts",
    spec: "Rigid polymer + compliant contact parts",
    quantity: 1,
    unitPrice: 30,
    category: "Mechanical",
    optional: false,
    note: "Material allowance. Source geometry is not validated for manufacturing. Includes no printer or outsourced labour.",
    source: "https://github.com/fanhao375/microduck-replica/tree/master/print",
  },
  {
    id: "camera",
    name: "Camera & wide-angle lens",
    spec: "IMX219-compatible module",
    quantity: 1,
    unitPrice: 25,
    category: "Sensing",
    optional: true,
    note: "Optional for initial locomotion. Check CSI cable, sensor orientation and lens support.",
    source: "https://github.com/pollen-robotics/microduck",
  },
  {
    id: "tof",
    name: "Multi-zone ToF sensor",
    spec: "VL53L5CX / VL53L8CX",
    quantity: 1,
    unitPrice: 25,
    category: "Sensing",
    optional: true,
    note: "Optional 8 × 8 depth sensor; not an input to the basic walking policy.",
    source: "https://github.com/pollen-robotics/microduck/tree/main/tof",
  },
  {
    id: "speaker",
    name: "Miniature speaker",
    spec: "Match HAT amplifier and enclosure",
    quantity: 1,
    unitPrice: 5,
    category: "Sensing",
    optional: true,
    note: "Optional interaction component. Verify impedance and dimensions.",
    source: "https://github.com/pollen-robotics/elec_RPI_Robot_HAT",
  },
];
export const stages = [
  {
    title: "Start in simulation",
    duration: "SOFTWARE",
    description:
      "Run the published policy on the CPU before ordering hardware. Confirm the observation contract, contacts and joint order.",
    tasks: [
      "Fetch the pinned repositories and verify policy checksums",
      "Run the CPU tests and a logged standing / forward rollout",
      "Explore the 70-part assembly and inspect the source MJCF",
    ],
    command:
      "python3 scripts/fetch_upstream.py\nuv sync --locked\nuv run python -m pytest -q\nuv run python -m lab.simulate --seconds 10 --vx 0.3",
    link: "/docs/SIMULATION.md",
  },
  {
    title: "Validate the mechanical design",
    duration: "CAD & PRINT",
    description:
      "Start with one servo bracket, one bearing seat and one screw stack. Inspect threads, tolerances, wire routing and full joint travel.",
    tasks: [
      "Download the reference CAD and identify purchased components",
      "Trial-fit one joint with actual hardware",
      "Validate shell openings, fastener engagement and wire clearance",
      "Weigh each assembly and compare with the MJCF mass model",
    ],
    command: "uv run python scripts/export_models.py",
    link: "/docs/MECHANICAL.md",
  },
  {
    title: "Bring up power, bus & IMU",
    duration: "BENCH",
    description:
      "Use a current-limited supply and one servo first. A validated IMU bridge is required for real closed-loop control.",
    tasks: [
      "Validate the servo rail against the purchased XL330 datasheet",
      "Verify the half-duplex TTL bus at 1 Mbps",
      "Complete and validate the ID 200 IMU bridge",
      "Check gravity direction, gyro units and fresh IMU samples",
    ],
    command: null,
    link: "/docs/HARDWARE.md",
  },
  {
    title: "Install the robot runtime",
    duration: "LINUX & RUST",
    description:
      "The actual upstream robotd and robotctl are included. Start with fake hardware, then follow the board bring-up guide.",
    tasks: [
      "Compile the pinned Rust robotd and robotctl",
      "Pass the fake-hardware health check",
      "Provision the Radxa using the upstream board instructions",
      "Verify UART ownership and configuration",
    ],
    command:
      "cd upstream/microduck\ncargo build --locked -p robotd -p robotctl\ncd ../..\nuv run python scripts/check_runtime.py",
    link: "/docs/RUNTIME.md",
  },
  {
    title: "Calibrate & rehearse",
    duration: "SIM → REAL",
    description:
      "Map the physical robot to the exact joint names, home angles and directions used in training.",
    tasks: [
      "Assign unique servo IDs and record their configuration",
      "Validate one leg at small angles while supported",
      "Verify all 15 targets and the independent mouth slot",
      "Run the exported ONNX in CPU simulation before deployment",
    ],
    command: null,
    link: "/docs/HARDWARE.md",
  },
  {
    title: "Train & test your build",
    duration: "PPO & VALIDATION",
    description:
      "Use the official GPU training recipe when hardware differs. Establish a finite 64-environment smoke run before a full training run.",
    tasks: [
      "Measure changed mass, inertia, friction and actuator response",
      "Pass a 64-environment / 5-iteration GPU smoke test",
      "Train and export through the official normalizer-aware path",
      "Progress from supported standing to short, logged free walking",
    ],
    command:
      "python3 scripts/train.py --smoke\npython3 scripts/train.py --iterations 5000",
    link: "/docs/TRAINING.md",
  },
];
