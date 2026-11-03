import { db } from '../database/db';

export interface Item {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
}

export async function createItem(name: string, description: string | undefined, ownerId: number): Promise<Item> {
  const result = await db.query(
    'INSERT INTO items (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id, name, description, owner_id',
    [name, description ?? null, ownerId]
  );
  return result.rows[0];
}

export async function listItems(ownerId?: number): Promise<Item[]> {
  if (ownerId) {
    const result = await db.query('SELECT id, name, description, owner_id FROM items WHERE owner_id = $1', [ownerId]);
    return result.rows;
  }
  const result = await db.query('SELECT id, name, description, owner_id FROM items');
  return result.rows;
}

export async function getItem(id: number): Promise<Item | null> {
  const result = await db.query('SELECT id, name, description, owner_id FROM items WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function updateItem(id: number, name: string, description: string | undefined): Promise<Item | null> {
  const result = await db.query(
    'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description, owner_id',
    [name, description ?? null, id]
  );
  return result.rows[0] || null;
}

export async function deleteItem(id: number): Promise<boolean> {
  const result = await db.query('DELETE FROM items WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
