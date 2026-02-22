import {
  DollarSign,
  TrendingUp,
  MapPin,
  Users,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

const CREATOR_BENEFITS = [
  {
    icon: DollarSign,
    title: 'Guaranteed Payments',
    desc: 'Your payment is held safely in escrow. Brands can\'t disappear. Get paid on time, every time.',
  },
  {
    icon: TrendingUp,
    title: 'Build Reputation',
    desc: 'Earn verified ratings from brands. Build a credible portfolio that opens doors to bigger opportunities.',
  },
  {
    icon: MapPin,
    title: 'Local Growth',
    desc: 'Work with brands in your city who value local talent. Grow your network and audience together.',
  },
];

const BRAND_BENEFITS = [
  {
    icon: Users,
    title: 'Real Local Creators',
    desc: 'Find authentic nano and micro creators in your city. No fake followers, only genuine engagement.',
  },
  {
    icon: ShieldCheck,
    title: 'Escrow Protection',
    desc: 'Your funds are safe. Pay only after approving content. Full transparency in every transaction.',
  },
  {
    icon: BarChart3,
    title: 'Campaign Reports',
    desc: 'Track performance in real-time. See reach, engagement, and actual ROI from each collaboration.',
  },
];

function BenefitCard({
  icon: Icon,
  title,
  desc,
  gradient,
  index,
}: {
  icon: typeof DollarSign;
  title: string;
  desc: string;
  gradient: string;
  index: number;
}) {
  return (
    <div
      className="card-interactive p-8 group animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:shadow-lg"
        style={{ background: gradient }}
      >
        <Icon size={24} className="text-white" />
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
      <section id="for-creators" className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-coral text-xs font-semibold uppercase tracking-wider mb-4 inline-flex">
              Creator Benefits
            </div>
            <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 text-balance">
              Built for Creators
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
              Everything you need to monetize your influence and grow your career
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CREATOR_BENEFITS.map((b, i) => (
              <BenefitCard
                key={b.title}
                {...b}
                gradient="linear-gradient(135deg, #E94560, #d63749)"
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* For Brands */}
      <section id="for-brands" className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-blue text-xs font-semibold uppercase tracking-wider mb-4 inline-flex">
              Brand Benefits
            </div>
            <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 text-balance">
              Made for Brands
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
              Launch campaigns, find creators, and track performance effortlessly
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BRAND_BENEFITS.map((b, i) => (
              <BenefitCard
                key={b.title}
                {...b}
                gradient="linear-gradient(135deg, #0F3460, #1a4a8a)"
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
