"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function PagamentoPage() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const router = useRouter();

  useEffect(() => {
    const userDataStr = sessionStorage.getItem("userData");
    if (!userDataStr) {
      router.push("/comece-agora");
      return;
    }

    const userData = JSON.parse(userDataStr);

    const createPayment = async () => {
      try {
        const response = await fetch("/api/v1/payment/pix/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            cellphone: "",
            cpf: userData.cpf.replace(/\D/g, ""),
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Erro ao criar pagamento");

        setPaymentData(result.data);
        checkPaymentStatus(result.data.paymentId);
      } catch (err) {
        console.error(err);
        toast({ title: "Erro", description: "Erro ao iniciar pagamento." });
        router.push("/comece-agora");
      }
    };

    createPayment();
  }, [router]);

  useEffect(() => {
    if (paymentStatus !== "PENDING") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast({ title: "Tempo expirado", description: "Você não finalizou o pagamento a tempo." });
          router.push("/comece-agora");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStatus, router]);

  const checkPaymentStatus = (paymentId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/payment/status/${paymentId}`);
        const data = await res.json();

        if (data.data.status === "PAID") {
          clearInterval(interval);
          setPaymentStatus("PAID");
          toast({ title: "Pagamento confirmado!", description: "Redirecionando..." });
          setTimeout(() => {
            const email = JSON.parse(sessionStorage.getItem("userData") || "{}").email;
            router.push(`/retrospectiva/${encodeURIComponent(email)}`);
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
  
            <div className="text-center mb-2">
              <p className="text-2xl font-bold text-black">R$ 19,90</p>
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
  
            {/* Barra de tempo com cor rosa */}
            <div className="relative w-full h-4 bg-pink-200 rounded-full overflow-hidden mt-4 mb-2">
              <div
                className="absolute top-0 left-0 h-4 bg-pink-500 transition-all duration-1000"
                style={{ width: `${(timeLeft / 120) * 100}%` }}
              ></div>
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
            <p className="mt-2 text-muted-foreground">Preparando sua retrospectiva personalizada...</p>
          </div>
        )}
      </div>
    </div>
  );
}  