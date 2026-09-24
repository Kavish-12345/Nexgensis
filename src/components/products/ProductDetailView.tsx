"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocalOverrides } from "@/hooks/useLocalOverrides";
import { useProduct } from "@/hooks/useProduct";
import { formatPrice, stockClass } from "@/lib/format";
import { applyOverridesToProduct, isLocalId } from "@/lib/overrides";
import { parsePositiveInt } from "@/lib/urlState";
import type { Product, Review } from "@/types/product";
import { ErrorView, LoadingView, NotFoundView } from "@/components/ui/StateViews";

export function ProductDetailView({ rawId }: { rawId: string }) {
  // "/products/abc" or "/products/0" never reach the API.
  const id = parsePositiveInt(rawId);
  const { overrides } = useLocalOverrides();
  const isLocal = id !== null && isLocalId(id);
  // Products added in this session only exist locally, so don't fetch them.
  const remote = useProduct(id !== null && !isLocal ? id : null);

  let product: Product | null = null;
  if (isLocal) {
    product = overrides.added.find((p) => p.id === id) ?? null;
  } else if (remote.status === "loading") {
    return <LoadingView />;
  } else if (remote.status === "error") {
    return <ErrorView message={remote.error ?? "Failed to load product."} onRetry={remote.retry} />;
  } else if (remote.product) {
    product = applyOverridesToProduct(remote.product, overrides); // null if deleted locally
  }

  if (!product) return <NotFoundView message={`There is no product with id "${rawId}".`} />;

  return (
    <article className="space-y-8">
      <Link href="/products" className="text-sm text-blue-600 hover:underline">
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* key: start from the first image again if the product changes */}
        <Gallery key={product.id} images={product.images.length ? product.images : [product.thumbnail]} title={product.title} />

        <div className="space-y-3">
          <p className="text-sm capitalize text-gray-500">
            {product.brand ? `${product.brand} · ` : ""}
            {product.category}
          </p>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-3 text-sm">
            <span>★ {product.rating.toFixed(1)}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stockClass(product.stock)}`}>
              {product.stock} in stock
            </span>
          </div>
          <p className="text-gray-700">{product.description || "No description."}</p>
        </div>
      </div>

      <Reviews reviews={product.reviews ?? []} />
    </article>
  );
}

function Gallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <Image
        src={images[selected]}
        alt={title}
        width={600}
        height={600}
        unoptimized
        className="aspect-square w-full rounded-lg border border-gray-200 bg-white object-contain"
      />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={src}
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              className={`shrink-0 rounded border-2 ${index === selected ? "border-blue-600" : "border-transparent"}`}
            >
              <Image src={src} alt="" width={64} height={64} unoptimized className="h-16 w-16 rounded object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={`${review.reviewerEmail}-${review.date}`} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{review.reviewerName}</span>
                <span className="text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm">★ {review.rating}</p>
              <p className="mt-1 text-sm text-gray-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
