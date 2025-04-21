import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug não fornecido" }, { status: 400 })
    }

    // Fazer requisição para a API externa
    const response = await fetch(`https://chat-metrics-api.onrender.com/api/v1/metrics/permalink/${slug}`)

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { success: false, message: errorData.message || "Erro ao buscar dados" },
        { status: response.status },
      )
    }

    const result = await response.json()

    // Verificar se temos os dados dos participantes
    if (!result.participants || !Array.isArray(result.participants)) {
      return NextResponse.json({ success: false, message: "Formato de dados inválido" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.participants,
    })
  } catch (error: any) {
    console.error("Erro ao buscar dados pelo permalink:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno ao buscar dados" },
      { status: 500 },
    )
  }
}
