import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como Funciona</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Três passos simples para descobrir o que suas conversas dizem sobre você
          </p>
        </div>

        <div className="grid gap-16 md:gap-20">
          <Step
            number={1}
            title="Abra a conversa"
            description="Selecione a conversa ou grupo que você deseja analisar."
            image="/whatsapp-chat.png"
          />

          <Step
            number={2}
            title="Clique em exportar chat"
            description="Toque nos três pontos no canto superior direito, role para baixo e selecione 'Exportar conversa'."
            image="/whatsapp-export.png"
          />

          <Step
            number={3}
            title="Escolha 'Sem mídia'"
            description="Selecione a opção 'Sem mídia' para exportar apenas o texto das conversas, criando um arquivo menor e mais fácil de processar."
            image="/whatsapp-sem-midia.png"
          />
        </div>

        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            asChild
          >
            <Link href="/comece-agora">
              Comece agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Step({
  number,
  title,
  description,
  image,
  uploadButton = false,
}: {
  number: number
  title: string
  description: string
  image?: string
  uploadButton?: boolean
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className={`space-y-4 text-center md:text-left ${number % 2 === 0 ? "md:order-2" : ""}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold">
          {number}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground text-lg">{description}</p>

        {uploadButton && (
          <div className="pt-4">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Fazer Upload
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className={`flex justify-center ${number % 2 === 0 ? "md:order-1" : ""}`}>
        {image ? (
          <div className="relative w-full max-w-[350px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6"></div>
            <img
              src={image || "/placeholder.svg"}
              alt={`Passo ${number}: ${title}`}
              className="relative z-10 rounded-3xl border-4 border-background shadow-xl w-full"
            />
          </div>
        ) : (
          <div className="w-full max-w-[350px] aspect-[9/16] rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-8">
            <div className="w-full h-full rounded-2xl border-2 border-dashed border-primary/40 flex items-center justify-center">
              <span className="text-5xl">📱</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
