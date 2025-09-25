"use client"

import { useTranslations } from 'next-intl';

export function MetricsSection() {
  const t = useTranslations();
  
  return (
    <section
      id="metricas"
      className="py-20 bg-gradient-to-br from-pink-100/50 to-purple-100/50 dark:from-pink-950/10 dark:to-purple-950/10"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('metrics.title')}</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            {t('metrics.subtitle')}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title={t('metrics.cards.totalLove.title')}
            value="237"
            description={t('metrics.cards.totalLove.description')}
            color="from-red-500 to-orange-500"
            emoji="❤️"
          />
          <MetricCard
            title={t('metrics.cards.totalApologies.title')}
            value="562"
            description={t('metrics.cards.totalApologies.description')}
            color="from-green-500 to-emerald-500"
            emoji="🙏"
          />
          <MetricCard
            title={t('metrics.cards.consecutiveDays.title')}
            value="351 dias"
            description={t('metrics.cards.consecutiveDays.description')}
            color="from-purple-500 to-indigo-500"
            emoji="🔥"
          />
          <MetricCard
            title={t('metrics.cards.firstMessage.title')}
            value="12/03/2023"
            description={t('metrics.cards.firstMessage.description')}
            color="from-amber-500 to-yellow-500"
            emoji="📅"
          />
          <MetricCard
            title={t('metrics.cards.totalDays.title')}
            value="365 dias"
            description={t('metrics.cards.totalDays.description')}
            color="from-blue-500 to-cyan-500"
            emoji="📆"
          />
          <MetricCard
            title={t('metrics.cards.conversationStarter.title')}
            value="Letícia (65%)"
            description={t('metrics.cards.conversationStarter.description')}
            color="from-fuchsia-500 to-violet-500"
            emoji="💬"
          />
          <MetricCard
            title={t('metrics.cards.mostUsedWord.title')}
            value="sim (543x)"
            description={t('metrics.cards.mostUsedWord.description')}
            color="from-pink-500 to-rose-500"
            emoji="🔤"
          />
          <MetricCard
            title={t('metrics.cards.totalMessages.title')}
            value="12.543"
            description={t('metrics.cards.totalMessages.description')}
            color="from-indigo-500 to-blue-500"
            emoji="📱"
          />
          {/* Novo card "E muito mais!" */}
          <div className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="p-6 text-center relative h-full flex flex-col items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-5 left-5 w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
                <div
                  className="absolute bottom-5 right-5 w-16 h-16 rounded-full bg-white/10 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/4 w-10 h-10 rounded-full bg-white/10 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">✨</span>
                <h3 className="text-2xl font-bold mb-2">{t('metrics.cards.andMore.title')}</h3>
                <p className="text-lg text-white/90">
                  {t('metrics.cards.andMore.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({
  title,
  value,
  description,
  color,
  emoji,
}: {
  title: string
  value: string
  description: string
  color: string
  emoji: string
}) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
      <div className={`bg-gradient-to-r ${color} p-6 text-white relative`}>
        <div className="absolute top-3 right-3 text-2xl">{emoji}</div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
