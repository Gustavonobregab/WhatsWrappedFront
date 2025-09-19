import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // Lista de idiomas suportados
  locales,
  
  // Idioma padrão
  defaultLocale,
  
  // Desabilitar detecção automática para evitar conflitos
  localeDetection: false,
  
  // Sempre mostrar o prefixo do idioma
  localePrefix: 'always'
});

export const config = {
  // Matcher para aplicar o middleware em todas as rotas exceto arquivos estáticos e APIs
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
