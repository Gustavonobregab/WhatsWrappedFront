import { type NextRequest, NextResponse } from "next/server"
import { MOCK_METRICS_DATA } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug não fornecido" }, { status: 400 })
    }

    console.log("Usando dados mockados para o permalink:", slug)

    // Retornar dados mockados em vez de fazer requisição para API externa
    return NextResponse.json({
      success: true,
      data: MOCK_METRICS_DATA,
    })
  } catch (error: any) {
    console.error("Erro ao buscar dados pelo permalink:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno ao buscar dados" },
      { status: 500 },
    )
  }
}
