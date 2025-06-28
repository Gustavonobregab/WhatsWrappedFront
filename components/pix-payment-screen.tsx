"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PixPaymentScreenProps {
  userData: any;
}

export function PixPaymentScreen({ userData }: PixPaymentScreenProps) {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const router = useRouter();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createPayment = async (userData: any) => {
    try {
      const response = await fetch("/api/v1/payment/pix/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          cpf: userData.cpf.replace(/\D/g, ""),
          cellphone: userData.cellphone.replace(/\D/g, "") 
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro ao criar pagamento");

      setPaymentData(result.data);
      sessionStorage.setItem("paymentData", JSON.stringify(result.data));
      sessionStorage.setItem("paymentStart", Date.now().toString());
      setTimeLeft(300);
      startStatusPolling(result.data.paymentId);
    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: "Erro ao iniciar pagamento." });
      router.push("/comece-agora");
    }
  };

  useEffect(() => {
    const existingPaymentData = sessionStorage.getItem("paymentData");

    if (existingPaymentData) {
      const parsedData = JSON.parse(existingPaymentData);
      const startTime = Number(sessionStorage.getItem("paymentStart"));
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = 300 - elapsed;

      if (remaining <= 0) {
        toast({ title: "Tempo expirado", description: "Você não finalizou o pagamento a tempo." });
        sessionStorage.removeItem("paymentData");
        sessionStorage.removeItem("paymentStart");
        router.push("/comece-agora");
        return;
      }

      setPaymentData(parsedData);
      setTimeLeft(remaining);
      startStatusPolling(parsedData.paymentId);
    } else {
      createPayment(userData);
    }
  }, [userData, router]);

  useEffect(() => {
    if (paymentStatus !== "PENDING") return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          toast({ title: "Tempo expirado", description: "Você não finalizou o pagamento a tempo." });
          sessionStorage.removeItem("paymentData");
          sessionStorage.removeItem("paymentStart");
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
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (paymentStatus === "PAID") {
    return (
      <div className="text-center py-16">
        <Check className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-green-600">Pagamento confirmado!</h2>
        <p className="mt-2 text-muted-foreground">Preparando sua retrospectiva personalizada...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-center mb-4 text-pink-600">Finalize seu pagamento</h1>

      <div className="text-center mb-4">
        <div className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm">
          💘 Promoção Dia dos Namorados
        </div>
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
    </div>
  );
} 