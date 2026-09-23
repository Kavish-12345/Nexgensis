import type { SortField, SortOrder } from "@/lib/urlState";
import type { Category } from "@/types/product";

// One dropdown value per sort choice, e.g. "price-desc". "" = API default order.
const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "title-asc", label: "Title: A–Z" },
  { value: "title-desc", label: "Title: Z–A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
];

interface FilterSortBarProps {
  categories: Category[];
  categoriesError: string | null;
  onRetryCategories: () => void;
  category: string;
  searchActive: boolean;
  sortBy?: SortField;
  order: SortOrder;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortField | undefined, order: SortOrder) => void;
}

const selectClass = "rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm disabled:bg-gray-100 disabled:text-gray-400";

export function FilterSortBar(props: FilterSortBarProps) {
  const { categories, category, searchActive, sortBy, order } = props;

  function handleSortChange(value: string) {
    if (!value) return props.onSortChange(undefined, "asc");
    // Values only come from SORT_OPTIONS, so the casts are safe.
    const [field, direction] = value.split("-") as [SortField, SortOrder];
    props.onSortChange(field, direction);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Filter by category"
        value={category}
        // The API can't search and filter by category together, so search wins.
        disabled={searchActive}
        onChange={(e) => props.onCategoryChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort products"
        value={sortBy ? `${sortBy}-${order}` : ""}
        onChange={(e) => handleSortChange(e.target.value)}
        className={selectClass}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {searchActive && <p className="text-xs text-gray-500">Clear the search to filter by category.</p>}
      {props.categoriesError && (
        <p className="text-xs text-red-600">
          Couldn&apos;t load categories.{" "}
          <button onClick={props.onRetryCategories} className="underline">
            Retry
          </button>
        </p>
      )}
    </div>
  );
}
