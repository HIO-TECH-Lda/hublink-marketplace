import axios from 'axios';

// Determine API URL based on environment
const getApiBaseUrl = (): string => {
  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Use environment-specific URLs if provided
  if (isProduction) {
    return process.env.NEXT_PUBLIC_API_BASE_URL_PROD || 'https://api.example.com/api/v1';
  } else {
    return process.env.NEXT_PUBLIC_API_BASE_URL_DEV || 'http://localhost:3002/api/v1';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops by checking if this is already a retry
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
          
          localStorage.setItem('authToken', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/entrar')) {
              window.location.href = '/entrar';
            }
          }
        }
      } else {
        // No refresh token, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/entrar')) {
            window.location.href = '/entrar';
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
