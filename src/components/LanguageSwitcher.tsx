"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentLocale } from "@/utils/useTranslation";
import { Globe } from "lucide-react";

const palette = {
  background: "#ffffffff",
  cardBg: "#FFFFFF",
  cardBorder: "#b2f3ffff",
  cardShadow: "0 4px 12px rgba(60, 190, 255, 0.08)",
  accent: "#00d0ffff",
  primary: "#3cc4ffff",
  secondary: "#66f2ffff",
  tertiary: "#509cffff",
  midday: "#2C5282",
  middayLight: "#4299E1",
  middayDark: "#1A365D",
  text: "#2D2D2D",
  textSecondary: "#7F8C8D",
  textLight: "#B0B0B0",
  hobbyBg: "#e0fcffff",
  hobbyText: "#3c6dffff",
  success: "#4CAF50",
  white: "#FFFFFF",
  lightOrange: "#f0feffff",
} as const;

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

  const languages = [
    { code: "en", label: "EN", fullName: "English" },
    { code: "es", label: "ES", fullName: "Español" }
  ];

  return (
    <div className="relative inline-flex items-center">
      {/* Language Switcher Container */}
      <div 
        className="flex items-center rounded-full p-1 shadow-sm border transition-all duration-300 hover:shadow-md"
        style={{ 
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
          boxShadow: palette.cardShadow
        }}
      >
        {/* Globe Icon */}
        <div className="flex items-center justify-center w-8 h-8 mr-1">
          <Globe size={14} style={{ color: palette.primary }} />
        </div>

        {/* Language Buttons */}
        <div className="flex relative">
          {languages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => switchLocale(language.code)}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                index === 0 ? 'mr-1' : ''
              }`}
              style={{
                color: currentLocale === language.code ? palette.white : palette.text,
                backgroundColor: currentLocale === language.code 
                  ? 'transparent' 
                  : 'transparent',
                zIndex: currentLocale === language.code ? 2 : 1,
              }}
              title={language.fullName}
            >
              {/* Active Background */}
              {currentLocale === language.code && (
                <div
                  className="absolute inset-0 rounded-full shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                    zIndex: -1,
                  }}
                />
              )}
              
              {/* Hover Background for Inactive */}
              {currentLocale !== language.code && (
                <div
                  className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
                  style={{
                    backgroundColor: palette.hobbyBg,
                    zIndex: -1,
                  }}
                />
              )}
              
              <span className="relative z-10">{language.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}