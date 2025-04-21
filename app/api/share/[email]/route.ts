import { NextResponse } from "next/server"

// Esta API agora retorna um erro indicando que os dados não estão disponíveis
// para usuários que não fizeram upload do arquivo
export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const email = params.email

    if (!email) {
      return NextResponse.json({ success: false, error: "Email não fornecido" }, { status: 400 })
    }

    // Decodificar o email
    const decodedEmail = decodeURIComponent(email)

    // Retornar erro indicando que os dados não estão disponíveis
    return NextResponse.json(
      {
        success: false,
        error: "Dados não disponíveis. Apenas o proprietário pode ver esta retrospectiva após fazer upload do arquivo.",
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("Erro ao obter dados compartilhados:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao obter dados" }, { status: 500 })
  }
}
