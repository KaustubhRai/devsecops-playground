import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  const token = header.slice(7);
  const user = authService.verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  (req as any).user = user;
  next();
}
