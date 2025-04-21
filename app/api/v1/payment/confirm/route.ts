import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, metricsId, skipPayment } = body

    if (!email) {
      return NextResponse.json({ success: false, message: "Email não fornecido" }, { status: 400 })
    }

    // Gerar um slug baseado no email (para URL amigável)
    const emailSlug = generateSlugFromEmail(email)

    // Gerar um permalink único
    const permalink = `/w/${emailSlug}`

    // Aqui você faria uma chamada para seu backend para registrar o permalink
    // e associá-lo ao ID das métricas
    try {
      const apiResponse = await fetch("https://chat-metrics-api.onrender.com/api/v1/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          metricsId,
          permalink,
          skipPayment: skipPayment || false,
        }),
      })

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json()
        console.error("Erro na API externa:", errorData)
        // Continuar mesmo com erro, usando o permalink gerado localmente
      }
    } catch (error) {
      console.error("Erro ao confirmar pagamento na API externa:", error)
      // Continuar mesmo com erro, usando o permalink gerado localmente
    }

    return NextResponse.json({
      success: true,
      message: "Pagamento confirmado com sucesso",
      permalink,
    })
  } catch (error: any) {
    console.error("Erro ao confirmar pagamento:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno ao confirmar pagamento" },
      { status: 500 },
    )
  }
}

// Função para gerar um slug a partir do email
function generateSlugFromEmail(email: string): string {
  // Remover o domínio e caracteres especiais
  const username = email.split("@")[0]
  const slug = username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Substituir caracteres não alfanuméricos por hífen
    .replace(/-+/g, "-") // Substituir múltiplos hífens por um único
    .replace(/^-|-$/g, "") // Remover hífens no início e fim

  // Adicionar um identificador único para evitar colisões
  const uniqueId = Math.random().toString(36).substring(2, 8)

  return `${slug}-${uniqueId}`
}
