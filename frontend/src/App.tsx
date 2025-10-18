import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Flashcards from './pages/Flashcards';
import Quizzes from './pages/Quizzes';
import Progress from './pages/Progress';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <Materials />
              </ProtectedRoute>
            }
          />

          <Route
            path="/flashcards"
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <Quizzes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
