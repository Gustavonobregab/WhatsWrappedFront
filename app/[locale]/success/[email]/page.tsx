"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Heart, Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PageProps {
  params: {
    email: string;
  };
}

export default function SuccessPage({ params }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const email = decodeURIComponent(params.email);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Carregar dados do usuário do sessionStorage
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }

    // Simular tempo de carregamento
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Registrar que o usuário passou pela página de sucesso
    const successVisited = sessionStorage.getItem(`success_visited_${email}`);
    if (!successVisited) {
      sessionStorage.setItem(`success_visited_${email}`, "true");
      // Aqui você pode adicionar analytics ou tracking se necessário
      console.log(`Usuário ${email} visitou a página de sucesso`);
    }
  }, [email]);

  const handleViewRetrospective = () => {
    // Redirecionar para a retrospectiva
    router.push(`/retrospectiva/${encodeURIComponent(email)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-pink-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700">Preparando sua retrospectiva...</h2>
          <p className="text-gray-500 mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background">
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-16 space-y-8">
            {/* Animação de confete/celebração */}
            <div className="relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" style={{ left: '20%', top: '20%' }} />
                <Sparkles className="h-6 w-6 text-pink-400 animate-pulse" style={{ right: '25%', top: '30%' }} />
                <Sparkles className="h-7 w-7 text-purple-400 animate-pulse" style={{ left: '30%', bottom: '25%' }} />
                <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" style={{ right: '15%', bottom: '35%' }} />
              </div>
              
              {/* Ícone principal */}
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Título e mensagem */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Pagamento Confirmado!
              </h1>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
                <span className="text-xl font-semibold text-gray-700">
                  Seu ZapLove está pronto!
                </span>
                <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
              </div>
              
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Sua retrospectiva personalizada foi criada com sucesso. 
                Clique no botão abaixo para visualizar seu ZapLove!
              </p>
            </div>

            {/* Botão de ação */}
            <div className="pt-4">
              <Button 
                onClick={handleViewRetrospective}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Heart className="h-6 w-6 mr-3" />
                Ver meu ZapLove
              </Button>
            </div>

            {/* Informações adicionais */}
            <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
              <h3 className="font-semibold text-gray-800 mb-2">✨ O que você vai encontrar:</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left max-w-sm mx-auto">
                <li>• Estatísticas detalhadas das suas conversas</li>
                <li>• Momentos especiais compartilhados</li>
                <li>• Análise personalizada do seu relacionamento</li>
                <li>• Histórico de mensagens organizado</li>
              </ul>
            </div>

            {/* Informações do usuário (se disponível) */}
            {userData && (
              <div className="mt-6 p-4 bg-white/80 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Plano:</strong> {userData.plan === "PREMIUM" ? "Premium" : "Básico"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {userData.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 