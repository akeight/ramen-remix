// server/config/createTables.js
import { pool } from "../config/database.js";

const sql = `
BEGIN;

-- 🔥 Heat levels
CREATE TABLE IF NOT EXISTS heat_levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scoville_hint INTEGER NOT NULL DEFAULT 0
);

-- 🥣 Sizes
CREATE TABLE IF NOT EXISTS sizes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_price_cents INTEGER NOT NULL,
  volume_oz INTEGER
);

-- 🍜 Broths
CREATE TABLE IF NOT EXISTS broths (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_delta_cents INTEGER NOT NULL DEFAULT 0,
  default_heat TEXT REFERENCES heat_levels(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}'
);

-- 🍥 Noodles
CREATE TABLE IF NOT EXISTS noodles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_delta_cents INTEGER NOT NULL DEFAULT 0,
  doneness_options TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}'
);

-- 🥩 Proteins
CREATE TABLE IF NOT EXISTS proteins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_delta_cents INTEGER NOT NULL DEFAULT 0,
  qty INTEGER,
  tags TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}'
);

-- 🧅 Toppings
CREATE TABLE IF NOT EXISTS toppings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_delta_cents INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}'
);

-- ⭐ Preset bowls
CREATE TABLE IF NOT EXISTS preset_bowls (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  thumbnail TEXT,
  size_id TEXT REFERENCES sizes(id) ON DELETE RESTRICT,
  broth_id TEXT REFERENCES broths(id) ON DELETE RESTRICT,
  noodle_id TEXT REFERENCES noodles(id) ON DELETE RESTRICT,
  noodle_doneness TEXT,
  heat_id TEXT REFERENCES heat_levels(id) ON DELETE SET NULL
);

-- Preset relations
CREATE TABLE IF NOT EXISTS preset_bowl_proteins (
  preset_id TEXT REFERENCES preset_bowls(id) ON DELETE CASCADE,
  protein_id TEXT REFERENCES proteins(id) ON DELETE RESTRICT,
  PRIMARY KEY (preset_id, protein_id)
);

CREATE TABLE IF NOT EXISTS preset_bowl_toppings (
  preset_id TEXT REFERENCES preset_bowls(id) ON DELETE CASCADE,
  topping_id TEXT REFERENCES toppings(id) ON DELETE RESTRICT,
  PRIMARY KEY (preset_id, topping_id)
);

COMMIT;
`;

try {
  await pool.query(sql);
  console.log("✅ Tables created.");
  process.exit(0);
} catch (e) {
  console.error("❌ Failed:", e);
  try { await pool.query("ROLLBACK;"); } catch {}
  process.exit(1);
}
