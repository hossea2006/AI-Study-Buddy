import { Router } from 'express';
import { getProgress, getAnalytics } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getProgress);
router.get('/analytics', getAnalytics);

export default router;
