"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { palette } from "@/lib/palette";
import React from "react";

export default function AccountMenu({ locale }: { locale: string | string[]}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Account Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-lg hover:scale-105 transition-transform"
        style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}
      >
        <User size={24} color={palette.white} />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
          style={{ borderColor: palette.cardBorder }}
        >
          <li>
            <Link
              href={`/${locale}/login`}
              className="block px-4 py-2 hover:bg-[var(--accent)] transition-colors"
              style={{ color: palette.text }}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/register`}
              className="block px-4 py-2 hover:bg-[var(--accent)] transition-colors"
              style={{ color: palette.text }}
            >
              Register
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
