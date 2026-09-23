const TOKEN_KEY = "auth_token";

// localStorage only exists in the browser. On the server these helpers
// behave as "logged out" instead of crashing.
const isBrowser = () => typeof window !== "undefined";

export function getToken(): string | null {
  return isBrowser() ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token: string): void {
  if (isBrowser()) window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (isBrowser()) window.localStorage.removeItem(TOKEN_KEY);
}
