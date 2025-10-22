import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCatalog } from "../api/catalog";
import { getBowl, updateBowl } from "../api/bowls";

const toUSD = (cents) => (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function EditBowl() {
  const { id } = useParams();
  const nav = useNavigate();

  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    Promise.all([fetchCatalog(), getBowl(id)])
      .then(([cat, bowl]) => {
        setCatalog(cat);
        setForm({
          name: bowl.name || "",
          brothId: bowl.brothId || "",
          noodleId: bowl.noodleId || "",
          heatId: bowl.heatId || "",
          proteins: bowl.proteins || [],
        });
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const toggleProtein = (pid) => {
    setForm((f) => {
      const s = new Set(f.proteins);
      s.has(pid) ? s.delete(pid) : s.add(pid);
      return { ...f, proteins: [...s] };
    });
  };

  const price = useMemo(() => {
    if (!catalog || !form) return 0;
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
      await updateBowl(id, form);
      nav(`/bowls/${id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <main className="container"><mark className="contrast">{error}</mark></main>;
  if (!catalog || !form) return <main className="container"><progress aria-busy="true" /></main>;

  return (
    <main className="container">
      <article>
        <header>
          <h2>Edit Bowl #{id}</h2>
        </header>

        <form onSubmit={onSubmit}>
          <div className="grid">
            <section>
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </footer>
        </form>
      </article>
    </main>
  );
}
