import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const email = params.email

    if (!email) {
      return NextResponse.json({ success: false, error: "Email não fornecido" }, { status: 400 })
    }

    // Decodificar o email
    const decodedEmail = decodeURIComponent(email)

    // Tentar buscar os dados do usuário da API externa
    try {
      const response = await fetch(`https://chat-metrics-api.onrender.com/api/v1/metrics/user/${decodedEmail}`)

      if (response.ok) {
        const result = await response.json()

        // Retornar os dados do usuário
        return NextResponse.json({
          success: true,
          data: result.metrics.participants,
        })
      }
    } catch (error) {
      console.error("Erro ao buscar da API externa:", error)
    }

    // Se chegou aqui, a API externa falhou ou não encontrou o usuário
    // Importar os dados mockados e personalizá-los com o email
    const { getPersonalizedMockData } = await import("@/lib/mock-data")
    const mockData = getPersonalizedMockData(decodedEmail)

    // Retornar os dados mockados
    return NextResponse.json({
      success: true,
      data: mockData,
      isMock: true,
    })
  } catch (error) {
    console.error("Erro ao obter dados compartilhados:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao obter dados" }, { status: 500 })
  }
}
