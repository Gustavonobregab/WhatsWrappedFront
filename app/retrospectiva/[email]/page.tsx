"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { ShareButton } from "@/components/share-button"
import { toast } from "@/components/ui/use-toast"

export default function RetrospectivaPorEmailPage({ params }: { params: { email: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [loveMessage, setLoveMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMockData, setIsMockData] = useState<boolean>(false)
  const [isBrowser, setIsBrowser] = useState<boolean>(false)

  // Decodificar o email da URL
  const email = decodeURIComponent(params.email)

  // Verificar se estamos no navegador
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  useEffect(() => {
    if (!isBrowser) return // Não executar no servidor

    async function fetchRetrospectiveData() {
      try {
        setIsLoading(true)

        console.log(`Buscando dados da retrospectiva para o email: ${email}`)

        // Buscar dados da retrospectiva diretamente do backend
        const response = await fetch(
          `/api/v1/metrics/retrospective/${encodeURIComponent(email)}`
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Erro ao buscar retrospectiva: ${response.status}`, errorText)
          throw new Error(`Não foi possível carregar a retrospectiva: ${response.status}`)
        }

        const data = await response.json()
        console.log("Resposta da API:", data)

        // Verificar se temos dados válidos
        if (!data || !data.participants || !Array.isArray(data.participants) || data.participants.length === 0) {
          console.error("Dados inválidos recebidos:", data)
          throw new Error("Dados inválidos ou incompletos recebidos da API")
        }

        // Verificar se cada participante tem os campos necessários
        const validParticipants = data.participants.filter((p: any) => p && p.sender && typeof p.totalMessages === "number")

        if (validParticipants.length === 0) {
          console.error("Nenhum participante válido encontrado:", data.participants)
          throw new Error("Nenhum participante válido encontrado nos dados")
        }

        console.log("Participantes válidos:", validParticipants)

        setMetricsData(validParticipants)
        setLoveMessage(data.text || null)
        setIsMockData(false)

        toast({
          title: "Retrospectiva carregada",
          description: "Sua retrospectiva foi carregada com sucesso!",
        })
      } catch (error: any) {
        console.error("Erro ao carregar retrospectiva:", error)
        setError(error.message || "Erro ao carregar a retrospectiva")

        // Tentar usar dados mockados como fallback
        try {
          console.log("Tentando usar dados mockados como fallback")
          const { getPersonalizedMockData } = await import("@/lib/mock-data")
          const mockData = getPersonalizedMockData(email || "Usuário")
          setMetricsData(mockData)
          setIsMockData(true)
          setError(null) // Limpar o erro já que temos dados mockados

          // Tentar obter a mensagem de amor da sessão
          const storedLoveMessage = sessionStorage.getItem("loveMessage")
          if (storedLoveMessage) {
            setLoveMessage(storedLoveMessage)
          }

          toast({
            title: "Usando dados de demonstração",
            description: "Não foi possível carregar seus dados reais. Exibindo dados de demonstração.",
            variant: "destructive",
          })
        } catch (fallbackError) {
          console.error("Erro ao carregar dados mockados:", fallbackError)
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    fetchRetrospectiveData()
  }, [email, isBrowser])

  if (error && metricsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-600/20 to-background flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Erro</h2>
          <p className="mb-6">{error}</p>
          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/">Voltar para o início</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/comece-agora">Criar nova retrospectiva</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Determinar o título da página com base nos dados
  const getPageTitle = () => {
    if (metricsData && metricsData.length > 0) {
      // Usar os nomes dos senders para o título
      const senders = metricsData.map((data) => data.sender)
      return `ZapLove de ${senders.join(" e ")}`
    }
    return "ZapLove"
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
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-2xl max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] mx-auto">
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

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {error}
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
