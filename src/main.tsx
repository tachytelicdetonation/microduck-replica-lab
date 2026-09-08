import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import RobotViewer from "./RobotViewer";
import SimulationPage from "./SimulationPage";
import BomPage from "./BomPage";
import GuidePage from "./GuidePage";
import {
  ArrowUpRight,
  Box,
  Check,
  ChevronRight,
  Cpu,
  Download,
  ExternalLink,
  Gamepad2,
  Gauge,
  GitBranch,
  Layers3,
  Menu,
  RotateCcw,
  ScanLine,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { groups, services, sources } from "./data";
import type { Manifest, Part, SimState, Tab } from "./types";
import "./styles.css";

const fallbackManifest: Manifest = {
  revision: "",
  partCount: 0,
  uniqueMeshCount: 0,
  modelMassGrams: 0,
  boundsMm: [],
  parts: [],
  bodies: [],
  joints: [],
};

function App() {
  const [tab, setTab] = useState<Tab>("assembly");
  const [manifest, setManifest] = useState<Manifest>(fallbackManifest);
  const [state, setState] = useState<SimState | null>(null);
  const [serverOnline, setServerOnline] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    fetch("/models/manifest.json")
      .then((r) => {
        if (!r.ok)
          throw new Error(
            "Model manifest is missing. Run scripts/export_models.py to rebuild the design assets.",
          );
        return r.json();
      })
      .then(setManifest)
      .catch((e) => setLoadError(e.message));
  }, []);
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const r = await fetch("/api/state");
        if (!r.ok) throw new Error();
        const next = await r.json();
        if (alive) {
          setState(next);
          setServerOnline(true);
        }
      } catch {
        if (alive) setServerOnline(false);
      }
    };
    poll();
    const id = window.setInterval(poll, tab === "simulation" ? 60 : 3000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [tab]);
  const control = async (
    action: string,
    payload: Record<string, unknown> = {},
  ) => {
    const r = await fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || "Control request failed");
    setState(result);
  };
  const current =
    tab === "assembly"
      ? "Assembly"
      : tab === "simulation"
        ? "Simulation"
        : tab === "architecture"
          ? "Architecture"
          : tab === "parts"
            ? "Parts & costs"
            : "Build guide";
  return (
    <div className="app-shell">
      <Sidebar
        active={tab}
        setActive={setTab}
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />
      <main className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="crumb">
            <span className="dim">WORKBENCH</span>
            <ChevronRight size={14} />
            <span>{current.toUpperCase()}</span>
          </div>
          <div className="top-actions">
            <span
              className={serverOnline ? "live-dot online" : "live-dot"}
            ></span>
            <span className="top-status">
              {serverOnline ? "SIM ONLINE" : "DESIGN MODE"}
            </span>
            <a
              href="https://github.com/pollen-robotics/microduck"
              target="_blank"
              rel="noreferrer"
              className="icon-button"
              title="Open upstream repository"
            >
              <GitBranch size={17} />
            </a>
          </div>
        </header>
        <div className="content">
          {loadError && (
            <div className="inline-error model-error" role="alert">
              {loadError}
            </div>
          )}
          {tab === "assembly" && (
            <AssemblyPage manifest={manifest} setTab={setTab} />
          )}
          {tab === "simulation" && (
            <SimulationPage
              manifest={manifest}
              state={state}
              online={serverOnline}
              control={control}
            />
          )}
          {tab === "architecture" && <ArchitecturePage setTab={setTab} />}
          {tab === "parts" && <BomPage />}
          {tab === "guide" && <GuidePage />}
        </div>
      </main>
    </div>
  );
}

