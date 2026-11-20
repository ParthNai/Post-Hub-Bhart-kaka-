import React from "react";
import { RoutingView } from "@/components/admin/ai-generation/routing/RoutingView";

export const metadata = {
  title: "Provider Failover & Routing | Post Hub Admin",
  description:
    "Configure provider priority, model routing rules and automatic fallback behavior.",
};

export const dynamic = "force-dynamic";

export default function RoutingPage() {
  return <RoutingView />;
}
