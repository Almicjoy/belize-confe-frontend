"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/utils/useTranslation";
import { palette } from "@/lib/palette";

// ─── Types ────────────────────────────────────────────────────────────────────

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

/** Shape returned by GET /api/preconfe/status */
interface PreConfeStatus {
  preconfeId: string;   // matches PreConfeOption.id (cast to string for comparison)
  maxPersons: number;   // -1 unlimited | 0 sold out | N spots remaining
  soldOut: boolean;
  price: number;
}

interface SessionData {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** No new purchases after this date (midnight UTC). */
const PURCHASE_CUTOFF = new Date("2026-05-01T00:00:00-06:00");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isPastCutoff(): boolean {
  return new Date() >= PURCHASE_CUTOFF;
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

/** Human-readable spots-remaining label. */
function SpotsLabel({ maxPersons }: { maxPersons: number }) {
  const { t } = useTranslation();
  if (maxPersons === -1) return null; // unlimited — don't show anything
  if (maxPersons === 0)
    return (
      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
        {t("soldOut")}
      </span>
    );
  return (
    <span
      className={[
        "text-xs font-semibold px-2 py-0.5 rounded-full",
        maxPersons <= 5
          ? "text-orange-600 bg-orange-50"
          : "text-gray-500 bg-gray-100",
      ].join(" ")}
    >
      {maxPersons} {maxPersons === 1 ? t("spot") : t("spots")} {t("left")}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPreconfe({
  sessionData,
}: {
  sessionData: SessionData;
}) {
  const { t } = useTranslation();

  const [cart, setCart] = useState<number[]>([]);
  const [purchased, setPurchased] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  /** Live DB state keyed by preconfeId string */
  const [statusMap, setStatusMap] = useState<Record<string, PreConfeStatus>>({});

  const preconfeOptions = t("preconfeDays") as unknown as PreConfeOption[];
  const cutoffPassed = isPastCutoff();

  // ── Fetch live status from DB ─────────────────────────────────────────────
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/preconfe/status`
        );
        const data = await res.json();
        if (Array.isArray(data.options)) {
          const map: Record<string, PreConfeStatus> = {};
          (data.options as PreConfeStatus[]).forEach((s) => {
            map[String(s.preconfeId)] = s;
          });
          setStatusMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch preconfe status:", err);
      }
    };
    fetchStatus();
  }, []);

  // ── Fetch already-purchased IDs ───────────────────────────────────────────
  useEffect(() => {
    if (!sessionData.email) return;
    const fetchPurchasedIds = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/preconfe/user-ids?email=${encodeURIComponent(
            sessionData.email!
          )}`
        );
        const data = await res.json();
        if (Array.isArray(data.preconfeIds)) {
          setPurchased(data.preconfeIds);
        }
      } catch (err) {
        console.error("Failed to fetch purchased preconfe IDs:", err);
      }
    };
    fetchPurchasedIds();
  }, [sessionData.email]);

  // ── Cart helpers ──────────────────────────────────────────────────────────

  const getLiveMaxPersons = (option: PreConfeOption): number => {
    const live = statusMap[String(option.id)];
    // Fall back to the static translation value if DB hasn't loaded yet
    if (live) return live.maxPersons;
    return Number(option.maxPersons);
  };

  const isSoldOut = (option: PreConfeOption): boolean =>
    getLiveMaxPersons(option) === 0;

  const isDisabled = (option: PreConfeOption): boolean =>
    cutoffPassed || isSoldOut(option);

  const addToCart = (option: PreConfeOption) => {
    if (cart.includes(option.id)) return;
    if (purchased.includes(option.id)) return;
    if (isDisabled(option)) return;
    setCart((prev) => [...prev, option.id]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i !== id));
  };

  const cartItems = preconfeOptions?.filter((o) => cart.includes(o.id)) ?? [];
  const cartTotal = cartItems.reduce((sum, o) => sum + o.price, 0);

  // ── Checkout ──────────────────────────────────────────────────────────────

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const orderNumber = `PRECONFE-${sessionData.email}-${Date.now()}`;
      const totalAmount = cartTotal * 100 * 2;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/preconfe/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: sessionData.id,
            email: sessionData.email,
            fullName: `${sessionData.firstName} ${sessionData.lastName ?? ""}`.trim(),
            amount: totalAmount,
            orderNumber,
            preconfeIds: cart,
            description: `PreConfe registration - ${cartItems
              .map((i) => i.destination)
              .join(", ")}`,
            returnUrl: process.env.NEXT_PUBLIC_RETURN_URL || "",
            dynamicCallbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL || "",
            locale: "en",
          }),
        }
      );

      const data = await res.json();

      if (data.free && data.success) {
        setPurchased((prev) => [...prev, ...cart]);
        setCart([]);
        setCartOpen(false);
        setCheckoutDone(true);
      } else if (data.bankResponse?.formUrl) {
        window.location.href = data.bankResponse.formUrl;
      } else {
        console.error("No formUrl returned:", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCheckingOut(false);
    }
  };

  const isFree = (price: number) => price === 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {t("preconfeTitle")}
            </h1>
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90"
            style={{
              background: cart.length > 0 ? palette.primary : "#f3f4f6",
              color: cart.length > 0 ? "#fff" : "#374151",
            }}
          >
            <CartIcon />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
            <span>
              {cart.length === 0
                ? t("preconfeCart")
                : `${cart.length} ${
                    cart.length > 1 ? t("preconfeItems") : t("preconfeItem")
                  } — $${cartTotal} USD`}
            </span>
          </button>
        </div>

        {/* Cutoff banner */}
        {cutoffPassed && (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl px-4 sm:px-5 py-3 sm:py-4 mb-6 sm:mb-8">
            🔒 {t("preconfeRegistrationClosed") ?? "Pre-conference registration is now closed."}
          </div>
        )}

        {/* Success banner */}
        {checkoutDone && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded-xl px-4 sm:px-5 py-3 sm:py-4 mb-6 sm:mb-8">
            ✅ {t("preconfePurchaseConfirmed")}
          </div>
        )}

        {/* Options list */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {preconfeOptions.map((option) => {
            const bought = purchased.includes(option.id);
            const inCart = cart.includes(option.id);
            const free = isFree(Number(option.price));
            const soldOut = isSoldOut(option);
            const liveMaxPersons = getLiveMaxPersons(option);
            // An option is visually dimmed when it can't be acted on and hasn't been bought
            const dimmed = !bought && (cutoffPassed || soldOut);

            return (
              <div
                key={option.id}
                className={[
                  "bg-white rounded-2xl border overflow-hidden transition-all duration-200",
                  "flex flex-col sm:flex-row",
                  bought
                    ? "opacity-60 border-green-200"
                    : dimmed
                    ? "opacity-50 border-gray-200 grayscale"
                    : inCart
                    ? "border-indigo-400 ring-2 ring-indigo-100"
                    : "border-gray-200 hover:shadow-md",
                ].join(" ")}
              >
                {/* Image */}
                <div
                  className="relative w-full h-44 sm:w-48 sm:h-auto shrink-0 bg-gradient-to-br from-indigo-100 to-indigo-200 bg-cover bg-center"
                  style={
                    option.imagePath?.[0]
                      ? { backgroundImage: `url(/${option.imagePath[0]})` }
                      : {}
                  }
                >
                  {bought && (
                    <div className="absolute inset-0 bg-green-500/75 flex items-center justify-center text-white font-bold text-sm">
                      ✓ {t("preconfePurchased")}
                    </div>
                  )}
                  {soldOut && !bought && (
                    <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center text-white font-bold text-sm">
                      Sold Out
                    </div>
                  )}
                  {inCart && !bought && !soldOut && (
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {t("preconfeInCart")}
                    </span>
                  )}
                  {/* Day label */}
                  <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {option.name}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 sm:p-5">

                  {/* Top row: destination + price */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                      {option.destination}
                    </h3>
                    <span className="text-lg sm:text-xl font-extrabold shrink-0">
                      {free ? (
                        <span className="text-green-600 text-sm sm:text-base">
                          {t("preconfeNoFee")}
                        </span>
                      ) : (
                        <span className="text-gray-900">${option.price} USD</span>
                      )}
                    </span>
                  </div>

                  {/* Date + time */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400 font-medium">
                      {option.date}
                    </span>
                    {option.time && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {option.time}
                      </span>
                    )}
                    {/* Live spots remaining badge */}
                    <SpotsLabel maxPersons={liveMaxPersons} />
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {option.description}
                  </p>

                  {/* Bottom row: maxPersons label + action */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-2">
                    <span className="text-xs text-gray-400 font-medium">
                      👥 {option.maxPersons}
                    </span>

                    {bought ? (
                      <span className="text-sm font-semibold text-green-600">
                        {t("preconfePurchased")} ✓
                      </span>
                    ) : soldOut ? (
                      <span className="text-sm font-semibold text-gray-400">
                        {t("soldOut")}
                      </span>
                    ) : cutoffPassed ? (
                      <span className="text-sm font-semibold text-gray-400">
                        {t("preconfeRegistrationClosed") ?? "Registration closed"}
                      </span>
                    ) : inCart ? (
                      <button
                        onClick={() => removeFromCart(option.id)}
                        className="text-xs sm:text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
                      >
                        {t("preconfeRemove")}
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(option)}
                        className="text-xs sm:text-sm font-semibold text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
                        style={{ background: palette.primary }}
                      >
                        {free ? t("preconfeRegisterFree") : t("preconfeAddToCart")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/40 z-40"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed top-24 right-0 sm:right-4 bottom-6 w-full sm:w-96 max-w-[95vw] bg-white z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {t("preconfeYourCart")}
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                {t("preconfeCartEmpty")}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 divide-y divide-gray-100">
                  {cartItems.map((option) => (
                    <div
                      key={option.id}
                      className="py-4 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {option.destination}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {option.date}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="font-bold text-gray-900">
                          {isFree(Number(option.price)) ? (
                            <span className="text-green-600 text-sm">
                              {t("preconfeFree")}
                            </span>
                          ) : (
                            `$${option.price}`
                          )}
                        </span>
                        <button
                          onClick={() => removeFromCart(option.id)}
                          className="text-xs text-red-500 hover:underline font-medium"
                        >
                          {t("preconfeRemove")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 sm:px-6 py-5 sm:py-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">
                      {t("preconfeTotal")}
                    </span>
                    <span className="text-2xl font-extrabold text-gray-900">
                      ${cartTotal} USD
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full py-3 sm:py-3.5 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: palette.primary }}
                  >
                    {checkingOut
                      ? t("preconfeProcessing")
                      : t("preconfeCheckout")}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}