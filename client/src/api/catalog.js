// src/api/catalog.js
import { get } from "./client";

// map DB snake_case → client camelCase
const mapBroth = (r) => ({
  id: r.id,
  name: r.name,
  description: r.description ?? null,
  priceDelta: r.price_delta_cents ?? 0,
  defaultHeat: r.default_heat ?? null,
  tags: r.tags ?? [],
  allergens: r.allergens ?? [],
});
const mapNoodle = (r) => ({
  id: r.id,
  name: r.name,
  priceDelta: r.price_delta_cents ?? 0,
  tags: r.tags ?? [],
  allergens: r.allergens ?? [],
});
const mapProtein = (r) => ({
  id: r.id,
  name: r.name,
  priceDelta: r.price_delta_cents ?? 0,
  qty: r.qty ?? null,
  tags: r.tags ?? [],
  allergens: r.allergens ?? [],
});
const mapHeat = (r) => ({
  id: r.id,
  name: r.name,
  scovilleHint: r.scoville_hint ?? 0,
});

export async function fetchCatalog() {
  const raw = await get("/catalog");
  return {
    broths: raw.broths.map(mapBroth),
    noodles: raw.noodles.map(mapNoodle),
    proteins: raw.proteins.map(mapProtein),
    heatLevels: raw.heatLevels.map(mapHeat),
  };
}
