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

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    city: string | null;
    interests: string[];
    createdAt: Date;
  };
  token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
