import { type LucideIcon, SearchX } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="empty-state-premium animate-scale-in">
      <div
        className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center relative"
        style={{ backgroundColor: 'rgba(233, 69, 96, 0.06)' }}
      >
        <div className="absolute inset-0 rounded-3xl animate-pulse" style={{ backgroundColor: 'rgba(233, 69, 96, 0.03)' }} />
        <Icon size={36} className="text-gray-300 relative z-10" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">{title}</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary text-sm px-6 py-3">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
