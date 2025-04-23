import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export function FeedbackSection() {
  return (
    <section
      id="feedback"
      className="py-20 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-950/20 dark:to-violet-950/20"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Feedback dos Usuários</h2>
          <p className="mt-4 text-xl text-muted-foreground">Veja o que as pessoas estão dizendo sobre o WhatsWrapped</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((feedback, index) => (
            <FeedbackCard key={index} {...feedback} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeedbackCardProps {
  name: string
  image?: string
  initials: string
  date: string
  rating: number
  comment: string
}

function FeedbackCard({ name, image, initials, date, rating, comment }: FeedbackCardProps) {
  return (
    <Card className="h-full overflow-hidden transform transition-transform hover:scale-105">
      <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="border-2 border-primary">
            <AvatarImage src={image || "/placeholder.svg"} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{date}</div>
          </div>
        </div>

        <div className="flex mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>

        <p className="text-muted-foreground">{comment}</p>
      </CardContent>
    </Card>
  )
}

const feedbacks = [
  {
    name: "Ana Carolina",
    initials: "AC",
    image: "/avatars/avatar-1.jpg",
    date: "15/04/2024",
    rating: 5,
    comment:
      "Incrível! Fiz uma surpresa para meu namorado com nossa retrospectiva e ele adorou. Os dados são muito interessantes e o visual é lindo!",
  },
  {
    name: "Ricardo Mendes",
    initials: "RM",
    image: "/avatars/avatar-2.jpg",
    date: "10/04/2024",
    rating: 5,
    comment:
      "Muito divertido ver quem manda mais mensagens e quem diz mais 'te amo'. Descobri que minha namorada é muito mais comunicativa que eu!",
  },
  {
    name: "Juliana Alves",
    initials: "JA",
    image: "/avatars/avatar-3.jpg",
    date: "05/04/2024",
    rating: 4,
    comment:
      "Adorei a ideia! Só tive um pequeno problema com o upload do arquivo, mas o suporte me ajudou rapidamente. O resultado final ficou ótimo.",
  },
  {
    name: "Felipe Santos",
    initials: "FS",
    image: "/avatars/avatar-4.jpg",
    date: "02/04/2024",
    rating: 5,
    comment:
      "Fiz como presente de aniversário de namoro e foi um sucesso! Minha namorada amou ver nossa história em números e estatísticas.",
  },
  {
    name: "Mariana Costa",
    initials: "MC",
    image: "/avatars/avatar-5.jpg",
    date: "28/03/2024",
    rating: 5,
    comment:
      "Super recomendo! O visual é incrível e as estatísticas são muito interessantes. Adorei descobrir quantas mensagens trocamos em um ano!",
  },
  {
    name: "Lucas Oliveira",
    initials: "LO",
    image: "/avatars/avatar-6.jpg",
    date: "25/03/2024",
    rating: 4,
    comment:
      "Muito legal! Fácil de usar e o resultado é surpreendente. Só acho que poderia ter mais tipos de estatísticas, mas mesmo assim valeu muito a pena.",
  },
]
