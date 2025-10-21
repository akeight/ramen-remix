// server/config/reset.js
import { pool } from "./database.js";
import ramenData from "../data/ramenData.js";
import dotenv from 'dotenv'
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

// If you placed it in server/data/ramenData.js instead, use this line instead:
// import ramenData from "../data/ramenData.js";

// helper to batch insert
const insertMany = async (sql, rows) => {
  if (!rows?.length) return;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const r of rows) await client.query(sql, r);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

async function main() {
  const createSql = `
  BEGIN;

  CREATE TABLE IF NOT EXISTS heat_levels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    scoville_hint INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS broths (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_delta_cents INTEGER DEFAULT 0,
    default_heat TEXT REFERENCES heat_levels(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS noodles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_delta_cents INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS proteins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_delta_cents INTEGER DEFAULT 0,
    qty INTEGER,
    tags TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}'
  );

  -- "CustomItem" table
  CREATE TABLE IF NOT EXISTS bowls (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT,
    broth_id  TEXT REFERENCES broths(id) ON DELETE SET NULL,
    noodle_id TEXT REFERENCES noodles(id) ON DELETE SET NULL,
    heat_id   TEXT REFERENCES heat_levels(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS bowl_proteins (
    bowl_id BIGINT REFERENCES bowls(id) ON DELETE CASCADE,
    protein_id TEXT REFERENCES proteins(id) ON DELETE RESTRICT,
    PRIMARY KEY (bowl_id, protein_id)
  );

  COMMIT;
  `;

  // 1) Create tables
  try {
    await pool.query(createSql);
    console.log("✅ Tables created (heat_levels, broths, noodles, proteins, bowls, bowl_proteins)");
  } catch (e) {
    try { await pool.query("ROLLBACK"); } catch {}
    throw e;
  }

  // 2) Seed from ramenData.js (mapping camelCase → snake_case)
  await insertMany(
    `INSERT INTO heat_levels (id, name, scoville_hint)
     VALUES ($1,$2,$3)
     ON CONFLICT (id) DO NOTHING`,
    (ramenData.heatLevels ?? []).map(h => [h.id, h.name, h.scovilleHint ?? 0])
  );

  await insertMany(
    `INSERT INTO broths (id, name, description, price_delta_cents, default_heat, tags, allergens)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (id) DO NOTHING`,
    (ramenData.broths ?? []).map(b => [
      b.id,
      b.name,
      b.description ?? null,
      b.priceDelta ?? 0,
      b.defaultHeat ?? null,
      b.tags ?? [],
      b.allergens ?? []
    ])
  );

  await insertMany(
    `INSERT INTO noodles (id, name, price_delta_cents, tags, allergens)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (id) DO NOTHING`,
    (ramenData.noodles ?? []).map(n => [
      n.id,
      n.name,
      n.priceDelta ?? 0,
      n.tags ?? [],
      n.allergens ?? []
    ])
  );

  await insertMany(
    `INSERT INTO proteins (id, name, price_delta_cents, qty, tags, allergens)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (id) DO NOTHING`,
    (ramenData.proteins ?? []).map(p => [
      p.id,
      p.name,
      p.priceDelta ?? 0,
      p.qty ?? null,
      p.tags ?? [],
      p.allergens ?? []
    ])
  );

  console.log("✅ Seed complete");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Reset failed:", e.message);
    process.exit(1);
  });

