import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type ValentineRequest, type User } from './api';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ValentineRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserAndRequests = async () => {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
        const requestsData = await api.getRequests();
        setRequests(requestsData);
      } catch (err) {
        console.error('Failed to load data:', err);
        // If unauthorized, token is invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserAndRequests();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getShareUrl = (id: string) => {
    return `${window.location.origin}/request/${id}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>💝 Valentine Dashboard</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="actions">
          <button 
            className="create-btn"
            onClick={() => navigate('/create')}
          >
            ✨ Create New Valentine Request
          </button>
        </div>

        {requests.length > 0 && (
          <div className="requests-list">
            <h2>Your Valentine Requests</h2>
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>Request to: {request.message}</h3>
                  <span className={`status ${request.response_status}`}>
                    {request.response_status}
                  </span>
                </div>
                
                <p className="message">{request.message}</p>
                
                <div className="request-details">
                  <p>Created: {new Date(request.created_at).toLocaleDateString()}</p>
                  {request.responder_name && (
                    <p className="responder">
                      {request.response_status === 'accepted' ? '💚' : '💔'} 
                      {request.responder_name} said {request.response_status}!
                    </p>
                  )}
                </div>

                {request.response_status === 'pending' && (
                  <div className="share-section">
                    <input
                      type="text"
                      value={getShareUrl(request.id)}
                      readOnly
                      className="share-url"
                    />
                    <button
                      onClick={() => copyToClipboard(getShareUrl(request.id))}
                      className="copy-btn"
                    >
                      📋 Copy Link
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {requests.length === 0 && (
          <div className="empty-state">
            <p>No requests yet. Create your first Valentine request!</p>
          </div>
        )}
      </div>
    </div>
  );
}
