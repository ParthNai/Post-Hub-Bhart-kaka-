import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { initScreensDb } from "@/lib/screens";
import { AppScreensView } from "./AppScreensView";

export const dynamic = "force-dynamic";

export default async function AdminAppScreensPage() {
  const session = await getSession({ allowDevBypass: true });

  // Strict server-side role and session check
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  // Load persistent screen records
  const screens = initScreensDb();

  return (
    <AppScreensView
      initialScreens={screens}
      adminName={session.name}
      adminEmail={session.email}
    />
  );
}
