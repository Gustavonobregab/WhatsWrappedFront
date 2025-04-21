// Configuração da API
export const API_BASE_URL = "https://chat-metrics-api.onrender.com"

// Endpoints
export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  PAYMENT_PIX: `${API_BASE_URL}/api/v1/payment/pix`,
  PAYMENT_CHECK: `${API_BASE_URL}/api/v1/payment/pixQrCode/check`,
}

// Tipos de resposta
export interface RegisterResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    id: string
    name: string
    email: string
    phone: string
    cpf: string
  }
}

export interface PaymentResponse {
  success: boolean
  error?: string
  data?: {
    pixCode: string
    pixQrCode: string
    expiresAt: string
    status: PaymentStatus
    paymentId: string
  }
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

// Tipos de requisição
export interface RegisterRequest {
  name: string
  email: string
  phone: string
  cpf: string
}

export interface PaymentRequest {
  name: string
  email: string
  cellphone: string
  cpf: string
}
