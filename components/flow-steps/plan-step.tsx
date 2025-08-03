"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

interface PlanStepProps {
  selectedPlan: "BASIC" | "PREMIUM" | null
  onPlanSelect: (plan: "BASIC" | "PREMIUM") => void
  onContinue: () => void
}

export function PlanStep({ selectedPlan, onPlanSelect, onContinue }: PlanStepProps) {
  // Reset scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-3xl font-bold text-center mb-8">Escolha seu ZapLove</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Plano PREMIUM */}
        <div className="flex flex-col items-center">
          <div
            className="w-full"
            onClick={() => onPlanSelect("PREMIUM")}
            style={{ aspectRatio: '1/1', minHeight: 0 }}
          >
            <div className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
              ${selectedPlan === "PREMIUM"
                ? "border-4 border-transparent bg-gradient-to-r from-pink-500 to-purple-500 p-1"
                : "border-2 border-purple-200 p-0.5"}
            `}>
              <div className="rounded-xl overflow-hidden bg-white">
                <img
                  src="/premium-big.png"
                  alt="Plano Premium"
                  className="w-full h-full object-cover object-center"
                  style={{ minHeight: 0 }}
                />
                {selectedPlan === "PREMIUM" && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-0 text-center px-2 pb-2">
            <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text uppercase tracking-wide">PREMIUM</h3>
            <p className="text-lg font-semibold text-gray-800 mb-1">Página personalizada + QR Code exclusivo para surpreender ainda mais!</p>
            <span className="text-purple-600 font-bold block">Receba um QR Code único para compartilhar sua retrospectiva de forma mágica.</span>
          </div>
        </div>

        {/* Plano BASIC */}
        <div className="flex flex-col items-center">
          <div
            className="w-full"
            onClick={() => onPlanSelect("BASIC")}
            style={{ aspectRatio: '1/1', minHeight: 0 }}
          >
            <div className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
              ${selectedPlan === "BASIC"
                ? "border-4 border-transparent bg-gradient-to-r from-pink-500 to-purple-500 p-1"
                : "border-2 border-pink-200 p-0.5"}
            `}>
              <div className="rounded-xl overflow-hidden bg-white">
                <img
                  src="/basico-big.png"
                  alt="Plano Básico"
                  className="w-full h-full object-cover object-center"
                  style={{ minHeight: 0 }}
                />
                {selectedPlan === "BASIC" && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-0 text-center px-2 pb-2">
            <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text uppercase tracking-wide">BÁSICO</h3>
            <p className="text-lg font-semibold text-gray-800 mb-1">Transforme sua conversa em uma página personalizada e inesquecível!</p>
            <span className="text-pink-500 font-bold block">Ideal para quem quer eternizar o momento de forma simples e especial.</span>
          </div>
        </div>
      </div>
      <div className="text-center">
      <Button
  size="lg"
  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-10"
  disabled={!selectedPlan}
  onClick={() => {
    if (typeof window !== "undefined" && window.ttq && selectedPlan) {
      window.ttq.track("PlaceAnOrder", {
        content_id: selectedPlan.toLowerCase(), // "basic" ou "premium"
        content_type: "plan",
        contents: [
          {
            id: selectedPlan.toLowerCase(),
            quantity: 1,
          },
        ],
        value: selectedPlan === "PREMIUM" ? 19.9 : 0, 
        currency: "BRL",
      });
    }

    onContinue(); 
  }}
>
  <ArrowRight className="mr-2 h-5 w-5" />
  Continuar
</Button>

      </div>
    </div>
  )
} 