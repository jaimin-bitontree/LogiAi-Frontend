import { api } from "./api";

const LOGIN_PATH = import.meta.env.VITE_AUTH_LOGIN_PATH ?? "/auth/login";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResult {
  access_token: string | null;
  token_type: string;
  expires_in: number;
  message: string;
  user_info: {
    user_id: string;
    email: string;
    full_name: string;
    role: string;
  } | null;
}

function getString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<LoginResult> {
  const response = await api.post<unknown>(LOGIN_PATH, credentials);

  if (!response?.data || typeof response.data !== "object") {
    throw new Error("Invalid login response from server.");
  }

  const payload = response.data as Record<string, unknown>;

  const userInfoRaw =
    payload.user_info && typeof payload.user_info === "object"
      ? (payload.user_info as Record<string, unknown>)
      : null;

  const access_token = getString(payload, "access_token");

  const success = payload.success === true || access_token !== null;

  if (!success) {
    const message =
      getString(payload, "message") ||
      "Login failed. Please check your credentials.";
    throw new Error(message);
  }

  const user_info = userInfoRaw
    ? {
        user_id: getString(userInfoRaw, "user_id") || "",
        email: getString(userInfoRaw, "email") || "",
        full_name: getString(userInfoRaw, "full_name") || "",
        role: getString(userInfoRaw, "role") || "",
      }
    : null;

  return {
    access_token,
    token_type: getString(payload, "token_type") || "bearer",
    expires_in: Number(payload.expires_in) || 0,
    message: getString(payload, "message") || "Login successful.",
    user_info,
  };
}
