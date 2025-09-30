"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/utils/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher";
import { palette } from "@/lib/palette";
import AccountMenu from "./AccountMenu";
import { useRouter } from "next/navigation";

interface NavbarProps {
  headerRef: React.RefObject<HTMLElement | null>;
  scrollToTop: () => void;
  scrollToPlans: () => void;
  scrollToAccommodations: () => void;
  scrollToSponsors: () => void;
  scrollToPreconfe: () => void;
  locale: string | string[];
}

const Navbar: React.FC<NavbarProps> = ({
  scrollToTop,
  scrollToPlans,
  scrollToAccommodations,
  scrollToSponsors,
  scrollToPreconfe,
  locale,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolledPastLanding, setIsScrolledPastLanding] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const { t } = useTranslation();
  const isLoggedIn = status === "authenticated" && session;

  const getHeaderHeight = () => headerRef.current?.offsetHeight || 0;

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past the viewport height (landing area)
      const scrolledPastLanding = window.scrollY > window.innerHeight;
      setIsScrolledPastLanding(scrolledPastLanding);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine text color based on scroll position (only for desktop)
  const getDesktopTextColor = () => {
    return isScrolledPastLanding ? palette.textSecondary : palette.white;
  };

  // Mobile always uses white
  const getMobileTextColor = () => {
    return palette.textSecondary;
  };

  return (
    <nav
      ref={headerRef}
      className="w-full px-4 py-4 fixed top-0 z-20 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300"
      style={{ 
        backgroundColor: `${palette.hobbyBg}dd`, // Added transparency for glass effect
        borderBottomColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
          <div className="w-12 h-12 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="drop-shadow-sm" />
          </div>
          <span 
            className="text-xl font-bold tracking-tight transition-colors duration-300 group-hover:opacity-80" 
            style={{ color: palette.primary }}
          >
            {t("laconfe")}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!isLoggedIn ? (
            // Show navigation menu when not logged in
            <>
              <MenuButton 
                text={t("home")} 
                onClick={() => router.push("/")} 
                palette={palette} 
                textColor={getDesktopTextColor()}
              />
              <MenuButton 
                text={t("accommodations")} 
                onClick={scrollToAccommodations} 
                palette={palette}
                textColor={getDesktopTextColor()}
              />
              <MenuButton 
                text={t("promos")} 
                onClick={scrollToPlans} 
                palette={palette}
                textColor={getDesktopTextColor()}
              />
              <MenuButton 
                text={t("sponsors")} 
                onClick={scrollToSponsors} 
                palette={palette}
                textColor={getDesktopTextColor()}
              />
              <MenuButton 
                text={t("preconfe")} 
                onClick={scrollToPreconfe} 
                palette={palette}
                textColor={getDesktopTextColor()}
              />

              <AccountMenu locale={locale} />
              <LanguageSwitcher />
            </>
          ) : (
            // Show only AccountMenu and LanguageSwitcher when logged in
            <>
              <AccountMenu locale={locale} />
              <LanguageSwitcher />
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-3 rounded-xl transition-all duration-300 hover:bg-white/10 active:scale-95"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: getMobileTextColor() }} // Always white on mobile
        >
          <svg
            className="w-6 h-6 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            style={{
              transform: isMobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm"
            style={{ marginTop: `${getHeaderHeight()}px` }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div
            className="md:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-white/10 shadow-xl"
            style={{ 
              backgroundColor: palette.hobbyBg,
              marginTop: `${getHeaderHeight()}px`,
              borderBottomColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="px-4 py-6">
              <div className="flex flex-col space-y-1">
                {!isLoggedIn ? (
                  // Show navigation menu when not logged in
                  <>
                    <MenuButton
                      text={t("home")}
                      onClick={() => {
                        router.push("/");
                        setIsMobileMenuOpen(false);
                      }}
                      palette={palette}
                      textColor={getMobileTextColor()} // Always white on mobile
                      mobile
                    />
                    <MenuButton
                      text={t("accommodations")}
                      onClick={() => {
                        scrollToAccommodations();
                        setIsMobileMenuOpen(false);
                      }}
                      palette={palette}
                      textColor={getMobileTextColor()} // Always white on mobile
                      mobile
                    />
                    <MenuButton
                      text={t("promos")}
                      onClick={() => {
                        scrollToPlans();
                        setIsMobileMenuOpen(false);
                      }}
                      palette={palette}
                      textColor={getMobileTextColor()} // Always white on mobile
                      mobile
                    />
                    <MenuButton
                      text={t("sponsors")}
                      onClick={() => {
                        scrollToSponsors();
                        setIsMobileMenuOpen(false);
                      }}
                      palette={palette}
                      textColor={getMobileTextColor()} // Always white on mobile
                      mobile
                    />
                    <MenuButton
                      text={t("preconfe")}
                      onClick={() => {
                        scrollToPreconfe();
                        setIsMobileMenuOpen(false);
                      }}
                      palette={palette}
                      textColor={getMobileTextColor()} // Always white on mobile
                      mobile
                    />

                    <div className="pb-4 space-x-4 ml-4">
                      <AccountMenu locale={locale} />
                      <LanguageSwitcher  />
                    </div>

                  </>
                ) : (
                  // Show only AccountMenu and LanguageSwitcher when logged in
                  <>
                    <div className="pb-4">
                      <AccountMenu locale={locale} />
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <LanguageSwitcher />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Loading state overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}
    </nav>
  );
};

interface MenuButtonProps {
  text: string;
  onClick: () => void;
  palette: { primary: string; white: string; textSecondary: string };
  textColor: string;
  mobile?: boolean;
  className?: string; 
  style?: React.CSSProperties;
}

const MenuButton: React.FC<MenuButtonProps> = ({ text, onClick, palette, textColor, mobile }) => (
  <button
    onClick={onClick}
    className={`${
      mobile 
        ? "px-4 py-3 text-left rounded-xl hover:bg-white/5 active:bg-white/10 transition-all duration-300 font-medium" 
        : "px-5 py-2.5 font-medium relative group rounded-lg hover:bg-white/5 transition-all duration-300"
    }`}
    style={{ color: textColor }}
  >
    {text}
    {!mobile && (
      <>
        {/* Hover underline effect */}
        <span
          className="absolute bottom-1 left-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8"
          style={{ backgroundColor: palette.primary }}
        ></span>
        
        {/* Subtle glow effect on hover */}
        <span
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundColor: palette.primary }}
        ></span>
      </>
    )}
  </button>
);

export default Navbar;