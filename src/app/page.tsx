import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { BenefitsGrid } from '@/components/landing/benefits-grid';
import { TrustSection } from '@/components/landing/trust-section';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <BenefitsGrid />
      <TrustSection />
      <CTASection />
      <Footer />
    </div>
  );
}
