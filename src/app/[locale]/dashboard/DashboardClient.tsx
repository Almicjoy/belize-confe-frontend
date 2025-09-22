"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, CreditCard, Calendar, CheckCircle, AlertCircle, ShoppingCart, ArrowRight, Sparkles, Package } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import SelectPlan from "./SelectPlan";
import { useTranslation } from "@/utils/useTranslation";

interface Payment {
  orderNumber: string;
  status: string;
  operation: string;
  mdOrder: string;
  planId: string;
  amount: number;
}

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


export default function DashboardClient() {
  const { data: session, status } = useSession();
  const [showPlans, setShowPlans] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [hasSelectedPlan, setHasSelectedPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const orderId = searchParams.get("orderId");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentProgress, setPaymentProgress] = useState({ completed: 0, total: 0 });

  const { t } = useTranslation();
  const plans: Plan[] = t("plans") as unknown as Plan[];

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    clubName: "",
    hasSelectedPlan: false,
    selectedPlan: ""
  });

  // Get plan details based on selected plan ID
  const getSelectedPlanDetails = (): Plan | null => {
    if (!selectedPlan) return null;
    return plans.find(plan => plan.id === parseInt(selectedPlan)) || null;
  };

  // Populate user state when session is available
  useEffect(() => {
    console.log(session, user)
    if (session?.user) {
      setUser({
        id: session.user.id ?? "",
        firstName: session.user.firstName ?? " ",
        lastName: session.user.lastName ?? "",
        email: session.user.email ?? "",
        country: session.user.country ?? "",
        clubName: session.user.clubName ?? "",
        hasSelectedPlan: session.user.hasSelectedPlan ?? false,
        selectedPlan: session.user.selectedPlan ?? ""
      });
    }
  }, [session]);

  // Process payments data to determine plan status
  useEffect(() => {
    if (payments.length > 0) {
      // Find successful payments (status "1")
      const successfulPayments = payments.filter(payment => payment.status === "1");
      
      if (successfulPayments.length > 0) {
        // Get the plan ID from the first successful payment
        const planId = successfulPayments[0].planId;
        const totalPaymentsRequired = parseInt(planId);
        
        setHasSelectedPlan(true);
        setSelectedPlan(planId);
        setPaymentProgress({
          completed: successfulPayments.length,
          total: totalPaymentsRequired
        });
      } else {
        setHasSelectedPlan(false);
        setSelectedPlan(null);
        setPaymentProgress({ completed: 0, total: 0 });
      }
    } else {
      setHasSelectedPlan(false);
      setSelectedPlan(null);
      setPaymentProgress({ completed: 0, total: 0 });
    }
  }, [payments]);

  // Only check payment status if orderId exists
  useEffect(() => {
    if (!orderId) return;

    setPaymentLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment?mdOrder=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setPayment(data);
        setPaymentLoading(false);
        console.log(data)
      })
      .catch((err) => {
        console.error("Error fetching payment info:", err);
        setPaymentLoading(false);
      });
  }, [orderId]);

  useEffect(() => {
    if (!session?.user?.email) return; // don't fetch if email is missing

    const fetchPayments = async () => {
      setLoading(true);
      setError("");

      const email = session.user.email as string;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-payment?email=${encodeURIComponent(email)}`
        );

        if (!res.ok) {
          throw new Error(t('failFetch'));
        }

        const data = await res.json();
        console.log(data.payments)
        setPayments(data.payments || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || t('wentWrong'));
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session?.user?.email]);

  const handleSelectPlan = () => setShowPlans(true);
  const handleManagePlan = () => console.log("Navigate to plan management");

  // Progress bar component
  const ProgressBar = ({ completed, total }: { completed: number; total: number }) => {
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('paymentProgress')}</span>
          <span>{completed} {t('of')} {total} {t('paymentsCompleted')}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          {completed === total && total > 0 ? t('allPaymentsCompleted') : `${total - completed} ${t('paymentsRemaining')}`}
        </div>
      </div>
    );
  };

  // Show loading while NextAuth session is fetching
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">
      <p>{t('loading')}.</p>
    </div>;
  }

  // Require login
  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>{t('loggedOut')}</p>
    </div>;
  }

  const planDetails = getSelectedPlanDetails();

  return (
    <div className="min-h-screen relative overflow-hidden bg-white mt-10">
      <div className="relative z-10 min-h-screen p-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            {/* Payment overlay */}
            {orderId && !paymentMessage && (
              <div className="fixed top-25 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
                <div
                  className={`p-4 rounded-lg shadow-lg border-l-4 ${
                    payment?.status === "1" || payment?.status === "DEPOSITED"
                      ? "bg-green-50 border-green-400 text-green-800"
                      : "bg-red-50 border-red-400 text-red-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {paymentLoading ? (
                        <p className="font-medium">
                          {t('paymentStatusCheck')}
                        </p>
                      ) : payment ? (
                        <div className="space-y-1">
                          <p className="font-medium">
                            {payment.status === "1" ||
                            payment.status === "DEPOSITED"
                              ? "✅ Payment Successful!"
                              : payment.status === "0" ||
                                payment.status === "DECLINED"
                              ? "❌ Payment Failed"
                              : "⏳ Payment Pending"}
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium">
                          {t('noRecord')} {orderId}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setPaymentMessage("dismissed")}
                      className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h1 className="text-2xl">{t('welcome')} {user.firstName}</h1>
              <p className="text-gray-600 mt-2">
                {user.clubName} • {user.country}
              </p>
            </div>
          </div>

          {/* Plan Section */}
          <div className="rounded-3xl p-8 border shadow-lg transition-all duration-300 bg-white">
            {hasSelectedPlan && planDetails ? (
              <div>
                {/* Active plan UI with plan details */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Plan {planDetails.id} - {t('confeRegister')}
                      </h3>
                      {planDetails.popular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Most Popular
                        </span>
                      )}
                      {planDetails.savings && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {planDetails.savings}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <span className="text-green-600 font-medium">{t('active')}</span>
                    </div>
                  </div>
                  
                  {/* Plan Details */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-white rounded-xl border border-green-100">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">{t('paymentSchedule')}</h4>
                      <p className="text-sm text-gray-600">{planDetails.paymentSchedule}</p>
                      <p className="text-sm text-gray-600">
                        ${planDetails.paymentAmount.toFixed(2)} {t('perPayment')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">{t('planFeatures')}</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {planDetails.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-green-100">
                    <span>{t('totalAmount')}: ${planDetails.totalAmount}</span>
                    <span>{planDetails.installments} {t('installment')}{planDetails.installments > 1 ? 's' : ''}</span>
                  </div>
                  
                  <p className="text-gray-600">
                    {paymentProgress.completed === paymentProgress.total 
                      ? t('fullyPaid')
                      : `${t('haveActivePlan')} ${paymentProgress.total - paymentProgress.completed} ${t('paymentRemaining')}`
                    }
                  </p>
                  
                  <ProgressBar 
                    completed={paymentProgress.completed} 
                    total={paymentProgress.total} 
                  />
                  
                  <button
                    onClick={handleManagePlan}
                    className="mt-4 w-full py-3 px-4 rounded-xl border border-green-300 bg-white hover:bg-green-50 text-green-700 font-medium transition-colors"
                  >
                    {t('managePlan')}
                  </button>
                </div>
              </div>
            ) : hasSelectedPlan ? (
              // Fallback for when plan ID doesn't match any plan
              <div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Plan #{selectedPlan} - {t('confeRegister')}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={20} className="text-yellow-600" />
                      <span className="text-yellow-600 font-medium">{t('active')}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600">
                    {t('noDetails')} 
                    {paymentProgress.completed === paymentProgress.total 
                      ? " Your registration is fully paid and confirmed!"
                      : ` You have an active payment plan with ${paymentProgress.total - paymentProgress.completed} payment(s) remaining.`
                    }
                  </p>
                  
                  <ProgressBar 
                    completed={paymentProgress.completed} 
                    total={paymentProgress.total} 
                  />
                  
                  <button
                    onClick={handleManagePlan}
                    className="mt-4 w-full py-3 px-4 rounded-xl border border-yellow-300 bg-white hover:bg-yellow-50 text-yellow-700 font-medium transition-colors"
                  >
                    {t('managePlan')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">
                  <ShoppingCart size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t('startPlan')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('choosePlanType')}
                </p>
                <button
                  onClick={handleSelectPlan}
                  className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white"
                  style={{
                    background: "linear-gradient(135deg, #3cc4ff, #66f2ff)",
                    boxShadow: "0 4px 20px rgba(60, 196, 255, 0.3)",
                  }}
                >
                  <span>{t('selectAPlan')}</span>
                  <ArrowRight size={20} />
                </button>

                {showPlans && (
                  <div className="mt-8">
                    <SelectPlan sessionData={user} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}