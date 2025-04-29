import { type NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST(request: NextRequest) {
  console.log("Recebida requisição POST em /api/v1/metrics/upload");

  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const cpf = formData.get("cpf") as string;
    const text = formData.get("text") as string;
    const file = formData.get("file") as File;

    console.log("Dados recebidos:", {
      name: name || "AUSENTE",
      email: email || "AUSENTE",
      cpf: cpf || "AUSENTE",
      text: text || "AUSENTE",
      file: file ? `${file.name} (${file.size} bytes)` : "AUSENTE",
    });

    if (!name || !email || !cpf || !text || !file) {
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!cpf) missingFields.push("cpf");
      if (!text) missingFields.push("text");
      if (!file) missingFields.push("file");

      console.error("Campos ausentes:", missingFields);

      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos. Por favor, preencha todos os campos.",
          missingFields,
        },
        { status: 400 },
      );
    }

    const apiFormData = new FormData();
    apiFormData.append("name", name);
    apiFormData.append("email", email);
    apiFormData.append("cpf", cpf);
    apiFormData.append("text", text);
    apiFormData.append("file", file, file.name);

    const response = await fetch(`${API_URL}/api/v1/metrics/upload`, {
      method: "POST",
      body: apiFormData,
    });

    const responseText = await response.text();
    console.log("Resposta bruta da API externa:", responseText);

    if (!response.ok) {
      console.error("Erro na resposta da API:", response.status, responseText);

      try {
        const errorData = JSON.parse(responseText);
        return NextResponse.json(
          { success: false, message: errorData.message || `Erro ao processar o arquivo: ${response.status}` },
          { status: response.status },
        );
      } catch (e) {
        return NextResponse.json(
          {
            success: false,
            message: `Erro ao processar o arquivo: ${response.status} - ${responseText.substring(0, 100)}`,
          },
          { status: response.status },
        );
      }
    }

    let result;
    try {
      result = JSON.parse(responseText);
      console.log("Resposta da API externa (parseada):", JSON.stringify(result, null, 2));
    } catch (e) {
      console.error("Erro ao parsear resposta JSON:", e);
      return NextResponse.json({ success: false, message: "Erro ao processar resposta da API" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Arquivo processado com sucesso!",
      metrics: result.metrics,
    });
  } catch (error: any) {
    console.error("Erro ao processar upload:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Erro interno ao processar o upload" },
      { status: 500 },
    );
  }
}
