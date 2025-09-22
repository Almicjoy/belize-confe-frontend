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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [userState, setUserState] = useState({
    hasSelectedPlan: sessionData?.hasSelectedPlan ?? false,
    selectedPlan: sessionData?.selectedPlan ?? "",
  });

  const { t } = useTranslation();
  const plans: Plan[] = t("plans") as unknown as Plan[];
  const rooms: AccommodationRoom[] = t("room") as unknown as AccommodationRoom[];

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const getValidPromo = (code: string) => {
    const now = new Date();
    return promoData.promoCodes.find(
      (p) =>
        p.code.toUpperCase() === code.toUpperCase() &&
        now >= new Date(p.validFrom) &&
        now <= new Date(p.validTo)
    );
  };

  // Calculate discounted amount based on the promo
  const calculateFinalAmount = (plan: Plan, isFirstPayment: boolean) => {
    let amount = plan.paymentAmount;

    // Apply promo code discount only on the first payment
    if (isFirstPayment && promoApplied && promoCode.trim()) {
      const promo = getValidPromo(promoCode);
      if (promo) {
        amount = Math.max(amount - promo.discountAmount, 0);
      }
    }

    // Add room extra fee only to the first payment
    if (isFirstPayment && selectedRoom) {
      const room = rooms.find(r => r.id === selectedRoom);
      if (room && room.extraFees) {
        amount += 100; // fixed room extra fee
      }
  }

  return amount;
  };

  // Apply promo code button handler
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoStatus("error");
      return;
    }

    const promo = getValidPromo(promoCode);
    if (!promo) {
      setPromoStatus("error");
      setPromoApplied(false);
      return;
    }

    setPromoApplied(true);
    setPromoStatus("success");
  };


  const handlePurchase = async (plan: Plan) => {
    if (!sessionData?.email || !sessionData.firstName) {
      alert("Missing user session data");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const discountedAmount = calculateFinalAmount(plan, true);

      const payload = {
        amount: Math.round(discountedAmount * 100), // cents
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
        promoCode: promoApplied ? promoCode : null,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.bankResponse?.formUrl) {
        window.location.href = data.bankResponse.formUrl;
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

  return (
    <div 
      className="min-h-screen p-6"
      style={{ background: `linear-gradient(135deg, ${palette.lightOrange} 0%, ${palette.hobbyBg} 100%)` }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
          <div 
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: palette.hobbyBg,
              color: palette.hobbyText 
            }}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">{t('totalValue')}</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border transition-all duration-300 hover:scale-105 ${
                selectedPlan === plan.id ? 'ring-4' : 'hover:shadow-lg'
              }`}
              style={{
                backgroundColor: palette.cardBg,
                borderColor: selectedPlan === plan.id ? palette.primary : palette.cardBorder,
                boxShadow: selectedPlan === plan.id 
                  ? `0 0 0 3px ${palette.primary}20, ${palette.cardShadow}` 
                  : palette.cardShadow,
              }}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {/* Savings Badge */}
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
                {/* Plan Header */}
                <div className="text-center mb-4">
                  <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: palette.primary }} />
                  <h3 className="text-xl font-bold mb-1" style={{ color: palette.text }}>
                    {plan.installments} {plan.installments === 1 ? t('payment1') : t('payments')}
                  </h3>
                  <div className="text-2xl font-bold mb-1" style={{ color: palette.primary }}>
                    ${plan.paymentAmount.toFixed(2)}
                  </div>
                  <p className="text-xs" style={{ color: palette.textLight }}>
                    {plan.installments > 1 ? t('perPayment') : t('onetime')}
                  </p>
                </div>

                {/* Payment Schedule */}
                <p className="text-center text-xs rounded-lg p-2 mb-4" style={{ color: palette.textSecondary, backgroundColor: palette.hobbyBg }}>
                  {plan.paymentSchedule}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-xs">
                      <Check className="w-3 h-3 mr-1 flex-shrink-0" style={{ color: palette.success }} />
                      <span style={{ color: palette.textSecondary }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
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


        {/* Room Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: palette.text }}>
            {t('conferenceAccommodations')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`relative rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedRoom === room.id ? 'ring-4' : 'hover:shadow-lg'
                }`}
                style={{
                  borderColor: selectedRoom === room.id ? palette.primary : palette.cardBorder,
                  backgroundColor: palette.cardBg,
                  boxShadow: selectedRoom === room.id 
                    ? `0 0 0 4px ${palette.primary}20, ${palette.cardShadow}` 
                    : palette.cardShadow,
                }}
                onClick={() => setSelectedRoom(room.id)}
              >
                <img
                  src={`/${room.image}`}
                  alt={room.name}
                  className="rounded-t-2xl w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: palette.text }}>
                    {room.name} {room.extraFees ? `(+ $100 USD)` : ""}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: palette.textSecondary }}>
                    {room.description}
                  </p>
                  <div className="flex items-center space-x-1 px-3 py-1 rounded-full"
                                         style={{ backgroundColor: palette.hobbyBg }}>
                    <Users size={14} style={{ color: palette.primary }} />
                    <span className="text-sm font-semibold" style={{ color: palette.hobbyText }}>
                      {room.guests} {t('guests')}
                    </span>
                  </div>
                  <ul className="text-sm space-y-1" style={{ color: palette.textLight }}>
                    {room.features.map((feat, i) => (
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
            ))}
          </div>
        </div>

        {/* Purchase Section */}
        {selectedPlan && (
          <div className="text-center max-w-md mx-auto">

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
                className="block text-sm font-medium mb-2"
                style={{ color: palette.text }}
              >
                {t('havePromoCode')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={t('enterPromoCode')}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors"
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
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: promoApplied ? palette.success : palette.primary,
                  }}
                >
                  {promoApplied ? t('applied') : t('apply')}
                </button>
              </div>
              {promoStatus && (
                <p
                  className={`text-sm mt-2 flex items-center justify-center gap-1 ${
                    promoStatus === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {promoStatus === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {promoStatus === "success"
                    ? `${t('promoCode')} “${promoCode}” ${t('appliedSuccess')}`
                    : t('appliedInvalid')}
                </p>
              )}
            </div>

            {/* Payment Breakdown */}
            {(() => {
              const plan = plans.find(p => p.id === selectedPlan);
              if (!plan) return null;

              const baseAmount = plan.paymentAmount;
              const promoDiscount = promoApplied && getValidPromo(promoCode) ? getValidPromo(promoCode)!.discountAmount : 0;
              const roomFee = selectedRoom 
                ? rooms.find(r => r.id === selectedRoom && r.extraFees) 
                  ? 100 
                  : 0 
                : 0;

              const firstPayment = Math.max(baseAmount - promoDiscount, 0) + roomFee;
              const remainingPayments = plan.installments > 1 ? baseAmount * (plan.installments - 1) : 0;
              const totalCharge = firstPayment + remainingPayments;

              return (

              <div 
                className="mb-6 p-4 rounded-xl border"
                style={{ 
                  backgroundColor: palette.cardBg,
                  borderColor: palette.cardBorder,
                  boxShadow: palette.cardShadow
                }}
              >
                <ul className="space-y-2 text-sm mb-6" style={{ color: palette.textSecondary }}>
                  <li className="flex justify-between">
                    <span>Base Payment:</span>
                    <span>${baseAmount.toFixed(2)}</span>
                  </li>
                  {promoDiscount > 0 && (
                    <li className="flex justify-between text-green-600">
                      <span>Promo Discount [ only applied to first payment ]:</span>
                      <span>- ${promoDiscount.toFixed(2)}</span>
                    </li>
                  )}
                  {roomFee > 0 && (
                    <li className="flex justify-between text-blue-600">
                      <span>Room Extra Fee [ only charged to first payment ]:</span>
                      <span>+ ${roomFee.toFixed(2)}</span>
                    </li>
                  )}
                  <li className="flex justify-between font-medium mt-2 border-t pt-2">
                    <span>First Payment Total:</span>
                    <span>${firstPayment.toFixed(2)}</span>
                  </li>
                  {remainingPayments > 0 && (
                    <li className="flex justify-between">
                      <span>Remaining {plan.installments - 1} Payment{plan.installments - 1 > 1 ? "s" : ""}:</span>
                      <span>${remainingPayments.toFixed(2)}</span>
                    </li>
                  )}
                  <li className="flex justify-between font-bold mt-2 border-t pt-2 text-lg" style={{ color: palette.primary }}>
                    <span>Total Charge:</span>
                    <span>${firstPayment.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
              );
            })()}

            {/* Purchase Button */}
            <button
              onClick={() => {
                const plan = plans.find(p => p.id === selectedPlan);
                if (plan) handlePurchase(plan);
              }}
              className="w-full font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.tertiary} 100%)`,
              }}
            >
              <CreditCard className="w-6 h-6" />
              {t('purchaseSelectedPlan')}
            </button>
            
            <p className="mt-4 text-sm" style={{ color: palette.textLight }}>
              {(() => {
                const plan = plans.find(p => p.id === selectedPlan);
                return plan ? `${t('selected')}: ${plan.installments} ${t('payment')}${plan.installments > 1 ? 's' : ''} ${t('of')} ${plan.paymentAmount.toFixed(2)}` : '';
              })()}
            </p>
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


