import { Users, Sparkles, Check } from 'lucide-react';

const CREATOR_STEPS = [
  { title: 'Create Your Profile', desc: 'Add your Instagram, niches, rates, and portfolio. Get verified instantly.' },
  { title: 'Browse & Apply', desc: 'Discover campaigns from local brands in your city. Apply to ones that match your style.' },
  { title: 'Get Paid Safely', desc: 'Payment held in escrow until brand approves content. Get rated and build credibility.' },
];

const BRAND_STEPS = [
  { title: 'Register Your Brand', desc: 'Set up your brand profile with category, city, and budget. Verify instantly.' },
  { title: 'Launch Campaigns', desc: 'Post campaigns with specific requirements. Review creator applications and hire the best fits.' },
  { title: 'Pay & Get Reports', desc: 'Approve content and release payment. Track reach, engagement, and ROI in real-time.' },
];

function StepList({
  steps,
  accentColor,
  gradient,
}: {
  steps: typeof CREATOR_STEPS;
  accentColor: string;
  gradient: string;
}) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-5 group">
          <div className="relative flex flex-col items-center">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 transition-all group-hover:scale-110 group-hover:shadow-lg"
              style={{ background: gradient }}
            >
              {i === steps.length - 1 ? <Check size={18} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-px flex-1 min-h-[24px] mt-2"
                style={{ background: `linear-gradient(to bottom, ${accentColor}40, ${accentColor}08)` }}
              />
            )}
          </div>
          <div className="pb-8 last:pb-0">
            <h4 className="font-bold text-gray-900 text-lg mb-1.5">{step.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="badge-premium text-xs font-semibold uppercase tracking-wider mb-4 inline-flex">
            Simple Process
          </div>
          <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 text-balance">
            How It Works
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* For Creators */}
          <div className="card-bento p-8 sm:p-10">
            <h3 className="text-xl font-bold mb-10 flex items-center gap-3 text-gray-900">
              <div className="p-2.5 rounded-2xl" style={{ backgroundColor: 'rgba(233, 69, 96, 0.08)' }}>
                <Users size={22} className="text-coral" />
              </div>
              For Creators
            </h3>
            <StepList
              steps={CREATOR_STEPS}
              accentColor="#E94560"
              gradient="linear-gradient(135deg, #E94560, #d63749)"
            />
          </div>

          {/* For Brands */}
          <div className="card-bento p-8 sm:p-10">
            <h3 className="text-xl font-bold mb-10 flex items-center gap-3 text-gray-900">
              <div className="p-2.5 rounded-2xl" style={{ backgroundColor: 'rgba(15, 52, 96, 0.08)' }}>
                <Sparkles size={22} className="text-blue" />
              </div>
              For Brands
            </h3>
            <StepList
              steps={BRAND_STEPS}
              accentColor="#0F3460"
              gradient="linear-gradient(135deg, #0F3460, #1a4a8a)"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
