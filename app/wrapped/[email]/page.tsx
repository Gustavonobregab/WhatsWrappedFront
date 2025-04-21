"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Loader2 } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// Dados de exemplo para fallback
const EXAMPLE_DATA = [
  {
    sender: "Bbkinha",
    totalMessages: 3542,
    loveMessages: 21,
    apologyMessages: 6,
    firstMessageDate: "2024-04-19",
    messageStreak: 31,
    daysStartedConversation: 155,
  },
  {
    sender: "Gabriela",
    totalMessages: 4380,
    loveMessages: 40,
    apologyMessages: 1,
    firstMessageDate: "2024-04-19",
    messageStreak: 31,
    daysStartedConversation: 153,
  },
]

export default function UserWrappedPage({ params }: { params: { email: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const email = decodeURIComponent(params.email)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)

        // Primeiro, tentar obter os dados da sessão
        const sessionData = sessionStorage.getItem("metricsData")
        if (sessionData) {
          const parsedData = JSON.parse(sessionData)
          setMetricsData(parsedData)
          setIsLoading(false)
          return
        }

        // Se não houver dados na sessão, tentar buscar da API
        try {
          const response = await fetch(`/api/v1/metrics/${encodeURIComponent(email)}`)

          if (!response.ok) {
            throw new Error("Não foi possível carregar os dados da sua retrospectiva")
          }

          const data = await response.json()

          if (!data.success || !data.data || data.data.length === 0) {
            throw new Error("Dados não encontrados ou inválidos")
          }

          setMetricsData(data.data)
          sessionStorage.setItem("metricsData", JSON.stringify(data.data))
        } catch (apiError) {
          console.error("Erro ao buscar dados da API:", apiError)
          throw new Error("Não foi possível carregar os dados da sua retrospectiva. Por favor, tente novamente.")
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error)
        setError(error.message || "Erro ao carregar dados do WhatsWrapped")
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do WhatsWrapped. Por favor, tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [email])

  const handleShare = async () => {
    const url = window.location.href
    const title = `WhatsWrapped de ${metricsData.map((data) => data.sender).join(" e ")}`
    const text = "Confira nossa retrospectiva de conversas no WhatsApp!"

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
          description: "O link do seu WhatsWrapped foi compartilhado com sucesso",
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
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link copiado!",
          description: "O link do seu WhatsWrapped foi copiado para a área de transferência",
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
          <div className="flex flex-col gap-4">
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            <Button variant="outline" asChild>
              <Link href="/">Voltar para o início</Link>
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
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Compartilhar
              </Button>
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
