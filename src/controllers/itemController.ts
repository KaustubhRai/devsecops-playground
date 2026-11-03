import { Request, Response } from 'express';
import { z } from 'zod';
import * as itemService from '../services/itemService';

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const item = await itemService.createItem(parsed.data.name, parsed.data.description, (req as any).user.id);
  res.status(201).json(item);
}

export async function list(req: Request, res: Response): Promise<void> {
  const items = await itemService.listItems((req as any).user.id);
  res.json(items);
}

export async function get(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const item = await itemService.getItem(id);
  if (!item) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(item);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const item = await itemService.updateItem(id, parsed.data.name, parsed.data.description);
  if (!item) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(item);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const ok = await itemService.deleteItem(id);
  if (!ok) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.status(204).send();
}
