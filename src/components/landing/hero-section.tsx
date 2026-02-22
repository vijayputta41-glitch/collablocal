import Link from 'next/link';
import { ArrowRight, Shield, Sparkles, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 gradient-mesh-hero" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Animated blobs */}
      <div className="blob-coral -top-40 -right-40 w-[500px] h-[500px] opacity-60" />
      <div className="blob-blue -bottom-40 -left-40 w-[500px] h-[500px] opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass shadow-lg border border-white/40 mb-10 animate-fade-in-up">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-medium text-gray-700">
              Trusted by <strong className="text-gray-900">3,500+</strong> creators across India
            </span>
          </div>

          <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-gray-900 mb-8 animate-fade-in-up delay-100 text-balance">
            Where Local Brands
            <br />
            Meet{' '}
            <span className="text-gradient-coral relative">
              Real Creators
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="var(--color-coral)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200 text-balance">
            Hyper-local influencer marketing done right. Find authentic nano and micro creators in your city, close deals with escrow protection, and grow together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24 animate-fade-in-up delay-300">
            <Link href="/onboarding" className="btn-primary text-base px-8 py-4 shadow-lg group">
              <span>I&apos;m a Creator</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/onboarding" className="btn-secondary text-base px-8 py-4 group">
              <span>I&apos;m a Brand</span>
              <Sparkles size={18} className="transition-transform group-hover:rotate-12" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 max-w-4xl mx-auto">
            <div className="animate-fade-in-up delay-400 sm:border-r sm:border-gray-200 px-8">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gradient-coral mb-1">
                3,500+
              </div>
              <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Verified Creators</p>
            </div>
            <div className="animate-fade-in-up delay-500 sm:border-r sm:border-gray-200 px-8">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gradient-navy mb-1">
                450+
              </div>
              <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Active Brands</p>
            </div>
            <div className="animate-fade-in-up delay-700 px-8">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gradient-coral mb-1">
                &#x20B9;63L+
              </div>
              <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">GMV Transacted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
