"use client";

import { useRef, useState } from "react";
import { ApiError } from "@/lib/axios";
import { toFormValues, validateProductForm, type ProductFormErrors, type ProductFormValues } from "@/lib/productForm";
import type { Category, Product, ProductInput } from "@/types/product";

interface ProductFormProps {
  product?: Product; // present = edit, absent = add
  categories: Category[];
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}

const inputClass = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

export function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // Same double-click guard as the login form: a ref updates instantly.
  const savingRef = useRef(false);

  function setField(field: keyof ProductFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingRef.current) return;

    const result = validateProductForm(values);
    setErrors(result.errors);
    if (!result.input) return;

    savingRef.current = true;
    setIsSaving(true);
    setSubmitError(null);
    try {
      await onSubmit(result.input);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Could not save the product.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  // Small helper so every field renders its label and error the same way.
  function field(name: keyof ProductFormValues, label: string, input: React.ReactNode) {
    return (
      <div>
        <label htmlFor={name} className="mb-1 block text-sm font-medium">
          {label}
        </label>
        {input}
        {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
      </div>
    );
  }

  const textInput = (name: keyof ProductFormValues, type = "text") => (
    <input
      id={name}
      type={type}
      value={values[name]}
      onChange={(e) => setField(name, e.target.value)}
      className={inputClass}
    />
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {field("title", "Title *", textInput("title"))}
      {field(
        "description",
        "Description",
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          className={inputClass}
        />,
      )}
      {field(
        "category",
        "Category *",
        <select
          id="category"
          value={values.category}
          onChange={(e) => setField("category", e.target.value)}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>,
      )}
      <div className="grid grid-cols-3 gap-3">
        {field("price", "Price *", textInput("price", "number"))}
        {field("stock", "Stock *", textInput("stock", "number"))}
        {field("rating", "Rating", textInput("rating", "number"))}
      </div>
      {field("thumbnail", "Image URL", textInput("thumbnail", "url"))}

      {submitError && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
