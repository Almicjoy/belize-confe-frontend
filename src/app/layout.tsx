"use client"

import Link from "next/link";
import "./globals.css";
import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/utils/useTranslation";




export default function RootLayout({ children }: { children: React.ReactNode }) {

  const headerRef = useRef<HTMLElement>(null);
  const connectRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const { t, locale } = useTranslation();
    

  const getHeaderHeight = () => headerRef.current?.offsetHeight || 0;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToConnect = () => {
    if (connectRef.current) {
      window.scrollTo({
        top: connectRef.current.offsetTop - getHeaderHeight(),
        behavior: "smooth",
      });
    }
  };

  const scrollToAbout = () => {
    if (aboutRef.current) {
      window.scrollTo({
        top: aboutRef.current.offsetTop - getHeaderHeight(),
        behavior: "smooth",
      });
    }
  };
  return (
    <html lang="en">
      <body>
        
        <nav className="p-4 bg-gray-200">
        <Navbar 
          locale={locale}
          headerRef={headerRef}
          scrollToTop={scrollToTop}
          scrollToConnect={scrollToConnect}
          scrollToAbout={scrollToAbout}
        />
        </nav>
        <main className="">{children}
          <div id="modal-root"></div>
        </main>
      </body>
    </html>
  );
}



