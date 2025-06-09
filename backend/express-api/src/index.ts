
import express from "express";
import dotenv from "dotenv";
import path from "path";

import favoriteTeamsRouter from "./routes/favoriteTeams";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

/* ---------- CORS ----------  */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "https://cs144-25s-team38.et.r.appspot.com/"],
  })
);

/* ---------- API routes ---------- */
app.use("/favorite-teams", favoriteTeamsRouter);

const distPath = path.resolve(__dirname, "../../../dist");
console.log("Resolved distPath:", distPath);
app.use(express.static(distPath));

/* ---------- SPA fallback ---------- */
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

/* ---------- Start server ---------- */
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`⚡️  API + static server listening on http://localhost:${PORT}`);
});
