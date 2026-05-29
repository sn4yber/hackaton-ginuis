export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string | null;
  interests: string[];
  createdAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  city?: string;
  interests?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}
