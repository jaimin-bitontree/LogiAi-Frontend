import axios from "axios";

const AUTH_TOKEN_STORAGE_KEY = "logiai_auth_token";
const AUTH_SESSION_STORAGE_KEY = "logiai_auth_session";
const AUTH_ADMIN_NAME_STORAGE_KEY = "logiai_admin_name";

function clearAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  localStorage.removeItem(AUTH_ADMIN_NAME_STORAGE_KEY);
}

function notifyForcedLogout() {
  window.dispatchEvent(new Event("auth:logout"));
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const hasActiveSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY) === "active";

  if (!token && hasActiveSession) {
    clearAuthStorage();
    notifyForcedLogout();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthStorage();
      notifyForcedLogout();
    }

    return Promise.reject(error);
  }
);