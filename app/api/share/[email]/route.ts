import { NextResponse } from "next/server"
import { getPersonalizedMockData } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const email = params.email

    if (!email) {
      return NextResponse.json({ success: false, error: "Email não fornecido" }, { status: 400 })
    }

    // Decodificar o email
    const decodedEmail = decodeURIComponent(email)

    // Obter dados personalizados com base no email
    const personalizedData = getPersonalizedMockData(decodedEmail)

    // Retornar os dados personalizados
    return NextResponse.json({
      success: true,
      data: personalizedData,
      shareUrl: `/wrapped/${email}`,
    })
  } catch (error) {
    console.error("Erro ao obter dados compartilhados:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao obter dados" }, { status: 500 })
  }
}
