"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { TokenUsageSummary } from "@/lib/token-usage";

interface TokenUsageFooterProps {
  summary: TokenUsageSummary;
}

export const TokenUsageFooter: React.FC<TokenUsageFooterProps> = ({ summary }) => {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 4px 10px 4px",
        marginTop: "16px",
        fontSize: "12px",
        color: "var(--text-muted, #777184)",
        flexWrap: "wrap",
        gap: "14px",
      }}
    >
      {/* Left Data Source & Verification Metadata */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>Data source: {summary.dataSource}</span>
        <span style={{ color: "var(--border, #EAE4EE)" }}>|</span>
        <span>Last verified: {summary.lastVerified}</span>
      </div>

      {/* Right Link */}
      <div>
        <Link
          href="/admin/design-system"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            color: "var(--primary, #7956C9)",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <span>Open Design System</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </footer>
  );
};

