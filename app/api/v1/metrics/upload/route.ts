import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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
    apiFormData.append("file", file)

    // Enviar para a API externa
    console.log("Enviando dados para API externa:", {
      name,
      email,
      cpf,
      text,
      file: `${file.name} (${file.size} bytes)`,
    })

    const response = await fetch("https://chat-metrics-api.onrender.com/api/v1/metrics/upload", {
      method: "POST",
      body: apiFormData,
    })

    // Verificar resposta
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da API:", response.status, errorText)

      try {
        const errorData = JSON.parse(errorText)
        return NextResponse.json(
          { success: false, message: errorData.message || `Erro ao processar o arquivo: ${response.status}` },
          { status: response.status },
        )
      } catch (e) {
        return NextResponse.json(
          { success: false, message: `Erro ao processar o arquivo: ${response.status}` },
          { status: response.status },
        )
      }
    }

    // Processar resposta bem-sucedida
    const result = await response.json()
    console.log("Resposta da API externa:", result)

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
