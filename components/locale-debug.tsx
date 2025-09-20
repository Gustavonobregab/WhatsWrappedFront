"use client"

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export function LocaleDebug() {
  const locale = useLocale();
  const pathname = usePathname();
  
  // Extrair locale da URL
  const urlLocale = pathname.split('/')[1];
  
  // Verificar se o locale da URL é válido
  const validLocales = ['pt', 'en', 'es'];
  const isValidUrlLocale = validLocales.includes(urlLocale);
  
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-3 rounded text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">🔍 Debug Info:</div>
      <div>useLocale(): <span className="font-semibold text-yellow-300">{locale}</span></div>
      <div>URL Path: <span className="font-semibold text-blue-300">{pathname}</span></div>
      <div>URL Locale: <span className="font-semibold text-green-300">{urlLocale}</span></div>
      <div>Valid URL Locale: <span className={`font-semibold ${isValidUrlLocale ? 'text-green-300' : 'text-red-300'}`}>
        {isValidUrlLocale ? '✅' : '❌'}
      </span></div>
      <div className="mt-2 text-xs text-gray-300">
        Expected: URL locale should match useLocale()
      </div>
    </div>
  );
}
