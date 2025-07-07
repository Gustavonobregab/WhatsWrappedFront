"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { PixPaymentScreen } from "@/components/pix-payment-screen"
import { 
  InstructionsStep, 
  FormStep, 
  PlanStep, 
  ProgressBar 
} from "@/components/flow-steps"

type Step = "INSTRUCTIONS" | "FORM" | "PLAN" | "PAYMENT" | "PIX"

export default function ComecePage() {
  const [step, setStep] = useState<Step>("INSTRUCTIONS")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<"BASIC" | "PREMIUM" | null>("PREMIUM")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    cellphone: "",
    text: "Obrigado por compartilhar essa jornada comigo!",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cpf: "",
    cellphone: "", 
    file: "",
  })
  const [userData, setUserData] = useState<any>(null)

  const router = useRouter()

  // Load userData from sessionStorage on component mount
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setSelectedPlan(parsedUserData.plan || "PREMIUM");
    }
  }, []);

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Formatação automática para CPF
    if (name === "cpf") {
      let formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length <= 11) {
        if (formattedValue.length > 3) {
          formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3)}`
        }
        if (formattedValue.length > 7) {
          formattedValue = `${formattedValue.slice(0, 7)}.${formattedValue.slice(7)}`
        }
        if (formattedValue.length > 11) {
          formattedValue = `${formattedValue.slice(0, 11)}-${formattedValue.slice(11)}`
        }
        setFormData({ ...formData, [name]: formattedValue })
      }
    } 
    // Formatação para celular
    else if (name === "cellphone") {
      let formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length <= 11) {
        setFormData({ ...formData, [name]: formattedValue })
      }
    }
    else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar se é um arquivo ZIP
    if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
      setErrors({ ...errors, file: "Por favor, selecione um arquivo ZIP exportado do WhatsApp." })
      return
    }

    // Verificar o tamanho do arquivo (limite de 30MB)
    const MAX_FILE_SIZE = 30 * 1024 * 1024 // 30MB em bytes
    if (file.size > MAX_FILE_SIZE) {
      setErrors({
        ...errors,
        file: "O tamanho máximo permitido é de 30MB. Por favor, selecione um arquivo menor.",
      })
      return
    }

    setSelectedFile(file)
    setErrors({ ...errors, file: "" })
  }

  const handlePlanSelection = (plan: "BASIC" | "PREMIUM") => {
    setSelectedPlan(plan);
    // Update userData with the selected plan
    const updatedUserData = {
      ...userData,
      plan: plan
    };
    setUserData(updatedUserData);
    sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
    
    // Se estivermos na etapa PIX, limpar dados de pagamento para forçar novo pagamento
    if (step === "PIX") {
      sessionStorage.removeItem("paymentData");
      sessionStorage.removeItem("paymentStart");
      sessionStorage.removeItem("currentPlan");
    }
  };

  function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
  
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
  
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
  
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
  
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
  
    return rev === parseInt(cpf.charAt(10));
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      email: "",
      cpf: "",
      cellphone: "",
      file: "",
    }

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
      valid = false
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido"
      valid = false
    }

    // Validação do CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!formData.cpf.trim() || !cpfRegex.test(formData.cpf) || !isValidCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido"
      valid = false
    }

    // Validação do arquivo
    if (!selectedFile) {
      newErrors.file = "Por favor, selecione um arquivo de backup do WhatsApp"
      valid = false
    }

    const phoneDigits = formData.cellphone.replace(/\D/g, "");
    const cellphoneRegex = /^[1-9]{2}9\d{8}$/;
    if (phoneDigits.length !== 11 || !cellphoneRegex.test(phoneDigits)) {
      newErrors.cellphone = "Celular inválido. Use o formato 11999999999";
      valid = false;
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("cpf", formData.cpf.replace(/\D/g, ""));
      formDataToSend.append("text", formData.text.trim() || "Obrigado por compartilhar essa jornada comigo!");
      formDataToSend.append("plan", selectedPlan || "BASIC");
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      // Upload dos dados e arquivo
      const response = await fetch("/api/v1/metrics/upload", {
        method: "POST",
        body: formDataToSend,
      });

      const responseText = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Formato de resposta inválido da API");
      }

      if (!response.ok) {
        console.error("Erro na resposta da API:", response.status, responseText);

        try {
          const errorData = JSON.parse(responseText);
          // Verificar erro específico de arquivo ZIP sem arquivos TXT
          if (errorData?.message === "No TXT files found in the ZIP" || errorData?.error === "No TXT files found in the ZIP") {
            setErrors({
              ...errors,
              file: "O arquivo enviado não é válido para o WhatsWrapped. Por favor, entre em contato com nosso suporte através do WhatsApp: (83) 99935-9977"
            });
            return;
          }
          // 🎯 MODIFICADO: Adaptando a resposta para o frontend
          if (errorData?.code === "VALIDATION_ERROR" && errorData?.error?.toLowerCase().includes("e-mail")) {
            setErrors({ ...errors, email: errorData.message });
          } else {
            setErrors({
              ...errors,
              file: errorData?.message || `Erro ao processar o arquivo: ${response.status}`
            });
          }
        } catch (e) {
          setErrors({
            ...errors,
            file: "Erro ao processar o arquivo. Por favor, tente novamente."
          });
        }
        return;
      }

      const userDataToStore = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        cellphone: formData.cellphone,
        plan: selectedPlan || "BASIC",
      };

      sessionStorage.setItem("userData", JSON.stringify(userDataToStore));
      setUserData(userDataToStore);

      if (responseData.metrics && responseData.metrics.participants) {
        // Verificar se existem exatamente dois participantes
        if (!responseData.metrics.participants || responseData.metrics.participants.length !== 2) {
          setErrors({
            ...errors,
            file: "O arquivo enviado não é válido para o WhatsWrapped. Por favor, entre em contato com nosso suporte através do WhatsApp: (83) 99935-9977"
          });
          return;
        }

        console.log("Storing metrics data in sessionStorage");
        sessionStorage.setItem("metricsData", JSON.stringify(responseData.metrics.participants));
      }

      console.log("Moving to plan step");
      setStep("PLAN");

    } catch (error: any) {
      console.error("Erro ao processar:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = async (method: "PIX" | "CREDIT_CARD") => {
    if (method === "PIX") {
      setStep("PIX");
    } else {
      try {
        const res = await fetch("/api/v1/payment/card", {
          method: "POST",
          body: JSON.stringify({ 
            name: userData.name, 
            email: userData.email,
            plan: userData.plan?.toLowerCase() 
          }),
          headers: { "Content-Type": "application/json" },
        });
  
        const data = await res.json();
        if (data?.data?.checkoutUrl) {
          window.location.href = data.data.checkoutUrl;
        } else {
          toast({
            title: "Erro",
            description: "Erro ao redirecionar para pagamento.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Erro",
          description: "Erro ao iniciar pagamento.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    switch (step) {
      case "FORM":
        // Limpar dados quando voltar para instruções
        setStep("INSTRUCTIONS");
        setSelectedFile(null);
        setFormData({
          name: "",
          email: "",
          cpf: "",
          cellphone: "",
          text: "Obrigado por compartilhar essa jornada comigo!",
        });
        setErrors({
          name: "",
          email: "",
          cpf: "",
          cellphone: "",
          file: "",
        });
        setUserData(null);
        setSelectedPlan("PREMIUM");
        // Limpar sessionStorage
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("metricsData");
        sessionStorage.removeItem("paymentData");
        sessionStorage.removeItem("paymentStart");
        break;
      case "PLAN":
        setStep("FORM");
        break;
      case "PAYMENT":
        setStep("PLAN");
        break;
      case "PIX":
        setStep("PAYMENT");
        // Não limpar dados de pagamento aqui para permitir que o usuário volte e altere o plano
        break;
    }
  };

  const getStepNumber = (currentStep: Step) => {
    switch (currentStep) {
      case "INSTRUCTIONS": return 1;
      case "FORM": return 2;
      case "PLAN": return 3;
      case "PAYMENT": return 4;
      case "PIX": return 4;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background">
      <div className="container py-8">
        <div className="flex items-center mb-8">
          {step !== "INSTRUCTIONS" && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">Vamos criar seu ZapLove! 🎉</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Barra de progresso */}
          <ProgressBar currentStep={step} totalSteps={4} />
          
          {/* Renderizar etapa atual */}
          {step === "INSTRUCTIONS" && (
            <InstructionsStep onContinue={() => setStep("FORM")} />
          )}

          {step === "FORM" && (
            <FormStep
              formData={formData}
              errors={errors}
              selectedFile={selectedFile}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
            />
          )}

          {step === "PLAN" && (
            <PlanStep
              selectedPlan={selectedPlan}
              onPlanSelect={handlePlanSelection}
              onContinue={() => setStep("PAYMENT")}
            />
          )}

          {step === "PAYMENT" && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <PaymentMethodSelector
                onSelectPix={() => handlePaymentMethodSelect("PIX")}
                onSelectCreditCard={() => handlePaymentMethodSelect("CREDIT_CARD")}
              />
            </div>
          )}

          {step === "PIX" && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <PixPaymentScreen />
            </div>
          )}

          <div className="bg-white/80 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔒</span>
              <h3 className="text-base font-medium">Seus dados estão seguros</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Seus dados pessoais são utilizados apenas para o processamento do pagamento e emissão de nota fiscal. Não
              compartilhamos suas informações com terceiros.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 