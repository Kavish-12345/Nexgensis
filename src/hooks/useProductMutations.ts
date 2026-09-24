import { createProduct, deleteProduct, updateProduct } from "@/api/products.api";
import { isLocalId } from "@/lib/overrides";
import type { Product, ProductInput } from "@/types/product";
import { useLocalOverrides } from "./useLocalOverrides";

// Save/delete = real API call first (so errors are real and handled), then
// apply the change locally because the API doesn't actually save it.
// Products we added ourselves don't exist on the API (it would answer 404),
// so for those we only update the local copy.
export function useProductMutations() {
  const { addLocal, editLocal, deleteLocal } = useLocalOverrides();

  async function save(input: ProductInput, existing?: Product) {
    if (existing) {
      if (!isLocalId(existing.id)) await updateProduct(existing.id, input);
      editLocal(existing.id, input);
    } else {
      await createProduct(input);
      addLocal(input);
    }
  }

  async function remove(product: Product) {
    if (!isLocalId(product.id)) await deleteProduct(product.id);
    deleteLocal(product.id);
  }

  return { save, remove };
}
