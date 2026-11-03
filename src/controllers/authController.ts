import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/authService';

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const user = await authService.register(parsed.data.username, parsed.data.password);
    res.status(201).json(user);
  } catch (err: any) {
    if (err?.code === '23505') {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const token = await authService.login(parsed.data.username, parsed.data.password);
  if (!token) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  res.json({ token });
}
