"use client"

import { useUrlLocale } from './use-url-locale';

export function useLocaleLink() {
  const locale = useUrlLocale();

  const createLink = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // If path is empty, return just the locale
    if (!cleanPath) {
      return `/${locale}`;
    }
    
    // Return path with locale prefix
    return `/${locale}/${cleanPath}`;
  };

  return { createLink };
}
