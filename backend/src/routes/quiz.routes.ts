import { Router } from 'express';
import {
  generateQuiz,
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
} from '../controllers/quiz.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/generate', generateQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/attempt', submitQuizAttempt);

export default router;
