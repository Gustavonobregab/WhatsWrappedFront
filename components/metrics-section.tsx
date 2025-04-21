export function MetricsSection() {
  return (
    <section
      id="metricas"
      className="py-20 bg-gradient-to-br from-pink-100/50 to-purple-100/50 dark:from-pink-950/10 dark:to-purple-950/10"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Descubra Métricas Fascinantes</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Veja exemplos do que você vai descobrir sobre suas conversas
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total de Te Amo"
            value="237"
            description="Quantas vezes você disse essa frase especial"
            color="from-red-500 to-orange-500"
            emoji="❤️"
          />
          <MetricCard
            title="Total de Desculpas"
            value="562"
            description="Quantas vezes você pediu desculpas"
            color="from-green-500 to-emerald-500"
            emoji="🙏"
          />
          <MetricCard
            title="Dias Consecutivos"
            value="351 dias"
            description="Seu recorde de dias consecutivos conversando"
            color="from-purple-500 to-indigo-500"
            emoji="🔥"
          />
          <MetricCard
            title="Primeira Mensagem"
            value="12/03/2023"
            description="Quando tudo começou"
            color="from-amber-500 to-yellow-500"
            emoji="📅"
          />
          <MetricCard
            title="Dias Totais"
            value="365 dias"
            description="Tempo total de conversa"
            color="from-blue-500 to-cyan-500"
            emoji="📆"
          />
          <MetricCard
            title="Iniciou Conversas"
            value="Letícia (65%)"
            description="Quem manda mensagem primeiro"
            color="from-fuchsia-500 to-violet-500"
            emoji="💬"
          />
          <MetricCard
            title="Palavra Mais Usada"
            value="sim (543x)"
            description="A palavra que você mais usa"
            color="from-pink-500 to-rose-500"
            emoji="🔤"
          />
          <MetricCard
            title="Total de Mensagens"
            value="12.543"
            description="Quantidade de mensagens enviadas"
            color="from-indigo-500 to-blue-500"
            emoji="📱"
          />
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
