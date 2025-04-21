"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
// Importar a função getPersonalizedMockData
import { MOCK_METRICS_DATA, getPersonalizedMockData } from "@/lib/mock-data"
// Adicionar o componente ShareButton
import { ShareButton } from "@/components/share-button"

export default function UserWrappedPage({ params }: { params: { email: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [shareId, setShareId] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const email = decodeURIComponent(params.email)

  // Manter a maior parte do código, mas ajustar a lógica para usar o email como identificador único

  // Modificar a função useEffect para usar o email como identificador
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
          console.warn("Dados inválidos na sessão, usando dados mockados")
          setMetricsData(MOCK_METRICS_DATA)
        }
      } else {
        // Se não for o usuário atual ou não houver dados na sessão,
        // usar dados mockados mas personalizar com o email
        console.warn("Usando dados mockados personalizados para o email:", decodedEmail)

        // Substituir a parte onde personalizamos os dados mockados
        // Substituir:
        // Criar uma cópia dos dados mockados e personalizar com o email
        // const customData = [...MOCK_METRICS_DATA];

        // // Extrair o nome do usuário do email (parte antes do @)
        // const userName = decodedEmail.split('@')[0];
        // // Capitalizar a primeira letra
        // const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);

        // // Personalizar o primeiro usuário com o nome extraído do email
        // if (customData.length > 0) {
        //   customData[0].sender = capitalizedName;
        // }

        // Por:
        const customData = getPersonalizedMockData(decodedEmail)

        setMetricsData(customData)
      }

      // Definir a URL de compartilhamento como a URL atual
      setShareUrl(window.location.href)
    } catch (error) {
      console.error("Erro ao carregar dados de métricas:", error)
      setMetricsData(MOCK_METRICS_DATA)
    } finally {
      // Simular um tempo de carregamento para melhor UX
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [params.email])

  const handleShare = async () => {
    // Se temos um ID de compartilhamento, usar a URL de compartilhamento
    const url = shareId ? shareUrl : window.location.href
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
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)

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
          {/* Substituir o botão de compartilhamento pelo componente ShareButton */}
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

          {shareId && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">Link para compartilhar:</h3>
              <div className="flex items-center gap-2">
                <input type="text" value={shareUrl} readOnly className="flex-1 p-2 text-sm border rounded-md" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(shareUrl)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Este link permite que qualquer pessoa veja sua retrospectiva sem precisar fazer login.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-xl text-muted-foreground mb-6">
              Gostou do seu WhatsWrapped? Compartilhe com seus amigos!
            </p>
            <div className="flex justify-center gap-4">
              {/* E também substituir o botão de compartilhamento na parte inferior */}
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
