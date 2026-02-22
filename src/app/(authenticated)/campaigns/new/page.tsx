'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CITIES, NICHES, CONTENT_TYPES } from '@/lib/constants';
import { ArrowRight, Loader } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/campaigns" className="text-sm font-semibold" style={{ color: '#E94560' }}>
          ← Back to Campaigns
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Launch a Campaign</h1>
        <p className="text-gray-600">Create a new campaign and find the perfect creators for your brand</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-8 space-y-8">
        {/* Campaign Details */}
        <div>
          <h2 className="text-xl font-bold mb-4 pb-4 border-b border-gray-200">Campaign Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Title *</label>
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="input-field min-h-24"
                placeholder="Describe your campaign, what you're looking for, and any specific requirements"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">City *</label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Content Type *</label>
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
          <h2 className="text-xl font-bold mb-4 pb-4 border-b border-gray-200">Target Audience</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Select Niches *</label>
            <div className="grid grid-cols-2 gap-3">
              {NICHES.map(niche => (
                <label key={niche} className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.niches.includes(niche)}
                    onChange={() => handleNicheToggle(niche)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">{niche}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Budget & Timeline */}
        <div>
          <h2 className="text-xl font-bold mb-4 pb-4 border-b border-gray-200">Budget & Timeline</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Budget per Creator (₹) *</label>
              <input
                type="number"
                name="budgetPerCreator"
                value={formData.budgetPerCreator}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="e.g., 15000"
              />
              <p className="text-xs text-gray-600 mt-1">The amount each selected creator will earn</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Creators *</label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Deadline *</label>
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Total Budget:</strong> ₹{(formData.budgetPerCreator * formData.maxCreators).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
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
      <div className="mt-8 card p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Campaign Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span>✓</span>
            <span>Be specific about what you're looking for in creators</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Clear budgets and timelines attract quality creators</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Select multiple niches to get more applications</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Money is held safely in escrow until you approve content</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