function Sidebar({
  active,
  setActive,
  open,
  close,
}: {
  active: Tab;
  setActive: (tab: Tab) => void;
  open: boolean;
  close: () => void;
}) {
  const nav: [Tab, string, typeof Box][] = [
    ["assembly", "Assembly", Box],
    ["simulation", "Simulation", Gauge],
    ["architecture", "Architecture", Layers3],
    ["parts", "Parts & costs", ScanLine],
    ["guide", "Build guide", Wrench],
  ];
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="duck-mark">
          <span></span>
          <span></span>
        </div>
        <div>
          <strong>MICRODUCK</strong>
          <small>REPLICA LAB</small>
        </div>
        <button className="close-menu" aria-label="Close menu" onClick={close}>
          <X size={18} />
        </button>
      </div>
      <div className="side-label">WORKBENCH</div>
      <nav>
        {nav.map(([id, label, Icon]) => (
          <button
            key={id}
            aria-label={label}
            aria-current={active === id ? "page" : undefined}
            className={`nav-item ${active === id ? "selected" : ""}`}
            onClick={() => {
              setActive(id);
              close();
            }}
          >
            <Icon size={17} />
            <span>{label}</span>
            {id === "assembly" && <span className="nav-count">70</span>}
          </button>
        ))}
      </nav>
      <div className="side-rule" />
      <div className="side-label">REPLICA SERIES</div>
      <div className="source-list">
        {sources.map((source, i) => (
          <a
            href={`https://x.com/tspy/status/${source.id}`}
            target="_blank"
            rel="noreferrer"
            key={source.id}
          >
            <span className="source-index">0{i + 1}</span>
            <span>{source.title}</span>
            <ArrowUpRight size={13} />
          </a>
        ))}
      </div>
      <div className="side-bottom">
        <div className="pin-card">
          <ShieldCheck size={16} />
          <div>
            <strong>PINNED SOURCES</strong>
            <span>4 repositories · 1 policy set</span>
          </div>
        </div>
        <div className="license">
          <span>CC BY-NC-SA 4.0</span>
          <span>Apache-2.0 code</span>
        </div>
      </div>
    </aside>
  );
}

