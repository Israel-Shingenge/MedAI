
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImageMock, pollForResultsMock } from '../services/api';
import '../components/styles.css';

const DiagnosePage = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDiagnose = async () => {
    if (!file) {
      setError('Please select an image to diagnose.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const jobId = await uploadImageMock(file);
      const result = await pollForResultsMock(jobId);
      navigate('/results', { state: { result, imageUrl } });
    } catch (err) {
      setError('An error occurred during diagnosis. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container">
      <h2>Microscopic Image Diagnosis</h2>
      <div className="card diagnose-card">
        <div className="file-input-wrapper">
          <input 
            type="file" 
            id="file-upload"
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <label htmlFor="file-upload">
            {file ? (
              <p>File selected: <strong>{file.name}</strong></p>
            ) : (
              <p>Drag & drop or <strong>click here</strong> to upload an image</p>
            )}
          </label>
        </div>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        
        {isAnalyzing ? (
          <div style={{ width: '100%' }}>
            <p>Analyzing image...</p>
            <progress />
          </div>
        ) : (
          <button 
            onClick={handleDiagnose} 
            disabled={!file} 
            className="button-primary"
          >
            Run Analysis
          </button>
        )}
      </div>
    </div>
  );
};

export default DiagnosePage;