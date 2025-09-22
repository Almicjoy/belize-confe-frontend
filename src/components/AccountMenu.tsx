"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Settings, UserCircle } from "lucide-react";
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";
import React from "react";

export default function AccountMenu({ locale }: { locale: string | string[]}) {
  const [open, setOpen] = useState(false);
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

  return (
    <div className="relative inline-block text-left">
      {/* Account Icon */}
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 ${
          isLoggedIn 
            ? 'bg-gradient-to-br hover:scale-105 ring-2 ring-white/20' 
            : 'bg-gradient-to-br hover:scale-105'
        }`}
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
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={() => setOpen(false)}
          />
          
          <ul
            className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200"
            style={{ 
              borderColor: `${palette.cardBorder}40`,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {isLoggedIn ? (
              // Logged in menu
              <>
                {/* User info header */}
                <li className="px-4 py-3 border-b border-gray-100/50">
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
                </li>
                
                {/* Dashboard link */}
                <li>
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={handleMenuItemClick}
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                    style={{ color: palette.text }}
                  >
                    <Settings size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span>{t('dashboard')}</span>
                  </Link>
                </li>
                
                {/* Divider */}
                <li className="border-t border-gray-100/50"></li>
                
                {/* Logout */}
                <li>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 group text-left"
                    style={{ color: palette.text }}
                  >
                    <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="group-hover:text-red-600">{t('logout')}</span>
                  </button>
                </li>
              </>
            ) : (
              // Not logged in menu
              <>
                <li>
                  <Link
                    href={`/${locale}/login`}
                    onClick={handleMenuItemClick}
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                    style={{ color: palette.text }}
                  >
                    <User size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span>{t('login')}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/register`}
                    onClick={handleMenuItemClick}
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group"
                    style={{ color: palette.text }}
                  >
                    <UserCircle size={16} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    <span>{t('register')}</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </>
      )}
    </div>
  );
}