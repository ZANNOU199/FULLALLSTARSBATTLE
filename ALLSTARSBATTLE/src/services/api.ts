import axios from 'axios';

export const API_URL = (import.meta as any).env.VITE_API_URL || 'https://api.allstarbattle.dance/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Important pour Sanctum
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Fonction pour obtenir le cookie CSRF (OBLIGATOIRE avec Sanctum)
export const getCsrfCookie = async (): Promise<void> => {
  try {
    await axios.get(`${API_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to get CSRF cookie:', error);
    throw error;
  }
};

// ✅ Fonction de login avec CSRF
export const login = async (email: string, password: string) => {
  try {
    // 1. Obtenir le cookie CSRF d'abord
    await getCsrfCookie();

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
