import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import * as openaiService from '../services/openai.service';

export const generateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { content, title, studyMaterialId, numQuestions } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const generatedQuestions = await openaiService.generateQuiz(content, numQuestions || 5);

    const quiz = await prisma.quiz.create({
      data: {
        title: title || 'Generated Quiz',
        userId: req.userId!,
        studyMaterialId: studyMaterialId || null,
        questions: {
          create: generatedQuestions.map((q: any) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: quizzes,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id, userId: req.userId },
      include: {
        questions: true,
        attempts: {
          orderBy: { completedAt: 'desc' },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuizAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // { questionId: userAnswer }

    const quiz = await prisma.quiz.findUnique({
      where: { id, userId: req.userId },
      include: { questions: true },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctCount = 0;
    const answerData = quiz.questions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        userAnswer,
        isCorrect,
      };
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: id,
        score: correctCount,
        totalQuestions: quiz.questions.length,
        answers: {
          create: answerData,
        },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: attempt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
