import React from "react";
import { ProviderHealthView } from "@/components/admin/ai-generation/health/ProviderHealthView";

export const metadata = {
  title: "Provider Health & Performance | Post Hub Admin",
  description:
    "Monitor AI provider availability, model performance and generation service reliability.",
};

export const dynamic = "force-dynamic";

export default function ProviderHealthPage() {
  return <ProviderHealthView />;
}
