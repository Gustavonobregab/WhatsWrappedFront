import { NextResponse } from "next/server"

// Compartilhar o mesmo armazenamento de dados em memória
const metricsDataStore: Record<string, any> = {}

// Dados de exemplo para fallback
const exampleData = [
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

// Esta rota recupera os dados de métricas para um email específico
export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const email = params.email

    if (!email) {
      return NextResponse.json({ success: false, error: "Email não fornecido" }, { status: 400 })
    }

    // Verificar se temos dados para este email no armazenamento em memória
    const metricsData = metricsDataStore[email]

    if (!metricsData) {
      // Se não encontrarmos dados para este email, usamos os dados de exemplo
      console.log(`Dados não encontrados para o email ${email}, usando dados de exemplo`)

      // Armazenar os dados de exemplo para este email
      metricsDataStore[email] = exampleData

      return NextResponse.json({
        success: true,
        email: email,
        data: exampleData,
        note: "Usando dados de exemplo pois não foram encontrados dados processados",
      })
    }

    return NextResponse.json({
      success: true,
      email: email,
      data: metricsData,
    })
  } catch (error) {
    console.error("Erro ao recuperar métricas:", error)
    return NextResponse.json({ success: false, error: "Erro ao recuperar métricas" }, { status: 500 })
  }
}
