import { useEffect, useRef, useState } from "react";
import { fetchProducts, type ProductListQuery } from "@/api/products.api";
import { ApiError, isCanceled } from "@/lib/axios";
import type { ProductListResponse } from "@/types/product";

export type ListStatus = "loading" | "success" | "error";

// The result of the last finished request, tagged with the query it answered.
interface Settled {
  key: string;
  data: ProductListResponse | null;
  error: string | null;
}

export function useProductList(query: ProductListQuery) {
  const { page, limit, q, category, sortBy, order, delay } = query;
  const [reloadCount, setReloadCount] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);
  const latestRequestId = useRef(0);

  // One string that identifies "the list we want right now". reloadCount is
  // part of it so Retry refetches even when nothing else changed.
  const key = [page, limit, q, category, sortBy, order, delay, reloadCount].join("|");

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++latestRequestId.current;

    fetchProducts({ page, limit, q, category, sortBy, order, delay }, controller.signal)
      .then((data) => {
        // Belt and braces: even if an old response slips past the abort,
        // only the newest request is allowed to update the screen.
        if (requestId !== latestRequestId.current) return;
        setSettled({ key, data, error: null });
      })
      .catch((error: unknown) => {
        // We aborted this request ourselves, so it's not a real error.
        if (isCanceled(error) || requestId !== latestRequestId.current) return;
        const message = error instanceof ApiError ? error.message : "Failed to load products.";
        setSettled({ key, data: null, error: message });
      });

    // React runs this cleanup before the effect runs again (the query changed)
    // and on unmount. Aborting cancels the old HTTP request, so a slow old
    // search can never land after a newer one.
    return () => controller.abort();
  }, [key, page, limit, q, category, sortBy, order, delay]);

  // Loading is derived, not stored: if the last result was for a different
  // key, the request for the current key is still in flight.
  const isCurrent = settled !== null && settled.key === key;
  const status: ListStatus = !isCurrent ? "loading" : settled.error ? "error" : "success";

  return {
    // While loading we keep the previous data so the table can stay on screen
    // (dimmed) instead of jumping to a spinner on every keystroke.
    data: settled?.data ?? null,
    error: isCurrent ? settled.error : null,
    status,
    retry: () => setReloadCount((count) => count + 1),
  };
}
