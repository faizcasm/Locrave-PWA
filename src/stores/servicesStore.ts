import { create } from 'zustand';
import {
  Service,
  Booking,
  ServiceCategory,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  CreateReviewRequest,
} from '../types/service.types';
import { PaginatedResponse } from '../types/global.types';
import apiClient, { handleApiError } from '../lib/api/client';

interface ServicesState {
  services: Service[];
  categories: ServiceCategory[];
  bookings: Booking[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;

  // Actions
  fetchServices: (page?: number, categoryId?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
  createBooking: (data: CreateBookingRequest) => Promise<void>;
  updateBookingStatus: (bookingId: string, data: UpdateBookingStatusRequest) => Promise<void>;
  createReview: (bookingId: string, data: CreateReviewRequest) => Promise<void>;
  clearError: () => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  categories: [],
  bookings: [],
  isLoading: false,
  hasMore: true,
  error: null,
  currentPage: 1,

  fetchServices: async (page = 1, categoryId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (categoryId) params.categoryId = categoryId;

      const response = await apiClient.get<PaginatedResponse<Service>>('/services', {
        params,
      });

      const { data: newServices, pagination } = response.data;

      set((state) => ({
        services: page === 1 ? newServices : [...state.services, ...newServices],
        currentPage: page,
        hasMore: pagination.page < pagination.totalPages,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await apiClient.get('/services/categories');
      set({ categories: response.data.data });
    } catch (error) {
      set({ error: handleApiError(error) });
    }
  },

  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/bookings/me');
      set({ bookings: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
    }
  },

  createBooking: async (data: CreateBookingRequest) => {
    set({ error: null });
    try {
      const response = await apiClient.post('/bookings', data);
      const newBooking = response.data.data;

      set((state) => ({
        bookings: [newBooking, ...state.bookings],
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  updateBookingStatus: async (bookingId: string, data: UpdateBookingStatusRequest) => {
    set({ error: null });
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/status`, data);
      const updatedBooking = response.data.data;

      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking
        ),
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  createReview: async (bookingId: string, data: CreateReviewRequest) => {
    set({ error: null });
    try {
      await apiClient.post(`/bookings/${bookingId}/review`, data);
      
      // Update booking with review
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId 
            ? { ...booking, review: { ...data, id: '', bookingId, userId: '', createdAt: new Date().toISOString() } as never }
            : booking
        ),
      }));
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
