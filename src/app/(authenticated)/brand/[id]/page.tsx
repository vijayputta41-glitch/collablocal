import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Globe,
  Instagram,
  ExternalLink,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Star,
  Calendar,
  Users,
} from 'lucide-react';

export default async function BrandProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brandProfile.findUnique({
    where: { id },
    include: {
      user: true,
      campaigns: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: {
          applications: { select: { id: true } },
        },
      },
      deals: {
        where: { escrowStatus: 'released' },
        include: {
          reviews: { include: { reviewer: true } },
        },
        orderBy: { completedAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!brand) {
    notFound();
  }

  const allReviews = brand.deals.flatMap(d => d.reviews);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft size={16} />
        Back
      </Link>

      {/* Profile Header */}
      <div className="card overflow-hidden mb-6">
        <div className="h-3" style={{ background: 'linear-gradient(90deg, #0F3460, #1a4a8a)' }} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {brand.user?.image ? (
                <img src={brand.user.image} alt={brand.businessName} className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #0F3460, #1a4a8a)' }}
                >
                  {brand.businessName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{brand.businessName}</h1>
                {brand.verified && <BadgeCheck size={24} className="text-blue-500" />}
              </div>

              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <MapPin size={16} />
                <span>{brand.city}</span>
                <span className="text-gray-300">·</span>
                <span className="badge text-xs">{brand.category}</span>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold text-gray-900">{brand.avgRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({allReviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{brand.totalCampaigns} campaigns</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">₹{brand.totalSpent.toLocaleString('en-IN')} spent</span>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-3">
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ color: '#0F3460' }}
                  >
                    <Globe size={16} />
                    Website
                    <ExternalLink size={12} />
                  </a>
                )}
                {brand.instagramHandle && (
                  <a
                    href={`https://instagram.com/${brand.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ color: '#0F3460' }}
                  >
                    <Instagram size={16} />
                    @{brand.instagramHandle}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {brand.description && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">{brand.description}</p>
            </div>
          )}

          {/* Active Campaigns */}
          {brand.campaigns.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Active Campaigns</h2>
                <Link href="/campaigns" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#0F3460' }}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {brand.campaigns.map(campaign => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                    <div className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{campaign.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{campaign.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin size={12} /> {campaign.city}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Users size={12} /> {campaign.applications.length} applied
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-extrabold" style={{ color: '#E94560' }}>
                            ₹{campaign.budgetPerCreator.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-500">per creator</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {allReviews.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Creator Reviews</h2>
              <div className="space-y-4">
                {allReviews.slice(0, 5).map(review => (
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
          {/* Stats */}
          <div className="card p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Campaigns</span>
                <span className="text-lg font-bold text-gray-900">{brand.totalCampaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Spent</span>
                <span className="text-lg font-bold text-gray-900">₹{brand.totalSpent.toLocaleString('en-IN')}</span>
              </div>
              {brand.totalCampaigns > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Avg per Campaign</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{Math.round(brand.totalSpent / brand.totalCampaigns).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {brand.gstNumber && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">GST Registered</span>
                  <BadgeCheck size={18} className="text-green-500" />
                </div>
              )}
            </div>
          </div>

          {/* Verified Badge */}
          {brand.verified && (
            <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
              <BadgeCheck size={22} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-900">Verified Brand</p>
                <p className="text-xs text-green-700">Identity verified on CollabLocal</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
