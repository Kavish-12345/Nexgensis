import Link from "next/link";

export function LoadingView({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

interface EmptyViewProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyView({ message, actionLabel, onAction }: EmptyViewProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-gray-300 py-16 text-center">
      <p className="text-gray-600">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-sm font-medium text-blue-600 hover:underline">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function NotFoundView({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-gray-600">{message}</p>
      <Link href="/products" className="text-sm font-medium text-blue-600 hover:underline">
        Back to products
      </Link>
    </div>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 py-16 text-center">
      <p className="text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}
