"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, CreditCard, Calendar, CheckCircle, AlertCircle, ShoppingCart, ArrowRight, Sparkles, Package } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import SelectPlan from "./SelectPlan";
import { useTranslation } from "@/utils/useTranslation";
import { palette } from "@/lib/palette";
import MakePayment from "./MakePayment";

interface Payment {
  orderNumber: string;
  status: string;
  operation: string;
  mdOrder: string;
  planId: string;
  amount: number;
  selectedRoom: string;
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
  price: number;
}

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const [showPlans, setShowPlans] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [hasSelectedPlan, setHasSelectedPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const orderId = searchParams.get("orderId");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentProgress, setPaymentProgress] = useState({ completed: 0, total: 0 });
  const [showNextPayment, setShowNextPayment] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, number>>({});
  const [roomPrice, setRoomPrice] = useState<Record<number, number>>({});
  const [selectedRoomPrice, setSelectedRoomPrice] = useState<number | null>(null);
  const [nextPayment, setNextPayment] = useState<null | {
    nextDueDate: string;
    installmentNumber: number;
    totalInstallments: number;
    remaining: number;
  }>(null);


  const { t } = useTranslation();
  const plans: Plan[] = t("plans") as unknown as Plan[];
  const rooms: AccommodationRoom[] = t("room") as unknown as AccommodationRoom[];

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    clubName: "",
    hasSelectedPlan: false,
    selectedPlan: "",
    room: ""
  });

  // Get plan details based on selected plan ID
  const getSelectedPlanDetails = (): Plan | null => {
    if (!selectedPlan) return null;
    return plans.find(plan => plan.id === parseInt(selectedPlan)) || null;
  };

  // Populate user state when session is available
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id ?? "",
        firstName: session.user.firstName ?? " ",
        lastName: session.user.lastName ?? "",
        email: session.user.email ?? "",
        country: session.user.country ?? "",
        clubName: session.user.clubName ?? "",
        hasSelectedPlan: session.user.hasSelectedPlan ?? false,
        selectedPlan: session.user.selectedPlan ?? "",
        room: session.user.room ?? ""
      });
    }
  }, [session]);

  useEffect(() => {
    const fetchAvailability = async () => {
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
      }
    };

    fetchAvailability();
  }, []);

  // Process payments data to determine plan status
  useEffect(() => {
    if (payments.length > 0) {
      // Find successful payments (status "1")
      const successfulPayments = payments.filter(payment => payment.status === "1");
      
      if (successfulPayments.length > 0) {
        // Get the plan ID from the first successful payment
        const planId = successfulPayments[0].planId;
        const room = successfulPayments[0].selectedRoom;
        const totalPaymentsRequired = parseInt(planId);
        
        setHasSelectedPlan(true);
        setSelectedPlan(planId);
        setSelectedRoom(room);
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

  useEffect(() => {
    async function fetchNextPayment() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/next-due/${session?.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch next due payment");
        const data = await res.json();
        setNextPayment(data);
      } catch (err) {
        console.error("Error fetching next payment:", err);
      }
    }

    if (session?.user.id) {
      fetchNextPayment();
    }
  }, [session?.user.id]);

  const handleSelectPlan = () => setShowPlans(true);
  const handleMakeNextPayment = () => setShowNextPayment(true);

  // Progress bar component
  const ProgressBar = ({ completed, total }: { completed: number; total: number }) => {
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium">{t('paymentProgress')}</span>
          <span className="text-xs sm:text-sm">{completed} {t('of')} {total} {t('paymentsCompleted')}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 sm:h-3 rounded-full transition-all duration-300"
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
    return <div className="min-h-screen flex items-center justify-center px-4">
      <p className="text-lg">{t('loading')}.</p>
    </div>;
  }

  // Require login
  if (!session) {
    return <div className="min-h-screen flex items-center justify-center px-4">
      <p className="text-lg text-center">{t('loggedOut')}</p>
    </div>;
  }

  const planDetails = getSelectedPlanDetails();

  const getSelectedRoomDetails = (): AccommodationRoom | null => {
    if (!selectedRoom) return null;
    return rooms.find(r => r.id == parseInt(selectedRoom)) || null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white mt-8 sm:mt-10">
      <div className="relative z-10 min-h-screen p-3 sm:p-4 py-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Payment overlay */}
            {orderId && !paymentMessage && (
              <div className="fixed top-20 sm:top-25 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
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
                        <p className="font-medium text-sm sm:text-base">
                          {t('paymentStatusCheck')}
                        </p>
                      ) : payment ? (
                        <div className="space-y-1">
                          <p className="font-medium text-sm sm:text-base">
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
                        <p className="font-medium text-sm sm:text-base">
                          {t('noRecord')} {orderId}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setPaymentMessage("dismissed")}
                      className="ml-4 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

          <div className="mt-16 text-center w-full max-w-none mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {t('welcome')}, <span style={{color: `${palette.primary}`}}>{user.firstName}</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              {user.clubName} • {user.country}
            </p>
            <div className="mt-6 w-16 h-1 mx-auto rounded-full"
              style={{background: `${palette.primary}`}}
            ></div>
          </div>

          </div>

          {/* Plan Section */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border shadow-lg transition-all duration-300 bg-white">
            {hasSelectedPlan && planDetails ? (
              <div>
                {/* Active plan UI with plan details */}
                <div className="border rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6"
                  style={{background: `${palette.hobbyBg}`}}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Plan {planDetails.id} - {t('confeRegister')}
                      </h3>
                      <div className="flex gap-2">
                        {planDetails.popular && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                            Most Popular
                          </span>
                        )}
                        {planDetails.savings && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                            {planDetails.savings}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-green-600 font-medium text-sm">{t('active')}</span>
                    </div>
                  </div>
                  
                  {/* Plan Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 sm:p-4 bg-white rounded-xl border border-green-100">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700 text-sm sm:text-base">{t('paymentSchedule')}</h4>
                      <p className="text-sm text-gray-600">{planDetails.paymentSchedule}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700 text-sm sm:text-base">{t('planFeatures')}</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {planDetails.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Room Details */}
                  {selectedRoom && (
                    <div className="mt-6 border rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gray-50">
                      {(() => {
                        const roomDetails = getSelectedRoomDetails();
                        if (!roomDetails) return (
                          <p className="text-sm text-gray-600">Not Found</p>
                        );

                        return (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {t('conferenceAccommodations')}: {roomDetails.name}
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                              <img
                                src={`/${roomDetails.image}`}
                                alt={roomDetails.name}
                                className="w-full sm:w-48 h-32 object-cover rounded-lg border"
                              />
                              <div className="flex-1 space-y-2">
                                <p className="text-sm text-gray-600">
                                  {roomDetails.guests} {t('guests')}
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {roomDetails.amenities.map((amenity, i) => (
                                    <li key={i}>{amenity}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600 bg-white px-3 sm:px-4 py-2 rounded-xl border border-green-100">
                    <span className="font-medium">{t('totalAmount')}: ${roomPrice[Number(selectedRoom!)]}</span>
                    <span className="text-xs sm:text-sm">{planDetails.installments} {t('installment')}{planDetails.installments > 1 ? 's' : ''}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {paymentProgress.completed === paymentProgress.total ? (
                      t('fullyPaid')
                    ) : (
                      <>
                        {t('haveActivePlan')} {paymentProgress.total - paymentProgress.completed} {t('paymentRemaining')}
                        
                        {nextPayment && (
                          <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md">
                            <span className="text-yellow-800 font-bold text-base sm:text-lg">
                              {t('nextPaymentDue')}:{" "}
                              {new Date(
                                  new Date(nextPayment.nextDueDate).setDate(
                                    new Date(nextPayment.nextDueDate).getDate() + 1
                                  )
                                ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </p>

                  <ProgressBar 
                    completed={paymentProgress.completed} 
                    total={paymentProgress.total} 
                  />
                  
                  {paymentProgress.completed < paymentProgress.total && (
                    <button
                      onClick={handleMakeNextPayment}
                      className="mt-4 w-full py-3 px-4 rounded-xl border border-yellow-300 bg-white hover:bg-yellow-50 text-yellow-700 font-medium transition-colors text-sm sm:text-base"
                    >
                      {t('managePlan')}
                    </button>
                  )}

                  {showNextPayment && 
                  <MakePayment 
                      sessionData={user} 
                      paymentProgress={paymentProgress}
                      plan={planDetails}
                      room={selectedRoom}
                      price={roomPrice[Number(selectedRoom!)]}
                      onClose={() => setShowNextPayment(false)}
                  />}
                </div>
              </div>
            ) : hasSelectedPlan ? (
              // Fallback for when plan ID doesn't match any plan
              <div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      Plan #{selectedPlan} - {t('confeRegister')}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={18} className="text-yellow-600" />
                      <span className="text-yellow-600 font-medium text-sm">{t('active')}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
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
                  
                  {paymentProgress.completed < paymentProgress.total && (
                    <button
                      onClick={handleMakeNextPayment}
                      className="mt-4 w-full py-3 px-4 rounded-xl border border-yellow-300 bg-white hover:bg-yellow-50 text-yellow-700 font-medium transition-colors text-sm sm:text-base"
                    >
                      {t('managePlan')}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">
                  <ShoppingCart size={28} className="sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {t('startPlan')}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4 sm:px-0">
                  {t('choosePlanType')}
                </p>
                <button
                  onClick={handleSelectPlan}
                  className="inline-flex items-center justify-center space-x-2 py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white text-sm sm:text-base w-full sm:w-auto"
                  style={{
                    background: "linear-gradient(135deg, #3cc4ff, #66f2ff)",
                    boxShadow: "0 4px 20px rgba(60, 196, 255, 0.3)",
                  }}
                >
                  <span>{t('selectAPlan')}</span>
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>

                {showPlans && (
                  <div className="mt-6 sm:mt-8">
                    <SelectPlan sessionData={user}/>
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