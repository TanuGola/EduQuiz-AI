import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    await login(data.email, data.password);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">🎓 EduQuiz-AI</h1>
          <p className="auth-hero-subtitle">AI-Powered Learning Platform</p>
          <div className="auth-features">
            <div className="feature-item">✨ Smart Quiz Generation</div>
            <div className="feature-item">📊 Track Your Progress</div>
            <div className="feature-item">🏆 Compete on Leaderboards</div>
          </div>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>
        <AuthForm mode="login" onSubmit={handleLogin} />
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
