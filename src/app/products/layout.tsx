import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppHeader } from "@/components/auth/AppHeader";
import { LocalOverridesProvider } from "@/hooks/useLocalOverrides";

// Every page under /products is protected by this one guard, and the list
// and detail pages share the same local add/edit/delete changes.
export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return (
    <AuthGuard>
      <LocalOverridesProvider>
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </LocalOverridesProvider>
    </AuthGuard>
  );
}
