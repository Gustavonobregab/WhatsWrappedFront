import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("Recebida requisição POST em /api/v1/metrics/upload")

  try {
    // Obter o FormData da requisição
    const formData = await request.formData()

    // Extrair dados do usuário
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const cpf = formData.get("cpf") as string
    const text = formData.get("text") as string
    const file = formData.get("file") as File

    // Log detalhado dos dados recebidos
    console.log("Dados recebidos:", {
      name: name || "AUSENTE",
      email: email || "AUSENTE",
      cpf: cpf || "AUSENTE",
      text: text || "AUSENTE",
      file: file ? `${file.name} (${file.size} bytes)` : "AUSENTE",
    })

    // Validar dados
    if (!name || !email || !cpf || !text || !file) {
      const missingFields = []
      if (!name) missingFields.push("name")
      if (!email) missingFields.push("email")
      if (!cpf) missingFields.push("cpf")
      if (!text) missingFields.push("text")
      if (!file) missingFields.push("file")

      console.error("Campos ausentes:", missingFields)

      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos. Por favor, preencha todos os campos.",
          missingFields,
        },
        { status: 400 },
      )
    }

    // Criar um novo FormData para enviar para a API externa
    const apiFormData = new FormData()
    apiFormData.append("name", name)
    apiFormData.append("email", email)
    apiFormData.append("cpf", cpf)
    apiFormData.append("text", text)
    apiFormData.append("file", file, file.name) // Garantir que o nome do arquivo seja enviado

    // Log do FormData que está sendo enviado
    console.log("FormData sendo enviado para API externa:", {
      name,
      email,
      cpf,
      text,
      file: `${file.name} (${file.size} bytes)`,
      "Content-Type": file.type,
    })

    // Enviar para a API externa
    const response = await fetch("https://chat-metrics-api.onrender.com/api/v1/metrics/upload", {
      method: "POST",
      body: apiFormData,
    })

    // Log da resposta bruta para debug
    const responseText = await response.text()
    console.log("Resposta bruta da API externa:", responseText)

    // Verificar resposta
    if (!response.ok) {
      console.error("Erro na resposta da API:", response.status, responseText)

      try {
        const errorData = JSON.parse(responseText)
        return NextResponse.json(
          { success: false, message: errorData.message || `Erro ao processar o arquivo: ${response.status}` },
          { status: response.status },
        )
      } catch (e) {
        return NextResponse.json(
          {
            success: false,
            message: `Erro ao processar o arquivo: ${response.status} - ${responseText.substring(0, 100)}`,
          },
          { status: response.status },
        )
      }
    }

    // Processar resposta bem-sucedida
    let result
    try {
      result = JSON.parse(responseText)
      console.log("Resposta da API externa (parseada):", JSON.stringify(result, null, 2))
    } catch (e) {
      console.error("Erro ao parsear resposta JSON:", e)
      return NextResponse.json({ success: false, message: "Erro ao processar resposta da API" }, { status: 500 })
    }

    // Retornar os dados processados
    return NextResponse.json({
      success: true,
      message: "Arquivo processado com sucesso!",
      metrics: result.metrics,
    })
  } catch (error: any) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno ao processar o upload" },
      { status: 500 },
    )
  }
}
