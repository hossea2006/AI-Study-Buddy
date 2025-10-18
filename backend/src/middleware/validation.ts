import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Flashcard Schemas
export const generateFlashcardsSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  studyMaterialId: z.string().uuid().optional(),
  count: z.number().int().min(1).max(50).default(10),
});

export const reviewFlashcardSchema = z.object({
  quality: z.number().int().min(0).max(5),
});

// Quiz Schemas
export const generateQuizSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  studyMaterialId: z.string().uuid().optional(),
  numQuestions: z.number().int().min(1).max(20).default(5),
  title: z.string().min(1, 'Title is required'),
});

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      answer: z.string(),
    })
  ),
});

// Study Material Schemas
export const createStudyMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  fileUrl: z.string().url().optional(),
  fileType: z.string().optional(),
});

// AI Schemas
export const explainConceptSchema = z.object({
  concept: z.string().min(3, 'Concept must be at least 3 characters'),
  level: z.enum(['simple', 'intermediate', 'advanced']).default('simple'),
});

export const generatePracticeProblemsSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  count: z.number().int().min(1).max(10).default(5),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});

export const essayFeedbackSchema = z.object({
  essay: z.string().min(50, 'Essay must be at least 50 characters'),
  rubric: z.string().optional(),
});
