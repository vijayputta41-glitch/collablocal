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
    <div className="stat-card-premium group">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</h3>
        <div
          className="p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
          style={{ backgroundColor: `${accentColor}0a`, boxShadow: `0 0 0 0 ${accentColor}00` }}
        >
          <Icon size={18} style={{ color: accentColor }} />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-400 mt-2.5 font-medium">{subtext}</p>
      )}
    </div>
  );
}
