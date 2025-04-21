"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Loader2 } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { MOCK_METRICS_DATA } from "@/lib/mock-data"

export default function SharedWrappedPage({ params }: { params: { shareId: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const shareId = params.shareId

  // Carregar dados de métricas pelo ID de compartilhamento
  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true)

        // Fazer requisição para a API
        const response = await fetch(`/api/v1/metrics/${shareId}`)
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Erro ao carregar dados")
        }

        console.log("Dados carregados:", result.data)

        if (Array.isArray(result.data) && result.data.length > 0) {
          setMetricsData(result.data)
        } else {
          console.warn("Formato de dados inválido, usando dados mockados")
          setMetricsData(MOCK_METRICS_DATA)
        }
      } catch (error: any) {
        console.error("Erro ao carregar métricas:", error)
        setError(error.message || "Erro ao carregar dados da retrospectiva")
        setMetricsData(MOCK_METRICS_DATA)
      } finally {
        // Simular um tempo de carregamento para melhor UX
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    fetchMetrics()
  }, [shareId])

  const handleShare = async () => {
    const url = window.location.href
    const title = `WhatsWrapped de ${metricsData.map((data) => data.sender).join(" e ")}`
    const text = "Confira esta retrospectiva de conversas no WhatsApp!"

    // Verificar se a API Web Share está disponível
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })

        toast({
          title: "Compartilhado!",
          description: "O link da retrospectiva foi compartilhado com sucesso",
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
        // Fallback para copiar para a área de transferência
        copyToClipboard(url)
      }
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      copyToClipboard(url)
    }
  }

  // Função auxiliar para copiar para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link copiado!",
          description: "O link da retrospectiva foi copiado para a área de transferência",
        })
      })
      .catch((err) => {
        console.error("Erro ao copiar link:", err)
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive",
        })
      })
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
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          {isLoading ? (
            <div className="aspect-[9/16] rounded-xl bg-card flex flex-col items-center justify-center">
              <Loader2 className="w-20 h-20 text-primary animate-spin mb-6" />
              <p className="text-2xl font-medium">Carregando retrospectiva...</p>
            </div>
          ) : (
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
              <StoriesCarousel metricsData={metricsData} />
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-xl text-muted-foreground mb-6">Gostou desta retrospectiva? Crie a sua também!</p>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" asChild className="text-lg py-6 px-8 border-2">
                <Link href="/">Criar Minha Retrospectiva</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
