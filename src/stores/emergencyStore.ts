import { create } from 'zustand';
import { Post, CreatePostRequest } from '../types/post.types';
import apiClient, { handleApiError, uploadFile } from '../lib/api/client';

interface EmergencyState {
  emergencyPosts: Post[];
  cooldownRemaining: number;
  canPostEmergency: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEmergencyPosts: () => Promise<void>;
  checkCooldown: () => Promise<void>;
  createEmergencyPost: (data: CreatePostRequest) => Promise<void>;
  clearError: () => void;
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  emergencyPosts: [],
  cooldownRemaining: 0,
  canPostEmergency: true,
  isLoading: false,
  error: null,

  fetchEmergencyPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/posts/emergency');
      set({ 
        emergencyPosts: response.data.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
    }
  },

  checkCooldown: async () => {
    try {
      const response = await apiClient.get('/posts/emergency/cooldown');
      const { canPost, remainingMs } = response.data.data;
      
      set({ 
        canPostEmergency: canPost,
        cooldownRemaining: remainingMs || 0,
      });
    } catch (error) {
      console.error('Failed to check cooldown:', error);
    }
  },

  createEmergencyPost: async (data: CreatePostRequest) => {
    set({ error: null });
    try {
      const formData = new FormData();
      formData.append('type', 'EMERGENCY');
      formData.append('content', data.content);
      if (data.title) formData.append('title', data.title);
      formData.append('location', JSON.stringify(data.location));
      
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await uploadFile('/posts/emergency', formData);
      const newPost = response.data.data;

      set((state) => ({
        emergencyPosts: [newPost, ...state.emergencyPosts],
        canPostEmergency: false,
        cooldownRemaining: parseInt(import.meta.env.VITE_EMERGENCY_COOLDOWN_MS || '3600000'),
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
