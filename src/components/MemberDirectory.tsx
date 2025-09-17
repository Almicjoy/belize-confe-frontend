"use client";

import React, { useState, useMemo, useEffect, useRef, FC } from 'react';
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import PaymentForm from './PaymentForm';
import Modal from './Modal';
import { FaMoneyBillWave } from 'react-icons/fa';
import { palette } from "@/lib/palette";

import { useTranslation } from "@/utils/useTranslation";

if (typeof document !== 'undefined' && !document.getElementById('google-font-poppins')) {
  const link = document.createElement('link');
  link.id = 'google-font-poppins';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
}


const fallbackAvatar = 'https://ui-avatars.com/api/?name=User&background=FF6F3C&color=fff&size=256';


const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse" style={{ 
    backgroundColor: palette.cardBg, 
    boxShadow: palette.cardShadow,
    border: `1px solid ${palette.cardBorder}`
  }}>
    <div className="p-6 pb-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full" style={{ backgroundColor: palette.cardBorder }}></div>
        <div className="flex-1">
          <div className="h-5 rounded mb-2 w-3/4" style={{ backgroundColor: palette.cardBorder }}></div>
          <div className="h-4 rounded w-1/2" style={{ backgroundColor: palette.cardBorder }}></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 rounded" style={{ backgroundColor: palette.cardBorder }}></div>
        <div className="h-4 rounded w-4/5" style={{ backgroundColor: palette.cardBorder }}></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 rounded-full w-20" style={{ backgroundColor: palette.cardBorder }}></div>
        <div className="h-6 rounded-full w-16" style={{ backgroundColor: palette.cardBorder }}></div>
        <div className="h-6 rounded-full w-24" style={{ backgroundColor: palette.cardBorder }}></div>
      </div>
    </div>
  </div>
);

