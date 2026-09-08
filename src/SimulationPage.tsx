import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Cpu,
  Gauge,
  Gamepad2,
  Pause,
  Play,
  RotateCcw,
  Terminal,
  Zap,
} from "lucide-react";
import RobotViewer from "./RobotViewer";
import type { Manifest, SimState } from "./types";

type Props = {
  manifest: Manifest;
  state: SimState | null;
  online: boolean;
  control: (action: string, payload?: Record<string, unknown>) => Promise<void>;
};

export default function SimulationPage({
  manifest,
  state,
  online,
  control,
}: Props) {
  const [velocity, setVelocity] = useState([0, 0, 0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [samples, setSamples] = useState<
    { time: number; height: number; tilt: number }[]
  >([]);
  const records = useRef<SimState[]>([]);
  useEffect(() => {
    if (!state || !online) return;
    setSamples((old) => {
      if (old.length && old[old.length - 1].time === state.time) return old;
      const next = state.time < (old.at(-1)?.time || 0) ? [] : old;
      return [
        ...next,
        { time: state.time, height: state.height, tilt: state.tilt },
      ].slice(-160);
    });
    if (records.current.at(-1)?.time !== state.time) {
      if (state.time < (records.current.at(-1)?.time || 0))
        records.current = [];
      records.current.push(state);
      if (records.current.length > 10000) records.current.shift();
    }
  }, [state, online]);
  async function send(action: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    setError("");
    try {
      await control(action, payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulator is unavailable.");
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const text =
      records.current.map((s) => JSON.stringify(s)).join("\n") + "\n";
    const url = URL.createObjectURL(
      new Blob([text], { type: "application/x-ndjson" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "microduck-telemetry.jsonl";
    a.click();
    URL.revokeObjectURL(url);
  }
  const disabled = !online || busy;
  const metrics = [
    {
      label: "Trunk height",
      value: online && state ? state.height.toFixed(1) : "—",
      unit: "mm",
      icon: ArrowUpRight,
      note: "measured in simulation",
      tone: "lime",
    },
    {
      label: "Body tilt",
      value: online && state ? state.tilt.toFixed(2) : "—",
      unit: "°",
      icon: Gauge,
      note: "relative to vertical",
      tone: "blue",
    },
    {
      label: "Inference",
      value: online && state ? state.inferenceMs.toFixed(2) : "—",
      unit: "ms",
      icon: Cpu,
      note: "CPU forward pass",
      tone: "purple",
    },
    {
      label: "Contacts",
      value: online && state ? String(state.contacts) : "—",
      unit: "",
      icon: Zap,
      note: "MuJoCo contacts",
      tone: "orange",
    },
  ];
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">02 / TRAINING & SIMULATION</div>
          <h1>A little duck. Real physics.</h1>
          <p>
            Run the official learned policies on the CPU. This rehearsal uses
            MuJoCo, the BAM M6 actuator model and the original robot geometry.
          </p>
        </div>
        <div className="title-actions">
          <span className={`pill pill-${online ? "lime" : "orange"}`}>
            {online ? "CPU SIM CONNECTED" : "SIM OFFLINE"}
          </span>
          <a className="button secondary" href="/docs/SIMULATION.md">
            <Terminal size={15} /> Runbook
          </a>
        </div>
      </div>
      {!online && (
        <div className="offline-card">
          <Terminal size={20} />
          <div>
            <strong>Start the local physics service</strong>
            <p>
              The assembly remains available offline. Run this from the project
              directory, then this page will connect automatically.
            </p>
            <code>uv run python -m lab.server</code>
          </div>
        </div>
      )}
      {(error || state?.fault) && (
        <div className="model-error inline-error" role="alert">
          {error || state?.fault}
        </div>
      )}
      <div className="sim-layout">
        <div className="sim-stage">
          <div className="sim-stage-head">
            <div>
              <span className="section-kicker">
                {online
                  ? "MUJOCO 3.10.0 / BAM M6 / ONNX"
                  : "ORIGINAL CAD / STATIC VIEW"}
              </span>
              <strong>
                {online && state
                  ? `${state.mode.toUpperCase()} POLICY`
                  : "Simulation not connected"}
              </strong>
            </div>
            <div className="sim-controls">
              <button
                className="round-button"
                onClick={() => send("reset")}
                disabled={disabled}
                title="Reset simulation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="play-button"
                disabled={disabled}
                onClick={() => send(state?.paused ? "play" : "pause")}
              >
                {state?.paused || !state ? (
                  <Play size={14} />
                ) : (
                  <Pause size={14} />
                )}
                {state?.paused || !state ? "Run simulation" : "Pause"}
              </button>
            </div>
          </div>
          <RobotViewer manifest={manifest} simulation={online ? state : null} />
          <div className="sim-foot">
            <span>
              <span className="status-dot" />
              {online
                ? ` Simulation time ${state?.time.toFixed(2)} s`
                : " Waiting for simulation"}
            </span>
            <span className="mono">50 HZ CONTROL / 200 HZ PHYSICS</span>
          </div>
        </div>
        <div className="sim-side">
          <div className="telemetry-grid">
            {metrics.map((m) => (
              <div className="metric-card" key={m.label}>
                <div className={`metric-icon ${m.tone}`}>
                  <m.icon size={17} />
                </div>
                <div className="metric-info">
                  <span>{m.label}</span>
                  <strong>
                    {m.value}
                    <small>{m.unit}</small>
                  </strong>
                  <em>{m.note}</em>
                </div>
              </div>
            ))}
          </div>
          <div className="command-card">
            <div className="card-head">
              <div>
                <span className="section-kicker">VELOCITY COMMAND</span>
                <strong>Drive the policy</strong>
              </div>
              <Gamepad2 size={18} />
            </div>
            {["Forward / back", "Sideways", "Turn"].map((label, i) => {
              const max = [0.3, 0.2, 1.5][i];
              return (
                <label className="command-slider" key={label}>
                  <span>
                    <span>{label}</span>
                    <b>
                      {velocity[i].toFixed(2)}{" "}
                      <small>{i === 2 ? "rad/s" : "m/s"}</small>
                    </b>
                  </span>
                  <input
                    aria-label={label}
                    type="range"
                    min={-max}
                    max={max}
                    step={i === 2 ? 0.1 : 0.05}
                    value={velocity[i]}
                    style={
                      {
                        "--fill": `${((velocity[i] + max) / (2 * max)) * 100}%`,
                      } as React.CSSProperties
                    }
                    onChange={(e) =>
                      setVelocity((old) =>
                        old.map((v, n) =>
                          n === i ? Number(e.target.value) : v,
                        ),
                      )
                    }
                  />
                </label>
              );
            })}
            <button
              className="send-command"
              disabled={disabled}
              onClick={() => send("velocity", { velocity })}
            >
              <Zap size={14} /> Apply velocity to simulation
            </button>
            <div className="preset-buttons">
              <button
                disabled={disabled}
                onClick={() => {
                  setVelocity([0.3, 0, 0]);
                  send("velocity", { velocity: [0.3, 0, 0] });
                }}
              >
                Forward 0.30
              </button>
              <button
                disabled={disabled}
                onClick={() => {
                  setVelocity([0, 0, 0]);
                  send("velocity", { velocity: [0, 0, 0] });
                }}
              >
                Stop walking
              </button>
            </div>
          </div>
          <div className="command-card">
            <div className="card-head">
              <div>
                <span className="section-kicker">POSTURE POLICY</span>
                <strong>Sit. Hold. Stand again.</strong>
              </div>
            </div>
            <div className="preset-buttons">
              <button disabled={disabled} onClick={() => send("sit")}>
                Sit down
              </button>
              <button disabled={disabled} onClick={() => send("stand")}>
                Stand up
              </button>
            </div>
            <p className="small-muted">
              The same sit/stand policy handles both postures using its trained
              command flag.
            </p>
          </div>
        </div>
      </div>
      <div className="section-header">
        <div>
          <span className="section-kicker">RECORDED FROM THIS SESSION</span>
          <h2>Balance over time.</h2>
        </div>
        <button
          className="button secondary"
          disabled={!samples.length}
          onClick={download}
        >
          Export telemetry
        </button>
      </div>
      <div className="telemetry-chart">
        <div className="chart-legend">
          <span>
            <i /> Trunk height · mm
          </span>
          <span>
            <i /> Body tilt · °
          </span>
          <span>
            {samples.length
              ? `${samples[0].time.toFixed(1)}–${samples.at(-1)!.time.toFixed(1)} s`
              : "No samples yet"}
          </span>
        </div>
        <svg
          viewBox="0 0 1000 130"
          role="img"
          aria-label="Recent measured trunk height and tilt over time"
          preserveAspectRatio="none"
        >
          {[20, 50, 80, 110].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="1000"
              y2={y}
              stroke="#35403c"
              strokeDasharray="4 5"
            />
          ))}
          <polyline
            fill="none"
            stroke="#c7fa70"
            strokeWidth="2"
            points={samples
              .map(
                (s, i) =>
                  `${(i / Math.max(1, samples.length - 1)) * 1000},${120 - (s.height / 180) * 110}`,
              )
              .join(" ")}
          />
          <polyline
            fill="none"
            stroke="#7ecbd3"
            strokeWidth="2"
            points={samples
              .map(
                (s, i) =>
                  `${(i / Math.max(1, samples.length - 1)) * 1000},${120 - (Math.min(180, s.tilt) / 180) * 110}`,
              )
              .join(" ")}
          />
        </svg>
      </div>
      <div className="info-banner">
        <Gauge size={18} />
        <div>
          <strong>Published-policy limitation</strong>
          <span>
            Forward 0.30 m/s produces locomotion in the tested CPU setup. Lower
            forward speeds, reverse and lateral commands can settle in place.
            Check the recorded movement; a valid policy output alone does not
            prove command tracking.
          </span>
        </div>
        <a href="/docs/VALIDATION.md">Validation results ↗</a>
      </div>
    </>
  );
}
