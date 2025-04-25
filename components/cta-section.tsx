import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="rounded-2xl bg-gradient-to-r from-rose-600 to-pink-700 p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 animate-pulse"></div>
            <div
              className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/10 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          <div className="mx-auto max-w-2xl text-center relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
              Pronto para descobrir o que suas conversas dizem sobre você?
            </h2>
            <p className="mt-4 text-xl text-white/80">Crie seu ZapLove agora mesmo e compartilhe com seus amigos!</p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="bg-white text-rose-700 hover:bg-white/90 font-bold text-lg" asChild>
                <Link href="/comece-agora">
                  <Upload className="mr-2 h-5 w-5" />
                  Comece Agora
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-white/80 flex items-center justify-center gap-2">
              <span className="text-lg">🔒</span>
              Seus dados são processados localmente e nunca armazenados.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
