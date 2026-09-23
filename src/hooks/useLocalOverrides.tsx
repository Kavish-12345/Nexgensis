"use client";

import { createContext, useContext, useState } from "react";
import { EMPTY_OVERRIDES, isLocalId, type Overrides } from "@/lib/overrides";
import type { Product, ProductInput } from "@/types/product";

interface OverridesContextValue {
  overrides: Overrides;
  addLocal: (input: ProductInput) => void;
  editLocal: (id: number, input: ProductInput) => void;
  deleteLocal: (id: number) => void;
}

const OverridesContext = createContext<OverridesContextValue | null>(null);

// Lives in the /products layout, so the list and detail pages share the
// same changes. It's in memory only, so a page refresh resets everything.
export function LocalOverridesProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>(EMPTY_OVERRIDES);

  function addLocal(input: ProductInput) {
    setOverrides((prev) => {
      const product: Product = {
        ...input,
        id: prev.nextLocalId,
        discountPercentage: 0,
        images: [input.thumbnail],
        reviews: [],
      };
      return { ...prev, added: [product, ...prev.added], nextLocalId: prev.nextLocalId + 1 };
    });
  }

  function editLocal(id: number, input: ProductInput) {
    setOverrides((prev) =>
      isLocalId(id)
        ? { ...prev, added: prev.added.map((p) => (p.id === id ? { ...p, ...input } : p)) }
        : { ...prev, edited: { ...prev.edited, [id]: { ...prev.edited[id], ...input } } },
    );
  }

  function deleteLocal(id: number) {
    setOverrides((prev) =>
      isLocalId(id)
        ? { ...prev, added: prev.added.filter((p) => p.id !== id) }
        : { ...prev, deletedIds: [...prev.deletedIds, id] },
    );
  }

  return (
    <OverridesContext.Provider value={{ overrides, addLocal, editLocal, deleteLocal }}>
      {children}
    </OverridesContext.Provider>
  );
}

export function useLocalOverrides(): OverridesContextValue {
  const context = useContext(OverridesContext);
  if (!context) throw new Error("useLocalOverrides must be used inside LocalOverridesProvider");
  return context;
}
