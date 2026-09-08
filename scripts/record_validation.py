#!/usr/bin/env python3
"""Record measured CPU policy behaviour at the pinned source/model revisions."""
import datetime
import json
from pathlib import Path
import sys

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from lab.robot import ROOT, Robot


def main():
    robot = Robot()
    cases = [('stand', [0, 0, 0]), ('forward_030', [.3, 0, 0]),
             ('forward_015', [.15, 0, 0]), ('reverse_030', [-.3, 0, 0]),
             ('lateral_020', [0, .2, 0]), ('turn_100', [0, 0, 1.0])]
    results = []
    for name, command in cases:
        robot.reset()
        robot.set_command(command)
        heights, tilts, contacts = [], [], []
        for _ in range(1000):
            robot.step()
            s = robot.snapshot()
            heights.append(s['height']); tilts.append(s['tilt']); contacts.append(s['contacts'])
        s = robot.snapshot()
        results.append({'case': name, 'command': command, 'seconds': s['time'],
                        'finalPositionM': s['basePosition'], 'travelM': float(np.linalg.norm(s['basePosition'][:2])),
                        'finalTiltDeg': s['tilt'], 'maxTiltDeg': max(tilts), 'minTrunkHeightMm': min(heights),
                        'maxContacts': max(contacts), 'finite': bool(np.isfinite(robot.data.qpos).all())})
    report = {'recordedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'sourceLock': json.loads((ROOT / 'upstream.lock.json').read_text()),
              'environment': 'CPU MuJoCo 3.10.0, BAM M6 (7.4 V model only), ONNX Runtime 1.24.4',
              'physicsHz': 200, 'controlHz': 50, 'freshGpuTraining': False,
              'hardwareTested': False, 'results': results}
    path = ROOT / 'docs/validation-results.json'
    path.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
