import React, { useState } from "react";
import { palette } from "@/lib/palette";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "@/utils/useTranslation";
import { useRouter } from "next/navigation"; // or "next/router" if using Pages Router

interface Activity {
  name: string;
}

interface PreConfeOption {
  id: number;
  name: string;
  destination: string;
  price: number;
  activityList: Activity[];
  date: string;
  time: string;
  description: string;
  maxPersons: string | number;
  imagePath: string[];
}

interface PreConfeCardProps {
  option: PreConfeOption;
  onAdd: (option: PreConfeOption) => void;
}

const parseActivity = (name: string): { title: string; detail: string } => {
  const colonIndex = name.indexOf(":");
  if (colonIndex !== -1) {
    return {
      title: name.slice(0, colonIndex).trim(),
      detail: name.slice(colonIndex + 1).trim(),
    };
  }
  return { title: name, detail: "" };
};

const PreConfe: React.FC = () => {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // Tracks which option was tapped (for optimistic UI feedback)
  const [addingId, setAddingId] = useState<number | null>(null);

  const preconfeOptions: PreConfeOption[] =
    t("preconfeDays") as unknown as PreConfeOption[];

  /**
   * Called when the user clicks "Add to My Account".
   *
   * Strategy:
   * 1. Persist the chosen option in sessionStorage so the dashboard can
   *    pick it up after a successful login.
   * 2. Redirect to /dashboard (the server redirects unauthenticated users
   *    to /login, which redirects back to /dashboard after success).
   *
   * Adjust the route strings to match your project's routing.
   */
  const handleAdd = (option: PreConfeOption) => {
    setAddingId(option.id);

    // Save intent so dashboard can auto-add after auth
    sessionStorage.setItem(
      "pendingPreconfe",
      JSON.stringify({ id: option.id, name: option.destination })
    );

    // Small delay for button animation, then navigate
    setTimeout(() => {
      router.push(`/${locale}/dashboard?addPreconfe=${option.id}`);
    }, 350);
  };

  const PreConfeCard: React.FC<PreConfeCardProps> = ({ option, onAdd }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = option.imagePath ?? [];
    const isAdding = addingId === option.id;

    return (
      <div
        className="rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border overflow-hidden"
        style={{
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
          boxShadow: palette.cardShadow,
        }}
      >
        {/* Hero Image */}
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
          <img
            key={images[activeIndex]}
            src={`${images[activeIndex]}`}
            alt={option.destination}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Day badge */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: palette.primary }}
          >
            {option.name}
          </div>

          {/* Price badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-sm font-bold text-white bg-black/50 backdrop-blur-sm">
            ${option.price}{" "} USD
            <span className="font-normal text-xs">/ person</span>
          </div>

          {/* Image dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor:
                      i === activeIndex ? "#ffffff" : "rgba(255,255,255,0.45)",
                    transform: i === activeIndex ? "scale(1.25)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-all duration-200 text-xs"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-black/40 text-white hover:bg-black/60 transition-all duration-200 text-xs"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-1">
          {/* Title */}
          <h3
            className="text-lg font-bold mb-3 leading-snug"
            style={{ color: palette.primary }}
          >
            {option.destination}
          </h3>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: palette.hobbyBg,
                color: palette.textSecondary,
              }}
            >
              {option.date}
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: palette.hobbyBg,
                color: palette.textSecondary,
              }}
            >
              {option.time}
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: palette.hobbyBg,
                color: palette.textSecondary,
              }}
            >
              {option.maxPersons} {t("capacity")}
            </span>
          </div>

          {/* Description */}
          {option.description ? (
            <div className="text-sm mb-4 leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p style={{ color: palette.text }} {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    />
                  ),
                }}
              >
                {option.description}
              </ReactMarkdown>
            </div>
          ) : null}

          {/* Activities */}
          <div className="flex-1">
            <p
              className="font-semibold mb-3 text-xs uppercase tracking-wider"
              style={{ color: palette.textSecondary }}
            >
              {t("activities")}
            </p>
            <ul className="space-y-3">
              {option.activityList.map((activity, i) => {
                const { title, detail } = parseActivity(activity.name);
                return (
                  <li key={i} className="flex gap-3 items-start">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div>
                      <p
                        className="text-sm font-semibold leading-snug"
                        style={{ color: palette.text }}
                      >
                        {title}
                      </p>
                      {detail ? (
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p
                                className="text-xs mt-0.5 leading-relaxed"
                                style={{ color: palette.textSecondary }}
                                {...props}
                              />
                            ),
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-xs mt-0.5"
                              />
                            ),
                          }}
                        >
                          {detail}
                        </ReactMarkdown>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Action buttons ── */}
          <div className="mt-6 flex gap-3">
            {/* Original "select" button — keep existing behaviour */}

            {/* NEW — Add to My Account */}
            <button
              onClick={() => onAdd(option)}
              disabled={isAdding}
              className="flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm flex items-center justify-center gap-2"
              style={{
                backgroundColor: isAdding
                  ? palette.textSecondary
                  : palette.primary,
                color: "#fff",
                opacity: isAdding ? 0.75 : 1,
                cursor: isAdding ? "not-allowed" : "pointer",
              }}
            >
              {isAdding ? (
                <>
                  {/* Minimal spinner */}
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  {t("redirecting") ?? "Redirecting…"}
                </>
              ) : (
                <>
                  {/* Plus icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t("addToAccount") ?? "Add to My Account"}
                </>
              )}
            </button>
          </div>

          {/* Helper hint shown when idle */}
          <p
            className="text-xs text-center mt-2"
            style={{ color: palette.textSecondary }}
          >
            {t("loginRequired") ??
              "You'll be asked to log in if you haven't already."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: palette.background }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: palette.primary }}
          >
            PreConfe
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: palette.textSecondary }}
          >
            {t("preConferenceDesc")}
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {preconfeOptions.map((option) => (
            <PreConfeCard key={option.id} option={option} onAdd={handleAdd} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreConfe;