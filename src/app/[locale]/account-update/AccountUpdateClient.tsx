"use client"

import React, { useState, useEffect } from 'react';
import { User, Phone, Shirt, Camera, Save, Loader2 } from 'lucide-react';
import { palette } from "@/lib/palette";
import { useSession } from 'next-auth/react';


interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  clubName: string;
  countryCode?: string;
  phone?: string;
  tShirtSize?: string;
  profilePicUrl?: string;
}

const AccountUpdateClient: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    countryCode: '',
    phone: '',
    tShirtSize: '',
    profilePicUrl: '',
  });

  const tShirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  // Fetch user data when session is available
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setError('Please log in to view your account');
      setLoading(false);
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (!session?.user?.email) {
        throw new Error('No user email found');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?email=${encodeURIComponent(session.user.email)}`);

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      setUserData(data);
      
      // Pre-fill form with existing data
      setFormData({
        countryCode: data.countryCode || '',
        phone: data.phone || '',
        tShirtSize: data.tShirtSize || '',
        profilePicUrl: data.profilePicUrl || '',
      });
    } catch (err) {
      setError('Failed to load user data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!session?.user?.email) {
        throw new Error('No user email found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update account');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setSuccess('Account updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: palette.background }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: palette.primary }} />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: palette.background }}>
        <div className="text-center">
          <p className="mb-4 text-base sm:text-lg" style={{ color: palette.error }}>Please log in to view your account</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 rounded-lg text-sm sm:text-base font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: palette.primary, color: palette.white }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: palette.background }}>
        <div className="text-center">
          <p className="mb-4 text-base sm:text-lg" style={{ color: palette.error }}>Failed to load user data</p>
          <button
            onClick={fetchUserData}
            className="px-6 py-3 rounded-lg text-sm sm:text-base font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: palette.primary, color: palette.white }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 mt-20" 
      style={{ backgroundColor: palette.background }}
    >
      <div className="max-w-4xl mx-auto">
        <div 
          className="rounded-xl p-4 sm:p-6 md:p-8"
          style={{
            backgroundColor: palette.cardBg,
            border: `2px solid ${palette.cardBorder}`,
            boxShadow: palette.cardShadow,
          }}
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" 
              style={{ color: palette.text }}
            >
              Update Your Account
            </h1>
            <p className="text-sm sm:text-base" style={{ color: palette.textSecondary }}>
              Manage your personal information and preferences
            </p>
          </div>

          {/* Read-only Information */}
          <div 
            className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg" 
            style={{ backgroundColor: palette.hobbyBg }}
          >
            <h2 
              className="text-base sm:text-lg font-semibold mb-4 flex items-center" 
              style={{ color: palette.hobbyText }}
            >
              <User className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Account Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm mb-1" style={{ color: palette.textSecondary }}>
                  Name
                </p>
                <p className="font-medium text-sm sm:text-base break-words" style={{ color: palette.text }}>
                  {userData.firstName} {userData.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm mb-1" style={{ color: palette.textSecondary }}>
                  Email
                </p>
                <p className="font-medium text-sm sm:text-base break-all" style={{ color: palette.text }}>
                  {userData.email}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm mb-1" style={{ color: palette.textSecondary }}>
                  Country
                </p>
                <p className="font-medium text-sm sm:text-base break-words" style={{ color: palette.text }}>
                  {userData.country}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm mb-1" style={{ color: palette.textSecondary }}>
                  Club Name
                </p>
                <p className="font-medium text-sm sm:text-base break-words" style={{ color: palette.text }}>
                  {userData.clubName}
                </p>
              </div>
            </div>
          </div>

          {/* Editable Form */}
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Country Code */}
              <div>
                <label 
                  className="block text-xs sm:text-sm font-medium mb-2 flex items-center" 
                  style={{ color: palette.text }}
                >
                  <Phone className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Country Code
                </label>
                <input
                  type="text"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  placeholder="+506"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 outline-none transition-colors text-sm sm:text-base"
                  style={{
                    borderColor: palette.cardBorder,
                    color: palette.text,
                  }}
                  onFocus={(e) => e.target.style.borderColor = palette.primary}
                  onBlur={(e) => e.target.style.borderColor = palette.cardBorder}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label 
                  className="block text-xs sm:text-sm font-medium mb-2" 
                  style={{ color: palette.text }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="8888-8888"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 outline-none transition-colors text-sm sm:text-base"
                  style={{
                    borderColor: palette.cardBorder,
                    color: palette.text,
                  }}
                  onFocus={(e) => e.target.style.borderColor = palette.primary}
                  onBlur={(e) => e.target.style.borderColor = palette.cardBorder}
                />
              </div>
            </div>

            {/* T-Shirt Size */}
            <div>
              <label 
                className="block text-xs sm:text-sm font-medium mb-2 flex items-center" 
                style={{ color: palette.text }}
              >
                <Shirt className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                T-Shirt Size
              </label>
              <select
                name="tShirtSize"
                value={formData.tShirtSize}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 outline-none transition-colors text-sm sm:text-base"
                style={{
                  borderColor: palette.cardBorder,
                  color: palette.text,
                }}
                onFocus={(e) => e.target.style.borderColor = palette.primary}
                onBlur={(e) => e.target.style.borderColor = palette.cardBorder}
              >
                <option value="">Select a size</option>
                {tShirtSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Profile Picture URL */}
            <div>
              <label 
                className="block text-xs sm:text-sm font-medium mb-2 flex items-center" 
                style={{ color: palette.text }}
              >
                <Camera className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Profile Picture URL
              </label>
              <input
                type="url"
                name="profilePicUrl"
                value={formData.profilePicUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/profile.jpg"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 outline-none transition-colors text-sm sm:text-base"
                style={{
                  borderColor: palette.cardBorder,
                  color: palette.text,
                }}
                onFocus={(e) => e.target.style.borderColor = palette.primary}
                onBlur={(e) => e.target.style.borderColor = palette.cardBorder}
              />
              {formData.profilePicUrl && (
                <div className="mt-3">
                  <p className="text-xs sm:text-sm mb-2" style={{ color: palette.textSecondary }}>
                    Preview:
                  </p>
                  <img
                    src={formData.profilePicUrl}
                    alt="Profile preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2"
                    style={{ borderColor: palette.cardBorder }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div 
                className="p-3 sm:p-4 rounded-lg" 
                style={{ backgroundColor: `${palette.error}20` }}
              >
                <p className="text-sm sm:text-base" style={{ color: palette.error }}>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div 
                className="p-3 sm:p-4 rounded-lg" 
                style={{ backgroundColor: `${palette.success}20` }}
              >
                <p className="text-sm sm:text-base" style={{ color: palette.success }}>
                  {success}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              style={{
                backgroundColor: saving ? palette.textLight : palette.primary,
                color: palette.white,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = palette.accent;
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = palette.primary;
              }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountUpdateClient;