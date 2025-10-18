import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>AI Study Buddy</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Ready to continue your learning journey?</p>
        </div>

        <div className="quick-actions">
          <Link to="/materials" className="action-card">
            <div className="card-icon">📚</div>
            <h3>Study Materials</h3>
            <p>Upload and manage your study content</p>
          </Link>

          <Link to="/flashcards" className="action-card">
            <div className="card-icon">🃏</div>
            <h3>Flashcards</h3>
            <p>Create and review flashcards</p>
          </Link>

          <Link to="/quizzes" className="action-card">
            <div className="card-icon">📝</div>
            <h3>Quizzes</h3>
            <p>Test your knowledge</p>
          </Link>

          <Link to="/progress" className="action-card">
            <div className="card-icon">📊</div>
            <h3>Progress</h3>
            <p>Track your learning stats</p>
          </Link>
        </div>

        <div className="info-section">
          <h3>Getting Started</h3>
          <ol>
            <li>Upload your study materials (PDFs, notes, etc.)</li>
            <li>Generate flashcards automatically with AI</li>
            <li>Practice with quizzes and spaced repetition</li>
            <li>Track your progress over time</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
