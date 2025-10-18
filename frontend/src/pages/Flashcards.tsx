import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { flashcardAPI } from '../services/api';
import type { Flashcard } from '../types';
import './Flashcards.css';

const Flashcards = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [content, setContent] = useState('');
  const [count, setCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setIsLoading(true);
      const response = await flashcardAPI.getAll();
      setFlashcards(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch flashcards:', err);
      setError('Failed to load flashcards');
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
      const response = await flashcardAPI.generate({ content, count });
      setFlashcards([...response.data.data, ...flashcards]);
      setShowGenerateModal(false);
      setContent('');
      setCount(10);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      await flashcardAPI.delete(id);
      setFlashcards(flashcards.filter((card) => card.id !== id));
    } catch (err: any) {
      setError('Failed to delete flashcard');
    }
  };

  const handleReview = async (quality: number) => {
    if (flashcards.length === 0) return;

    const currentCard = flashcards[currentCardIndex];
    try {
      await flashcardAPI.review(currentCard.id, quality);
      nextCard();
    } catch (err: any) {
      setError('Failed to save review');
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const prevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(flashcards.length - 1);
    }
  };

  return (
    <div className="flashcards-page">
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
        <div className="page-header">
          <h1>Flashcards</h1>
          <div className="header-actions">
            {flashcards.length > 0 && !studyMode && (
              <button
                onClick={() => setStudyMode(true)}
                className="btn-secondary"
              >
                Study Mode
              </button>
            )}
            {studyMode && (
              <button
                onClick={() => {
                  setStudyMode(false);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className="btn-secondary"
              >
                Exit Study Mode
              </button>
            )}
            <button onClick={() => setShowGenerateModal(true)} className="btn-primary">
              + Generate Flashcards
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Loading flashcards...</div>
        ) : studyMode && flashcards.length > 0 ? (
          <div className="study-container">
            <div className="study-progress">
              Card {currentCardIndex + 1} of {flashcards.length}
            </div>
            <div
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flashcard-content">
                {!isFlipped ? (
                  <div className="flashcard-front">
                    <div className="card-label">Question</div>
                    <div className="card-text">{flashcards[currentCardIndex].front}</div>
                    <div className="card-hint">Click to flip</div>
                  </div>
                ) : (
                  <div className="flashcard-back">
                    <div className="card-label">Answer</div>
                    <div className="card-text">{flashcards[currentCardIndex].back}</div>
                  </div>
                )}
              </div>
            </div>
            {isFlipped && (
              <div className="review-buttons">
                <button onClick={() => handleReview(1)} className="btn-review btn-hard">
                  Hard
                </button>
                <button onClick={() => handleReview(3)} className="btn-review btn-good">
                  Good
                </button>
                <button onClick={() => handleReview(5)} className="btn-review btn-easy">
                  Easy
                </button>
              </div>
            )}
            <div className="navigation-buttons">
              <button onClick={prevCard} className="btn-nav">
                ← Previous
              </button>
              <button onClick={nextCard} className="btn-nav">
                Next →
              </button>
            </div>
          </div>
        ) : flashcards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🃏</div>
            <h3>No flashcards yet</h3>
            <p>Generate flashcards from your study material using AI!</p>
            <button onClick={() => setShowGenerateModal(true)} className="btn-primary">
              Generate Flashcards
            </button>
          </div>
        ) : (
          <div className="flashcards-grid">
            {flashcards.map((card) => (
              <div key={card.id} className="flashcard-item">
                <div className="flashcard-item-header">
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="btn-delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
                <div className="flashcard-item-content">
                  <div className="flashcard-side">
                    <strong>Q:</strong> {card.front}
                  </div>
                  <div className="flashcard-divider">⬇</div>
                  <div className="flashcard-side">
                    <strong>A:</strong> {card.back}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showGenerateModal && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate Flashcards</h2>
              <button onClick={() => setShowGenerateModal(false)} className="btn-close">
                ✕
              </button>
            </div>
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label htmlFor="content">Study Material Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  required
                  disabled={isGenerating}
                  placeholder="Paste your study material here and AI will generate flashcards..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="count">Number of Flashcards</label>
                <input
                  type="number"
                  id="count"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  min="1"
                  max="50"
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

export default Flashcards;
