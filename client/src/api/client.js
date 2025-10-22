// src/api/client.js
const BASE = "/api"; // Vite proxy handles this in dev

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to read JSON, even for errors
  let data = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }

  if (!res.ok) {
    const msg = data?.message || data?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data;
}

export const get  = (p) => request(p);
export const post = (p, b) => request(p, { method: "POST", body: b });
export const patch= (p, b) => request(p, { method: "PATCH", body: b });
export const del  = (p) => request(p, { method: "DELETE" });
