import axios from 'axios';

const api = axios.create({
  // Hardcoded to ensure it always hits the deployed Render backend
  baseURL: 'https://campus-placement-backend-6lzy.onrender.com/api',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
