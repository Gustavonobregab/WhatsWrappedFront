"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { StoriesCarousel } from "@/components/stories-carousel"
import { ShareButton } from "@/components/share-button"
import { toast } from "@/components/ui/use-toast"
import { useTranslations } from 'next-intl';
import { useLocaleLink } from '@/hooks/use-locale-link';

export default function RetrospectivaPorEmailPage({ params }: { params: { email: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<any[]>([])
  const [loveMessage, setLoveMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isBrowser, setIsBrowser] = useState<boolean>(false)
  
  const t = useTranslations();
  const { createLink } = useLocaleLink();

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

        toast({
          title: "Retrospectiva carregada",
          description: "Sua retrospectiva foi carregada com sucesso!",
        })
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
  }, [email, isBrowser])

  if (error && metricsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-600/20 to-background flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Erro</h2>
          <p className="mb-6">{error}</p>
          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href={createLink('/')}>{t('retrospective.buttons.backToHome')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={createLink('/comece-agora')}>{t('retrospective.buttons.createNew')}</Link>
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
      return `ZapLove ${senders.join(" e ")}`
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
              text={t('retrospective.share.text')}
              variant="outline"
              size="sm"
            />
          )}
        </div>

        <div className="max-w-md mx-auto">
          {isLoading ? (
            <div className="aspect-[9/16] rounded-xl bg-card flex flex-col items-center justify-center">
              <Loader2 className="w-20 h-20 text-primary animate-spin mb-6" />
              <p className="text-2xl font-medium">{t('retrospective.loading')}</p>
            </div>
          ) : (
            <>
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-2xl max-w-[320px] md:max-w-[340px] lg:max-w-[360px] xl:max-w-[380px] mx-auto">
                <StoriesCarousel metricsData={metricsData} loveMessage={loveMessage} />
              </div>
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
            <div className="flex justify-center gap-4">
              {isBrowser && (
                <ShareButton
                  url={window.location.href}
                  title={getPageTitle()}
                  text={t('retrospective.share.text')}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                  variant="default"
                  size="lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-12 text-center text-muted-foreground text-sm pb-8">
        <p>
          {t('retrospective.footer.help')}{" "}
          <a
            href="https://wa.me/5583999359977"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t('retrospective.footer.contact')}
          </a>
        </p>
      </footer>
    </div>
  )
}
