"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Esta página redireciona para a página personalizada do usuário
export default function WrappedRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Tentar obter o email do usuário da sessão
    const userDataStr = sessionStorage.getItem("userData")

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        if (userData.email) {
          // Redirecionar para a página personalizada
          router.push(`/wrapped/${encodeURIComponent(userData.email)}`)
          return
        }
      } catch (error) {
        console.error("Erro ao processar dados do usuário:", error)
      }
    }

    // Se não encontrar o email, redirecionar para a página inicial
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/20 to-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
        <p className="text-xl">Redirecionando para seu WhatsWrapped...</p>
      </div>
    </div>
  )
}
