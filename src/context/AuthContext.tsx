/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../service/api";
import { loginWithCredentials } from "../service/authService";

const AUTH_TOKEN_STORAGE_KEY = "logiai_auth_token";
const AUTH_SESSION_STORAGE_KEY = "logiai_auth_session";
const AUTH_ADMIN_NAME_STORAGE_KEY = "logiai_admin_name";

interface AuthContextValue {
  isAuthenticated: boolean;
  adminName: string;
  login: (email: string, password: string) => Promise<{ message: string }>;
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
    const savedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!savedToken) return "Admin User";
    return localStorage.getItem(AUTH_ADMIN_NAME_STORAGE_KEY) ?? "Admin User";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (savedToken) {
      applyAuthHeader(savedToken);
      return true;
    }

    return false;
  });

  useEffect(() => {
    const handleForcedLogout = () => {
      applyAuthHeader(null);
      setAdminName("Admin User");
      setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", handleForcedLogout);

    return () => {
      window.removeEventListener("auth:logout", handleForcedLogout);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = window.setInterval(() => {
      const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
      if (token) return;

      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      localStorage.removeItem(AUTH_ADMIN_NAME_STORAGE_KEY);
      applyAuthHeader(null);
      setAdminName("Admin User");
      setIsAuthenticated(false);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    const result = await loginWithCredentials({ email, password });
    const resolvedName = result.user_info?.full_name || "Admin User";

    if (result.access_token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.access_token);
      applyAuthHeader(result.access_token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      applyAuthHeader(null);
    }

    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, "active");
    localStorage.setItem(AUTH_ADMIN_NAME_STORAGE_KEY, resolvedName);
    setAdminName(resolvedName);
    setIsAuthenticated(true);

    return { message: result.message };
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
