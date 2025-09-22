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
  
export const plans: Plan[] = [
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
        popular: false,
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