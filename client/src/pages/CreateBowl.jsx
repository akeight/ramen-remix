// src/pages/Builder.jsx
import { useEffect, useMemo, useState } from "react";
import PriceBox from "../components/PriceBox";

export default function CreateBowl() {
  const [catalog, setCatalog] = useState(null);
  const [selection, setSelection] = useState({
    brothId: null,
    noodleId: null,
    proteins: [],
    heatId: null
  });

  // pull options from your API (or import from ramenData for local dev)
  useEffect(() => {
    fetch("/api/catalog")
      .then(r => r.json())
      .then(setCatalog)
      .catch(console.error);
  }, []);

  const toggleProtein = (id) => {
    setSelection(s => {
      const set = new Set(s.proteins);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...s, proteins: [...set] };
    });
  };

  const onBroth = (id) => setSelection(s => ({ ...s, brothId: id || null }));
  const onNoodle = (id) => setSelection(s => ({ ...s, noodleId: id || null }));
  const onHeat   = (id) => setSelection(s => ({ ...s, heatId: id || null }));

  if (!catalog) return <p>Loading…</p>;

  return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 320px", gap:16}}>
      <main>
        <h2>Build your bowl</h2>

        <label>Broth</label>
        <select value={selection.brothId ?? ""} onChange={e => onBroth(e.target.value || null)}>
          <option value="">—</option>
          {catalog.broths.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <label>Noodles</label>
        <select value={selection.noodleId ?? ""} onChange={e => onNoodle(e.target.value || null)}>
          <option value="">—</option>
          {catalog.noodles.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>

        <fieldset style={{marginTop:12}}>
          <legend>Proteins</legend>
          {catalog.proteins.map(p => (
            <label key={p.id} style={{display:"block"}}>
              <input
                type="checkbox"
                checked={selection.proteins.includes(p.id)}
                onChange={() => toggleProtein(p.id)}
              />
              {" "}{p.name}
            </label>
          ))}
        </fieldset>

        <label style={{marginTop:12}}>Heat</label>
        <select value={selection.heatId ?? ""} onChange={e => onHeat(e.target.value || null)}>
          <option value="">—</option>
          {catalog.heatLevels.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </main>

      <PriceBox catalog={catalog} selection={selection} />
    </div>
  );
}
