"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// Uses the browser's native <dialog>, which handles focus, the backdrop and
// the Escape key for us.
export function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      // Escape: let the parent decide (it owns `open`) instead of the
      // browser closing the dialog on its own.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {/* Only mounted while open, so forms start fresh every time. */}
        {open && children}
      </div>
    </dialog>
  );
}
