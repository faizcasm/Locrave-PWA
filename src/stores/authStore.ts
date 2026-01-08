import { create } from 'zustand';
import { User, LoginRequest, VerifyOtpRequest } from '../types/user.types';
import apiClient, { handleApiError } from '../lib/api/client';
import { secureStorage } from '../lib/storage/secureStorage';
import { socketClient } from '../lib/socket/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (data: LoginRequest) => Promise<void>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: secureStorage.getUser<User>(),
  isAuthenticated: !!secureStorage.getTokens(),
  isLoading: false,
  error: null,

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/auth/login', data);
      set({ isLoading: false });
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/verify-otp', data);
      const { user, tokens } = response.data.data;

      secureStorage.setTokens(tokens);
      secureStorage.setUser(user);
      socketClient.connect();

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      secureStorage.clearAll();
      socketClient.disconnect();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  refreshUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data.data;
      secureStorage.setUser(user);
      set({ user });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
