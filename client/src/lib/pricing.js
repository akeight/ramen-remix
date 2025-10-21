// src/lib/pricing.js
export const BASE_BOWL_CENTS =
  Number(import.meta.env.VITE_BASE_BOWL_CENTS ?? 999); // $9.99 default

export const formatUSD = (cents) =>
  (Number(cents) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export function computeTotalCents(catalog, selection) {
  if (!catalog) return BASE_BOWL_CENTS;

  const brothDelta =
    catalog.broths?.find(b => b.id === selection.brothId)?.priceDelta ?? 0;

  const noodleDelta =
    catalog.noodles?.find(n => n.id === selection.noodleId)?.priceDelta ?? 0;

  const proteinSet = new Set(selection.proteins || []); // avoid double-charging
  let proteinsSum = 0;
  for (const id of proteinSet) {
    const p = catalog.proteins?.find(x => x.id === id);
    proteinsSum += p?.priceDelta ?? 0;
  }

  return BASE_BOWL_CENTS + brothDelta + noodleDelta + proteinsSum;
}

export function computeBreakdown(catalog, selection) {
  const broth = catalog.broths?.find(b => b.id === selection.brothId);
  const noodle = catalog.noodles?.find(n => n.id === selection.noodleId);
  const proteinSet = new Set(selection.proteins || []);
  const proteins = [...proteinSet]
    .map(id => catalog.proteins?.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({ id: p.id, name: p.name, cents: p.priceDelta }));

  return {
    base_cents: BASE_BOWL_CENTS,
    broth_cents: broth?.priceDelta ?? 0,
    noodle_cents: noodle?.priceDelta ?? 0,
    proteins
  };
}
