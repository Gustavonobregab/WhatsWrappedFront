import { CreditCard, QrCode } from "lucide-react";

interface PaymentMethodSelectorProps {
  onSelectPix: () => void;
  onSelectCreditCard: () => void;
}

export function PaymentMethodSelector({ onSelectPix, onSelectCreditCard }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-8 flex flex-col items-center justify-center min-h-[500px]">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-pink-600">Escolha sua forma de pagamento</h1>
        <p className="text-lg text-muted-foreground">Selecione como você prefere finalizar sua compra</p>
      </div>

      <div className="grid gap-6 w-full max-w-md">
        <button
          onClick={onSelectCreditCard}
          className="group relative p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                Cartão de Crédito
              </h3>
              <p className="text-base text-gray-600">Pague com seu cartão de crédito</p>
            </div>
          </div>
        </button>

        <button
          onClick={onSelectPix}
          className="group relative p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                PIX
              </h3>
              <p className="text-base text-gray-600">Pague instantaneamente com PIX</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
