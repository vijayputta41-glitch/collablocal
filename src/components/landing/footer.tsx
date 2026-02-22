import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md shadow-rose-500/20">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-black text-white text-lg">CollabLocal</span>
            </Link>
            <p className="text-sm leading-relaxed mb-7 max-w-xs text-gray-500">
              Hyper-local influencer marketing done right. Connect, collaborate, and grow together.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 text-gray-500 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 text-sm">For Creators</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/campaigns" className="hover:text-white transition-colors duration-200">Browse Campaigns</Link></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Creator FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Verification</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm">For Brands</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/campaigns/new" className="hover:text-white transition-colors duration-200">Create Campaign</Link></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Brand FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">&copy; 2026 CollabLocal. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
