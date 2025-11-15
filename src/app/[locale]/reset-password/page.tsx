"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError(t('fillBothFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDontMatch'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(t('resetFailed'));

      setMessage(t('resetSuccessful'));
      setPassword("");
      setConfirmPassword("");
        // Navigate to login page after 2 seconds
  setTimeout(() => {
    router.push("/login"); // adjust path if your login page is different
  }, 2000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: palette.background }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-lg"
        style={{
          backgroundColor: palette.cardBg,
          border: `1px solid ${palette.cardBorder}`,
          boxShadow: palette.cardShadow,
        }}
      >
        <h2
          className="text-2xl font-semibold mb-4 text-center"
          style={{ color: palette.text }}
        >
          {t('resetPassord')}
        </h2>

        {!token ? (
          <p
            className="text-center font-medium"
            style={{ color: palette.error }}
          >
            {t('unauthorizedToken')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block mb-1 font-medium"
                style={{ color: palette.textSecondary }}
              >
                {t('newPassword')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none transition"
                style={{
                  backgroundColor: palette.hobbyBg,
                  borderColor: palette.cardBorder,
                  color: palette.text,
                  boxShadow: `0 0 0 2px transparent`,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${palette.primary}`)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px transparent`)
                }
                placeholder={t('newPassword')}
              />
            </div>

            <div>
              <label
                className="block mb-1 font-medium"
                style={{ color: palette.textSecondary }}
              >
                {t('confirmNewPassword')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none transition"
                style={{
                  backgroundColor: palette.hobbyBg,
                  borderColor: palette.cardBorder,
                  color: palette.text,
                  boxShadow: `0 0 0 2px transparent`,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${palette.primary}`)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px transparent`)
                }
                placeholder={t('confirmNewPassword')}
              />
            </div>

            {error && (
              <p
                className="text-center text-sm font-medium"
                style={{ color: palette.error }}
              >
                {error}
              </p>
            )}
            {message && (
              <p
                className="text-center text-sm font-medium"
                style={{ color: palette.success }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium transition transform disabled:opacity-50 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                color: palette.white,
              }}
            >
              {loading ? t('resetting') : t('resetPassword')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
