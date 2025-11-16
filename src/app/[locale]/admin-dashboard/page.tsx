// app/[locale]/admin-dashboard/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";
import { useTranslation } from "@/utils/useTranslation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Not logged in → redirect to login
    redirect("/en/login");
  }

  // Optional: restrict to specific admin email
  if (session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect(`/en/dashboard`);
  }

  return <AdminDashboard />;
}
