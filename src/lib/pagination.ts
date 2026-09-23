export type PageItem = number | "ellipsis-start" | "ellipsis-end";

// Page buttons to show: always the first and last page, the current page with
// one neighbour on each side, and an ellipsis for any gap.
// e.g. current 10 of 20 -> 1 … 9 10 11 … 20
export function getPageItems(current: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  const items: PageItem[] = [1];
  if (start > 2) items.push("ellipsis-start");
  for (let page = start; page <= end; page++) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis-end");
  items.push(totalPages);
  return items;
}

// "Showing 21–40 of 194". With zero results it must not read "Showing 1–0 of 0".
export function getRangeText(page: number, limit: number, total: number): string {
  if (total === 0) return "No results";
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  if (start > total) return `Showing 0 of ${total}`;
  return `Showing ${start}–${end} of ${total}`;
}
