export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    flashcards: number;
    quizzes: number;
  };
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  userId: string;
  studyMaterialId?: string;
  createdAt: string;
  updatedAt: string;
  studyMaterial?: {
    id: string;
    title: string;
  };
}

export interface FlashcardReview {
  id: string;
  flashcardId: string;
  quality: number;
  nextReview: string;
  repetitions: number;
  easeFactor: number;
  interval: number;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  userId: string;
  studyMaterialId?: string;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  date: string;
  studyMinutes: number;
  flashcardsReviewed: number;
  quizzesTaken: number;
  avgQuizScore?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
