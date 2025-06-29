"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentMethodSelector } from "@/components/payment-method-selector";
import { PixPaymentScreen } from "@/components/pix-payment-screen";

export default function PagamentoPage() {
  const [step, setStep] = useState<"SELECT" | "PIX" | "CREDIT_CARD">("SELECT");
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userDataStr = sessionStorage.getItem("userData");
    if (!userDataStr) {
      router.push("/comece-agora");
      return;
    }
    setUserData(JSON.parse(userDataStr));
  }, [router]);

  const handleCardPayment = async () => {
    const res = await fetch("/api/v1/payment/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro ao redirecionar para o pagamento com cartão.");
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/landing-background.png')] bg-cover bg-center">
        {/* Loader */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/neon-landing.png')] bg-cover bg-center bg-no-repeat py-12">
      <div className="container max-w-md mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40">
        {step === "SELECT" && (
          <PaymentMethodSelector
            onSelectPix={() => setStep("PIX")}
            onSelectCreditCard={handleCardPayment}
          />
        )}
        {step === "PIX" && (
          <PixPaymentScreen userData={userData} />
        )}
      </div>
    </div>
  );
}
