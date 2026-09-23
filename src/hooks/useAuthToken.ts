import { useSyncExternalStore } from "react";
import { getToken } from "@/lib/auth";

// Fires when another tab logs in or out.
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

// Returns undefined = not known yet (server render / first paint),
// null = logged out, string = logged in.
// The "not known yet" state lets us show a loader instead of flashing the
// protected page (or the login page) before localStorage has been read.
export function useAuthToken(): string | null | undefined {
  return useSyncExternalStore(subscribe, getToken, () => undefined);
}
