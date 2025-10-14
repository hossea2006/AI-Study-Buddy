import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import * as openaiService from '../services/openai.service';

export const generateFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    const { content, studyMaterialId, count } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Generate flashcards using AI
    const generatedCards = await openaiService.generateFlashcards(content, count || 10);

    // Save to database
    const flashcards = await Promise.all(
      generatedCards.map((card: any) =>
        prisma.flashcard.create({
          data: {
            question: card.question,
            answer: card.answer,
            userId: req.userId!,
            studyMaterialId: studyMaterialId || null,
          },
        })
      )
    );

    res.json({
      success: true,
      message: `Generated ${flashcards.length} flashcards`,
      data: flashcards,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { userId: req.userId },
      include: {
        studyMaterial: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: flashcards,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDueFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();

    const dueFlashcards = await prisma.flashcard.findMany({
      where: {
        userId: req.userId,
        reviews: {
          some: {
            nextReview: {
              lte: now,
            },
          },
        },
      },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    res.json({
      success: true,
      data: dueFlashcards,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const { flashcardId } = req.params;
    const { quality } = req.body; // 0-5 rating

    if (quality < 0 || quality > 5) {
      return res.status(400).json({ message: 'Quality must be between 0 and 5' });
    }

    // Get last review
    const lastReview = await prisma.flashcardReview.findFirst({
      where: { flashcardId },
      orderBy: { createdAt: 'desc' },
    });

    // SuperMemo SM-2 algorithm
    let easeFactor = lastReview?.easeFactor || 2.5;
    let interval = lastReview?.interval || 0;
    let repetitions = lastReview?.repetitions || 0;

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    // Create new review
    const review = await prisma.flashcardReview.create({
      data: {
        flashcardId,
        quality,
        easeFactor,
        interval,
        repetitions,
        nextReview,
      },
    });

    res.json({
      success: true,
      message: 'Review recorded',
      data: {
        review,
        nextReview: nextReview.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.flashcard.delete({
      where: {
        id,
        userId: req.userId,
      },
    });

    res.json({
      success: true,
      message: 'Flashcard deleted',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
