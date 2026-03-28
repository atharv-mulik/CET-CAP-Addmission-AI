import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or however you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data)
};

export const collegeAPI = {
  getAll: () => api.get('/colleges'),
  predict: (rank, category, branch) => api.get('/colleges/predict', { params: { rank, category, branch } })
};

export const trackerAPI = {
  getStatus: () => api.get('/tracker'),
  updateStep: (step) => api.put('/tracker/step', null, { params: { step } })
};

export const docAPI = {
  verify: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
