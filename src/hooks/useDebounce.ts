import { useEffect, useState } from "react";

// Returns `value`, but only after it has stopped changing for `delayMs`.
// Each change clears the previous timer, so fast typing produces one update.
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
