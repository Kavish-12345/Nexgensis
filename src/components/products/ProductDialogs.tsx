"use client";

import { useProductMutations } from "@/hooks/useProductMutations";
import type { Category, Product } from "@/types/product";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "./ProductForm";

export type ProductDialogState =
  | { mode: "create" }
  | { mode: "edit"; product: Product }
  | { mode: "delete"; product: Product }
  | null;

interface ProductDialogsProps {
  dialog: ProductDialogState;
  categories: Category[];
  onClose: () => void;
}

export function ProductDialogs({ dialog, categories, onClose }: ProductDialogsProps) {
  const { save, remove } = useProductMutations();
  const editing = dialog?.mode === "edit" ? dialog.product : undefined;
  const deleting = dialog?.mode === "delete" ? dialog.product : undefined;

  return (
    <>
      <Modal
        open={dialog?.mode === "create" || dialog?.mode === "edit"}
        title={editing ? "Edit product" : "Add product"}
        onClose={onClose}
      >
        <ProductForm
          product={editing}
          categories={categories}
          onSubmit={async (input) => {
            await save(input, editing);
            onClose();
          }}
          onCancel={onClose}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== undefined}
        title="Delete product?"
        message={`"${deleting?.title}" will be removed from the list.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleting) await remove(deleting);
          onClose();
        }}
        onCancel={onClose}
      />
    </>
  );
}
