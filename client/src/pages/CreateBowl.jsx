// src/pages/Builder.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCatalog } from "../api/catalog";
import { createBowl } from "../api/bowls";

const toUSD = (cents) => (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function CreateBowl() {
  const nav = useNavigate();
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brothId: "",
    noodleId: "",
    heatId: "",
    proteins: [],
  });

  useEffect(() => {
    fetchCatalog()
      .then(setCatalog)
      .catch((e) => setError(e.message));
  }, []);

  const toggleProtein = (id) => {
    setForm((f) => {
      const s = new Set(f.proteins);
      s.has(id) ? s.delete(id) : s.add(id);
      return { ...f, proteins: [...s] };
    });
  };

  const price = useMemo(() => {
    if (!catalog) return 0;
    const broth = catalog.broths.find((b) => b.id === form.brothId)?.priceDelta ?? 0;
    const noodle = catalog.noodles.find((n) => n.id === form.noodleId)?.priceDelta ?? 0;
    const proteinSum = form.proteins
      .map((pid) => catalog.proteins.find((p) => p.id === pid)?.priceDelta ?? 0)
      .reduce((a, b) => a + b, 0);
    return broth + noodle + proteinSum;
  }, [catalog, form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createBowl({
        name: form.name || "My Bowl",
        brothId: form.brothId || null,
        noodleId: form.noodleId || null,
        heatId: form.heatId || null,
        proteins: form.proteins || [],
      });
      nav(`/bowls/${created.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <main className="container"><mark className="contrast">{error}</mark></main>;
  if (!catalog) return <main className="container"><progress aria-busy="true" /></main>;

  return (
    <main className="container">
      <article>
        <header>
          <h2>Build-A-Bowl</h2>
          <p>Select options.</p>
        </header>

        <form onSubmit={onSubmit}>
          <div className="grid">
            {/* LEFT: choices */}
            <section>
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Optional"
                />
              </label>

              <label>
                Broth
                <select
                  value={form.brothId}
                  onChange={(e) => setForm({ ...form, brothId: e.target.value })}
                >
                  <option value="">— choose broth —</option>
                  {catalog.broths.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.priceDelta ? `(+${toUSD(b.priceDelta)})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Noodles
                <select
                  value={form.noodleId}
                  onChange={(e) => setForm({ ...form, noodleId: e.target.value })}
                >
                  <option value="">— choose noodles —</option>
                  {catalog.noodles.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} {n.priceDelta ? `(+${toUSD(n.priceDelta)})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend>Proteins</legend>
                {catalog.proteins.map((p) => (
                  <label key={p.id}>
                    <input
                      type="checkbox"
                      checked={form.proteins.includes(p.id)}
                      onChange={() => toggleProtein(p.id)}
                    />
                    {p.name} {p.priceDelta ? `(+${toUSD(p.priceDelta)})` : ""}
                  </label>
                ))}
              </fieldset>

              <label>
                Heat
                <select
                  value={form.heatId}
                  onChange={(e) => setForm({ ...form, heatId: e.target.value })}
                >
                  <option value="">— choose heat —</option>
                  {catalog.heatLevels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </label>
            </section>

            {/* RIGHT: summary */}
            <aside>
              <article>
                <header><strong>Summary</strong></header>
                <ul>
                  <li><b>Name:</b> {form.name || "—"}</li>
                  <li><b>Broth:</b> {form.brothId || "—"}</li>
                  <li><b>Noodles:</b> {form.noodleId || "—"}</li>
                  <li><b>Proteins:</b> {form.proteins.join(", ") || "—"}</li>
                  <li><b>Heat:</b> {form.heatId || "—"}</li>
                </ul>
                <footer>
                  <h3>Total: {toUSD(price)}</h3>
                </footer>
              </article>
            </aside>
          </div>

          <footer>
            <button type="submit" aria-busy={saving}>
              {saving ? "Saving…" : "Save Bowl"}
            </button>
          </footer>
        </form>
      </article>
    </main>
  );
}
