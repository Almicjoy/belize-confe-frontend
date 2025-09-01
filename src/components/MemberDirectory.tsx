"use client";

import React, { useState, useMemo, useEffect, useRef, FC } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import PaymentForm from './PaymentForm';
import Modal from './Modal';
import { FaMoneyBillWave } from 'react-icons/fa';
import AccountPopup from './AccountPopup';


if (typeof document !== 'undefined' && !document.getElementById('google-font-poppins')) {
  const link = document.createElement('link');
  link.id = 'google-font-poppins';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
}

const palette = {
  background: '#ffffffff',
  cardBg: '#FFFFFF',
  cardBorder: '#b2f3ffff',
  cardShadow: '0 4px 12px rgba(60, 190, 255, 0.08)',
  accent: '#00d0ffff',
  primary: '#3cc4ffff',
  secondary: '#66f2ffff',
  tertiary: '#509cffff',
  midday: '#2C5282',
  middayLight: '#4299E1',
  middayDark: '#1A365D',
  text: '#2D2D2D',
  textSecondary: '#7F8C8D',
  textLight: '#B0B0B0',
  hobbyBg: '#e0fcffff',
  hobbyText: '#3c6dffff',
  success: '#4CAF50',
  white: '#FFFFFF',
  lightOrange: '#f0feffff',
};

interface Activity {
  date: string;
  description: string;
}

interface Member {
  id: number;
  name: string;
  avatarUrl: string;
  location: string;
  bio: string;
  hobbies: string[];
  recentActivity: Activity[];
}

const fallbackAvatar = 'https://ui-avatars.com/api/?name=User&background=FF6F3C&color=fff&size=256';

const hobbyIcons: Record<string, string> = {
  'Urban Sketching': '•',
  'Cycling': '•',
  'Coffee Tasting': '•',
  'Travel': '•',
  'Basketball': '•',
  'Machine Learning': '•',
  'Cooking': '•',
  'Board Games': '•',
  'UI/UX Design': '•',
  'Gardening': '•',
  'Plant-Based Cooking': '•',
  'Yoga': '•',
  'Photography': '•',
  'Hiking': '•',
  'History': '•',
  'Chess': '•',
  'Game Development': '•',
  'K-pop': '•',
  'Street Food': '•',
  'Drawing': '•',
  'DJing': '•',
  'Vinyl Collecting': '•',
  'Music Production': '•',
  'Rock Climbing': '•',
  'Digital Art': '•',
  'Reading': '•',
  'Writing': '•',
  'Creative Writing': '•',
};

const staticMembers: Member[] = [
  {
    id: 1,
    name: 'Promo Manatee',
    avatarUrl: 'https://picsum.photos/200/300',
    location: '$500 USD',
    bio: 'Sign up before September 30th, limited spots available.',
    hobbies: ['1st Promo', 'Expired'],
    recentActivity: [
      { date: 'Deadline', description: 'September 30th, 2025' },
      { date: 'Installments', description: 'Pay in up to 4 installments' },
    ],
  },
  {
    id: 2,
    name: 'Promo Toucan',
    avatarUrl: 'https://picsum.photos/200/300',
    location: '$505 USD',
    bio: 'Sign up before November 30th, limited spots available.',
    hobbies: ['2nd Promo', 'Active'],
    recentActivity: [
      { date: 'Deadline', description: 'November 30th, 2025' },
      { date: 'Installments', description: 'Pay in up to 3 installments' },
    ],
  },
  {
    id: 3,
    name: 'Promo Tapir',
    avatarUrl: 'https://picsum.photos/200/300',
    location: '$510 USD',
    bio: 'Sign up before February 28th, limited spots available.',
    hobbies: ['3rd Promo', 'Upcoming'],
    recentActivity: [
      { date: 'Deadline', description: 'February 28th, 2025' },
      { date: 'Installments', description: 'Pay in up to 2 installments' },
    ],
  },

];

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

