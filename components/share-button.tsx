"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ShareButtonProps {
  url: string
  title?: string
  text?: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({
  url,
  title = "ZapLove",
  text = "Confira esta retrospectiva de conversas no WhatsApp!",
  className = "",
  variant = "outline",
  size = "sm",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Verificar se a API Web Share está disponível
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })

        toast({
          title: "Compartilhado!",
          description: "O link foi compartilhado com sucesso",
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
        // Fallback para copiar para a área de transferência
        copyToClipboard(url)
      }
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      copyToClipboard(url)
    }
  }

  // Função auxiliar para copiar para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)

        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência",
        })
      })
      .catch((err) => {
        console.error("Erro ao copiar link:", err)
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive",
        })
      })
  }

  return (
    <Button variant={variant} size={size} onClick={handleShare} className={className}>
      {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
      Compartilhar
    </Button>
  )
}
