"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Loader2, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { PixPaymentScreen } from "@/components/pix-payment-screen"

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

  const fileInputRef = useRef<HTMLInputElement>(null)
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
      setErrors({ ...errors, file: "Por favor, selecione um arquivo ZIP exportado do seu aplicativo de mensagens." })
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
      newErrors.file = "Por favor, selecione um arquivo de backup do seu aplicativo de mensagens"
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
              file: "O arquivo enviado não é válido para o ZapLove. Por favor, entre em contato com nosso suporte através do WhatsApp: (83) 99935-9977"
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
            file: "O arquivo enviado não é válido para o Zaplove. Por favor, entre em contato com nosso suporte através do WhatsApp: (83) 99935-9977"
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

  const handlePlanSelection = (plan: "BASIC" | "PREMIUM") => {
    setSelectedPlan(plan);
    // Update userData with the selected plan
    const updatedUserData = {
      ...userData,
      plan: plan
    };
    setUserData(updatedUserData);
    sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
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

  const getTotalSteps = () => {
    return step === "PIX" ? 4 : 4;
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
          
          {step === "INSTRUCTIONS" && (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-center">
    <h2 className="text-3xl font-bold mb-8">Como exportar sua conversa</h2>

    <div className="flex flex-col gap-12 items-center">
      {/* Passo 1 */}
      <div className="space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold mx-auto">
          1
        </div>
        <h4 className="text-xl font-bold">Abra a conversa</h4>
        <p className="text-muted-foreground">
          Selecione a conversa que você deseja analisar.
        </p>
        <img
          src="/whatsapp-chat.png"
          alt="Abrir conversa"
          className="rounded-xl border-4 border-background shadow-lg w-full max-w-[620px] mx-auto"
        />
      </div>

      {/* Passo 2 */}
      <div className="space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold mx-auto">
          2
        </div>
        <h4 className="text-xl font-bold">Clique em exportar conversa</h4>
        <p className="text-muted-foreground">
          Toque nos três pontos no canto superior direito, role para baixo e selecione 'Exportar conversa'.
        </p>
        <img
          src="/whatsapp-export.png"
          alt="Exportar chat"
          className="rounded-xl border-4 border-background shadow-lg w-full max-w-[620px] mx-auto"
        />
      </div>

      {/* Passo 3 */}
      <div className="space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold mx-auto">
          3
        </div>
        <h4 className="text-xl font-bold">Escolha "Sem mídia"</h4>
        <p className="text-muted-foreground">
          Selecione a opção 'Sem mídia' para exportar apenas o texto das conversas, criando um arquivo menor e mais fácil de processar.
        </p>
        <img
          src="/whatsapp-sem-midia.png"
          alt="Escolher sem mídia"
          className="rounded-xl border-4 border-background shadow-lg w-full max-w-[620px] mx-auto"
        />
      </div>
    </div>

    <div className="mt-12">
      <Button
        size="lg"
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-8 px-10"
        onClick={() => setStep("FORM")}
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Já exportei, continuar
      </Button>
    </div>
  </div>
)}


          {step === "FORM" && (
            // Tela de formulário
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-3xl font-bold text-center mb-8">Preencha seus dados e faça upload do arquivo</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mensagem de amor surpresa - Agora como primeiro campo */}
                <div className="space-y-2">
                  <Label htmlFor="text" className="flex items-center gap-2 text-lg">
                    <span className="bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text font-bold text-xl">
                      ❤️ Mensagem de amor surpresa ❤️
                    </span>
                    <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full animate-pulse">
                      Especial!
                    </span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="text"
                      name="text"
                      placeholder="Querido(a), cada mensagem que trocamos é um pedacinho da nossa história. Obrigado(a) por fazer parte da minha vida e por todos os momentos que compartilhamos através dessas conversas..."
                      value={formData.text}
                      onChange={handleInputChange}
                      className="text-lg min-h-[120px] resize-none border-pink-200 focus-visible:ring-pink-400 bg-gradient-to-br from-pink-50 to-white"
                      maxLength={199}
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-pink-500 font-medium">
                      {formData.text.length}/199
                    </div>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                    <p className="text-sm text-pink-700 flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      Esta mensagem especial será exibida como uma surpresa romântica no final do WhatsWrapped, criando
                      um momento inesquecível para quem receber.
                    </p>
                  </div>
                </div>

                {/* Campos de nome, email e CPF */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`text-lg py-6 ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`text-lg py-6 ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cpf" className="text-lg">
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder="999.999.999-99"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className={`text-lg py-6 ${errors.cpf ? "border-red-500" : ""}`}
                    />
                    {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cellphone" className="text-lg">
                    Celular (com DDD)
                  </Label>
                  <Input
                    id="cellphone"
                    name="cellphone"
                    placeholder="11999999999"
                    value={formData.cellphone}
                    onChange={handleInputChange}
                    className={`text-lg py-6 ${errors.cellphone ? "border-red-500" : ""}`}
                  />
                  {errors.cellphone && <p className="text-xs text-red-500">{errors.cellphone}</p>}
                </div>

                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="h-16 w-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-medium">Arraste seu arquivo aqui ou clique para selecionar</h3>
                    <p className="text-sm text-muted-foreground">Arquivos .zip (máx. 30MB)</p>
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".zip"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                        disabled={isLoading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {selectedFile ? "Arquivo selecionado: " + selectedFile.name : "Selecionar Arquivo"}
                      </Button>
                    </div>
                    {errors.file && (
                      <p className="text-sm text-red-500 font-medium mt-2">
                        {errors.file}
                      </p>
                    )}
                    {selectedFile && !errors.file && (
                      <p className="text-sm text-green-600">
                        Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === "PLAN" && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-3xl font-bold text-center mb-8">Escolha seu ZapLove</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Plano PREMIUM */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-full"
                    onClick={() => handlePlanSelection("PREMIUM")}
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
                    onClick={() => handlePlanSelection("BASIC")}
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
                  onClick={() => setStep("PAYMENT")}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === "PAYMENT" && (
            // Tela de seleção de método de pagamento
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <PaymentMethodSelector
                onSelectPix={() => handlePaymentMethodSelect("PIX")}
                onSelectCreditCard={() => handlePaymentMethodSelect("CREDIT_CARD")}
              />
            </div>
          )}

          {step === "PIX" && (
            // Tela de pagamento PIX
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
