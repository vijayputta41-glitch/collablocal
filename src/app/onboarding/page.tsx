'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Instagram, Building2, ArrowRight, Sparkles, Shield, MapPin, TrendingUp, Users, Megaphone } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen gradient-mesh-hero px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto py-14 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-coral-blue flex items-center justify-center shadow-md">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl" style={{ color: '#E94560' }}>
              CollabLocal
            </span>
          </Link>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: '#E94560' }} />
            <div className="w-10 h-1.5 rounded-full bg-gray-200" />
            <div className="w-10 h-1.5 rounded-full bg-gray-200" />
          </div>

          <h1 className="heading-display text-4xl sm:text-5xl text-gray-900 mb-5">
            How will you use CollabLocal?
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Choose your role to get started. You can always explore both sides later.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-7 max-w-4xl mx-auto">
          {/* Creator Card */}
          <button
            onClick={() => router.push('/onboarding/creator')}
            className="relative group text-left rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 hover:shadow-2xl hover:border-transparent transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, #E94560, #ff6b81)' }} />

            <div className="flex items-center justify-between mb-7">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(233, 69, 96, 0.08)' }}>
                <Instagram size={30} style={{ color: '#E94560' }} />
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-900 transition-all duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">I&apos;m a Creator</h2>
            <p className="text-gray-400 mb-7 leading-relaxed">
              Monetize your influence and land paid collaborations with local brands.
            </p>

            <div className="space-y-3.5">
              {[
                { icon: MapPin, text: 'Get discovered by brands in your city' },
                { icon: Shield, text: 'Escrow-protected payments on every deal' },
                { icon: TrendingUp, text: 'Build your verified creator portfolio' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(233, 69, 96, 0.06)' }}>
                    <Icon size={15} style={{ color: '#E94560' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Perfect for</p>
              <p className="text-sm text-gray-500 mt-1.5">Nano & micro influencers (1K-100K followers)</p>
            </div>
          </button>

          {/* Brand Card */}
          <button
            onClick={() => router.push('/onboarding/brand')}
            className="relative group text-left rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 hover:shadow-2xl hover:border-transparent transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, #0F3460, #1a4a8a)' }} />

            <div className="flex items-center justify-between mb-7">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(15, 52, 96, 0.08)' }}>
                <Building2 size={30} style={{ color: '#0F3460' }} />
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-900 transition-all duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">I&apos;m a Brand</h2>
            <p className="text-gray-400 mb-7 leading-relaxed">
              Find authentic local creators and launch campaigns that drive real results.
            </p>

            <div className="space-y-3.5">
              {[
                { icon: Users, text: 'Access verified local creator network' },
                { icon: Megaphone, text: 'Launch targeted hyper-local campaigns' },
                { icon: Shield, text: 'Secure payments with escrow protection' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(15, 52, 96, 0.06)' }}>
                    <Icon size={15} style={{ color: '#0F3460' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Perfect for</p>
              <p className="text-sm text-gray-500 mt-1.5">Local businesses, D2C brands, restaurants & cafes</p>
            </div>
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-14 space-y-3">
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
