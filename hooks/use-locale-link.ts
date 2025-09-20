"use client"

import { useLocale } from 'next-intl';

export function useLocaleLink() {
  const locale = useLocale();

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
