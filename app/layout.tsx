import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

// Atualizar o metadata para incluir apenas o favicon fornecido
export const metadata = {
  title: "ZapLove - Surpreenda seu amor com uma retrospectiva personalizada",
  description:
    "Carregue seu backup e receba um resumo visual com dados sobre suas mensagens, emoções, frases favoritas e muito mais.",
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
        {/* 👉 TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function(w,d,t){
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
                ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
                var a=document.createElement("script");
                a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;
                var s=document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(a,s)
              };

              ttq.load('D1M0Q5RC77UF6MBM0LM0');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
