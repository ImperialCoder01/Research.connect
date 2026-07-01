import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Inject auth token if available (prepared for future phases)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} - ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] Success - ${response.config.url}`, response.data);
    }
    return response.data;
  },
  (error) => {
    const errorResponse = error.response?.data || {};
    const errorMessage = errorResponse.message || 'Something went wrong. Please try again.';
    
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.url}`, error.response || error);
    }

    // Display error toast
    toast.error(errorMessage);

    return Promise.reject(errorResponse || error);
  }
);

export default axiosInstance;
