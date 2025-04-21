"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Check, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function ComecePage() {
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValidFile, setIsValidFile] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setIsValidFile(false)
    setValidationMessage("")

    // Verificar se é um arquivo ZIP
    if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo ZIP exportado do WhatsApp.",
        variant: "destructive",
      })
      setIsUploading(false)
      return
    }

    // Verificar o tamanho do arquivo (limite de 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB em bytes
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é de 10MB. Por favor, selecione um arquivo menor.",
        variant: "destructive",
      })
      setIsUploading(false)
      return
    }

    // Armazenar o arquivo selecionado para uso posterior
    setSelectedFile(file)

    // Criar uma URL para o arquivo
    const fileURL = URL.createObjectURL(file)

    // Armazenar a URL do arquivo no sessionStorage
    sessionStorage.setItem("whatsappFileBlob", fileURL)
    sessionStorage.setItem("whatsappFile", file.name)
    sessionStorage.setItem("fileSelected", "true")

    // Simular o upload do arquivo
    setTimeout(() => {
      setIsUploading(false)
      setIsUploaded(true)

      // Iniciar validação do arquivo
      validateFile(file)
    }, 1500)
  }

  const validateFile = async (file: File) => {
    setIsValidating(true)

    try {
      // Criar um FormData para enviar o arquivo
      const formData = new FormData()
      formData.append("file", file)

      // Fazer a chamada real para a API
      const response = await fetch("/api/v1/validate-whatsapp-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Erro na validação: ${response.status}`)
      }

      const result = await response.json()
      console.log("Resposta da validação:", result)

      if (result.success && result.data && result.data.isValid) {
        // Arquivo válido
        setIsValidFile(true)
        setValidationMessage("Arquivo válido! Conversas detectadas com sucesso.")

        // Armazenar informação de validação
        sessionStorage.setItem("fileValidated", "true")
      } else {
        // Arquivo inválido
        setIsValidFile(false)
        setValidationMessage(result.error || "Não foi possível detectar conversas válidas do WhatsApp neste arquivo.")
        sessionStorage.removeItem("fileValidated")
      }
    } catch (error) {
      console.error("Erro ao validar arquivo:", error)
      setIsValidFile(false)
      setValidationMessage("Ocorreu um erro ao validar o arquivo. Por favor, tente novamente.")
      sessionStorage.removeItem("fileValidated")
    } finally {
      setIsValidating(false)
    }
  }

  const handleContinue = () => {
    if (step === 2) {
      if (!isUploaded) {
        toast({
          title: "Arquivo não selecionado",
          description: "Por favor, selecione um arquivo antes de continuar.",
          variant: "destructive",
        })
        return
      }

      if (!isValidFile) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo de conversa do WhatsApp válido.",
          variant: "destructive",
        })
        return
      }

      router.push("/dados-pessoais")
    } else {
      setStep(step + 1)
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
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-20 h-2 rounded-full ${
                    i <= step ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className={`${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>Exportar</span>
              <span className={`${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>Upload</span>
              <span className="text-muted-foreground">Dados</span>
              <span className="text-muted-foreground">Pagamento</span>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-3xl font-bold text-center mb-10">Como exportar seu chat do WhatsApp 📱</h2>

              <div className="space-y-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold mb-4">
                      1
                    </div>
                    <h3 className="text-2xl font-bold">Clique no seu contato</h3>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[300px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6"></div>
                      <img
                        src="/whatsapp-chat.png"
                        alt="Abra o WhatsApp"
                        className="relative z-10 rounded-3xl border-4 border-background shadow-xl w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left md:order-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold mb-4">
                      2
                    </div>
                    <h3 className="text-2xl font-bold">Clique em exportar chat</h3>
                  </div>
                  <div className="flex justify-center md:order-1">
                    <div className="relative w-full max-w-[300px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6"></div>
                      <img
                        src="/whatsapp-export.png"
                        alt="Exportar chat"
                        className="relative z-10 rounded-3xl border-4 border-background shadow-xl w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold mb-4">
                      3
                    </div>
                    <h3 className="text-2xl font-bold">Escolha "SEM MÍDIA"</h3>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[300px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-6"></div>
                      <img
                        src="/whatsapp-sem-midia.png"
                        alt="Escolha SEM MÍDIA"
                        className="relative z-10 rounded-3xl border-4 border-background shadow-xl w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                >
                  Já exportei! Próximo passo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-center mb-4">Faça upload do seu arquivo 🚀</h2>
              <p className="text-center mb-6 text-sm text-muted-foreground">
                Seus dados são processados localmente e <span className="font-bold">nunca</span> armazenados. 🔒
              </p>

              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                {!isUploaded ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="h-16 w-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-medium">Arraste seu arquivo aqui ou clique para selecionar</h3>
                    <p className="text-sm text-muted-foreground">Arquivos .zip do WhatsApp (máx. 10MB)</p>
                    <div className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".zip"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>Selecionar Arquivo</>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      {isValidating ? (
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                      ) : isValidFile ? (
                        <div className="rounded-full bg-green-100 p-5">
                          <Check className="h-12 w-12 text-green-600" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-red-100 p-5">
                          <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                      )}
                    </div>

                    <h3
                      className={`text-2xl font-medium ${
                        isValidating ? "text-primary" : isValidFile ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isValidating ? "Validando arquivo..." : isValidFile ? "Arquivo válido!" : "Arquivo inválido"}
                    </h3>

                    <p className="text-lg">
                      {selectedFile?.name} (
                      {(selectedFile?.size || 0) / 1024 / 1024 < 1
                        ? `${Math.round((selectedFile?.size || 0) / 1024)} KB`
                        : `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                      )
                    </p>

                    {validationMessage && (
                      <p className={`text-sm ${isValidFile ? "text-green-600" : "text-red-600"}`}>
                        {validationMessage}
                      </p>
                    )}

                    {!isValidFile && !isValidating && (
                      <div className="relative mt-4">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".zip"
                          onChange={handleFileUpload}
                        />
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                          Selecionar outro arquivo
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!isUploaded || !isValidFile || isValidating}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white/80 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="text-base font-medium">Dicas Rápidas</h3>
            </div>
            <div className="grid gap-2 md:grid-cols-2 text-sm">
              <div className="flex items-start gap-2">
                <span>🔒</span>
                <p>Seus dados pessoais são usados apenas para o pagamento.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>⚡</span>
                <p>Apenas arquivos .zip do WhatsApp são aceitos.</p>
              </div>
              <div className="flex items-start gap-2">
                <span>📏</span>
                <p>O tamanho máximo do arquivo é de 10MB.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
