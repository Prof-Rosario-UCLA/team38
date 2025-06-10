import express from "express";
import dotenv from "dotenv";
import path from "path";

import favoriteTeamsRouter from "./routes/favoriteTeams";
import cors from "cors";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
app.use(express.json());

/* ---------- CORS ----------  */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "https://cs144-25s-team38.et.r.appspot.com"],
  })
);


console.log({
  DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT ?? "Deployed",
  AWS_REGION:       process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID:     process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});


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
  console.log(`⚡️  API + frontend listening on http://localhost:${PORT}`);
});
