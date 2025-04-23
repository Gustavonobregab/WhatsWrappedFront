// Configuração da API
export const API_BASE_URL = "https://chat-metrics-api.onrender.com"

// Endpoints
export const API_ENDPOINTS = {
  PAYMENT_PIX: `${API_BASE_URL}/api/v1/payment/pix`,
  METRICS_UPLOAD: `${API_BASE_URL}/api/v1/metrics/upload`,
  METRICS_RETROSPECTIVE: (email: string) => `${API_BASE_URL}/api/v1/metrics/retrospective/${encodeURIComponent(email)}`,
  PAYMENT_STATUS: (paymentId: string) => `${API_BASE_URL}/api/v1/payment/status/${paymentId}`,
}

// Tipos para as respostas da API
export interface RegisterResponse {
  user: {
    id: string
    name: string
    email: string
    phone: string
    cpf: string
    hasPaid: boolean
  }
  token: string
}

export interface PaymentResponse {
  success: boolean
  data?: {
    pixCode: string
    pixQrCode: string
    expiresAt: string
    status: PaymentStatus
    paymentId: string
  }
  error?: string
}

export interface PaymentStatusResponse {
  data: {
    id: string
    status: PaymentStatus
    expiresAt: string
  }
  error?: string
}

export type PaymentStatus = "PENDING" | "EXPIRED" | "CANCELLED" | "PAID" | "REFUNDED"

// Tipos para as requisições
export interface PaymentRequest {
  name: string
  email: string
  cpf: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  cpf: string
}

// Função para gerar pagamento PIX
export async function generatePixPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  const response = await fetch(API_ENDPOINTS.PAYMENT_PIX, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Erro ao gerar pagamento PIX")
  }

  return await response.json()
}

// Função para verificar status do pagamento
export async function checkPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  const response = await fetch(API_ENDPOINTS.PAYMENT_STATUS(paymentId), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Erro ao verificar status do pagamento")
  }

  return await response.json()
}

// Função para fazer upload do arquivo e obter métricas
export async function uploadFileAndGetMetrics(formData: FormData): Promise<any> {
  try {
    console.log("Enviando arquivo para processamento")

    // Fazer a requisição para a API
    const response = await fetch(API_ENDPOINTS.METRICS_UPLOAD, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da API:", response.status, errorText)
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.error || `Erro ao processar o arquivo: ${response.status}`)
      } catch (e) {
        throw new Error(`Erro ao processar o arquivo: ${response.status} - ${errorText.substring(0, 100)}`)
      }
    }

    // Obter o texto da resposta
    const responseText = await response.text()
    console.log("Resposta da API (primeiros 100 caracteres):", responseText.substring(0, 100))

    try {
      // Tentar converter para JSON
      const data = JSON.parse(responseText)
      console.log("Dados processados da API:", data)
      return data
    } catch (e) {
      console.error("Erro ao parsear resposta JSON:", e)
      throw new Error("Erro ao processar resposta da API")
    }
  } catch (error: any) {
    console.error("Erro ao fazer upload do arquivo:", error)
    throw error
  }
}
