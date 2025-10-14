import { Router } from 'express';
import {
  explainConcept,
  generatePracticeProblems,
  provideEssayFeedback,
  summarizeText,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

router.post('/explain', explainConcept);
router.post('/practice-problems', generatePracticeProblems);
router.post('/essay-feedback', provideEssayFeedback);
router.post('/summarize', summarizeText);

export default router;
