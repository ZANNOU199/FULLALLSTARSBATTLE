import axios from 'axios';

export const API_URL = (import.meta as any).env.VITE_API_URL || 'https://api.allstarbattle.dance/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add CSRF token if available
  const csrfToken = localStorage.getItem('csrf_token');
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }

  return config;
});

// ✅ Nouvelle fonction pour obtenir le token CSRF
export const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await api.get('/csrf-token');
    const token = response.data.token;
    localStorage.setItem('csrf_token', token);
    return token;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    throw error;
  }
};

// ✅ Fonction de login avec CSRF token
export const login = async (email: string, password: string) => {
  try {
    // 1. Obtenir le token CSRF d'abord
    await getCsrfToken();

    // 2. Faire la requête de login
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export default api;
