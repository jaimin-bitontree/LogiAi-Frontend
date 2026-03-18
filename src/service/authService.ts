import { api } from "./api";

const LOGIN_PATH = import.meta.env.VITE_AUTH_LOGIN_PATH ?? "/auth/login";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResult {
  token: string | null;
  message: string;
  adminName: string | null;
}

function getString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getNameFromRecord(record: Record<string, unknown> | null): string | null {
  if (!record) return null;

  return (
    getString(record, "name") ||
    getString(record, "full_name") ||
    getString(record, "fullName") ||
    getString(record, "username")
  );
}

export async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<LoginResult> {
  const response = await api.post<unknown>(LOGIN_PATH, credentials);

  if (!response?.data || typeof response.data !== "object") {
    throw new Error("Invalid login response from server.");
  }

  const payload = response.data as Record<string, unknown>;
  const nestedData =
    payload.data && typeof payload.data === "object"
      ? (payload.data as Record<string, unknown>)
      : null;

  const payloadAdmin =
    payload.admin && typeof payload.admin === "object"
      ? (payload.admin as Record<string, unknown>)
      : null;
  const payloadUser =
    payload.user && typeof payload.user === "object"
      ? (payload.user as Record<string, unknown>)
      : null;
  const payloadUserInfo =
    payload.user_info && typeof payload.user_info === "object"
      ? (payload.user_info as Record<string, unknown>)
      : null;
  const nestedAdmin =
    nestedData?.admin && typeof nestedData.admin === "object"
      ? (nestedData.admin as Record<string, unknown>)
      : null;
  const nestedUser =
    nestedData?.user && typeof nestedData.user === "object"
      ? (nestedData.user as Record<string, unknown>)
      : null;
  const nestedUserInfo =
    nestedData?.user_info && typeof nestedData.user_info === "object"
      ? (nestedData.user_info as Record<string, unknown>)
      : null;

  const token =
    getString(payload, "token") ||
    getString(payload, "access_token") ||
    getString(payload, "accessToken") ||
    (nestedData ? getString(nestedData, "token") : null) ||
    (nestedData ? getString(nestedData, "access_token") : null);

  const success =
    payload.success === true ||
    payload.status === true ||
    payload.ok === true ||
    token !== null;

  if (!success) {
    const message =
      getString(payload, "message") ||
      getString(payload, "detail") ||
      "Login failed. Please check your credentials.";
    throw new Error(message);
  }

  return {
    token,
    message:
      getString(payload, "message") ||
      "Login successful.",
    adminName:
      getNameFromRecord(payloadAdmin) ||
      getNameFromRecord(payloadUser) ||
      getNameFromRecord(payloadUserInfo) ||
      getNameFromRecord(nestedAdmin) ||
      getNameFromRecord(nestedUser) ||
      getNameFromRecord(nestedUserInfo) ||
      getNameFromRecord(nestedData) ||
      getNameFromRecord(payload),
  };
}
