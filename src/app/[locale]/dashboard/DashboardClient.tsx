"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, CreditCard, Calendar, CheckCircle, AlertCircle, ShoppingCart, ArrowRight, Sparkles, Package } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import SelectPlan from "./SelectPlan";

interface Payment {
  orderNumber: string;
  status: string;
  operation: string;
  mdOrder: string;
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

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    clubName: "",
    hasSelectedPlan: false,
    selectedPlan: ""
  });

  // Populate user state when session is available
  useEffect(() => {
    if (session?.user) {
      setUser({
        firstName: session.user.firstName ?? " ",
        lastName: session.user.lastName ?? "",
        email: session.user.email ?? "",
        country: session.user.country ?? "",
        clubName: session.user.club ?? "",
        hasSelectedPlan: session.user.hasSelectedPlan ?? false,
        selectedPlan: session.user.selectedPlan ?? ""
      });
    }
  }, [session]);

  // Only check payment status if orderId exists
  useEffect(() => {
    if (!orderId) return;

    setPaymentLoading(true);

    fetch(`https://belize-confe-backend.onrender.com/api/payment/${orderId}`)
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

  const handleSelectPlan = () => setShowPlans(true);
  const handleManagePlan = () => console.log("Navigate to plan management");

  // Show loading while NextAuth session is fetching
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  // Require login
  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>You must be logged in to view the dashboard.</p>
    </div>;
  }


  return (
    <div className="min-h-screen relative overflow-hidden bg-white mt-10">
      {/* Dashboard content... */}
      <div className="relative z-10 min-h-screen p-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
          {/* Dismissable message */}
{/* Dismissable Payment Status Overlay */}
          {orderId && !paymentMessage && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
              <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
                payment?.status === "1" 
                  ? "bg-green-50 border-green-400 text-green-800" 
                  : "bg-red-50 border-red-400 text-red-800"
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {paymentLoading ? (
                      <p className="font-medium">Checking your payment status...</p>
                    ) : payment ? (
                      <div className="space-y-1">
                        <p className="font-medium">
                          {payment.status === "1" ? "✅ Payment Successful!" : "❌ Payment Failed or Pending"}
                        </p>
                        <p className="text-sm opacity-80">Order: {payment.orderNumber}</p>
                        <p className="text-sm opacity-80">Status: {payment.status}</p>
                      </div>
                    ) : (
                      <p className="font-medium">No payment record found for order {orderId}</p>
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
              <h1 className="text-2xl">Welcome, {user.firstName}</h1>
              <p className="text-gray-600 mt-2">
                {user.clubName} • {user.country}
              </p>
            </div>
          </div>

          {/* Plan Section */}
          <div className="rounded-3xl p-8 border shadow-lg transition-all duration-300 bg-white">
            {user.hasSelectedPlan ? (
              <div>
                {/* Active plan UI */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800">Premium Plan</h3>
                  <p className="text-gray-600">Active since March 2024</p>
                  <button 
                    onClick={handleManagePlan}
                    className="mt-4 w-full py-3 px-4 rounded-xl border border-green-300 bg-white hover:bg-green-50 text-green-700 font-medium transition-colors"
                  >
                    Manage Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-cyan-50 flex items-center justify-center">
                  <ShoppingCart size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Choose a plan that works best for you and your schedule.
                </p>
                <button 
                  onClick={handleSelectPlan}
                  className="inline-flex items-center space-x-2 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3cc4ff, #66f2ff)',
                    boxShadow: '0 4px 20px rgba(60, 196, 255, 0.3)'
                  }}
                >
                  <span>Select a Plan</span>
                  <ArrowRight size={20} />
                </button>

                {/* Render SelectPlan component safely */}
                {showPlans && (
                  <div className="mt-8">
                    <SelectPlan
                      sessionData={user} // pass the populated user state
                    />
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