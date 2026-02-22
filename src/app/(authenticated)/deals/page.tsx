"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Handshake,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

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
  };
  creator: {
    id: string;
    displayName: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.1)", icon: AlertCircle },
  escrow_held: { label: "Escrow Held", color: "#0F3460", bgColor: "rgba(15, 52, 96, 0.1)", icon: Clock },
  content_submitted: { label: "Content Submitted", color: "#0F3460", bgColor: "rgba(15, 52, 96, 0.1)", icon: Clock },
  revision_requested: { label: "Revision Requested", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.1)", icon: AlertCircle },
  approved: { label: "Approved", color: "#10B981", bgColor: "rgba(16, 185, 129, 0.1)", icon: CheckCircle },
  released: { label: "Completed", color: "#10B981", bgColor: "rgba(16, 185, 129, 0.1)", icon: CheckCircle },
  refunded: { label: "Refunded", color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.1)", icon: AlertCircle },
  disputed: { label: "Disputed", color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.1)", icon: AlertCircle },
};

const PIPELINE_STEPS = ["pending", "escrow_held", "content_submitted", "approved", "released"];

function DealPipeline({ currentStatus }: { currentStatus: string }) {
  const currentIdx = PIPELINE_STEPS.indexOf(currentStatus);
  const labels = ["Pending", "Escrow", "Content", "Approved", "Released"];

  return (
    <div className="flex items-center gap-1 w-full">
      {PIPELINE_STEPS.map((step, i) => {
        const isCompleted = i <= currentIdx;
        const isCurrent = step === currentStatus;
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div
              className="h-1.5 w-full rounded-full transition-all"
              style={isCompleted ? { background: isCurrent ? 'var(--color-coral)' : 'var(--color-success)' } : { backgroundColor: 'var(--color-border-light)' }}
            />
            <span
              className="text-[10px] mt-1.5"
              style={{ fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}
            >
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function DealsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetchDeals();
  }, [session, statusFilter, roleFilter, router]);

  async function fetchDeals() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (roleFilter) params.append("role", roleFilter);
      const response = await fetch(`/api/deals?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch deals");
      const data = await response.json();
      setDeals(data.deals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const hasActiveFilters = statusFilter || roleFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="badge-coral text-xs font-semibold uppercase tracking-wider inline-flex">
            <Handshake size={12} />
            Deals
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-gray-900">My Deals</h1>
        <p className="text-gray-500 mt-2 text-base">Manage and track your collaborations and payments</p>
      </div>

      {/* Filters */}
      <div className="card p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-secondary)' }}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-secondary)' }}>Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Deals</option>
              <option value="creator">As Creator</option>
              <option value="brand">As Brand</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setStatusFilter(''); setRoleFilter(''); }}
              className={`btn-ghost text-sm w-full justify-center transition-all ${hasActiveFilters ? 'opacity-100' : 'opacity-40'}`}
              disabled={!hasActiveFilters}
            >
              <X size={14} />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: 'var(--color-error-light)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-error" />
          <p className="text-sm text-error font-medium">{error}</p>
        </div>
      )}

      {/* Deals Grid */}
      {deals.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No Deals Yet"
          description={statusFilter || roleFilter ? "No deals match your filters" : "Start collaborating to create your first deal"}
          actionLabel={!statusFilter && !roleFilter ? "Browse Campaigns" : undefined}
          actionHref={!statusFilter && !roleFilter ? "/campaigns" : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {deals.map((deal, index) => {
            const config = STATUS_CONFIG[deal.escrowStatus] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            const otherParty: any = deal.brandId === session?.user?.id ? deal.creator : deal.brand;

            return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="card-interactive p-6 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 truncate">{deal.campaign.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>with {otherParty.businessName || otherParty.displayName}</p>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-3"
                      style={{ backgroundColor: config.bgColor, color: config.color }}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </div>
                  </div>

                  {/* Pipeline */}
                  <div className="mb-5">
                    <DealPipeline currentStatus={deal.escrowStatus} />
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-extrabold text-gray-900">
                      ₹{deal.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Status alerts */}
                  {deal.revisionRequested && (
                    <p className="text-xs font-medium px-3 py-2 rounded-lg mb-3" style={{ backgroundColor: 'var(--color-warning-light)', color: '#92400e' }}>
                      Revision requested by brand
                    </p>
                  )}
                  {deal.brandApproved && (
                    <p className="text-xs font-medium px-3 py-2 rounded-lg mb-3" style={{ backgroundColor: 'var(--color-success-light)', color: '#065f46' }}>
                      Content approved by brand
                    </p>
                  )}

                  {/* Footer */}
                  <div className="pt-3 border-t flex justify-between items-center text-xs" style={{ borderColor: 'var(--color-border-light)', color: 'var(--color-text-tertiary)' }}>
                    <span>Created {new Date(deal.createdAt).toLocaleDateString('en-IN')}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
