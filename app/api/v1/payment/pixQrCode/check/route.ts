import { NextResponse } from "next/server"
import { API_ENDPOINTS, type PaymentStatusResponse } from "@/lib/api-config"

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

    const data: PaymentStatusResponse = await response.json()

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
