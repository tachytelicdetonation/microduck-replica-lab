#!/usr/bin/env python3
"""Fetch exact source revisions and checksum-verified official policy files."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def run(*args):
    return subprocess.check_output(args, text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--policies-only', action='store_true')
    args = parser.parse_args()
    lock = json.loads((ROOT / 'upstream.lock.json').read_text())
    if not args.policies_only:
        for repo in lock['repos']:
            dest = ROOT / 'upstream' / repo['name']
            if dest.exists():
                current = run('git', '-C', str(dest), 'rev-parse', 'HEAD')
                if current != repo['commit']:
                    raise SystemExit(f'{dest}: expected {repo["commit"]}, found {current}. '
                                     'Move your existing checkout aside before fetching.')
                if run('git', '-C', str(dest), 'status', '--porcelain'):
                    raise SystemExit(f'{dest}: local changes present; leaving them untouched.')
            else:
                dest.mkdir(parents=True)
                run('git', 'init', '--quiet', str(dest))
                run('git', '-C', str(dest), 'remote', 'add', 'origin', repo['url'])
                run('git', '-C', str(dest), 'fetch', '--quiet', '--depth', '1', 'origin', repo['commit'])
                run('git', '-C', str(dest), 'checkout', '--quiet', '--detach', 'FETCH_HEAD')
            print(f'{repo["name"]}: {repo["commit"][:12]}')
    policies = lock['policies']
    dest = ROOT / 'policies'
    dest.mkdir(exist_ok=True)
    for file in policies['files']:
        path = dest / file['file']
        if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest() != file['sha256']:
            url = f'https://huggingface.co/{policies["repo"]}/resolve/{policies["revision"]}/{file["file"]}'
            request = urllib.request.Request(url, headers={'User-Agent': 'MicroduckReplicaLab/0.1'})
            with urllib.request.urlopen(request, timeout=120) as response:
                data = response.read()
            if hashlib.sha256(data).hexdigest() != file['sha256']:
                raise SystemExit(f'Checksum mismatch: {file["file"]}')
            temporary = path.with_suffix(path.suffix + '.tmp')
            temporary.write_bytes(data)
            temporary.replace(path)
        print(f'{file["file"]}: SHA-256 verified')


if __name__ == '__main__':
    main()
