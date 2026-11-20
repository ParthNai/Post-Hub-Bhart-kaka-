"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Shield,
  Image as ImageIcon,
  ListFilter,
  BarChart3,
  Coins,
  History,
  Zap,
  GitBranch,
  Clock,
  Cpu,
  Activity,
  Key,
} from "lucide-react";

export interface SubScreenItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
}

export const AI_SUBSCREENS: SubScreenItem[] = [
  { label: "Overview", href: "/admin/ai-generation", icon: Sparkles },
  { label: "Moderation Policies", href: "/admin/ai-generation/policies", icon: Shield },
  { label: "Image Library", href: "/admin/ai-generation/images", icon: ImageIcon },
  { label: "Queue Monitor", href: "/admin/ai-generation/queue", icon: ListFilter },
  { label: "Prompt Rules & Presets", href: "/admin/ai-generation/presets", icon: Sparkles },
  { label: "Usage & Cost Analytics", href: "/admin/ai-generation/analytics", icon: BarChart3 },
  { label: "Credit Plans & Allocation", href: "/admin/ai-generation/credits", icon: Coins },
  { label: "Audit Trail & Ledger", href: "/admin/ai-generation/audit", icon: History },
  { label: "Provider Health", href: "/admin/ai-generation/health", icon: Zap },
  { label: "Failover & Routing", href: "/admin/ai-generation/routing", icon: GitBranch },
  { label: "Priority & Scheduling", href: "/admin/ai-generation/queue-priority", icon: Clock },
  { label: "Workers & Controls", href: "/admin/ai-generation/workers", icon: Cpu },
  { label: "Job Trace", href: "/admin/ai-generation/trace", icon: Zap },
  { label: "Request Logs", href: "/admin/ai-generation/logs", icon: Activity },
  { label: "Rate Limits", href: "/admin/ai-generation/rate-limits", icon: Shield },
  { label: "API Credentials", href: "/admin/ai-generation/credentials", icon: Key },
];

export const AiSubscreenNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        overflowX: "auto",
        padding: "4px 2px 8px 2px",
        scrollbarWidth: "thin",
        WebkitOverflowScrolling: "touch",
      }}
      className="ai-subscreens-nav"
    >
      {AI_SUBSCREENS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin/ai-generation"
            ? pathname === "/admin/ai-generation"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 13px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: isActive ? 600 : 500,
              backgroundColor: isActive ? "#7956C9" : "#FFFFFF",
              color: isActive ? "#FFFFFF" : "#544E61",
              border: `1px solid ${isActive ? "#7956C9" : "#EAE4EE"}`,
              boxShadow: isActive
                ? "0 2px 6px rgba(121, 86, 201, 0.28)"
                : "0 1px 2px rgba(0, 0, 0, 0.03)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
          >
            <Icon size={14} color={isActive ? "#FFFFFF" : "#7956C9"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
