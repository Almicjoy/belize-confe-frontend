import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!res.ok) return null; // invalid credentials

          const user = await res.json();
          return user; // must return an object with at least an `id`
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName ?? null;
        token.lastName = user.lastName ?? null;
        token.country = user.country ?? null;
        token.clubName = user.clubName ?? null;
        token.hasSelectedPlan = user.hasSelectedPlan ?? null;
        token.selectedPlan = user.selectedPlan ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        firstName: token.firstName as string | null,
        lastName: token.lastName as string | null,
        country: token.country as string | null,
        clubName: token.clubName as string | null,
        hasSelectedPlan: token.hasSelectedPlan as boolean | null,
        selectedPlan: token.selectedPlan as string | null,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
