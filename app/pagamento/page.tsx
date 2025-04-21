"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { generatePixPayment, checkPaymentStatus, type PaymentStatus, type PaymentRequest } from "@/lib/api"
import { MOCK_METRICS_DATA } from "@/lib/mock-data"

export default function PagamentoPage() {
  const [copied, setCopied] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentId, setPaymentId] = useState("")
  const [error, setError] = useState("")
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // Verificar se temos os dados do usuário
        const userDataStr = sessionStorage.getItem("userData")
        if (!userDataStr) {
          router.push("/dados-pessoais")
          return
        }

        const userData = JSON.parse(userDataStr)

        // Preparar dados para pagamento
        const paymentRequest: PaymentRequest = {
          name: userData.name,
          email: userData.email,
          cellphone: userData.cellphone || "",
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

        const result = await checkPaymentStatus(paymentId)
        console.log("Resposta da verificação de pagamento:", result)

        if (result.data && result.data.status) {
          setPaymentStatus(result.data.status)

          if (result.data.status === "PAID") {
            await processFile()
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

    // Configurar intervalo para verificação periódica
    const interval = setInterval(checkPaymentStatusFn, 10000)

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

  const processFile = async () => {
    try {
      setIsProcessingFile(true)

      const userDataStr = sessionStorage.getItem("userData")
      const metricsDataStr = sessionStorage.getItem("metricsData")

      if (!userDataStr) {
        throw new Error("Dados do usuário não encontrados")
      }

      const userData = JSON.parse(userDataStr)
      const email = userData.email

      if (!email) {
        throw new Error("Email do usuário não encontrado")
      }

      // Verificar se temos dados de métricas
      if (!metricsDataStr) {
        console.warn("Dados de métricas não encontrados, usando dados mockados")
        sessionStorage.setItem("metricsData", JSON.stringify(MOCK_METRICS_DATA))
      } else {
        console.log("Dados de métricas encontrados:", JSON.parse(metricsDataStr))
      }

      toast({
        title: "Pagamento confirmado!",
        description: "Seu WhatsWrapped está sendo gerado...",
      })

      // Redirecionar para a página de resultados após um breve delay
      setTimeout(() => {
        router.push(`/wrapped/${encodeURIComponent(email)}`)
      }, 2000)
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error)
      setError(error.message || "Erro ao processar seu arquivo. Por favor, tente novamente.")

      // Usar dados de exemplo como fallback
      const userDataStr = sessionStorage.getItem("userData")
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr)
          const email = userData.email

          // Usar dados mockados
          sessionStorage.setItem("metricsData", JSON.stringify(MOCK_METRICS_DATA))

          toast({
            title: "Continuando com dados de exemplo",
            description: "Estamos usando dados de exemplo para mostrar como funciona o WhatsWrapped.",
          })

          setTimeout(() => {
            router.push(`/wrapped/${encodeURIComponent(email)}`)
          }, 2000)
        } catch (e) {
          console.error("Erro ao processar dados do usuário:", e)
        }
      }
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
      processFile()
    }, 2000)
  }

  const skipToResults = () => {
    const userDataStr = sessionStorage.getItem("userData")
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        const email = userData.email

        // Usar dados mockados
        sessionStorage.setItem("metricsData", JSON.stringify(MOCK_METRICS_DATA))

        if (email) {
          router.push(`/wrapped/${encodeURIComponent(email)}`)
        }
      } catch (e) {
        console.error("Erro ao processar dados do usuário:", e)
      }
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
            <Link href="/dados-pessoais">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Pagamento WhatsWrapped</h1>
        </div>

        <div className="max-w-md mx-auto">
          {/* Barra de progresso */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary">Exportar</span>
              <span className="text-primary">Upload</span>
              <span className="text-primary">Dados</span>
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

                  {isVerifying && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando pagamento...
                    </div>
                  )}
                </div>

                {/* Botões para testes */}
                <div className="mt-8 space-y-4">
                  <Button
                    onClick={simulatePayment}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                    disabled={isVerifying}
                  >
                    Simular Pagamento (Apenas para testes)
                  </Button>

                  <Button variant="outline" onClick={skipToResults} className="w-full text-lg py-6">
                    Pular para resultados (usar dados de exemplo)
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
