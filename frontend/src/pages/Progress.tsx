import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import type { Progress } from '../types';
import './Progress.css';

const ProgressPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const response = await progressAPI.getStats();
      setProgressData(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch progress:', err);
      setError('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const calculateStats = () => {
    if (progressData.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        averageScore: 0,
        recentActivity: [],
      };
    }

    const totalSessions = progressData.length;
    const totalTime = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const scores = progressData
      .filter((p) => p.score !== undefined && p.score !== null)
      .map((p) => p.score!);
    const averageScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

    const recentActivity = [...progressData]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return {
      totalSessions,
      totalTime,
      averageScore,
      recentActivity,
    };
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'flashcard':
        return '🃏';
      case 'study':
        return '📚';
      default:
        return '📖';
    }
  };

  const stats = calculateStats();

  return (
    <div className="progress-page">
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
          <h1>Your Progress</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Loading progress data...</div>
        ) : progressData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No progress data yet</h3>
            <p>Start studying to track your progress!</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalSessions}</div>
                  <div className="stat-label">Study Sessions</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-value">{formatTime(stats.totalTime)}</div>
                  <div className="stat-label">Total Study Time</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-value">{Math.round(stats.averageScore)}%</div>
                  <div className="stat-label">Average Score</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {stats.recentActivity.filter((a) =>
                      new Date(a.createdAt) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </div>
                  <div className="stat-label">This Week</div>
                </div>
              </div>
            </div>

            <div className="activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="activity-details">
                      <div className="activity-type">
                        {activity.activityType.charAt(0).toUpperCase() +
                          activity.activityType.slice(1)}
                      </div>
                      <div className="activity-date">
                        {new Date(activity.createdAt).toLocaleDateString()}{' '}
                        {new Date(activity.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="activity-stats">
                      {activity.score !== undefined && activity.score !== null && (
                        <div className="activity-score">
                          Score: {Math.round(activity.score)}%
                        </div>
                      )}
                      {activity.timeSpent && (
                        <div className="activity-time">
                          {formatTime(activity.timeSpent)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="insights-section">
              <h2>Insights</h2>
              <div className="insights-grid">
                <div className="insight-card">
                  <h3>Study Streak</h3>
                  <p>
                    Keep up the great work! You've been consistently studying.
                  </p>
                </div>
                <div className="insight-card">
                  <h3>Best Time to Study</h3>
                  <p>
                    Based on your activity, you're most productive in the{' '}
                    {stats.recentActivity.length > 0
                      ? new Date(stats.recentActivity[0].createdAt).getHours() < 12
                        ? 'morning'
                        : new Date(stats.recentActivity[0].createdAt).getHours() < 18
                        ? 'afternoon'
                        : 'evening'
                      : 'evening'}
                    .
                  </p>
                </div>
                <div className="insight-card">
                  <h3>Improvement</h3>
                  <p>
                    {stats.averageScore >= 80
                      ? "Excellent work! You're mastering the material."
                      : stats.averageScore >= 60
                      ? "You're making good progress. Keep practicing!"
                      : 'Focus on understanding concepts. Review your materials regularly.'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
