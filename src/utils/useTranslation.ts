// utils/useTranslation.ts (improved version)
"use client";

import { useParams, usePathname } from "next/navigation";
import en from "@/locales/en/common.json";
import es from "@/locales/es/common.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<string, any> = { en, es };

// Custom hook to get current locale
export function useCurrentLocale(): string {
  const params = useParams();
  const pathname = usePathname();
  
  // Try to get locale from params first
  if (params?.locale) {
    const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
    if (['en', 'es'].includes(locale)) {
      return locale;
    }
  }
  
  // Fallback: extract from pathname
  const pathSegments = pathname.split('/');
  const possibleLocale = pathSegments[1];
  if (['en', 'es'].includes(possibleLocale)) {
    return possibleLocale;
  }
  
  return 'en'; // default
}

// Translation hook
export function useTranslation<T = string>() {
  const locale = useCurrentLocale();
  
  return {
    t: (key: string, vars: Record<string, string> = {}): T => {
      const dict = dictionaries[locale] || dictionaries["en"];
      const value = key.split(".").reduce((obj, k) => obj?.[k], dict);
      let text: unknown = typeof value === "string" ? value : value;

      Object.keys(vars).forEach((v) => {
        if (typeof text === "string") text = text.replace(`{{${v}}}`, vars[v]);
      });

      return text as T;
    },
    locale
  };
}