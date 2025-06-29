"use client"

import type React from "react"
import { useState, useRef } from "react"
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

type Step = "INSTRUCTIONS" | "FORM" | "PAYMENT" | "PIX"

export default function ComecePage() {
  const [step, setStep] = useState<Step>("INSTRUCTIONS")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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

      console.log("Moving to payment step");
      setStep("PAYMENT");

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
          body: JSON.stringify({ name: userData.name, email: userData.email }),
          headers: { "Content-Type": "application/json" },
        });
  
        const data = await res.json();
        if (data?.url) {
          window.location.href = data.url;
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
        setStep("INSTRUCTIONS");
        break;
      case "PAYMENT":
        setStep("FORM");
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
      case "PAYMENT": return 3;
      case "PIX": return 3;
      default: return 1;
    }
  };

  const getTotalSteps = () => {
    return step === "PIX" ? 3 : 3;
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
                    <h1 className="text-2xl font-bold">Vamos criar seu WhatsWrapped! 🎉</h1>
                  </div>

                  <div className="max-w-2xl mx-auto">
                  {/* Barra de progresso */}
          <div className="mb-8">
            <div className="flex mb-2">
              {[1, 2, 3].map((i, idx) => (
                <div
                  key={i}
                  className={`h-4 rounded-full transition-colors duration-300 ${
                    i <= getStepNumber(step) ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-muted"
                  } ${idx < 2 ? "mr-2" : ""} flex-1`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className={getStepNumber(step) >= 1 ? "text-primary" : "text-muted-foreground"}>
                Instruções
              </span>
              <span className={getStepNumber(step) >= 2 ? "text-primary" : "text-muted-foreground"}>
                Upload
              </span>
              <span className={getStepNumber(step) === 3 ? "text-primary" : "text-muted-foreground"}>
                Pagamento
              </span>
            </div>
          </div>
          
          {step === "INSTRUCTIONS" && (
            // Tela de instruções
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-3xl font-bold text-center mb-8">Como exportar sua conversa do WhatsApp</h2>

              <div className="grid gap-8 md:gap-12">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold">
                      1
                    </div>
                    <h4 className="text-xl font-bold">Abra a conversa no WhatsApp</h4>
                    <p className="text-muted-foreground">
                      Selecione a conversa ou grupo que você deseja analisar no seu WhatsApp.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[250px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl transform rotate-3"></div>
                      <img
                        src="/whatsapp-chat.png"
                        alt="Abrir conversa no WhatsApp"
                        className="relative z-10 rounded-xl border-4 border-background shadow-lg w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3 text-center md:text-left md:order-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold">
                      2
                    </div>
                    <h4 className="text-xl font-bold">Clique em exportar chat</h4>
                    <p className="text-muted-foreground">
                      Toque nos três pontos no canto superior direito, role para baixo e selecione 'Exportar conversa'.
                    </p>
                  </div>
                  <div className="flex justify-center md:order-1">
                    <div className="relative w-full max-w-[250px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl transform -rotate-3"></div>
                      <img
                        src="/whatsapp-export.png"
                        alt="Exportar chat no WhatsApp"
                        className="relative z-10 rounded-xl border-4 border-background shadow-lg w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold">
                      3
                    </div>
                    <h4 className="text-xl font-bold">Escolha 'Sem mídia'</h4>
                    <p className="text-muted-foreground">
                      Selecione a opção 'Sem mídia' para exportar apenas o texto das conversas, criando um arquivo menor
                      e mais fácil de processar.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[250px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl transform rotate-3"></div>
                      <img
                        src="/whatsapp-sem-midia.png"
                        alt="Escolher sem mídia"
                        className="relative z-10 rounded-xl border-4 border-background shadow-lg w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
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
                    <p className="text-sm text-muted-foreground">Arquivos .zip do WhatsApp (máx. 30MB)</p>
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
              <PixPaymentScreen userData={userData} />
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