const MemberCard: React.FC = React.memo(() => {

  const { locale } = useParams(); // pulls from [locale] in URL
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  // const [avatarSrc, setAvatarSrc] = useState(member.avatarUrl);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  MemberCard.displayName = "MemberCard";
  return (
    <>
    <div
      ref={cardRef}
      style={{ 

        backgroundColor: palette.cardBg,

        transform: 'scale(1)'
      }}
      className="rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105 hover:-translate-y-1 flex flex-col"

      role="button"
      tabIndex={0}


    >
      <div className="p-6 pb-2 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img 
              // src={avatarSrc} 
              // alt={`${t()}'s avatar`} 
              className={`w-16 h-16 rounded-full object-cover ring-4 transition-opacity duration-200 ${avatarLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
              onLoad={() => setAvatarLoaded(true)}
              onError={() => {
                // setAvatarSrc(fallbackAvatar);
                setAvatarLoaded(true);
              }}
            />
            {!avatarLoaded && (
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-blue-500">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1" style={{ color: palette.text }}>
              {t("promoData.name")}
            </h2>
            <div className="flex items-center gap-1 text-m font-bold" style={{ color: palette.primary }}>
              <FaMoneyBillWave size={20} />
              {t("promoData.price")}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed font-medium italic mb-3" style={{ color: palette.textSecondary }}>
          {t("promoData.installments")}
        </p>

      </div>

      <div className={`
        w-full text-left overflow-hidden transition-all duration-300}
      `}>
        <div className="px-6 pb-6">
          <div className="rounded-xl p-4 border" style={{ 
            backgroundColor: palette.hobbyBg, 
            borderColor: palette.cardBorder,
            
          }}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: palette.primary }}>
              <div className="rounded-full w-8 h-8 flex items-center justify-center" style={{ backgroundColor: palette.primary }}>
                <svg className="w-4 h-4" style={{ color: palette.white }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              {t("importantNotes")}
            </h3>
            
            
            <button
              className="w-full flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-300 shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg"
              style={{
                color: palette.white,
              }}

 

              onClick={(e) => {
                e.stopPropagation();

                setShowPaymentForm(true); // 👈 open the modal
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  </div>
                  <span className="animate-pulse">{t("register4")}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t("registerSuccess")}
                </span>
              )}
            </button>
          </div>
                    
        </div>
        
      </div>

    </div>
{showPaymentForm && (
  <Modal onClose={() => setShowPaymentForm(false)}>
    <PaymentForm />
  </Modal>
)}
    </>
  );
});

interface MemberDirectoryProps {
  headerRef: React.RefObject<HTMLElement | null>;
  connectRef: React.RefObject<HTMLElement | null>;
  aboutRef: React.RefObject<HTMLElement | null>;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  headerRef,
  connectRef,
  aboutRef,
}) => {
  const { locale } = useParams(); // pulls from [locale] in URL
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const heroRef = useRef<HTMLElement>(null);

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

  const handleSendInvite = (e: React.MouseEvent, memberName: string, memberId: number) => {
    e.stopPropagation();
    if (invitedIds.includes(memberId)) return;
    setInvitedIds(prev => [...prev, memberId]);
    addToast(`Connection request sent to ${memberName}!`);
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

  const scrollToConnect = () => {
    if (connectRef.current) {
      const headerHeight = getHeaderHeight();
      const elementTop = connectRef.current.offsetTop;
      window.scrollTo({
        top: elementTop - headerHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToAbout = () => {
    if (aboutRef.current) {
      const headerHeight = getHeaderHeight();
      const elementTop = aboutRef.current.offsetTop;
      window.scrollTo({
        top: elementTop - headerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>


      <section ref={heroRef} className="w-full px-2 py-20 pt-28 relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-8 lg:col-span-2">
              <div className="space-y-6">
                <h1 className="text-5xl font-extrabold leading-tight" style={{ color: palette.primary }}>
                  {t("experienceBelize")} 
                  <span className="block" style={{ color: palette.tertiary }}>
                   {t("experienceBelizeDesc1")}
                  </span>
                </h1>
                <p className="text-xl leading-relaxed font-medium max-w-lg" style={{ color: palette.textSecondary }}>
                  {t("experienceBelizeDesc2")}
                </p>
              </div>
              
              <button 
                className="px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
                style={{ 
                  backgroundColor: palette.primary, 
                  color: palette.white,
                  boxShadow: `0 8px 25px ${palette.primary}30`
                }}
                onClick={scrollToConnect}
              >
                {t("browsePromos")}
              </button>
            </div>

            <div className="relative lg:col-span-1">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={600}
                    height={600}
                />
            </div>
          </div>
        </div>
      </section>

      <main ref={connectRef} className="w-full relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="w-full px-2 py-16">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ color: palette.primary }}>
                {t("register2")}
              </h2>
              <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: palette.textSecondary }}>
                {t("register3")}
              </p>
            </div>

            <div className="relative w-full max-w-2xl">
            {/* <input
              type="text"
              role="searchbox"
              aria-label="Search members"
              placeholder="Search by name, location, or hobby..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-base rounded-lg border outline-none focus:ring-2"
              style={{ 
                borderColor: palette.cardBorder, 
                backgroundColor: palette.white,
                boxShadow: palette.cardShadow,
                color: palette.text
              }}
            /> */}
            {/* <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: palette.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg> */}
            {searchTerm && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full"
                style={{ backgroundColor: palette.primary, color: palette.white }}
                onClick={() => setSearchTerm('')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            </div>
          </div>
        </div>

        <div className="w-full pb-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              <MemberCard/>
          </div>
        )}
        </div>
      </main>

      <section ref={aboutRef} className="w-full px-2 py-20 relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4" style={{ color: palette.primary }}>
              Pre-Confe Activities
            </h2>
            <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: palette.textSecondary }}>
              Have some fun before the fun starts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="flex items-start gap-4 transition-all duration-300 hover:scale-105 hover:shadow-lg p-4 rounded-xl border" style={{ backgroundColor: palette.hobbyBg, borderColor: palette.cardBorder }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: palette.primary }}>
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: palette.text }}>Day 1: Ruins</h3>
                  <p className="text-sm leading-relaxed" style={{ color: palette.textSecondary }}>
                    Explore the Mayan temples of Belize.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 transition-all duration-300 hover:scale-105 hover:shadow-lg p-4 rounded-xl border" style={{ backgroundColor: palette.hobbyBg, borderColor: palette.cardBorder }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: palette.tertiary }}>
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: palette.text }}>Day 2: Reef</h3>
                  <p className="text-sm leading-relaxed" style={{ color: palette.textSecondary }}>
                    Ever wanted to go to the Blue Hole?
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 transition-all duration-300 hover:scale-105 hover:shadow-lg p-4 rounded-xl border" style={{ backgroundColor: palette.hobbyBg, borderColor: palette.cardBorder }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: palette.secondary }}>
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: palette.text }}>Day 3: River</h3>
                  <p className="text-sm leading-relaxed" style={{ color: palette.textSecondary }}>
                    Take your mind of the grind with a relaxing river tubing experience.
                  </p>
                </div>
              </div>
            </div>

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
                  LaConfe2026
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: `${palette.white}C0` }}>
                Connecting passionate people through shared hobbies and interests. Start connecting today.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: palette.white }}>
                Explore
              </h3>
              <ul className="space-y-2">
                {['Browse Members', 'Popular Hobbies', 'Local Connections', 'Recent Activity'].map((link) => (
                  <li key={link}>
                    <button 
                      className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer" 
                      style={{ color: `${palette.white}C0` }}
                      onClick={scrollToTop}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: palette.white }}>
                Support
              </h3>
              <ul className="space-y-2">
                {['Help Center', 'Safety Guidelines', 'Terms of Service', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <button 
                      className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer" 
                      style={{ color: `${palette.white}C0` }}
                      onClick={scrollToTop}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: palette.white }}>
                Stay Connected
              </h3>
              <p className="text-sm mb-4" style={{ color: `${palette.white}C0` }}>
                Get weekly updates on new members and hobby events.
              </p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-l-lg border-0 outline-none placeholder-gray-300"
                  style={{ backgroundColor: `${palette.white}20`, color: palette.white }}
                />
                <button 
                  type="submit"
                  disabled={!isValidEmail(email)}
                  className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-colors duration-200 ${
                    isValidEmail(email) ? 'cursor-pointer hover:opacity-90' : 'cursor-not-allowed opacity-50'
                  }`}
                  style={{ backgroundColor: palette.primary, color: palette.white }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center" style={{ borderTop: `1px solid ${palette.white}40` }}>
                          <div className="flex gap-6 mt-4 md:mt-0">
                <button 
                  className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer" 
                  style={{ color: `${palette.white}C0` }}
                  onClick={scrollToTop}
                >
                  Contact Us
                </button>
                <button 
                  className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer" 
                  style={{ color: `${palette.white}C0` }}
                  onClick={scrollToTop}
                >
                  About
                </button>
                <button 
                  className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer" 
                  style={{ color: `${palette.white}C0` }}
                  onClick={scrollToTop}
                >
                  Careers
                </button>
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

