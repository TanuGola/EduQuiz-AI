import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../services/api';
import FileUpload from '../components/FileUpload';

const UploadPDF: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const navigate = useNavigate();

  const handleUpload = async (file: File, category: string, questionCount: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('questionCount', questionCount.toString());

    const response = await teacherAPI.uploadPDF(formData);
    setGeneratedCount(response.data.count);
    setSuccess(true);
    
    setTimeout(() => {
      navigate('/teacher/questions');
    }, 2000);
  };

  return (
    <div className="upload-page">
      <div className="page-header-gradient">
        <h1>📤 Upload Document</h1>
        <p>Transform your documents into interactive quizzes with AI</p>
      </div>
      
      {success ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Questions Generated Successfully!</h2>
          <div className="success-stats">
            <div className="success-stat">
              <span className="stat-number">{generatedCount}</span>
              <span className="stat-label">Questions Created</span>
            </div>
          </div>
          <p className="redirect-text">Redirecting to questions page...</p>
        </div>
      ) : (
        <div className="upload-content">
          <div className="upload-info-cards">
            <div className="info-card">
              <div className="info-icon">🤖</div>
              <h3>AI-Powered</h3>
              <p>Our AI analyzes your content and generates relevant questions automatically</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>Get your questions ready in seconds, not hours</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📚</div>
              <h3>Multiple Formats</h3>
              <p>Support for PDF, TXT, DOC, and DOCX files</p>
            </div>
          </div>
          <FileUpload onUpload={handleUpload} />
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
