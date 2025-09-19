import { getRequestConfig } from 'next-intl/server';

// Idiomas suportados
export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

// Idioma padrão
export const defaultLocale: Locale = 'pt';

export default getRequestConfig(async ({ locale }) => {
  console.log('i18n.ts - Locale recebido:', locale);
  
  // Se o locale for undefined ou não estiver na lista de idiomas suportados, usar o padrão
  const validLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;
  
  console.log('i18n.ts - Locale válido:', validLocale);
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});