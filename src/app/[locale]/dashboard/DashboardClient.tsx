"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, CreditCard, Calendar, CheckCircle, AlertCircle, ShoppingCart, ArrowRight, Sparkles, Package } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import SelectPlan from "./SelectPlan";


export default function DashboardClient() {
  const { data: session, status } = useSession();
  const [showPlans, setShowPlans] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    clubName: "",
    hasSelectedPlan: false,
    selectedPlan: ""
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [hasSelectedPlan, setHasSelectedPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

    // Check query params from returnUrl redirect
  useEffect(() => {
    const status = searchParams.get("status");
    const plan = searchParams.get("plan"); // optional, from your backend
    const errorMessage = searchParams.get("errorMessage");

    if (status === "success") {
      setPaymentMessage("Payment successful! 🎉");
      setHasSelectedPlan(true);
      setSelectedPlan(plan || "Premium");
    } else if (status === "failed") {
      setPaymentMessage(`Payment failed: ${errorMessage}`);
    }

    // Clear query params after reading to avoid showing again on refresh
    if (status) {
      router.replace("/dashboard", { scroll: false });
    }
  }, [searchParams, router]);

  const handleSelectPlan = () => setShowPlans(true);
  const handleManagePlan = () => console.log("Navigate to plan management");

  // Show loading while NextAuth session is fetching
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Require login
  if (!session) {
    return <p>You must be logged in to view the dashboard.</p>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white mt-4">
      {/* Dashboard content... */}
      <div className="relative z-10 min-h-screen p-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
          {/* Dismissable message */}
            {paymentMessage && (
              <div className="relative mb-4 p-4 border rounded-md bg-green-100 text-green-800">
                {paymentMessage}
                <button
                  onClick={() => setPaymentMessage(null)}
                  className="absolute top-1 right-2 text-green-900 font-bold"
                >
                  ×
                </button>
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