import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AccountUpdateClient from "./AccountUpdateClient";
import React from "react";

export default async function AccoutUpdate({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession(authOptions);

  // ✅ Await the params
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return <AccountUpdateClient />;
}
