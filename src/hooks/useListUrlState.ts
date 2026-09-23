import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { applyListPatch, parseListState, serializeListState, type ListState } from "@/lib/urlState";

// State is derived from the URL on every render instead of being copied
// into useState. There is only one copy, so the URL and the UI can never
// drift apart, and there is no URL <-> state sync loop to manage.
export function useListUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = parseListState(searchParams);

  function update(patch: Partial<ListState>) {
    const query = serializeListState(applyListPatch(state, patch));
    // replace, not push: typing a search shouldn't add ten history entries.
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return { state, update };
}
