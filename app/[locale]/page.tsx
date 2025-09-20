'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { MetricsSection } from "@/components/metrics-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { PricingSection } from "@/components/pricing-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { useTranslations } from 'next-intl';
import { LanguageSelector } from '@/components/language-selector';
import { LocaleDebug } from '@/components/locale-debug';
import { useLocaleLink } from '@/hooks/use-locale-link';

declare global {
  interface Window {
    ttq: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

export default function Home() {
  const t = useTranslations();
  const { createLink } = useLocaleLink();
  
  return (
    <div className="flex min-h-screen flex-col">
      <LocaleDebug />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
          <span className="text-3xl">🩷</span>
          <span className="text-xl font-bold">{t('common.brand')}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#metricas" className="text-sm font-medium hover:text-primary">
              {t('navigation.metrics')}
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium hover:text-primary">
              {t('navigation.howItWorks')}
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              {t('navigation.pricing')}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div
              onClick={() => {
                if (typeof window !== 'undefined' && window.ttq) {
                  window.ttq.track('ViewContent', {
                    content_id: 'plano-premium', // Ou 'plano-basic' conforme necessário
                    content_type: 'product',
                    value: 26.90,
                    currency: 'BRL'
                  });
                }
              }}
            >
              <Button asChild>
                <Link href={createLink('/comece-agora')}>{t('common.startNow')}</Link>
              </Button>
            </div>
          </div>  
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <MetricsSection />
        <HowItWorksSection />
        <PricingSection />
        {/* <FeedbackSection /> */}
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
