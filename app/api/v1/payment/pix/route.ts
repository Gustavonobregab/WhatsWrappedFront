import { NextResponse } from "next/server"
import { API_ENDPOINTS, type PaymentRequest } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const body: PaymentRequest = await request.json()

    // Validar os dados recebidos
    if (!body.name || !body.email || !body.cellphone || !body.cpf) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    // Enviar requisição para a API externa
    const response = await fetch(API_ENDPOINTS.PAYMENT_PIX, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Obter o texto da resposta
    const responseText = await response.text()
    console.log("Resposta da API de pagamento (texto):", responseText)

    // Tentar converter para JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Erro ao parsear resposta de pagamento:", e)
      return NextResponse.json(
        { success: false, error: "Erro ao processar resposta da API de pagamento", rawResponse: responseText },
        { status: 500 },
      )
    }

    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Erro ao gerar pagamento" },
        { status: response.status },
      )
    }

    // Retornar a resposta de sucesso
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar pagamento:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao processar o pagamento" }, { status: 500 })
  }
}
