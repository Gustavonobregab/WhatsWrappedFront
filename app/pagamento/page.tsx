"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function PagamentoPage() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentId, setPaymentId] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [checkIntervalId, setCheckIntervalId] = useState<NodeJS.Timeout | null>(null);

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
    
        if (!response.ok) {
          throw new Error(result.message || "Erro ao criar pagamento");
        }
    
        console.log("✨ Payment ID gerado:", result.data.paymentId); // <-- AQUI!
    
        setPaymentData(result.data);
        setPaymentId(result.data.paymentId);
        startPollingStatus(result.data.paymentId);
      } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        toast({ title: "Erro", description: "Erro ao iniciar pagamento." });
        router.push("/comece-agora");
      }
    };
    

    createPayment();
  }, [router]);

  const startPollingStatus = (paymentId: string) => {
    if (checkIntervalId) clearInterval(checkIntervalId);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/payment/status/${paymentId}`);
        const data = await res.json();

        if (data.data.status === "PAID") {
          clearInterval(interval);
          setPaymentStatus("PAID");
          toast({ title: "Pagamento confirmado!", description: "Redirecionando..." });
          setTimeout(() => redirectToRetrospectiva(), 2000);
        }
      } catch (err) {
        console.error("Erro ao checar status:", err);
      }
    }, 5000);

    setCheckIntervalId(interval);
  };

  const redirectToRetrospectiva = () => {
    if (checkIntervalId) {
      clearInterval(checkIntervalId); 
    }

    const email = JSON.parse(sessionStorage.getItem("userData") || "{}").email;
    if (email) {
      router.push(`/retrospectiva/${encodeURIComponent(email)}`);
    }
  };

  const copyPixCode = () => {
    if (paymentData?.pixCode) {
      navigator.clipboard.writeText(paymentData.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      toast({ title: "Código PIX copiado!" });
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background py-12">
      <div className="container max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        {paymentStatus === "PENDING" ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Escaneie para pagar</h1>

            <div className="text-center mb-4">
              <p className="text-lg font-bold text-green-600">R$ 19,90</p>
              <p className="text-sm text-muted-foreground">por tempo limitado</p>
            </div>

            <div className="flex justify-center mb-6">
              <img src={paymentData.pixQrCode} alt="QR Code PIX" className="w-72 h-72" />
            </div>

            <div className="bg-gray-100 p-4 rounded mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Código PIX</span>
                <Button variant="ghost" size="sm" onClick={copyPixCode}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs break-all text-muted-foreground mt-2">{paymentData.pixCode}</p>
            </div>

            <p className="text-center text-sm text-muted-foreground mb-6">
              Expira em: {new Date(paymentData.expiresAt).toLocaleString()}
            </p>
          </>
        ) : (
          <div className="text-center py-16">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold">Pagamento confirmado!</h2>
            <p className="mt-2 text-muted-foreground">Preparando sua retrospectiva personalizada...</p>
          </div>
        )}
      </div>
    </div>
  );
}
