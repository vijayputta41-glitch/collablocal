import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  Calendar,
  MapPin,
  CheckCircle,
  Building2,
  Users,
  Zap,
  ExternalLink,
  ArrowLeft,
  Instagram,
  Globe,
  Clock,
  BadgeCheck,
} from 'lucide-react';

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      brand: {
        include: {
          user: true,
        },
      },
      applications: {
        select: {
          id: true,
          status: true,
          creatorId: true,
        },
      },
    },
  });

  if (!campaign) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isCreator = session?.user?.role === 'creator';
  const isBrand = session?.user?.role === 'brand';
  const isOwner = isBrand && session?.user?.id === campaign.brand.userId;
  const slotsFilled = campaign.applications.filter(a => a.status === 'accepted').length;
  const totalApplications = campaign.applications.length;
  const slotsRemaining = campaign.maxCreators - slotsFilled;
  const isClosed = slotsRemaining <= 0 || campaign.status !== 'active';
  const isDeadlinePassed = new Date(campaign.deadline) < new Date();

  // Check if user has already applied
  let hasApplied = false;
  if (session?.user?.id && isCreator) {
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (creator) {
      const existingApplication = await prisma.application.findUnique({
        where: {
          campaignId_creatorId: {
            campaignId: campaign.id,
            creatorId: creator.id,
          },
        },
      });
      hasApplied = !!existingApplication;
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to Campaigns
      </Link>

      {/* Hero Section */}
      <div className="card overflow-hidden mb-6">
        <div
          className="h-3"
          style={{ background: 'linear-gradient(90deg, #E94560, #0F3460)' }}
        />
        <div className="p-6 sm:p-8">
          {/* Status + Date Row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {campaign.status === 'active' && !isDeadlinePassed ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
            ) : isDeadlinePassed ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                <Clock size={12} />
                Deadline Passed
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                {campaign.status === 'paused' ? 'Paused' : 'Completed'}
              </span>
            )}
            <span className="badge-coral text-xs">{campaign.contentType}</span>
            {!isDeadlinePassed && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {daysLeft} days left
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{campaign.title}</h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-3xl">{campaign.description}</p>

          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Budget / Creator</p>
              <p className="text-2xl font-extrabold text-gray-900">₹{campaign.budgetPerCreator.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin size={12} /> Location
              </p>
              <p className="text-lg font-bold text-gray-900">{campaign.city}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={12} /> Deadline
              </p>
              <p className="text-lg font-bold text-gray-900">{formatDate(campaign.deadline)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users size={12} /> Slots Available
              </p>
              <p className="text-lg font-bold text-gray-900">{slotsRemaining} of {campaign.maxCreators}</p>
            </div>
          </div>

          {/* Niches */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Niches</p>
            <div className="flex flex-wrap gap-2">
              {campaign.niches.map((niche: string) => (
                <span key={niche} className="badge text-sm">{niche}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications Progress */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={20} style={{ color: '#E94560' }} />
              Application Progress
            </h2>
            <div className="flex items-end gap-4 mb-4">
              <div>
                <p className="text-4xl font-extrabold text-gray-900">{totalApplications}</p>
                <p className="text-sm text-gray-500">total applications</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold" style={{ color: '#E94560' }}>{slotsFilled}</p>
                <p className="text-sm text-gray-500">accepted</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (slotsFilled / campaign.maxCreators) * 100)}%`,
                  background: 'linear-gradient(90deg, #E94560, #0F3460)',
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((slotsFilled / campaign.maxCreators) * 100)}% slots filled
            </p>
          </div>

          {/* CTA Section */}
          {isCreator && (
            <div className="card p-6">
              {!isClosed && !isDeadlinePassed ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {hasApplied ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={20} />
                        <span className="font-semibold">You have applied to this campaign</span>
                      </div>
                      <Link href="/applications" className="btn-ghost text-sm ml-auto">
                        View Application Status
                        <ArrowLeft size={14} className="rotate-180" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">Interested in this campaign?</h3>
                        <p className="text-sm text-gray-500">Submit your pitch and stand out to the brand</p>
                      </div>
                      <Link href={`/campaigns/${campaign.id}/apply`} className="btn-primary px-8">
                        Apply Now
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 font-medium">
                    {isDeadlinePassed ? 'The deadline for this campaign has passed' : 'All slots have been filled'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Brand's own campaign management */}
          {isOwner && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Manage Campaign</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/applications" className="btn-primary text-sm">
                  <Users size={16} />
                  Review Applications ({totalApplications})
                </Link>
                <Link href="/deals" className="btn-ghost text-sm">
                  View Deals
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Brand Card */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 size={16} />
              About the Brand
            </h2>

            {/* Brand Avatar + Name */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #0F3460, #1a4a8a)' }}
              >
                {campaign.brand.businessName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                  {campaign.brand.businessName}
                  {campaign.brand.verified && (
                    <BadgeCheck size={16} className="text-blue-500" />
                  )}
                </h3>
                <p className="text-xs text-gray-500">{campaign.brand.category}</p>
              </div>
            </div>

            {/* Brand Stats */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Campaigns</span>
                <span className="text-sm font-bold text-gray-900">{campaign.brand.totalCampaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Spent</span>
                <span className="text-sm font-bold text-gray-900">₹{campaign.brand.totalSpent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Rating</span>
                <span className="text-sm font-bold text-gray-900">{campaign.brand.avgRating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              {campaign.brand.website && (
                <a
                  href={campaign.brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50"
                >
                  <Globe size={16} />
                  Website
                  <ExternalLink size={12} className="ml-auto text-gray-400" />
                </a>
              )}
              {campaign.brand.instagramHandle && (
                <a
                  href={`https://instagram.com/${campaign.brand.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50"
                >
                  <Instagram size={16} />
                  @{campaign.brand.instagramHandle}
                  <ExternalLink size={12} className="ml-auto text-gray-400" />
                </a>
              )}
              <Link
                href={`/brand/${campaign.brand.id}`}
                className="flex items-center gap-2 text-sm font-semibold p-2 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: '#E94560' }}
              >
                View Full Profile
                <ArrowLeft size={14} className="ml-auto rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
