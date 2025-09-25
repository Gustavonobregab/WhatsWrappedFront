"use client"

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function TestPage() {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Internacionalização</h1>
      <div className="space-y-4">
        <p><strong>Locale atual (useLocale):</strong> {locale}</p>
        <p><strong>Path atual:</strong> {pathname}</p>
        <p><strong>Locale da URL:</strong> {pathname.split('/')[1]}</p>
        <hr />
        <p><strong>Marca:</strong> {t('common.brand')}</p>
        <p><strong>Título do Hero:</strong> {t('hero.title')}</p>
        <p><strong>Botão Começar:</strong> {t('common.startNow')}</p>
      </div>
      <div className="mt-4">
        <a href="/pt/test" className="text-blue-500 hover:underline mr-4">Português</a>
        <a href="/en/test" className="text-blue-500 hover:underline mr-4">English</a>
        <a href="/es/test" className="text-blue-500 hover:underline">Español</a>
      </div>
    </div>
  );
}