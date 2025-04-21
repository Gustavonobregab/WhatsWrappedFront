// Dados mockados para uso em todo o aplicativo

// Dados de métricas mockados para o StoriesCarousel
export const MOCK_METRICS_DATA = [
  {
    sender: "Pedro",
    totalMessages: 12543,
    loveMessages: 204,
    apologyMessages: 562,
    firstMessageDate: "2024-04-19",
    messageStreak: 351,
    daysStartedConversation: 162,
  },
  {
    sender: "Beatriz",
    totalMessages: 10000,
    loveMessages: 362,
    apologyMessages: 438,
    firstMessageDate: "2024-04-19",
    messageStreak: 351,
    daysStartedConversation: 200,
  },
]

// Função para personalizar os dados mockados com base no email ou nome
export function getPersonalizedMockData(nameOrEmail: string) {
  // Extrair o nome do email se for um email
  let name = nameOrEmail
  if (nameOrEmail.includes("@")) {
    name = nameOrEmail.split("@")[0]
  }

  // Capitalizar a primeira letra e remover caracteres especiais
  name = name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, "")

  // Se o nome estiver vazio após a limpeza, usar um nome padrão
  if (!name) name = "Usuário"

  // Criar uma cópia dos dados mockados
  const customData = JSON.parse(JSON.stringify(MOCK_METRICS_DATA))

  // Personalizar o primeiro usuário com o nome extraído
  if (customData.length > 0) {
    customData[0].sender = name
  }

  // Gerar um nome para o segundo usuário que seja diferente do primeiro
  if (customData.length > 1) {
    const secondNames = ["Ana", "Carlos", "Julia", "Lucas", "Maria", "João", "Beatriz", "Rafael"]
    let secondName = secondNames[Math.floor(Math.random() * secondNames.length)]

    // Garantir que o segundo nome seja diferente do primeiro
    if (secondName.toLowerCase() === name.toLowerCase()) {
      secondName = secondNames[(secondNames.indexOf(secondName) + 1) % secondNames.length]
    }

    customData[1].sender = secondName
  }

  // Adicionar alguma variação nos números para tornar mais realista
  customData.forEach((user) => {
    // Adicionar variação de até 10% nos valores numéricos
    const randomFactor = 0.9 + Math.random() * 0.2 // Entre 0.9 e 1.1

    user.totalMessages = Math.floor(user.totalMessages * randomFactor)
    user.loveMessages = Math.floor(user.loveMessages * randomFactor)
    user.apologyMessages = Math.floor(user.apologyMessages * randomFactor)
    user.messageStreak = Math.floor(user.messageStreak * randomFactor)
    user.daysStartedConversation = Math.floor(user.daysStartedConversation * randomFactor)
  })

  return customData
}
