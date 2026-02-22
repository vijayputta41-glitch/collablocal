'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { CITIES, BRAND_CATEGORIES } from '@/lib/constants';
import {
  ArrowRight,
  ArrowLeft,
  Loader,
  Sparkles,
  Building2,
  Globe,
  FileText,
  Instagram,
  CheckCircle2,
} from 'lucide-react';

const STEPS = [
  { label: 'Business Info', icon: Building2 },
  { label: 'Online Presence', icon: Globe },
  { label: 'Tax & Details', icon: FileText },
];

export default function BrandOnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    city: '',
    gstNumber: '',
    website: '',
    instagramHandle: '',
    description: '',
  });

  const pendingSubmitRef = useRef(false);

  // Restore form data from sessionStorage after OAuth redirect
  useEffect(() => {
    const saved = sessionStorage.getItem('brand_onboarding_data');
    if (saved && session) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        setCurrentStep(parsed._step || 0);
        sessionStorage.removeItem('brand_onboarding_data');
        if (parsed._autoSubmit) {
          pendingSubmitRef.current = true;
        }
      } catch { /* ignore */ }
    }
  }, [session]);

  // Auto-submit after form data is restored from sessionStorage
  useEffect(() => {
    if (pendingSubmitRef.current && session && formData.businessName) {
      pendingSubmitRef.current = false;
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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
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
    // If not signed in, save form data and redirect to Google sign-in
    if (!session) {
      sessionStorage.setItem('brand_onboarding_data', JSON.stringify({
        ...formData,
        _step: currentStep,
        _autoSubmit: true,
      }));
      signIn('google', { callbackUrl: '/onboarding/brand' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'brand',
          ...formData,
        }),
      });

      if (response.status === 401) {
        sessionStorage.setItem('brand_onboarding_data', JSON.stringify({
          ...formData,
          _step: currentStep,
          _autoSubmit: true,
        }));
        signIn('google', { callbackUrl: '/onboarding/brand' });
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
                      <Icon size={16} className="flex-shrink-0" style={isActive ? { color: '#0F3460' } : undefined} />
                    )}
                    <span className="hidden sm:inline truncate">{step.label}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`w-6 h-0.5 flex-shrink-0 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            {currentStep === 0 && 'Register your brand'}
            {currentStep === 1 && 'Your online presence'}
            {currentStep === 2 && 'Final details'}
          </h1>
          <p className="text-gray-500">
            {currentStep === 0 && 'Tell us about your business to get verified'}
            {currentStep === 1 && 'Help creators find and connect with you (optional)'}
            {currentStep === 2 && 'Tax info and review your profile'}
          </p>
        </div>

        {/* Form */}
        <div className="card p-6 sm:p-8 animate-scale-in">
          {/* Step 0: Business Info */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.businessName ? 'border-red-400' : ''}`}
                  placeholder="Your brand or business name"
                />
                {errors.businessName && <p className="text-xs text-red-500 mt-1.5">{errors.businessName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`input-field ${errors.category ? 'border-red-400' : ''}`}
                >
                  <option value="">Select your industry</option>
                  {BRAND_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1.5">{errors.category}</p>}
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`input-field min-h-[100px] resize-none ${errors.description ? 'border-red-400' : ''}`}
                  placeholder="Tell creators about your brand, what you do, and what collaborations you're looking for..."
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? (
                    <p className="text-xs text-red-500">{errors.description}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-gray-400">{formData.description.length}/500</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Online Presence */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-2">
                <p className="text-sm text-blue-700">
                  These fields are optional but help build trust with creators. Brands with social links get <span className="font-bold">3x more applications</span>.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Instagram Handle</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(15, 52, 96, 0.08)' }}>
                    <Instagram size={16} style={{ color: '#0F3460' }} />
                  </div>
                  <input
                    type="text"
                    name="instagramHandle"
                    value={formData.instagramHandle}
                    onChange={handleInputChange}
                    className="input-field pl-14"
                    placeholder="your_brand_handle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Website</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50">
                    <Globe size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="input-field pl-14"
                    placeholder="https://yourbrand.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tax & Summary */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  GST Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="27AABCT1234A1Z0"
                />
                <p className="text-xs text-gray-400 mt-1.5">Having GST improves credibility and helps with payments</p>
              </div>

              {/* Summary preview */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Profile Preview</h4>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                      style={{ background: 'linear-gradient(135deg, #0F3460, #1a4a8a)' }}
                    >
                      {formData.businessName.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">{formData.businessName || 'Your Brand'}</p>
                      <p className="text-sm text-gray-500">{formData.category || 'Category'} · {formData.city || 'City'}</p>
                    </div>
                  </div>

                  {formData.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{formData.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {formData.instagramHandle && (
                      <span className="badge-blue text-xs">@{formData.instagramHandle}</span>
                    )}
                    {formData.website && (
                      <span className="badge text-xs">{formData.website.replace(/^https?:\/\//, '')}</span>
                    )}
                    {formData.gstNumber && (
                      <span className="badge-success text-xs">GST Registered</span>
                    )}
                  </div>
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
                    Complete Setup
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
