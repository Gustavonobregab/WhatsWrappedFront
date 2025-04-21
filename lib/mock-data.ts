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

// Dados mockados para pagamento
export const MOCK_PAYMENT_DATA = {
  success: true,
  data: {
    pixCode:
      "00020101021226890014br.gov.bcb.pix2567pix.example.com/v2/9d36b84f-c70b-478f-b95c-12345678901552040000530398654041.005802BR5925EMPRESA EXEMPLO PAGAMENTO6009SAO PAULO62070503***63044D11",
    pixQrCode: "/pix-payment-qr.png",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas a partir de agora
    status: "PENDING",
    paymentId: "mock-payment-id-12345",
  },
}

// Dados mockados de usuário
export const MOCK_USER_DATA = {
  name: "Usuário Teste",
  email: "usuario@teste.com",
  cellphone: "(11) 98765-4321",
  cpf: "123.456.789-00",
  loveMessage: "Obrigado por compartilhar essa jornada comigo. Cada mensagem é especial.",
}
