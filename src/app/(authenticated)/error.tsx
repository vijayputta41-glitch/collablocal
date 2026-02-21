"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function AuthenticatedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Authenticated Route Error]", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <AlertTriangle className="w-8 h-8" style={{ color: "#D97706" }} />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1A2E" }}>
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          An error occurred while loading this page. This might be a temporary
          issue — try refreshing.
        </p>

        {error.digest && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 font-mono break-all">
              Error ID: {error.digest}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#E94560" }}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
