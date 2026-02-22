import { Check, Shield, Lock, CreditCard, ThumbsUp, ArrowDown } from 'lucide-react';

const ESCROW_STEPS = [
  {
    icon: CreditCard,
    title: 'Brand Deposits Payment',
    desc: 'Brand posts campaign and deposits the agreed amount into escrow for each creator position.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    num: '01',
  },
  {
    icon: Lock,
    title: 'Creator Delivers Content',
    desc: 'You create and publish the content according to brand specifications and guidelines.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    num: '02',
  },
  {
    icon: ThumbsUp,
    title: 'Brand Reviews & Approves',
    desc: 'Brand reviews your content and approves it if it meets the campaign requirements.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    num: '03',
  },
  {
    icon: Check,
    title: 'Payment Released',
    desc: 'Upon approval, payment is instantly transferred to your account. Protected every step of the way.',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    num: '04',
  },
];

export function TrustSection() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/80">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-5">
            <Shield size={14} />
            Security
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Your Money is Safe
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every transaction on CollabLocal is protected by escrow
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-8 sm:p-12">
          {/* Top gradient accent */}
          <div className="h-1.5 -mt-8 sm:-mt-12 mb-8 sm:mb-12 -mx-8 sm:-mx-12 rounded-t-3xl bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />

          <div className="space-y-0">
            {ESCROW_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === ESCROW_STEPS.length - 1;
              return (
                <div key={i}>
                  <div className="flex gap-5 sm:gap-6 items-start group">
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="pt-0.5 flex-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Step {step.num}</div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1.5">{step.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-md">{step.desc}</p>
                    </div>
                  </div>
                  {!isLast && (
                    <div className="flex items-center gap-5 sm:gap-6 py-4">
                      <div className="w-14 flex justify-center">
                        <ArrowDown size={18} className="text-gray-300" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
