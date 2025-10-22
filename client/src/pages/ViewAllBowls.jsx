import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listBowls, deleteBowl } from "../api/bowls";

export default function ViewAllBowls() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  const refresh = () => listBowls().then(setRows).catch((e) => setErr(e.message));

  useEffect(() => { refresh(); }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this bowl?")) return;
    try {
      await deleteBowl(id);
      setRows((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  if (err) return <main className="container"><mark className="contrast">{err}</mark></main>;

  return (
    <main className="container">
  <header className="container">
    <h2>All Bowls</h2>
    <p>Browse all your custom ramen bowls here. You can view, edit, or delete any bowl you've created.</p>
  </header>

  {rows.length === 0 ? (
    <article><p>No bowls yet. Create one!</p></article>
  ) : (
    <section className="card-grid">
      {rows.map((b) => (
        <article key={b.id}>
          <header>
            <h3 style={{ margin: 0 }}>
              {`For: ${b.name || "Unnamed Bowl"} | Bowl ID #${b.id}`}
            </h3>
          </header>

          <ul style={{ margin: "0.5rem 0 1rem" }}>
            <p><strong>Broth:</strong> {b.brothId || "—"}</p>
            <p><strong>Noodles:</strong> {b.noodleId || "—"}</p>
            <p><strong>Proteins:</strong> {b.proteins?.length ? b.proteins.join(", ") : "—"}</p>
            <p><strong>Heat:</strong> {b.heatId || "—"}</p>
          </ul>

          <footer className="grid card-actions">
            <Link role="button" className="secondary" to={`/bowls/${b.id}`}>View</Link>
            <Link role="button" to={`/bowls/edit/${b.id}`}>Edit</Link>
            <button className="contrast" onClick={() => onDelete(b.id)}>Delete</button>
          </footer>
        </article>
      ))}
    </section>
  )}
</main>
  );
}