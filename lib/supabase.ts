import { createClient } from "@supabase/supabase-js"

// Essas variáveis de ambiente devem ser definidas no seu arquivo .env.local
// e no painel de configuração do Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Criar um cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do Supabase
export type MetricsData = {
  id?: string
  email: string
  data: any
  created_at?: string
  expires_at?: string
  share_id?: string
}

// Função para salvar métricas e gerar ID de compartilhamento
export async function saveMetricsWithShareId(
  email: string,
  data: any,
): Promise<{ success: boolean; shareId?: string; error?: string }> {
  try {
    // Gerar um ID de compartilhamento único
    const shareId = generateShareId()

    // Calcular data de expiração (30 dias a partir de agora)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Verificar se já existe um registro para este email
    const { data: existingData, error: fetchError } = await supabase
      .from("metrics")
      .select("id, share_id")
      .eq("email", email)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Erro ao verificar métricas existentes:", fetchError)
      return { success: false, error: "Erro ao verificar dados existentes" }
    }

    let result

    if (existingData?.id) {
      // Atualizar registro existente
      result = await supabase
        .from("metrics")
        .update({
          data: data,
          expires_at: expiresAt.toISOString(),
          share_id: existingData.share_id || shareId, // Manter o share_id existente ou usar o novo
        })
        .eq("id", existingData.id)

      return {
        success: true,
        shareId: existingData.share_id || shareId,
      }
    } else {
      // Inserir novo registro
      result = await supabase.from("metrics").insert({
        email: email,
        data: data,
        expires_at: expiresAt.toISOString(),
        share_id: shareId,
      })

      if (result.error) {
        console.error("Erro ao salvar métricas:", result.error)
        return { success: false, error: result.error.message }
      }

      return { success: true, shareId }
    }
  } catch (error) {
    console.error("Erro ao salvar métricas:", error)
    return { success: false, error: "Erro interno ao salvar métricas" }
  }
}

// Função para obter métricas por ID de compartilhamento
export async function getMetricsByShareId(shareId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabase.from("metrics").select("data").eq("share_id", shareId).single()

    if (error) {
      console.error("Erro ao obter métricas por share_id:", error)
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: false, error: "Dados não encontrados" }
    }

    return { success: true, data: data.data }
  } catch (error) {
    console.error("Erro ao obter métricas por share_id:", error)
    return { success: false, error: "Erro interno ao obter métricas" }
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

// Função para excluir métricas
export async function deleteMetrics(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("metrics").delete().eq("email", email)

    if (error) {
      console.error("Erro ao excluir métricas:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir métricas:", error)
    return { success: false, error: "Erro interno ao excluir métricas" }
  }
}

// Função para limpar métricas expiradas (pode ser executada por um cron job)
export async function cleanupExpiredMetrics(): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString()
    const { error } = await supabase.from("metrics").delete().lt("expires_at", now)

    if (error) {
      console.error("Erro ao limpar métricas expiradas:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao limpar métricas expiradas:", error)
    return { success: false, error: "Erro interno ao limpar métricas expiradas" }
  }
}
