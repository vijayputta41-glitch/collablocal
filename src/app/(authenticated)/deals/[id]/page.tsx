"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Star,
  Send,
  ArrowLeft,
  Upload,
  ShieldCheck,
  BadgeCheck,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";

interface Deal {
  id: string;
  brandId: string;
  creatorId: string;
  amount: number;
  platformFee: number;
  escrowStatus: string;
  contentUrl?: string;
  revisionRequested: boolean;
  brandApproved: boolean;
  createdAt: string;
  completedAt?: string;
  campaign: {
    id: string;
    title: string;
    brandId: string;
  };
  brand: {
    id: string;
    businessName: string;
    description?: string;
    totalCampaigns: number;
    totalSpent: number;
    avgRating: number;
    user?: { image?: string };
  };
  creator: {
    id: string;
    displayName: string;
    bio?: string;
    followerCount: number;
    totalDeals: number;
    totalEarnings: number;
    avgRating: number;
    user?: { image?: string };
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
}

const PIPELINE_STEPS = [
  { key: "pending", label: "Deal Created", icon: Clock },
  { key: "escrow_held", label: "Escrow Funded", icon: ShieldCheck },
  { key: "content_submitted", label: "Content Submitted", icon: FileText },
  { key: "approved", label: "Approved", icon: CheckCircle },
  { key: "released", label: "Payment Released", icon: DollarSign },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  escrow_held: { label: "Escrow Funded", color: "#0F3460", bg: "rgba(15, 52, 96, 0.1)" },
  content_submitted: { label: "Content Submitted", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
  revision_requested: { label: "Revision Requested", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  approved: { label: "Approved", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
  released: { label: "Completed", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
  refunded: { label: "Refunded", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
  disputed: { label: "Disputed", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
};

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!session) { router.push("/login"); return; }
    fetchDeal();
  }, [session, router]);

  async function fetchDeal() {
    try {
      setLoading(true);
      const res = await fetch(`/api/deals/${id}`);
      if (!res.ok) throw new Error("Failed to fetch deal");
      const data = await res.json();
      setDeal(data.deal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(newStatus: string, url?: string) {
    try {
      setActionLoading(true);
      setError(null);
      const res = await fetch(`/api/deals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, contentUrl: url }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update deal");
      }
      const data = await res.json();
      setDeal(data.deal);
      setContentUrl("");
      showToast("Deal updated successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSubmitReview() {
    try {
      setReviewLoading(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: id, rating: reviewForm.rating, comment: reviewForm.comment || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit review");
      }
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
      showToast("Review submitted!", "success");
      fetchDeal();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setReviewLoading(false);
    }
  }

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="skeleton h-6 w-32 mb-8" style={{ height: "24px" }} />
        <div className="skeleton h-10 w-96 mb-4" style={{ height: "40px" }} />
        <div className="skeleton h-4 w-64 mb-8" style={{ height: "16px" }} />
        <div className="skeleton h-20 w-full rounded-2xl mb-6" style={{ height: "80px" }} />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-48 rounded-2xl" style={{ height: "192px" }} />
            <div className="skeleton h-48 rounded-2xl" style={{ height: "192px" }} />
          </div>
          <div className="skeleton h-72 rounded-2xl" style={{ height: "288px" }} />
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Not Found</h1>
        <Link href="/deals" className="text-sm font-semibold" style={{ color: "#E94560" }}>
          Back to Deals
        </Link>
      </div>
    );
  }

  const isBrand = deal.brandId === session?.user?.id;
  const isCreator = deal.creatorId === session?.user?.id;
  const config = STATUS_CONFIG[deal.escrowStatus] || STATUS_CONFIG.pending;

  // Pipeline position
  const pipelineStatus = deal.escrowStatus === "revision_requested" ? "content_submitted" : deal.escrowStatus;
  const currentIdx = PIPELINE_STEPS.findIndex(s => s.key === pipelineStatus);
  const creatorPayout = deal.amount - deal.platformFee;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
          toast.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Back */}
      <Link href="/deals" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to Deals
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{deal.campaign.title}</h1>
          <p className="text-gray-500 mt-1">
            Deal with {isBrand ? deal.creator.displayName : deal.brand.businessName}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          <CheckCircle size={16} />
          {config.label}
        </div>
      </div>

      {/* Pipeline */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-1">
          {PIPELINE_STEPS.map((step, i) => {
            const isCompleted = i <= currentIdx;
            const isCurrent = i === currentIdx;
            const StepIcon = step.icon;
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  <div
                    className={`h-2 flex-1 rounded-full transition-all ${i === 0 ? "rounded-l-full" : ""} ${i === PIPELINE_STEPS.length - 1 ? "rounded-r-full" : ""}`}
                    style={isCompleted ? {
                      background: isCurrent && deal.escrowStatus !== "released"
                        ? "#E94560"
                        : "#10B981",
                    } : { background: "#E5E7EB" }}
                  />
                </div>
                <div className={`mt-2 flex flex-col items-center ${isCurrent ? "opacity-100" : "opacity-50"}`}>
                  <StepIcon size={14} className={isCurrent ? "text-gray-900" : "text-gray-400"} />
                  <span className={`text-[10px] mt-0.5 text-center ${isCurrent ? "font-semibold text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {deal.escrowStatus === "revision_requested" && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium flex items-center gap-2">
            <RotateCcw size={14} />
            Brand has requested a revision on the submitted content
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-red-50 border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Details */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Financial Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Deal Amount</span>
                <span className="text-lg font-bold text-gray-900">₹{deal.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Platform Fee (12%)</span>
                <span className="text-sm font-semibold text-gray-600">-₹{deal.platformFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-semibold text-gray-900">{isCreator ? "Your Payout" : "Creator Receives"}</span>
                <span className="text-xl font-extrabold" style={{ color: "#E94560" }}>
                  ₹{creatorPayout.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {deal.contentUrl && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content URL</p>
                <a
                  href={deal.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  style={{ color: "#0F3460" }}
                >
                  {deal.contentUrl}
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>

            {/* Creator: Waiting for escrow */}
            {isCreator && deal.escrowStatus === "pending" && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Waiting for Payment</p>
                    <p className="text-xs text-blue-700 mt-0.5">The brand needs to fund the escrow before you can start working</p>
                  </div>
                </div>
              </div>
            )}

            {/* Creator: Submit content */}
            {isCreator && (deal.escrowStatus === "escrow_held" || deal.escrowStatus === "revision_requested") && (
              <div className="space-y-3">
                {deal.escrowStatus === "revision_requested" && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-700 flex items-center gap-2 mb-2">
                    <RotateCcw size={16} />
                    The brand requested changes. Please update and resubmit your content.
                  </div>
                )}
                <label className="block text-sm font-semibold text-gray-700">
                  {deal.escrowStatus === "revision_requested" ? "Updated Content URL" : "Content URL"}
                </label>
                <input
                  type="url"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or Instagram post URL"
                  className="input-field"
                />
                <button
                  onClick={() => handleStatusUpdate("content_submitted", contentUrl)}
                  disabled={!contentUrl || actionLoading}
                  className="btn-primary w-full"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {deal.escrowStatus === "revision_requested" ? "Resubmit Content" : "Submit Content"}
                </button>
              </div>
            )}

            {/* Brand: Fund escrow */}
            {isBrand && deal.escrowStatus === "pending" && (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Secure Escrow Payment</p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Your payment of ₹{deal.amount.toLocaleString("en-IN")} will be held securely until the content is approved
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleStatusUpdate("escrow_held")}
                  disabled={actionLoading}
                  className="btn-primary w-full"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  Fund Escrow (₹{deal.amount.toLocaleString("en-IN")})
                </button>
              </div>
            )}

            {/* Brand: Review content */}
            {isBrand && deal.escrowStatus === "content_submitted" && (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-2">
                  <p className="text-sm font-semibold text-blue-900">Content Ready for Review</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    The creator has submitted their content. Review it and approve or request revisions.
                  </p>
                </div>
                <button
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#10B981" }}
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Approve Content
                </button>
                <button
                  onClick={() => handleStatusUpdate("revision_requested")}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 border-amber-300 text-amber-700 hover:bg-amber-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Request Revision
                </button>
              </div>
            )}

            {/* Brand: Release payment */}
            {isBrand && deal.escrowStatus === "approved" && (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Content Approved!</p>
                      <p className="text-xs text-green-700 mt-0.5">
                        Release the payment to complete this deal. The creator will receive ₹{creatorPayout.toLocaleString("en-IN")}.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleStatusUpdate("released")}
                  disabled={actionLoading}
                  className="btn-primary w-full"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
                  Release Payment
                </button>
              </div>
            )}

            {/* Completed state */}
            {deal.escrowStatus === "released" && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Deal Completed!</p>
                    <p className="text-xs text-green-700 mt-0.5">
                      Payment has been released. Don't forget to leave a review!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Creator waiting for brand to review */}
            {isCreator && deal.escrowStatus === "content_submitted" && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Content Under Review</p>
                    <p className="text-xs text-blue-700 mt-0.5">Waiting for the brand to review your submission</p>
                  </div>
                </div>
              </div>
            )}

            {isCreator && deal.escrowStatus === "approved" && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Content Approved!</p>
                    <p className="text-xs text-green-700 mt-0.5">Waiting for the brand to release payment</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          {deal.escrowStatus === "released" && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
                {!showReviewForm && !deal.reviews.some(r => r.reviewer.id === session?.user?.id) && (
                  <button onClick={() => setShowReviewForm(true)} className="btn-primary text-sm">
                    <Star size={16} />
                    Leave Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Comment (Optional)</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience working together..."
                      className="input-field resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="btn-primary flex-1 text-sm"
                    >
                      {reviewLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Submit Review
                    </button>
                    <button
                      onClick={() => { setShowReviewForm(false); setReviewForm({ rating: 5, comment: "" }); }}
                      className="btn-ghost flex-1 text-sm justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Reviews */}
              {deal.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deal.reviews.map(review => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar src={review.reviewer.image} alt={review.reviewer.name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{review.reviewer.name}</p>
                            <StarRating rating={review.rating} size={12} showValue={false} />
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Other Party Card */}
          <div className="card p-6 sticky top-24">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {isBrand ? "Creator" : "Brand"}
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={isBrand ? deal.creator.user?.image : deal.brand.user?.image}
                alt={isBrand ? deal.creator.displayName : deal.brand.businessName}
                size="lg"
              />
              <div>
                <h3 className="font-bold text-gray-900">
                  {isBrand ? deal.creator.displayName : deal.brand.businessName}
                </h3>
                <StarRating
                  rating={isBrand ? deal.creator.avgRating : deal.brand.avgRating}
                  size={12}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-4">
              {isBrand ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Followers</span>
                    <span className="font-semibold text-gray-900">
                      {deal.creator.followerCount ? `${(deal.creator.followerCount / 1000).toFixed(1)}K` : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Completed Deals</span>
                    <span className="font-semibold text-gray-900">{deal.creator.totalDeals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Earned</span>
                    <span className="font-semibold text-gray-900">₹{deal.creator.totalEarnings.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Campaigns</span>
                    <span className="font-semibold text-gray-900">{deal.brand.totalCampaigns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Spent</span>
                    <span className="font-semibold text-gray-900">₹{deal.brand.totalSpent.toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
            </div>

            <Link
              href={isBrand ? `/creator/${deal.creator.id}` : `/brand/${deal.brand.id}`}
              className="btn-ghost w-full text-sm justify-center"
            >
              View Full Profile
              <ExternalLink size={14} />
            </Link>
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Timeline</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="font-semibold text-gray-900">
                  {new Date(deal.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              {deal.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(deal.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
