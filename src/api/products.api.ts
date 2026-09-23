import { api } from "@/lib/axios";
import type { SortField, SortOrder } from "@/lib/urlState";
import type { Category, Product, ProductInput, ProductListResponse } from "@/types/product";

export interface ProductListQuery {
  page: number;
  limit: number;
  q: string;
  category: string;
  sortBy?: SortField;
  order: SortOrder;
  // Test-only: DummyJSON waits this many ms before answering. Used to check
  // that slow, old search responses never overwrite newer ones.
  delay?: number;
}

export async function fetchProducts(
  query: ProductListQuery,
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  const { page, limit, q, category, sortBy, order, delay } = query;

  // DummyJSON has no endpoint that searches and filters by category at the
  // same time, so search takes priority over category.
  let url = "/products";
  if (q) url = "/products/search";
  else if (category) url = `/products/category/${encodeURIComponent(category)}`;

  // Axios leaves undefined values out of the query string.
  const params = {
    q: q || undefined,
    limit,
    skip: (page - 1) * limit,
    sortBy,
    order: sortBy ? order : undefined,
    delay,
  };

  const { data } = await api.get<ProductListResponse>(url, { params, signal });
  return data;
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/products/categories", { signal });
  return data;
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`, { signal });
  return data;
}

// DummyJSON answers add/update/delete as if they worked, but nothing is saved
// on the server. The app keeps the change locally (see useLocalOverrides).
export async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await api.post<Product>("/products/add", input);
  return data;
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, input);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
