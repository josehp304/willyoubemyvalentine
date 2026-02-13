import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type ValentineRequest } from './api';
import './RequestPage.css';

export default function RequestPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ValentineRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responding, setResponding] = useState(false);
  const [responded, setResponded] = useState(false);

  useEffect(() => {
    if (id) {
      loadRequest();
    }
  }, [id]);

  const loadRequest = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await api.getRequest(id);
      setRequest(data);
      if (data.response_status !== 'pending') {
        setResponded(true);
      }
    } catch (err) {
      setError('Request not found or invalid');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (response: 'accepted' | 'declined') => {
    if (!id || !request) return;

    setResponding(true);
    try {
      // Use the recipient_name from the request as the responder_name
      await api.respondToRequest(id, response, request.recipient_name);
      setResponded(true);
      loadRequest();
    } catch (err) {
      alert('Failed to send response. Please try again.');
      console.error(err);
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="request-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="request-page">
        <div className="error-container">
          <h1>😢 Oops!</h1>
          <p>{error || 'Request not found'}</p>
        </div>
      </div>
    );
  }

  if (responded) {
    return (
      <div className="request-page">
        <div className="response-sent">
          <h1>
            {request.response_status === 'accepted' ? '💚 Response Sent!' : '💔 Response Sent'}
          </h1>
          <p className="thank-you">
            Thank you for responding! {request.creator_name} will see your answer.
          </p>
          {request.response_status === 'accepted' && (
            <p className="celebration">🎉 How exciting! 🎉</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="request-page">
      <div className="request-container">
        <h1>💌 Hey {request.recipient_name}!</h1>
        
        <div className="request-from">
          <p>From: <strong>{request.creator_name}</strong></p>
        </div>

        <div className="message-box">
          <p>{request.message}</p>
        </div>

        <div className="response-section">
          <h2>How do you respond?</h2>

          <div className="response-buttons">
            <button
              onClick={() => handleResponse('accepted')}
              disabled={responding}
              className="accept-button"
            >
              💚 Yes, I'd love to!
            </button>
            <button
              onClick={() => handleResponse('declined')}
              disabled={responding}
              className="decline-button"
            >
              💔 No, thank you
            </button>
          </div>

          {responding && <p className="sending">Sending your response...</p>}
        </div>
      </div>
    </div>
  );
}
