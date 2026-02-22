'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  LogOut,
  Home,
  Zap,
  User,
  Users,
  Handshake,
  Plus,
  ChevronRight,
  Bell,
  Inbox,
  FileText,
  Settings,
  Search,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: Home, roles: ['creator', 'brand'] },
  { label: 'Browse Campaigns', href: '/campaigns', icon: Zap, roles: ['creator'] },
  { label: 'My Campaigns', href: '/campaigns', icon: Zap, roles: ['brand'] },
  { label: 'Create Campaign', href: '/campaigns/new', icon: Plus, roles: ['brand'] },
  { label: 'Find Creators', href: '/creators', icon: Users, roles: ['brand'] },
  { label: 'Applications', href: '/applications', icon: Inbox, roles: ['brand'] },
  { label: 'My Applications', href: '/applications', icon: FileText, roles: ['creator'] },
  { label: 'My Deals', href: '/deals', icon: Handshake, roles: ['creator', 'brand'] },
  { label: 'My Profile', href: '/profile', icon: User, roles: ['creator', 'brand'] },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl border-4 animate-spin mx-auto" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-coral)' }} />
          <p className="mt-5 text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) {
    return null;
  }

  const userRole = session.user?.role as string;
  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <div className="min-h-screen lg:flex" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-[272px] z-40 transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static flex flex-col border-r`}
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-light)' }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-coral-blue flex items-center justify-center transition-all group-hover:scale-105" style={{ boxShadow: '0 4px 12px rgba(233, 69, 96, 0.25)' }}>
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block" style={{ color: 'var(--color-navy-light)' }}>
                CollabLocal
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>
                {userRole === 'creator' ? 'Creator Studio' : 'Brand Hub'}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            Navigation
          </p>
          {filteredNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-link-premium ${active ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
          <div className="flex items-center gap-3 px-3 py-3.5 rounded-2xl mb-3 transition-colors hover:bg-gray-50" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
            <Avatar
              src={session.user?.image}
              alt={session.user?.name || 'User'}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session.user?.name || session.user?.email}
              </p>
              <p className="text-xs capitalize font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                {userRole || 'User'}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full btn-ghost text-sm text-gray-500 hover:text-red-600 justify-start px-3 gap-2.5"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="header-premium sticky top-0 z-20">
          <div className="flex items-center justify-between px-5 sm:px-6 lg:px-8 h-[72px]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden btn-icon"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <nav className="hidden sm:flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((crumb) => (
                  <span key={crumb.href} className="flex items-center gap-1.5">
                    {!crumb.isLast ? (
                      <>
                        <Link
                          href={crumb.href}
                          className="transition-colors hover:text-gray-600"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          {crumb.label}
                        </Link>
                        <ChevronRight size={14} style={{ color: 'var(--color-border)' }} />
                      </>
                    ) : (
                      <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 lg:w-56 h-10 pl-10 pr-12 rounded-xl border text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300/50 transition-all"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-secondary)' }}
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md text-[10px] font-medium border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-surface)' }}>
                  /
                </kbd>
              </div>

              <button className="btn-icon relative">
                <Bell size={18} style={{ color: 'var(--color-text-secondary)' }} />
                <span className="notification-dot absolute top-1.5 right-1.5" />
              </button>
              <div className="w-px h-6 mx-0.5" style={{ backgroundColor: 'var(--color-border-light)' }} />
              <Avatar
                src={session.user?.image}
                alt={session.user?.name || 'User'}
                size="sm"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8">
          <div className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
