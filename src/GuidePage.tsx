import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Download,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { stages } from "./data";

export default function GuidePage() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    try {
      const value = JSON.parse(
        localStorage.getItem("microduck.checklist.v1") || "{}",
      );
      return value && typeof value === "object" ? value : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("microduck.checklist.v1", JSON.stringify(checks));
    } catch {
      /* In-memory checklist remains available. */
    }
  }, [checks]);
  const stage = stages[active];
  const total = stages.reduce((n, s) => n + s.tasks.length, 0);
  const done = stages.reduce(
    (n, s, i) =>
      n + s.tasks.filter((_, j) => checks[`${i}.${j}`] === true).length,
    0,
  );
  function move(index: number) {
    setActive(index);
    setCopied(false);
  }
  async function copy() {
    if (!stage.command) return;
    try {
      await navigator.clipboard.writeText(stage.command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">05 / DIY REPLICATION GUIDE</div>
          <h1>From source tree to standing duck.</h1>
          <p>
            Follow six stages from CPU rehearsal to physical testing. Mark each
            item after recording your evidence; progress is saved in this
            browser.
          </p>
        </div>
        <div className="title-actions">
          <span className="pill pill-lime">
            {done} / {total} CHECKED
          </span>
          <a className="button primary" href="/docs/BUILD_GUIDE.md" download>
            <Download size={15} /> Download guide
          </a>
        </div>
      </div>
      <div className="guide-layout">
        <div className="stage-rail">
          {stages.map((s, i) => {
            const complete = s.tasks.every(
              (_, j) => checks[`${i}.${j}`] === true,
            );
            return (
              <button
                key={s.title}
                className={`stage-item ${i === active ? "active" : ""} ${complete ? "visited" : ""}`}
                onClick={() => move(i)}
              >
                <span className="stage-index">
                  {complete ? (
                    <Check size={14} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <div>
                  <strong>{s.title}</strong>
                  <small>{s.duration}</small>
                </div>
                <ChevronRight size={15} />
              </button>
            );
          })}
          <div className="rail-note">
            <span>
              Source-backed steps and open hardware questions are detailed in
              the <a href="/docs/BUILD_GUIDE.md">build guide</a>. US purchase
              links and print-service instructions are in the{" "}
              <a href="/docs/PROCUREMENT_US.html">US shopping guide</a> and{" "}
              <a href="/docs/PROCUREMENT_CN.html">China sourcing comparison</a>.
            </span>
          </div>
        </div>
        <div className="guide-detail">
          <div className="guide-detail-top">
            <div>
              <span className="section-kicker">
                STAGE {String(active + 1).padStart(2, "0")} / {stage.duration}
              </span>
              <h2>{stage.title}</h2>
            </div>
            <span className="guide-progress">
              {active + 1} <i>/</i> {stages.length}
            </span>
          </div>
          <p className="guide-lead">{stage.description}</p>
          <div className="gate-columns">
            <div>
              <span className="section-kicker">EVIDENCE TO COLLECT</span>
              <ul className="check-list">
                {stage.tasks.map((task, j) => (
                  <li key={task}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checks[`${active}.${j}`] === true}
                        onChange={(e) =>
                          setChecks((old) => ({
                            ...old,
                            [`${active}.${j}`]: e.target.checked,
                          }))
                        }
                      />
                      {task}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="command-block">
              <div className="command-head">
                <span>
                  <Terminal size={14} /> REPRODUCE
                </span>
                {stage.command && (
                  <button onClick={copy} aria-label="Copy stage commands">
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              {stage.command ? (
                <pre>{stage.command}</pre>
              ) : (
                <div className="no-command">
                  This step requires physical measurements. Use the hardware
                  worksheet and record the results before proceeding.
                </div>
              )}
            </div>
          </div>
          <div className="guide-footer">
            <a href={stage.link}>
              Open stage runbook <ArrowUpRight size={14} />
            </a>
            <div>
              <button
                className="button secondary"
                disabled={active === 0}
                onClick={() => move(active - 1)}
              >
                Previous
              </button>
              <button
                className="button primary"
                disabled={active === stages.length - 1}
                onClick={() => move(active + 1)}
              >
                Next stage <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hard-stop">
        <ShieldCheck size={18} />
        <div>
          <strong>Physical validation comes before torque.</strong>
          <span>
            Verify the power rail, disconnect, mechanical support and IMU
            bridge. The CPU simulation and fake robotd check do not establish
            physical readiness.
          </span>
        </div>
        <a href="/docs/HARDWARE.md">
          Hardware guide <ArrowUpRight size={13} />
        </a>
      </div>
    </>
  );
}
