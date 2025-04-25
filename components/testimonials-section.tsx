import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="py-20 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950/20 dark:to-blue-950/20"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">O Que Nossos Usuários Dizem</h2>
          <p className="mt-4 text-xl text-muted-foreground">Pessoas reais, experiências reais com o ZapLove</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard
            name="Mariana Silva"
            role="Designer"
            content="Fiquei impressionada com a quantidade de 'eu te amo' que troquei com meu namorado! O visual é incrível, parece mesmo o Spotify Wrapped."
            avatar="MS"
            emoji="❤️"
          />
          <TestimonialCard
            name="Lucas Oliveira"
            role="Desenvolvedor"
            content="Descobri que mando mensagens principalmente de madrugada. Os gráficos são super interativos e a análise de sentimentos foi surpreendentemente precisa!"
            avatar="LO"
            emoji="🌙"
          />
          <TestimonialCard
            name="Camila Santos"
            role="Estudante"
            content="Meu grupo da faculdade ficou viciado! Comparamos nossos resultados e descobrimos padrões engraçados nas nossas conversas. Super recomendo!"
            avatar="CS"
            emoji="🎓"
          />
          <TestimonialCard
            name="Rafael Mendes"
            role="Empresário"
            content="Achei que seria apenas uma brincadeira, mas os insights são realmente úteis. Percebi que sou mais comunicativo nos fins de semana."
            avatar="RM"
            emoji="📊"
          />
          <TestimonialCard
            name="Juliana Costa"
            role="Professora"
            content="Adorei a segurança do serviço! Fiquei receosa no início, mas o fato de não armazenarem meus dados me deixou tranquila para experimentar."
            avatar="JC"
            emoji="🔒"
          />
          <TestimonialCard
            name="Pedro Almeida"
            role="Médico"
            content="As visualizações são incríveis! Parece mesmo o Wrapped do Spotify, mas com dados das minhas conversas. Uma ideia genial e bem executada."
            avatar="PA"
            emoji="🎯"
          />
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  name,
  role,
  content,
  avatar,
  emoji,
}: {
  name: string
  role: string
  content: string
  avatar: string
  emoji: string
}) {
  return (
    <Card className="overflow-hidden transform transition-transform hover:scale-105">
      <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="border-2 border-primary">
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-1">
              {name} <span className="text-lg">{emoji}</span>
            </div>
            <div className="text-sm text-muted-foreground">{role}</div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-muted-foreground">{content}</p>
        </div>
      </CardContent>
    </Card>
  )
}
