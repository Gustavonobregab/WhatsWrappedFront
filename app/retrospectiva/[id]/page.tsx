"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { ShareButton } from "@/components/share-button"

export default function RetrospectivaPorIdPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [loveMessage, setLoveMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMockData, setIsMockData] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)
  const retrospectiveId = params.id

  // Verificar se estamos no navegador
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  useEffect(() => {
    if (!isBrowser) return // Não executar no servidor

    async function fetchRetrospectiveData() {
      try {
        setIsLoading(true)

        // Buscar dados da retrospectiva pelo ID
        const response = await fetch(`/api/retrospectiva/${retrospectiveId}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
          throw new Error(errorData.error || "Não foi possível carregar a retrospectiva")
        }

        const data = await response.json()

        if (data.success && data.data) {
          setMetricsData(data.data.participants || [])
          setLoveMessage(data.data.loveMessage || null)
          setIsMockData(data.data.isMock || false)
          console.log("Dados carregados com sucesso:", data.data)
        } else {
          throw new Error("Dados inválidos recebidos da API")
        }
      } catch (error: any) {
        console.error("Erro ao carregar retrospectiva:", error)
        setError(error.message || "Erro ao carregar a retrospectiva")
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    fetchRetrospectiveData()
  }, [retrospectiveId, isBrowser])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-600/20 to-background flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Erro</h2>
          <p className="mb-6">{error}</p>
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Determinar o título da página com base nos dados
  const getPageTitle = () => {
    if (metricsData && metricsData.length > 0) {
      // Usar os nomes dos senders para o título
      const senders = metricsData.map((data) => data.sender)
      return `WhatsWrapped de ${senders.join(" e ")}`
    }
    return "WhatsWrapped"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/20 to-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          </div>
          {isBrowser && (
            <ShareButton
              url={window.location.href}
              title={getPageTitle()}
              text="Confira nossa retrospectiva de conversas no WhatsApp!"
              variant="outline"
              size="sm"
            />
          )}
        </div>

        <div className="max-w-md mx-auto">
          {isLoading ? (
            <div className="aspect-[9/16] rounded-xl bg-card flex flex-col items-center justify-center">
              <Loader2 className="w-20 h-20 text-primary animate-spin mb-6" />
              <p className="text-2xl font-medium">Carregando sua retrospectiva...</p>
            </div>
          ) : (
            <>
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
                <StoriesCarousel metricsData={metricsData} loveMessage={loveMessage} />
              </div>

              {isMockData && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-lg">ℹ️</span>
                    Você está visualizando dados de demonstração. Para ver dados reais, faça o upload do seu arquivo de
                    conversa.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-xl text-muted-foreground mb-6">
              Gostou da sua retrospectiva? Compartilhe com seus amigos!
            </p>
            <div className="flex justify-center gap-4">
              {isBrowser && (
                <ShareButton
                  url={window.location.href}
                  title={getPageTitle()}
                  text="Confira nossa retrospectiva de conversas no WhatsApp!"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                  variant="default"
                  size="lg"
                />
              )}
              <Button variant="outline" asChild className="text-lg py-6 px-8 border-2">
                <Link href="/">Voltar para o Início</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
