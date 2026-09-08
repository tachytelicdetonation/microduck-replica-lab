#!/usr/bin/env python3
"""Run the pinned upstream PPO recipe, always with a short smoke test first."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
RL = ROOT / 'upstream/microduck_rl'
TASK = 'Mjlab-Velocity-Flat-MicroDuck'


def commands(uv, smoke, iterations, envs, seed):
    base = [uv, 'run', '--locked', 'train', TASK]
    short = base + ['--env.scene.num-envs', '64', '--agent.max-iterations', '5',
                    '--agent.seed', str(seed), '--agent.run-name', 'replica-smoke']
    full = base + ['--env.scene.num-envs', str(envs), '--agent.max-iterations', str(iterations),
                   '--agent.seed', str(seed), '--agent.run-name', 'replica-flat']
    return [short] if smoke else [short, full]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--smoke', action='store_true', help='64 environments, 5 iterations only')
    parser.add_argument('--iterations', type=int, default=5000)
    parser.add_argument('--envs', type=int, default=4096)
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--dry-run', action='store_true', help='Print the exact commands without installing or training')
    args = parser.parse_args()
    if not 1 <= args.iterations <= 100000 or not 1 <= args.envs <= 16384:
        parser.error('iterations must be 1–100000 and envs 1–16384.')
    uv = shutil.which('uv') or 'uv'
    plan = commands(uv, args.smoke, args.iterations, args.envs, args.seed)
    if args.dry_run:
        print(f'Working directory: {RL}')
        for command in [[uv, 'sync', '--locked'], *plan]:
            print(' '.join(command))
        return
    if not shutil.which('nvidia-smi'):
        raise SystemExit('A CUDA GPU is required for upstream MuJoCo Warp training. '
                         'No training was started. CPU playback: uv run python -m lab.simulate')
    if not shutil.which('uv'):
        raise SystemExit('Install uv before running the training recipe.')
    lock = json.loads((ROOT / 'upstream.lock.json').read_text())
    expected = next(r['commit'] for r in lock['repos'] if r['name'] == 'microduck_rl')
    actual = subprocess.check_output(['git', '-C', str(RL), 'rev-parse', 'HEAD'], text=True).strip()
    if expected != actual:
        raise SystemExit(f'Unexpected training source revision: {actual}')
    subprocess.run([uv, 'sync', '--locked'], cwd=RL, check=True)
    subprocess.run([uv, 'run', '--locked', 'python', '-c',
                    'import torch; assert torch.cuda.is_available(), "CUDA is unavailable"; print(torch.cuda.get_device_name(0))'], cwd=RL, check=True)
    out = ROOT / 'artifacts/training'
    out.mkdir(parents=True, exist_ok=True)
    report = {'task': TASK, 'revision': expected, 'started': time.time(), 'commands': plan, 'completed': []}
    (out / 'run.json').write_text(json.dumps(report, indent=2))
    for command in plan:
        subprocess.run(command, cwd=RL, check=True)
        report['completed'].append(command)
        (out / 'run.json').write_text(json.dumps(report, indent=2))
    print('Training finished. Export through upstream scripts/export.py; see docs/TRAINING.md.')


if __name__ == '__main__':
    main()
