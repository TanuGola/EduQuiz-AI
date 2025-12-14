import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import History from './pages/History';
import Leaderboard from './pages/Leaderboard';
import UploadPDF from './pages/UploadPDF';
import ManageQuestions from './pages/ManageQuestions';
import CreateQuiz from './pages/CreateQuiz';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">EduQuiz-AI</div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        {user?.role === 'student' && (
          <>
            <Link to="/history">History</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </>
        )}
        {user?.role === 'teacher' && (
          <>
            <Link to="/teacher/upload">Upload Document</Link>
            <Link to="/teacher/questions">Questions</Link>
            <Link to="/teacher/create-quiz">Create Quiz</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </>
        )}
      </div>
      <div className="nav-user">
        <span>{user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            
            <Route path="/quiz/:id" element={
              <ProtectedRoute role="student">
                <QuizPage />
              </ProtectedRoute>
            } />
            
            <Route path="/result/:id" element={
              <ProtectedRoute role="student">
                <ResultPage />
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute role="student">
                <History />
              </ProtectedRoute>
            } />
            
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            
            <Route path="/teacher/upload" element={
              <ProtectedRoute role="teacher">
                <UploadPDF />
              </ProtectedRoute>
            } />
            
            <Route path="/teacher/questions" element={
              <ProtectedRoute role="teacher">
                <ManageQuestions />
              </ProtectedRoute>
            } />
            
            <Route path="/teacher/create-quiz" element={
              <ProtectedRoute role="teacher">
                <CreateQuiz />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  return user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
};

export default App;
