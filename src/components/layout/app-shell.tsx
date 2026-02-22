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

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 animate-spin mx-auto" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-coral)' }} />
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
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

  // Build breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-[260px] z-40 transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static flex flex-col border-r`}
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-light)' }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-coral-blue flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: 'var(--color-navy-light)' }}>
              CollabLocal
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-3" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
            <Avatar
              src={session.user?.image}
              alt={session.user?.name || 'User'}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session.user?.name || session.user?.email}
              </p>
              <p className="text-xs capitalize" style={{ color: 'var(--color-text-tertiary)' }}>
                {userRole || 'User'}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full btn-ghost text-sm text-gray-500 hover:text-red-600 justify-start px-3"
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
      <div className="lg:ml-0 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderColor: 'var(--color-border-light)' }}>
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Left: hamburger + breadcrumbs */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden btn-icon"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <nav className="hidden sm:flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb) => (
                  <span key={crumb.href} className="flex items-center gap-1">
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
                      <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            {/* Right: notifications + avatar */}
            <div className="flex items-center gap-2">
              <button className="btn-icon relative">
                <Bell size={18} style={{ color: 'var(--color-text-secondary)' }} />
                <span className="notification-dot absolute top-1.5 right-1.5" />
              </button>
              <div className="w-px h-6 mx-1" style={{ backgroundColor: 'var(--color-border-light)' }} />
              <Avatar
                src={session.user?.image}
                alt={session.user?.name || 'User'}
                size="sm"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
