import { ProductDetailView } from "@/components/products/ProductDetailView";

// In Next.js 15+ route params arrive as a Promise.
export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  return <ProductDetailView rawId={id} />;
}
