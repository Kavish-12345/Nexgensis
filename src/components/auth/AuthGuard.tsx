"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/hooks/useAuthToken";
import { LoadingView } from "@/components/ui/StateViews";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthToken();
  const router = useRouter();

  useEffect(() => {
    if (token !== null) return;
    // Remember where the user was going (including filters) so a shared
    // link still works after they log in.
    const next = window.location.pathname + window.location.search;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [token, router]);

  // Until we know there is a token, render nothing protected. This avoids a
  // flash of the product page for logged-out users.
  if (!token) return <LoadingView label="Checking your session…" />;
  return children;
}
