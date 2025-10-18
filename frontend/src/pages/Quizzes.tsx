import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import type { Quiz, QuizAttempt } from '../types';
import './Quizzes.css';

const Quizzes = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await quizAPI.getAll();
      setQuizzes(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch quizzes:', err);
      setError('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true);

    try {
      const response = await quizAPI.generate({ content, title, numQuestions });
      setQuizzes([response.data.data, ...quizzes]);
      setShowGenerateModal(false);
      setTitle('');
      setContent('');
      setNumQuestions(5);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await quizAPI.delete(id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    } catch (err: any) {
      setError('Failed to delete quiz');
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setResult(null);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    const answerArray = activeQuiz.questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] || '',
    }));

    try {
      const response = await quizAPI.submit(activeQuiz.id, answerArray);
      setResult(response.data.data);
    } catch (err: any) {
      setError('Failed to submit quiz');
    }
  };

  const handleExitQuiz = () => {
    setActiveQuiz(null);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="quizzes-page">
      <nav className="navbar">
        <div className="nav-brand">
          <h2 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            AI Study Buddy
          </h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="page-content">
        {!activeQuiz ? (
          <>
            <div className="page-header">
              <h1>Quizzes</h1>
              <button onClick={() => setShowGenerateModal(true)} className="btn-primary">
                + Generate Quiz
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {isLoading ? (
              <div className="loading">Loading quizzes...</div>
            ) : quizzes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No quizzes yet</h3>
                <p>Generate a quiz from your study material using AI!</p>
                <button onClick={() => setShowGenerateModal(true)} className="btn-primary">
                  Generate Quiz
                </button>
              </div>
            ) : (
              <div className="quizzes-grid">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="quiz-card">
                    <div className="quiz-header">
                      <h3>{quiz.title}</h3>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="quiz-info">
                      <span className="quiz-questions">
                        {quiz.questions.length} questions
                      </span>
                      <span className="quiz-date">
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="btn-start-quiz"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : result ? (
          <div className="quiz-result">
            <div className="result-header">
              <h2>Quiz Complete!</h2>
              <div className="result-score">
                <div className="score-circle">
                  <span className="score-value">
                    {Math.round((result.score / activeQuiz.questions.length) * 100)}%
                  </span>
                </div>
                <p>
                  You got {result.score} out of {activeQuiz.questions.length} correct
                </p>
              </div>
            </div>

            <div className="result-details">
              <h3>Review Your Answers</h3>
              {activeQuiz.questions.map((question, index) => {
                const userAnswer = result.answers.find((a) => a.questionId === question.id);
                const isCorrect = userAnswer?.isCorrect;

                return (
                  <div
                    key={question.id}
                    className={`question-review ${isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="question-number">Question {index + 1}</div>
                    <div className="question-text">{question.question}</div>
                    <div className="answer-review">
                      <div className="your-answer">
                        <strong>Your answer:</strong> {userAnswer?.answer || 'No answer'}
                        {isCorrect ? ' ✓' : ' ✗'}
                      </div>
                      {!isCorrect && (
                        <div className="correct-answer">
                          <strong>Correct answer:</strong> {question.correctAnswer}
                        </div>
                      )}
                    </div>
                    {question.explanation && (
                      <div className="explanation">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="result-actions">
              <button onClick={handleExitQuiz} className="btn-primary">
                Back to Quizzes
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-container">
            <div className="quiz-header-bar">
              <h2>{activeQuiz.title}</h2>
              <button onClick={handleExitQuiz} className="btn-secondary">
                Exit Quiz
              </button>
            </div>

            <div className="questions-container">
              {activeQuiz.questions.map((question, index) => (
                <div key={question.id} className="question-card">
                  <div className="question-number">Question {index + 1}</div>
                  <div className="question-text">{question.question}</div>
                  <div className="options-list">
                    {question.options.map((option, optIndex) => (
                      <label key={optIndex} className="option-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-footer">
              <button
                onClick={handleSubmitQuiz}
                className="btn-primary btn-submit"
                disabled={
                  Object.keys(answers).length !== activeQuiz.questions.length
                }
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}
      </div>

      {showGenerateModal && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate Quiz</h2>
              <button onClick={() => setShowGenerateModal(false)} className="btn-close">
                ✕
              </button>
            </div>
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label htmlFor="title">Quiz Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isGenerating}
                  placeholder="e.g., Chapter 5 Review"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Study Material Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  required
                  disabled={isGenerating}
                  placeholder="Paste your study material here and AI will generate quiz questions..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="numQuestions">Number of Questions</label>
                <input
                  type="number"
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  min="1"
                  max="20"
                  required
                  disabled={isGenerating}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="btn-secondary"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
