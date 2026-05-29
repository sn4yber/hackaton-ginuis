"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/lib/auth-storage";
import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  updateProfile as updateProfileRequest,
} from "@/services/auth.service";
import type { LoginInput, PublicUser, RegisterInput } from "@/types/auth";

interface AuthContextValue {
  user: PublicUser | null;
  token: string | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  updateProfile: (input: {
    name?: string;
    city?: string | null;
    interests?: string[];
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((nextToken: string, nextUser: PublicUser) => {
    setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    fetchCurrentUser(storedToken)
      .then((currentUser) => {
        setToken(storedToken);
        setUser(currentUser);
      })
      .catch(() => {
        clearStoredToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await loginUser(input);
      applySession(response.token, response.user);
    },
    [applySession]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const response = await registerUser(input);
      applySession(response.token, response.user);
    },
    [applySession]
  );

  const updateProfile = useCallback(
    async (input: { name?: string; city?: string | null; interests?: string[] }) => {
      if (!token) throw new Error("No autenticado");
      const user = await updateProfileRequest(token, input);
      setUser(user);
    },
    [token]
  );

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, updateProfile, logout }),
    [user, token, isLoading, login, register, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No pudimos completar la solicitud. Intenta de nuevo.";
}
