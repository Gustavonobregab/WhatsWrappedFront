import { NextResponse } from "next/server"
import { API_ENDPOINTS, type PaymentRequest, type PaymentResponse } from "@/lib/api-config"

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

    const data: PaymentResponse = await response.json()

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
