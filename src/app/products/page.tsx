import { Suspense } from "react";
import { ProductListView } from "@/components/products/ProductListView";
import { LoadingView } from "@/components/ui/StateViews";

export default function ProductsPage() {
  // ProductListView reads the URL with useSearchParams, which Next.js
  // requires to sit inside a Suspense boundary.
  return (
    <Suspense fallback={<LoadingView />}>
      <ProductListView />
    </Suspense>
  );
}
