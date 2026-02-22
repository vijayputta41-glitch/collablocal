import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#E94560" }}
          >
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3" style={{ color: "#1A1A2E" }}>
          404
        </h1>
        <p className="text-xl font-semibold mb-2" style={{ color: "#1A1A2E" }}>
          Page Not Found
        </p>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been
          moved or deleted.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
          style={{ backgroundColor: "#E94560" }}
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500 mb-4">Need help?</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/campaigns"
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: "#0F3460" }}
            >
              Browse Campaigns
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: "#0F3460" }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
