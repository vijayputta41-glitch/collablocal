import {
  DollarSign,
  TrendingUp,
  MapPin,
  Users,
  ShieldCheck,
  BarChart3,
  Sparkles,
} from 'lucide-react';

const CREATOR_BENEFITS = [
  {
    icon: DollarSign,
    title: 'Guaranteed Payments',
    desc: 'Your payment is held safely in escrow. Brands can\'t disappear. Get paid on time, every time.',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    shadow: 'shadow-emerald-500/15',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: TrendingUp,
    title: 'Build Reputation',
    desc: 'Earn verified ratings from brands. Build a credible portfolio that opens doors to bigger opportunities.',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50',
    shadow: 'shadow-orange-500/15',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: MapPin,
    title: 'Local Growth',
    desc: 'Work with brands in your city who value local talent. Grow your network and audience together.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    shadow: 'shadow-rose-500/15',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
];

const BRAND_BENEFITS = [
  {
    icon: Users,
    title: 'Real Local Creators',
    desc: 'Find authentic nano and micro creators in your city. No fake followers, only genuine engagement.',
    color: 'from-blue-600 to-indigo-700',
    bg: 'bg-blue-50',
    shadow: 'shadow-blue-500/15',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: ShieldCheck,
    title: 'Escrow Protection',
    desc: 'Your funds are safe. Pay only after approving content. Full transparency in every transaction.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    shadow: 'shadow-violet-500/15',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    icon: BarChart3,
    title: 'Campaign Reports',
    desc: 'Track performance in real-time. See reach, engagement, and actual ROI from each collaboration.',
    color: 'from-cyan-500 to-teal-600',
    bg: 'bg-cyan-50',
    shadow: 'shadow-cyan-500/15',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
];

function BenefitCard({
  icon: Icon,
  title,
  desc,
  color,
  shadow,
  iconBg,
  iconColor,
}: {
  icon: typeof DollarSign;
  title: string;
  desc: string;
  color: string;
  bg: string;
  shadow: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className={`group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-md ${shadow} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={26} className={iconColor} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2.5">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

export function BenefitsGrid() {
  return (
    <>
      {/* For Creators */}
      <section id="for-creators" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles size={14} />
              Creator Benefits
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Built for Creators
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Everything you need to monetize your influence and grow your career
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CREATOR_BENEFITS.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* For Brands */}
      <section id="for-brands" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles size={14} />
              Brand Benefits
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Made for Brands
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Launch campaigns, find creators, and track performance effortlessly
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BRAND_BENEFITS.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
