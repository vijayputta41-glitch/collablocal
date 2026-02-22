'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CITIES, NICHES } from '@/lib/constants';
import { Calendar, MapPin, ArrowRight, Zap, X } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonGrid } from '@/components/ui/skeleton';

interface Campaign {
  id: string;
  title: string;
  description: string;
  city: string;
  niches: string[];
  contentType: string;
  budgetPerCreator: number;
  maxCreators: number;
  deadline: string;
  brand: {
    id: string;
    businessName: string;
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [nicheFilter, setNicheFilter] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        let url = '/api/campaigns';
        const params = [];
        if (cityFilter) params.push(`city=${cityFilter}`);
        if (nicheFilter) params.push(`niche=${nicheFilter}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await fetch(url);
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, [cityFilter, nicheFilter]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const hasActiveFilters = cityFilter || nicheFilter;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="badge-coral text-xs font-semibold uppercase tracking-wider inline-flex">
            <Zap size={12} />
            Campaigns
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-gray-900">Browse Campaigns</h1>
        <p className="text-gray-500 mt-2 text-base">Discover collaboration opportunities with local brands</p>
      </div>

      {/* Filters */}
      <div className="card p-5 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-secondary)' }}>City</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="input-field">
              <option value="">All Cities</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-secondary)' }}>Niche</label>
            <select value={nicheFilter} onChange={(e) => setNicheFilter(e.target.value)} className="input-field">
              <option value="">All Niches</option>
              {NICHES.map(niche => <option key={niche} value={niche}>{niche}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setCityFilter(''); setNicheFilter(''); }}
              className={`btn-ghost text-sm w-full justify-center transition-all ${hasActiveFilters ? 'opacity-100' : 'opacity-40'}`}
              disabled={!hasActiveFilters}
            >
              <X size={14} />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns found"
          description="Try adjusting your filters or check back later"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="card-interactive overflow-hidden h-full flex flex-col animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient header strip */}
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--color-coral), var(--color-blue))' }} />
              <div className="p-6 flex flex-col flex-1">
                {/* Title + Brand */}
                <div className="mb-3">
                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{campaign.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{campaign.brand.businessName}</p>
                </div>

                <p className="text-sm mb-4 line-clamp-2 flex-1" style={{ color: 'var(--color-text-secondary)' }}>{campaign.description}</p>

                {/* Location & Niches */}
                <div className="mb-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <MapPin size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                    {campaign.city}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.niches.slice(0, 2).map(niche => (
                      <span key={niche} className="badge-coral text-xs">{niche}</span>
                    ))}
                    {campaign.niches.length > 2 && (
                      <span className="badge text-xs">+{campaign.niches.length - 2}</span>
                    )}
                  </div>
                </div>

                {/* Budget & Deadline */}
                <div className="rounded-xl p-4 mb-4 space-y-2" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Budget</span>
                    <span className="text-lg font-extrabold text-gray-900">₹{campaign.budgetPerCreator.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    <Calendar size={12} />
                    <span>Deadline: {formatDate(campaign.deadline)}</span>
                  </div>
                </div>

                {/* Content Type */}
                <div className="flex justify-between items-center mb-4 text-xs">
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Content Type</span>
                  <span className="font-semibold text-gray-700">{campaign.contentType}</span>
                </div>

                {/* CTA */}
                <Link href={`/campaigns/${campaign.id}`} className="btn-primary w-full text-sm group">
                  <span>View Details</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
