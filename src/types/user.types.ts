import { UserRole, Location } from './global.types';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  location?: Location;
  isVerified: boolean;
  isBanned: boolean;
  shadowBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
