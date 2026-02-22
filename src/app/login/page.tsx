'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Star, Users, Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="w-10 h-10 rounded-full border-4 animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-coral)' }} />
    </div>
  );
}

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - brand messaging */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 gradient-navy-blue animate-gradient-shift">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob-coral -top-20 -right-20 w-[300px] h-[300px] opacity-20" />
          <div className="blob-blue bottom-20 -left-20 w-[250px] h-[250px] opacity-20" />
          <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10 group">
          <div className="w-9 h-9 rounded-xl gradient-coral-blue flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-extrabold text-xl text-white">CollabLocal</span>
        </Link>

        {/* Tagline */}
        <div className="relative z-10">
          <h1 className="heading-display text-4xl xl:text-5xl text-white mb-5 leading-tight">
            Where Local Brands
            <br />
            Meet Real Creators
          </h1>
          <p className="text-gray-300 text-lg mb-12 max-w-md leading-relaxed">
            Hyper-local influencer marketing with escrow protection and verified profiles.
          </p>

          {/* Stats row */}
          <div className="flex gap-10">
            {[
              { value: '3,500+', label: 'Creators' },
              { value: '450+', label: 'Brands' },
              { value: '4.9', label: 'Avg Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial card */}
        <div className="glass-dark rounded-2xl p-6 max-w-sm relative z-10">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            &ldquo;CollabLocal helped me find 10 amazing local creators for our cafe launch. The escrow feature gave us complete peace of mind.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-coral-blue flex items-center justify-center text-white text-xs font-bold">
              R
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Rahul K.</p>
              <p className="text-xs text-gray-400">Cafe Owner, Mumbai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: 'var(--color-surface)' }}>
        {/* Subtle mesh background on right panel */}
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-coral-blue flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-extrabold text-xl" style={{ color: 'var(--color-navy-light)' }}>
                CollabLocal
              </span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="heading-display text-3xl sm:text-4xl text-gray-900 mb-3">Welcome back</h2>
            <p className="text-gray-500 text-base">Sign in to your account or create a new one</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-gray-700 border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--color-border-light)' }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 uppercase tracking-wider font-medium" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-tertiary)' }}>or</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="text-gray-500 text-sm">
              New to CollabLocal?{' '}
              <Link href="/onboarding" className="font-semibold text-coral hover:underline transition-colors">
                Get started
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 pt-6 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
            <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
              <Shield size={14} />
              <span className="text-xs font-medium">Escrow Protected</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
              <Users size={14} />
              <span className="text-xs font-medium">3,500+ Creators</span>
            </div>
          </div>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--color-text-tertiary)' }}>
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-600 transition-colors">Terms</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-gray-600 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
