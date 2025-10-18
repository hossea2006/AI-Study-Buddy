import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { materialAPI } from '../services/api';
import type { StudyMaterial } from '../types';
import './Materials.css';

const Materials = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const response = await materialAPI.getAll();
      setMaterials(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch materials:', err);
      setError('Failed to load materials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsUploading(true);

    try {
      if (file) {
        // Upload file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        await materialAPI.upload(formData);
      } else {
        // Create text material
        await materialAPI.create({ title, content });
      }

      setShowUploadModal(false);
      setTitle('');
      setContent('');
      setFile(null);
      fetchMaterials();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await materialAPI.delete(id);
      fetchMaterials();
    } catch (err: any) {
      setError('Failed to delete material');
    }
  };

  return (
    <div className="materials-page">
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
          <h1>Study Materials</h1>
          <button onClick={() => setShowUploadModal(true)} className="btn-primary">
            + Add Material
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Loading materials...</div>
        ) : materials.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No materials yet</h3>
            <p>Upload your first study material to get started!</p>
            <button onClick={() => setShowUploadModal(true)} className="btn-primary">
              Upload Material
            </button>
          </div>
        ) : (
          <div className="materials-grid">
            {materials.map((material) => (
              <div key={material.id} className="material-card">
                <div className="material-header">
                  <h3>{material.title}</h3>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="btn-delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
                <p className="material-preview">
                  {material.content.substring(0, 150)}
                  {material.content.length > 150 ? '...' : ''}
                </p>
                <div className="material-footer">
                  <span className="material-date">
                    {new Date(material.createdAt).toLocaleDateString()}
                  </span>
                  {material.fileType && (
                    <span className="material-type">{material.fileType}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Study Material</h2>
              <button onClick={() => setShowUploadModal(false)} className="btn-close">
                ✕
              </button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="file">Upload File (optional)</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.doc,.docx"
                  disabled={isUploading}
                />
                <small>Supported: PDF, TXT, DOC, DOCX (max 10MB)</small>
              </div>

              {!file && (
                <div className="form-group">
                  <label htmlFor="content">Or paste content directly</label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    required={!file}
                    disabled={isUploading}
                    placeholder="Paste your study material here..."
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
