import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  withCredentials: true, // Crucial for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for CSRF token for POST requests
api.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    // Only if the X-CSRFToken header is not already set
    if (!config.headers['X-CSRFToken']) {
      // Get CSRF token from cookie
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
  }
  return config;
});

export default api;
