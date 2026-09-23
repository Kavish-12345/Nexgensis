import { useEffect, useState } from "react";
import { fetchCategories } from "@/api/products.api";
import { ApiError, isCanceled } from "@/lib/axios";
import type { Category } from "@/types/product";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then((list) => {
        setCategories(list);
        setError(null);
      })
      .catch((err: unknown) => {
        if (isCanceled(err)) return;
        setError(err instanceof ApiError ? err.message : "Failed to load categories.");
      });
    return () => controller.abort();
  }, [reloadCount]);

  return { categories, error, retry: () => setReloadCount((count) => count + 1) };
}
