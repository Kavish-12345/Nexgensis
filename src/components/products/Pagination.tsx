import { getPageItems } from "@/lib/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonClass =
  "min-w-9 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50";

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <button className={buttonClass} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>

      {getPageItems(page, totalPages).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${buttonClass} ${item === page ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-600" : ""}`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="px-1 text-gray-400">
            …
          </span>
        ),
      )}

      <button className={buttonClass} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}
