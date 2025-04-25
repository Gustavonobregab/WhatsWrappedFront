import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// Atualizar o título e a descrição do site
export const metadata = {
  title: "ZapLove - Surpreenda seu amor com uma retrospectiva WhatsApp",
  description:
    "Carregue seu backup do WhatsApp e receba um resumo visual com dados sobre suas mensagens, emoções, frases favoritas e muito mais.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
