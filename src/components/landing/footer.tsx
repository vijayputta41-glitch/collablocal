import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--color-navy)' }}>
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(233, 69, 96, 0.3), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl gradient-coral-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-extrabold text-white text-lg">CollabLocal</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-gray-400">
              Hyper-local influencer marketing done right. Connect, collaborate, and grow together.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 text-gray-400 hover:text-white"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">For Creators</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/campaigns" className="hover:text-white transition-colors">Browse Campaigns</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Creator FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Verification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">For Brands</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/campaigns/new" className="hover:text-white transition-colors">Create Campaign</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Brand FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="divider-gradient mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">&copy; 2026 CollabLocal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
