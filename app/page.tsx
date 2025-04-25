import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { MetricsSection } from "@/components/metrics-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { PricingSection } from "@/components/pricing-section"
import { CtaSection } from "@/components/cta-section"
// import { FeedbackSection } from "@/components/feedback-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ZapLove</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#metricas" className="text-sm font-medium hover:text-primary">
              Métricas
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium hover:text-primary">
              Como Funciona
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Preço
            </Link>
            {/* <Link href="#feedback" className="text-sm font-medium hover:text-primary">
              Feedback
            </Link> */}
          </nav>
          <Button asChild>
            <Link href="/comece-agora">Comece Agora</Link>
          </Button>
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
