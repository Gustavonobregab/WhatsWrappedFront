import { NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID do pagamento não fornecido" }, { status: 400 })
    }

    // Enviar requisição para a API externa
    const response = await fetch(`${API_ENDPOINTS.PAYMENT_CHECK}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Obter o texto da resposta
    const responseText = await response.text()
    console.log("Resposta da verificação de pagamento (texto):", responseText)

    // Tentar converter para JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Erro ao parsear resposta de verificação de pagamento:", e)
      return NextResponse.json(
        { success: false, error: "Erro ao processar resposta da API de verificação", rawResponse: responseText },
        { status: 500 },
      )
    }

    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Erro ao verificar status do pagamento" },
        { status: response.status },
      )
    }

    // Retornar a resposta de sucesso
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno ao verificar status do pagamento" },
      { status: 500 },
    )
  }
}
