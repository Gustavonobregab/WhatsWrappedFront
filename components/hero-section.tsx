"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { StoriesCarousel } from "./stories-carousel"
import { StoriesCarouselMocked } from "./landing-carousel"
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations();
  
  return (
<section className="relative overflow-hidden bg-[url('/neon-landing.png')] bg-cover bg-center py-20 md:py-32">
<div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
      <div className="container relative z-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6 text-center md:text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/80 md:text-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-white text-rose-700 hover:bg-white/90" asChild>
                <Link href="/comece-agora" id="comecar">
                  {t('common.createZapLove')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="relative aspect-[9/16] overflow-hidden rounded-xl shadow-2xl md:max-w-[85%] lg:max-w-[75%] xl:max-w-[65%] md:mx-auto">
              <StoriesCarouselMocked />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
