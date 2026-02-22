import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Play, TrendingUp, Users, IndianRupee } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-rose-50/40">
      {/* Decorative background circles */}
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-100/60 to-pink-50/30 blur-3xl" />
      <div className="absolute bottom-10 left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-50/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-50/30 to-transparent blur-3xl" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28 w-full">
        <div className="text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-lg shadow-gray-200/50 border border-gray-100 mb-10">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-medium text-gray-700">
              Trusted by <strong className="text-gray-900">3,500+</strong> creators
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-8 tracking-tight leading-[1.05]">
            Where Local Brands
            <br />
            Meet{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Real Creators
              </span>
              <span className="absolute bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-rose-200/60 to-pink-200/60 -skew-x-3 rounded-sm" />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Hyper-local influencer marketing done right. Find authentic nano and micro
            creators in your city, close deals with escrow protection, and grow together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/onboarding"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-rose-500 to-pink-600 shadow-xl shadow-rose-500/25 hover:shadow-2xl hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>I&apos;m a Creator</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/onboarding"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-gray-700 bg-white border-2 border-gray-200 shadow-lg shadow-gray-200/30 hover:border-gray-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>I&apos;m a Brand</span>
              <Sparkles size={18} className="text-rose-400 transition-transform group-hover:rotate-12" />
            </Link>
          </div>

          {/* Stats row with cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/80 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                <Users size={22} className="text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">3,500+</div>
              <p className="text-sm text-gray-500 font-medium">Verified Creators</p>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/80 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp size={22} className="text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">450+</div>
              <p className="text-sm text-gray-500 font-medium">Active Brands</p>
            </div>
            <div className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/80 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <IndianRupee size={22} className="text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">&#x20B9;63L+</div>
              <p className="text-sm text-gray-500 font-medium">GMV Transacted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
