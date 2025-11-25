"use client";
import { useState, useEffect } from "react";
import { palette } from "@/lib/palette";
import { Timer, X } from "lucide-react"; // lucide icons
import { useTranslation } from "@/utils/useTranslation";

const TARGET_DATE = new Date("2025-11-28T19:00:00-06:00").getTime();

export default function CountdownDrawer() {
  const [isOpen, setIsOpen] = useState(true); // default: ON
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
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed z-50 p-3 shadow-md rounded-xl transition-all 
          right-4 bottom-4 sm:top-4 sm:right-4 sm:bottom-auto
        "
        style={{
          backgroundColor: palette.primary,
          color: palette.white,
        }}
      >
        {isOpen ? <X size={20} /> : <Timer size={20} />}
      </button>

      {/* Drawer Container */}
        <div
        className={`
            fixed z-40 w-[40%] sm:w-[28rem] 
            transition-transform duration-300 shadow-xl p-6
            
            /* MOBILE: slide in from right */
            right-0 top-16 sm:top-0 sm:left-1/2 sm:-translate-x-1/2
            h-auto sm:h-auto rounded-l-xl sm:rounded-none

            /* Slide open/close */
            ${isOpen
            ? "translate-x-0 sm:translate-y-0"
            : "translate-x-full sm:-translate-y-full"}
        `}
        style={{
            backgroundColor: palette.cardBg,
            borderBottom: `3px solid ${palette.primary}`,
            borderLeft: "none",
            borderRight: "none",
        }}
        >
        {/* Title */}
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: palette.middayDark }}
        >
          {t('countdown')}
        </h2>

        {/* Timer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: t('days'), value: timeLeft.days },
            { label: t('hours'), value: timeLeft.hours },
            { label: t('minutes'), value: timeLeft.minutes },
            { label: t('seconds'), value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-xl shadow"
              style={{
                backgroundColor: palette.hobbyBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: palette.midday }}
              >
                {item.value}
              </span>
              <span
                className="text-sm font-medium mt-1"
                style={{ color: palette.textSecondary }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
