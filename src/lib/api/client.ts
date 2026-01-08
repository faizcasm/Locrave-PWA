import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '../storage/secureStorage';
import { ApiErrorResponse } from '../../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request queue for token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = secureStorage.getTokens();
    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokens = secureStorage.getTokens();

      if (!tokens?.refreshToken) {
        // No refresh token, logout
        secureStorage.clearAll();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Refresh token request
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken: tokens.refreshToken,
          }
        );

        const { accessToken, refreshToken } = response.data.data;
        secureStorage.setTokens({ accessToken, refreshToken });

        // Update auth header and process queue
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        secureStorage.clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as ApiErrorResponse;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  return 'An unexpected error occurred';
};

// Upload helper with progress tracking
export const uploadFile = async (
  url: string,
  formData: FormData,
  onProgress?: (percentage: number) => void
) => {
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentage);
      }
    },
  });
};

export default apiClient;
