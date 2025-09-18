import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";

// Fake DB for demo — replace with Prisma, Mongo, etc.
const users = [
  { 
    id: "1001", 
    email: "test@example.com", 
    firstName: "Alessa",
    lastName: "Castillo",
    country: "Belize",
    club: "Rotaract Club of Orange Walk",
    hasSelectedPlan: false,
    selectedPlan: null,
    passwordHash: bcrypt.hashSync("password", 10) },
];

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(u => u.email === credentials?.email);
        if (user && bcrypt.compareSync(credentials?.password || "", user.passwordHash)) {
          return user; // return the whole user object
        }
        return null;
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
        token.firstName = user.firstName as string | null;
        token.lastName = user.lastName as string | null;
        token.country = user.country as string | null;
        token.club = user.club as string | null;
        token.hasSelectedPlan = user.hasSelectedPlan as boolean | null;
        token.selectedPlan = user.selectedPlan as string | null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        email: token.email,
        firstName: token.firstName as string | null,
        lastName: token.lastName as string | null,
        country: token.country as string | null,
        club: token.club as string | null,
        hasSelectedPlan: token.hasSelectedPlan as boolean | null,
        selectedPlan: token.selectedPlan as string | null,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

