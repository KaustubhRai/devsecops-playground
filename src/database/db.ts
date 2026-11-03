import { Pool } from 'pg';

const CREATE_USERS = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

const CREATE_ITEMS = `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`;

class Database {
  private pool: Pool | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.pool) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    if (process.env.USE_PG_MEM === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { newDb } = require('pg-mem');
      const mem = newDb();
      const pg = mem.adapters.createPg();
      this.pool = new pg.Pool();
    } else {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/app',
      });
    }

    await this.pool!.query(CREATE_USERS);
    await this.pool!.query(CREATE_ITEMS);
  }

  async query(text: string, params: unknown[] = []): Promise<{ rows: any[]; rowCount: number | null }> {
    await this.init();
    return this.pool!.query(text, params);
  }
}

export const db = new Database();
export default db;
