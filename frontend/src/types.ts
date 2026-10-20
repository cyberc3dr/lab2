export type Role = 'ADMIN' | 'USER';

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  role: Role;
}

export interface MeResponse {
  id: number;
  username: string;
  role: Role;
}

export interface LinkResponse {
  id: number;
  title: string;
  url: string;
  description: string | null;
  createdAt: string;
  userId: number | null;
}

export interface LinkRequest {
  title: string;
  url: string;
  description?: string | null;
  isPublic?: boolean;
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

export interface ApiErrorPayload {
  status?: number;
  message?: string;
}

export interface Toast {
  message: string;
  type: 'info' | 'success' | 'error';
}
