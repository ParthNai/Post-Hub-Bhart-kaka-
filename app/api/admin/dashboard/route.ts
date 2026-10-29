import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  rawNumber: number;
  change: string;
  changeType: "increase" | "decrease";
  isDemo: boolean;
  progressPercent: number;
}

export interface ActivityItem {
  id: string;
  iconName: "FileText" | "Calendar" | "Sliders" | "Image";
  title: string;
  description: string;
  timeAgo: string;
  category: "templates" | "festivals" | "ai" | "users";
  actor?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface AiCategoryStat {
  name: "Completed" | "Processing" | "Failed" | "Cancelled";
  count: number;
  percentage: number;
  color: string;
}

export interface DashboardDataResponse {
  dateLabel: string;
  metrics: DashboardMetric[];
  platformActivity: {
    range: "7d" | "30d" | "90d";
    legendLabel: string;
    points: ChartDataPoint[];
    isDemo: boolean;
  };
  aiGenerationOverview: {
    total: number;
    totalFormatted: string;
    categories: AiCategoryStat[];
    isDemo: boolean;
  };
  recentActivities: ActivityItem[];
  realDbUserCount: number;
}

const SEVEN_DAY_ACTIVITY: ChartDataPoint[] = [
  { date: "Oct 19", value: 18 },
  { date: "Oct 20", value: 25 },
  { date: "Oct 21", value: 23 },
  { date: "Oct 22", value: 38 },
  { date: "Oct 23", value: 48 },
  { date: "Oct 24", value: 45 },
  { date: "Oct 25", value: 78 },
];

const THIRTY_DAY_ACTIVITY: ChartDataPoint[] = [
  { date: "Sep 26", value: 14 },
  { date: "Sep 28", value: 19 },
  { date: "Sep 30", value: 22 },
  { date: "Oct 2", value: 28 },
  { date: "Oct 4", value: 26 },
  { date: "Oct 6", value: 31 },
  { date: "Oct 8", value: 34 },
  { date: "Oct 10", value: 30 },
  { date: "Oct 12", value: 42 },
  { date: "Oct 14", value: 46 },
  { date: "Oct 16", value: 41 },
  { date: "Oct 18", value: 40 },
  { date: "Oct 20", value: 25 },
  { date: "Oct 22", value: 38 },
  { date: "Oct 24", value: 45 },
  { date: "Oct 25", value: 78 },
];

const NINETY_DAY_ACTIVITY: ChartDataPoint[] = [
  { date: "Jul 28", value: 8 },
  { date: "Aug 10", value: 16 },
  { date: "Aug 22", value: 24 },
  { date: "Sep 5", value: 32 },
  { date: "Sep 18", value: 36 },
  { date: "Sep 30", value: 42 },
  { date: "Oct 12", value: 48 },
  { date: "Oct 25", value: 78 },
];

const ALL_ACTIVITIES: ActivityItem[] = [
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
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const timeRange = (url.searchParams.get("timeRange") as "7d" | "30d" | "90d") || "7d";
  const searchQuery = (url.searchParams.get("q") || "").toLowerCase().trim();

  // Inspect actual persisted database users
  let realUsersCount = 0;
  try {
    const users = getAllUsers();
    realUsersCount = users.length;
  } catch {
    realUsersCount = 0;
  }

  // Filter activities if search query provided
  const filteredActivities = searchQuery
    ? ALL_ACTIVITIES.filter(
        (act) =>
          act.title.toLowerCase().includes(searchQuery) ||
          act.description.toLowerCase().includes(searchQuery) ||
          act.timeAgo.toLowerCase().includes(searchQuery) ||
          (act.actor && act.actor.toLowerCase().includes(searchQuery))
      )
    : ALL_ACTIVITIES;

  // Chart data points based on requested range
  let points = SEVEN_DAY_ACTIVITY;
  if (timeRange === "30d") points = THIRTY_DAY_ACTIVITY;
  if (timeRange === "90d") points = NINETY_DAY_ACTIVITY;

  const response: DashboardDataResponse = {
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
      range: timeRange,
      legendLabel: "Total Activity",
      points,
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
    recentActivities: filteredActivities,
    realDbUserCount: realUsersCount,
  };

  return NextResponse.json(response);
}
