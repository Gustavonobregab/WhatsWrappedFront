"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { useRouter } from "next/navigation"
import { ShareButton } from "@/components/share-button"

export default function UserWrappedPage({ params }: { params: { email: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string>("")
  const router = useRouter()
  const email = decodeURIComponent(params.email)

  useEffect(() => {
    try {
      setIsLoading(true)

      // Decodificar o email da URL
      const decodedEmail = decodeURIComponent(params.email)
      console.log("Email decodificado:", decodedEmail)

      // Tentar obter dados da sessão
      const metricsDataStr = sessionStorage.getItem("metricsData")
      console.log("Dados brutos da sessão:", metricsDataStr)

      // Verificar se o email atual corresponde ao email armazenado na sessão
      const userDataStr = sessionStorage.getItem("userData")
      const userData = userDataStr ? JSON.parse(userDataStr) : null
      const isCurrentUser = userData && userData.email === decodedEmail

      if (metricsDataStr && isCurrentUser) {
        // Se for o usuário atual, usar os dados da sessão
        const parsedData = JSON.parse(metricsDataStr)
        console.log("Dados parseados da sessão:", parsedData)

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setMetricsData(parsedData)
          console.log("Métricas definidas no estado:", parsedData)
        } else {
          setError("Dados de métricas inválidos. Por favor, tente fazer o upload novamente.")
        }
      } else {
        // Se não for o usuário atual ou não houver dados na sessão,
        // tentar buscar da API
        fetchMetricsFromAPI(decodedEmail)
      }

      // Definir a URL de compartilhamento como a URL atual
      setShareUrl(window.location.href)
    } catch (error) {
      console.error("Erro ao carregar dados de métricas:", error)
      setError("Erro ao carregar dados. Por favor, tente novamente.")
    } finally {
      // Simular um tempo de carregamento para melhor UX
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [params.email])

  // Função para buscar métricas da API
  const fetchMetricsFromAPI = async (email: string) => {
    try {
      // Fazer requisição para a API
      const response = await fetch(`/api/share/${encodeURIComponent(email)}`)

      if (!response.ok) {
        throw new Error("Não foi possível carregar os dados para este email")
      }

      const result = await response.json()

      if (result.success && result.data) {
        setMetricsData(result.data)
      } else {
        throw new Error(result.error || "Dados não encontrados")
      }
    } catch (error: any) {
      console.error("Erro ao buscar métricas da API:", error)
      setError(error.message || "Erro ao carregar dados da retrospectiva")
    }
  }

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
          <ShareButton
            url={window.location.href}
            title={`WhatsWrapped de ${metricsData.map((data) => data.sender).join(" e ")}`}
            text="Confira nossa retrospectiva de conversas no WhatsApp!"
            variant="outline"
            size="sm"
          />
        </div>

        <div className="max-w-md mx-auto">
          {isLoading ? (
            <div className="aspect-[9/16] rounded-xl bg-card flex flex-col items-center justify-center">
              <Loader2 className="w-20 h-20 text-primary animate-spin mb-6" />
              <p className="text-2xl font-medium">Carregando seu WhatsWrapped...</p>
            </div>
          ) : (
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
              <StoriesCarousel metricsData={metricsData} />
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-xl text-muted-foreground mb-6">
              Gostou do seu WhatsWrapped? Compartilhe com seus amigos!
            </p>
            <div className="flex justify-center gap-4">
              <ShareButton
                url={window.location.href}
                title={`WhatsWrapped de ${metricsData.map((data) => data.sender).join(" e ")}`}
                text="Confira nossa retrospectiva de conversas no WhatsApp!"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                variant="default"
                size="lg"
              />
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
