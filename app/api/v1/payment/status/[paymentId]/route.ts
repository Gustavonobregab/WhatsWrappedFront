import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    const paymentId = params.paymentId

    console.log(`Verificando status do pagamento: ${paymentId}`)

    // Fazer a requisição para a API externa
    const response = await fetch(`https://chat-metrics-api.onrender.com/api/v1/payment/status/${paymentId}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Erro ao verificar status do pagamento: ${response.status}`, errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Erro ao verificar status do pagamento: ${response.status}`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Status do pagamento:", data)

    return NextResponse.json(data)
  } catch (error: any) {
    console.error(`Erro ao processar requisição:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao verificar status do pagamento",
      },
      { status: 500 },
    )
  }
}