const MemberCard: React.FC<{
  member: Member;
  isSelected: boolean;
  isInvited: boolean;
  animationDelay: string;
  onSelect: () => void;
  onInvite: (e: React.MouseEvent) => void;
}> = React.memo(({ member, isSelected, isInvited, animationDelay, onSelect, onInvite }) => {
  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(member.avatarUrl);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleCardClick = () => {
    const wasSelected = isSelected;
    onSelect();
      
    if (!wasSelected && cardRef.current) {
      setTimeout(() => {
        if (!cardRef.current) return;
        
        const card = cardRef.current;
        const cardRect = card.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const headerElement = document.querySelector('nav');
        const headerHeight = headerElement?.offsetHeight || 80;
        
        const actualExpandedHeight = cardRect.height;
        
        const cardTop = cardRect.top;
        const cardBottom = cardTop + actualExpandedHeight;
        const effectiveViewportTop = headerHeight;
        const effectiveViewportBottom = viewportHeight;
        
        
        let scrollAmount = 0;
        
        if (cardBottom > effectiveViewportBottom) {
          scrollAmount = cardBottom - effectiveViewportBottom + 20;
        } else if (cardTop < effectiveViewportTop) {
          scrollAmount = cardTop - effectiveViewportTop - 20;
        }
        
        if (scrollAmount !== 0) {
          window.scrollTo({
            top: window.scrollY + scrollAmount,
            behavior: 'smooth'
          });
        }
      }, 320);
    }
  };
  
  return (
    <>
    <div
      ref={cardRef}
      style={{ 
        animationDelay,
        height: isSelected ? 'auto' : 'auto',
        backgroundColor: palette.cardBg,
        boxShadow: isSelected ? `0 20px 25px -5px rgba(60, 141, 255, 0.15), 0 10px 10px -5px rgba(60, 122, 255, 0.04)` : palette.cardShadow,
        border: `1px solid ${isSelected ? palette.primary : palette.cardBorder}`,
        transform: 'scale(1)'
      }}
      className="rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105 hover:-translate-y-1 flex flex-col"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-expanded={isSelected}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
    >
      <div className="p-6 pb-2 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img 
              src={avatarSrc} 
              alt={`${member.name}'s avatar`} 
              className={`w-16 h-16 rounded-full object-cover ring-4 transition-opacity duration-200 ${avatarLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ '--tw-ring-color': palette.primary } as React.CSSProperties}
              onLoad={() => setAvatarLoaded(true)}
              onError={() => {
                setAvatarSrc(fallbackAvatar);
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
              {member.name}
            </h2>
            <div className="flex items-center gap-1 text-m font-bold" style={{ color: palette.primary }}>
              <FaMoneyBillWave size={20} />
              {member.location}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed font-medium italic mb-3" style={{ color: palette.textSecondary }}>
          {member.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          {member.hobbies.slice(0, 4).map(hobby => (
            <span 
              key={hobby} 
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border"
              style={{ 
                backgroundColor: palette.hobbyBg, 
                color: palette.hobbyText,
                borderColor: palette.cardBorder 
              }}
            >
              <span>{hobbyIcons[hobby] || '•'}</span>
              {hobby}
            </span>
          ))}
          {member.hobbies.length > 4 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: palette.primary, color: palette.white }}>
              +{member.hobbies.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className={`
        w-full text-left overflow-hidden transition-all duration-300
        ${isSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
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
              Important Notes
            </h3>
            
            <div className="space-y-3 mb-6">
              {member.recentActivity.map((activity, i) => (
                                  <div 
                    key={i} 
                    className="flex items-start gap-3 p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: palette.white, 
                      borderColor: palette.cardBorder,
                      animation: isSelected ? `fade-in-up 0.3s ${0.05 + i * 0.05}s both` : undefined
                    }}
                >
                  <div className="rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: palette.primary }}>
                    <svg className="w-3 h-3" style={{ color: palette.white }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm leading-relaxed" style={{ color: palette.text }}>
                      {activity.description}
                    </p>
                    <span className="text-xs font-medium" style={{ color: palette.textSecondary }}>
                      {activity.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              className="w-full flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-300 shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg"
              style={{
                backgroundColor: isInvited ? palette.success : palette.primary,
                color: palette.white,
                opacity: isInvited ? 0.9 : 1,
                cursor: isInvited ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isInvited && !loading) {
                  e.currentTarget.style.backgroundColor = isInvited
                    ? palette.success
                    : palette.tertiary;
                  e.currentTarget.style.boxShadow = `0 8px 25px ${palette.primary}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isInvited && !loading) {
                  e.currentTarget.style.backgroundColor = isInvited
                    ? palette.success
                    : palette.primary;
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.15)";
                }
              }}
              disabled={isInvited || loading}
              onClick={(e) => {
                e.stopPropagation();
                if (isInvited || loading) return;
                setShowPaymentForm(true); // 👈 open the modal
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  </div>
                  <span className="animate-pulse">Connecting...</span>
                </span>
              ) : isInvited ? (
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
                  Connection Sent!
                </span>
              ) : (
                <span className="flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 mr-2 group-hover:animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21h-1.063a12.318 12.318 0 01-4.186-1.665z"
                    />
                  </svg>
                  Register Now
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

const MemberDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const heroRef = useRef<HTMLElement>(null);
  const connectRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

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

  const filteredMembers = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) return staticMembers;
    return staticMembers.filter(member =>
      member.name.toLowerCase().includes(lowercasedFilter) ||
      member.location.toLowerCase().includes(lowercasedFilter) ||
      member.hobbies.some(hobby => hobby.toLowerCase().includes(lowercasedFilter))
    );
  }, [searchTerm]);

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
    <div className="min-h-screen w-full relative font-poppins overflow-x-hidden" style={{ background: palette.background }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: palette.primary }}></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: palette.secondary }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-5" style={{ backgroundColor: palette.middayLight }}></div>
      </div>

      <nav ref={headerRef} className="w-full px-2 py-4 fixed top-0 z-20 backdrop-blur-sm" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center" >
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={60}
                    height={60}
                />
            </div>
            <span className="text-xl font-bold" style={{ color: palette.primary }}>
              LaConfe2026
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              className="px-4 py-2 font-medium transition-all duration-300 cursor-pointer relative group" 
              style={{ color: palette.text }}
              onClick={scrollToTop}
            >
              Home
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" style={{ backgroundColor: palette.primary }}></span>
            </button>
            <button 
              className="px-4 py-2 font-medium transition-all duration-300 cursor-pointer relative group" 
              style={{ color: palette.text }}
              onClick={scrollToConnect}
            >
              Promos
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" style={{ backgroundColor: palette.primary }}></span>
            </button>
            <button 
              className="px-4 py-2 font-medium transition-all duration-300 cursor-pointer relative group" 
              style={{ color: palette.text }}
              onClick={scrollToAbout}
            >
              Pre-Confe
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" style={{ backgroundColor: palette.primary }}></span>
            </button>
            <AccountPopup
              trigger={
                <button 
                  className="px-4 py-2 font-medium transition-all duration-300 cursor-pointer relative group" 
                  style={{ color: palette.text }}
                >
                  Account
                  <span 
                    className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" 
                    style={{ backgroundColor: palette.primary }}
                  ></span>
                </button>
              }
              onRegisterClick={scrollToConnect}
            />
          </div>

          <button 
            className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: palette.text }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-30" style={{ backgroundColor: palette.hobbyBg, marginTop: `${getHeaderHeight()}px` }}>
          <div className="px-2 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <button 
                className="px-4 py-3 text-left font-medium transition-colors duration-200 hover:bg-gray-100 rounded-lg" 
                style={{ color: palette.text }}
                onClick={() => {
                  scrollToTop();
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button 
                className="px-4 py-3 text-left font-medium transition-colors duration-200 hover:bg-gray-100 rounded-lg" 
                style={{ color: palette.text }}
                onClick={() => {
                  scrollToConnect();
                  setIsMobileMenuOpen(false);
                }}
              >
                Promos
              </button>
              <button 
                className="px-4 py-3 text-left font-medium transition-colors duration-200 hover:bg-gray-100 rounded-lg" 
                style={{ color: palette.text }}
                onClick={() => {
                  scrollToAbout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Pre-Confe
              </button>
              <button 
                className="px-4 py-3 text-left font-medium transition-colors duration-200 hover:bg-gray-100 rounded-lg" 
                style={{ color: palette.text }}
              >
                Account
              </button>
            </div>
          </div>
        </div>
      )}

      <section ref={heroRef} className="w-full px-2 py-20 pt-28 relative z-10" style={{ backgroundColor: palette.hobbyBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-8 lg:col-span-2">
              <div className="space-y-6">
                <h1 className="text-5xl font-extrabold leading-tight" style={{ color: palette.primary }}>
                  Experience Belize 
                  <span className="block" style={{ color: palette.tertiary }}>
                    30th Bi-District Conference
                  </span>
                </h1>
                <p className="text-xl leading-relaxed font-medium max-w-lg" style={{ color: palette.textSecondary }}>
                  Get ready to Experience Belize at #LaConfe2026. Something about Belikin.
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
                Browse Promos
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
                Ready to Register?
              </h2>
              <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: palette.textSecondary }}>
                Browse all our registration options below. Note that some are still locked!
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
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                isSelected={selectedMemberId === member.id}
                isInvited={invitedIds.includes(member.id)}
                animationDelay={`${index * 100}ms`}
                onSelect={() => setSelectedMemberId(prevId => (prevId === member.id ? null : member.id))}
                onInvite={(e) => handleSendInvite(e, member.name, member.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 flex flex-col items-center animate-fade-in">
            <div className="relative mb-8">
              <div className="rounded-full w-32 h-32 flex items-center justify-center shadow-2xl" style={{ background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.tertiary} 100%)` }}>
                <svg className="w-16 h-16" style={{ color: palette.white }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4" style={{ color: palette.primary }}>
               No Members Found
             </h3>
            <p className="text-lg font-medium mb-6 max-w-md" style={{ color: palette.textSecondary }}>
              We couldn&apos;t find anyone matching your search. Try exploring different hobbies or expand your location!
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {['Photography', 'Hiking', 'Cooking'].map((hobby) => (
                <button
                  key={hobby}
                  onClick={() => setSearchTerm(hobby)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 hover:scale-105 cursor-pointer"
                  style={{ 
                    backgroundColor: palette.hobbyBg, 
                    color: palette.hobbyText,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = palette.primary;
                    e.currentTarget.style.color = palette.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = palette.hobbyBg;
                    e.currentTarget.style.color = palette.hobbyText;
                  }}
                >
                  Try &quot;{hobby}&quot;
                </button>
              ))}
            </div>
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
    </div>
  );
};

export default MemberDirectory;

