import { NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/api-config"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar os dados recebidos
    if (!body.name || !body.email || !body.phone || !body.cpf) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    console.log("Enviando para API externa:", body)

    // Enviar requisição para a API externa
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Obter o texto da resposta
    const responseText = await response.text()
    console.log("Resposta da API (texto):", responseText)

    // Tentar converter para JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Erro ao parsear resposta:", e)
      return NextResponse.json(
        { success: false, error: "Erro ao processar resposta da API", rawResponse: responseText },
        { status: 500 },
      )
    }

    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      // Verificar se é um erro de usuário já existente
      if (
        response.status === 409 ||
        (data.error &&
          (data.error.includes("já cadastrado") ||
            data.error.includes("already exists") ||
            data.error.includes("Email já cadastrado") ||
            data.error.includes("CPF já cadastrado")))
      ) {
        return NextResponse.json(
          { success: false, error: data.error || "Usuário já cadastrado com este email ou CPF" },
          { status: 409 },
        )
      }

      return NextResponse.json(
        { success: false, error: data.error || "Erro ao registrar usuário", details: data },
        { status: response.status },
      )
    }

    // Retornar a resposta de sucesso
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar registro:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno ao processar o registro", details: String(error) },
      { status: 500 },
    )
  }
}
