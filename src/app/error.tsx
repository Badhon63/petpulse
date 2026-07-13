"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 grow flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm text-center w-full">
        <div className="text-4xl mb-3">🐾</div>
        <h1 className="text-xl font-bold text-gray-950 tracking-tight">
          Something went wrong
        </h1>
        <p className="text-gray-400 text-xs mt-2 mb-6">
          We&apos;re having trouble loading this page. Please try again or head
          back home.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition font-bold text-sm cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-gray-50 text-gray-600 px-5 py-2 rounded-xl hover:bg-gray-100 shadow-sm transition font-bold text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
