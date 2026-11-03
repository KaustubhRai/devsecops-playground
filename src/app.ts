import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import { db } from './database/db';

dotenv.config();

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

// Basic error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export async function start(): Promise<void> {
  await db.init();
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
