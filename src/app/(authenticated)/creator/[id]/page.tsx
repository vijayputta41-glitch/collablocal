import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Instagram,
  ExternalLink,
  TrendingUp,
  ArrowLeft,
  BadgeCheck,
  Users,
  Award,
  Star,
  Briefcase,
} from 'lucide-react';

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = await prisma.creatorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      deals: {
        where: { escrowStatus: 'released' },
        include: {
          reviews: { include: { reviewer: true } },
          campaign: true,
          brand: true,
        },
        orderBy: { completedAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!creator) {
    notFound();
  }

  const allReviews = creator.deals.flatMap(d => d.reviews);
  const recentCampaigns = creator.deals.map(d => ({
    id: d.campaign.id,
    title: d.campaign.title,
    brand: d.brand.businessName,
    amount: d.amount,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/creators" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft size={16} />
        Back to Creators
      </Link>

      {/* Profile Header */}
      <div className="card overflow-hidden mb-6">
        <div className="h-3" style={{ background: 'linear-gradient(90deg, #E94560, #0F3460)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {creator.user?.image ? (
                <img src={creator.user.image} alt={creator.displayName} className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #E94560, #0F3460)' }}
                >
                  {creator.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{creator.displayName}</h1>
                {creator.verified && <BadgeCheck size={24} className="text-blue-500" />}
              </div>

              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin size={16} />
                <span>{creator.city}</span>
                <span className="text-gray-300">·</span>
                <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(233, 69, 96, 0.1)', color: '#E94560' }}>
                  {creator.level} Creator
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold text-gray-900">{creator.avgRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({allReviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{creator.totalDeals} deals</span>
                </div>
                {creator.followerCount && (
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {creator.followerCount >= 1000
                        ? `${(creator.followerCount / 1000).toFixed(1)}K`
                        : creator.followerCount} followers
                    </span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {creator.instagramHandle && (
                <a
                  href={`https://instagram.com/${creator.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold mt-4 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: '#E94560' }}
                >
                  <Instagram size={16} />
                  @{creator.instagramHandle}
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Rate CTA */}
            <div className="sm:text-right flex-shrink-0">
              <div className="bg-gray-50 rounded-xl p-4 inline-block text-right">
                <p className="text-xs text-gray-500 mb-1">Rate Range</p>
                <p className="text-xl font-extrabold" style={{ color: '#E94560' }}>
                  ₹{creator.rateMin.toLocaleString('en-IN')} - ₹{creator.rateMax.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{creator.bio || 'No bio provided yet.'}</p>
          </div>

          {/* Niches */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Niches</h2>
            <div className="flex flex-wrap gap-2">
              {creator.niches.map((niche: string) => (
                <span key={niche} className="badge-coral">{niche}</span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          {creator.portfolioUrls && creator.portfolioUrls.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h2>
              <div className="space-y-2">
                {creator.portfolioUrls.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Recent Work */}
          {recentCampaigns.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Campaigns</h2>
              <div className="space-y-3">
                {recentCampaigns.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">with {c.brand}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">₹{c.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {allReviews.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-4">
                {allReviews.map(review => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.reviewer.name}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={14} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    {review.comment && <p className="text-sm text-gray-600 mt-2">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <div className="card p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Performance</h3>
            <div className="space-y-4">
              {creator.followerCount && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Followers</span>
                  <span className="text-lg font-bold text-gray-900">{creator.followerCount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {creator.engagementRate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Engagement Rate</span>
                  <span className="text-lg font-bold text-gray-900">{(creator.engagementRate * 100).toFixed(1)}%</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Earnings</span>
                <span className="text-lg font-bold text-gray-900">₹{creator.totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Level</span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: '#E94560' }} />
                  <span className="text-sm font-semibold text-gray-900 capitalize">{creator.level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Badge */}
          {creator.verified && (
            <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
              <BadgeCheck size={22} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-900">Verified Creator</p>
                <p className="text-xs text-green-700">Identity verified on CollabLocal</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
