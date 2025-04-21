import { NextResponse } from "next/server"
import { MOCK_METRICS_DATA } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: { shareId: string } }) {
  try {
    const shareId = params.shareId

    if (!shareId) {
      return NextResponse.json({ success: false, error: "ID de compartilhamento não fornecido" }, { status: 400 })
    }

    // Usar dados mockados em vez de tentar obter do Supabase
    console.log("Usando dados mockados para o shareId:", shareId)

    // Retornar os dados mockados
    return NextResponse.json({
      success: true,
      data: MOCK_METRICS_DATA,
    })
  } catch (error) {
    console.error("Erro ao obter métricas:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao obter métricas" }, { status: 500 })
  }
}
