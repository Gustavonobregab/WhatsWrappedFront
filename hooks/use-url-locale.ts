"use client"

import { usePathname } from 'next/navigation';

export function useUrlLocale() {
  const pathname = usePathname();
  
  // Extrair locale da URL diretamente
  const urlLocale = pathname.split('/')[1];
  const validLocales = ['pt', 'en', 'es'];
  
  // Se o locale da URL for válido, usar ele; senão usar 'pt' como padrão
  const currentLocale = validLocales.includes(urlLocale) ? urlLocale : 'pt';
  
  return currentLocale as 'pt' | 'en' | 'es';
}
