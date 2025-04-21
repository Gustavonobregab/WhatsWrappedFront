import { type NextRequest, NextResponse } from "next/server"
import { processWhatsAppFile } from "@/lib/process-whatsapp"

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

    // Processar o arquivo do WhatsApp
    const metricsData = await processWhatsAppFile(file)

    // Retornar os dados processados
    return NextResponse.json({
      success: true,
      message: "Arquivo processado com sucesso!",
      metrics: {
        participants: metricsData,
        id: generateUniqueId(),
      },
    })
  } catch (error: any) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno ao processar o upload" },
      { status: 500 },
    )
  }
}

// Função para gerar um ID único
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}
