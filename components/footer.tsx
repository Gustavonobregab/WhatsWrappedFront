import Link from "next/link"
import { MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ZapLove</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Termos de Uso
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contato
            </Link>
          </nav>
          <div className="text-center text-sm text-muted-foreground md:text-right">
            &copy; {new Date().getFullYear()} ZapLove. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
