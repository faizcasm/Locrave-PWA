// Global types and enums
export enum UserRole {
  USER = 'USER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum PostType {
  ISSUE = 'ISSUE',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ALERT = 'ALERT',
  GENERAL = 'GENERAL',
  EMERGENCY = 'EMERGENCY',
}

export enum BookingStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MarketplaceStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
}

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  INAPPROPRIATE = 'INAPPROPRIATE',
  MISINFORMATION = 'MISINFORMATION',
  OTHER = 'OTHER',
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface PageInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PageInfo;
}
