"use client";

import { useEffect } from "react";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Shop page error:", error);
  }, [error]);

  return (
    <div className="bg-[#f8f4f1] min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-accent text-2xl text-[#2e2032]">
          We couldn't load the shop
        </p>
        <p className="mt-2 text-sm text-[#5b4d5f]">
          Something went wrong retrieving products. Try again, or head back to the homepage.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-[#2e2032] px-5 py-2.5 text-sm font-medium text-[#f8f4f1] transition-colors hover:bg-[#221826]"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-[#d8c7ce] px-5 py-2.5 text-sm font-medium text-[#2e2032] transition-colors hover:bg-[#f3ece8]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
