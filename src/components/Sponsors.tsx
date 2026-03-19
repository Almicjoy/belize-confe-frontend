import React, { useState, useEffect, useRef, useCallback } from 'react';
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";

interface Sponsor {
  id: number;
  name: string;
  website: string;
  logo: string;
}

const INTERVAL_MS = 4000;
const TRANSITION_MS = 200;

const SponsorsComponent: React.FC = () => {
  const sponsors: Sponsor[] = [
    { id: 1, name: "The Grand Resort and Residences", website: "https://grandresortandresidencesbz.com/", logo: "grand_resort.png" },
    { id: 2, name: "Oceana Belize", website: "https://belize.oceana.org/", logo: "oceana.png" },
    { id: 3, name: "Marie Sharp's", website: "https://www.mariesharps.bz/", logo: "marie_sharps.png" },
    { id: 4, name: "Travellers Liquors Belize", website: "https://www.onebarrelrum.com/home", logo: "travellers.png" },
  ];

  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex(idx);
      setVisible(true);
    }, TRANSITION_MS);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sponsors.length);
        setVisible(true);
      }, TRANSITION_MS);
    }, INTERVAL_MS);
  }, [sponsors.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleGoTo = (idx: number) => { goTo(idx); resetTimer(); };

  const handleNavigate = (dir: number, e: React.MouseEvent) => {
    e.stopPropagation();
    goTo((currentIndex + dir + sponsors.length) % sponsors.length);
    resetTimer();
  };

  const sponsor = sponsors[currentIndex];
  const tickerItems = [...sponsors, ...sponsors];

  return (
    <section className="py-6 px-4" style={{ backgroundColor: palette.background }}>
      {/* Full-width on desktop, padded on mobile */}
      <div className="w-full max-w-5xl mx-auto">

        {/* Header label with live pulse dot */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: palette.cardBorder }} />
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ backgroundColor: palette.primary }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: palette.primary }}
              />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: palette.textSecondary }}>
              {t('ourSponsors')}
            </span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: palette.cardBorder }} />
        </div>

        {/* Main banner card */}
        <a
          href={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.005]"
          style={{ backgroundColor: palette.cardBg, border: `0.5px solid ${palette.cardBorder}` }}
        >
          <div className="flex items-stretch" style={{ minHeight: '100px' }}>
            {/* Accent bar */}
            <div className="w-2 flex-shrink-0" style={{ backgroundColor: palette.primary }} />

            {/* Content — stacks vertically on mobile, horizontal on sm+ */}
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-5 sm:px-8 py-5 flex-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
              }}
            >
              {/* Logo */}
              <div className="flex items-center justify-center sm:justify-start flex-shrink-0" style={{ width: '100%', maxWidth: '140px', margin: '0 auto' }}>
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  style={{
                    maxWidth: '140px',
                    maxHeight: '90px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              {/* Divider — vertical on desktop, horizontal on mobile */}
              <div
                className="hidden sm:block self-stretch w-px flex-shrink-0"
                style={{ backgroundColor: palette.cardBorder }}
              />
              <div
                className="block sm:hidden h-px w-full"
                style={{ backgroundColor: palette.cardBorder }}
              />

              {/* Text */}
              <div className="flex-1 min-w-0 text-center sm:text-left">

                <h2 className="text-lg sm:text-2xl font-bold leading-snug" style={{ color: palette.text }}>
                  {sponsor.name}
                </h2>
                <p className="text-xs mt-1 truncate" style={{ color: palette.textSecondary }}>
                  {sponsor.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </p>
              </div>

              {/* Visit badge — hidden on smallest mobile, shown sm+ */}
              <div className="hidden sm:flex flex-shrink-0 flex-col items-end gap-3">
                <span className="text-xs tabular-nums" style={{ color: palette.textSecondary }}>
                  {currentIndex + 1} / {sponsors.length}
                </span>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: palette.hobbyBg, color: palette.primary }}
                >
                  Visit site
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer: dots + nav buttons */}
          <div
            className="flex items-center justify-between px-5 sm:px-8 py-3"
            style={{ borderTop: `0.5px solid ${palette.cardBorder}` }}
          >
            <div className="flex items-center gap-1.5">
              {/* Counter visible on mobile where badge is hidden */}
              <span className="text-xs tabular-nums mr-2 sm:hidden" style={{ color: palette.textSecondary }}>
                {currentIndex + 1} / {sponsors.length}
              </span>
              {sponsors.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); handleGoTo(i); }}
                  aria-label={`Go to sponsor ${i + 1}`}
                  className="rounded-full transition-all duration-300 focus:outline-none"
                  style={{
                    width: i === currentIndex ? 20 : 8,
                    height: 8,
                    backgroundColor: i === currentIndex ? palette.primary : palette.cardBorder,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={(e) => handleNavigate(dir, e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center focus:outline-none"
                  style={{ border: `0.5px solid ${palette.cardBorder}`, backgroundColor: 'transparent' }}
                  aria-label={dir === -1 ? 'Previous' : 'Next'}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    {dir === -1
                      ? <path d="M7 2L3 6L7 10" stroke={palette.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      : <path d="M5 2L9 6L5 10" stroke={palette.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    }
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </a>

        {/* Scrolling ticker strip */}
        <div
          className="mt-4 overflow-hidden rounded-xl py-3"
          style={{ backgroundColor: palette.hobbyBg, border: `0.5px solid ${palette.cardBorder}` }}
        >
          <div className="flex gap-12 w-max" style={{ animation: 'sponsor-ticker 18s linear infinite' }}>
            {tickerItems.map((s, i) => (
              <span key={i} className="flex items-center gap-12 flex-shrink-0">
                <span className="text-sm font-semibold whitespace-nowrap" style={{ color: palette.textSecondary }}>
                  {s.name}
                </span>
                <span style={{ color: palette.cardBorder }}>•</span>
              </span>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes sponsor-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default SponsorsComponent;