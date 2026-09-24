import type { Product, ProductInput } from "@/types/product";

const PLACEHOLDER_IMAGE = "https://dummyjson.com/image/150";

// Inputs hold strings; they are only turned into numbers after validation.
export interface ProductFormValues {
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  rating: string;
  thumbnail: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export function toFormValues(product?: Product): ProductFormValues {
  return {
    title: product?.title ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
    rating: product ? String(product.rating) : "",
    thumbnail: product?.thumbnail ?? "",
  };
}

// Returns either errors to show, or clean input ready to send.
export function validateProductForm(
  values: ProductFormValues,
): { errors: ProductFormErrors; input: ProductInput | null } {
  const errors: ProductFormErrors = {};
  // Number("") is 0, so empty fields must be checked before converting.
  const price = Number(values.price);
  const stock = Number(values.stock);
  const rating = values.rating.trim() === "" ? 0 : Number(values.rating);
  const thumbnail = values.thumbnail.trim();

  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.category) errors.category = "Category is required.";

  if (values.price.trim() === "") errors.price = "Price is required.";
  else if (!Number.isFinite(price) || price < 0) errors.price = "Price must be 0 or more.";

  if (values.stock.trim() === "") errors.stock = "Stock is required.";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number, 0 or more.";

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) errors.rating = "Rating must be between 0 and 5.";

  if (thumbnail && !/^https?:\/\//.test(thumbnail)) errors.thumbnail = "Image URL must start with http:// or https://";

  if (Object.keys(errors).length > 0) return { errors, input: null };

  return {
    errors,
    input: {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      price,
      stock,
      rating,
      thumbnail: thumbnail || PLACEHOLDER_IMAGE,
    },
  };
}
