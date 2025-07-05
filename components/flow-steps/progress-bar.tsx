"use client"

interface ProgressBarProps {
  currentStep: string
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const getStepNumber = (step: string) => {
    switch (step) {
      case "INSTRUCTIONS": return 1;
      case "FORM": return 2;
      case "PLAN": return 3;
      case "PAYMENT": return 4;
      case "PIX": return 4;
      default: return 1;
    }
  };

  const step = currentStep

  return (
    <div className="max-w-xl mx-auto my-4 border-b-2 pb-4">
      <div className="flex pb-3">
        <div className="flex-1">
        </div>

        <div className="flex-1">
          <div className={`w-10 h-10 mx-auto rounded-full text-lg text-white flex items-center ${
            getStepNumber(step) >= 1 
              ? "bg-gradient-to-r from-pink-500 to-purple-500" 
              : "bg-white border-2 border-gray-300"
          }`}>
            <span className={`text-center w-full ${
              getStepNumber(step) >= 1 ? "text-white" : "text-gray-500"
            }`}>
              {getStepNumber(step) > 1 ? "✓" : "1"}
            </span>
          </div>
        </div>

        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <div className={`text-xs leading-none py-1 text-center rounded ${
              getStepNumber(step) >= 2 
                ? "bg-gradient-to-r from-pink-500 to-purple-500" 
                : "bg-gray-300"
            }`} style={{ width: getStepNumber(step) >= 2 ? "100%" : "0%" }}></div>
          </div>
        </div>

        <div className="flex-1">
          <div className={`w-10 h-10 mx-auto rounded-full text-lg text-white flex items-center ${
            getStepNumber(step) >= 2 
              ? "bg-gradient-to-r from-pink-500 to-purple-500" 
              : "bg-white border-2 border-gray-300"
          }`}>
            <span className={`text-center w-full ${
              getStepNumber(step) >= 2 ? "text-white" : "text-gray-500"
            }`}>
              {getStepNumber(step) > 2 ? "✓" : "2"}
            </span>
          </div>
        </div>

        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <div className={`text-xs leading-none py-1 text-center rounded ${
              getStepNumber(step) >= 3 
                ? "bg-gradient-to-r from-pink-500 to-purple-500" 
                : "bg-gray-300"
            }`} style={{ width: getStepNumber(step) >= 3 ? "100%" : "0%" }}></div>
          </div>
        </div>

        <div className="flex-1">
          <div className={`w-10 h-10 mx-auto rounded-full text-lg text-white flex items-center ${
            getStepNumber(step) >= 3 
              ? "bg-gradient-to-r from-pink-500 to-purple-500" 
              : "bg-white border-2 border-gray-300"
          }`}>
            <span className={`text-center w-full ${
              getStepNumber(step) >= 3 ? "text-white" : "text-gray-500"
            }`}>
              {getStepNumber(step) > 3 ? "✓" : "3"}
            </span>
          </div>
        </div>

        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <div className={`text-xs leading-none py-1 text-center rounded ${
              getStepNumber(step) >= 4 
                ? "bg-gradient-to-r from-pink-500 to-purple-500" 
                : "bg-gray-300"
            }`} style={{ width: getStepNumber(step) >= 4 ? "100%" : "0%" }}></div>
          </div>
        </div>

        <div className="flex-1">
          <div className={`w-10 h-10 mx-auto rounded-full text-lg text-white flex items-center ${
            getStepNumber(step) >= 4 
              ? "bg-gradient-to-r from-pink-500 to-purple-500" 
              : "bg-white border-2 border-gray-300"
          }`}>
            <span className={`text-center w-full ${
              getStepNumber(step) >= 4 ? "text-white" : "text-gray-500"
            }`}>
              {getStepNumber(step) > 4 ? "✓" : "4"}
            </span>
          </div>
        </div>

        <div className="flex-1">
        </div>
      </div>

      <div className="flex text-xs content-center text-center">
        <div className="w-1/4">
          <span className={getStepNumber(step) >= 1 ? "text-pink-600 font-medium" : "text-gray-500"}>
            Instruções
          </span>
        </div>

        <div className="w-1/4">
          <span className={getStepNumber(step) >= 2 ? "text-pink-600 font-medium" : "text-gray-500"}>
            Upload
          </span>
        </div>

        <div className="w-1/4">
          <span className={getStepNumber(step) >= 3 ? "text-pink-600 font-medium" : "text-gray-500"}>
            Plano
          </span>
        </div>

        <div className="w-1/4">
          <span className={getStepNumber(step) >= 4 ? "text-pink-600 font-medium" : "text-gray-500"}>
            Pagamento
          </span>
        </div>
      </div>
    </div>
  )
} 