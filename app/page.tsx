import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { MetricsSection } from "@/components/metrics-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">WhatsWrapped</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#metricas" className="text-sm font-medium hover:text-primary">
              Métricas
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium hover:text-primary">
              Como Funciona
            </Link>
            <Link href="#depoimentos" className="text-sm font-medium hover:text-primary">
              Depoimentos
            </Link>
            <Link href="#beneficios" className="text-sm font-medium hover:text-primary">
              Benefícios
            </Link>
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
        {/*  <TestimonialsSection /> */}
        {/* <BenefitsSection /> */}
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
