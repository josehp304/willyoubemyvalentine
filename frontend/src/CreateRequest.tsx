import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import './CreateRequest.css';

export default function CreateRequest() {
  const [message, setMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !recipientName.trim()) return;

    setLoading(true);
    try {
      const response = await api.createRequest(message, recipientName);
      const url = `${window.location.origin}/request/${response.id}`;
      setShareUrl(url);
    } catch (err) {
      alert('Failed to create request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard! 💝');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (shareUrl) {
    return (
      <div className="create-request">
        <div className="success-container">
          <h1>🎉 Request Created!</h1>
          <p className="success-message">
            Share this link with your crush:
          </p>
          
          <div className="share-box">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-url-input"
            />
            <button onClick={copyToClipboard} className="copy-button">
              📋 Copy Link
            </button>
          </div>

          <p className="instruction">
            Send this link to your special someone and wait for their response! 💕
          </p>

          <button onClick={handleBackToDashboard} className="dashboard-button">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-request">
      <div className="form-container">
        <h1>💌 Create Valentine Request</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recipientName">Recipient's Name</label>
            <input
              id="recipientName"
              type="text"
              placeholder="Who is this Valentine for?"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Valentine Message</label>
            <textarea
              id="message"
              placeholder="Write your Valentine message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Creating...' : '💝 Create Request'}
            </button>
            <button 
              type="button" 
              onClick={handleBackToDashboard}
              className="back-button"
            >
              ← Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
