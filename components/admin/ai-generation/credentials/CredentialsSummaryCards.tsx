"use client";

import React from "react";
import { Layers, Check, AlertTriangle, Clock } from "lucide-react";
import type { CredentialSummaryMetrics } from "@/lib/ai-credentials";

interface CredentialsSummaryCardsProps {
  metrics: CredentialSummaryMetrics;
}

export const CredentialsSummaryCards: React.FC<CredentialsSummaryCardsProps> = ({
  metrics,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {/* 1. Configured Providers */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#F4EFFC",
            color: "#7956C9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Layers size={22} />
        </div>
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#777184",
              marginBottom: "4px",
            }}
          >
            Configured Providers
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#24213A",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {metrics.configuredProviders}
          </div>
        </div>
      </div>

      {/* 2. Active Credentials */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#ECFDF5",
            color: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={15} strokeWidth={3} />
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#777184",
              marginBottom: "4px",
            }}
          >
            Active Credentials
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#24213A",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {metrics.activeCredentials}
          </div>
        </div>
      </div>

      {/* 3. Credentials Requiring Attention */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#FFFBEB",
            color: "#F59E0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#777184",
              marginBottom: "4px",
            }}
          >
            Credentials Requiring Attention
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#24213A",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {metrics.credentialsRequiringAttention}
          </div>
        </div>
      </div>

      {/* 4. Recent Rotation Events */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#F4EFFC",
            color: "#7956C9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Clock size={22} />
        </div>
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#777184",
              marginBottom: "4px",
            }}
          >
            Recent Rotation Events
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#24213A",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {metrics.recentRotationEvents}
          </div>
        </div>
      </div>
    </div>
  );
};
