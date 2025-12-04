"use client"

import { useEffect, useState } from 'react';
import { Check, CreditCard, Calendar, DollarSign, X, Users } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";
import { palette } from "@/lib/palette";
import promoData from "@/lib/promos.json";
import { useTranslation } from "@/utils/useTranslation";


interface Plan {
  id: number;
  installments: number;
  paymentAmount: number;
  totalAmount: number;
  paymentSchedule: string;
  savings: string | null;
  popular: boolean;
  features: string[];
  cutoff: string;
}

interface AccommodationRoom {
  id: number;
  name: string;
  guests: number;
  description: string;
  amenities: string[];
  features: string[];
  image: string;
  extraFees?: boolean;
}

interface SessionData {
    id?: string,
    email?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    club?: string;
    hasSelectedPlan?: boolean;
    selectedPlan?: string;
}

interface Promo {
  _id: string;
  code: string;
  amount: number;
  discount: number;
  room_type: string;
  date_active: string;
}

interface PromoReservation {
  reservationId: string;
  discount: number;
  expiresAt: string;
}

interface SelectPlanProps {
  sessionData?: SessionData;
}

const SelectPlan: React.FC<SelectPlanProps> = ({ sessionData }) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoStatus, setPromoStatus] = useState<"success" | "error" | null>(null);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [promoReservation, setPromoReservation] = useState<PromoReservation | null>(null);
  const [reservationExpired, setReservationExpired] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [userState, setUserState] = useState({
    hasSelectedPlan: sessionData?.hasSelectedPlan ?? false,
    selectedPlan: sessionData?.selectedPlan ?? "",
  });
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, number>>({});
  const [roomPrice, setRoomPrice] = useState<Record<number, number>>({});
  const [selectedRoomPrice, setSelectedRoomPrice] = useState<number | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  
  // NEW: Store calculated promo discount in state
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  const { t, locale } = useTranslation();
  const plans: Plan[] = t("plans") as unknown as Plan[];
  const rooms: AccommodationRoom[] = t("room") as unknown as AccommodationRoom[];

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const handleSelectRoom = (roomId: number) => {
    if (availabilityMap[roomId] == 0) return; 
    setSelectedRoom(roomId);
    setSelectedRoomPrice(roomPrice[roomId] ?? null);
  };

  const getValidPromo = async (code: string): Promise<Promo | null> => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/promo?code=${encodeURIComponent(code)}`;
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const promo: Promo = await response.json();
      const now = new Date();

      if (promo.date_active) {
        const activeDate = new Date(promo.date_active);
        if (now < activeDate) {
          return null; // Promo not active yet
        }
      }

      if (promo.amount <= 0) {
        return null;
      }

      if (promo.room_type && Number(promo.room_type) !== selectedRoom) {
        return null;
      }

      return promo;
    } catch (err) {
      console.error("Error fetching promo:", err);
      return null;
    }
  };

  // ==========================================
  // NEW: Reserve Promo (atomic)
  // ==========================================
  const reservePromo = async (code: string): Promise<PromoReservation | null> => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/promo/reserve`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          userId: sessionData?.id,
          roomType: selectedRoom
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Reservation failed:", errorData);
        return null;
      }

      const data = await response.json();
      return {
        reservationId: data.reservationId,
        discount: data.promo.discount,
        expiresAt: data.promo.expiresAt
      };
    } catch (err) {
      console.error("Error reserving promo:", err);
      return null;
    }
  };

  // ==========================================
  // UPDATED: Apply Promo Handler
  // ==========================================
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoStatus("error");
      return;
    }

    if (!selectedRoom) {
      alert(t('pleaseSelectRoom') || "Please select a room first");
      return;
    }

    setIsProcessing(true);
    setPromoStatus(null);

    try {
      // First validate the promo exists and is valid
      const promo = await getValidPromo(promoCode);
      
      if (!promo) {
        setPromoStatus("error");
        setPromoApplied(false);
        setIsProcessing(false);
        return;
      }

      // Now reserve it atomically
      const reservation = await reservePromo(promoCode);

      if (!reservation) {
        setPromoStatus("error");
        setPromoApplied(false);
        setIsProcessing(false);
        return;
      }

      // Success - store reservation
      setPromoReservation(reservation);
      setPromoApplied(true);
      setPromoStatus("success");
      setReservationExpired(false);

      // Start countdown to expiration
      startExpirationTimer(reservation.expiresAt);

    } catch (err) {
      console.error("Error applying promo:", err);
      setPromoStatus("error");
      setPromoApplied(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================
  // NEW: Expiration Timer
  // ==========================================
  const startExpirationTimer = (expiresAt: string) => {
    const expiryTime = new Date(expiresAt).getTime();
    
    const checkExpiration = () => {
      const now = Date.now();
      const timeLeft = expiryTime - now;

      if (timeLeft <= 0) {
        setReservationExpired(true);
        setPromoApplied(false);
        setPromoReservation(null);
        setPromoStatus("error");
        setMessage({
          type: "error",
          text: t('promoExpired') || "Promo reservation expired. Please apply again."
        });
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkExpiration, 10000);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  };

  // ==========================================
  // UPDATED: Calculate Final Amount
  // ==========================================
  const calculateFinalAmount = (plan: Plan) => {
    let amount = Number(selectedRoomPrice);
    
    if (promoApplied && promoReservation) {
      amount = amount * (1 - promoReservation.discount);
    }
    
    return amount;
  };

  // ==========================================
  // UPDATED: Calculate Promo Discount
  // ==========================================
  useEffect(() => {
    if (promoApplied && promoReservation && selectedRoomPrice) {
      const discount = Number(selectedRoomPrice) * promoReservation.discount;
      setPromoDiscount(discount);
    } else {
      setPromoDiscount(0);
    }
  }, [promoApplied, promoReservation, selectedRoomPrice, selectedPlan]);

  // ==========================================
  // UPDATED: Purchase Handler
  // ==========================================
  const handlePurchase = async (plan: Plan) => {
    if (!sessionData?.email || !sessionData.firstName) {
      alert("Missing user session data");
      return;
    }

    if (reservationExpired) {
      alert(t('promoExpiredReapply') || "Your promo reservation expired. Please reapply the code.");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const discountedAmount = calculateFinalAmount(plan);
      console.log(promoReservation?.reservationId)

      const payload = {
        amount: Math.round(((discountedAmount * 100) * 2) / plan.installments),
        description: `Belize 2026 Conference Registration - Payment 1`,
        returnUrl: process.env.NEXT_PUBLIC_RETURN_URL || "",
        orderNumber: uuidv4(),
        clientId: sessionData.id,
        email: sessionData.email,
        planId: plan.id,
        status: "-1",
        paymentNumber: "1",
        fullName: `${sessionData.firstName} ${sessionData.lastName ?? ""}`.trim(),
        dynamicCallbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL || "",
        installments: plan.installments,
        reservationId: promoReservation?.reservationId,
        promoCode: promoApplied ? promoCode : null,
        selectedRoom: selectedRoom,
        locale: locale,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.bankResponse?.formUrl) {
        window.location.href = data.bankResponse.formUrl;
      } else if (data.bankResponse?.errorMessage) {
        alert("Error " + data.bankResponse?.errorCode + ": " + data.bankResponse?.errorMessage);
      } else {
        alert("Payment request sent, but no redirect URL received.");
      }
    } catch (error) {
      console.error(error);
      alert("Payment error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsDataLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rooms`);
        const data = await res.json();

        if (data.success) {
          const mapAvailable: Record<number, number> = {};
          const mapPrice: Record<number, number> = {};
          data.data.forEach((room: { id: number; available: number }) => {
            mapAvailable[room.id] = room.available;
          });
          data.data.forEach((room: { id: number; price: number }) => {
            mapPrice[room.id] = room.price;
          });
          setAvailabilityMap(mapAvailable);
          setRoomPrice(mapPrice);
        }
      } catch (err) {
        console.error("Error fetching room availability:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const isCutoffPast = (cutoff?: string) => {
    if (!cutoff) return false;
    const today = new Date();
    const cutoffDate = new Date(cutoff);
    return cutoffDate < today;
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{ background: `linear-gradient(135deg, ${palette.lightOrange} 0%, ${palette.hobbyBg} 100%)` }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Room Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: palette.text }}>
            {t('conferenceAccommodations')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => {
              const isSoldOut = (availabilityMap[room.id] == 0);
              const isLowAvailability = availabilityMap[room.id] != null && availabilityMap[room.id] > 0 && availabilityMap[room.id] < 5;

              return (
                <div
                  key={room.id}
                  className={`relative rounded-2xl border-2 transition-all duration-300 ${
                    isSoldOut ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer hover:shadow-lg'
                  } ${selectedRoom === room.id ? 'ring-4' : ''}`}
                  style={{
                    borderColor: selectedRoom === room.id ? palette.primary : palette.cardBorder,
                    backgroundColor: palette.cardBg,
                    boxShadow: selectedRoom === room.id
                      ? `0 0 0 4px ${palette.primary}20, ${palette.cardShadow}`
                      : palette.cardShadow,
                  }}
                  onClick={() => !isSoldOut && handleSelectRoom(room.id)}
                >
                  {isSoldOut && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-3 py-1 rounded-full text-sm font-bold shadow-md bg-red-600 text-white">
                        {t("soldOut")}
                      </div>
                    </div>
                  )}

                  {isLowAvailability && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-3 py-1 rounded-full text-sm font-semibold shadow-md bg-yellow-500 text-white">
                        {availabilityMap[room.id]} {t("left")}
                      </div>
                    </div>
                  )}

                  <img
                    src={`/${room.image}`}
                    alt={room.name}
                    className="rounded-t-2xl w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1" style={{ color: palette.text }}>
                      {room.name}
                    </h3>
                    <div className="flex flex-col mb-1">
                      <span 
                        className="text-2xl font-bold" 
                        style={{ color: palette.primary }}
                      >
                        ${Number(roomPrice[room.id]).toFixed(0)} USD
                      </span>

                      <span className="text-sm font-medium" style={{ color: palette.primary }}>
                        {t('perPerson')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 px-3 py-1 rounded-full"
                        style={{ backgroundColor: palette.hobbyBg }}>
                    </div>
                    <ul className="text-sm space-y-1" style={{ color: palette.textLight }}>
                      {room.amenities.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <Check className="w-4 h-4" style={{ color: palette.success }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedRoom === room.id && (
                    <div className="absolute top-4 right-4">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: palette.primary }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 
            className="text-xl font-bold mb-4"
            style={{ color: palette.text }}
          >
            {t('selectPaymentPlan')}
          </h1>
          <p 
            className="text-m max-w-2xl mx-auto"
            style={{ color: palette.textSecondary }}
          >
            {t('selectPaymentPlanDesc')}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border transition-all duration-300 hover:scale-105 
                ${isCutoffPast(plan.cutoff) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
                ${selectedPlan === plan.id ? 'ring-4' : !isCutoffPast(plan.cutoff) ? 'hover:shadow-lg' : ''}
              `}
              style={{
                backgroundColor: palette.cardBg,
                borderColor: selectedPlan === plan.id ? palette.primary : palette.cardBorder,
                boxShadow: selectedPlan === plan.id 
                  ? `0 0 0 3px ${palette.primary}20, ${palette.cardShadow}` 
                  : palette.cardShadow,
              }}
              onClick={!isCutoffPast(plan.cutoff) ? () => handlePlanSelect(plan.id) : undefined}
            >
              {plan.savings && !plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span 
                    className="px-3 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: palette.success }}
                  >
                    {plan.savings}
                  </span>
                </div>
              )}

              <div className="p-4 cursor-pointer">
                <div className="text-center mb-4">
                  <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: palette.primary }} />
                  <h3 className="text-xl font-bold mb-1" style={{ color: palette.text }}>
                    {plan.installments} {plan.installments === 1 ? t('payment1') : t('payments')}
                  </h3>
                  <div className="text-2xl font-bold mb-1" style={{ color: palette.primary }}>
                    ${selectedRoomPrice ? (Number(selectedRoomPrice) / plan.installments).toFixed(2) : '0.00'}
                  </div>
                  <p className="text-xs" style={{ color: palette.textLight }}>
                    {plan.installments > 1 ? t('perPayment') : t('onetime')}
                  </p>
                </div>

                <p className="text-center text-xs rounded-lg p-2 mb-4" style={{ color: palette.textSecondary, backgroundColor: palette.hobbyBg }}>
                  {plan.paymentSchedule}
                </p>

                {selectedPlan === plan.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: palette.primary }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-sm italic" style={{ color: palette.textSecondary }}>
            {t('exchangeRate')}
          </p>
        </div>

        {/* Purchase Section */}
        {selectedPlan && (
          <div className="text-center max-w-md mx-auto px-4 sm:px-0">
            {/* Promo Code Input */}
            <div 
              className="mb-6 p-4 rounded-xl border"
              style={{ 
                backgroundColor: palette.cardBg,
                borderColor: palette.cardBorder,
                boxShadow: palette.cardShadow
              }}
            >
              <label 
                className="block text-base font-medium mb-3"
                style={{ color: palette.text }}
              >
                {t('havePromoCode')}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={t('enterPromoCode')}
                  className="flex-1 px-3 py-2 border rounded-lg text-base focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    borderColor: palette.cardBorder,
                    color: palette.text,
                    backgroundColor: palette.white
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = palette.primary;
                    e.target.style.boxShadow = `0 0 0 2px ${palette.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = palette.cardBorder;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim() || promoApplied}
                  className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: promoApplied ? palette.success : palette.primary,
                  }}
                >
                  {promoApplied ? t('applied') : t('apply')}
                </button>
              </div>
              {promoStatus && (
                <p
                  className={`text-sm mt-3 flex items-center justify-center gap-1 text-center ${
                    promoStatus === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {promoStatus === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {promoStatus === "success"
                    ? `${t('promoCode')} "${promoCode}" ${t('appliedSuccess')}`
                    : t('appliedInvalid')}
                </p>
              )}
            </div>

            {/* Payment Breakdown - NOW SYNCHRONOUS */}
            {(() => {
              const plan = plans.find(p => p.id === selectedPlan);
              if (!plan || !selectedRoomPrice) return null;

              const baseAmount = (Number(selectedRoomPrice) / plan.installments);
              const firstPayment = Math.max(baseAmount - (promoDiscount / plan.installments), 0);
              const remainingPayments = plan.installments > 1 ? (baseAmount - (promoDiscount / plan.installments)) * (plan.installments - 1) : 0;

              return (
                <div 
                  className="mb-6 p-4 rounded-xl border text-left"
                  style={{ 
                    backgroundColor: palette.cardBg,
                    borderColor: palette.cardBorder,
                    boxShadow: palette.cardShadow
                  }}
                >
                  <ul className="space-y-3 text-sm sm:text-base" style={{ color: palette.textSecondary }}>
                    <li className="flex justify-between">
                      <span>{t('basePayment')}:</span>
                      <span>${baseAmount.toFixed(2)}</span>
                    </li>
                    {promoDiscount > 0 && (
                      <li className="flex justify-between text-green-600">
                        <span>{t('promoDiscount')}:</span>
                        <span>- ${(promoDiscount / plan.installments).toFixed(2)}</span>
                      </li>
                    )}
                    <li className="flex justify-between font-medium mt-2 border-t pt-2">
                      <span>{t('firstPaymentTotal')}:</span>
                      <span>${firstPayment.toFixed(2)}</span>
                    </li>
                    {remainingPayments > 0 && (
                      <li className="flex justify-between">
                        <span>{t('remaining')} {plan.installments - 1} {t('payment')}{plan.installments - 1 > 1 ? "s" : ""}:</span>
                        <span>${remainingPayments.toFixed(2)}</span>
                      </li>
                    )}
                    <li className="flex justify-between font-bold mt-2 border-t pt-2 text-lg sm:text-xl" style={{ color: palette.primary }}>
                      <span>{t('totalCharge')}:</span>
                      <span>${firstPayment.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
              );
            })()}

            {/* Purchase Button */}
            <button
              disabled={isProcessing || isDataLoading || !selectedRoom}
              onClick={() => {
                const plan = plans.find(p => p.id === selectedPlan);
                if (plan) handlePurchase(plan);
              }}
              className="
                w-full 
                font-bold 
                py-3 sm:py-4
                px-6 sm:px-8
                rounded-lg sm:rounded-xl
                shadow-md hover:shadow-lg
                transition-all duration-300 
                flex items-center justify-center gap-2 sm:gap-3 
                text-white 
                text-sm sm:text-lg
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{ 
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.tertiary} 100%)`,
              }}
            >
              <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
              {isDataLoading ? t('loading') : isProcessing ? t('loading') : t('purchaseSelectedPlan')}
            </button>
          </div>
        )}

        {!selectedPlan && (
          <div className="text-center">
            <p style={{ color: palette.textLight }}>{t('continueSelectedPlan')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectPlan;