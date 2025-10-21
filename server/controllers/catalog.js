// server/controllers/bowls.js
// server/controllers/catalog.js
import { pool } from "../config/database.js";

export async function getCatalog(_req, res) {
  try {
    const [broths, noodles, proteins, heat] = await Promise.all([
      pool.query("SELECT * FROM broths ORDER BY name ASC"),
      pool.query("SELECT * FROM noodles ORDER BY name ASC"),
      pool.query("SELECT * FROM proteins ORDER BY name ASC"),
      pool.query("SELECT * FROM heat_levels ORDER BY scoville_hint ASC")
    ]);

    res.json({
      broths: broths.rows,
      noodles: noodles.rows,
      proteins: proteins.rows,
      heatLevels: heat.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ServerError", message: "Failed to load catalog" });
  }
}
