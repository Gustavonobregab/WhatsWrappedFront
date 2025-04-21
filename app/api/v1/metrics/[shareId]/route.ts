import { NextResponse } from "next/server"
import { getMetricsByShareId } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { shareId: string } }) {
  try {
    const shareId = params.shareId

    if (!shareId) {
      return NextResponse.json({ success: false, error: "ID de compartilhamento não fornecido" }, { status: 400 })
    }

    // Obter métricas por ID de compartilhamento
    const result = await getMetricsByShareId(shareId)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Erro ao obter métricas" }, { status: 404 })
    }

    // Retornar os dados
    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Erro ao obter métricas:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao obter métricas" }, { status: 500 })
  }
}
