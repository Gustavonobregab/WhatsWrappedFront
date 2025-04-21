"use client"

import React from "react"
import { MOCK_METRICS_DATA } from "@/lib/mock-data"

type MetricsData = {
  sender: string
  totalMessages: number
  loveMessages: number
  apologyMessages: number
  firstMessageDate: string
  messageStreak: number
  daysStartedConversation: number
}

interface StoriesCarouselProps {
  metricsData?: MetricsData[]
  showOnlyDataStories?: boolean // Nova propriedade para controlar quais stories são exibidos
}

export function StoriesCarousel({
  metricsData = MOCK_METRICS_DATA,
  showOnlyDataStories = false,
}: StoriesCarouselProps) {
  const [currentStory, setCurrentStory] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const [loveMessage, setLoveMessage] = React.useState<string | null>(null)
  const [senderName, setSenderName] = React.useState<string>("Pedro")

  // Adicione este useEffect para carregar a mensagem de amor da sessão
  React.useEffect(() => {
    console.log("Dados recebidos no StoriesCarousel:", metricsData)

    // Definir o nome do remetente para a mensagem de amor
    if (metricsData && metricsData.length > 0) {
      setSenderName(metricsData[0].sender)
    }

    // Tentar obter a mensagem de amor da sessão
    const storedLoveMessage = sessionStorage.getItem("loveMessage")
    if (storedLoveMessage) {
      setLoveMessage(storedLoveMessage)
    }
  }, [metricsData])

  // Usar dados fornecidos ou dados mockados
  const user1 = metricsData && metricsData.length > 0 ? metricsData[0] : MOCK_METRICS_DATA[0]
  const user2 = metricsData && metricsData.length > 1 ? metricsData[1] : MOCK_METRICS_DATA[1]

  console.log("Usando dados de usuários:", { user1, user2 })

  // Calcular a data de início da conversa
  const firstDate = new Date(user1.firstMessageDate)
  const formattedFirstDate = firstDate.toLocaleDateString("pt-BR")

  // Calcular dias desde o início
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - firstDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Determinar quem inicia mais conversas
  const whoStartsMore = user1.daysStartedConversation > user2.daysStartedConversation ? user1.sender : user2.sender
  const startPercentage = Math.max(
    (user1.daysStartedConversation / (user1.daysStartedConversation + user2.daysStartedConversation)) * 100,
    (user2.daysStartedConversation / (user1.daysStartedConversation + user2.daysStartedConversation)) * 100,
  )

  // Quem diz mais "te amo"
  const loveWinner = user1.loveMessages > user2.loveMessages ? user1.sender : user2.sender

  // Quem pede mais desculpas
  const apologyWinner = user1.apologyMessages > user2.apologyMessages ? user1.sender : user2.sender

  // Quem envia mais mensagens
  const messageWinner = user1.totalMessages > user2.totalMessages ? user1.sender : user2.sender

  const allStories = [
    // Tela de introdução
    {
      type: "intro",
      bgColor: "from-violet-600 via-purple-600 to-indigo-600",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 select-none">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-xl animate-pulse"></div>
            <h1 className="text-5xl font-extrabold mb-6 text-center">Que tal uma retrospectiva da nossa história?</h1>
          </div>
          <p className="text-2xl text-white/90 text-center">Descubra o que suas conversas dizem sobre você</p>
        </div>
      ),
    },

    // Transição para Te Amo
    {
      type: "transition",
      bgColor: "from-rose-500 via-purple-500 to-indigo-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tá na hora de saber quem ama mais o outro...</h2>
            <p className="text-2xl md:text-3xl font-medium">Rufem os tambores! 🥁</p>
            <div className="mt-8 flex justify-center">
              <div className="animate-ping">
                <span className="text-5xl md:text-6xl">❤️</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Total de 'Te Amo'
    {
      type: "data",
      title: "Quem mandou mais te amo?",
      subtitle: "",
      bgColor: "from-rose-500 via-red-500 to-pink-600",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <h3 className="text-3xl md:text-5xl font-bold mb-8 text-center">Quem mandou mais te amo?</h3>

          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl md:text-5xl">❤️</span>
            <h2 className="text-4xl md:text-5xl font-bold mx-3">TE AMO</h2>
            <span className="text-4xl md:text-5xl">❤️</span>
          </div>

          <div className="w-full space-y-5 max-w-xs md:max-w-md">
            <div>
              <div className="flex items-center justify-between mb-2 text-center">
                <span className="text-2xl md:text-3xl font-bold">{user1.sender}</span>
                <span className="text-3xl md:text-4xl font-extrabold">{user1.loveMessages}</span>
              </div>
              <div className="relative h-10 md:h-12 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-pink-300 to-red-300 rounded-full"
                  style={{ width: `${(user1.loveMessages / (user1.loveMessages + user2.loveMessages)) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-xl md:text-2xl">❤️</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 text-center">
                <span className="text-2xl md:text-3xl font-bold">{user2.sender}</span>
                <span className="text-3xl md:text-4xl font-extrabold">{user2.loveMessages}</span>
              </div>
              <div className="relative h-10 md:h-12 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-pink-300 to-red-300 rounded-full"
                  style={{ width: `${(user2.loveMessages / (user1.loveMessages + user2.loveMessages)) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-xl md:text-2xl">❤️</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-2xl md:text-3xl font-extrabold text-white">{loveWinner} ama mais! ❤️</span>
          </div>
        </div>
      ),
    },

    // Transição para mensagens totais
    {
      type: "transition",
      bgColor: "from-pink-500 via-purple-500 to-indigo-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Vocês trocaram muitas mensagens...</h2>
            <p className="text-2xl md:text-3xl font-medium">Vamos ver quantas exatamente? 👀</p>
            <div className="mt-8 animate-bounce">
              <span className="text-4xl md:text-5xl">⬇️</span>
            </div>
          </div>
        </div>
      ),
    },

    // Total de Mensagens
    {
      type: "data",
      title: "Quantas mensagens vocês trocaram?",
      subtitle: "",
      bgColor: "from-pink-500 via-purple-500 to-indigo-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <h3 className="text-3xl md:text-5xl font-bold mb-8 text-center">Quantas mensagens vocês trocaram?</h3>

          <div className="bg-white/20 rounded-2xl px-8 py-4 backdrop-blur-sm text-center mb-8">
            <span className="text-5xl md:text-6xl font-black">
              {(user1.totalMessages + user2.totalMessages).toLocaleString()}
            </span>
          </div>

          <div className="w-full space-y-5 max-w-xs md:max-w-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl md:text-3xl font-bold">{user1.sender}</span>
                <span className="text-2xl md:text-3xl font-bold">{user1.totalMessages.toLocaleString()}</span>
              </div>
              <div className="h-8 md:h-10 w-full rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-purple-300"
                  style={{ width: `${(user1.totalMessages / (user1.totalMessages + user2.totalMessages)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl md:text-3xl font-bold">{user2.sender}</span>
                <span className="text-2xl md:text-3xl font-bold">{user2.totalMessages.toLocaleString()}</span>
              </div>
              <div className="h-8 md:h-10 w-full rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-purple-300"
                  style={{ width: `${(user2.totalMessages / (user1.totalMessages + user2.totalMessages)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xl md:text-2xl font-bold text-white">{messageWinner} envia mais mensagens!</span>
          </div>
        </div>
      ),
    },

    // Transição para Streak
    {
      type: "transition",
      bgColor: "from-purple-600 via-indigo-600 to-blue-600",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Vocês são muito consistentes...</h2>
            <p className="text-2xl md:text-3xl font-medium">
              Vamos ver por quantos dias seguidos vocês conversaram! 🔥
            </p>
            <div className="mt-8 animate-pulse">
              <span className="text-5xl md:text-6xl">🔥</span>
            </div>
          </div>
        </div>
      ),
    },

    // Dias Consecutivos
    {
      type: "data",
      title: "Quantos dias seguidos vocês conversaram?",
      subtitle: "",
      bgColor: "from-purple-600 via-indigo-600 to-blue-600",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <h3 className="text-3xl md:text-5xl font-bold mb-8 text-center">Quantos dias seguidos vocês conversaram?</h3>

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-4xl md:text-5xl">🔥</span>
            <div className="bg-white/20 rounded-2xl px-8 py-4 backdrop-blur-sm">
              <span className="text-6xl md:text-7xl font-black text-white">{user1.messageStreak}</span>
            </div>
            <span className="text-4xl md:text-5xl">🔥</span>
          </div>

          <p className="text-2xl md:text-3xl font-bold bg-white/20 px-6 py-3 rounded-full mb-6 text-center">
            DIAS CONSECUTIVOS
          </p>

          <div className="grid grid-cols-7 gap-2 mb-6 max-w-xs md:max-w-md mx-auto">
            {Array.from({ length: 21 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 w-8 md:h-10 md:w-10 rounded-md ${i < 18 ? "bg-blue-300" : "bg-white/30"} 
                         ${i === 17 ? "ring-2 ring-yellow-300 animate-pulse" : ""}`}
              ></div>
            ))}
          </div>

          <p className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text text-center">
            {user1.messageStreak > 300 ? "QUASE UM ANO COMPLETO!" : "IMPRESSIONANTE!"}
          </p>
        </div>
      ),
    },

    // Transição para Desculpas
    {
      type: "transition",
      bgColor: "from-teal-500 via-emerald-500 to-green-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Quem será que pede mais desculpas?</h2>
            <p className="text-2xl md:text-3xl font-medium">Vamos descobrir... 🙏</p>
            <div className="mt-8 animate-bounce">
              <span className="text-4xl md:text-5xl">🙏</span>
            </div>
          </div>
        </div>
      ),
    },

    // Total de Desculpas
    {
      type: "data",
      title: "Quem pede mais desculpas?",
      subtitle: "",
      bgColor: "from-teal-500 via-emerald-500 to-green-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <h3 className="text-3xl md:text-5xl font-bold mb-8 text-center">Quem pede mais desculpas?</h3>

          <div className="flex items-center justify-center mb-6">
            <span className="text-3xl md:text-4xl">🙏</span>
            <span className="text-3xl md:text-4xl mx-3 font-bold">DESCULPA</span>
            <span className="text-3xl md:text-4xl">🙏</span>
          </div>

          <div className="w-full space-y-5 max-w-xs md:max-w-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl md:text-3xl font-bold">{user1.sender}</span>
                <span className="text-3xl md:text-4xl font-extrabold">{user1.apologyMessages}</span>
              </div>
              <div className="relative h-10 md:h-12 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-green-300 rounded-full"
                  style={{
                    width: `${(user1.apologyMessages / (user1.apologyMessages + user2.apologyMessages)) * 100}%`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-xl md:text-2xl">🙏</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl md:text-3xl font-bold">{user2.sender}</span>
                <span className="text-3xl md:text-4xl font-extrabold">{user2.apologyMessages}</span>
              </div>
              <div className="relative h-10 md:h-12 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-green-300 rounded-full"
                  style={{
                    width: `${(user2.apologyMessages / (user1.apologyMessages + user2.apologyMessages)) * 100}%`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-xl md:text-2xl">🙏</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="text-xl md:text-3xl font-extrabold text-white">{apologyWinner} pede mais desculpas!</span>
          </div>
        </div>
      ),
    },

    // Transição para Primeira Mensagem
    {
      type: "transition",
      bgColor: "from-amber-500 via-orange-500 to-yellow-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Vamos voltar no tempo...</h2>
            <p className="text-2xl md:text-3xl font-medium">Quando tudo começou? 📅</p>
            <div className="mt-8 animate-spin">
              <span className="text-5xl md:text-6xl">⏰</span>
            </div>
          </div>
        </div>
      ),
    },

    // Dia da Primeira Mensagem
    {
      type: "data",
      title: "Quando tudo começou?",
      subtitle: "",
      bgColor: "from-amber-500 via-orange-500 to-yellow-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <h3 className="text-3xl md:text-5xl font-bold mb-8 text-center">Quando tudo começou?</h3>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl md:text-4xl">📅</span>
            <div className="bg-white/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
              <span className="text-4xl md:text-5xl font-black">{formattedFirstDate}</span>
            </div>
          </div>

          <p className="text-xl md:text-2xl font-medium mb-4 text-center">Uma data especial! 🌟</p>

          <div className="bg-white/20 rounded-lg p-4 text-center mb-4 max-w-xs md:max-w-md">
            <p className="text-lg md:text-xl italic">"Oi! Tudo bem?"</p>
          </div>

          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold text-white">Há {diffDays} dias atrás</span>
          </div>
        </div>
      ),
    },

    // Transição para Quem Inicia
    {
      type: "transition",
      bgColor: "from-fuchsia-500 via-purple-500 to-violet-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Quem será que começa mais as conversas?</h2>
            <p className="text-2xl md:text-3xl font-medium">Vamos descobrir quem é mais ansioso... 📱</p>
            <div className="mt-8 animate-pulse">
              <span className="text-5xl md:text-6xl">📱</span>
            </div>
          </div>
        </div>
      ),
    },

    // Quem Iniciou Mais Conversas
    {
      type: "data",
      title: "Quem começa mais as conversas?",
      subtitle: "",
      bgColor: "from-fuchsia-500 via-purple-500 to-violet-500",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <h3 className="text-3xl md:text-5xl font-bold mb-8 text-center">Quem começa mais as conversas?</h3>

          <div className="w-full max-w-xs md:max-w-md mb-6">
            <div className="relative h-20 md:h-24 w-full rounded-full bg-white/20 overflow-hidden mb-3">
              <div
                className="absolute inset-0 bg-gradient-to-r from-fuchsia-300 to-purple-300 rounded-full"
                style={{
                  width: `${(user1.daysStartedConversation / (user1.daysStartedConversation + user2.daysStartedConversation)) * 100}%`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full flex justify-between px-6">
                  <span className="text-2xl md:text-3xl font-bold">{user1.sender}</span>
                  <span className="text-2xl md:text-3xl font-bold">{user2.sender}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-xl md:text-2xl">
                {Math.round(
                  (user1.daysStartedConversation / (user1.daysStartedConversation + user2.daysStartedConversation)) *
                    100,
                )}
                %
              </span>
              <span className="text-xl md:text-2xl">
                {Math.round(
                  (user2.daysStartedConversation / (user1.daysStartedConversation + user2.daysStartedConversation)) *
                    100,
                )}
                %
              </span>
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-6 text-center mb-6 max-w-xs md:max-w-md">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Curiosidade:</h3>
            <p className="text-xl md:text-2xl">
              {whoStartsMore} inicia as conversas {Math.round(startPercentage)}% das vezes! 📱
            </p>
          </div>

          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {user1.daysStartedConversation + user2.daysStartedConversation} conversas iniciadas
            </span>
          </div>
        </div>
      ),
    },

    // Mensagem personalizada (novo slide)
    {
      type: "love-message",
      bgColor: "from-pink-600 via-rose-600 to-red-600",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8 animate-bounce">
              <span className="text-5xl md:text-6xl">💌</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-pink-200 text-transparent bg-clip-text">
              {senderName} deixou esse recado especial para você...
            </h3>

            <div className="bg-white/20 rounded-xl p-8 backdrop-blur-sm mb-8 relative">
              <div className="absolute -top-3 -left-3 text-3xl">❝</div>
              <div className="absolute -bottom-3 -right-3 text-3xl">❞</div>
              <p className="text-xl md:text-2xl italic leading-relaxed text-center">
                {loveMessage ||
                  "Obrigado por compartilhar essa jornada comigo. Cada mensagem é especial e cada momento que passamos juntos é um tesouro que guardo no coração."}
              </p>
            </div>

            <div className="flex justify-center space-x-4 animate-pulse">
              <span className="text-3xl">❤️</span>
              <span className="text-3xl">✨</span>
              <span className="text-3xl">💕</span>
            </div>
          </div>
        </div>
      ),
    },

    // Tela final
    {
      type: "outro",
      bgColor: "from-rose-600 via-pink-600 to-red-700",
      content: (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 select-none">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">
              Surpreenda seu amor <br /> 2025
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-white/90 text-center mb-8">
            Obrigado por compartilhar suas conversas conosco!
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl md:text-5xl">❤️</span>
            <span className="text-4xl md:text-5xl">🔥</span>
            <span className="text-4xl md:text-5xl">📱</span>
          </div>
        </div>
      ),
    },
  ]

  // Filtrar os stories com base na propriedade showOnlyDataStories
  const stories = showOnlyDataStories
    ? allStories.filter((story) => story.type === "data" || story.type === "intro")
    : allStories

  // Efeito para avançar automaticamente os stories
  React.useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, stories.length])

  // Manipuladores para navegação
  const goToNextStory = () => {
    setCurrentStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1))
  }

  const goToPrevStory = () => {
    setCurrentStory((prev) => (prev === 0 ? stories.length - 1 : prev - 1))
  }

  // Manipuladores para pausar/retomar ao pressionar
  const handleTouchStart = () => {
    setIsPaused(true)
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
  }

  // Manipuladores para cliques
  const handleClick = (e: React.MouseEvent) => {
    const { clientX, currentTarget } = e
    const { left, width } = currentTarget.getBoundingClientRect()
    const clickPosition = clientX - left

    if (clickPosition < width / 2) {
      goToPrevStory()
    } else {
      goToNextStory()
    }
  }

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${stories[currentStory].bgColor} transition-colors duration-500 select-none`}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Barras de progresso do story */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-20">
        {stories.map((_, index) => (
          <div key={index} className="h-1.5 flex-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-100 ${
                index < currentStory ? "w-full" : index === currentStory ? "animate-progress" : "w-0"
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* Conteúdo do story atual */}
      <div className="absolute inset-0 flex flex-col text-white select-none">{stories[currentStory].content}</div>
    </div>
  )
}
