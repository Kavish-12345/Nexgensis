import axios from "axios";
import { clearToken, getToken } from "./auth";

// Every failed request is turned into this one shape, so UI code never has
// to understand raw Axios errors.
export class ApiError extends Error {
  status: number | null;
  canceled: boolean;

  constructor(message: string, status: number | null = null, canceled = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.canceled = canceled;
  }
}

// A canceled request is expected (we abort old searches on purpose), so
// callers use this to ignore it instead of showing an error.
export function isCanceled(error: unknown): boolean {
  return error instanceof ApiError && error.canceled;
}

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});

// Attach the login token to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

// Success passes straight through; every error is normalized in one place.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);

function toApiError(error: unknown): ApiError {
  if (axios.isCancel(error)) return new ApiError("Request canceled", null, true);
  if (!axios.isAxiosError<{ message?: string }>(error)) {
    return new ApiError("Something went wrong. Please try again.");
  }

  const status = error.response?.status ?? null;

  // A 401 on the login call just means wrong details. Anywhere else it
  // means the session is no longer valid, so log the user out.
  const isLoginCall = error.config?.url?.includes("/auth/login");
  if (status === 401 && !isLoginCall) handleUnauthorized();

  if (error.code === "ECONNABORTED") {
    return new ApiError("The request timed out. Please try again.", status);
  }
  if (!error.response) {
    return new ApiError("Network error. Check your connection and try again.");
  }
  return new ApiError(error.response.data?.message ?? `Request failed (${status})`, status);
}

function handleUnauthorized() {
  clearToken();
  // This file isn't a React component, so there's no router here. A full
  // page load to /login also wipes any in-memory state from the old session.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  if (window.location.pathname !== "/login") window.location.assign("/login");
}
