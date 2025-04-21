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

  // Capitalizar a primeira letra
  name = name.charAt(0).toUpperCase() + name.slice(1)

  // Criar uma cópia dos dados mockados
  const customData = [...MOCK_METRICS_DATA]

  // Personalizar o primeiro usuário
  if (customData.length > 0) {
    customData[0].sender = name
  }

  return customData
}
