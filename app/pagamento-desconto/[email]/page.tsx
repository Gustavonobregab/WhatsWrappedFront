"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PageProps {
  params: {
    email: string;
  };
}

export default function PagamentoDescontoPage({ params }: PageProps) {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const router = useRouter();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const email = decodeURIComponent(params.email);

  useEffect(() => {
    const existingPaymentData = sessionStorage.getItem("paymentData");
    if (!existingPaymentData) {
      toast({ title: "Erro", description: "Dados de pagamento não encontrados." });
      router.push("/comece-agora");
      return;
    }

    const parsedData = JSON.parse(existingPaymentData);
    const startTime = Number(sessionStorage.getItem("paymentStart"));
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = 300 - elapsed;

    if (remaining <= 0) {
      toast({ title: "Tempo expirado", description: "Você não finalizou o pagamento a tempo." });
      sessionStorage.removeItem("paymentData");
      sessionStorage.removeItem("paymentStart");
      sessionStorage.removeItem("cupomAplicado");
      sessionStorage.removeItem("descontoPercentual");
      sessionStorage.removeItem("codigoCupom");
      router.push("/comece-agora");
      return;
    }

    setPaymentData(parsedData);
    setTimeLeft(remaining);
    startStatusPolling(parsedData.paymentId);
  }, [router]);

  useEffect(() => {
    if (paymentStatus !== "PENDING") return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          toast({ title: "Tempo expirado", description: "Você não finalizou o pagamento a tempo." });
          sessionStorage.removeItem("paymentData");
          sessionStorage.removeItem("paymentStart");
          sessionStorage.removeItem("cupomAplicado");
          sessionStorage.removeItem("descontoPercentual");
          sessionStorage.removeItem("codigoCupom");
          router.push("/comece-agora");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [paymentStatus, router]);

  const startStatusPolling = (paymentId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/payment/status/${paymentId}`);
        const data = await res.json();

        if (data?.data?.status === "PAID") {
          clearInterval(pollIntervalRef.current!);
          sessionStorage.removeItem("paymentData");
          sessionStorage.removeItem("paymentStart");
          sessionStorage.removeItem("cupomAplicado");
          sessionStorage.removeItem("descontoPercentual");
          sessionStorage.removeItem("codigoCupom");
          setPaymentStatus("PAID");

          toast({ title: "Pagamento confirmado!", description: "Redirecionando..." });

          // Redirecionar para a página de sucesso
          setTimeout(() => {
            router.push(`/success/${encodeURIComponent(email)}`);
          }, 2000);
        }
      } catch (err) {
        console.error("Erro ao verificar status de pagamento:", err);
      }
    }, 5000);
  };

  const copyPixCode = () => {
    if (!paymentData?.pixCode) return;
    navigator.clipboard.writeText(paymentData.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    toast({ title: "Código PIX copiado!" });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/landing-background.png')] bg-cover bg-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/neon-landing.png')] bg-cover bg-center bg-no-repeat py-12">
      <div className="container max-w-md mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40">
        {paymentStatus === "PENDING" ? (
          <>
            <h1 className="text-3xl font-extrabold text-center mb-4 text-pink-600">Finalize seu pagamento</h1>

            <div className="text-center mb-4">
              <div className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm">
                💘 Oferta Especial com Desconto
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-2xl font-bold text-black">R$ 13,45</p>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  50% OFF
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-through">R$ 26,90</p>
              <p className="text-sm text-muted-foreground">Oferta por tempo limitado</p>
            </div>

            <div className="flex justify-center mb-6">
              <img src={paymentData.pixQrCode} alt="QR Code PIX" className="w-72 h-72 rounded-md shadow" />
            </div>

            <div className="bg-white p-4 rounded mb-4 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Código PIX</span>
                <Button variant="ghost" size="sm" onClick={copyPixCode}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs break-all text-muted-foreground mt-2">{paymentData.pixCode}</p>
            </div>

            <div className="relative w-full h-4 bg-pink-200 rounded-full overflow-hidden mt-4 mb-2">
              <div
                className="absolute top-0 left-0 h-4 bg-pink-500 transition-all duration-1000"
                style={{ width: `${(timeLeft / 300) * 100}%` }}
              />
            </div>

            <p className="text-center text-sm text-pink-600 font-semibold mb-1">
              Tempo restante: {formatTime(timeLeft)}
            </p>
            <p className="text-center text-xs text-muted-foreground mb-4">
              O pagamento expira automaticamente após esse tempo.
            </p>
          </>
        ) : (
          <div className="text-center py-16">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-green-600">Pagamento confirmado!</h2>
            <p className="mt-2 text-muted-foreground">Redirecionando para sua retrospectiva...</p>
          </div>
        )}
      </div>
    </div>
  );
} 