import { Router } from 'express';
import * as itemController from '../controllers/itemController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);
router.post('/', itemController.create);
router.get('/', itemController.list);
router.get('/:id', itemController.get);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.remove);

export default router;
