'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/30 border-b border-gray-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:shadow-lg group-hover:shadow-rose-500/30 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">
              CollabLocal
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'How it Works', href: '#how-it-works' },
              { label: 'For Creators', href: '#for-creators' },
              { label: 'For Brands', href: '#for-brands' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200">
              Log in
            </Link>
            <Link href="/onboarding" className="group inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-2.5 rounded-xl shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300">
              <span>Get Started</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              {[
                { label: 'How it Works', href: '#how-it-works' },
                { label: 'For Creators', href: '#for-creators' },
                { label: 'For Brands', href: '#for-brands' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-2 border-t border-gray-100 mt-3">
                <Link href="/login" className="block text-center text-sm font-semibold text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Log in
                </Link>
                <Link href="/onboarding" className="block text-center text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 py-3 rounded-xl shadow-md">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
