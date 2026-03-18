/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../service/api";
import { loginWithCredentials } from "../service/authService";

const AUTH_TOKEN_STORAGE_KEY = "logiai_auth_token";
const AUTH_SESSION_STORAGE_KEY = "logiai_auth_session";
const AUTH_ADMIN_NAME_STORAGE_KEY = "logiai_admin_name";

interface AuthContextValue {
  isAuthenticated: boolean;
  adminName: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function applyAuthHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminName, setAdminName] = useState(() => {
    return localStorage.getItem(AUTH_ADMIN_NAME_STORAGE_KEY) ?? "Admin User";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const savedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

    if (savedToken) {
      applyAuthHeader(savedToken);
      return true;
    }

    return savedSession === "active";
  });

  const login = async (email: string, password: string) => {
    const result = await loginWithCredentials({ email, password });
    const resolvedName = result.adminName || "Admin User";

    if (result.token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token);
      applyAuthHeader(result.token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      applyAuthHeader(null);
    }

    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, "active");
    localStorage.setItem(AUTH_ADMIN_NAME_STORAGE_KEY, resolvedName);
    setAdminName(resolvedName);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    localStorage.removeItem(AUTH_ADMIN_NAME_STORAGE_KEY);
    applyAuthHeader(null);
    setAdminName("Admin User");
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      adminName,
      login,
      logout,
    }),
    [isAuthenticated, adminName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
