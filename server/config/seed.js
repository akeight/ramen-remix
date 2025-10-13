// server/config/seed.js
import { pool } from "../config/database.js";
import ramen from "../../ramenData.js";

const insertMany = async (text, rows) => {
  if (!rows?.length) return;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const r of rows) {
      await client.query(text, r);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

try {
  // heat_levels
  await insertMany(
    `INSERT INTO heat_levels (id,name,scoville_hint)
     VALUES ($1,$2,$3)
     ON CONFLICT (id) DO NOTHING`,
    (ramen.heatLevels ?? []).map(h => [h.id, h.name, h.scovilleHint ?? 0])
  );

  // sizes
  await insertMany(
    `INSERT INTO sizes (id,name,base_price_cents,volume_oz)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (id) DO NOTHING`,
    (ramen.sizes ?? []).map(s => [s.id, s.name, s.basePrice, s.volumeOz ?? null])
  );

  // broths
  await insertMany(
    `INSERT INTO broths (id,name,description,price_delta_cents,default_heat,tags,allergens)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (id) DO NOTHING`,
    (ramen.broths ?? []).map(b => [
      b.id,
      b.name,
      b.description ?? null,
      b.priceDelta ?? 0,
      b.defaultHeat ?? null,
      b.tags ?? [],
      b.allergens ?? []
    ])
  );

  // noodles
  await insertMany(
    `INSERT INTO noodles (id,name,price_delta_cents,doneness_options,tags,allergens)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (id) DO NOTHING`,
    (ramen.noodles ?? []).map(n => [
      n.id,
      n.name,
      n.priceDelta ?? 0,
      n.donenessOptions ?? [],
      n.tags ?? [],
      n.allergens ?? []
    ])
  );

  // proteins
  await insertMany(
    `INSERT INTO proteins (id,name,price_delta_cents,qty,tags,allergens)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (id) DO NOTHING`,
    (ramen.proteins ?? []).map(p => [
      p.id,
      p.name,
      p.priceDelta ?? 0,
      p.qty ?? null,
      p.tags ?? [],
      p.allergens ?? []
    ])
  );

  // toppings
  await insertMany(
    `INSERT INTO toppings (id,name,price_delta_cents,tags,allergens)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (id) DO NOTHING`,
    (ramen.toppings ?? []).map(t => [
      t.id,
      t.name,
      t.priceDelta ?? 0,
      t.tags ?? [],
      t.allergens ?? []
    ])
  );

  // presets + joins
  for (const preset of ramen.presetBowls ?? []) {
    await pool.query(
      `INSERT INTO preset_bowls (id,name,thumbnail,size_id,broth_id,noodle_id,noodle_doneness,heat_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO NOTHING`,
      [
        preset.id,
        preset.name,
        preset.thumbnail ?? null,
        preset.selections.size,
        preset.selections.broth,
        preset.selections.noodles.id,
        preset.selections.noodles.doneness ?? null,
        preset.selections.heat ?? null
      ]
    );

    for (const pid of preset.selections.proteins ?? []) {
      await pool.query(
        `INSERT INTO preset_bowl_proteins (preset_id,protein_id)
         VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [preset.id, pid]
      );
    }
    for (const tid of preset.selections.toppings ?? []) {
      await pool.query(
        `INSERT INTO preset_bowl_toppings (preset_id,topping_id)
         VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [preset.id, tid]
      );
    }
  }

  console.log("✅ Seed complete.");
  process.exit(0);
} catch (e) {
  console.error("❌ Seed failed:", e);
  process.exit(1);
}
