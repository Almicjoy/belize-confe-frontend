"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from "@/utils/useTranslation";
import { palette } from "@/lib/palette";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { locale } = params;

  const { t } = useTranslation();

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
    <div className="min-h-screen relative overflow-hidden" style={{ background: palette.background }}>
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
              Sign in to continue your journey
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
                  Email Address
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
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: palette.text }}>
                  Password
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
                    placeholder="Enter your password"
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
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-2 text-blue-600 focus:ring-blue-500"
                    style={{ accentColor: palette.primary }}
                  />
                  <span className="text-sm" style={{ color: palette.textSecondary }}>
                    Remember me
                  </span>
                </label>
                <a 
                  href="#" 
                  className="text-sm hover:underline transition-colors duration-200"
                  style={{ color: palette.primary }}
                >
                  Forgot password?
                </a>
              </div>

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
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: palette.cardBorder }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-4"
                  style={{ color: palette.textSecondary, backgroundColor: palette.cardBg }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="flex items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:scale-105"
                style={{
                  backgroundColor: palette.hobbyBg,
                  borderColor: palette.cardBorder,
                  color: palette.text
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button 
                className="flex items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:scale-105"
                style={{
                  backgroundColor: palette.hobbyBg,
                  borderColor: palette.cardBorder,
                  color: palette.text
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
            <p style={{ color: palette.textSecondary }}>
                Don&lsquo;t have an account?{' '}
                <Link
                href="/register"
                className="font-semibold hover:underline transition-colors duration-200"
                style={{ color: palette.primary }}
                >
                Sign up
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