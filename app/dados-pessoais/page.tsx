"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function DadosPessoaisPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cellphone: "",
    cpf: "",
    loveMessage: "", // Nova propriedade para a mensagem de amor
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cellphone: "",
    cpf: "",
    loveMessage: "",
  })
  const [loveMessageLength, setLoveMessageLength] = useState(0) // Contador de caracteres
  const router = useRouter()

  // Verificar se o arquivo foi selecionado
  useEffect(() => {
    const fileSelected = sessionStorage.getItem("fileSelected")

    if (!fileSelected) {
      toast({
        title: "Arquivo não selecionado",
        description: "Por favor, selecione um arquivo de conversa do WhatsApp.",
        variant: "destructive",
      })
      router.push("/comece-agora")
      return
    }
  }, [router])

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      email: "",
      cellphone: "",
      cpf: "",
      loveMessage: "",
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
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (!formData.cpf.trim() || !cpfRegex.test(formData.cpf)) {
      newErrors.cpf = "CPF inválido (formato: 999.999.999-99)"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // Formatação do CPF
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
    } else if (name === "loveMessage") {
      // Limitar a mensagem de amor a 200 caracteres
      if (value.length <= 200) {
        setFormData({ ...formData, [name]: value })
        setLoveMessageLength(value.length)
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Salvar a mensagem de amor no sessionStorage
      if (formData.loveMessage) {
        sessionStorage.setItem("loveMessage", formData.loveMessage)
      }

      // 1. Registrar o usuário
      // Formatando o CPF para remover pontos e traços
      const cpfFormatted = formData.cpf.replace(/\D/g, "")

      const registerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.cellphone.replace(/\D/g, ""), // Remover formatação do telefone
        cpf: cpfFormatted,
      }

      console.log("Enviando dados de registro:", registerData)

      try {
        const registerResponse = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        })

        if (!registerResponse.ok) {
          const registerResult = await registerResponse.json()
          console.error("Erro no registro:", registerResult)

          // Se for um erro de usuário já existente, podemos continuar
          if (registerResponse.status !== 409) {
            throw new Error(registerResult.error || "Erro ao registrar usuário")
          }
        }
      } catch (error) {
        console.error("Erro na requisição de registro:", error)
        // Não lançar erro aqui para permitir continuar com o pagamento
      }

      // 2. Gerar o pagamento PIX
      const paymentData = {
        name: formData.name,
        email: formData.email,
        cellphone: formData.cellphone,
        cpf: formData.cpf,
      }

      try {
        const paymentResponse = await fetch("/api/v1/payment/pix/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        })

        if (!paymentResponse.ok) {
          const paymentError = await paymentResponse.text()
          throw new Error(`Erro ao gerar pagamento: ${paymentError}`)
        }

        const paymentResult = await paymentResponse.json()

        if (!paymentResult.success || !paymentResult.data) {
          throw new Error("Resposta inválida da API de pagamento")
        }

        sessionStorage.setItem("paymentData", JSON.stringify(paymentResult))
      } catch (error) {
        console.error("Erro ao gerar pagamento:", error)
        throw error
      }

      // Armazenar os dados do usuário
      sessionStorage.setItem("userData", JSON.stringify(formData))

      // Redirecionar para a página de pagamento
      router.push("/pagamento")
    } catch (error: any) {
      console.error("Erro ao processar:", error)
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600/10 to-background">
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/comece-agora">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Seus dados para pagamento</h1>
        </div>

        <div className="max-w-md mx-auto">
          {/* Barra de progresso */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-20 h-2 rounded-full ${
                    i <= 3 ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary">Exportar</span>
              <span className="text-primary">Upload</span>
              <span className="text-primary">Dados</span>
              <span className="text-muted-foreground">Pagamento</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-3xl font-bold text-center mb-8">Preencha seus dados para pagamento</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="cellphone" className="text-lg">
                  Celular
                </Label>
                <Input
                  id="cellphone"
                  name="cellphone"
                  placeholder="(99) 99999-9999"
                  value={formData.cellphone}
                  onChange={handleInputChange}
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="loveMessage" className="text-lg flex items-center justify-between">
                  <span>Mensagem de amor (surpresa)</span>
                  <span className="text-sm text-muted-foreground">{loveMessageLength}/200</span>
                </Label>
                <Textarea
                  id="loveMessage"
                  name="loveMessage"
                  placeholder="Digite uma mensagem de amor que será exibida como surpresa no final do WhatsWrapped..."
                  value={formData.loveMessage}
                  onChange={handleInputChange}
                  className="text-lg min-h-[100px] resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  Esta mensagem será exibida como uma surpresa no final do WhatsWrapped.
                </p>
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
                      Continuar para pagamento
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

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
