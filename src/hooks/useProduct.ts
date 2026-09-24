import { useEffect, useState } from "react";
import { fetchProduct } from "@/api/products.api";
import { ApiError, isCanceled } from "@/lib/axios";
import type { Product } from "@/types/product";

export type ProductStatus = "loading" | "success" | "error" | "not-found";

interface Settled {
  key: string;
  product: Product | null;
  status: ProductStatus;
  error: string | null;
}

// Loads one product. Pass null to skip fetching (e.g. the id in the URL
// isn't a valid number), which is reported as "not-found".
export function useProduct(id: number | null) {
  const [reloadCount, setReloadCount] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);
  const key = `${id}|${reloadCount}`;

  useEffect(() => {
    if (id === null) return;
    const controller = new AbortController();

    fetchProduct(id, controller.signal)
      .then((product) => setSettled({ key, product, status: "success", error: null }))
      .catch((err: unknown) => {
        if (isCanceled(err)) return;
        // DummyJSON answers 404 for an id that doesn't exist.
        if (err instanceof ApiError && err.status === 404) {
          setSettled({ key, product: null, status: "not-found", error: null });
          return;
        }
        const message = err instanceof ApiError ? err.message : "Failed to load product.";
        setSettled({ key, product: null, status: "error", error: message });
      });

    return () => controller.abort();
  }, [key, id]);

  const isCurrent = settled !== null && settled.key === key;
  let status: ProductStatus = "loading";
  if (id === null) status = "not-found";
  else if (isCurrent) status = settled.status;

  return {
    product: isCurrent ? settled.product : null,
    error: isCurrent ? settled.error : null,
    status,
    retry: () => setReloadCount((count) => count + 1),
  };
}
