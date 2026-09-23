import { PAGE_SIZES, type PageSize } from "@/lib/urlState";

interface PageSizeSelectProps {
  value: PageSize;
  onChange: (size: PageSize) => void;
}

export function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Per page
      <select
        value={value}
        // The <select> only offers PAGE_SIZES, so the cast is safe.
        onChange={(e) => onChange(Number(e.target.value) as PageSize)}
        className="rounded-md border border-gray-300 bg-white px-2 py-1"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}
