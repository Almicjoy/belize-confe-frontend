"use client";
import React, { useRef } from "react";
import MemberDirectory from "@/components/MemberDirectory";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/utils/useTranslation";
import { palette } from "@/lib/palette";

export default function Home() {
  const headerRef = useRef<HTMLElement>(null);
  const connectRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const accommodationRef = useRef<HTMLElement>(null);
  
  const { t, locale } = useTranslation();
  
  console.log('Page - Current locale:', locale); // Debug

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
    <div 
      className="min-h-screen w-full relative font-poppins overflow-x-hidden"
      style={{ background: palette.background }}
    >


      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: palette.primary }}
        />
        <div 
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-5"
          style={{ backgroundColor: palette.secondary }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: palette.middayLight }}
        />
      </div>

      {/* Navbar */}


      {/* Main content */}
      <MemberDirectory 
        headerRef={headerRef}
        connectRef={connectRef}
        aboutRef={aboutRef}
        accommodationRef={accommodationRef}
      />
    </div>
  );
}