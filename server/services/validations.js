// server/services/validate.service.js
// validations.js (drop-in)
import { pool } from "./database.js";

const MAX_PROTEINS = 3;

export async function validateSelection({ brothId=null, noodleId=null, heatId=null, proteins=[] }) {
  const uniqProteins = Array.from(new Set((proteins || []).filter(Boolean)));
  if (uniqProteins.length > MAX_PROTEINS) {
    return { ok: false, message: `You can select up to ${MAX_PROTEINS} proteins.` };
  }

  const chosen = [];
  if (brothId)  chosen.push({ type: "broth",  id: brothId });
  if (noodleId) chosen.push({ type: "noodle", id: noodleId });
  if (heatId)   chosen.push({ type: "heat",   id: heatId });
  for (const p of uniqProteins) chosen.push({ type: "protein", id: p });

  if (chosen.length < 2) return { ok: true };

  try {
    const types = chosen.map(c => c.type);
    const ids   = chosen.map(c => c.id);
    const { rows } = await pool.query(
      `SELECT left_type, left_id, right_type, right_id, message
       FROM incompatibilities
       WHERE (left_type  = ANY($1) AND left_id  = ANY($2))
          OR (right_type = ANY($1) AND right_id = ANY($2))`,
      [types, ids]
    );

    for (const r of rows) {
      const hasLeft  = chosen.some(c => c.type === r.left_type  && c.id === r.left_id);
      const hasRight = chosen.some(c => c.type === r.right_type && c.id === r.right_id);
      if (hasLeft && hasRight) {
        return { ok: false, message: r.message || "That combination is not allowed." };
      }
    }
  } catch {
    // If the table isn't there yet, don't block the user
  }

  return { ok: true };
}

