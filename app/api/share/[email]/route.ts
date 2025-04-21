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
    const response = await fetch(`https://chat-metrics-api.onrender.com/api/v1/metrics/user/${decodedEmail}`)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Dados não disponíveis. Apenas o proprietário pode ver esta retrospectiva após fazer upload do arquivo.",
        },
        { status: 404 },
      )
    }

    const result = await response.json()

    // Retornar os dados do usuário
    return NextResponse.json({
      success: true,
      data: result.metrics.participants,
    })
  } catch (error) {
    console.error("Erro ao obter dados compartilhados:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao obter dados" }, { status: 500 })
  }
}
