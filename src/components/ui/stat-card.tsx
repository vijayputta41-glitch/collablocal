import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  accentColor?: string;
}

export function StatCard({ label, value, subtext, icon: Icon, accentColor = '#E94560' }: StatCardProps) {
  return (
    <div className="card-gradient p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500">{label}</h3>
        <div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: `${accentColor}10` }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-500 mt-2">{subtext}</p>
      )}
    </div>
  );
}
