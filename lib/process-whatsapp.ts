import JSZip from "jszip"

// Tipos para os dados processados
export interface ParticipantData {
  sender: string
  totalMessages: number
  loveMessages: number
  apologyMessages: number
  firstMessageDate: string
  messageStreak: number
  daysStartedConversation: number
}

// Função principal para processar o arquivo do WhatsApp
export async function processWhatsAppFile(file: File): Promise<ParticipantData[]> {
  try {
    // Carregar o arquivo ZIP
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(file)

    // Encontrar o arquivo de texto (_chat.txt)
    let chatFile = null
    for (const filename in zipContent.files) {
      if (filename.endsWith(".txt") && !zipContent.files[filename].dir) {
        chatFile = zipContent.files[filename]
        break
      }
    }

    if (!chatFile) {
      throw new Error("Arquivo de chat não encontrado no ZIP")
    }

    // Extrair o conteúdo do arquivo de texto
    const chatContent = await chatFile.async("text")

    // Processar o conteúdo do chat
    return processWhatsAppChat(chatContent)
  } catch (error) {
    console.error("Erro ao processar arquivo do WhatsApp:", error)
    throw new Error("Não foi possível processar o arquivo. Verifique se é um backup válido do WhatsApp.")
  }
}

// Função para processar o conteúdo do chat
function processWhatsAppChat(chatContent: string): ParticipantData[] {
  try {
    // Dividir o conteúdo em linhas
    const lines = chatContent.split("\n")

    // Extrair os participantes
    const participants = extractParticipants(lines)

    // Inicializar dados para cada participante
    const participantData: Record<string, ParticipantData> = {}

    participants.forEach((participant) => {
      participantData[participant] = {
        sender: participant,
        totalMessages: 0,
        loveMessages: 0,
        apologyMessages: 0,
        firstMessageDate: "",
        messageStreak: 0,
        daysStartedConversation: 0,
      }
    })

    // Processar as mensagens
    const messagesByDate: Record<string, string[]> = {}
    let firstDate = ""

    for (const line of lines) {
      // Verificar se a linha contém uma mensagem válida
      const messageMatch = line.match(/\[(\d{2}\/\d{2}\/\d{4}), (\d{2}:\d{2}:\d{2})\] ([^:]+): (.+)/)

      if (messageMatch) {
        const [, date, time, sender, message] = messageMatch

        // Ignorar mensagens de sistema ou participantes desconhecidos
        if (!participantData[sender]) continue

        // Registrar a primeira data se ainda não foi definida
        if (!firstDate) {
          firstDate = date

          // Definir a primeira data para todos os participantes
          for (const participant in participantData) {
            participantData[participant].firstMessageDate = formatDateForAPI(date)
          }
        }

        // Incrementar contagem total de mensagens
        participantData[sender].totalMessages++

        // Verificar mensagens de amor
        if (
          message.toLowerCase().includes("te amo") ||
          message.toLowerCase().includes("amo você") ||
          message.toLowerCase().includes("te adoro") ||
          message.toLowerCase().includes("love you")
        ) {
          participantData[sender].loveMessages++
        }

        // Verificar mensagens de desculpas
        if (
          message.toLowerCase().includes("desculpa") ||
          message.toLowerCase().includes("perdão") ||
          message.toLowerCase().includes("me perdoa") ||
          message.toLowerCase().includes("sinto muito")
        ) {
          participantData[sender].apologyMessages++
        }

        // Registrar mensagens por data para calcular streak e quem inicia conversas
        if (!messagesByDate[date]) {
          messagesByDate[date] = []
        }

        if (!messagesByDate[date].includes(sender)) {
          messagesByDate[date].push(sender)
        }
      }
    }

    // Calcular streak e quem inicia conversas
    calculateStreakAndInitiators(messagesByDate, participantData)

    // Converter para array e retornar
    return Object.values(participantData)
  } catch (error) {
    console.error("Erro ao processar conteúdo do chat:", error)
    throw new Error("Não foi possível analisar o conteúdo do chat. Formato não reconhecido.")
  }
}

// Função para extrair participantes do chat
function extractParticipants(lines: string[]): string[] {
  const participants = new Set<string>()

  for (const line of lines) {
    const messageMatch = line.match(/\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\] ([^:]+): /)

    if (messageMatch && messageMatch[1]) {
      // Ignorar mensagens de sistema
      if (
        !messageMatch[1].includes("criou o grupo") &&
        !messageMatch[1].includes("adicionou") &&
        !messageMatch[1].includes("saiu") &&
        !messageMatch[1].includes("Messages to this group are now secured with end-to-end encryption")
      ) {
        participants.add(messageMatch[1])
      }
    }
  }

  return Array.from(participants)
}

// Função para calcular streak e iniciadores de conversa
function calculateStreakAndInitiators(
  messagesByDate: Record<string, string[]>,
  participantData: Record<string, ParticipantData>,
) {
  // Ordenar datas
  const sortedDates = Object.keys(messagesByDate).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("/").map(Number)
    const [dayB, monthB, yearB] = b.split("/").map(Number)

    return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime()
  })

  if (sortedDates.length === 0) return

  // Calcular streak (dias consecutivos de conversa)
  let currentStreak = 1
  let maxStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1].split("/").reverse().join("-"))
    const currDate = new Date(sortedDates[i].split("/").reverse().join("-"))

    // Verificar se as datas são consecutivas
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else if (diffDays > 1) {
      currentStreak = 1
    }
  }

  // Definir o streak máximo para todos os participantes
  for (const participant in participantData) {
    participantData[participant].messageStreak = maxStreak
  }

  // Calcular quem inicia mais conversas
  for (const date of sortedDates) {
    const firstSender = messagesByDate[date][0]
    if (participantData[firstSender]) {
      participantData[firstSender].daysStartedConversation++
    }
  }
}

// Função para formatar data no formato esperado pela API
function formatDateForAPI(date: string): string {
  // Converter de DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = date.split("/")
  return `${year}-${month}-${day}`
}
