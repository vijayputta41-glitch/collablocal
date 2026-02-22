import { Users, Sparkles, Check, UserPlus, Search, Banknote, Megaphone, ClipboardCheck, BarChart3 } from 'lucide-react';

const CREATOR_STEPS = [
  { icon: UserPlus, title: 'Create Your Profile', desc: 'Add your Instagram, niches, rates, and portfolio. Get verified instantly.', color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
  { icon: Search, title: 'Browse & Apply', desc: 'Discover campaigns from local brands in your city. Apply to ones that match your style.', color: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-500/20' },
  { icon: Banknote, title: 'Get Paid Safely', desc: 'Payment held in escrow until brand approves content. Get rated and build credibility.', color: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/20' },
];

const BRAND_STEPS = [
  { icon: Megaphone, title: 'Register Your Brand', desc: 'Set up your brand profile with category, city, and budget. Verify instantly.', color: 'from-blue-600 to-indigo-700', shadow: 'shadow-blue-500/20' },
  { icon: ClipboardCheck, title: 'Launch Campaigns', desc: 'Post campaigns with specific requirements. Review creator applications and hire the best fits.', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
  { icon: BarChart3, title: 'Pay & Get Reports', desc: 'Approve content and release payment. Track reach, engagement, and ROI in real-time.', color: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/20' },
];

function StepCard({
  step,
  index,
}: {
  step: typeof CREATOR_STEPS[0];
  index: number;
}) {
  const Icon = step.icon;
  return (
    <div className="flex gap-5 items-start">
      <div className="flex flex-col items-center">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${step.shadow} flex-shrink-0`}>
          <Icon size={24} className="text-white" />
        </div>
        {index < 2 && (
          <div className="w-0.5 h-12 bg-gradient-to-b from-gray-200 to-transparent mt-3" />
        )}
      </div>
      <div className="pt-1 pb-8">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Step {index + 1}</div>
        <h4 className="font-bold text-gray-900 text-lg mb-1.5">{step.title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{step.desc}</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles size={14} />
            Simple Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Three simple steps to start collaborating
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* For Creators */}
          <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/40 rounded-3xl p-8 sm:p-10 border border-rose-100/60 shadow-sm hover:shadow-lg transition-shadow duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20">
                <Users size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900">For Creators</h3>
            </div>
            <div>
              {CREATOR_STEPS.map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </div>
          </div>

          {/* For Brands */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 rounded-3xl p-8 sm:p-10 border border-blue-100/60 shadow-sm hover:shadow-lg transition-shadow duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20">
                <Sparkles size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900">For Brands</h3>
            </div>
            <div>
              {BRAND_STEPS.map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
