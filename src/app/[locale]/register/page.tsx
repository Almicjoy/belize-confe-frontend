"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/utils/useTranslation";

import { Eye, EyeOff, User, Mail, Lock, Calendar, Globe, Building, ArrowRight, Sparkles, AlertCircle, CheckCircle, Phone } from 'lucide-react';


export default function RegisterPage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [clubName, setClubName] = useState("");
  const [customClub, setCustomClub] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<string[]>([]);
  const [clubSearch, setClubSearch] = useState("");
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const { locale } = React.use(params);

  const { t } = useTranslation();

  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close country dropdown if click is outside
      if (showCountryDropdown && !target.closest('.country-dropdown-container')) {
        setShowCountryDropdown(false);
      }
      
      // Close club dropdown if click is outside
      if (showClubDropdown && !target.closest('.club-dropdown-container')) {
        setShowClubDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown, showClubDropdown]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setCountries(data.countries);
      setClubs(data.clubs);
      setFilteredClubs(data.clubs);
    }
    fetchData();
  }, []);

  // Filter clubs based on search
  useEffect(() => {
    if (clubSearch === "") {
      setFilteredClubs(clubs);
    } else {
      const filtered = clubs.filter(club =>
        club.toLowerCase().includes(clubSearch.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  }, [clubSearch, clubs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    // Password validation
    if (password !== confirmPassword) {
      setMessage(t('passwordMatch'));
      setIsLoading(false);
      return;
    }

    // Determine final country and club values
    const finalCountry = country === "Other" ? customCountry : country;
    const finalClub = clubName === "Other" ? customClub : clubName;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        firstName,
        lastName,
        email, 
        countryCode,
        phone,
        country: finalCountry,
        clubName: finalClub,
        birthday,
        password,
        locale
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/${locale}/login?message=${encodeURIComponent(t('registrationSuccess'))}`);
    } else {
      setMessage(data.message);
      setIsSuccess(res.ok);
    }

    setIsLoading(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone(value);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');
    setCountryCode(value);
  };

  const handleClubSelect = (club: string) => {
    setClubName(club);
    setClubSearch(club);
    setShowClubDropdown(false);
    if (club !== "Other") {
      setCustomClub("");
    }
  };

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setShowCountryDropdown(false);
    if (selectedCountry !== "Other") {
      setCustomCountry("");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white mt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-pulse"
          style={{ background: 'linear-gradient(135deg, #3cc4ff, #66f2ff)' }}
        />
        <div 
          className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{ background: 'linear-gradient(135deg, #509cff, #00d0ff)' }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full opacity-5 animate-bounce bg-blue-300"
          style={{ animationDuration: '4s' }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 text-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float 8s ease-in-out infinite ${i * 0.7}s`,
            }}
          >
            <Sparkles size={14} />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #3cc4ff, #66f2ff)',
                boxShadow: '0 8px 32px rgba(60, 196, 255, 0.3)'
              }}
            >
              <User size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {t('signUp')}
            </h1>
            <p className="text-gray-600">
              {t('createAccountStart')}
            </p>
          </div>

          {/* Register Card */}
          <div 
            className="backdrop-blur-sm rounded-3xl p-8 shadow-2xl border transition-all duration-300 bg-white/95"
            style={{ 
              borderColor: '#b2f3ff',
              boxShadow: '0 4px 12px rgba(60, 190, 255, 0.08)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center items-center">
                {/* Message */}
                {message && (
                  <div 
                    className={`flex items-center space-x-2 p-4 rounded-2xl border animate-pulse ${
                      isSuccess ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                  >
                    {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm">{message}</span>
                  </div>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">
                    {t('firstName')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                      placeholder={t('enterFirstName')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">
                    {t('lastName')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                      placeholder={t('enterLastName')}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  {t('email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                    placeholder={t('enterEmail')}
                    required
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  {t('phoneNumber')}
                </label>
                <div className="relative flex gap-3">
                  {/* Country Code Input */}
                  <div className="relative w-24 md:w-32">
                    <input
                      type="text"
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      required
                      className="w-full px-2 md:px-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                      placeholder="+501"
                    />
                  </div>

                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                      placeholder={t('enterPhone')}
                    />
                  </div>
                </div>
              </div>

              {/* Country and Club Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">
                    {t('country')}
                  </label>
                  <div className="relative country-dropdown-container">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Globe size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={country}
                      onFocus={() => setShowCountryDropdown(true)}
                      readOnly
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400 cursor-pointer"
                      placeholder={t('selectCountry')}
                      required={country === ""}
                    />
                    
                    {/* Dropdown Menu */}
                    {showCountryDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-cyan-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                        <div
                          onClick={() => handleCountrySelect("Other")}
                          className="px-4 py-3 hover:bg-cyan-50 cursor-pointer transition-colors text-sm text-gray-800 font-medium border-b-2 border-cyan-200"
                        >
                          {t('other')}
                        </div>
                        {countries.map((c) => (
                          <div
                            key={c}
                            onClick={() => handleCountrySelect(c)}
                            className="px-4 py-3 hover:bg-cyan-50 cursor-pointer transition-colors text-sm text-gray-800 border-b border-gray-100 last:border-b-0"
                          >
                            {c}
                          </div>
                        ))}

                      </div>
                    )}
                  </div>
                  
                  {/* Custom Country Input */}
                  {country === "Other" && (
                    <div className="relative mt-2">
                      <input
                        type="text"
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                        placeholder={t('enterCountry')}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">
                    {t('club')}
                  </label>
                  <div className="relative club-dropdown-container">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Building size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={clubSearch}
                      onChange={(e) => {
                        setClubSearch(e.target.value);
                        setShowClubDropdown(true);
                      }}
                      onFocus={() => setShowClubDropdown(true)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                      placeholder={t('searchClub')}
                      required={clubName === ""}
                    />
                    
                    {/* Dropdown Menu */}
                    {showClubDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-cyan-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                        {filteredClubs.length > 0 ? (
                          <>
                            <div
                              onClick={() => handleClubSelect("Other")}
                              className="px-4 py-3 hover:bg-cyan-50 cursor-pointer transition-colors text-sm text-gray-800 font-medium border-b-2 border-cyan-200"
                            >
                              {t('other')}
                            </div>
                            {filteredClubs.map((club) => (
                              <div
                                key={club}
                                onClick={() => handleClubSelect(club)}
                                className="px-4 py-3 hover:bg-cyan-50 cursor-pointer transition-colors text-sm text-gray-800 border-b border-gray-100 last:border-b-0"
                              >
                                {club}
                              </div>
                            ))}

                          </>
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            {t('noClubsFound')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Custom Club Input */}
                  {clubName === "Other" && (
                    <div className="relative mt-2">
                      <input
                        type="text"
                        value={customClub}
                        onChange={(e) => setCustomClub(e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                        placeholder={t('enterClub')}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Birthday Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  {t('dob')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                      placeholder={t('createPassword')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors"
                    >
                      {showPassword ? 
                        <EyeOff size={20} className="text-gray-400" /> : 
                        <Eye size={20} className="text-gray-400" />
                      }
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-800">
                    {t('confirmPassword')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-cyan-50 border-cyan-200 text-gray-800 focus:ring-blue-400"
                      placeholder={t('confirmPassword')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-2xl transition-colors"
                    >
                      {showConfirmPassword ? 
                        <EyeOff size={20} className="text-gray-400" /> : 
                        <Eye size={20} className="text-gray-400" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="mt-1 rounded border-2 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm cursor-pointer text-gray-600">
                  {t('accountAgree')}
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white"
                style={{
                  background: 'linear-gradient(135deg, #3cc4ff, #66f2ff)',
                  boxShadow: '0 4px 20px rgba(60, 196, 255, 0.3)'
                }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <span>{t('createAccount')}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                {t('haveAccount')}{' '}
                <a 
                  href={`/${locale}/login`}
                  className="font-semibold hover:underline transition-colors duration-200 text-blue-400"
                >
                  {t('signIn')}
                </a>
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
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }
      `}</style>
    </div>
  );
}