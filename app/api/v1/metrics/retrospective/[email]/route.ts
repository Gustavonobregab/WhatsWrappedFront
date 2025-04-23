import { type NextRequest, NextResponse } from "next/server"
import type { RetrospectiveData } from "@/lib/types"

// Simulação de banco de dados em memória
const retrospectiveDatabase: Record<string, RetrospectiveData> = {}

export async function GET(request: NextRequest, { params }: { params: { email: string } }) {
  try {
    const email = decodeURIComponent(params.email)

    console.log(`Buscando retrospectiva para o email: ${email}`)

    // Verificar se temos a retrospectiva em nosso "banco de dados"
    // Procurar por email em vez de ID
    const retrospectiveByEmail = Object.values(retrospectiveDatabase).find(
      (retro) => retro.email.toLowerCase() === email.toLowerCase(),
    )

    if (retrospectiveByEmail) {
      console.log(`Retrospectiva encontrada no banco de dados local para o email: ${email}`)
      return NextResponse.json({
        success: true,
        data: retrospectiveByEmail,
      })
    }

    // Se não temos localmente, buscar da API externa
    console.log(`Buscando retrospectiva da API externa para o email: ${email}`)
    const response = await fetch(
      `https://chat-metrics-api.onrender.com/api/v1/metrics/retrospective/${encodeURIComponent(email)}`,
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Erro ao buscar retrospectiva: ${response.status}`, errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Retrospectiva não encontrada: ${response.status}`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log(`Dados da retrospectiva recebidos da API para o email: ${email}`, data)

    // Formatar os dados para o formato esperado pelo frontend
    const formattedData: RetrospectiveData = {
      id: data.id || data._id || email, // Usar email como ID se não houver outro
      email: email,
      participants: data.participants || [],
      loveMessage: data.text || data.loveMessage || null,
      createdAt: data.createdAt || new Date().toISOString(),
      isMock: false,
    }

    // Limpar caracteres inválidos nos nomes dos participantes
    if (formattedData.participants && Array.isArray(formattedData.participants)) {
      formattedData.participants = formattedData.participants
        .map((participant) => {
          // Remover participantes com nomes corrompidos ou duplicados
          if (participant.sender && participant.sender.includes("��")) {
            return null
          }
          return participant
        })
        .filter(Boolean) // Remover itens nulos
    }

    // Armazenar no "banco de dados" local para futuras consultas
    // Usar um ID único baseado no email
    const storageId = `retro_${email.replace(/[^a-zA-Z0-9]/g, "_")}`
    retrospectiveDatabase[storageId] = formattedData

    return NextResponse.json({
      success: true,
      data: formattedData,
    })
  } catch (error: any) {
    console.error(`Erro ao processar requisição:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao buscar retrospectiva",
      },
      { status: 500 },
    )
  }
}

// Endpoint para salvar uma retrospectiva (usado pelo frontend após o pagamento)
export async function POST(request: NextRequest, { params }: { params: { email: string } }) {
  try {
    const email = decodeURIComponent(params.email)
    const data = await request.json()

    console.log(`Salvando retrospectiva para o email: ${email}`, data)

    // Validar dados
    if (!data.email || !data.participants) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados incompletos para salvar a retrospectiva",
        },
        { status: 400 },
      )
    }

    // Salvar no "banco de dados" local
    // Usar um ID único baseado no email
    const storageId = `retro_${email.replace(/[^a-zA-Z0-9]/g, "_")}`
    retrospectiveDatabase[storageId] = {
      id: data.id || storageId,
      email: email,
      participants: data.participants,
      loveMessage: data.loveMessage,
      createdAt: data.createdAt || new Date().toISOString(),
      isMock: data.isMock || false,
    }

    console.log(`Retrospectiva salva com sucesso no banco de dados local para o email: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Retrospectiva salva com sucesso",
    })
  } catch (error: any) {
    console.error(`Erro ao salvar retrospectiva:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao salvar retrospectiva",
      },
      { status: 500 },
    )
  }
}
