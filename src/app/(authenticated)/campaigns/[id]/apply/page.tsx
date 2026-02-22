'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, Loader, AlertCircle, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Campaign {
  id: string;
  title: string;
  budgetPerCreator: number;
  brand: {
    businessName: string;
  };
}

export default function ApplyCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: sessionStatus } = useSession();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [pitchText, setPitchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingCampaign, setIsFetchingCampaign] = useState(true);

  const campaignId = params.id as string;

  // Fetch campaign details
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setIsFetchingCampaign(true);
        const response = await fetch(`/api/campaigns/${campaignId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign');
        }
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError('Campaign not found');
      } finally {
        setIsFetchingCampaign(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  // Redirect if not authenticated or not a creator
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push(`/login?callbackUrl=/campaigns/${campaignId}/apply`);
    }
    if (session?.user?.role !== 'creator' && sessionStatus === 'authenticated') {
      setError('Only creators can apply to campaigns');
    }
  }, [session, sessionStatus, router, campaignId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!pitchText.trim()) {
      setError('Please write a pitch text');
      return;
    }

    if (pitchText.trim().length < 50) {
      setError('Pitch text must be at least 50 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          pitchText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isFetchingCampaign || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 text-gray-400 animate-spin" size={40} />
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/campaigns" className="text-sm font-semibold mb-8 inline-block" style={{ color: '#E94560' }}>
            &larr; Back to Campaigns
          </Link>
          <div className="card p-12 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <Link href="/campaigns" className="btn-primary inline-block mt-6">
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'unauthenticated') {
    return null;
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="card p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-2">Your application for "{campaign?.title}" has been received.</p>
            <p className="text-sm text-gray-500 mb-8">{campaign?.brand.businessName} will review your pitch and get back to you soon.</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-blue-900">
                <strong>What's next?</strong> Check your email and dashboard for updates on your application status.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2">
                Go to Dashboard
                <ArrowRight size={18} />
              </Link>
              <Link href="/campaigns" className="btn-outline">
                Browse More Campaigns
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Apply form
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link href={`/campaigns/${campaignId}`} className="text-sm font-semibold mb-8 inline-flex items-center gap-2" style={{ color: '#E94560' }}>
          <ChevronLeft size={18} />
          Back to Campaign
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Apply to Campaign</h1>
          {campaign && (
            <div>
              <p className="text-lg text-gray-600">{campaign.title}</p>
              <p className="text-sm text-gray-500 mt-1">{campaign.brand.businessName}</p>
            </div>
          )}
        </div>

        {/* Application Form Card */}
        <div className="card p-8 sm:p-12">
          {campaign && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">CAMPAIGN</p>
                  <p className="text-lg font-semibold text-gray-900">{campaign.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">BUDGET</p>
                  <p className="text-lg font-semibold text-gray-900">₹{campaign.budgetPerCreator.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pitch Text Textarea */}
            <div>
              <label htmlFor="pitch" className="block text-sm font-bold text-gray-900 mb-3">
                Your Pitch
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Tell the brand why you're a great fit for this campaign. Be authentic and highlight your unique strengths.
              </p>
              <textarea
                id="pitch"
                value={pitchText}
                onChange={(e) => setPitchText(e.target.value)}
                placeholder="Hi! I'm excited about this campaign because... I have experience with... My audience loves... What makes me unique is..."
                className="input-field"
                rows={8}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {pitchText.length} characters
                {pitchText.trim().length < 50 && (
                  <span className="text-red-500"> (minimum 50 required)</span>
                )}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !pitchText.trim()}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Write a personalized pitch that explains why you're interested in this specific campaign and how your audience aligns with the brand's goals.
            </p>
          </div>
        </div>

        {/* Back to Campaigns Link */}
        <div className="mt-8 text-center">
          <Link href="/campaigns" className="text-sm font-semibold" style={{ color: '#E94560' }}>
            Browse other campaigns instead
          </Link>
        </div>
      </div>
    </div>
  );
}
