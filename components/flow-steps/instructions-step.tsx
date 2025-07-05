"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface InstructionsStepProps {
  onContinue: () => void
}

export function InstructionsStep({ onContinue }: InstructionsStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
      <h2 className="text-3xl font-bold mb-8">Como exportar sua conversa do WhatsApp</h2>

      <div className="flex flex-col gap-12 items-center">
        {/* Passo 1 */}
        <div className="space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold mx-auto">
            1
          </div>
          <h4 className="text-xl font-bold">Abra a conversa no WhatsApp</h4>
          <p className="text-muted-foreground">
            Selecione a conversa que você deseja analisar no seu WhatsApp.
          </p>
          <img
            src="/whatsapp-chat.png"
            alt="Abrir conversa no WhatsApp"
            className="rounded-xl border-4 border-background shadow-lg w-full max-w-[620px] mx-auto"
          />
        </div>

        {/* Passo 2 */}
        <div className="space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold mx-auto">
            2
          </div>
          <h4 className="text-xl font-bold">Clique em exportar conversa</h4>
          <p className="text-muted-foreground">
            Toque nos três pontos no canto superior direito, role para baixo e selecione 'Exportar conversa'.
          </p>
          <img
            src="/whatsapp-export.png"
            alt="Exportar chat no WhatsApp"
            className="rounded-xl border-4 border-background shadow-lg w-full max-w-[620px] mx-auto"
          />
        </div>

        {/* Passo 3 */}
        <div className="space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold mx-auto">
            3
          </div>
          <h4 className="text-xl font-bold">Escolha "Sem mídia"</h4>
          <p className="text-muted-foreground">
            Selecione a opção 'Sem mídia' para exportar apenas o texto das conversas, criando um arquivo menor e mais fácil de processar.
          </p>
          <img
            src="/whatsapp-sem-midia.png"
            alt="Escolher sem mídia"
            className="rounded-xl border-4 border-background shadow-lg w-full max-w-[620px] mx-auto"
          />
        </div>
      </div>

      <div className="mt-12">
        <Button
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-8 px-10"
          onClick={onContinue}
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Já exportei, continuar
        </Button>
      </div>
    </div>
  )
} 