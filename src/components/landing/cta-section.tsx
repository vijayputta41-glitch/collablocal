import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-navy-blue animate-gradient-shift">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob-coral -top-20 -right-20 w-[400px] h-[400px] opacity-20" />
        <div className="blob-coral -bottom-40 -left-40 w-[400px] h-[400px] opacity-15" />
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8 text-sm font-medium text-white/80 backdrop-blur-sm">
          <Sparkles size={14} className="text-coral-light" />
          Join 3,950+ users today
        </div>

        <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6 text-balance">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-300 mb-12 max-w-xl mx-auto text-balance">
          Join thousands of creators and brands already collaborating on CollabLocal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-white text-gray-900 hover:bg-gray-50 transition-all hover:shadow-2xl hover:-translate-y-1 group"
          >
            Start as Creator
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-1 backdrop-blur-sm group"
          >
            Start as Brand
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
