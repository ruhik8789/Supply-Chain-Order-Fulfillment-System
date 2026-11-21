import express from 'express';
import { env } from './config/env.js';
import { db } from './db/database.js';
import { itemsRouter } from './modules/items/items.router.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  const row = db.prepare('SELECT COUNT(*) AS count FROM items').get() as { count: number };
  res.json({ status: 'ok', itemCount: row.count });
});

app.use('/items', itemsRouter);

app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});