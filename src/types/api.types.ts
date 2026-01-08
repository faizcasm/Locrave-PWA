import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}

export type ApiErrorResponse = AxiosError<{
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}>;

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
}
