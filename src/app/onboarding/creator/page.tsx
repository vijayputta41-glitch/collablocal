'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { CITIES, NICHES } from '@/lib/constants';
import {
  ArrowRight,
  ArrowLeft,
  Loader,
  Sparkles,
  User,
  BarChart3,
  Wallet,
  Link2,
  Instagram,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';

const STEPS = [
  { label: 'Profile', icon: User },
  { label: 'Niches', icon: BarChart3 },
  { label: 'Stats & Rates', icon: Wallet },
  { label: 'Portfolio', icon: Link2 },
];

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    displayName: '',
    instagramHandle: '',
    city: '',
    niches: [] as string[],
    followerCount: '',
    engagementRate: '',
    minRate: '',
    maxRate: '',
    bio: '',
    portfolioUrls: [''],
  });

  const pendingSubmitRef = useRef(false);

  // Restore form data from sessionStorage after OAuth redirect
  useEffect(() => {
    const saved = sessionStorage.getItem('creator_onboarding_data');
    if (saved && session) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        setCurrentStep(parsed._step || 0);
        sessionStorage.removeItem('creator_onboarding_data');
        if (parsed._autoSubmit) {
          pendingSubmitRef.current = true;
        }
      } catch { /* ignore */ }
    }
  }, [session]);

  // Auto-submit after form data is restored from sessionStorage
  useEffect(() => {
    if (pendingSubmitRef.current && session && formData.displayName) {
      pendingSubmitRef.current = false;
      // Small delay to ensure React state is fully settled
      const timer = setTimeout(() => {
        document.getElementById('submit-onboarding')?.click();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleNicheToggle = (niche: string) => {
    setFormData(prev => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : [...prev.niches, niche],
    }));
    if (errors.niches) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.niches;
        return next;
      });
    }
  };

  const handlePortfolioUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.portfolioUrls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, portfolioUrls: newUrls }));
  };

  const addPortfolioUrl = () => {
    if (formData.portfolioUrls.length < 5) {
      setFormData(prev => ({ ...prev, portfolioUrls: [...prev.portfolioUrls, ''] }));
    }
  };

  const removePortfolioUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioUrls: prev.portfolioUrls.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
      if (!formData.instagramHandle.trim()) newErrors.instagramHandle = 'Instagram handle is required';
      if (!formData.city) newErrors.city = 'City is required';
    }

    if (step === 1) {
      if (formData.niches.length === 0) newErrors.niches = 'Select at least one niche';
    }

    if (step === 2) {
      if (!formData.followerCount || Number(formData.followerCount) <= 0) newErrors.followerCount = 'Enter your follower count';
      if (!formData.engagementRate || Number(formData.engagementRate) <= 0) newErrors.engagementRate = 'Enter your engagement rate';
      if (!formData.minRate || Number(formData.minRate) <= 0) newErrors.minRate = 'Enter your minimum rate';
      if (!formData.maxRate || Number(formData.maxRate) <= 0) newErrors.maxRate = 'Enter your maximum rate';
      if (Number(formData.maxRate) < Number(formData.minRate)) newErrors.maxRate = 'Max rate must be greater than min rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    // If not signed in, save form data and redirect to Google sign-in
    if (!session) {
      sessionStorage.setItem('creator_onboarding_data', JSON.stringify({
        ...formData,
        _step: currentStep,
        _autoSubmit: true,
      }));
      signIn('google', { callbackUrl: '/onboarding/creator' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'creator',
          displayName: formData.displayName,
          instagramHandle: formData.instagramHandle,
          city: formData.city,
          niches: formData.niches,
          followerCount: Number(formData.followerCount),
          engagementRate: Number(formData.engagementRate),
          minRate: Number(formData.minRate),
          maxRate: Number(formData.maxRate),
          bio: formData.bio,
          portfolioUrls: formData.portfolioUrls.filter(url => url.trim()),
        }),
      });

      if (response.status === 401) {
        // Session expired, re-authenticate
        sessionStorage.setItem('creator_onboarding_data', JSON.stringify({
          ...formData,
          _step: currentStep,
          _autoSubmit: true,
        }));
        signIn('google', { callbackUrl: '/onboarding/creator' });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      router.push('/dashboard');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to complete onboarding. Please try again.');
      setIsLoading(false);
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen gradient-mesh-hero py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl gradient-coral-blue flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-lg" style={{ color: '#E94560' }}>
              CollabLocal
            </span>
          </Link>

          {/* Step Progress */}
          <div className="flex items-center gap-1 mb-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              return (
                <div key={step.label} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => { if (i < currentStep) setCurrentStep(i); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all w-full ${
                      isActive
                        ? 'bg-white shadow-md text-gray-900'
                        : isCompleted
                          ? 'text-green-600 cursor-pointer hover:bg-white/50'
                          : 'text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <Icon size={16} className={`flex-shrink-0 ${isActive ? '' : ''}`} style={isActive ? { color: '#E94560' } : undefined} />
                    )}
                    <span className="hidden sm:inline truncate">{step.label}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`w-4 h-0.5 flex-shrink-0 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            {currentStep === 0 && 'Tell us about yourself'}
            {currentStep === 1 && 'What do you create?'}
            {currentStep === 2 && 'Your stats & pricing'}
            {currentStep === 3 && 'Showcase your work'}
          </h1>
          <p className="text-gray-500">
            {currentStep === 0 && 'Basic info to get your creator profile started'}
            {currentStep === 1 && 'Select the niches that best describe your content'}
            {currentStep === 2 && 'Help brands understand your reach and rates'}
            {currentStep === 3 && 'Add links to your best content (optional)'}
          </p>
        </div>

        {/* Form */}
        <div className="card p-6 sm:p-8 animate-scale-in">
          {/* Step 0: Profile */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.displayName ? 'border-red-400 focus:border-red-400 focus:shadow-red-100' : ''}`}
                  placeholder="Your full name or creator name"
                />
                {errors.displayName && <p className="text-xs text-red-500 mt-1.5">{errors.displayName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Instagram Handle</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(233, 69, 96, 0.08)' }}>
                    <Instagram size={16} style={{ color: '#E94560' }} />
                  </div>
                  <input
                    type="text"
                    name="instagramHandle"
                    value={formData.instagramHandle}
                    onChange={handleInputChange}
                    className={`input-field pl-14 ${errors.instagramHandle ? 'border-red-400' : ''}`}
                    placeholder="your_handle"
                  />
                </div>
                {errors.instagramHandle && <p className="text-xs text-red-500 mt-1.5">{errors.instagramHandle}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`input-field ${errors.city ? 'border-red-400' : ''}`}
                >
                  <option value="">Select your city</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-xs text-red-500 mt-1.5">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bio <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Tell brands about yourself, your style, and what you create..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{formData.bio.length}/500</p>
              </div>
            </div>
          )}

          {/* Step 1: Niches */}
          {currentStep === 1 && (
            <div>
              {errors.niches && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{errors.niches}</p>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Selected: <span className="font-semibold text-gray-900">{formData.niches.length}</span>
                </p>
                {formData.niches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, niches: [] }))}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {NICHES.map(niche => {
                  const isSelected = formData.niches.includes(niche);
                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => handleNicheToggle(niche)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        isSelected
                          ? 'border-transparent text-white shadow-sm'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      style={isSelected ? { backgroundColor: '#E94560' } : undefined}
                    >
                      {niche}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Stats & Rates */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Your Reach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Followers</label>
                    <input
                      type="number"
                      name="followerCount"
                      value={formData.followerCount}
                      onChange={handleInputChange}
                      className={`input-field ${errors.followerCount ? 'border-red-400' : ''}`}
                      placeholder="e.g., 5000"
                    />
                    {errors.followerCount && <p className="text-xs text-red-500 mt-1.5">{errors.followerCount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Engagement Rate (%)</label>
                    <input
                      type="number"
                      name="engagementRate"
                      value={formData.engagementRate}
                      onChange={handleInputChange}
                      step="0.01"
                      className={`input-field ${errors.engagementRate ? 'border-red-400' : ''}`}
                      placeholder="e.g., 3.5"
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter as percentage (e.g., 3.5 for 3.5%)</p>
                    {errors.engagementRate && <p className="text-xs text-red-500 mt-0.5">{errors.engagementRate}</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Your Rates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Minimum (₹)</label>
                    <input
                      type="number"
                      name="minRate"
                      value={formData.minRate}
                      onChange={handleInputChange}
                      className={`input-field ${errors.minRate ? 'border-red-400' : ''}`}
                      placeholder="e.g., 2000"
                    />
                    {errors.minRate && <p className="text-xs text-red-500 mt-1.5">{errors.minRate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Maximum (₹)</label>
                    <input
                      type="number"
                      name="maxRate"
                      value={formData.maxRate}
                      onChange={handleInputChange}
                      className={`input-field ${errors.maxRate ? 'border-red-400' : ''}`}
                      placeholder="e.g., 15000"
                    />
                    {errors.maxRate && <p className="text-xs text-red-500 mt-1.5">{errors.maxRate}</p>}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Brands will see this range on your profile. You can negotiate per-deal.</p>
              </div>
            </div>
          )}

          {/* Step 3: Portfolio */}
          {currentStep === 3 && (
            <div>
              <p className="text-sm text-gray-500 mb-6">
                Add links to your best Instagram posts, YouTube videos, or other content to showcase your work.
              </p>
              <div className="space-y-3">
                {formData.portfolioUrls.map((url, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Link2 size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handlePortfolioUrlChange(index, e.target.value)}
                        className="input-field pl-10"
                        placeholder="https://instagram.com/p/..."
                      />
                    </div>
                    {formData.portfolioUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePortfolioUrl(index)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formData.portfolioUrls.length < 5 && (
                <button
                  type="button"
                  onClick={addPortfolioUrl}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  style={{ color: '#E94560' }}
                >
                  <Plus size={16} />
                  Add Another Link
                </button>
              )}

              {/* Summary preview */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Profile Preview</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #E94560, #0F3460)' }}
                  >
                    {formData.displayName.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{formData.displayName || 'Your Name'}</p>
                    <p className="text-xs text-gray-500">
                      @{formData.instagramHandle || 'handle'} · {formData.city || 'City'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.niches.map(niche => (
                    <span key={niche} className="badge-coral text-xs">{niche}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={currentStep === 0 ? () => router.push('/onboarding') : prevStep}
              className="btn-outline flex-shrink-0"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {isLastStep ? (
              <button
                id="submit-onboarding"
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex-1"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Step {currentStep + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