function PageTitle({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "lime" | "orange" | "purple" | "blue";
}) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function AssemblyPage({
  manifest,
  setTab,
}: {
  manifest: Manifest;
  setTab: (tab: Tab) => void;
}) {
  const [selected, setSelected] = useState<Part | null>(null);
  const [explode, setExplode] = useState(0);
  const [group, setGroup] = useState("All");
  const [query, setQuery] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [isolate, setIsolate] = useState(false);
  const filtered = manifest.parts.filter(
    (part) =>
      (group === "All" || part.group === group) &&
      `${part.name} ${part.body} ${part.kind}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="01 / STRUCTURE VISUALIZATION"
        title="A duck, in 70 pieces."
        subtitle="Explore the original MJCF-derived assembly. Select a part to trace its place in the mechanism, then open the manufacturing references."
      >
        <div className="title-actions">
          <button className="button secondary" onClick={() => setTab("guide")}>
            <Wrench size={15} /> Build this duck
          </button>
          <a
            className="button primary"
            href="/models/microduck-designs.zip"
            download
          >
            <Download size={15} /> Download CAD pack
          </a>
        </div>
      </PageTitle>
      <div className="hero-grid">
        <div className="viewer-card">
          <div className="viewer-toolbar">
            <div>
              <span className="section-kicker">LIVE ASSEMBLY VIEW</span>
              <strong>
                {selected ? selected.name : "Full reference assembly"}
              </strong>
            </div>
            <div className="viewer-actions">
              <button
                className="round-button"
                onClick={() => setExplode(explode > 0.2 ? 0 : 0.55)}
                title="Toggle exploded view"
              >
                <Layers3 size={16} />
              </button>
              <button
                className="round-button"
                onClick={() => {
                  setExplode(0);
                  setResetKey((x) => x + 1);
                  setIsolate(false);
                }}
                title="Reset view"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          <RobotViewer
            manifest={manifest}
            explode={explode}
            selected={selected}
            onSelect={setSelected}
            resetKey={resetKey}
            isolate={isolate}
          />
          <div className="explode-control">
            <span>ASSEMBLY</span>
            <input
              aria-label="Assembly explosion"
              style={{ "--fill": `${explode * 100}%` } as React.CSSProperties}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
            />
            <span>EXPLODED</span>
            <strong>{Math.round(explode * 100)}%</strong>
          </div>
        </div>
        <div className="part-detail">
          <div className="detail-top">
            <span className="section-kicker">PART INSPECTOR</span>
            <Pill tone="lime">{manifest.partCount || 70} INSTANCES</Pill>
          </div>
          {selected ? (
            <>
              <div
                className="selected-swatch"
                style={{
                  background: `rgb(${selected.color
                    .slice(0, 3)
                    .map((v) => v * 255)
                    .join(",")})`,
                }}
              ></div>
              <h2>{selected.name}</h2>
              <div className="detail-meta">
                <Pill
                  tone={
                    selected.kind === "Electronics"
                      ? "purple"
                      : selected.kind === "Actuator"
                        ? "orange"
                        : "blue"
                  }
                >
                  {selected.kind.toUpperCase()}
                </Pill>
                <span>{selected.body.replaceAll("_", " ")}</span>
              </div>
              <p>{selected.description}</p>
              <div className="detail-stats">
                <div>
                  <span>DIMENSIONS</span>
                  <strong>
                    {selected.dimensionsMm
                      .map((x) => Math.round(x))
                      .join(" × ")}{" "}
                    <small>mm</small>
                  </strong>
                </div>
                <div>
                  <span>MESH TRIANGLES</span>
                  <strong>{selected.triangles.toLocaleString()}</strong>
                </div>
              </div>
              <button
                className="button secondary isolate-button"
                onClick={() => setIsolate(!isolate)}
              >
                {isolate ? "Show all parts" : "Isolate this part"}
              </button>
              <a className="text-link" href={selected.download} download>
                <Download size={14} /> Download source mesh{" "}
                <ArrowUpRight size={13} />
              </a>
            </>
          ) : (
            <EmptyDetail
              onPick={() => setSelected(manifest.parts[0] || null)}
            />
          )}
        </div>
      </div>
      <div className="section-header">
        <div>
          <span className="section-kicker">COMPONENT INDEX</span>
          <h2>Every instance, accounted for.</h2>
        </div>
        <div className="filter-tabs">
          {["All", ...groups].map((item) => (
            <button
              key={item}
              className={group === item ? "active" : ""}
              onClick={() => setGroup(item)}
            >
              {item === "All" ? "All parts" : item}
            </button>
          ))}
        </div>
      </div>
      <div className="part-search">
        <input
          aria-label="Search parts"
          placeholder="Search 70 parts by name, assembly or material…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span>{filtered.length} parts</span>
      </div>
      <div className="part-grid">
        {filtered.map((part) => (
          <button
            className={`part-card ${selected?.id === part.id ? "active" : ""}`}
            key={part.id}
            onClick={() => setSelected(part)}
          >
            <span className="part-number">
              {String(Number(part.id.slice(5)) + 1).padStart(2, "0")}
            </span>
            <span
              className="part-color"
              style={{
                background: `rgb(${part.color
                  .slice(0, 3)
                  .map((v) => v * 255)
                  .join(",")})`,
              }}
            ></span>
            <span className="part-name">
              <strong>{part.name}</strong>
              <small>{part.body.replaceAll("_", " ")}</small>
            </span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
      <div className="info-banner">
        <Sparkles size={18} />
        <div>
          <strong>
            Source geometry is a reference, not a manufacturing drawing.
          </strong>
          <span>
            Verify fit, threads, inserts, heat, cable clearance and material
            choice against physical parts before printing a full set.
          </span>
        </div>
        <a href="/docs/MECHANICAL.md">
          Read the fit checklist <ArrowUpRight size={13} />
        </a>
      </div>
    </>
  );
}

function EmptyDetail({ onPick }: { onPick: () => void }) {
  return (
    <div className="empty-detail">
      <div className="empty-orb">
        <Box size={27} />
      </div>
      <h2>Pick a part to inspect</h2>
      <p>
        Click a component in the 3D view or index to see its mesh, body and
        dimensions.
      </p>
      <button className="button secondary" onClick={onPick}>
        Select first part
      </button>
    </div>
  );
}

function ArchitecturePage({ setTab }: { setTab: (tab: Tab) => void }) {
  return (
    <>
      <PageTitle
        eyebrow="03 / SOFTWARE ARCHITECTURE"
        title="Intent in. Safe torque out."
        subtitle="Microduck keeps the real-time loop small and privileged. Every peripheral proposes an intent; robotd is the only process allowed to command the 15-servo bus."
      >
        <div className="title-actions">
          <Pill tone="lime">RUST WORKSPACE</Pill>
          <a
            className="button secondary"
            href="https://github.com/pollen-robotics/microduck"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={15} /> Source
          </a>
        </div>
      </PageTitle>
      <div className="arch-hero">
        <div className="arch-diagram">
          <div className="diagram-label">EXTERNAL INPUTS</div>
          <div className="input-row">
            <ArchNode icon={<Gamepad2 size={17} />} name="padd" sub="gamepad" />
            <ArchNode icon={<Zap size={17} />} name="btd" sub="BLE" />
            <ArchNode
              icon={<Settings2 size={17} />}
              name="configd"
              sub="identity"
            />
          </div>
          <div className="wire-stack">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div className="intent-chip">
            <span>JSON-RPC 2.0 · Unix domain socket</span>
            <strong>ABSTRACT MOTION INTENT</strong>
          </div>
          <div className="wire-main">
            <i></i>
          </div>
          <div className="robotd-node">
            <div className="robotd-pulse">
              <Cpu size={22} />
            </div>
            <div>
              <strong>robotd</strong>
              <span>50 Hz policy + safety loop</span>
            </div>
            <Pill tone="lime">PRIVILEGED</Pill>
          </div>
          <div className="wire-main down">
            <i></i>
          </div>
          <div className="servo-row">
            {["20–24", "30–34", "10–14"].map((label, i) => (
              <div key={label}>
                <div className="servo-bunch">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <i key={n}></i>
                  ))}
                </div>
                <span>{label}</span>
                <small>
                  {i === 1
                    ? "head + mouth"
                    : i === 0
                      ? "left leg"
                      : "right leg"}
                </small>
              </div>
            ))}
          </div>
        </div>
        <div className="arch-notes">
          <div className="note-card lime">
            <ShieldCheck size={17} />
            <div>
              <strong>Single writer</strong>
              <p>
                robotd owns motor targets. A gamepad or script cannot bypass its
                limits.
              </p>
            </div>
          </div>
          <div className="note-card purple">
            <Sparkles size={17} />
            <div>
              <strong>Shared policy contract</strong>
              <p>
                61 observations → 14 actions. The mouth lives outside the
                walking action array.
              </p>
            </div>
          </div>
          <div className="note-card orange">
            <RotateCcw size={17} />
            <div>
              <strong>Self-healing delivery</strong>
              <p>
                updaterd verifies signatures, health-checks the new release, and
                rolls back on failure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="service-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">DAEMON MATRIX</span>
            <h2>Seven focused services.</h2>
          </div>
          <button className="text-link" onClick={() => setTab("simulation")}>
            Open simulator <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="service-table">
          {services.map((service, i) => (
            <a
              className="service-row"
              key={service.name}
              href={`https://github.com/pollen-robotics/microduck/blob/5984efb770855432b03dafd3d879e9929981e45b/${service.source}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="service-num">0{i + 1}</span>
              <div className="service-name">
                <strong>{service.name}</strong>
                <small>{service.label}</small>
              </div>
              <Pill tone={i === 0 ? "lime" : i === 6 ? "orange" : "neutral"}>
                {service.tag}
              </Pill>
              <p>{service.description}</p>
              <code>{service.source}</code>
              <ChevronRight size={16} />
            </a>
          ))}
        </div>
      </div>
      <div className="contract-strip">
        <div>
          <span className="section-kicker">ONNX DEPLOYMENT CONTRACT</span>
          <strong>
            [1, 61] float32 <span>→</span> [1, 14] float32
          </strong>
        </div>
        <div className="contract-items">
          <span>
            <Check size={14} /> normalizer baked in
          </span>
          <span>
            <Check size={14} /> warm-up before 50 Hz
          </span>
          <span>
            <Check size={14} /> NaN targets rejected
          </span>
        </div>
      </div>
    </>
  );
}
function ArchNode({
  icon,
  name,
  sub,
}: {
  icon: React.ReactNode;
  name: string;
  sub: string;
}) {
  return (
    <div className="arch-node">
      <span>{icon}</span>
      <strong>{name}</strong>
      <small>{sub}</small>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
