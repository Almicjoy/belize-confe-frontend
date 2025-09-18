"use client"

import { useEffect, useState } from 'react';
import { Check, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";
import { palette } from "@/lib/palette";

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
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [userState, setUserState] = useState({
    hasSelectedPlan: sessionData?.hasSelectedPlan ?? false,
    selectedPlan: sessionData?.selectedPlan ?? "",
  });

  const plans: Plan[] = [
    {
      id: 1,
      installments: 1,
      paymentAmount: 500,
      totalAmount: 500,
      paymentSchedule: "Pay in full today",
      savings: "Best Value",
      popular: false,
      features: ["Immediate access", "No processing fees", "One-time payment"],
    },
    {
      id: 2,
      installments: 2,
      paymentAmount: 250,
      totalAmount: 500,
      paymentSchedule: "$250 today, $250 in 30 days",
      savings: null,
      popular: false,
      features: ["Split into 2 payments", "30-day intervals", "No additional fees"],
    },
    {
      id: 3,
      installments: 3,
      paymentAmount: 166.67,
      totalAmount: 500,
      paymentSchedule: "$166.67 every 30 days",
      savings: null,
      popular: true,
      features: ["Most popular option", "Flexible payments", "30-day intervals"],
    },
    {
      id: 4,
      installments: 4,
      paymentAmount: 125,
      totalAmount: 500,
      paymentSchedule: "$125 every 30 days",
      savings: "Most Flexible",
      popular: false,
      features: ["Maximum flexibility", "Lowest per payment", "30-day intervals"],
    },
  ];

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const calculateDiscountedAmount = (originalAmount: number) =>
    promoApplied && promoCode.trim() ? originalAmount * 0.9 : originalAmount;

  const handlePurchase = async (plan: Plan) => {
    if (!sessionData?.email || !sessionData.firstName) {
      alert("Missing user session data");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const discountedAmount = calculateDiscountedAmount(plan.paymentAmount);

      const payload = {
        amount: Math.round(discountedAmount * 100), // cents
        description: `Belize 2026 Conference Registration - ${plan.installments} payment${plan.installments > 1 ? "s" : ""} of ${discountedAmount.toFixed(
          2
        )}`,
        returnUrl: process.env.NEXT_PUBLIC_RETURN_URL || "",
        orderNumber: uuidv4(),
        clientId: sessionData.id,
        email: sessionData.email,
        fullName: `${sessionData.firstName} ${sessionData.lastName ?? ""}`.trim(),
        dynamicCallbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL || "",
        installments: plan.installments,
        promoCode: promoApplied ? promoCode : null,
      };

      const res = await fetch("https://belize-confe-backend.onrender.com/api/register", {
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

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
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
            className="text-4xl font-bold mb-4"
            style={{ color: palette.text }}
          >
            Select Your Payment Plan
          </h1>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: palette.textSecondary }}
          >
            Choose the payment option that works best for you. All plans include the same features and benefits.
          </p>
          <div 
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: palette.hobbyBg,
              color: palette.hobbyText 
            }}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Total Value: $500 USD</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedPlan === plan.id
                  ? 'ring-4'
                  : 'hover:shadow-lg'
              }`}
              style={{
                backgroundColor: palette.cardBg,
                borderColor: selectedPlan === plan.id ? palette.primary : palette.cardBorder,
                boxShadow: selectedPlan === plan.id 
                  ? `0 0 0 4px ${palette.primary}20, ${palette.cardShadow}` 
                  : palette.cardShadow,
              }}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span 
                    className="px-4 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: palette.primary }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Savings Badge */}
              {plan.savings && !plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span 
                    className="px-4 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: palette.success }}
                  >
                    {plan.savings}
                  </span>
                </div>
              )}

              <div className="p-6 cursor-pointer">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <Calendar 
                      className="w-8 h-8"
                      style={{ color: palette.primary }}
                    />
                  </div>
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: palette.text }}
                  >
                    {plan.installments} {plan.installments === 1 ? 'Payment' : 'Payments'}
                  </h3>
                  <div 
                    className="text-3xl font-bold mb-1"
                    style={{ color: palette.primary }}
                  >
                    ${plan.paymentAmount.toFixed(2)}
                  </div>
                  <p 
                    className="text-sm"
                    style={{ color: palette.textLight }}
                  >
                    {plan.installments > 1 ? 'per payment' : 'one-time'}
                  </p>
                </div>

                {/* Payment Schedule */}
                <div className="mb-6">
                  <p 
                    className="text-center text-sm rounded-lg p-3"
                    style={{ 
                      color: palette.textSecondary,
                      backgroundColor: palette.hobbyBg
                    }}
                  >
                    {plan.paymentSchedule}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check 
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          style={{ color: palette.success }}
                        />
                        <span style={{ color: palette.textSecondary }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection Indicator */}
                {selectedPlan === plan.id && (
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
            </div>
          ))}
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
                Have a promo code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
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
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p 
                  className="text-sm mt-2 flex items-center justify-center gap-1"
                  style={{ color: palette.success }}
                >
                  <Check className="w-4 h-4" />
                  Promo code &ldquo;{promoCode}&rdquo; applied successfully!
                </p>
              )}
            </div>

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
              Purchase Selected Plan
            </button>
            
            <p 
              className="mt-4 text-sm"
              style={{ color: palette.textLight }}
            >
              {(() => {
                const plan = plans.find(p => p.id === selectedPlan);
                return plan ? `Selected: ${plan.installments} payment${plan.installments > 1 ? 's' : ''} of ${plan.paymentAmount.toFixed(2)}` : '';
              })()}
            </p>
          </div>
        )}

        {!selectedPlan && (
          <div className="text-center">
            <p style={{ color: palette.textLight }}>Select a payment plan above to continue</p>
          </div>
        )}

        {/* Additional Info */}
        <div 
          className="mt-12 rounded-xl p-6 shadow-md"
          style={{ 
            backgroundColor: palette.cardBg,
            boxShadow: palette.cardShadow 
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4 text-center"
            style={{ color: palette.text }}
          >
            What&lsquo;s Included in All Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Check 
                className="w-5 h-5 mr-2"
                style={{ color: palette.success }}
              />
              <span style={{ color: palette.textSecondary }}>Secure payment processing</span>
            </div>
            <div className="flex items-center">
              <Check 
                className="w-5 h-5 mr-2"
                style={{ color: palette.success }}
              />
              <span style={{ color: palette.textSecondary }}>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center">
              <Check 
                className="w-5 h-5 mr-2"
                style={{ color: palette.success }}
              />
              <span style={{ color: palette.textSecondary }}>Customer support included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;


