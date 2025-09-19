"use client"

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export function LocaleDebug() {
  const locale = useLocale();
  const pathname = usePathname();
  
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
      <div>Current Locale: {locale}</div>
      <div>Current Path: {pathname}</div>
      <div>URL Locale: {pathname.split('/')[1]}</div>
    </div>
  );
}
