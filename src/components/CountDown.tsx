"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@/utils/useTranslation";

const TARGET_DATE = new Date("2025-11-28T19:00:00-06:00").getTime();

const palette = {
  primary: "#FF6B6B",
  cardBg: "#FFFFFF",
  middayDark: "#2C3E50",
  midday: "#3498DB",
  hobbyBg: "#F8F9FA",
  cardBorder: "#E1E8ED",
  textSecondary: "#7F8C8D",
};

export default function CountdownDrawer() {
  const [isOpen, setIsOpen] = useState(true);
    const { t } = useTranslation();

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Toggle Button - only shows when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 right-4 z-50 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            backgroundColor: palette.primary,
            color: "white",
          }}
          aria-label="Show countdown"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      )}

      {/* BANNER */}
      <div
        className={`
          fixed z-40 w-full left-0 
          transition-all duration-500 ease-in-out
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
        style={{
          top: "5rem",
          borderBottom: `2px solid ${palette.primary}`,
          padding: "0.75rem 1rem",
          backgroundColor: palette.cardBg,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(52, 152, 219, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 35%, rgba(255, 107, 107, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 85%, rgba(155, 89, 182, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,249,250,0.95))
          `,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-4xl mx-auto relative">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-1 right-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            style={{ color: palette.textSecondary }}
            aria-label="Close countdown"
          >
            <X size={18} />
          </button>

          <div className="text-center pr-8">
            {/* Title - smaller on mobile */}
            <h2
              className="font-bold mb-2 text-base sm:text-lg md:text-xl"
              style={{ color: palette.middayDark }}
            >
              {t("countdown")}
            </h2>

            {/* Countdown Boxes */}
            <div className="flex justify-center  gap-2 sm:gap-3 md:gap-4">
              {[
        { label: t("days"), value: timeLeft.days },
        { label: t("hours"), value: timeLeft.hours },
        { label: t("minutes"), value: timeLeft.minutes },
        { label: t("seconds"), value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{
                    minWidth: "65px",
                    width: "52px",
                    height: "52px",
                    backgroundColor: palette.hobbyBg,
                    border: `1px solid ${palette.cardBorder}`,
                  }}
                >
                  <span
                    className="font-bold text-xl sm:text-2xl leading-none"
                    style={{ color: palette.midday }}
                  >
                    {item.value}
                  </span>
                  <span
                    className="text-[10px] sm:text-xs font-medium mt-1"
                    style={{ color: palette.textSecondary }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkleMove {
          0%, 100% {
            background-position: 0% 0%, 100% 0%, 50% 100%;
          }
          50% {
            background-position: 100% 100%, 0% 100%, 50% 0%;
          }
        }
      `}</style>
    </>
  );
}