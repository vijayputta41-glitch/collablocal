'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Loader2,
  Inbox,
  Filter,
  UserCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Instagram,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { EmptyState } from '@/components/ui/empty-state';

interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  pitchText: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  campaign: {
    id: string;
    title: string;
    city: string;
    budgetPerCreator: number;
    contentType: string;
    deadline: string;
    niches: string[];
    brand: {
      id: string;
      businessName: string;
    };
  };
  creator: {
    id: string;
    displayName: string;
    city: string;
    niches: string[];
    followerCount: number | null;
    engagementRate: number | null;
    avgRating: number;
    instagramHandle: string;
    rateMin: number;
    rateMax: number;
    bio: string | null;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.08)', icon: Clock },
  accepted: { label: 'Accepted', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.08)', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.08)', icon: XCircle },
};

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isBrand = session?.user?.role === 'brand';
  const isCreator = session?.user?.role === 'creator';

  useEffect(() => {
    fetchApplications();
  }, [session]);

  async function fetchApplications() {
    try {
      setLoading(true);
      const res = await fetch('/api/applications');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApplications(data);
    } catch {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(applicationId: string, status: 'accepted' | 'rejected') {
    setActionLoading(applicationId);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update');
      }

      const data = await res.json();

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      );

      setToast({
        message: status === 'accepted'
          ? `Application accepted! A deal has been created for ₹${data.deal?.amount?.toLocaleString('en-IN') || ''}`
          : 'Application rejected.',
        type: 'success',
      });

      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Action failed',
        type: 'error',
      });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = statusFilter
    ? applications.filter(a => a.status === statusFilter)
    : applications;

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="skeleton h-8 w-64 mb-2" style={{ height: '32px' }} />
          <div className="skeleton h-4 w-96" style={{ height: '16px' }} />
        </div>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-16 rounded-xl" style={{ height: '64px' }} />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-40 rounded-2xl" style={{ height: '160px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto page-enter">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="badge-premium text-xs font-semibold uppercase tracking-wider inline-flex">
            <Inbox size={12} />
            Applications
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-gray-900">
          {isBrand ? 'Applications' : 'My Applications'}
        </h1>
        <p className="text-gray-400 mt-2.5">
          {isBrand
            ? 'Review and manage creator applications for your campaigns'
            : 'Track the status of your campaign applications'}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {[
          { key: '', label: 'All', count: counts.all },
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'accepted', label: 'Accepted', count: counts.accepted },
          { key: 'rejected', label: 'Rejected', count: counts.rejected },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`tab-premium ${statusFilter === tab.key ? 'active' : ''}`}
          >
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                statusFilter === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={statusFilter ? 'No applications match this filter' : 'No Applications Yet'}
          description={
            isBrand
              ? 'When creators apply to your campaigns, they will appear here'
              : 'Browse campaigns and apply to start collaborating'
          }
          actionLabel={isBrand ? undefined : 'Browse Campaigns'}
          actionHref={isBrand ? undefined : '/campaigns'}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(application => {
            const config = STATUS_CONFIG[application.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedId === application.id;

            return (
              <div
                key={application.id}
                className="card overflow-hidden transition-all duration-200"
              >
                {/* Main Row */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : application.id)}
                >
                  <div className="flex items-start gap-4">
                    {isBrand ? (
                      <Avatar
                        src={application.creator.user?.image}
                        alt={application.creator.displayName}
                        size="lg"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #E94560, #0F3460)' }}
                      >
                        <Calendar size={24} className="text-white" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-extrabold text-gray-900 truncate">
                            {isBrand ? application.creator.displayName : application.campaign.title}
                          </h3>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {isBrand
                              ? `Applied to "${application.campaign.title}"`
                              : `by ${application.campaign.brand.businessName}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: config.bgColor, color: config.color }}
                          >
                            <StatusIcon size={14} />
                            {config.label}
                          </div>
                          {isExpanded ? <ChevronUp size={18} className="text-gray-300" /> : <ChevronDown size={18} className="text-gray-300" />}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-300" />
                          {isBrand ? application.creator.city : application.campaign.city}
                        </div>
                        {isBrand && application.creator.followerCount && (
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-gray-300" />
                            {application.creator.followerCount >= 1000
                              ? `${(application.creator.followerCount / 1000).toFixed(1)}K`
                              : application.creator.followerCount}
                          </div>
                        )}
                        {isBrand && application.creator.avgRating > 0 && (
                          <StarRating rating={application.creator.avgRating} size={12} />
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-300" />
                          {new Date(application.appliedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <span className="font-semibold text-gray-900">
                          ₹{application.campaign.budgetPerCreator.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t" style={{ borderColor: 'var(--color-border-light)', backgroundColor: 'var(--color-surface-secondary)' }}>
                    <div className="p-6 grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          {isBrand ? 'Creator\'s Pitch' : 'Your Pitch'}
                        </h4>
                        <div className="bg-white rounded-xl p-5 border" style={{ borderColor: 'var(--color-border-light)' }}>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {application.pitchText}
                          </p>
                        </div>

                        {isBrand && (
                          <div className="mt-4 grid sm:grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl p-4 border" style={{ borderColor: 'var(--color-border-light)' }}>
                              <p className="text-xs text-gray-400 mb-1">Niche</p>
                              <div className="flex flex-wrap gap-1.5">
                                {application.creator.niches.slice(0, 3).map(n => (
                                  <span key={n} className="badge text-xs">{n}</span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border" style={{ borderColor: 'var(--color-border-light)' }}>
                              <p className="text-xs text-gray-400 mb-1">Engagement</p>
                              <p className="text-lg font-bold text-gray-900">
                                {application.creator.engagementRate
                                  ? `${(application.creator.engagementRate * 100).toFixed(1)}%`
                                  : 'N/A'}
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border" style={{ borderColor: 'var(--color-border-light)' }}>
                              <p className="text-xs text-gray-400 mb-1">Rate Range</p>
                              <p className="text-lg font-bold" style={{ color: '#E94560' }}>
                                ₹{application.creator.rateMin.toLocaleString('en-IN')} - ₹{application.creator.rateMax.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {isBrand && application.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(application.id, 'accepted');
                              }}
                              disabled={actionLoading === application.id}
                              className="btn-primary w-full text-sm"
                            >
                              {actionLoading === application.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <UserCheck size={16} />
                              )}
                              Accept & Create Deal
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(application.id, 'rejected');
                              }}
                              disabled={actionLoading === application.id}
                              className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </>
                        )}

                        {isBrand && (
                          <Link
                            href={`/creator/${application.creator.id}`}
                            className="btn-ghost w-full text-sm justify-center"
                            onClick={e => e.stopPropagation()}
                          >
                            View Full Profile
                            <ExternalLink size={14} />
                          </Link>
                        )}

                        {isCreator && (
                          <Link
                            href={`/campaigns/${application.campaignId}`}
                            className="btn-primary w-full text-sm"
                            onClick={e => e.stopPropagation()}
                          >
                            View Campaign
                            <ArrowRight size={16} />
                          </Link>
                        )}

                        {isBrand && application.creator.instagramHandle && (
                          <a
                            href={`https://instagram.com/${application.creator.instagramHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            onClick={e => e.stopPropagation()}
                          >
                            <Instagram size={16} />
                            @{application.creator.instagramHandle}
                          </a>
                        )}

                        {application.status !== 'pending' && (
                          <div
                            className="rounded-xl p-4 text-sm"
                            style={{ backgroundColor: config.bgColor }}
                          >
                            <div className="flex items-center gap-2 mb-1" style={{ color: config.color }}>
                              <StatusIcon size={16} />
                              <span className="font-semibold">{config.label}</span>
                            </div>
                            <p className="text-gray-500 text-xs">
                              {application.status === 'accepted'
                                ? 'A deal has been created. Check your Deals page.'
                                : 'This application was declined.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
