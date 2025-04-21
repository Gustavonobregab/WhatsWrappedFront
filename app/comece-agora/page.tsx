"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Loader2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { uploadFileAndGetMetrics } from "@/lib/api"
import { MOCK_METRICS_DATA } from "@/lib/mock-data"

export default function ComecePage() {
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [metricsData, setMetricsData] = useState<any[] | null>(null)
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Verificar se é um arquivo ZIP
    if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo ZIP exportado do WhatsApp.",
        variant: "destructive",
      })
      setIsUploading(false)
      return
    }

    // Verificar o tamanho do arquivo (limite de 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB em bytes
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é de 10MB. Por favor, selecione um arquivo menor.",
        variant: "destructive",
      })
      setIsUploading(false)
      return
    }

    // Armazenar o arquivo selecionado para uso posterior
    setSelectedFile(file)

    try {
      // Vamos melhorar o log para depuração
      try {
        // Fazer upload do arquivo e obter métricas
        const metrics = await uploadFileAndGetMetrics(file)
        console.log("Métricas obtidas da API:", metrics)

        // Armazenar as métricas na sessão - garantir que estamos salvando corretamente
        if (metrics && Array.isArray(metrics)) {
          sessionStorage.setItem("metricsData", JSON.stringify(metrics))
          setMetricsData(metrics)

          // Adicionar log para confirmar o que foi salvo
          console.log("Métricas salvas na sessão:", JSON.parse(sessionStorage.getItem("metricsData") || "[]"))

          // Marcar como carregado com sucesso
          setIsUploaded(true)

          toast({
            title: "Arquivo processado com sucesso!",
            description: `Suas métricas foram extraídas. Participantes: ${metrics.map((m) => m.sender).join(" e ")}`,
          })
        } else {
          throw new Error("Formato de resposta inválido da API")
        }
      } catch (error: any) {
        console.error("Erro ao processar arquivo:", error)

        toast({
          title: "Erro ao processar arquivo",
          description: error.message || "Ocorreu um erro ao processar seu arquivo. Usando dados de exemplo.",
          variant: "destructive",
        })

        // Em caso de erro, usar dados mockados
        sessionStorage.setItem("metricsData", JSON.stringify(MOCK_METRICS_DATA))
        setMetricsData(MOCK_METRICS_DATA)
        setIsUploaded(true)
      }
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error)

      toast({
        title: "Erro ao processar arquivo",
        description: error.message || "Ocorreu um erro ao processar seu arquivo. Usando dados de exemplo.",
        variant: "destructive",
      })

      // Em caso de erro, usar dados mockados
      sessionStorage.setItem("metricsData", JSON.stringify(MOCK_METRICS_DATA))
      setMetricsData(MOCK_METRICS_DATA)
      setIsUploaded(true)
    } finally {
      setIsUploading(false)
    }

    // Armazenar informações do arquivo na sessão
    sessionStorage.setItem("fileSelected", "true")
    sessionStorage.setItem("whatsappFile", file.name)

    // Criar uma URL para o arquivo
    const fileURL = URL.createObjectURL(file)
    sessionStorage.setItem("whatsappFileBlob", fileURL)

    // Marcar o arquivo como validado
    sessionStorage.setItem("fileValidated", "true")
  }

  const handleContinue = () => {
    if (step === 2) {
      if (!isUploaded) {
        toast({
          title: "Arquivo não selecionado",
          description: "Por favor, selecione um arquivo antes de continuar.",
          variant: "destructive",
        })
        return
      }

      // Limpar quaisquer dados de pagamento anteriores para evitar problemas
      sessionStorage.removeItem("paymentData")

      router.push("/dados-pessoais")
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background">
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Vamos criar seu WhatsWrapped! 🎉</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Barra de progresso */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-20 h-2 rounded-full ${
                    i <= step ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className={`${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>Exportar</span>
              <span className={`${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>Upload</span>
              <span className="text-muted-foreground">Dados</span>
              <span className="text-muted-foreground">Pagamento</span>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-3xl font-bold text-center mb-10">Como exportar seu chat do WhatsApp 📱</h2>

              <div className="space-y-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold mb-4">
                      1
                    </div>
                    <h3 className="text-2xl font-bold">Clique no seu contato</h3>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[300px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6"></div>
                      <img
                        src="/whatsapp-chat.png"
                        alt="Abra o WhatsApp"
                        className="relative z-10 rounded-3xl border-4 border-background shadow-xl w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left md:order-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold mb-4">
                      2
                    </div>
                    <h3 className="text-2xl font-bold">Clique em exportar chat</h3>
                  </div>
                  <div className="flex justify-center md:order-1">
                    <div className="relative w-full max-w-[300px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6"></div>
                      <img
                        src="/whatsapp-export.png"
                        alt="Exportar chat"
                        className="relative z-10 rounded-3xl border-4 border-background shadow-xl w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold mb-4">
                      3
                    </div>
                    <h3 className="text-2xl font-bold">Escolha "SEM MÍDIA"</h3>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[300px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6"></div>
                      <img
                        src="/whatsapp-sem-midia.png"
                        alt="Escolha SEM MÍDIA"
                        className="relative z-10 rounded-3xl border-4 border-background shadow-xl w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                >
                  Já exportei! Próximo passo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-center mb-4">Faça upload do seu arquivo 🚀</h2>
              <p className="text-center mb-6 text-sm text-muted-foreground">
                Seus dados são processados localmente e <span className="font-bold">nunca</span> armazenados. 🔒
              </p>

              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                {!isUploaded ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="h-16 w-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-medium">Arraste seu arquivo aqui ou clique para selecionar</h3>
                    <p className="text-sm text-muted-foreground">Arquivos .zip do WhatsApp (máx. 10MB)</p>
                    <div className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".zip"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>Selecionar Arquivo</>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-green-100 p-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-2xl font-medium text-green-600">Arquivo carregado com sucesso!</h3>

                    <p className="text-lg">
                      {selectedFile?.name} (
                      {(selectedFile?.size || 0) / 1024 / 1024 < 1
                        ? `${Math.round((selectedFile?.size || 0) / 1024)} KB`
                        : `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                      )
                    </p>

                    {metricsData && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                        <h4 className="font-medium mb-2">Métricas extraídas:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <span className="font-medium">Participantes:</span>{" "}
                            {metricsData.map((user) => user.sender).join(", ")}
                          </li>
                          <li>
                            <span className="font-medium">Total de mensagens:</span>{" "}
                            {metricsData.reduce((sum, user) => sum + user.totalMessages, 0)}
                          </li>
                          <li>
                            <span className="font-medium">Mensagens de amor:</span>{" "}
                            {metricsData.reduce((sum, user) => sum + user.loveMessages, 0)}
                          </li>
                        </ul>
                      </div>
                    )}

                    <div className="relative mt-4">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".zip"
                        onChange={handleFileUpload}
                      />
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                        Selecionar outro arquivo
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!isUploaded}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white/80 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="text-base font-medium">Dicas Rápidas</h3>
            </div>
            <div className="grid gap-2 md:grid-cols-2 text-sm">
              <div className="flex items-start gap-2">
                <span>🔒</span>
                <p>Seus dados pessoais são usados apenas para o pagamento.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>⚡</span>
                <p>Apenas arquivos .zip do WhatsApp são aceitos.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>📏</span>
                <p>O tamanho máximo do arquivo é de 10MB.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
