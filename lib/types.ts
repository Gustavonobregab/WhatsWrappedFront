// Tipos para o sistema
export interface UserData {
  name: string
  email: string
  cpf: string
}

export interface MetricsData {
  sender: string
  totalMessages: number
  loveMessages: number
  apologyMessages: number
  firstMessageDate: string
  messageStreak: number
  daysStartedConversation: number
}

export interface RetrospectiveData {
  id: string
  email: string
  participants: MetricsData[]
  loveMessage?: string
  createdAt: string
}
