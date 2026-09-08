import { useState } from "react";
import basis from "../hardware/china-cost-basis.json";

const usd = (value: number) => value.toLocaleString("en-US", {
  style: "currency", currency: "USD",
});
const number = (value: string) => value.trim() === "" ? NaN : Number(value);

export default function LandedCostCalculator() {
  const [goods, setGoods] = useState(String(basis.chinaBearingGoodsCny));
  const [exchange, setExchange] = useState(String(basis.cnyPerUsd));
  const [baseline, setBaseline] = useState(String(basis.usBearingBasketUsd));
  const [extra, setExtra] = useState("");
  const [target, setTarget] = useState(String(basis.targetSavingPercent));
  const values = [number(goods), number(exchange), number(baseline), number(target)];
  const [goodsCny, rate, usTotal, targetPercent] = values;
  const valid = values.every(Number.isFinite) && goodsCny >= 0 && rate > 0 &&
    usTotal > 0 && targetPercent >= 0 && targetPercent <= 100 &&
    Number.isFinite(goodsCny / rate);
  const goodsUsd = goodsCny / rate;
  const headroom = usTotal * (1 - targetPercent / 100) - goodsUsd;
  const extras = number(extra);
  const landed = goodsUsd + extras;
  const complete = valid && Number.isFinite(extras) && extras >= 0 && Number.isFinite(landed);
  const saving = usTotal - landed;

  return (
    <details className="landed-calculator">
      <summary>Compare China delivered cost</summary>
      <p>
        Starts with the 14-bearing community basket at ¥39.20. Prices are
        unverified September 4 snapshots; generic bearings need a sample fit
        and quality check. The $339.84 US route includes seven spare small
        bearings. It is one available US sourcing route.
      </p>
      <div className="landed-fields">
        <label>China goods (CNY)
          <input type="number" min="0" step="0.01" value={goods}
            onChange={e => setGoods(e.target.value)} />
        </label>
        <label>CNY per USD
          <input type="number" min="0.0001" step="0.0001" value={exchange}
            onChange={e => setExchange(e.target.value)} />
        </label>
        <label>US comparison total (USD)
          <input type="number" min="0.01" step="0.01" value={baseline}
            onChange={e => setBaseline(e.target.value)} />
        </label>
        <label>Other delivered charges (USD)
          <input type="number" min="0" step="0.01" placeholder="Enter quote total"
            value={extra} onChange={e => setExtra(e.target.value)} />
        </label>
        <label>Savings target (%)
          <input type="number" min="0" max="100" step="1" value={target}
            onChange={e => setTarget(e.target.value)} />
        </label>
      </div>
      <p>
        Include China domestic and international freight, agent/payment fees,
        insurance, duty, tax and handling in other charges. Count each charge
        once if included in a DDP quote. Replace the US baseline with a delivered
        quote for the same quantities. FX reference: {basis.fxDate}; the 20%
        target is an editable planning choice.
      </p>
      <div className="landed-results" role="status" aria-live="polite">
        {!valid ? <p>Enter nonnegative goods cost, positive exchange rate and US total, and a target from 0 to 100%.</p> : <>
          <div><span>China goods only</span><strong>{usd(goodsUsd)}</strong>
            <small>Freight and import charges excluded</small></div>
          <div><span>Extra-charge budget for {targetPercent}% saving</span>
            <strong>{headroom >= 0 ? usd(headroom) : "Target exceeded"}</strong>
            <small>{headroom >= 0 ? "Maximum combined additional charges" : "Goods alone exceed the target cost"}</small></div>
          <div><span>Delivered-cost scenario</span>
            {complete ? <>
              <strong>{usd(landed)}</strong>
              <small>{saving >= 0
                ? usd(saving) + " lower (" + (saving / usTotal * 100).toFixed(1) + "%)"
                : usd(-saving) + " higher (" + (-saving / usTotal * 100).toFixed(1) + "%)"}</small>
            </> : <><strong>{extra === "" ? "Charges pending" : "Invalid charges"}</strong><small>Enter a nonnegative total for all other delivered charges.</small></>}
          </div>
        </>}
      </div>
      <p>
        This scenario covers the selected basket only. See the{" "}
        <a href="/docs/PROCUREMENT_CN.html">China guide</a> for both bearing
        recipes, spare quantities, supplier links and compatibility limits.
      </p>
    </details>
  );
}
