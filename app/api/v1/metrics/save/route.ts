import { NextResponse } from "next/server"
import { saveMetricsWithShareId } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar os dados recebidos
    if (!body.email || !body.data) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 })
    }

    // Salvar métricas e obter ID de compartilhamento
    const result = await saveMetricsWithShareId(body.email, body.data)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Erro ao salvar métricas" }, { status: 500 })
    }

    // Retornar o ID de compartilhamento
    return NextResponse.json({ success: true, shareId: result.shareId })
  } catch (error) {
    console.error("Erro ao salvar métricas:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao salvar métricas" }, { status: 500 })
  }
}
