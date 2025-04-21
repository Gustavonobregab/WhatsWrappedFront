"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { generatePixPayment, checkPaymentStatus, type PaymentStatus, type PaymentRequest } from "@/lib/api"

export default function PagamentoPage() {
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentId, setPaymentId] = useState("")
  const [error, setError] = useState("")
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const [metricsId, setMetricsId] = useState<string | null>(null)
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

    // Carregar ID das métricas
    const metricsId = sessionStorage.getItem("metricsId")
    if (metricsId) {
      setMetricsId(metricsId)
    }

    const fetchPaymentData = async () => {
      try {
        // Preparar dados para pagamento
        const paymentRequest: PaymentRequest = {
          name: userData.name,
          email: userData.email,
          cpf: userData.cpf || "",
        }

        // Gerar pagamento PIX
        const response = await generatePixPayment(paymentRequest)
        console.log("Pagamento PIX gerado:", response)

        if (response.success && response.data) {
          setPaymentData(response)
          setPaymentId(response.data.paymentId)

          // Salvar dados do pagamento na sessão
          sessionStorage.setItem("paymentData", JSON.stringify(response))
        } else {
          throw new Error("Falha ao gerar pagamento PIX")
        }
      } catch (error: any) {
        console.error("Erro ao gerar pagamento:", error)
        setError(error.message || "Erro ao gerar pagamento PIX")

        // Usar dados mockados como fallback
        toast({
          title: "Erro ao gerar pagamento",
          description: "Usando modo de demonstração para continuar.",
        })
      }
    }

    fetchPaymentData()
  }, [router])

  useEffect(() => {
    if (!paymentId || paymentStatus !== "PENDING") return

    const checkPaymentStatusFn = async () => {
      try {
        setIsVerifying(true)
        setCheckCount((prev) => prev + 1)

        console.log("Verificando status do pagamento para ID:", paymentId)

        // Usar a rota correta para verificar o status do pagamento
        const result = await checkPaymentStatus(paymentId)
        console.log("Resposta da verificação de pagamento:", result)

        if (result.data && result.data.status) {
          const newStatus = result.data.status
          setPaymentStatus(newStatus)
          console.log("Status do pagamento atualizado para:", newStatus)

          // Só processar o pagamento se o status for "PAID"
          if (newStatus === "PAID") {
            console.log("Pagamento confirmado! Processando...")
            await processPayment()
          } else {
            console.log("Pagamento ainda não confirmado. Status atual:", newStatus)
          }
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error)
      } finally {
        setIsVerifying(false)
      }
    }

    // Verificar imediatamente
    checkPaymentStatusFn()

    // Configurar intervalo para verificação periódica (a cada 5 segundos)
    const interval = setInterval(checkPaymentStatusFn, 5000)

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(interval)
  }, [paymentId, paymentStatus])

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

      // Notificar o backend sobre o pagamento confirmado
      const response = await fetch("/api/v1/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          metricsId: metricsId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao confirmar pagamento")
      }

      const result = await response.json()
      console.log("Confirmação de pagamento:", result)

      // Salvar o permalink na sessão
      if (result.permalink) {
        sessionStorage.setItem("permalink", result.permalink)
      }

      toast({
        title: "Pagamento confirmado!",
        description: "Seu WhatsWrapped está sendo gerado...",
      })

      // Redirecionar para a página de resultados após um breve delay
      setTimeout(() => {
        if (result.permalink) {
          router.push(result.permalink)
        } else {
          router.push(`/wrapped/${encodeURIComponent(userData.email)}`)
        }
      }, 2000)
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error)
      setError(error.message || "Erro ao processar seu pagamento. Por favor, tente novamente.")

      // Fallback para redirecionamento simples
      setTimeout(() => {
        router.push(`/wrapped/${encodeURIComponent(userData.email)}`)
      }, 2000)
    } finally {
      setIsProcessingFile(false)
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

  const skipToResults = () => {
    if (userData && userData.email) {
      // Não fazer chamada à API de confirmação de pagamento
      // Ir diretamente para a página de wrapped
      router.push(`/wrapped/${encodeURIComponent(userData.email)}`)
    }
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
      const result = await checkPaymentStatus(paymentId)
      console.log("Verificação manual do pagamento:", result)

      if (result.data && result.data.status) {
        const newStatus = result.data.status
        setPaymentStatus(newStatus)

        if (newStatus === "PAID") {
          toast({
            title: "Pagamento confirmado!",
            description: "Seu pagamento foi confirmado com sucesso.",
          })
          await processPayment()
        } else {
          toast({
            title: "Pagamento pendente",
            description: `Status atual: ${newStatus}. Por favor, complete o pagamento.`,
          })
        }
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento manualmente:", error)
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status do pagamento",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
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
          <h1 className="text-2xl font-bold">Pagamento WhatsWrapped</h1>
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
                    {paymentData.data?.pixQrCode.startsWith("data:image") ? (
                      <img
                        src={paymentData.data?.pixQrCode || "/placeholder.svg"}
                        alt="QR Code PIX"
                        className="w-72 h-72"
                      />
                    ) : (
                      <img src="/pix-payment-qr.png" alt="QR Code PIX" className="w-72 h-72" />
                    )}
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
                    onClick={skipToResults}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                  >
                    Ver meu WhatsWrapped (Pular pagamento)
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
                <p className="text-xl text-muted-foreground mb-8">Preparando seu WhatsWrapped personalizado...</p>
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
                <p>Após o pagamento, você terá acesso imediato ao seu WhatsWrapped.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>🔗</span>
                <p>Você receberá um link único para compartilhar sua retrospectiva.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
