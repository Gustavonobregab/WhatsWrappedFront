import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("Recebida requisição POST em /api/v1/payment/pix")

  try {
    // Obter os dados da requisição
    const data = await request.json()

    // Validar dados
    if (!data.name || !data.email || !data.cpf) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos. Por favor, forneça nome, email e CPF.",
        },
        { status: 400 },
      )
    }

    console.log("Dados recebidos para geração de PIX:", {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
    })

    // Enviar para a API externa
    const response = await fetch("https://chat-metrics-api.onrender.com/api/v1/payment/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        cpf: data.cpf,
      }),
    })

    // Verificar resposta
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da API de pagamento:", response.status, errorText)

      try {
        const errorData = JSON.parse(errorText)
        return NextResponse.json(
          { success: false, message: errorData.message || `Erro ao gerar pagamento PIX: ${response.status}` },
          { status: response.status },
        )
      } catch (e) {
        return NextResponse.json(
          { success: false, message: `Erro ao gerar pagamento PIX: ${response.status}` },
          { status: response.status },
        )
      }
    }

    // Processar resposta bem-sucedida
    const result = await response.json()
    console.log("Resposta da API de pagamento:", result)

    // Retornar os dados do pagamento
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Erro ao processar requisição de pagamento:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno ao gerar pagamento PIX" },
      { status: 500 },
    )
  }
}
