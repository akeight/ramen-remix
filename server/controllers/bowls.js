// server/bowls.js
import { pool } from '../config/database.js';

// helper: read one bowl + protein ids
async function readFullBowl(id) {
  const { rows } = await pool.query(
    `
    WITH p AS (
      SELECT bp.bowl_id, COALESCE(array_agg(bp.protein_id ORDER BY bp.protein_id), '{}') AS proteins
      FROM bowl_proteins bp
      WHERE bp.bowl_id = $1
      GROUP BY bp.bowl_id
    )
    SELECT b.id, b.user_id, b.name,
           b.broth_id, b.noodle_id, b.heat_id,
           b.created_at, b.updated_at,
           COALESCE(p.proteins, '{}') AS proteins
    FROM bowls b
    LEFT JOIN p ON p.bowl_id = b.id
    WHERE b.id = $1
    `,
    [id]
  );
  return rows[0] || null;
}

// GET /api/bowls?userId=
export async function listBowls(req, res) {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    const sql = userId
      ? `SELECT id, user_id, name, broth_id, noodle_id, heat_id, created_at, updated_at
         FROM bowls WHERE user_id=$1 ORDER BY created_at DESC`
      : `SELECT id, user_id, name, broth_id, noodle_id, heat_id, created_at, updated_at
         FROM bowls ORDER BY created_at DESC`;
    const { rows } = await pool.query(sql, userId ? [userId] : []);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ServerError" });
  }
}

// GET /api/bowls/:id
export async function getBowl(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    const bowl = await readFullBowl(id);
    if (!bowl) return res.status(404).json({ error: "Not found" });
    res.json(bowl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ServerError" });
  }
}

// POST /api/bowls
export async function createBowl(req, res) {
  const client = await pool.connect();
  try {
    const {
      userId = null,
      name = null,
      brothId = null,
      noodleId = null,
      heatId = null,
      proteins = []
    } = req.body || {};

    await client.query("BEGIN");

    const ins = await client.query(
      `INSERT INTO bowls (user_id, name, broth_id, noodle_id, heat_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [userId, name, brothId, noodleId, heatId]
    );
    const bowlId = ins.rows[0].id;

    const uniqProteins = Array.from(new Set((proteins || []).filter(Boolean)));
    if (uniqProteins.length) {
      await client.query(
        `INSERT INTO bowl_proteins (bowl_id, protein_id)
         SELECT $1, UNNEST($2::text[])`,
        [bowlId, uniqProteins]
      );
    }

    await client.query("COMMIT");
    const full = await readFullBowl(bowlId);
    res.status(201).json(full);
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error(err);
    if (err.code === "23503") {
      return res.status(400).json({ error: "BadReference", message: "Unknown broth/noodle/heat/protein id." });
    }
    res.status(409).json({ error: "Conflict", message: err.message });
  } finally {
    client.release();
  }
}

// PATCH /api/bowls/:id
export async function updateBowl(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  const client = await pool.connect();
  try {
    const current = await readFullBowl(id);
    if (!current) return res.status(404).json({ error: "Not found" });

    const name     = (req.body.hasOwnProperty("name")     ? req.body.name     : current.name)      ?? null;
    const userId   = (req.body.hasOwnProperty("userId")   ? req.body.userId   : current.user_id)   ?? null;
    const brothId  = (req.body.hasOwnProperty("brothId")  ? req.body.brothId  : current.broth_id)  ?? null;
    const noodleId = (req.body.hasOwnProperty("noodleId") ? req.body.noodleId : current.noodle_id) ?? null;
    const heatId   = (req.body.hasOwnProperty("heatId")   ? req.body.heatId   : current.heat_id)   ?? null;

    const proteinsProvided = req.body.hasOwnProperty("proteins");
    const finalProteins = proteinsProvided
      ? Array.from(new Set((req.body.proteins || []).filter(Boolean)))
      : (current.proteins || []);

    await client.query("BEGIN");

    await client.query(
      `UPDATE bowls
       SET user_id=$2, name=$3, broth_id=$4, noodle_id=$5, heat_id=$6, updated_at=NOW()
       WHERE id=$1`,
      [id, userId, name, brothId, noodleId, heatId]
    );

    if (proteinsProvided) {
      await client.query(`DELETE FROM bowl_proteins WHERE bowl_id=$1`, [id]);
      if (finalProteins.length) {
        await client.query(
          `INSERT INTO bowl_proteins (bowl_id, protein_id)
           SELECT $1, UNNEST($2::text[])`,
          [id, finalProteins]
        );
      }
    }

    await client.query("COMMIT");
    const full = await readFullBowl(id);
    res.json(full);
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error(err);
    if (err.code === "23503") {
      return res.status(400).json({ error: "BadReference", message: "Unknown broth/noodle/heat/protein id." });
    }
    res.status(409).json({ error: "Conflict", message: err.message });
  } finally {
    client.release();
  }
}

// DELETE /api/bowls/:id
export async function deleteBowl(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    const out = await pool.query(`DELETE FROM bowls WHERE id=$1 RETURNING id`, [id]);
    if (!out.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(out.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(409).json({ error: "Conflict", message: err.message });
  }
}
