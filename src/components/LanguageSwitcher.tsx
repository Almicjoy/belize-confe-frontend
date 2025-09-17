"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentLocale } from "@/utils/useTranslation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useCurrentLocale();

  const switchLocale = (newLocale: string) => {
    // Replace the current locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace locale segment
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => switchLocale("en")}
        className={`px-3 py-1 rounded transition-colors ${
          currentLocale === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button 
        onClick={() => switchLocale("es")}
        className={`px-3 py-1 rounded transition-colors ${
          currentLocale === 'es' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        Español
      </button>
    </div>
  );
}