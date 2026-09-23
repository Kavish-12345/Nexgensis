// The URL is the single source of truth for the list view. This file turns
// untrusted query params into a valid ListState and back again.

export const PAGE_SIZES = [10, 20, 50] as const;
export type PageSize = (typeof PAGE_SIZES)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 10;

export const SORT_FIELDS = ["title", "price", "rating"] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = "asc" | "desc";

const MAX_DELAY_MS = 5000;

export interface ListState {
  page: number;
  limit: PageSize;
  q: string;
  category: string;
  sortBy?: SortField;
  order: SortOrder;
  delay?: number;
}

// Anything with .get() works: URLSearchParams or Next's ReadonlyURLSearchParams.
interface ParamReader {
  get(name: string): string | null;
}

// Only plain digits count, so "abc", "-1", "1.5" and "" are all rejected.
export function parsePositiveInt(raw: string | null): number | null {
  if (!raw || !/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 1 && Number.isSafeInteger(n) ? n : null;
}

export function parseListState(params: ParamReader): ListState {
  const limit = parsePositiveInt(params.get("limit"));
  const sortBy = params.get("sortBy");
  const delay = parsePositiveInt(params.get("delay"));

  return {
    // Too-large pages (?page=999) are clamped later, once we know the total.
    page: parsePositiveInt(params.get("page")) ?? 1,
    limit: PAGE_SIZES.find((size) => size === limit) ?? DEFAULT_PAGE_SIZE,
    q: params.get("q")?.trim() ?? "",
    category: params.get("category")?.trim() ?? "",
    sortBy: SORT_FIELDS.find((field) => field === sortBy),
    order: params.get("order") === "desc" ? "desc" : "asc",
    delay: delay === null ? undefined : Math.min(delay, MAX_DELAY_MS),
  };
}

// Default values are left out to keep shared links short.
export function serializeListState(state: ListState): string {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category) params.set("category", state.category);
  if (state.sortBy) {
    params.set("sortBy", state.sortBy);
    params.set("order", state.order);
  }
  if (state.limit !== DEFAULT_PAGE_SIZE) params.set("limit", String(state.limit));
  if (state.page !== 1) params.set("page", String(state.page));
  if (state.delay) params.set("delay", String(state.delay));
  return params.toString();
}

// Changing what the list shows makes the old page number meaningless, so go
// back to page 1 unless the caller set a page explicitly.
const RESETS_PAGE: (keyof ListState)[] = ["q", "category", "limit", "sortBy", "order"];

export function applyListPatch(current: ListState, patch: Partial<ListState>): ListState {
  const next = { ...current, ...patch };
  const listChanged = RESETS_PAGE.some((key) => next[key] !== current[key]);
  if (listChanged && patch.page === undefined) next.page = 1;
  return next;
}
