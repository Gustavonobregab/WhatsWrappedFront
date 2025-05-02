import Link from "next/link"
import { MessageCircle, Instagram, Music2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo e nome */}
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ZapLove</span>
          </div>

          {/* Navegação social */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link
              href="https://wa.me/5583988146652"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Contato
            </Link>
            <Link
              href="https://www.instagram.com/retrospectiva_zaplove/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </Link>
            <Link
              href="https://www.tiktok.com/@retrospectivalove"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <Music2 className="h-4 w-4" /> TikTok
            </Link>
          </nav>

          {/* Direitos autorais */}
          <div className="text-center text-sm text-muted-foreground md:text-right">
            &copy; {new Date().getFullYear()} ZapLove. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
