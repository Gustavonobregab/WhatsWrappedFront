import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function POST(request: Request) {
  try {
    // Obter o FormData da requisição
    const formData = await request.formData()

    // Verificar se o arquivo foi enviado
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ success: false, error: "Arquivo não fornecido" }, { status: 400 })
    }

    // Criar um novo FormData para enviar para a API externa
    const apiFormData = new FormData()
    apiFormData.append("file", file)

    // Enviar o arquivo para a API externa
    console.log("Enviando arquivo para API externa")
    const response = await fetch(`${API_BASE_URL}/api/v1/metrics/upload`, {
      method: "POST",
      body: apiFormData,
    })

    // Obter o texto da resposta
    const responseText = await response.text()
    console.log("Resposta da API de upload (primeiros 100 caracteres):", responseText.substring(0, 100))

    // Tentar converter para JSON
    let data
    try {
      data = JSON.parse(responseText)
      console.log("Dados processados da API:", data)
    } catch (e) {
      console.error("Erro ao parsear resposta de upload:", e)
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao processar resposta da API de upload",
          rawResponse: responseText.substring(0, 500),
        },
        { status: 500 },
      )
    }

    // Se a resposta não for bem-sucedida, retornar o erro
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data?.error || "Erro ao processar o arquivo", details: data },
        { status: response.status },
      )
    }

    // Verificar se a resposta é um array
    if (!Array.isArray(data)) {
      console.error("Resposta da API não é um array:", data)
      return NextResponse.json(
        { success: false, error: "Formato de resposta inválido da API", details: data },
        { status: 500 },
      )
    }

    // Retornar os dados de métricas
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao processar o upload" }, { status: 500 })
  }
}
