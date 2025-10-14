import { Router } from 'express';
import {
  generateFlashcards,
  getFlashcards,
  getDueFlashcards,
  reviewFlashcard,
  deleteFlashcard,
} from '../controllers/flashcard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All flashcard routes require authentication
router.use(authenticate);

router.post('/generate', generateFlashcards);
router.get('/', getFlashcards);
router.get('/due', getDueFlashcards);
router.post('/:flashcardId/review', reviewFlashcard);
router.delete('/:id', deleteFlashcard);

export default router;
