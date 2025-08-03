"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, ArrowRight, Percent } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PageProps {
  params: {
    email: string;
  };
}

export default function DescontoPage({ params }: PageProps) {
  const [cupom, setCupom] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  const email = decodeURIComponent(params.email);

  useEffect(() => {
      const basicUserData = {
        email: email,
        name: email,
        cpf: "11350489409",
        cellphone: "(21) 98123-4567",
        plan: "BASIC",
      };
      setUserData(basicUserData);
      sessionStorage.setItem("userData", JSON.stringify(basicUserData));
    
  }, [email]);

  const aplicarCupom = async () => {
    if (!cupom.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um código de cupom.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simular validação do cupom (aceita qualquer cupom)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCupomAplicado(true);
      toast({
        title: "Cupom aplicado!",
        description: "50% de desconto aplicado com sucesso!",
      });

      // Salvar informações do desconto
      sessionStorage.setItem("cupomAplicado", "true");
      sessionStorage.setItem("descontoPercentual", "50");
      sessionStorage.setItem("codigoCupom", cupom);

    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao aplicar cupom. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const irParaPagamento = async () => {
    if (!cupomAplicado) {
      toast({
        title: "Atenção",
        description: "Aplique um cupom antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Criar pagamento com desconto
      const response = await fetch("/api/v1/payment/pix/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData?.name || email.split('@')[0],
          email: email,
          cpf: userData?.cpf || "",
          cellphone: userData?.cellphone || "",
          plan: "discount",
          cupomAplicado: true,
          descontoPercentual: 50,
          codigoCupom: sessionStorage.getItem("codigoCupom") || ""
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro ao criar pagamento");

      // Salvar dados do pagamento
      sessionStorage.setItem("paymentData", JSON.stringify(result.data));
      sessionStorage.setItem("paymentStart", Date.now().toString());
      sessionStorage.setItem("userData", JSON.stringify({
        name: userData?.name || email.split('@')[0],
        email: email,
        cpf: userData?.cpf || "",
        cellphone: userData?.cellphone || "",
        plan: "discount"
      }));

      // Redirecionar para página de pagamento personalizada
      router.push(`/pagamento-desconto/${encodeURIComponent(email)}`);

    } catch (err) {
      console.error(err);
      toast({ 
        title: "Erro", 
        description: "Erro ao criar pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const precoOriginal = 26.90;
  const descontoPercentual = cupomAplicado ? parseInt(sessionStorage.getItem("descontoPercentual") || "50") : 0;
  const precoComDesconto = cupomAplicado ? 13.45 : precoOriginal;
  const desconto = precoOriginal - precoComDesconto;

  return (
    <div className="min-h-screen bg-[url('/neon-landing.png')] bg-cover bg-center bg-no-repeat py-12">
      <div className="container max-w-md mx-auto">
        <Card className="bg-white/90 backdrop-blur-md border-white/40 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Gift className="h-12 w-12 text-pink-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-pink-600">
              Oferta Especial para Você!
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Aproveite esta oferta exclusiva por tempo limitado
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações do usuário */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Oferta especial para:</p>
              <p className="font-semibold text-lg">{email}</p>
            </div>

            {/* Preços */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-pink-600">
                  R$ {precoComDesconto.toFixed(2)}
                </span>
                {cupomAplicado && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Percent className="h-3 w-3 mr-1" />
                    {descontoPercentual}% OFF
                  </Badge>
                )}
              </div>
              
              {cupomAplicado && (
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">R$ {precoOriginal.toFixed(2)}</span>
                  <span className="text-green-600 font-semibold ml-2">
                    -R$ {desconto.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Cupom */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite seu código de cupom"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  disabled={cupomAplicado}
                  className="flex-1"
                />
                <Button
                  onClick={aplicarCupom}
                  disabled={loading || cupomAplicado}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : cupomAplicado ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    "Aplicar"
                  )}
                </Button>
              </div>
              
              {cupomAplicado && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Cupom aplicado com sucesso!</span>
                </div>
              )}
            </div>

            {/* Benefícios */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">O que você recebe:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  Retrospectiva personalizada do WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  Análise completa das suas conversas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  Estatísticas detalhadas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  Acesso vitalício
                </li>
              </ul>
            </div>

            {/* Botão de continuar */}
            <Button
              onClick={irParaPagamento}
              disabled={!cupomAplicado || loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Criando pagamento...
                </>
              ) : (
                <>
                  Continuar para Pagamento
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Oferta válida por tempo limitado. Não perca esta oportunidade!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 