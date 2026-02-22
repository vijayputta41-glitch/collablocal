'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Star,
  Award,
  Plus,
  User,
  ArrowRight,
  Zap,
  Handshake,
  Users,
  Inbox,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  role: string;
  stats: Record<string, number>;
  recentActivity: Array<{
    type: 'deal' | 'application';
    id: string;
    title: string;
    status: string;
    amount: number;
    date: string;
    otherParty: string;
  }>;
  profile: Record<string, any>;
}

const ACTIVITY_ICONS: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  pending: { icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  escrow_held: { icon: DollarSign, color: '#0F3460', bg: 'rgba(15, 52, 96, 0.1)' },
  content_submitted: { icon: FileText, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  revision_requested: { icon: AlertCircle, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  approved: { icon: CheckCircle, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  released: { icon: CheckCircle, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  accepted: { icon: CheckCircle, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  rejected: { icon: XCircle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  escrow_held: 'Escrow Funded',
  content_submitted: 'Content Submitted',
  revision_requested: 'Revision Requested',
  approved: 'Approved',
  released: 'Completed',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const isCreator = session?.user?.role === 'creator';
  const isBrand = session?.user?.role === 'brand';

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        console.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchDashboard();
  }, [session]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-10 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center gap-1.5 badge-premium text-xs">
            <Sparkles size={12} className="text-coral" />
            {isCreator ? 'Creator' : isBrand ? 'Brand' : 'User'} Dashboard
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-gray-900">
          {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-500 mt-2 text-base">
          {isCreator
            ? "Here's what's happening with your creator profile"
            : "Here's what's happening with your brand campaigns"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {loading ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card p-6">
                <Skeleton className="h-4 w-24 mb-4" style={{ height: '16px' }} />
                <Skeleton className="h-8 w-32 mb-2" style={{ height: '32px' }} />
                <Skeleton className="h-3 w-20" style={{ height: '12px' }} />
              </div>
            ))}
          </>
        ) : isCreator && data ? (
          <>
            <StatCard
              label="Total Deals"
              value={String(data.stats.totalDeals || 0)}
              subtext={`${data.stats.activeDeals || 0} active`}
              icon={Award}
            />
            <StatCard
              label="Total Earnings"
              value={formatCurrency(data.stats.totalEarnings || 0)}
              subtext={data.stats.pendingEarnings ? `${formatCurrency(data.stats.pendingEarnings)} pending` : 'No pending'}
              icon={DollarSign}
            />
            <StatCard
              label="Your Rating"
              value={(data.stats.avgRating || 0).toFixed(1)}
              subtext={`From ${data.stats.totalReviews || 0} deals`}
              icon={Star}
            />
            <StatCard
              label="Completed"
              value={String(data.stats.completedDeals || 0)}
              subtext={`${data.stats.followerCount ? `${(data.stats.followerCount / 1000).toFixed(1)}K followers` : 'Update your profile'}`}
              icon={CheckCircle}
            />
          </>
        ) : isBrand && data ? (
          <>
            <StatCard
              label="Active Campaigns"
              value={String(data.stats.activeCampaigns || 0)}
              subtext={`${data.stats.totalCampaigns || 0} total`}
              icon={TrendingUp}
              accentColor="#0F3460"
            />
            <StatCard
              label="Total Spent"
              value={formatCurrency(data.stats.totalSpent || 0)}
              subtext={`${data.stats.uniqueCreators || 0} creators`}
              icon={DollarSign}
              accentColor="#0F3460"
            />
            <StatCard
              label="Applications"
              value={String(data.stats.totalApplications || 0)}
              subtext={`${data.stats.pendingApplications || 0} pending review`}
              icon={Inbox}
              accentColor="#0F3460"
            />
            <StatCard
              label="Brand Rating"
              value={(data.stats.avgRating || 0).toFixed(1)}
              subtext={`${data.stats.activeDeals || 0} active deals`}
              icon={Star}
              accentColor="#0F3460"
            />
          </>
        ) : (
          <>
            <StatCard label="Get Started" value="0" subtext="Complete your profile" icon={Award} />
            <StatCard label="Earnings" value="₹0" subtext="Start collaborating" icon={DollarSign} />
            <StatCard label="Rating" value="0.0" subtext="No reviews yet" icon={Star} />
            <StatCard label="Completed" value="0" subtext="No deals yet" icon={CheckCircle} />
          </>
        )}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="heading-subtitle text-lg text-gray-900 mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {isCreator ? (
              <>
                <QuickAction href="/campaigns" icon={Zap} color="#E94560" title="Browse Campaigns" description="Find new collaboration opportunities" />
                <QuickAction href="/applications" icon={FileText} color="#E94560" title="My Applications" description="Track your campaign applications" />
                <QuickAction href="/deals" icon={Handshake} color="#E94560" title="My Deals" description="Manage active collaborations" />
                <QuickAction href="/profile" icon={User} color="#E94560" title="Update Profile" description="Keep your info fresh and accurate" />
              </>
            ) : (
              <>
                <QuickAction href="/campaigns/new" icon={Plus} color="#0F3460" title="Create Campaign" description="Launch a new collaboration" />
                <QuickAction href="/applications" icon={Inbox} color="#0F3460" title="Review Applications" description={data?.stats.pendingApplications ? `${data.stats.pendingApplications} pending` : 'View all applications'} />
                <QuickAction href="/creators" icon={Users} color="#0F3460" title="Find Creators" description="Browse talented local creators" />
                <QuickAction href="/deals" icon={Handshake} color="#0F3460" title="Manage Deals" description="Track payments and deliverables" />
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-gradient p-6 relative overflow-hidden">
          <h2 className="heading-subtitle text-lg text-gray-900 mb-5">Recent Activity</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="w-8 h-8 rounded-lg" style={{ width: '32px', height: '32px' }} />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-3/4 mb-2" style={{ height: '12px' }} />
                    <Skeleton className="h-3 w-1/2" style={{ height: '12px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="space-y-1">
              {data.recentActivity.map((activity) => {
                const config = ACTIVITY_ICONS[activity.status] || ACTIVITY_ICONS.pending;
                const Icon = config.icon;
                return (
                  <Link
                    key={`${activity.type}-${activity.id}`}
                    href={activity.type === 'deal' ? `/deals/${activity.id}` : '/applications'}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all group hover:bg-gray-50/80"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: config.bg }}
                    >
                      <Icon size={16} style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        {STATUS_LABELS[activity.status] || activity.status}
                        {activity.otherParty ? ` · ${activity.otherParty}` : ''}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">₹{activity.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(233, 69, 96, 0.06)' }}
              >
                <Clock size={24} style={{ color: 'var(--color-text-tertiary)' }} />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">No activity yet</p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {isCreator
                  ? 'Apply to campaigns to get started'
                  : 'Create a campaign to attract creators'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  color,
  title,
  description,
}: {
  href: string;
  icon: typeof Zap;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 p-3.5 rounded-xl border transition-all group hover:shadow-sm hover:-translate-y-0.5"
      style={{ borderColor: 'var(--color-border-light)' }}
    >
      <div
        className="p-2.5 rounded-xl transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}0a` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{description}</p>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-all group-hover:translate-x-0.5" />
    </Link>
  );
}
