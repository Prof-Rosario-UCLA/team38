import express from 'express';
import dotenv from 'dotenv';
import favoriteTeamsRouter from './routes/favoriteTeams';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173'
  })
);

// Mount our favorite‐teams routes
app.use('/favorite-teams', favoriteTeamsRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`⚡️ Server listening on http://localhost:${PORT}`);
});
