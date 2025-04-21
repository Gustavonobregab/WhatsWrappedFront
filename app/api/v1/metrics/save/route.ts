import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar os dados recebidos
    if (!body.email || !body.data) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    // Gerar um ID de compartilhamento aleatório
    const shareId = generateShareId()

    // Retornar o ID de compartilhamento
    return NextResponse.json({
      success: true,
      shareId: shareId,
    })
  } catch (error) {
    console.error("Erro ao salvar métricas:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao salvar métricas" }, { status: 500 })
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
