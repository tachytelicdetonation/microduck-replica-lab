#!/usr/bin/env python3
"""Start the real Rust robotd against fake I/O and verify its JSON-RPC health."""
import json
from pathlib import Path
import socket
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]


def main():
    binary = ROOT / 'upstream/microduck/target/debug/robotd'
    if not binary.exists():
        raise SystemExit('Build first: cd upstream/microduck && cargo build --locked -p robotd -p robotctl')
    with tempfile.TemporaryDirectory(prefix='microduck-runtime-') as temp:
        sock = Path(temp) / 'robotd.sock'
        with (Path(temp) / 'robotd.log').open('w+') as log:
            process = subprocess.Popen([str(binary), '--fake', '--no-policy', '--socket', str(sock)], stdout=log, stderr=log)
            try:
                deadline = time.monotonic() + 10
                result = None
                while time.monotonic() < deadline:
                    if process.poll() is not None:
                        log.seek(0)
                        raise RuntimeError(log.read())
                    if sock.exists():
                        with socket.socket(socket.AF_UNIX) as client:
                            client.settimeout(2)
                            client.connect(str(sock))
                            client.sendall(b'{"jsonrpc":"2.0","id":1,"method":"robot.health"}\n')
                            result = json.loads(client.makefile('rb').readline())
                        if result.get('result', {}).get('healthy'):
                            break
                    time.sleep(0.1)
                if not result or not result.get('result', {}).get('healthy'):
                    raise RuntimeError(f'robotd did not become healthy: {result}')
                report = {'mode': 'official robotd --fake --no-policy', 'hardwareTested': False, **result}
                output = ROOT / 'artifacts/runtime-health.json'
                output.parent.mkdir(exist_ok=True)
                output.write_text(json.dumps(report, indent=2) + '\n')
                print(json.dumps(report, indent=2))
            finally:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()


if __name__ == '__main__':
    main()
