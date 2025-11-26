"use client";

import React, { useState, useMemo, useEffect, useRef, FC } from 'react';
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { palette } from "@/lib/palette";
import { useScrollRefs } from "@/utils/ScrollContext";

import { useTranslation } from "@/utils/useTranslation";
import ShowcasePlans from './ShowcasePlans';
import Accommodations from './Accommodations';
import SponsorsComponent from './Sponsors';
import { Instagram } from 'lucide-react';
import CountdownDrawer from './CountDown';

if (typeof document !== 'undefined' && !document.getElementById('google-font-poppins')) {
  const link = document.createElement('link');
  link.id = 'google-font-poppins';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
}


// interface MemberDirectoryProps {
//   headerRef: React.RefObject<HTMLElement | null>;
//   plansRef: React.RefObject<HTMLElement | null>;
//   accommodationRef: React.RefObject<HTMLElement | null>;
//   sponsorsRef: React.RefObject<HTMLElement | null>;
//   preconfeRef: React.RefObject<HTMLElement | null>;
// }

const MemberDirectory: React.FC = () => {
  const { locale } = useParams(); // pulls from [locale] in URL
  const { t } = useTranslation();
  const { plansRef, accommodationRef, sponsorsRef, preconfeRef } = useScrollRefs();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateWidth = () => setIsDesktop(window.innerWidth >= 768);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);


  useEffect(() => {
    const storedSearch = localStorage.getItem('hh_searchTerm');
    if (storedSearch !== null) setSearchTerm(storedSearch);
    const storedMember = localStorage.getItem('hh_selectedMember');
    if (storedMember !== null) setSelectedMemberId(parseInt(storedMember, 10));
    const storedInvited = localStorage.getItem('hh_invitedIds');
    if (storedInvited !== null) setInvitedIds(JSON.parse(storedInvited));
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    localStorage.setItem('hh_searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedMemberId !== null) {
      localStorage.setItem('hh_selectedMember', selectedMemberId.toString());
    } else {
      localStorage.removeItem('hh_selectedMember');
    }
  }, [selectedMemberId]);

  useEffect(() => {
    localStorage.setItem('hh_invitedIds', JSON.stringify(invitedIds));
  }, [invitedIds]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };


  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      addToast('Successfully subscribed to our newsletter!');
      setEmail('');
    }
  };

  const getHeaderHeight = () => {
    return headerRef.current?.offsetHeight || 0;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToAccommodations = () => accommodationRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToSponsors = () => sponsorsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToPreconfe = () => preconfeRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
    
      <section
        ref={heroRef}
        className="w-full min-h-screen px-2 py-20 pt-28 relative flex items-center overflow-hidden"
        style={{
          background: palette.background,
        }}
      >
        <CountdownDrawer/>
        {/* Background Video - only visible on large screens */}
        <div className="hidden lg:block absolute top-0 left-0 w-full h-full">
          <iframe
            className="w-full h-full object-cover"
            src="https://www.youtube.com/embed/7pJ0YCYm8MY?autoplay=1&mute=1&loop=1&playlist=7pJ0YCYm8MY&controls=0&modestbranding=1&showinfo=0&rel=0"
            title="Landing Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ pointerEvents: "none" }}
          ></iframe>
          <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-8 lg:col-span-2 items-center">
            <div className="w-full block lg:hidden px-4">
              <div className="relative bg-white rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                <iframe
                  className="w-full h-64 sm:h-80 object-cover rounded-xl"
                  src="https://www.youtube.com/embed/7pJ0YCYm8MY?autoplay=1&mute=1&loop=1&playlist=7pJ0YCYm8MY&controls=0&modestbranding=1&showinfo=0&rel=0"
                  title="Landing Video (Mobile)"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ pointerEvents: "none" }}
                ></iframe>

                {/* Polaroid caption strip */}

              </div>
            </div>
              <div className="space-y-6">
                <h1
                  className="text-5xl font-extrabold leading-tight text-center"
                  style={{ color: palette.primary }}
                >
                  {t("experienceBelize")}
                  <span className="block" style={{ color: palette.tertiary }}>
                    {t("experienceBelizeDesc1")}
                  </span>
                </h1>
                <p
                  className="text-xl leading-relaxed font-medium text-center"
                  style={{ color: palette.textSecondary }}
                >
                  {t("experienceBelizeDesc2")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                {/* Browse Promos Button */}
                <button
                  className="px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
                  style={{
                    backgroundColor: palette.primary,
                    color: palette.white,
                    boxShadow: `0 8px 25px ${palette.primary}30`,
                  }}
                  onClick={scrollToPlans}
                >
                  {t("browsePromos")}
                </button>

                {/* Instagram Button */}
                <a
                  href="https://www.instagram.com/laconfertc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer space-x-2"
                  style={{
                    backgroundColor: "#E1306C", // Instagram pink
                    color: palette.white,
                    boxShadow: `0 8px 25px #E1306C30`,
                    textAlign: "center",
                  }}
                >
                  <Instagram size={24} />
                  <span>Instagram</span>
                </a>
              </div>


            </div>

            {/* Logo and Mobile Video */}
            <div className="relative lg:col-span-1 flex flex-col items-center gap-6">
              <video
                src="/logo-animation.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-100 h-100 object-contain"
              />

              {/* Show video BELOW logo only on small screens */}
            </div>

          </div>
        </div>
      </section>

      <main ref={accommodationRef} className="w-full relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="w-full px-2 py-4">
            <Accommodations/>
        </div>
      </main>

      <main ref={plansRef} className="w-full relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="w-full px-2 py-4">
            <ShowcasePlans/>
        </div>
      </main>

      <main ref={sponsorsRef} className="w-full relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="w-full px-2 py-4">
            <SponsorsComponent/>
        </div>
      </main>

      <section ref={preconfeRef} className="w-full px-2 py-20 relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4" style={{ color: palette.primary }}>
              {t("preconfe2")}
            </h2>
            <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: palette.textSecondary }}>
              {t("preconfeComingSoon")}
            </p>
          </div>
        </div>
      </section>

      <footer className="w-full relative z-10" style={{ backgroundColor: palette.midday }}>
        <div className="max-w-7xl mx-auto px-2 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: palette.primary }}>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={60}
                    height={60}
                    className="w-9 h-9"
                />
                </div>
                <span className="text-lg font-bold" style={{ color: palette.white }}>
                  {t("laconfe")}
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: `${palette.white}C0` }}>
                {t("laconfeDesc")}
              </p>
            </div>

            <div>
              <h3
                className="text-sm font-semibold mb-4 uppercase tracking-wider"
                style={{ color: palette.white }}
              >
                {t("gettingToBelize")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.tropicair.com/belize-international-airport-bze/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                    style={{ color: `${palette.white}C0` }}
                  >
                    {t("airport")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.packasandwich.com/en/travel-blogs/crossing-the-belize-guatemala-border-by-car-complete-guide-1038/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                    style={{ color: `${palette.white}C0` }}
                  >
                    {t("border")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nayawalk.com/honduras/ferry/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                    style={{ color: `${palette.white}C0` }}
                  >
                    {t("ferry")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-sm font-semibold mb-4 uppercase tracking-wider"
                style={{ color: palette.white }}
              >
                {t("supportLegal")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.belizejudiciary.org/laws-of-belize/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                    style={{ color: `${palette.white}C0` }}
                  >
                    {t("belizeLaws")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://immigration.gov.bz/visa/visa-who-qualify/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                    style={{ color: `${palette.white}C0` }}
                  >
                    {t("travelRequirements")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                    style={{ color: `${palette.white}C0` }}
                  >
                    {t("terms")}
                  </a>
                </li>
              </ul>
            </div>


            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: palette.white }}>
                {t("getUpdates")}
              </h3>
              <p className="text-sm mb-4" style={{ color: `${palette.white}C0` }}>
                {t("getUpdatesDesc")}
              </p>
              <a
                href="https://www.instagram.com/laconfertc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                style={{ color: palette.white }}
              >
                <Instagram size={18} />
                @laconfertc
              </a>
             
            </div>
          </div>
        </div>
      </footer>

      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          {toasts.map((t, index) => (
            <div 
              key={t.id} 
              className="min-w-[320px] px-6 py-4 rounded-xl shadow-xl font-semibold flex items-center gap-4 animate-toast-bounce transform hover:scale-105 transition-transform"
              style={{ 
                animationDelay: `${index * 100}ms`,
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.tertiary} 100%)`,
                color: palette.white
              }}
            >
                              <div className="rounded-full w-8 h-8 flex items-center justify-center" style={{ backgroundColor: `${palette.white}20` }}>
                <svg className="w-4 h-4" style={{ color: palette.white }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="flex-1">{t.message}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(15px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateX(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes toast-bounce {
          0% { 
            opacity: 0; 
            transform: translateX(100px) scale(0.8) rotate(10deg); 
          }
          50% { 
            opacity: 1; 
            transform: translateX(-5px) scale(1.05) rotate(-2deg); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) scale(1) rotate(0deg); 
          }
        }
        
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease forwards;
        }
        
        .animate-toast-bounce {
          animation: toast-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease forwards;
        }
        
        img {
          will-change: auto;
        }
        
        .group:hover .group-hover\\:animate-pulse {
          animation: pulse 1s infinite;
        }
        
        @keyframes custom-pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.8; 
          }
        }
      `}</style>
    </>
  );
};

export default MemberDirectory;

