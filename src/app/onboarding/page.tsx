'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Instagram, Building2, ArrowRight, Sparkles, Shield, MapPin, TrendingUp, Users, Megaphone } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen gradient-mesh-hero px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-coral-blue flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl" style={{ color: '#E94560' }}>
              CollabLocal
            </span>
          </Link>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-1 rounded-full" style={{ backgroundColor: '#E94560' }} />
            <div className="w-8 h-1 rounded-full bg-gray-200" />
            <div className="w-8 h-1 rounded-full bg-gray-200" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How will you use CollabLocal?
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Choose your role to get started. You can always explore both sides later.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Creator Card */}
          <button
            onClick={() => router.push('/onboarding/creator')}
            className="relative group text-left rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 hover:shadow-2xl hover:border-transparent transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Gradient accent on hover */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, #E94560, #ff6b81)' }} />

            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(233, 69, 96, 0.08)' }}>
                <Instagram size={28} style={{ color: '#E94560' }} />
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors group-hover:translate-x-0.5 transform duration-200" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">I&apos;m a Creator</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Monetize your influence and land paid collaborations with local brands.
            </p>

            <div className="space-y-3">
              {[
                { icon: MapPin, text: 'Get discovered by brands in your city' },
                { icon: Shield, text: 'Escrow-protected payments on every deal' },
                { icon: TrendingUp, text: 'Build your verified creator portfolio' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(233, 69, 96, 0.08)' }}>
                    <Icon size={14} style={{ color: '#E94560' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Perfect for</p>
              <p className="text-sm text-gray-600 mt-1">Nano & micro influencers (1K-100K followers)</p>
            </div>
          </button>

          {/* Brand Card */}
          <button
            onClick={() => router.push('/onboarding/brand')}
            className="relative group text-left rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 hover:shadow-2xl hover:border-transparent transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Gradient accent on hover */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, #0F3460, #1a4a8a)' }} />

            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(15, 52, 96, 0.08)' }}>
                <Building2 size={28} style={{ color: '#0F3460' }} />
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors group-hover:translate-x-0.5 transform duration-200" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">I&apos;m a Brand</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Find authentic local creators and launch campaigns that drive real results.
            </p>

            <div className="space-y-3">
              {[
                { icon: Users, text: 'Access verified local creator network' },
                { icon: Megaphone, text: 'Launch targeted hyper-local campaigns' },
                { icon: Shield, text: 'Secure payments with escrow protection' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(15, 52, 96, 0.08)' }}>
                    <Icon size={14} style={{ color: '#0F3460' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Perfect for</p>
              <p className="text-sm text-gray-600 mt-1">Local businesses, D2C brands, restaurants & cafes</p>
            </div>
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#E94560' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
