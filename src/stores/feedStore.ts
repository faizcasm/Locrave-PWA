import { create } from 'zustand';
import { Post, CreatePostRequest, CreateCommentRequest, Comment } from '../types/post.types';
import { PaginatedResponse } from '../types/global.types';
import apiClient, { handleApiError, uploadFile } from '../lib/api/client';
import { savePosts, getPosts } from '../lib/storage/indexedDB';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;

  // Actions
  fetchPosts: (page?: number) => Promise<void>;
  createPost: (data: CreatePostRequest) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, data: CreateCommentRequest) => Promise<Comment>;
  deletePost: (postId: string) => Promise<void>;
  reportPost: (postId: string, reason: string, details?: string) => Promise<void>;
  loadOfflinePosts: () => Promise<void>;
  clearError: () => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,
  currentPage: 1,

  fetchPosts: async (page = 1) => {
    const isFirstPage = page === 1;
    set({ 
      isLoading: isFirstPage, 
      isLoadingMore: !isFirstPage, 
      error: null 
    });

    try {
      const response = await apiClient.get<PaginatedResponse<Post>>('/posts', {
        params: { page, limit: 20 },
      });

      const { data: newPosts, pagination } = response.data;
      
      // Save to IndexedDB for offline access
      await savePosts(newPosts);

      set((state) => ({
        posts: page === 1 ? newPosts : [...state.posts, ...newPosts],
        currentPage: page,
        hasMore: pagination.page < pagination.totalPages,
        isLoading: false,
        isLoadingMore: false,
      }));
    } catch (error) {
      set({ 
        error: handleApiError(error), 
        isLoading: false, 
        isLoadingMore: false 
      });
    }
  },

  createPost: async (data: CreatePostRequest) => {
    set({ error: null });
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('content', data.content);
      if (data.title) formData.append('title', data.title);
      formData.append('location', JSON.stringify(data.location));
      if (data.radius) formData.append('radius', data.radius.toString());
      
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await uploadFile('/posts', formData);
      const newPost = response.data.data;

      set((state) => ({
        posts: [newPost, ...state.posts],
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  likePost: async (postId: string) => {
    // Optimistic update
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
          : post
      ),
    }));

    try {
      await apiClient.post(`/posts/${postId}/like`);
    } catch (error) {
      // Rollback on error
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isLiked: false, likesCount: post.likesCount - 1 }
            : post
        ),
        error: handleApiError(error),
      }));
    }
  },

  unlikePost: async (postId: string) => {
    // Optimistic update
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: false, likesCount: post.likesCount - 1 }
          : post
      ),
    }));

    try {
      await apiClient.delete(`/posts/${postId}/like`);
    } catch (error) {
      // Rollback on error
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
            : post
        ),
        error: handleApiError(error),
      }));
    }
  },

  addComment: async (postId: string, data: CreateCommentRequest) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, data);
      const newComment = response.data.data;

      // Update comment count
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, commentsCount: post.commentsCount + 1 }
            : post
        ),
      }));

      return newComment;
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  deletePost: async (postId: string) => {
    try {
      await apiClient.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  reportPost: async (postId: string, reason: string, details?: string) => {
    try {
      await apiClient.post(`/posts/${postId}/report`, { reason, details });
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  loadOfflinePosts: async () => {
    try {
      const offlinePosts = await getPosts();
      if (offlinePosts.length > 0) {
        set({ posts: offlinePosts });
      }
    } catch (error) {
      console.error('Failed to load offline posts:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
