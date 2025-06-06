import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// Atualizar o metadata para incluir apenas o favicon fornecido
export const metadata = {
  title: "ZapLove - Surpreenda seu amor com uma retrospectiva WhatsApp",
  description:
    "Carregue seu backup do WhatsApp e receba um resumo visual com dados sobre suas mensagens, emoções, frases favoritas e muito mais.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
