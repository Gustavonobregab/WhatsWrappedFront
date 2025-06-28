import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreditCardPlaceholderProps {
  onBack: () => void;
}

export function CreditCardPlaceholder({ onBack }: CreditCardPlaceholderProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <CreditCard className="h-10 w-10 text-white" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integração em breve</h2>
        <p className="text-lg text-gray-600 mb-4">
          Integração com cartão em breve. Agradecemos pela preferência 💳
        </p>
        <p className="text-sm text-muted-foreground">
          Estamos trabalhando para oferecer pagamento com cartão de crédito em breve.
        </p>
      </div>

      <Button 
        onClick={onBack}
        variant="outline" 
        className="mt-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para opções de pagamento
      </Button>
    </div>
  );
} 