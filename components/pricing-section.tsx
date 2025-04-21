import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/20 dark:to-indigo-950/20"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Preço Único e Acessível</h2>
          <p className="mt-4 text-xl text-muted-foreground">Crie seu WhatsWrapped personalizado por um valor único</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden transform transition-all hover:scale-105">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Crie seu site e surpreenda!</h3>
              <div className="flex items-center justify-center gap-1 mb-6">
                <span className="text-4xl font-bold">R$</span>
                <span className="text-6xl font-extrabold">19,90</span>
              </div>
              <p className="text-muted-foreground mb-6">Pagamento único</p>

              <Button
                asChild
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
              >
                <Link href="/comece-agora">Criar Meu WhatsWrapped</Link>
              </Button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8">
              <h4 className="font-bold text-lg mb-4">O que está incluso:</h4>
              <ul className="space-y-3">
                <Feature text="Site exclusivo e personalizado com sua URL" />
                <Feature text="Análise completa das suas conversas" />
                <Feature text="Visualizações interativas no estilo Spotify Wrapped" />
                <Feature text="Compartilhamento fácil com amigos" />
                <Feature text="Acesso permanente aos seus resultados" />
                <Feature text="Processamento seguro e privado" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <Check className="h-3.5 w-3.5" />
      </div>
      <span className="ml-3 text-base">{text}</span>
    </li>
  )
}
