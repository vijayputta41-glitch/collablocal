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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg border-b border-white/20 py-0'
          : 'bg-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-coral-blue flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-navy-light">
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
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50/80 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">
              Log in
            </Link>
            <Link href="/onboarding" className="btn-primary text-sm px-5 py-2.5 group">
              <span>Get Started</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden btn-icon"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100/50 animate-slide-down">
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
                  className="block px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
                <Link href="/login" className="block text-center btn-ghost text-sm w-full">
                  Log in
                </Link>
                <Link href="/onboarding" className="block text-center btn-primary text-sm w-full">
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
