"use client";

import { useRef, useState } from "react";
import { ApiError } from "@/lib/axios";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, onCancel, ...rest }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <ConfirmBody onCancel={onCancel} {...rest} />
    </Modal>
  );
}

// Separate component so its state resets each time the dialog opens
// (Modal only mounts children while open).
function ConfirmBody({ message, confirmLabel, onConfirm, onCancel }: Omit<ConfirmDialogProps, "open" | "title">) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);

  async function handleConfirm() {
    if (busyRef.current) return; // ignore rapid repeat clicks
    busyRef.current = true;
    setIsBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      busyRef.current = false;
      setIsBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{message}</p>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isBusy}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isBusy ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </div>
  );
}
