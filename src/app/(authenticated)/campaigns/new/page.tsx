'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CITIES, NICHES, CONTENT_TYPES } from '@/lib/constants';
import { ArrowRight, Loader, ArrowLeft, Sparkles, Check, Info } from 'lucide-react';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    niches: [] as string[],
    contentType: '',
    budgetPerCreator: 0,
    maxCreators: 1,
    deadline: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleNicheToggle = (niche: string) => {
    setFormData(prev => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : [...prev.niches, niche],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      router.push('/campaigns');
    } catch (error) {
      console.error('Campaign creation error:', error);
      alert('Failed to create campaign. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-10">
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Campaigns
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="badge-blue text-xs font-semibold uppercase tracking-wider inline-flex">
            <Sparkles size={12} />
            New Campaign
          </div>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl text-gray-900">Launch a Campaign</h1>
        <p className="text-gray-400 mt-2.5 text-base">Create a new campaign and find the perfect creators for your brand</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-8 sm:p-10 space-y-10">
        {/* Campaign Details */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border-light)' }}>Campaign Details</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">Campaign Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="e.g., Summer Collection Launch Campaign"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="input-field min-h-28"
                placeholder="Describe your campaign, what you're looking for, and any specific requirements"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select city</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">Content Type *</label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select content type</option>
                  {CONTENT_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border-light)' }}>Target Audience</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Select Niches *</label>
            <div className="grid grid-cols-2 gap-3">
              {NICHES.map(niche => {
                const isSelected = formData.niches.includes(niche);
                return (
                  <label
                    key={niche}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-coral/30 bg-coral/5 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                      isSelected ? 'bg-coral text-white' : 'border-2 border-gray-300'
                    }`}>
                      {isSelected && <Check size={12} />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{niche}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budget & Timeline */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border-light)' }}>Budget & Timeline</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">Budget per Creator (₹) *</label>
              <input
                type="number"
                name="budgetPerCreator"
                value={formData.budgetPerCreator}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="e.g., 15000"
              />
              <p className="text-xs text-gray-400 mt-1.5">The amount each selected creator will earn</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">Number of Creators *</label>
                <input
                  type="number"
                  name="maxCreators"
                  value={formData.maxCreators}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="input-field"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="rounded-xl p-5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(15, 52, 96, 0.04), rgba(15, 52, 96, 0.08))', border: '1px solid rgba(15, 52, 96, 0.1)' }}>
              <Info size={18} style={{ color: '#0F3460' }} />
              <p className="text-sm font-semibold" style={{ color: '#0F3460' }}>
                Total Budget: ₹{(formData.budgetPerCreator * formData.maxCreators).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Launching...
              </>
            ) : (
              <>
                Launch Campaign
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 card p-7" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <h3 className="font-extrabold text-gray-900 mb-4 text-sm">Campaign Tips</h3>
        <div className="space-y-3 text-sm text-gray-500">
          {[
            'Be specific about what you\'re looking for in creators',
            'Clear budgets and timelines attract quality creators',
            'Select multiple niches to get more applications',
            'Money is held safely in escrow until you approve content',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <Check size={12} className="text-green-600" />
              </div>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
