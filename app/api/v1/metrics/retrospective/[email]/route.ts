import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  const { email } = params;

  try {
    const response = await fetch(`${API_URL}/api/v1/metrics/retrospective/${encodeURIComponent(email)}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Erro ao buscar retrospectiva" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro no proxy da retrospectiva:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
