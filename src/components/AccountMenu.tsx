"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Settings, UserCircle } from "lucide-react";
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";
import React from "react";

interface AccountMenuProps {
  locale: string | string[];
  mobile?: boolean;
  inMenu?: boolean;
}

export default function AccountMenu({ locale, mobile = false, inMenu = false }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
  const { t } = useTranslation();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut({ callbackUrl: `/${locale}` });
  };

  const handleMenuItemClick = () => {
    setOpen(false);
  };

  // Close menu when clicking outside (desktop only)
  useEffect(() => {
    if (mobile) return; // Don't use dropdown on mobile

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, mobile]);

  // Mobile version - render account options directly
  if (mobile) {
    return (
      <div className="w-full space-y-1">
        {status === "loading" ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : isLoggedIn ? (
          <>
            {/* User info */}
            <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <UserCircle size={16} color={palette.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: palette.textSecondary }}>
                  {session.user?.firstName || session.user?.email}
                </p>
                {session.user?.firstName && (
                  <p className="text-xs opacity-70 truncate" style={{ color: palette.textSecondary }}>
                    {session.user?.email}
                  </p>
                )}
              </div>
            </div>
            
            {/* Dashboard link */}
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group"
            >
              <Settings size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium" style={{ color: palette.textSecondary }}>{t('dashboard')}</span>
            </Link>
            
            {/* Logout button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full text-left group"
            >
              <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="text-sm font-medium group-hover:text-red-600" style={{ color: palette.textSecondary }}>{t('logout')}</span>
            </button>
          </>
        ) : (
          <>
            {/* Login link */}
            <Link
              href={`/${locale}/login`}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group"
            >
              <User size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium" style={{ color: palette.textSecondary }}>{t('login')}</span>
            </Link>
            
            {/* Register link */}
            <Link
              href={`/${locale}/register`}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group"
            >
              <UserCircle size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
              <span className="text-sm font-medium" style={{ color: palette.textSecondary }}>{t('register')}</span>
            </Link>
          </>
        )}
      </div>
    );
  }

  // For inMenu variant (inside mobile navigation menu) - show account options directly
  if (inMenu) {
    return (
      <div className="w-full space-y-1">
        {isLoggedIn ? (
          <>
            {/* User info */}
            <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <UserCircle size={16} color={palette.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: palette.textSecondary }}>
                  {session.user?.firstName || session.user?.email}
                </p>
                {session.user?.firstName && (
                  <p className="text-xs opacity-70 truncate" style={{ color: palette.textSecondary }}>
                    {session.user?.email}
                  </p>
                )}
              </div>
            </div>
            
            {/* Menu items as buttons */}
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group"
            >
              <Settings size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium" style={{ color: palette.textSecondary }}>{t('dashboard')}</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full text-left group"
            >
              <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="text-sm font-medium group-hover:text-red-600" style={{ color: palette.textSecondary }}>{t('logout')}</span>
            </button>
          </>
        ) : (
          <>
            <Link
              href={`/${locale}/login`}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group"
            >
              <User size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium" style={{ color: palette.textSecondary }}>{t('login')}</span>
            </Link>
            <Link
              href={`/${locale}/register`}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group"
            >
              <UserCircle size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
              <span className="text-sm font-medium" style={{ color: palette.textSecondary }}>{t('register')}</span>
            </Link>
          </>
        )}
      </div>
    );
  }

  // Desktop version - with dropdown
  return (
    <div className="relative inline-block text-left">
      {/* Account Icon */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br ring-2 ring-white/20"
        style={{ 
          background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
          ...(status === "loading" && { opacity: 0.7 })
        }}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <User size={20} color={palette.white} />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={() => setOpen(false)}
          />
          
          <div
            ref={menuRef}
            className="absolute left-full ml-2 top-0 mt-0 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200"
            style={{ 
              borderColor: `${palette.cardBorder}40`,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {isLoggedIn ? (
              // Logged in menu
              <>
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <UserCircle size={16} color={palette.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {session.user?.firstName || session.user?.email}
                      </p>
                      {session.user?.firstName && (
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Dashboard link */}
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={handleMenuItemClick}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                  style={{ color: palette.text }}
                >
                  <Settings size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span>{t('dashboard')}</span>
                </Link>
                
                {/* Divider */}
                <div className="border-t border-gray-100/50"></div>
                
                {/* Logout */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 group text-left"
                  style={{ color: palette.text }}
                >
                  <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                  <span className="group-hover:text-red-600">{t('logout')}</span>
                </button>
              </>
            ) : (
              // Not logged in menu
              <>
                <Link
                  href={`/${locale}/login`}
                  onClick={handleMenuItemClick}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                  style={{ color: palette.text }}
                >
                  <User size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span>{t('login')}</span>
                </Link>
                <Link
                  href={`/${locale}/register`}
                  onClick={handleMenuItemClick}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group"
                  style={{ color: palette.text }}
                >
                  <UserCircle size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                  <span>{t('register')}</span>
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}