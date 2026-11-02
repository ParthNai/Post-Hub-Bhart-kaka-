import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  queryGeneratedImages,
  getImageMetrics,
  getModerationSettings,
} from "@/lib/ai-images-storage";
import { ImagesView } from "@/components/admin/ai-generation/images/ImagesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Generated Images Library & Moderation | Post Hub Admin Panel",
  description:
    "Review, organize and moderate AI-generated posters and image-generation results.",
};

export default async function GeneratedImagesPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const pagination = queryGeneratedImages({ page: 1, pageSize: 8 });
  const metrics = getImageMetrics();
  const settings = getModerationSettings();

  return (
    <ImagesView
      initialImages={pagination.images}
      initialMetrics={metrics}
      initialSettings={settings}
      adminName={session.name || "Parth Patel"}
      adminRole={
        session.role === "superadmin" ? "Super Administrator" : "Administrator"
      }
    />
  );
}

