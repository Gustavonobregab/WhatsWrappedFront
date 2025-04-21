import { NextResponse } from "next/server"

// Criar um armazenamento de dados em memória para o servidor
// Isso evita o uso da variável global que causa problemas
const metricsDataStore: Record<string, any> = {}

// Esta é uma rota para processar o upload do arquivo e associar os dados ao email do usuário
export async function POST(request: Request) {
  try {
    // Obter os dados do formulário
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const email = formData.get("email") as string | null

    if (!email) {
      return NextResponse.json({ success: false, error: "Email não fornecido" }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ success: false, error: "Arquivo não fornecido" }, { status: 400 })
    }

    console.log(`Processando arquivo ${file.name} para o email ${email}`)

    // Criar um novo FormData para enviar para a API externa
    const apiFormData = new FormData()
    apiFormData.append("file", file)
    apiFormData.append("email", email)

    try {
      // Enviar para a API externa
      const apiResponse = await fetch("https://chat-metrics-api.onrender.com/api/v1/metrics/upload", {
        method: "POST",
        body: apiFormData,
      })

      // Verificar se a resposta foi bem-sucedida
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error("Erro na resposta da API externa:", errorText)
        return NextResponse.json(
          {
            success: false,
            error: `Erro na API externa: ${apiResponse.status} ${apiResponse.statusText}`,
            details: errorText,
          },
          { status: apiResponse.status },
        )
      }

      // Obter os dados da resposta
      const apiData = await apiResponse.json()

      // Verificar se os dados são válidos
      if (!apiData.data || apiData.data.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "A API retornou dados inválidos ou vazios",
          },
          { status: 500 },
        )
      }

      // Armazenar os dados no armazenamento em memória
      metricsDataStore[email] = apiData.data || apiData

      // Retornar os dados para o cliente
      return NextResponse.json({
        success: true,
        email: email,
        data: apiData.data || apiData,
      })
    } catch (apiError) {
      console.error("Erro ao chamar API externa:", apiError)

      // Retornar erro em vez de usar dados de exemplo
      return NextResponse.json(
        {
          success: false,
          error: `Erro ao processar o arquivo: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Erro ao processar o arquivo: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
