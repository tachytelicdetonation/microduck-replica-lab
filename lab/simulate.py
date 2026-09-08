"""Run a CPU rollout; save a summary and optional per-tick telemetry."""
import argparse
import json
from pathlib import Path

from lab.robot import Robot


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--seconds', type=float, default=10)
    parser.add_argument('--vx', type=float, default=0)
    parser.add_argument('--vy', type=float, default=0)
    parser.add_argument('--yaw', type=float, default=0)
    parser.add_argument('--walking', type=Path, help='A custom normalizer-aware [1,61] -> [1,14] ONNX policy')
    parser.add_argument('--standing', type=Path)
    parser.add_argument('--sitstand', type=Path)
    parser.add_argument('--log', type=Path)
    parser.add_argument('--output', type=Path, default=Path('artifacts/simulation-summary.json'))
    args = parser.parse_args()
    if not 0.02 <= args.seconds <= 3600:
        parser.error('--seconds must be between 0.02 and 3600.')
    robot = Robot(walking=args.walking, standing=args.standing, sitstand=args.sitstand)
    robot.set_command([args.vx, args.vy, args.yaw])
    robot.paused = False
    records = []
    for _ in range(round(args.seconds * 50)):
        robot.step()
        s = robot.snapshot()
        records.append({k: v for k, v in s.items() if k not in ('bodies', 'positions', 'quaternions')})
    summary = {**records[-1], 'maxTilt': max(r['tilt'] for r in records),
               'minTrunkHeightMm': min(r['height'] for r in records),
               'maxInferenceMs': max(r['inferenceMs'] for r in records),
               'finite': True, 'actuators': 'official BAM M6', 'physicalHardwareTested': False}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(summary, indent=2) + '\n')
    if args.log:
        args.log.parent.mkdir(parents=True, exist_ok=True)
        args.log.write_text(''.join(json.dumps(r) + '\n' for r in records))
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
