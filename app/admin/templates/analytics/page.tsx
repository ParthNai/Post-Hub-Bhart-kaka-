import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTemplateAnalytics } from "@/lib/template-analytics-storage";
import { AnalyticsView } from "@/components/admin/templates/analytics/AnalyticsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Template Analytics | Post Hub Admin Panel",
  description: "Analyze template usage, user engagement, and design creation trends.",
};

export default async function TemplateAnalyticsPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const initialData = getTemplateAnalytics("30d");

  return <AnalyticsView initialData={initialData} />;
}
