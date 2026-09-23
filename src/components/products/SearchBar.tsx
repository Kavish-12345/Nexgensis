"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const SEARCH_DEBOUNCE_MS = 400;

interface SearchBarProps {
  q: string; // the search currently in the URL
  onSearch: (q: string) => void;
}

export function SearchBar({ q, onSearch }: SearchBarProps) {
  // The input keeps its own text so typing is instant. The URL is only
  // updated once the user pauses (debounce).
  const [value, setValue] = useState(q);
  const debounced = useDebounce(value, SEARCH_DEBOUNCE_MS);

  // If the URL's q changes from outside (e.g. a "Clear search" button), copy
  // it into the input. We skip changes that are just our own debounced
  // value echoing back, otherwise we'd wipe letters typed since then.
  // (Adjusting state during render is React's recommended pattern for this.)
  const [syncedQ, setSyncedQ] = useState(q);
  if (q !== syncedQ) {
    setSyncedQ(q);
    if (q !== debounced.trim()) setValue(q);
  }

  // useEffectEvent always sees the latest q/onSearch without making the
  // effect below re-run when they change, so it only fires on a new
  // debounced value.
  const submit = useEffectEvent((text: string) => {
    const next = text.trim();
    if (next !== q) onSearch(next);
  });

  useEffect(() => {
    submit(debounced);
  }, [debounced]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search products…"
      aria-label="Search products"
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 sm:w-72 focus:border-blue-500 focus:outline-none"
    />
  );
}
