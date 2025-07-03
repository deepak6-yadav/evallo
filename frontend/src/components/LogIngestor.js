import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Check, X } from 'lucide-react';
import './LogIngestor.css';

const LogIngestor = ({ onLogIngested }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    level: 'info',
    message: '',
    resourceId: '',
    timestamp: new Date().toISOString().slice(0, 19),
    traceId: '',
    spanId: '',
    commit: '',
    metadata: {}
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Format timestamp to ISO 8601 with proper timezone handling
      let timestamp = formData.timestamp;
      
      // If timestamp doesn't end with Z, add it to make it UTC
      if (!timestamp.endsWith('Z')) {
        timestamp = new Date(timestamp).toISOString();
      }
      
      const logEntry = {
        ...formData,
        timestamp
      };

      await axios.post('/api/logs', logEntry);
      
      setSuccess(true);
      setFormData({
        level: 'info',
        message: '',
        resourceId: '',
        timestamp: new Date().toISOString().slice(0, 19),
        traceId: '',
        spanId: '',
        commit: '',
        metadata: {}
      });
      
      // Notify parent component
      onLogIngested();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create log entry');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setError(null);
    setSuccess(false);
    setFormData({
      level: 'info',
      message: '',
      resourceId: '',
      timestamp: new Date().toISOString().slice(0, 19),
      traceId: '',
      spanId: '',
      commit: '',
      metadata: {}
    });
  };

  return (
    <div className="log-ingestor">
      {!showForm ? (
        <button
          className="btn btn-primary add-log-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          Add New Log
        </button>
      ) : (
        <div className="ingestor-form card">
          <div className="form-header">
            <h3>Add New Log Entry</h3>
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              <X size={16} />
            </button>
          </div>

          {success && (
            <div className="success">
              <Check size={16} />
              Log entry created successfully!
            </div>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Log Level *</label>
                <select
                  className="select"
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  required
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  className="input"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter log message..."
                  required
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Resource ID *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.resourceId}
                  onChange={(e) => handleInputChange('resourceId', e.target.value)}
                  placeholder="e.g., server-1234"
                  required
                />
              </div>

              <div className="form-group">
                <label>Timestamp *</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={formData.timestamp}
                  onChange={(e) => handleInputChange('timestamp', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Trace ID *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.traceId}
                  onChange={(e) => handleInputChange('traceId', e.target.value)}
                  placeholder="e.g., abc-xyz-123"
                  required
                />
              </div>

              <div className="form-group">
                <label>Span ID *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.spanId}
                  onChange={(e) => handleInputChange('spanId', e.target.value)}
                  placeholder="e.g., span-456"
                  required
                />
              </div>

              <div className="form-group">
                <label>Commit Hash *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.commit}
                  onChange={(e) => handleInputChange('commit', e.target.value)}
                  placeholder="e.g., 5e5342f"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Log Entry'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LogIngestor; 