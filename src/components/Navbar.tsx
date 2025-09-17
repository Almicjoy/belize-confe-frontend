"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/utils/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher";
import { palette } from "@/lib/palette";
import AccountMenu from "./AccountMenu";
import { useRouter } from "next/navigation";

interface NavbarProps {
  headerRef: React.RefObject<HTMLElement | null>;
  scrollToTop: () => void;
  scrollToConnect: () => void;
  scrollToAbout: () => void;
  locale: string | string[];
}

const Navbar: React.FC<NavbarProps> = ({
  scrollToTop,
  scrollToConnect,
  scrollToAbout,
  locale,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const { t } = useTranslation();

  const getHeaderHeight = () => headerRef.current?.offsetHeight || 0;

  return (
    <nav
      ref={headerRef}
      className="w-full px-2 py-4 fixed top-0 z-20 backdrop-blur-sm"
      style={{ backgroundColor: palette.hobbyBg }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
          </div>
          <span className="text-xl font-bold" style={{ color: palette.primary }}>
            {t("laconfe")}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <MenuButton text={t("home")} onClick={() => {
                  router.push("/")
                }} palette={palette} />
          <MenuButton text={t("promos")} onClick={scrollToConnect} palette={palette} />
          <MenuButton text={t("preconfe")} onClick={scrollToAbout} palette={palette} />
          <AccountMenu/>
          <LanguageSwitcher/>
          
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: palette.text }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
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
        <div
          className="md:hidden fixed top-0 left-0 right-0 z-30"
          style={{ backgroundColor: palette.hobbyBg, marginTop: `${getHeaderHeight()}px` }}
        >
          <div className="px-2 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <MenuButton
                text={t("home")}
                onClick={() => {
                  router.push("/")
                }}
                palette={palette}
                mobile
              />
              <MenuButton
                text={t("promos")}
                onClick={() => {
                  scrollToConnect();
                  setIsMobileMenuOpen(false);
                }}
                palette={palette}
                mobile
              />
              <MenuButton
                text={t("preconfe")}
                onClick={() => {
                  scrollToAbout();
                  setIsMobileMenuOpen(false);
                }}
                palette={palette}
                mobile
              />
              <AccountMenu/>
              <LanguageSwitcher/>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

interface MenuButtonProps {
  text: string;
  onClick: () => void;
  palette: { primary: string; text: string };
  mobile?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ text, onClick, palette, mobile }) => (
  <button
    onClick={onClick}
    className={`${
      mobile ? "px-4 py-3 text-left rounded-lg hover:bg-gray-100 transition-colors duration-200" : "px-4 py-2 font-medium relative group"
    }`}
    style={{ color: palette.text }}
  >
    {text}
    {!mobile && (
      <span
        className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0"
        style={{ backgroundColor: palette.primary }}
      ></span>
    )}
  </button>
);

export default Navbar;
