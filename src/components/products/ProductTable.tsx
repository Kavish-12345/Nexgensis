import Image from "next/image";
import Link from "next/link";
import { formatPrice, stockClass } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Desktop view (md and up). ProductCards covers mobile.
export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                {/* unoptimized: image URLs can come from any host (including
                    ones users type into the form), so skip Next's optimizer. */}
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 rounded object-cover"
                />
              </td>
              <td className="px-4 py-2 font-medium">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.title}
                </Link>
              </td>
              <td className="px-4 py-2 capitalize text-gray-600">{product.category}</td>
              <td className="px-4 py-2">{formatPrice(product.price)}</td>
              <td className="px-4 py-2">★ {product.rating.toFixed(1)}</td>
              <td className="px-4 py-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stockClass(product.stock)}`}>
                  {product.stock}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-right">
                <button onClick={() => onEdit(product)} className="mr-3 text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => onDelete(product)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
