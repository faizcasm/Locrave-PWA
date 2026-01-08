import { User } from './user.types';
import { Location, BookingStatus } from './global.types';

export interface ServiceCategory {
  id: string;
  name: string;
  icon?: string;
}

export interface Service {
  id: string;
  providerId: string;
  provider: User;
  categoryId: string;
  category: ServiceCategory;
  title: string;
  description: string;
  images?: string[];
  price: number;
  priceUnit: string;
  location: Location;
  radius: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  service: Service;
  userId: string;
  user: User;
  providerId: string;
  provider: User;
  status: BookingStatus;
  scheduledAt: string;
  completedAt?: string;
  price: number;
  notes?: string;
  review?: Review;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  user: User;
  serviceId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  serviceId: string;
  scheduledAt: string;
  notes?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}
