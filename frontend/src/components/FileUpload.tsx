import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (file: File, category: string, questionCount: number) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category) {
      setError('Please select a file and enter a category');
      return;
    }

    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, TXT, and DOCX files are allowed');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onUpload(file, category, questionCount);
      setFile(null);
      setCategory('');
      setQuestionCount(10);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="file-upload-form">
      <div 
        className={`file-drop-zone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          accept=".pdf,.txt,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" className="file-drop-label">
          {file ? (
            <>
              <div className="file-icon">📄</div>
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <div className="upload-text">Drag & drop your file here</div>
              <div className="upload-subtext">or click to browse</div>
              <div className="supported-formats">Supports: PDF, TXT, DOC, DOCX</div>
            </>
          )}
        </label>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>📚 Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Mathematics, Science, History"
          />
        </div>
        <div className="form-group">
          <label>❓ Number of Questions</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            min="1"
            max="50"
          />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Generate Questions'}
      </button>
    </form>
  );
};

export default FileUpload;
