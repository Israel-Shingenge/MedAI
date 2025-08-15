import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileImage, Brain, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/design-system.css';

const EnhancedDiagnosisPage = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setImageUrl(URL.createObjectURL(droppedFile));
      setError(null);
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleDiagnose = async () => {
    if (!file) {
      setError('Please select an image to diagnose.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        diagnosis: "Normal Cell Structure",
        confidence: 95.7,
        findings: [
          "Cell morphology appears normal",
          "No signs of malignancy detected",
          "Nuclear features are within normal range"
        ],
        recommendations: "No further action required"
      };
      
      navigate('/results', { state: { result: mockResult, imageUrl } });
    }, 2000);
  };

  return (
    <div className="diagnosis-container">
      <div className="container">
        <div className="diagnosis-header">
          <h1 className="diagnosis-title">
            <Brain className="title-icon" size={32} />
            AI-Powered Diagnosis
          </h1>
          <p className="diagnosis-subtitle">
            Upload your microscopic image and get instant AI analysis with detailed insights
          </p>
        </div>

        <div className="diagnosis-content">
          <div className="upload-section">
            <div 
              className={`upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleFileChange}
                className="file-input"
              />
              
              {!file ? (
                <div className="upload-placeholder">
                  <Upload size={48} className="upload-icon" />
                  <h3>Drop your image here</h3>
                  <p>or click to browse files</p>
                  <span className="upload-hint">Supports JPG, PNG, TIFF formats</span>
                </div>
              ) : (
                <div className="file-preview">
                  <img src={imageUrl} alt="Uploaded" className="preview-image" />
                  <div className="file-info">
                    <FileImage size={20} />
                    <span>{file.name}</span>
                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="diagnosis-actions">
              <button 
                onClick={handleDiagnose} 
                disabled={!file || isAnalyzing}
                className={`btn btn-primary ${isAnalyzing ? 'loading' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="loading-spinner"></div>
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    Start AI Analysis
                  </>
                )}
              </button>

              {file && (
                <button 
                  onClick={() => {
                    setFile(null);
                    setImageUrl(null);
                    setError(null);
                  }}
                  className="btn btn-secondary"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          <div className="features-section">
            <h3>What Our AI Can Detect</h3>
            <div className="features-grid">
              <div className="feature-card">
                <CheckCircle className="feature-icon" size={24} />
                <div>
                  <h4>Cell Abnormalities</h4>
                  <p>Detect irregular cell structures and patterns</p>
                </div>
              </div>
              <div className="feature-card">
                <CheckCircle className="feature-icon" size={24} />
                <div>
                  <h4>Cancer Markers</h4>
                  <p>Identify potential cancerous cells and tissues</p>
                </div>
              </div>
              <div className="feature-card">
                <CheckCircle className="feature-icon" size={24} />
                <div>
                  <h4>Infection Signs</h4>
                  <p>Spot bacterial, viral, or fungal infections</p>
                </div>
              </div>
              <div className="feature-card">
                <Clock className="feature-icon" size={24} />
                <div>
                  <h4>Instant Results</h4>
                  <p>Get comprehensive analysis in under 30 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add enhanced styles
const style = document.createElement('style');
style.textContent = `
  .diagnosis-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
    padding: 2rem 0;
  }

  .diagnosis-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .diagnosis-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
  }

  .title-icon {
    color: var(--primary-600);
  }

  .diagnosis-subtitle {
    font-size: var(--text-lg);
    color: var(--gray-600);
    max-width: 600px;
    margin: 0 auto;
  }

  .diagnosis-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .upload-section {
    margin-bottom: 3rem;
  }

  .upload-zone {
    border: 2px dashed var(--gray-300);
    border-radius: var(--radius-xl);
    padding: 3rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
    box-shadow: var(--shadow-sm);
  }

  .upload-zone:hover {
    border-color: var(--primary-400);
    background: var(--primary-50);
  }

  .upload-zone.drag-active {
    border-color: var(--primary-600);
    background: var(--primary-100);
    transform: scale(1.02);
  }

  .upload-zone.has-file {
    border-color: var(--success-500);
    background: var(--success-50);
  }

  .file-input {
    display: none;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .upload-icon {
    color: var(--gray-400);
  }

  .upload-placeholder h3 {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin: 0;
  }

  .upload-placeholder p {
    color: var(--gray-600);
    margin: 0;
  }

  .upload-hint {
    font-size: var(--text-sm);
    color: var(--gray-500);
  }

  .file-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .preview-image {
    max-width: 300px;
    max-height: 200px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--gray-700);
    font-size: var(--text-sm);
  }

  .file-size {
    color: var(--gray-500);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--error-600);
    background: var(--error-50);
    padding: 1rem;
    border-radius: var(--radius-lg);
    margin-top: 1rem;
  }

  .diagnosis-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .features-section {
    margin-top: 3rem;
  }

  .features-section h3 {
    text-align: center;
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 2rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .feature-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .feature-icon {
    color: var(--success-500);
    flex-shrink: 0;
  }

  .feature-card h4 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
  }

  .feature-card p {
    color: var(--gray-600);
    margin: 0;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--gray-300);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .diagnosis-title {
      font-size: var(--text-2xl);
    }

    .upload-zone {
      padding: 2rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .diagnosis-actions {
      flex-direction: column;
    }
  }
`;

document.head.appendChild(style);

export default EnhancedDiagnosisPage;
