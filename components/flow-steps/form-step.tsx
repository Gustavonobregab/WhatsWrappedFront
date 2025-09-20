"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2, ArrowRight } from "lucide-react"
import { useTranslations } from 'next-intl';

interface FormData {
  name: string
  email: string
  cpf: string
  cellphone: string
  text: string
}

interface FormErrors {
  name: string
  email: string
  cpf: string
  cellphone: string
  file: string
}

interface FormStepProps {
  formData: FormData
  errors: FormErrors
  selectedFile: File | null
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function FormStep({
  formData,
  errors,
  selectedFile,
  isLoading,
  onInputChange,
  onFileChange,
  onSubmit
}: FormStepProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-3xl font-bold text-center mb-8">{t('form.title')}</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Mensagem de amor surpresa */}
        <div className="space-y-2">
          <Label htmlFor="text" className="flex items-center gap-2 text-lg">
            <span className="bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text font-bold text-xl">
              {t('form.loveMessage.label')}
            </span>
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full animate-pulse">
              {t('form.loveMessage.special')}
            </span>
          </Label>
          <div className="relative">
            <Textarea
              id="text"
              name="text"
              placeholder={t('form.loveMessage.placeholder')}
              value={formData.text}
              onChange={onInputChange}
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
              {t('form.loveMessage.description')}
            </p>
          </div>
        </div>

        {/* Campos de nome, email e CPF */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">
              {t('form.fields.name')}
            </Label>
            <Input
              id="name"
              name="name"
              placeholder={t('form.fields.namePlaceholder')}
              value={formData.name}
              onChange={onInputChange}
              className={`text-lg py-6 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">
              {t('form.fields.email')}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('form.fields.emailPlaceholder')}
              value={formData.email}
              onChange={onInputChange}
              className={`text-lg py-6 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cpf" className="text-lg">
              {t('form.fields.cpf')}
            </Label>
            <Input
              id="cpf"
              name="cpf"
              placeholder={t('form.fields.cpfPlaceholder')}
              value={formData.cpf}
              onChange={onInputChange}
              className={`text-lg py-6 ${errors.cpf ? "border-red-500" : ""}`}
            />
            {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cellphone" className="text-lg">
            {t('form.fields.cellphone')}
          </Label>
          <Input
            id="cellphone"
            name="cellphone"
            placeholder={t('form.fields.cellphonePlaceholder')}
            value={formData.cellphone}
            onChange={onInputChange}
            className={`text-lg py-6 ${errors.cellphone ? "border-red-500" : ""}`}
          />
          {errors.cellphone && <p className="text-xs text-red-500">{errors.cellphone}</p>}
        </div>

        {/* Upload de arquivo */}
        <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-2xl font-medium">{t('form.upload.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('form.upload.description')}</p>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".zip"
                onChange={onFileChange}
                disabled={isLoading}
              />
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? t('form.upload.fileSelected') + selectedFile.name : t('form.upload.selectFile')}
              </Button>
            </div>
            {errors.file && (
              <p className="text-sm text-red-500 font-medium mt-2">
                {errors.file}
              </p>
            )}
            {selectedFile && !errors.file && (
              <p className="text-sm text-green-600">
                {t('form.upload.fileInfo', { name: selectedFile.name, size: (selectedFile.size / 1024 / 1024).toFixed(2) })}
              </p>
            )}
          </div>
        </div>

        <div className="pt-8">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('form.processing')}
              </>
            ) : (
              <>
                {t('form.continue')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 