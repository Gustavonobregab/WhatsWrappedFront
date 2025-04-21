import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "ID não fornecido" }, { status: 400 })
    }

    // Buscar dados da API externa usando o endpoint fornecido
    try {
      const response = await fetch(`https://chat-metrics-api.onrender.com/api/v1/metrics/retrospective/${id}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
        console.error("Erro ao buscar da API externa:", errorData)
        return NextResponse.json(
          { success: false, error: errorData.error || "Retrospectiva não encontrada" },
          { status: response.status },
        )
      }

      const data = await response.json()

      return NextResponse.json({
        success: true,
        data: data.retrospective,
      })
    } catch (error) {
      console.error("Erro ao buscar da API externa:", error)
      return NextResponse.json({ success: false, error: "Erro ao comunicar com o servidor de dados" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao obter retrospectiva:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao obter dados" }, { status: 500 })
  }
}

// Endpoint para salvar uma nova retrospectiva (usado após o pagamento)
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.id || !data.email || !data.participants) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados incompletos",
        },
        { status: 400 },
      )
    }

    // Enviar para a API externa para armazenamento permanente
    try {
      const response = await fetch("https://chat-metrics-api.onrender.com/api/v1/metrics/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          email: data.email,
          participants: data.participants,
          loveMessage: data.loveMessage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
        return NextResponse.json(
          { success: false, error: errorData.error || "Erro ao salvar retrospectiva" },
          { status: response.status },
        )
      }

      const responseData = await response.json()

      return NextResponse.json({
        success: true,
        id: data.id,
        data: responseData,
      })
    } catch (error) {
      console.error("Erro ao salvar na API externa:", error)
      return NextResponse.json({ success: false, error: "Erro ao comunicar com o servidor de dados" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao salvar retrospectiva:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao salvar dados" }, { status: 500 })
  }
}
