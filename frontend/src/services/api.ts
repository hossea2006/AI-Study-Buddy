import axios from 'axios';
import type {
  AuthResponse,
  User,
  StudyMaterial,
  Flashcard,
  Quiz,
  QuizAttempt,
  Progress,
  ApiResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me'),
};

// Study Material APIs
export const materialAPI = {
  create: (data: { title: string; content: string }) =>
    api.post<ApiResponse<StudyMaterial>>('/materials', data),

  upload: (formData: FormData) =>
    api.post<ApiResponse<StudyMaterial>>('/materials/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: () =>
    api.get<ApiResponse<StudyMaterial[]>>('/materials'),

  getById: (id: string) =>
    api.get<ApiResponse<StudyMaterial>>(`/materials/${id}`),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/materials/${id}`),
};

// Flashcard APIs
export const flashcardAPI = {
  generate: (data: { content: string; studyMaterialId?: string; count?: number }) =>
    api.post<ApiResponse<Flashcard[]>>('/flashcards/generate', data),

  getAll: () =>
    api.get<ApiResponse<Flashcard[]>>('/flashcards'),

  getDue: () =>
    api.get<ApiResponse<Flashcard[]>>('/flashcards/due'),

  review: (flashcardId: string, quality: number) =>
    api.post<ApiResponse<any>>(`/flashcards/${flashcardId}/review`, { quality }),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/flashcards/${id}`),
};

// Quiz APIs
export const quizAPI = {
  generate: (data: {
    content: string;
    title: string;
    studyMaterialId?: string;
    numQuestions?: number;
  }) =>
    api.post<ApiResponse<Quiz>>('/quizzes/generate', data),

  getAll: () =>
    api.get<ApiResponse<Quiz[]>>('/quizzes'),

  getById: (id: string) =>
    api.get<ApiResponse<Quiz>>(`/quizzes/${id}`),

  submit: (quizId: string, answers: Array<{ questionId: string; answer: string }>) =>
    api.post<ApiResponse<QuizAttempt>>(`/quizzes/${quizId}/attempt`, { answers }),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/quizzes/${id}`),
};

// AI APIs
export const aiAPI = {
  explain: (data: { concept: string; level?: string }) =>
    api.post<ApiResponse<string>>('/ai/explain', data),

  generateProblems: (data: {
    topic: string;
    count?: number;
    difficulty?: string;
  }) =>
    api.post<ApiResponse<any>>('/ai/practice-problems', data),

  essayFeedback: (data: { essay: string; rubric?: string }) =>
    api.post<ApiResponse<any>>('/ai/essay-feedback', data),
};

// Progress APIs
export const progressAPI = {
  getStats: () =>
    api.get<ApiResponse<Progress[]>>('/progress'),

  getAnalytics: () =>
    api.get<ApiResponse<any>>('/progress/analytics'),
};

export default api;
