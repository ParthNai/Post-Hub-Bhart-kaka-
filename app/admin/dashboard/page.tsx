import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllUsers } from "@/lib/db";
import { DashboardView } from "./DashboardView";
import { DashboardDataResponse } from "@/app/api/admin/dashboard/route";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession({ allowDevBypass: true });

  // Strict server-side role and session check
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  // Inspect real database accounts
  let realUsersCount = 0;
  try {
    const users = getAllUsers();
    realUsersCount = users.length;
  } catch {
    realUsersCount = 0;
  }

  const initialData: DashboardDataResponse = {
    dateLabel: "Oct 25, 2025",
    metrics: [
      {
        id: "total-users",
        label: "Total Users",
        value: "2,847",
        rawNumber: 2847,
        change: "12%",
        changeType: "increase",
        isDemo: true,
        progressPercent: 32,
      },
      {
        id: "published-templates",
        label: "Published Templates",
        value: "124",
        rawNumber: 124,
        change: "8%",
        changeType: "increase",
        isDemo: true,
        progressPercent: 24,
      },
      {
        id: "ai-images-generated",
        label: "AI Images Generated",
        value: "8,432",
        rawNumber: 8432,
        change: "15%",
        changeType: "increase",
        isDemo: true,
        progressPercent: 38,
      },
      {
        id: "active-subscriptions",
        label: "Active Subscriptions",
        value: "567",
        rawNumber: 567,
        change: "6%",
        changeType: "increase",
        isDemo: true,
        progressPercent: 18,
      },
    ],
    platformActivity: {
      range: "7d",
      legendLabel: "Total Activity",
      points: [
        { date: "Oct 19", value: 18 },
        { date: "Oct 20", value: 25 },
        { date: "Oct 21", value: 23 },
        { date: "Oct 22", value: 38 },
        { date: "Oct 23", value: 48 },
        { date: "Oct 24", value: 45 },
        { date: "Oct 25", value: 78 },
      ],
      isDemo: true,
    },
    aiGenerationOverview: {
      total: 8432,
      totalFormatted: "8,432",
      categories: [
        { name: "Completed", count: 6214, percentage: 73.7, color: "#7956C9" },
        { name: "Processing", count: 1246, percentage: 14.8, color: "#9B72CF" },
        { name: "Failed", count: 672, percentage: 8.0, color: "#E15252" },
        { name: "Cancelled", count: 300, percentage: 3.6, color: "#8EA2D3" },
      ],
      isDemo: true,
    },
    recentActivities: [
      {
        id: "act-1",
        iconName: "FileText",
        title: "Template draft updated",
        description: 'Template "Business Promotion" was updated by admin.',
        timeAgo: "2 hours ago",
        category: "templates",
        actor: "Lead Administrator",
      },
      {
        id: "act-2",
        iconName: "Calendar",
        title: "Festival content scheduled",
        description: "Diwali festival campaign scheduled for Oct 28, 2025.",
        timeAgo: "5 hours ago",
        category: "festivals",
        actor: "Content Team",
      },
      {
        id: "act-3",
        iconName: "Sliders",
        title: "AI provider configuration reviewed",
        description: "AI provider settings were updated successfully.",
        timeAgo: "1 day ago",
        category: "ai",
        actor: "System Administrator",
      },
      {
        id: "act-4",
        iconName: "Image",
        title: "New template submitted for review",
        description: 'Template "Social Media Post" submitted for review.',
        timeAgo: "1 day ago",
        category: "templates",
        actor: "Design Team",
      },
    ],
    realDbUserCount: realUsersCount,
  };

  return (
    <DashboardView
      initialData={initialData}
      adminName={session.name}
      adminEmail={session.email}
    />
  );
}
