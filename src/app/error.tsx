"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#E94560" }}
          >
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3" style={{ color: "#1A1A2E" }}>
          Oops!
        </h1>
        <p className="text-xl font-semibold mb-2" style={{ color: "#1A1A2E" }}>
          Something Went Wrong
        </p>
        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Please try again or contact support if the
          problem persists.
        </p>

        {error.digest && (
          <div className="bg-gray-100 rounded-lg p-4 mb-8 text-left">
            <p className="text-xs text-gray-600 break-all font-mono">
              Error ID: {error.digest}
            </p>
          </div>
        )}

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105 w-full justify-center"
          style={{ backgroundColor: "#E94560" }}
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>

        <div className="mt-8 pt-8 border-t border-gray-300">
          <a
            href="/"
            className="text-sm font-medium transition-colors hover:underline block"
            style={{ color: "#0F3460" }}
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
