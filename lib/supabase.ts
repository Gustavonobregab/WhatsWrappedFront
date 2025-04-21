// Versão modificada para funcionar sem as variáveis de ambiente do Supabase
import { MOCK_METRICS_DATA } from "./mock-data"

// Função simulada para obter métricas por ID de compartilhamento
export async function getMetricsByShareId(shareId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  console.log("Usando função simulada getMetricsByShareId para:", shareId)

  // Simular um pequeno atraso para parecer uma chamada de API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Retornar dados mockados
  return {
    success: true,
    data: MOCK_METRICS_DATA,
  }
}

// Função simulada para salvar métricas e gerar ID de compartilhamento
export async function saveMetricsWithShareId(
  email: string,
  data: any,
): Promise<{ success: boolean; shareId?: string; error?: string }> {
  console.log("Usando função simulada saveMetricsWithShareId para:", email)

  // Simular um pequeno atraso para parecer uma chamada de API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Gerar um ID de compartilhamento aleatório
  const shareId = generateShareId()

  return {
    success: true,
    shareId,
  }
}

// Função para gerar um ID de compartilhamento único
function generateShareId(): string {
  // Gerar um ID aleatório de 10 caracteres
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Função simulada para excluir métricas
export async function deleteMetrics(email: string): Promise<{ success: boolean; error?: string }> {
  console.log("Usando função simulada deleteMetrics para:", email)

  // Simular um pequeno atraso para parecer uma chamada de API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

// Função simulada para limpar métricas expiradas
export async function cleanupExpiredMetrics(): Promise<{ success: boolean; error?: string }> {
  console.log("Usando função simulada cleanupExpiredMetrics")

  // Simular um pequeno atraso para parecer uma chamada de API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}
