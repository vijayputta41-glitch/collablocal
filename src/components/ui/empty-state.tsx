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
    <div className="card p-12 text-center animate-scale-in">
      <div
        className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(233, 69, 96, 0.08)' }}
      >
        <Icon size={32} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
