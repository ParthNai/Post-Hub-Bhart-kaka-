import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { initScreensDb, findScreenByIdOrKey } from "@/lib/screens";
import { ScreenConfigEditorView } from "./ScreenConfigEditorView";
import { ArrowLeft, SearchX } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ScreenConfigurationPage({
  params,
}: {
  params: Promise<{ screenId: string }>;
}) {
  const session = await getSession({ allowDevBypass: true });

  // Strict server-side role and session check
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  // Ensure DB initialized
  initScreensDb();

  const { screenId } = await params;
  const screen = findScreenByIdOrKey(screenId);

  // If screen not found, display helpful fallback
  if (!screen) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            padding: "40px 32px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(36, 33, 58, 0.05)",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "var(--error-bg)",
              color: "var(--error)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
            }}
          >
            <SearchX size={26} />
          </div>

          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>
            Screen Not Found
          </h1>

          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "24px" }}>
            No app screen record matching identifier &quot;{screenId}&quot; was found in the inventory.
          </p>

          <Link
            href="/admin/app-screens"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            Back to App Screens Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ScreenConfigEditorView
      initialScreen={screen}
      adminName={session.name}
      adminEmail={session.email}
    />
  );
}
