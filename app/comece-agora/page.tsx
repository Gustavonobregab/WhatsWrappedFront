"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Loader2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ComecePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    text: "Obrigado por compartilhar essa jornada comigo!", // Valor padrão para garantir que nunca esteja vazio
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cpf: "",
    file: "",
  })
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
    } else {
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

    // Verificar o tamanho do arquivo (limite de 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB em bytes
    if (file.size > MAX_FILE_SIZE) {
      setErrors({
        ...errors,
        file: "O tamanho máximo permitido é de 10MB. Por favor, selecione um arquivo menor.",
      })
      return
    }

    setSelectedFile(file)
    setErrors({ ...errors, file: "" })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      email: "",
      cpf: "",
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
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (!formData.cpf.trim() || !cpfRegex.test(formData.cpf)) {
      newErrors.cpf = "CPF inválido (formato: 999.999.999-99)"
      valid = false
    }

    // Validação do arquivo
    if (!selectedFile) {
      newErrors.file = "Por favor, selecione um arquivo de backup do WhatsApp"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Criar FormData para enviar arquivo e dados do usuário
      const formDataToSend = new FormData()

      // Adicionar todos os campos obrigatórios
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("cpf", formData.cpf.replace(/\D/g, "")) // Remover formatação

      // Garantir que o texto nunca esteja vazio
      const textToSend = formData.text.trim() || "Obrigado por compartilhar essa jornada comigo!"
      formDataToSend.append("text", textToSend)

      // Adicionar o arquivo
      if (selectedFile) {
        formDataToSend.append("file", selectedFile)
      }

      console.log("Enviando dados:", {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ""),
        text: textToSend,
        file: selectedFile ? `${selectedFile.name} (${selectedFile.size} bytes)` : "AUSENTE",
      })

      // Enviar para a API
      const response = await fetch("/api/v1/metrics/upload", {
        method: "POST",
        body: formDataToSend,
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("Erro na resposta:", responseData)
        throw new Error(responseData.message || "Erro ao processar o arquivo")
      }

      console.log("Resposta da API:", responseData)

      // Salvar dados na sessão
      sessionStorage.setItem(
        "userData",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
        }),
      )

      if (formData.text) {
        sessionStorage.setItem("loveMessage", formData.text)
      }

      // Salvar métricas na sessão
      if (responseData.metrics && responseData.metrics.participants) {
        sessionStorage.setItem("metricsData", JSON.stringify(responseData.metrics.participants))

        // Salvar ID único para uso posterior
        if (responseData.metrics.id) {
          sessionStorage.setItem("metricsId", responseData.metrics.id)
        }
      }

      toast({
        title: "Arquivo processado com sucesso!",
        description: "Suas métricas foram extraídas. Continue para o pagamento.",
      })

      // Redirecionar para a página de pagamento
      router.push("/pagamento")
    } catch (error: any) {
      console.error("Erro ao processar arquivo:", error)
      toast({
        title: "Erro ao processar arquivo",
        description: error.message || "Ocorreu um erro ao processar seu arquivo.",
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
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Vamos criar seu WhatsWrapped! 🎉</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Barra de progresso */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-full h-2 rounded-full ${
                    i <= 1 ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary">Cadastro e Upload</span>
              <span className="text-muted-foreground">Pagamento</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-3xl font-bold text-center mb-8">Preencha seus dados e faça upload do arquivo</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    maxLength={200}
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-pink-500 font-medium">
                    {formData.text.length}/200
                  </div>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                  <p className="text-sm text-pink-700 flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    Esta mensagem especial será exibida como uma surpresa romântica no final do WhatsWrapped, criando um
                    momento inesquecível para quem receber.
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-medium">Arraste seu arquivo aqui ou clique para selecionar</h3>
                  <p className="text-sm text-muted-foreground">Arquivos .zip do WhatsApp (máx. 10MB)</p>
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
                  {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}
                  {selectedFile && (
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
