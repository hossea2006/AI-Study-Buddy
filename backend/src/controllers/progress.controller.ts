import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
      take: 30,
    });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const totalFlashcards = await prisma.flashcard.count({
      where: { userId: req.userId },
    });

    const totalQuizzes = await prisma.quiz.count({
      where: { userId: req.userId },
    });

    const recentAttempts = await prisma.quizAttempt.findMany({
      where: {
        Quiz: {
          userId: req.userId,
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    const avgScore =
      recentAttempts.length > 0
        ? recentAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) /
          recentAttempts.length
        : 0;

    const studySessions = await prisma.studySession.findMany({
      where: { userId: req.userId },
      orderBy: { startTime: 'desc' },
      take: 7,
    });

    const totalStudyMinutes = studySessions.reduce((sum, s) => sum + s.duration, 0);

    res.json({
      success: true,
      data: {
        totalFlashcards,
        totalQuizzes,
        avgQuizScore: avgScore.toFixed(1),
        totalStudyMinutes,
        recentAttempts,
        studySessions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
