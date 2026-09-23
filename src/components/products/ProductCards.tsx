import Image from "next/image";
import Link from "next/link";
import { formatPrice, stockClass } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductCardsProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Mobile view (below md). ProductTable covers desktop.
export function ProductCards({ products, onEdit, onDelete }: ProductCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {products.map((product) => (
        <li key={product.id} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={64}
            height={64}
            unoptimized
            className="h-16 w-16 shrink-0 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <Link href={`/products/${product.id}`} className="block truncate font-medium hover:underline">
              {product.title}
            </Link>
            <p className="text-sm capitalize text-gray-500">{product.category}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-medium">{formatPrice(product.price)}</span>
              <span>★ {product.rating.toFixed(1)}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stockClass(product.stock)}`}>
                {product.stock} in stock
              </span>
            </div>
            <div className="mt-2 flex gap-4 text-sm">
              <button onClick={() => onEdit(product)} className="text-blue-600 hover:underline">
                Edit
              </button>
              <button onClick={() => onDelete(product)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
