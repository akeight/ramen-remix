// src/components/PriceBox.jsx
import { computeTotalCents, computeBreakdown, formatUSD } from "../lib/pricing";

export default function PriceBox({ catalog, selection }) {
  const totalCents = computeTotalCents(catalog, selection);
  const b = computeBreakdown(catalog, selection);

  return (
    <aside className="price-box" style={{border:"1px solid #eee", padding:"12px", borderRadius:8}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>Base</span><strong>{formatUSD(b.base_cents)}</strong>
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>Broth</span><strong>{formatUSD(b.broth_cents)}</strong>
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <span>Noodles</span><strong>{formatUSD(b.noodle_cents)}</strong>
      </div>
      {b.proteins.map(p => (
        <div key={p.id} style={{display:"flex", justifyContent:"space-between"}}>
          <span>{p.name}</span><strong>{formatUSD(p.cents)}</strong>
        </div>
      ))}
      <hr />
      <div style={{display:"flex", justifyContent:"space-between", fontSize:18}}>
        <span>Total</span><strong>{formatUSD(totalCents)}</strong>
      </div>
    </aside>
  );
}
