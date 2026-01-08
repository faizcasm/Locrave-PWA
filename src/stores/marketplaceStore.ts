import { create } from 'zustand';
import {
  MarketplaceListing,
  CreateListingRequest,
  UpdateListingRequest,
} from '../types/marketplace.types';
import { PaginatedResponse } from '../types/global.types';
import apiClient, { handleApiError, uploadFile } from '../lib/api/client';
import { saveListings, getListings } from '../lib/storage/indexedDB';

interface MarketplaceState {
  listings: MarketplaceListing[];
  myListings: MarketplaceListing[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;

  // Actions
  fetchListings: (page?: number) => Promise<void>;
  fetchMyListings: () => Promise<void>;
  createListing: (data: CreateListingRequest) => Promise<void>;
  updateListing: (id: string, data: UpdateListingRequest) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  markAsSold: (id: string) => Promise<void>;
  loadOfflineListings: () => Promise<void>;
  clearError: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  listings: [],
  myListings: [],
  isLoading: false,
  hasMore: true,
  error: null,
  currentPage: 1,

  fetchListings: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<PaginatedResponse<MarketplaceListing>>(
        '/marketplace',
        { params: { page, limit: 20 } }
      );

      const { data: newListings, pagination } = response.data;
      
      // Save to IndexedDB
      await saveListings(newListings);

      set((state) => ({
        listings: page === 1 ? newListings : [...state.listings, ...newListings],
        currentPage: page,
        hasMore: pagination.page < pagination.totalPages,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
    }
  },

  fetchMyListings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/marketplace/me');
      set({ myListings: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
    }
  },

  createListing: async (data: CreateListingRequest) => {
    set({ error: null });
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('location', JSON.stringify(data.location));
      if (data.category) formData.append('category', data.category);
      if (data.radius) formData.append('radius', data.radius.toString());
      if (data.expiresAt) formData.append('expiresAt', data.expiresAt);

      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await uploadFile('/marketplace', formData);
      const newListing = response.data.data;

      set((state) => ({
        listings: [newListing, ...state.listings],
        myListings: [newListing, ...state.myListings],
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  updateListing: async (id: string, data: UpdateListingRequest) => {
    set({ error: null });
    try {
      const response = await apiClient.patch(`/marketplace/${id}`, data);
      const updatedListing = response.data.data;

      set((state) => ({
        listings: state.listings.map((listing) =>
          listing.id === id ? updatedListing : listing
        ),
        myListings: state.myListings.map((listing) =>
          listing.id === id ? updatedListing : listing
        ),
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  deleteListing: async (id: string) => {
    try {
      await apiClient.delete(`/marketplace/${id}`);
      set((state) => ({
        listings: state.listings.filter((listing) => listing.id !== id),
        myListings: state.myListings.filter((listing) => listing.id !== id),
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  markAsSold: async (id: string) => {
    try {
      await apiClient.patch(`/marketplace/${id}/sold`);
      set((state) => ({
        listings: state.listings.map((listing) =>
          listing.id === id ? { ...listing, status: 'SOLD' as const } : listing
        ),
        myListings: state.myListings.map((listing) =>
          listing.id === id ? { ...listing, status: 'SOLD' as const } : listing
        ),
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  loadOfflineListings: async () => {
    try {
      const offlineListings = await getListings();
      if (offlineListings.length > 0) {
        set({ listings: offlineListings });
      }
    } catch (error) {
      console.error('Failed to load offline listings:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
