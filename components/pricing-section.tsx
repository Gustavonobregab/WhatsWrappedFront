import type React from "react"
import { Check, Shield, Lock, Brain } from "lucide-react"
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

              {/* Seção de privacidade e segurança */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-lg mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Privacidade e Segurança
                </h4>
                <ul className="space-y-4">
                  <PrivacyFeature
                    icon={<Lock className="h-5 w-5 text-green-500" />}
                    title="Sem acesso às suas conversas"
                    description="Não temos acesso ao conteúdo das suas conversas. Todo o processamento é feito localmente e seus dados nunca são armazenados."
                  />
                  <PrivacyFeature
                    icon={<Brain className="h-5 w-5 text-purple-500" />}
                    title="Análise 100% por IA"
                    description="Toda a análise é realizada por Inteligência Artificial avançada, sem intervenção humana, garantindo total privacidade dos seus dados."
                  />
                </ul>
              </div>
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

function PrivacyFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <li className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div className="ml-3">
          <h5 className="font-medium text-base">{title}</h5>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </li>
  )
}
