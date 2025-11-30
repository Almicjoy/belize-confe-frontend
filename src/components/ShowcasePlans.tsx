"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";
import { Check, Star, Sparkles, CreditCard } from "lucide-react";

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

interface ShowcasePlansProps {
  locale?: string | string[];
}

const ShowcasePlans: React.FC<ShowcasePlansProps> = ({ locale = "en" }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const plans: Plan[] = t("plans") as unknown as Plan[];

  const handleSelectPlan = (planId: number) => {
    router.push(`/${locale}/register?planId=${planId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // JS handles ISO strings
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isCutoffPast = (cutoff: string) => {
    const today = new Date();
    const cutoffDate = new Date(cutoff);
    return cutoffDate < today; // true if already expired
  };

  return (
    <div className="w-full py-16 px-4" style={{ backgroundColor: palette.lightOrange }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" 
               style={{ backgroundColor: palette.hobbyBg }}>
            <CreditCard size={32} style={{ color: palette.primary }} />
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: palette.text }}>
            {t("choosePlan")}
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: palette.textSecondary }}>
            {t("choosePlanDesc")}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-500 hover:scale-105 group ${
                plan.cutoff ? 'ring-2 ring-offset-4' : ''
              }`}
              style={{
                backgroundColor: palette.cardBg,
                boxShadow: plan.cutoff 
                  ? `0 25px 50px -12px rgba(60, 196, 255, 0.25)` 
                  : palette.cardShadow,
                borderColor: plan.cutoff ? palette.primary : palette.cardBorder,
                transform: plan.cutoff ? 'translateY(-8px)' : 'translateY(0)'
              }}
            >

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: palette.text }}>
                  {t("plan")} {plan.id}
                </h3>
                <p className="text-sm font-medium" style={{ color: palette.textSecondary }}>
                  {plan.paymentSchedule}
                </p>
              </div>

              {/* Plan Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 rounded-xl" 
                     style={{ backgroundColor: palette.hobbyBg }}>
                  <span className="text-sm font-medium" style={{ color: palette.text }}>
                    {t("installments")}
                  </span>
                  <span className="font-bold" style={{ color: palette.primary }}>
                    {plan.installments}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl" 
                     style={{ backgroundColor: palette.hobbyBg }}>
                  <span className="text-sm font-medium" style={{ color: palette.text }}>
                    {t("ends")}
                  </span>
                  <span className="font-bold" style={{ color: palette.primary }}>
                    {formatDate(plan.cutoff)}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: palette.success }}>
                      <Check size={12} color={palette.white} />
                    </div>
                    <span className="text-sm" style={{ color: palette.text }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Select Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={Boolean(plan.cutoff && isCutoffPast(plan.cutoff))}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-center transition-all duration-300 shadow-lg 
                  ${plan.popular ? 'transform hover:scale-110' : ''} 
                  ${plan.cutoff && isCutoffPast(plan.cutoff) ? 'opacity-50 cursor-not-allowed' : 'group-hover:scale-105 hover:shadow-xl'}
                `}
                style={{
                  background: plan.popular
                    ? `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`
                    : `linear-gradient(135deg, ${palette.accent}, ${palette.primary})`,
                  color: palette.white,
                  boxShadow: plan.popular
                    ? `0 8px 25px rgba(60, 196, 255, 0.4)`
                    : `0 4px 15px rgba(0, 208, 255, 0.3)`
                }}
              >
                {t("selectPlan")} {plan.id}
              </button>

              {/* Hover Glow Effect */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 rounded-2xl" style={{ backgroundColor: palette.hobbyBg }}>
          <p className="text-sm font-medium" style={{ color: palette.hobbyText }}>
           {t("paymentExtras")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePlans;