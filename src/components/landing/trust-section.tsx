import { Check, Shield, Lock, CreditCard, ThumbsUp } from 'lucide-react';

const ESCROW_STEPS = [
  {
    icon: CreditCard,
    title: 'Brand Deposits Payment',
    desc: 'Brand posts campaign and deposits the agreed amount into escrow for each creator position.',
  },
  {
    icon: Lock,
    title: 'Creator Delivers Content',
    desc: 'You create and publish the content according to brand specifications and guidelines.',
  },
  {
    icon: ThumbsUp,
    title: 'Brand Reviews & Approves',
    desc: 'Brand reviews your content and approves it if it meets the campaign requirements.',
  },
  {
    icon: Check,
    title: 'Payment Released',
    desc: 'Upon approval, payment is instantly transferred to your account. Protected every step of the way.',
  },
];

export function TrustSection() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 badge-premium text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield size={14} />
            Security
          </div>
          <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-5 text-balance">
            Your Money is Safe
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every transaction on CollabLocal is protected by escrow
          </p>
        </div>

        <div className="card-elevated p-8 sm:p-12 relative">
          {/* Gradient top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, var(--color-coral), var(--color-coral-light), var(--color-blue))' }} />

          <div className="space-y-0">
            {ESCROW_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === ESCROW_STEPS.length - 1;
              return (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 group-hover:shadow-lg"
                      style={{ background: isLast ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--color-coral), var(--color-coral-dark))' }}
                    >
                      {isLast ? (
                        <Check size={20} className="text-white" />
                      ) : (
                        <Icon size={20} className="text-white" />
                      )}
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 min-h-[20px]" style={{ background: 'linear-gradient(to bottom, rgba(233,69,96,0.3), rgba(233,69,96,0.05))' }} />
                    )}
                  </div>
                  <div className={isLast ? '' : 'pb-10'}>
                    <h4 className="font-bold text-gray-900 text-lg mb-1.5">{step.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
