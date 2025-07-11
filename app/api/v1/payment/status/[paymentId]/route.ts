import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    const { paymentId } = params;

    const response = await fetch(`${API_URL}/api/v1/payment/status/${paymentId}`, {
      method: "GET",
      cache: "no-store",

    });

    const data = await response.json();

    console.log("Statusdopagamento", data);

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Erro ao verificar status" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro no proxy de status:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
