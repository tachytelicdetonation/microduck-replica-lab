import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Box,
  Download,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { bom } from "./data";
import LandedCostCalculator from "./LandedCostCalculator";

type Estimate = { quantity: number; unitPrice: number };
const defaults = Object.fromEntries(
  bom.map((item) => [
    item.id,
    { quantity: item.quantity, unitPrice: item.unitPrice },
  ]),
);
const colors: Record<string, string> = {
  Actuation: "#e9a46e",
  Electronics: "#b9a6ef",
  Power: "#7ecbd3",
  Mechanical: "#c7fa70",
  Sensing: "#b3d7cb",
};
const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function BomPage() {
  const [optional, setOptional] = useState(false);
  const [estimates, setEstimates] = useState<Record<string, Estimate>>(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("microduck.bom.v1") || "{}",
      );
      return Object.fromEntries(
        bom.map((item) => {
          const e = stored[item.id];
          return [
            item.id,
            e &&
            Number.isFinite(e.quantity) &&
            e.quantity >= 0 &&
            Number.isFinite(e.unitPrice) &&
            e.unitPrice >= 0
              ? e
              : defaults[item.id],
          ];
        }),
      );
    } catch {
      return defaults;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("microduck.bom.v1", JSON.stringify(estimates));
    } catch {
      /* In-memory editing still works. */
    }
  }, [estimates]);
  const items = bom.filter((item) => optional || !item.optional);
  const total = items.reduce(
    (sum, item) =>
      sum + estimates[item.id].quantity * estimates[item.id].unitPrice,
    0,
  );
  const categories = [...new Set(items.map((i) => i.category))].map(
    (category) => ({
      category,
      value: items
        .filter((i) => i.category === category)
        .reduce(
          (sum, i) =>
            sum + estimates[i.id].quantity * estimates[i.id].unitPrice,
          0,
        ),
    }),
  );
  function edit(id: string, key: keyof Estimate, value: number) {
    if (!Number.isFinite(value) || value < 0 || value > 100000) return;
    setEstimates((old) => ({
      ...old,
      [id]: {
        ...old[id],
        [key]: key === "quantity" ? Math.floor(value) : value,
      },
    }));
  }
  function download() {
    const rows: (string | number)[][] = [
      [
        "Component",
        "Specification",
        "Quantity",
        "Unit estimate USD",
        "Line estimate USD",
        "Optional",
        "Notes",
        "Source",
      ],
    ];
    for (const item of items) {
      const e = estimates[item.id];
      rows.push([
        item.name,
        item.spec,
        e.quantity,
        e.unitPrice,
        (e.quantity * e.unitPrice).toFixed(2),
        item.optional ? "yes" : "no",
        item.note,
        item.source,
      ]);
    }
    rows.push(["TOTAL USD", "", "", "", total.toFixed(2)]);
    const csv = rows
      .map((row) =>
        row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "microduck-parts-estimate.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">04 / COMPONENT COST ESTIMATION</div>
          <h1>Budget the real build.</h1>
          <p>
            A parts list with editable USD allowances, sourcing notes and the
            unresolved items. Replace these estimates with your own supplier
            quotes.
          </p>
        </div>
        <div className="title-actions">
          <a className="button secondary" href="/docs/PROCUREMENT_US.html">
            <ExternalLink size={14} /> US shopping guide
          </a>
          <a className="button secondary" href="/docs/PROCUREMENT_CN.html">
            <ExternalLink size={14} /> China sourcing guide
          </a>
          <button
            className="button secondary"
            onClick={() => setEstimates(defaults)}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button className="button primary" onClick={download}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>
      <section className="procurement-panel" aria-label="US purchasing and printing">
        <div>
          <span className="section-kicker">UNITED STATES / SUPPLIERS & SERVICES</span>
          <h2>Buy the parts. Have the prints delivered.</h2>
          <p>
            Product links, tools, wiring, small hardware and custom-board services
            are in the shopping guide. Quote the individual parts in millimetres:
            30 reference designs, 36 modeled pieces. Start with a fit-check batch.
          </p>
          <div className="supplier-links">
            <a href="https://www.robotis.us/dynamixel-xl330-m288-t/" target="_blank" rel="noreferrer">ROBOTIS servos <ArrowUpRight size={13} /></a>
            <a href="https://craftcloud3d.com/" target="_blank" rel="noreferrer">Craftcloud printing <ArrowUpRight size={13} /></a>
            <a href="https://www.xometry.com/capabilities/3d-printing-service/" target="_blank" rel="noreferrer">Xometry US <ArrowUpRight size={13} /></a>
            <a href="https://jlcpcb.com/pcb-assembly" target="_blank" rel="noreferrer">PCB assembly <ArrowUpRight size={13} /></a>
          </div>
        </div>
        <div className="procurement-downloads">
          <a className="button primary" href="/models/microduck-print-quote.zip" download><Download size={14} /> Print quote pack</a>
          <a className="button secondary" href="/hardware/procurement-us.csv" download><Download size={14} /> Shopping checklist CSV</a>
          <small>Print fit, the IMU bridge and the power rail still need engineering. The older allowance below excludes outsourced printing and tools; checked servo and bearing orders alone total about $752 on the guide's supplier route.</small>
        </div>
      </section>
      <section className="procurement-panel" aria-label="China sourcing and printing">
        <div>
          <span className="section-kicker">CHINA / SOURCING & US DELIVERY</span>
          <h2>Save on mechanical parts, then verify the landed cost.</h2>
          <p>
            China bearing leads show large potential savings; fastener assortments
            are also worth checking.
            Genuine XL330 servos have no verified China advantage; prints, PCBA,
            freight and import charges need a quote to your US ZIP code.
          </p>
          <div className="supplier-links">
            <a href="https://item.taobao.com/item.htm?id=539024647147" target="_blank" rel="noreferrer">Bearing lead <ArrowUpRight size={13} /></a>
            <a href="https://jlc3dp.com/" target="_blank" rel="noreferrer">JLC3DP printing <ArrowUpRight size={13} /></a>
            <a href="https://www.jlc.com/" target="_blank" rel="noreferrer">JLC China PCBA <ArrowUpRight size={13} /></a>
            <a href="https://www.cbp.gov/trade/basic-import-export/e-commerce/faqs" target="_blank" rel="noreferrer">CBP import rules <ArrowUpRight size={13} /></a>
          </div>
        </div>
        <div className="procurement-downloads">
          <a className="button primary" href="/docs/PROCUREMENT_CN.html">
            <ExternalLink size={14} /> Open China comparison
          </a>
          <a className="button secondary" href="/hardware/procurement-cn.csv" download>
            <Download size={14} /> China comparison CSV
          </a>
          <small>Illustrative bearing goods prices are ¥39.20–70 for 14 pieces. Confirm SKU, shipping, agent fees, duty and tax before ordering.</small>
        </div>
      </section>
      <LandedCostCalculator />
      <div className="cost-overview">
        <div className="cost-total">
          <span>
            {optional ? "CORE + OPTIONAL PARTS" : "CORE BUILD ALLOWANCE"}
          </span>
          <strong data-testid="bom-total">
            {money(total)}
            <small> USD</small>
          </strong>
          <p>
            Planning estimate. Excludes tax, shipping, tools, labour and
            prototype iterations.
          </p>
          <div className="cost-stacked">
            {categories.map((c) => (
              <i
                key={c.category}
                style={{
                  width: `${total ? (c.value / total) * 100 : 0}%`,
                  background: colors[c.category],
                }}
              />
            ))}
          </div>
          <span className="small-muted">
            Your edits are saved in this browser.
          </span>
        </div>
        <div className="cost-breakdown">
          {categories.map((c) => (
            <div key={c.category}>
              <span
                className="break-dot"
                style={{ background: colors[c.category] }}
              />
              <span>{c.category}</span>
              <strong>{money(c.value)}</strong>
              <small>{total ? Math.round((c.value / total) * 100) : 0}%</small>
            </div>
          ))}
        </div>
        <div className="cost-caveat">
          <Box size={23} />
          <div>
            <strong>The servo price sets the budget.</strong>
            <span>
              The Sep 4 community BOM reports US pricing of $27.49 each. EU
              prices in that source use euros. PCB assembly and a validated IMU
              bridge can add substantial cost.
            </span>
          </div>
        </div>
      </div>
      <div className="bom-header">
        <div>
          <span className="section-kicker">PURCHASING WORKSHEET</span>
          <h2>Start with the walking core.</h2>
        </div>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={optional}
            onChange={(e) => setOptional(e.target.checked)}
          />
          <span />
          Include optional perception
        </label>
      </div>
      <div className="bom-table">
        <div className="bom-thead editable">
          <span>COMPONENT</span>
          <span>QTY</span>
          <span>UNIT / USD</span>
          <span>SUBTOTAL</span>
          <span>SOURCING BASIS</span>
          <span />
        </div>
        {items.map((item) => (
          <div className="bom-row editable" key={item.id}>
            <div className="bom-name">
              <span className={`bom-icon ${item.category.toLowerCase()}`}>
                <Box size={15} />
              </span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.spec}</small>
              </div>
            </div>
            <input
              type="number"
              aria-label={`${item.name} quantity`}
              min="0"
              max="100000"
              step="1"
              value={estimates[item.id].quantity}
              onChange={(e) =>
                edit(item.id, "quantity", Number(e.target.value))
              }
            />
            <input
              type="number"
              aria-label={`${item.name} unit price`}
              min="0"
              max="100000"
              step="0.01"
              value={estimates[item.id].unitPrice}
              onChange={(e) =>
                edit(item.id, "unitPrice", Number(e.target.value))
              }
            />
            <strong className="bom-price">
              {money(
                estimates[item.id].unitPrice * estimates[item.id].quantity,
              )}
            </strong>
            <span className="bom-note">{item.note}</span>
            <a
              href={item.source}
              title={`Source for ${item.name}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
      <div className="bom-foot">
        <span>
          Quantities for bought parts still require a physical fit check.
        </span>
        <a href="/docs/BOM.md">
          Cost basis & open items <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="info-banner">
        <Box size={18} />
        <div>
          <strong>The complete shopping list goes beyond this allowance.</strong>
          <span>
            Include service quotes for printing and PCB assembly, bench tools,
            charger, harness work, shipping, tax and prototype revisions. The US
            shopping guide identifies products, supplier searches and unresolved
            custom components.
          </span>
        </div>
      </div>
    </>
  );
}
