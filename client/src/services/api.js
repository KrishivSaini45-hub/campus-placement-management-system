import axios from 'axios';

const api = axios.create({
  // Updated with the correct Render URL from your deployment logs
  baseURL: 'https://campus-placement-management-system-mu9c.onrender.com/api',
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
