import type { Product, ProductListResponse } from "@/types/product";

// DummyJSON doesn't save add/edit/delete, so we remember them in the browser
// and apply them on top of whatever the API returns.
export interface Overrides {
  added: Product[]; // products created in this session
  edited: Record<number, Partial<Product>>; // changes to API products, by id
  deletedIds: number[]; // API products deleted in this session
  nextLocalId: number; // id for the next added product
}

// DummyJSON gives every new product id 195, so we make our own ids instead.
// Anything at or above this number only exists locally, never on the API.
export const LOCAL_ID_START = 1_000_000;
export const isLocalId = (id: number) => id >= LOCAL_ID_START;

export const EMPTY_OVERRIDES: Overrides = {
  added: [],
  edited: {},
  deletedIds: [],
  nextLocalId: LOCAL_ID_START,
};

export function applyOverridesToProduct(product: Product, overrides: Overrides): Product | null {
  if (overrides.deletedIds.includes(product.id)) return null;
  return { ...product, ...overrides.edited[product.id] };
}

export function applyOverridesToList(
  response: ProductListResponse,
  overrides: Overrides,
  { page, filtered }: { page: number; filtered: boolean },
): { products: Product[]; total: number } {
  const fromApi = response.products
    .map((product) => applyOverridesToProduct(product, overrides))
    .filter((product): product is Product => product !== null);
  const removedHere = response.products.length - fromApi.length;

  // Added products only exist locally, so they belong to the unfiltered list
  // only, pinned to the top of page 1.
  const added = filtered ? [] : overrides.added;

  return {
    products: page === 1 ? [...added, ...fromApi] : fromApi,
    total: response.total + added.length - removedHere,
  };
}
