// src/api/bowls.js
import { get, post, patch, del } from "./client";

// DB → client camelCase mapper
const mapBowl = (r) => ({
  id: r.id,
  userId: r.user_id ?? null,
  name: r.name ?? null,
  brothId: r.broth_id ?? null,
  noodleId: r.noodle_id ?? null,
  heatId: r.heat_id ?? null,
  proteins: r.proteins ?? [],         // array of protein ids (text[])
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

/** GET /api/bowls?userId= */
export async function listBowls(userId) {
  const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const rows = await get(`/bowls${qs}`);
  return rows.map(mapBowl);
}

/** GET /api/bowls/:id */
export async function getBowl(id) {
  const row = await get(`/bowls/${id}`);
  return mapBowl(row);
}

/** POST /api/bowls */
export async function createBowl({ userId=null, name=null, brothId=null, noodleId=null, heatId=null, proteins=[] }) {
  const payload = { userId, name, brothId, noodleId, heatId, proteins };
  const row = await post("/bowls", payload);
  return mapBowl(row);
}

/** PATCH /api/bowls/:id  (partial update) */
export async function updateBowl(id, patchObj) {
  const row = await patch(`/bowls/${id}`, patchObj);
  return mapBowl(row);
}

/** DELETE /api/bowls/:id */
export async function deleteBowl(id) {
  // server returns { id }, but we just return the id for convenience
  const res = await del(`/bowls/${id}`);
  return res?.id ?? id;
}
