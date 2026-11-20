"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import type { JobProviderDetails } from "@/lib/ai-job-trace";

interface JobProviderDetailsCardProps {
  provider: JobProviderDetails;
}

export const JobProviderDetailsCard: React.FC<JobProviderDetailsCardProps> = ({ provider }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "16px 18px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            backgroundColor: "#F3EFFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7956C9",
          }}
        >
          <Sparkles size={15} />
        </div>
        <span>Provider Details</span>
      </div>

      {/* Key-Value Rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "12.5px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Provider:</span>
          <span style={{ color: "#24213A", fontWeight: 600 }}>{provider.provider}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Model:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{provider.model}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Request Ref:</span>
          <span style={{ color: "#24213A", fontWeight: 500, fontFamily: "monospace" }}>
            {provider.requestRef}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Response Status:</span>
          <span
            style={{
              backgroundColor: provider.responseStatus === "Success" ? "#EAFBF0" : "#FEE2E2",
              color: provider.responseStatus === "Success" ? "#1E824C" : "#DC2626",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            {provider.responseStatus}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Processing Time:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{provider.processingTime}</span>
        </div>
      </div>
    </div>
  );
};
