import { Shield, Sparkles, BarChart2, MessageCircle } from "lucide-react"

export function BenefitsSection() {
  return (
    <section
      id="beneficios"
      className="py-20 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/20 dark:to-indigo-950/20"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Por Que Usar o WhatsWrapped?</h2>
          <p className="mt-4 text-xl text-muted-foreground">Descubra o que torna o WhatsWrapped especial e divertido</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-lg transform transition-transform hover:scale-105">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Segurança Total</h3>
            <p className="mt-2 text-muted-foreground">
              Seus dados nunca são armazenados. Processamos localmente e excluímos após a análise. 🔒
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-lg transform transition-transform hover:scale-105">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Análise Emocional</h3>
            <p className="mt-2 text-muted-foreground">
              Descubra os sentimentos predominantes em suas conversas com análise de linguagem avançada. ❤️
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-lg transform transition-transform hover:scale-105">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white mb-4">
              <BarChart2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Visualização Rica</h3>
            <p className="mt-2 text-muted-foreground">
              Gráficos interativos e visuais inspirados no Spotify Wrapped para uma experiência imersiva. 📊
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-lg transform transition-transform hover:scale-105">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-4">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Insights Exclusivos</h3>
            <p className="mt-2 text-muted-foreground">
              Descubra padrões de comunicação que você nunca imaginou existirem em suas conversas. 💡
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
