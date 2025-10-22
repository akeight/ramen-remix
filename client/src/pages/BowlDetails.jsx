import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBowl, deleteBowl } from "../api/bowls";

export default function BowlDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [bowl, setBowl] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getBowl(id).then(setBowl).catch((e) => setErr(e.message));
  }, [id]);

  const onDelete = async () => {
    try {
      await deleteBowl(id);
      nav("/bowls");
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  if (err) return <main className="container"><mark className="contrast">{err}</mark></main>;
  if (!bowl) return <main className="container"><progress aria-busy="true" /></main>;

  return (
    <main className="container">
      <article>
        <header>
          <h2>{bowl.name || `Bowl #${bowl.id}`}</h2>
          <p>Bowl ID Number: {bowl.id}</p>
        </header>
        <ul>
          <li><b>Broth:</b> {bowl.brothId || "—"}</li>
          <li><b>Noodles:</b> {bowl.noodleId || "—"}</li>
          <li><b>Proteins:</b> {bowl.proteins?.join(", ") || "—"}</li>
          <li><b>Heat:</b> {bowl.heatId || "—"}</li>
        </ul>
        <footer className="grid">
          <Link role="button" className="secondary" to={`/bowls/edit/${bowl.id}`}>Edit</Link>
          <button className="contrast" onClick={onDelete}>Delete</button>
          <Link role="button" to="/bowls">Back</Link>
        </footer>
      </article>
    </main>
  );
}
