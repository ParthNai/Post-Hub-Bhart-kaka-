import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/lib/navigation";
import { TopHeader } from "@/components/admin/TopHeader";
import {
  LayoutGrid,
  Smartphone,
  Palette,
  FileText,
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  Home,
  Bell,
  ShieldCheck,
  Activity,
  Settings,
  ArrowLeft,
  Clock,
} from "lucide-react";

const ICON_MAP = {
  LayoutGrid,
  Smartphone,
  Palette,
  FileText,
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  Home,
  Bell,
  ShieldCheck,
  Activity,
  Settings,
};

export const dynamic = "force-dynamic";

export default async function AdminComingSoonPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugPath = `/admin/${resolvedParams.slug.join("/")}`;

  const navItem = ADMIN_NAV_ITEMS.find((item) => item.href === slugPath);

  // If unknown admin route, show not found
  if (!navItem) {
    notFound();
  }

  const Icon = ICON_MAP[navItem.iconName] || FileText;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopHeader
        title={navItem.label}
        subtitle={navItem.description}
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: navItem.label, href: navItem.href },
        ]}
      />

      <main
        style={{
          flex: 1,
          padding: "24px 36px 40px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            width: "100%",
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            padding: "48px 40px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(36, 33, 58, 0.04)",
          }}
        >
          {/* Module Icon Container */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "18px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
            }}
          >
            <Icon size={34} strokeWidth={1.8} />
          </div>

          {/* Development Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            <Clock size={13} />
            <span>Under Development • Coming Soon</span>
          </div>

          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "10px",
              letterSpacing: "-0.02em",
            }}
          >
            {navItem.label} Module
          </h2>

          <p
            style={{
              fontSize: "14.5px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: "520px",
              margin: "0 auto 28px auto",
            }}
          >
            {navItem.description} This module is part of the upcoming administration roadmap and
            will be fully enabled in the next release cycle.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/admin/dashboard"
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
                transition: "background-color 0.15s ease",
              }}
            >
              <ArrowLeft size={16} />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
