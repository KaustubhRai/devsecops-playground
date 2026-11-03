import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const SALT_ROUNDS = 10;

export interface User {
  id: number;
  username: string;
}

export async function register(username: string, password: string): Promise<User> {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
    [username, hash]
  );
  const row = result.rows[0];
  return { id: row.id, username: row.username };
}

export async function login(username: string, password: string): Promise<string | null> {
  const result = await db.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
  const row = result.rows[0];
  if (!row) return null;
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;
  return jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): User | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as User;
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
}
