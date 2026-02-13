const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ValentineRequest {
  id: string;
  creator_name: string;
  recipient_name: string;
  message: string;
  created_at: string;
  response_status: 'pending' | 'accepted' | 'declined';
  responder_name?: string;
  responded_at?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register');
    }
    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to login');
    }
    return response.json();
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async createRequest(message: string, recipientName: string) {
    const response = await fetch(`${API_URL}/api/requests`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ message, recipientName }),
    });
    if (!response.ok) throw new Error('Failed to create request');
    return response.json();
  },

  async getRequests(): Promise<ValentineRequest[]> {
    const response = await fetch(`${API_URL}/api/requests`, {
      headers: { ...getAuthHeader() },
    });
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
  },

  async getRequestsByCreator(creatorName: string): Promise<ValentineRequest[]> {
    const response = await fetch(`${API_URL}/api/requests/creator/${encodeURIComponent(creatorName)}`);
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
  },

  async getRequest(id: string): Promise<ValentineRequest> {
    const response = await fetch(`${API_URL}/api/requests/${id}`);
    if (!response.ok) throw new Error('Failed to fetch request');
    return response.json();
  },

  async respondToRequest(id: string, response: 'accepted' | 'declined', responderName: string) {
    const res = await fetch(`${API_URL}/api/requests/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response, responderName }),
    });
    if (!res.ok) throw new Error('Failed to respond to request');
    return res.json();
  },
};
