"use client";
import { useEffect, useState } from "react";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from "@/utils/useTranslation";
import { palette } from "@/lib/palette";

export default function LoginPage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // 👈 notice params is a Promise now
}) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { locale } = React.use(params);

  const { t } = useTranslation();

  useEffect(() => {
    const successMsg = searchParams.get("message");
    const errorMsg = searchParams.get("error");

    if (successMsg) setMessage(successMsg);
    if (errorMsg) setRegisterError(errorMsg);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push(`/${locale}/dashboard`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden mt-20" style={{ background: palette.background }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-pulse"
          style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}
        ></div>
        <div 
          className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{ background: `linear-gradient(135deg, ${palette.tertiary}, ${palette.accent})` }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-5 animate-bounce"
          style={{ background: palette.primary, animationDuration: '3s' }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float 6s ease-in-out infinite ${i * 0.5}s`,
            }}
          >
            <Sparkles size={16} style={{ color: palette.primary }} />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            {message && (
              <div className="relative mb-4 w-full max-w-sm rounded bg-green-100 border border-green-400 text-green-700 px-4 py-3">
                <span className="block font-semibold">{message}</span>
                <button
                  onClick={() => setMessage("")}
                  className="absolute top-1 right-2 text-green-700 hover:text-green-900"
                >
                  ✕
                </button>
              </div>
            )}

            {registerError && (
              <div className="relative mb-4 w-full max-w-sm rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
                <span className="block font-semibold">{registerError}</span>
                <button
                  onClick={() => setError("")}
                  className="absolute top-1 right-2 text-red-700 hover:text-red-900"
                >
                  ✕
                </button>
              </div>
            )}
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                boxShadow: `0 8px 32px rgba(60, 196, 255, 0.3)`
              }}
            >
              <Lock size={24} color={palette.white} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: palette.text }}>
              {t("welcomeBack")}
            </h1>
            <p style={{ color: palette.textSecondary }}>
              {t('continueJourney')}
            </p>
          </div>

          {/* Login Card */}
          <div 
            className="backdrop-blur-sm rounded-3xl p-8 shadow-2xl border transition-all duration-300 hover:shadow-3xl"
            style={{ 
              backgroundColor: `${palette.cardBg}f5`,
              borderColor: palette.cardBorder,
              boxShadow: palette.cardShadow
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div 
                  className="flex items-center space-x-2 p-4 rounded-2xl border animate-pulse"
                  style={{ 
                    backgroundColor: '#fef2f2',
                    borderColor: '#fecaca',
                    color: '#dc2626'
                  }}
                >
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: palette.text }}>
                  {t('email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} style={{ color: palette.textLight }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{
                      backgroundColor: palette.hobbyBg,
                      borderColor: palette.cardBorder,
                      color: palette.text,
                    }}
                    placeholder={t('enterEmail')}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: palette.text }}>
                  {t('password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} style={{ color: palette.textLight }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{
                      backgroundColor: palette.hobbyBg,
                      borderColor: palette.cardBorder,
                      color: palette.text,
                    }}
                    placeholder={t('enterPassword')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors"
                  >
                    {showPassword ? 
                      <EyeOff size={20} style={{ color: palette.textLight }} /> : 
                      <Eye size={20} style={{ color: palette.textLight }} />
                    }
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-2 text-blue-600 focus:ring-blue-500"
                    style={{ accentColor: palette.primary }}
                  />
                  <span className="text-sm" style={{ color: palette.textSecondary }}>
                    {t('remember')}
                  </span>
                </label>
                <a 
                  href="#" 
                  className="text-sm hover:underline transition-colors duration-200"
                  style={{ color: palette.primary }}
                >
                  {t('forgotPassword')}
                </a>
              </div> */}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                  color: palette.white,
                  boxShadow: `0 4px 20px rgba(60, 196, 255, 0.3)`
                }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <span>{t('signIn')}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
            <p style={{ color: palette.textSecondary }}>
                {t('noAccount')}{' '}
                <Link
                href={`/${locale}/register`}
                className="font-semibold hover:underline transition-colors duration-200"
                style={{ color: palette.primary }}
                >
                {t('signUp2')}
                </Link>
            </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        input:focus {
          ring: 2px solid ${palette.primary};
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}