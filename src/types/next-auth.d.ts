// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      country?: string | null;
      club?: string | null;
      hasSelectedPlan?: boolean | null;
      selectedPlan?: string | null;
    };
  }

  interface User {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    club?: string | null;
    hasSelectedPlan?: boolean | null;
    selectedPlan?: string | null;
  }
}
