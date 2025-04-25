"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function PagamentoPage() {
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("PENDING")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentId, setPaymentId] = useState("")
  const [error, setError] = useState("")
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Carregar dados do usuário da sessão
    const userDataStr = sessionStorage.getItem("userData")
    if (!userDataStr) {
      router.push("/comece-agora")
      return
    }

    const userData = JSON.parse(userDataStr)
    setUserData(userData)

    // Simular dados de pagamento para demonstração
    setPaymentData({
      data: {
        pixCode:
          "00020101021226890014br.gov.bcb.pix2567pix.example.com/v2/9d36b84f-c70b-478f-b95c-12345678901552040000530398654041.005802BR5925EMPRESA EXEMPLO PAGAMENTO6009SAO PAULO62070503***63044D11",
        pixQrCode: "/pix-payment-qr.png",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paymentId: "mock-payment-id-12345",
      },
    })
    setPaymentId("mock-payment-id-12345")
  }, [router])

  // Efeito para simular pagamento após muitas verificações
  useEffect(() => {
    // Após 5 verificações sem sucesso, oferecer opção de simular pagamento
    if (checkCount >= 5 && paymentStatus === "PENDING") {
      toast({
        title: "Dica",
        description: "Está demorando? Você pode simular o pagamento para testar o sistema.",
      })
    }
  }, [checkCount, paymentStatus])

  const processPayment = async () => {
    try {
      setIsProcessingFile(true)

      if (!userData || !userData.email) {
        throw new Error("Dados do usuário não encontrados")
      }

      // Obter os dados de métricas da sessão
      const metricsDataStr = sessionStorage.getItem("metricsData")
      if (!metricsDataStr) {
        throw new Error("Dados de métricas não encontrados")
      }

      const metricsData = JSON.parse(metricsDataStr)
      const loveMessage = sessionStorage.getItem("loveMessage")

      // Confirmar o pagamento na API
      // Simular confirmação de pagamento localmente
      console.log("Simulando confirmação de pagamento para:", userData.email, paymentId)

      // Salvar a retrospectiva permanentemente usando o email como identificador
      const encodedEmail = encodeURIComponent(userData.email)
      const saveResponse = await fetch(`/api/v1/metrics/retrospective/${encodedEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          participants: metricsData,
          loveMessage: loveMessage || undefined,
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({ error: "Erro desconhecido" }))
        throw new Error(errorData.error || "Erro ao salvar retrospectiva")
      }

      toast({
        title: "Pagamento confirmado!",
        description: "Sua retrospectiva foi salva com sucesso!",
      })

      // Redirecionar para a página permanente da retrospectiva usando o email
      setTimeout(() => {
        const encodedEmail = encodeURIComponent(userData.email)
        router.push(`/retrospectiva/${encodedEmail}`)
      }, 2000)
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error)
      setError(error.message || "Erro ao processar seu pagamento. Por favor, tente novamente.")

      // Fallback para redirecionamento simples
      setTimeout(() => {
        if (userData && userData.email) {
          const encodedEmail = encodeURIComponent(userData.email)
          router.push(`/retrospectiva/${encodedEmail}`)
        } else {
          router.push("/")
        }
      }, 2000)
    } finally {
      setIsProcessingFile(false)
    }
  }

  const skipToResults = () => {
    if (userData && userData.email) {
      // Salvar a retrospectiva com dados de exemplo e redirecionar
      saveRetrospectiveAndRedirect()
    } else {
      // Fallback: ir para a página inicial
      router.push("/")
    }
  }

  const saveRetrospectiveAndRedirect = async () => {
    try {
      // Obter dados de métricas da sessão ou usar dados de exemplo
      let metricsData
      const metricsDataStr = sessionStorage.getItem("metricsData")

      if (metricsDataStr) {
        metricsData = JSON.parse(metricsDataStr)
      } else {
        // Usar dados de exemplo
        const { getPersonalizedMockData } = await import("@/lib/mock-data")
        metricsData = getPersonalizedMockData(userData.name || userData.email)
      }

      const loveMessage = sessionStorage.getItem("loveMessage")

      // Salvar a retrospectiva usando o email como identificador
      const encodedEmail = encodeURIComponent(userData.email)
      await fetch(`/api/v1/metrics/retrospective/${encodedEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          participants: metricsData,
          loveMessage: loveMessage || undefined,
          isMock: true, // Indicar que são dados de exemplo
        }),
      })

      // Redirecionar para a página permanente usando o email
      router.push(`/retrospectiva/${encodedEmail}`)
    } catch (error) {
      console.error("Erro ao salvar retrospectiva:", error)
      // Fallback
      router.push("/")
    }
  }

  const copyPixCode = () => {
    if (paymentData?.data?.pixCode) {
      navigator.clipboard.writeText(paymentData.data.pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)

      toast({
        title: "Código PIX copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      })
    }
  }

  const simulatePayment = () => {
    setIsVerifying(true)
    toast({
      title: "Simulando pagamento",
      description: "Estamos simulando o pagamento para fins de teste...",
    })

    setTimeout(() => {
      setPaymentStatus("PAID")
      setIsVerifying(false)
      processPayment()
    }, 2000)
  }

  const checkPaymentManually = async () => {
    if (!paymentId) {
      toast({
        title: "Erro",
        description: "ID do pagamento não encontrado",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    toast({
      title: "Verificando pagamento",
      description: "Estamos verificando o status do seu pagamento...",
    })

    try {
      // Verificar o status do pagamento usando a rota correta
      const response = await fetch(`/api/v1/payment/status/${paymentId}`)

      if (!response.ok) {
        throw new Error("Erro ao verificar status do pagamento")
      }

      const statusData = await response.json()
      console.log("Status do pagamento:", statusData)

      setIsVerifying(false)

      if (statusData.data && statusData.data.status === "PAID") {
        setPaymentStatus("PAID")
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi confirmado com sucesso.",
        })
        processPayment()
      } else {
        setCheckCount((prev) => prev + 1)
        toast({
          title: "Pagamento pendente",
          description: "Por favor, complete o pagamento.",
        })

        // Após 3 verificações, oferecer opção de simular pagamento
        if (checkCount >= 2) {
          toast({
            title: "Dica",
            description: "Está demorando? Você pode simular o pagamento para testar o sistema.",
          })
        }
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error)
      setIsVerifying(false)
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status do pagamento",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Erro</h2>
          <p className="mb-6">{error}</p>
          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/comece-agora">Tentar novamente</Link>
            </Button>
            <Button variant="outline" onClick={skipToResults}>
              Pular para resultados (usar dados de exemplo)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background">
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/comece-agora">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Pagamento ZapLove</h1>
        </div>

        <div className="max-w-md mx-auto">
          {/* Barra de progresso */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-full h-2 rounded-full ${
                    i <= 2 ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary">Cadastro e Upload</span>
              <span className="text-primary">Pagamento</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            {paymentStatus === "PENDING" ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-3">Escaneie o QR Code para pagar</h2>
                  <p className="text-lg text-muted-foreground">
                    Valor: <span className="font-bold">R$ 19,90</span>
                  </p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="bg-white p-4 border-2 border-primary/20 rounded-lg shadow-lg">
                    <img src="/pix-payment-qr.png" alt="QR Code PIX" className="w-72 h-72" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Código PIX</span>
                      <Button variant="ghost" size="sm" onClick={copyPixCode} className="h-8 px-2">
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground break-all">{paymentData.data?.pixCode}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Expira em:</span>{" "}
                      {paymentData.data?.expiresAt ? new Date(paymentData.data.expiresAt).toLocaleString() : "N/A"}
                    </p>
                  </div>

                  {isVerifying ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando pagamento...
                    </div>
                  ) : (
                    <Button onClick={checkPaymentManually} variant="outline" className="w-full">
                      Já paguei, verificar pagamento
                    </Button>
                  )}
                </div>

                {/* Botões para testes */}
                <div className="mt-8 space-y-4">
                  <Button
                    onClick={simulatePayment}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                  >
                    Simular Pagamento (Para Testes)
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-6">
                    <Check className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">Pagamento confirmado!</h2>
                <p className="text-xl text-muted-foreground mb-8">Preparando sua retrospectiva personalizada...</p>
                <div className="flex justify-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/80 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="text-base font-medium">Informações</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span>🔒</span>
                <p>Pagamento seguro via PIX.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>⚡</span>
                <p>Após o pagamento, você terá acesso imediato à sua retrospectiva.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>🔗</span>
                <p>
                  Você receberá um link único e permanente para acessar e compartilhar sua retrospectiva a qualquer
                  momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
