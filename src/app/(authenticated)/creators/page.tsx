'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CITIES, NICHES } from '@/lib/constants';
import { MapPin, Search, X, Users } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonGrid } from '@/components/ui/skeleton';

interface Creator {
  id: string;
  userId: string;
  displayName: string;
  city: string;
  niches: string[];
  followerCount: number | null;
  engagementRate: number | null;
  avgRating: number;
  rateMin: number;
  rateMax: number;
  verified: boolean;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [nicheFilter, setNicheFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setIsLoading(true);
        let url = '/api/creators';
        const params = [];

        if (cityFilter) params.push(`city=${cityFilter}`);
        if (nicheFilter) params.push(`niche=${nicheFilter}`);
        if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
        if (sortBy) params.push(`sort=${sortBy}`);

        if (params.length > 0) {
          url += '?' + params.join('&');
        }

        const response = await fetch(url);
        const data = await response.json();
        setCreators(data);
      } catch (error) {
        console.error('Failed to fetch creators:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCreators, 300);
    return () => clearTimeout(debounceTimer);
  }, [cityFilter, nicheFilter, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setCityFilter('');
    setNicheFilter('');
    setSearchQuery('');
    setSortBy('rating');
  };

  const hasActiveFilters = cityFilter || nicheFilter || searchQuery || sortBy !== 'rating';

  return (
    <div className="max-w-7xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <div className="badge-blue text-xs font-semibold uppercase tracking-wider inline-flex">
            <Users size={12} />
            Creators
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-gray-900">Discover Creators</h1>
        <p className="text-gray-400 mt-2.5 text-base">Find talented creators in your city and collaborate with them</p>
      </div>

      {/* Filters */}
      <div className="filter-bar mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">City</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="input-field">
              <option value="">All Cities</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">Niche</label>
            <select value={nicheFilter} onChange={(e) => setNicheFilter(e.target.value)} className="input-field">
              <option value="">All Niches</option>
              {NICHES.map(niche => <option key={niche} value={niche}>{niche}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
              <option value="rating">Highest Rating</option>
              <option value="followers">Most Followers</option>
              <option value="rate_low">Lowest Rate</option>
              <option value="rate_high">Highest Rate</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end mt-4">
            <button onClick={handleClearFilters} className="btn-ghost text-xs">
              <X size={14} />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Creators Grid */}
      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : creators.length === 0 ? (
        <EmptyState
          title="No creators found"
          description="Try adjusting your filters to find creators near you"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {creators.map((creator, index) => (
            <Link
              key={creator.id}
              href={`/creator/${creator.id}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="card-interactive p-7 h-full">
                {/* Profile Section */}
                <div className="flex items-start gap-4 mb-5">
                  <Avatar
                    src={creator.user?.image}
                    alt={creator.displayName}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-gray-900 truncate">{creator.displayName}</h3>
                    <div className="flex items-center gap-1.5 text-sm mt-1.5 text-gray-400">
                      <MapPin size={14} />
                      {creator.city}
                    </div>
                    {creator.verified && (
                      <span className="badge-coral text-xs mt-2 inline-block">Verified</span>
                    )}
                  </div>
                </div>

                {/* Niches */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {creator.niches.slice(0, 3).map(niche => (
                    <span key={niche} className="badge text-xs">{niche}</span>
                  ))}
                  {creator.niches.length > 3 && (
                    <span className="badge text-xs">+{creator.niches.length - 3}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="rounded-xl p-4 mb-5 space-y-3" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
                  {creator.followerCount !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Followers</span>
                      <span className="text-sm font-bold text-gray-900">
                        {creator.followerCount >= 1000
                          ? `${(creator.followerCount / 1000).toFixed(1)}K`
                          : creator.followerCount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {creator.engagementRate !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Engagement</span>
                      <span className="text-sm font-bold text-gray-900">{(creator.engagementRate * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Rating</span>
                    <StarRating rating={creator.avgRating} size={14} />
                  </div>
                </div>

                {/* Rate */}
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                  <span className="text-xs text-gray-400">Rate Range</span>
                  <span className="text-sm font-bold text-coral">
                    ₹{creator.rateMin.toLocaleString('en-IN')} - ₹{creator.rateMax.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
