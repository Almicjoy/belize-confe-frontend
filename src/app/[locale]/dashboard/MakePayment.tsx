import React, { useState } from 'react';
import { X, CreditCard, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";

// Plan interface
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
    room: string;
}

interface MakePaymentProps {
  sessionData?: SessionData;
  paymentProgress: {
    completed: number;
    total: number;
  };
  plan: Plan;
  room: string | null;
  onClose: () => void;
}

const NextPayment: React.FC<MakePaymentProps> = ({ sessionData, paymentProgress, plan, room, onClose}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { t } = useTranslation();
  
  // In your actual implementation, this would come from props or context

  const handleClose = () => {
    setIsVisible(false);
    setIsProcessing(false);
    setPaymentComplete(false);
    onClose();
  };

  const handlePurchase = async (plan: Plan) => {
    if (!sessionData?.email || !sessionData.firstName) {
      alert("Missing user session data");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
     console.log(sessionData)
      const payload = {
        amount: plan.paymentAmount * 100, // cents
        description: `Belize 2026 Conference Registration - Payment ${paymentProgress.completed + 1}`,
        returnUrl: process.env.NEXT_PUBLIC_RETURN_URL || "",
        orderNumber: uuidv4(),
        clientId: sessionData.id,
        email: sessionData.email,
        planId: plan.id,
        status: "-1",
        paymentNumber: paymentProgress.completed + 1,
        fullName: `${sessionData.firstName} ${sessionData.lastName ?? ""}`.trim(),
        dynamicCallbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL || "",
        installments: plan.installments,
        selectedRoom: room,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="w-full max-w-md rounded-xl p-6 relative"
        style={{ 
          backgroundColor: palette.cardBg,
          boxShadow: palette.cardShadow,
          border: `1px solid ${palette.cardBorder}`
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-gray-100"
          disabled={isProcessing}
        >
          <X size={20} style={{ color: palette.textSecondary }} />
        </button>

        {paymentComplete ? (
          /* Success State */
          <div className="text-center py-4">
            <CheckCircle 
              size={64} 
              className="mx-auto mb-4" 
              style={{ color: palette.success }} 
            />
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: palette.text }}
            >
              Payment Successful!
            </h3>
            <p style={{ color: palette.textSecondary }}>
              Your payment of ${plan.paymentAmount.toFixed(2)} has been processed.
            </p>
          </div>
        ) : (
          /* Payment Confirmation */
          <div>
            <div className="flex items-center mb-6">
              <CreditCard 
                size={24} 
                className="mr-3" 
                style={{ color: palette.primary }} 
              />
              <h3 
                className="text-xl font-semibold"
                style={{ color: palette.text }}
              >
                Confirm Payment
              </h3>
            </div>

            {/* Plan Details */}
            <div 
              className="rounded-lg p-4 mb-6"
              style={{ backgroundColor: palette.hobbyBg }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 
                    className="font-medium"
                    style={{ color: palette.text }}
                  >
                    {plan.paymentSchedule} Payment
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: palette.textSecondary }}
                  >
                    {plan.installments} installment plan
                  </p>
                </div>
                {plan.popular && (
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: palette.primary, 
                      color: palette.white 
                    }}
                  >
                    Popular
                  </span>
                )}
              </div>

              {plan.savings && (
                <div 
                  className="text-sm font-medium mb-2"
                  style={{ color: palette.hobbyText }}
                >
                  {plan.savings}
                </div>
              )}

              <div className="border-t pt-3" style={{ borderColor: palette.cardBorder }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: palette.textSecondary }}>
                    Payment Amount:
                  </span>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: palette.primary }}
                  >
                    ${plan.paymentAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-lg font-medium border transition-colors"
                style={{
                  borderColor: palette.cardBorder,
                  color: palette.textSecondary,
                  backgroundColor: palette.white
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                    if (plan) handlePurchase(plan);
                }}
                className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.white,
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay $${plan.paymentAmount.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextPayment;