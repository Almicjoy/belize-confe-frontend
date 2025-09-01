import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // if Next.js

const palette = {
  primary: "#3cc4ffff",
  text: "#2D2D2D",
  cardBg: "#FFFFFF",
  cardBorder: "#b2f3ffff",
  cardShadow: "0 4px 12px rgba(60, 190, 255, 0.08)",
  accent: "#00d0ffff",
  midday: "#2C5282",
  textSecondary: "#7F8C8D",
};

const AccountPopup = ({
    trigger,
    onRegisterClick,
    }: {
    trigger: React.ReactNode;
    onRegisterClick?: () => void;
    }) => {
  const [open, setOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
        setShowSignIn(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popupRef}>
      {/* Trigger button */}
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {/* Dropdown popup */}
        {open && (
        <div
            className="absolute right-0 mt-2 w-96 rounded-xl shadow-lg p-6 z-50"
            style={{
            backgroundColor: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
            boxShadow: palette.cardShadow,
            }}
        >
            {!showSignIn ? (
            <>
                <h2
                className="text-lg font-semibold text-center mb-4"
                style={{ color: palette.midday }}
                >
                Already Registered?
                </h2>
                <div className="flex justify-center gap-4 mt-2">
                <button
                    className="px-5 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: palette.primary }}
                    onClick={() => setShowSignIn(true)}
                >
                    Yes, Sign In
                </button>
                <button
                    className="px-5 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: palette.accent }}
                    onClick={() => {
                    setOpen(false);
                    if (onRegisterClick) onRegisterClick(); // adjust as needed
                    }}
                >
                    No, Register
                </button>
                </div>
            </>
            ) : (
            <>
                <h2
                className="text-lg font-semibold text-center mb-4"
                style={{ color: palette.midday }}
                >
                Sign In
                </h2>
                <input
                type="email"
                placeholder="Email"
                className="mb-2 w-full border rounded-lg px-3 py-2"
                style={{ borderColor: palette.cardBorder }}
                />
                <input
                type="password"
                placeholder="Password"
                className="mb-4 w-full border rounded-lg px-3 py-2"
                style={{ borderColor: palette.cardBorder }}
                />
                <button
                className="w-full py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: palette.primary }}
                >
                Sign In
                </button>
            </>
            )}
        </div>
        )}

    </div>
  );
};

export default AccountPopup;
