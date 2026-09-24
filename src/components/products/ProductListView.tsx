"use client";

import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useListUrlState } from "@/hooks/useListUrlState";
import { useLocalOverrides } from "@/hooks/useLocalOverrides";
import { useProductList } from "@/hooks/useProductList";
import { applyOverridesToList } from "@/lib/overrides";
import { getRangeText } from "@/lib/pagination";
import type { Product } from "@/types/product";
import { FilterSortBar } from "./FilterSortBar";
import { Pagination } from "./Pagination";
import { PageSizeSelect } from "./PageSizeSelect";
import { ProductCards } from "./ProductCards";
import { ProductDialogs, type ProductDialogState } from "./ProductDialogs";
import { ProductTable } from "./ProductTable";
import { SearchBar } from "./SearchBar";
import { EmptyView, ErrorView, LoadingView } from "@/components/ui/StateViews";

export function ProductListView() {
  const { state, update } = useListUrlState();
  const { data, status, error, retry } = useProductList(state);
  const { overrides } = useLocalOverrides();
  const categories = useCategories();
  const [dialog, setDialog] = useState<ProductDialogState>(null);

  // Apply local add/edit/delete on top of the API response.
  const filtered = Boolean(state.q || state.category);
  const view = data ? applyOverridesToList(data, overrides, { page: state.page, filtered }) : null;

  const total = view?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / state.limit));
  // ?page=999: only knowable after the API tells us the total.
  const pageOutOfRange = status === "success" && total > 0 && state.page > totalPages;

  useEffect(() => {
    if (pageOutOfRange) update({ page: totalPages });
  }, [pageOutOfRange, totalPages, update]);

  function renderBody() {
    if (status === "error") {
      return <ErrorView message={error ?? "Failed to load products."} onRetry={retry} />;
    }
    if (!view || pageOutOfRange || (status === "loading" && view.products.length === 0)) {
      return <LoadingView />;
    }
    if (view.products.length === 0) {
      return filtered ? (
        <EmptyView
          message="No products match your search or filter."
          actionLabel="Clear filters"
          onAction={() => update({ q: "", category: "" })}
        />
      ) : (
        <EmptyView message="No products found." />
      );
    }

    const actions = {
      onEdit: (product: Product) => setDialog({ mode: "edit", product }),
      onDelete: (product: Product) => setDialog({ mode: "delete", product }),
    };

    return (
      <>
        {/* Keep old rows visible (dimmed) while the next page loads. */}
        <div aria-busy={status === "loading"} className={status === "loading" ? "opacity-60" : ""}>
          <ProductTable products={view.products} {...actions} />
          <ProductCards products={view.products} {...actions} />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">{getRangeText(state.page, state.limit, total)}</p>
            <PageSizeSelect value={state.limit} onChange={(limit) => update({ limit })} />
          </div>
          <Pagination page={state.page} totalPages={totalPages} onPageChange={(page) => update({ page })} />
        </div>
      </>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => setDialog({ mode: "create" })}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add product
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchBar q={state.q} onSearch={(q) => update({ q })} />
        <FilterSortBar
          categories={categories.categories}
          categoriesError={categories.error}
          onRetryCategories={categories.retry}
          category={state.category}
          searchActive={state.q !== ""}
          sortBy={state.sortBy}
          order={state.order}
          onCategoryChange={(category) => update({ category })}
          onSortChange={(sortBy, order) => update({ sortBy, order })}
        />
      </div>

      <p className="text-xs text-gray-500">
        Note: the demo API doesn&apos;t save changes, so added, edited and deleted products are kept in this
        browser tab only and reset on refresh.
      </p>

      {renderBody()}

      <ProductDialogs dialog={dialog} categories={categories.categories} onClose={() => setDialog(null)} />
    </section>
  );
}
