import { getRequestConfig } from 'next-intl/server';

// Idiomas suportados
export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

// Idioma padrão
export const defaultLocale: Locale = 'pt';

export default getRequestConfig(async ({ locale }) => {
  // Se o locale for undefined, usar o padrão
  if (!locale) {
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }
  
  // Se o locale não estiver na lista de idiomas suportados, usar o padrão
  if (!locales.includes(locale as any)) {
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }
  
  return {
    locale: locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});