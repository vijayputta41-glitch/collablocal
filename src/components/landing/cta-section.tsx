import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8 text-sm font-semibold text-white/80 backdrop-blur-sm">
          <Zap size={14} className="text-amber-400" />
          Join 3,950+ users today
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
          Ready to Get{' '}
          <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
            Started?
          </span>
        </h2>
        <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
          Join thousands of creators and brands already collaborating on CollabLocal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/onboarding"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold bg-white text-gray-900 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Start as Creator
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/onboarding"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm"
          >
            Start as Brand
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
