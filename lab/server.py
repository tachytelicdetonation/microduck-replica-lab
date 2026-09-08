"""Local HTTP bridge from the assembly workbench to CPU MuJoCo. No hardware I/O."""
from __future__ import annotations
import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import threading
import time
from pathlib import Path

from lab.robot import Robot, CONTROL_DT


def serve(port=8000, walking=None, standing=None, sitstand=None):
    robot = Robot(walking=walking, standing=standing, sitstand=sitstand)
    lock = threading.Lock()
    stop = threading.Event()

    def physics():
        while not stop.is_set():
            start = time.monotonic()
            with lock:
                if not robot.paused:
                    try:
                        robot.step()
                    except Exception as error:
                        robot.fault = str(error)
                        robot.paused = True
            stop.wait(max(0.001, CONTROL_DT - (time.monotonic() - start)))

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def send_json(self, payload, status=200):
            data = json.dumps(payload, allow_nan=False).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            if self.path not in ('/api/state', '/api/health'):
                return self.send_json({'error': 'Unknown endpoint'}, 404)
            with lock:
                self.send_json(robot.snapshot())

        def do_POST(self):
            if self.path != '/api/control':
                return self.send_json({'error': 'Unknown endpoint'}, 404)
            try:
                length = int(self.headers.get('Content-Length', 0))
                if not 0 < length <= 4096:
                    raise ValueError('Expected a JSON control request, maximum 4096 bytes.')
                payload = json.loads(self.rfile.read(length))
                with lock:
                    action = payload.get('action')
                    if action == 'reset':
                        robot.reset()
                    elif action == 'pause':
                        robot.paused = True
                    elif action == 'play':
                        if robot.fault:
                            raise ValueError('Reset the fault before resuming.')
                        robot.paused = False
                    elif action == 'velocity':
                        robot.set_command(payload['velocity'])
                    elif action == 'sit':
                        robot.set_posture(True)
                    elif action == 'stand':
                        robot.set_posture(False)
                    else:
                        raise ValueError('Unknown action.')
                    self.send_json(robot.snapshot())
            except (ValueError, KeyError, TypeError, AttributeError) as error:
                self.send_json({'error': str(error)}, 400)

    # Loopback by default. Vite proxies /api for the shared browser preview.
    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    threading.Thread(target=physics, daemon=True).start()
    print(f'Microduck CPU simulation at http://127.0.0.1:{port} (paused)', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        stop.set()
        server.server_close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--walking', type=Path)
    parser.add_argument('--standing', type=Path)
    parser.add_argument('--sitstand', type=Path)
    args = parser.parse_args()
    serve(args.port, args.walking, args.standing, args.sitstand)
