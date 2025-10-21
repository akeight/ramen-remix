import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import bowlsRoutes from './routes/bowls.js'  
import catalogRoutes from './routes/catalog.js'
import cors from 'cors'


import { getCatalog } from "./controllers/catalog.js";
import * as bowls from "./controllers/bowls.js";

const app = express();
app.use(express.json());

// Health (works at BOTH paths to avoid confusion)
app.get(["/api/health", "/health"], (_req, res) => res.json({ ok: true }));

// Catalog + Bowls routes (both with /api/* and non-/api/* aliases)
app.get(["/api/catalog", "/catalog"], getCatalog);

app.get(["/api/bowls", "/bowls"], bowls.listBowls);
app.get(["/api/bowls/:id(\\d+)", "/bowls/:id(\\d+)"], bowls.getBowl);
app.post(["/api/bowls", "/bowls"], bowls.createBowl);
app.patch(["/api/bowls/:id(\\d+)", "/bowls/:id(\\d+)"], bowls.updateBowl);
app.delete(["/api/bowls/:id(\\d+)", "/bowls/:id(\\d+)"], bowls.deleteBowl);

// Helpful: confirm what’s mounted
console.table([
  { METHOD: "GET",    PATH: "/api/health" },
  { METHOD: "GET",    PATH: "/api/catalog" },
  { METHOD: "GET",    PATH: "/api/bowls" },
  { METHOD: "GET",    PATH: "/api/bowls/:id" },
  { METHOD: "POST",   PATH: "/api/bowls" },
  { METHOD: "PATCH",  PATH: "/api/bowls/:id" },
  { METHOD: "DELETE", PATH: "/api/bowls/:id" },
]);

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});