"use client";

import React from "react";
import { Zap, RotateCw, Ban, Eye, Copy } from "lucide-react";

interface JobActionButtonsCardProps {
  onRetry: () => void;
  onCancel: () => void;
  onViewAsset: () => void;
  onCopyJobId: () => void;
  isRetrying?: boolean;
  isCancelling?: boolean;
  isJobCancelled?: boolean;
  isJobCompleted?: boolean;
}

export const JobActionButtonsCard: React.FC<JobActionButtonsCardProps> = ({
  onRetry,
  onCancel,
  onViewAsset,
  onCopyJobId,
  isRetrying = false,
  isCancelling = false,
  isJobCancelled = false,
  isJobCompleted = false,
}) => {
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
          <Zap size={15} fill="#7956C9" />
        </div>
        <span>Action Buttons</span>
      </div>

      {/* Button Group */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* 1. Retry Job (Purple Solid) */}
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "9px 14px",
            borderRadius: "8px",
            backgroundColor: "#7956C9",
            color: "#FFFFFF",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: isRetrying ? "not-allowed" : "pointer",
            boxShadow: "0 1px 2px rgba(121, 86, 201, 0.2)",
            transition: "all 0.15s ease",
            opacity: isRetrying ? 0.7 : 1,
          }}
        >
          <RotateCw
            size={14}
            style={{
              animation: isRetrying ? "spin 1s linear infinite" : "none",
            }}
          />
          <span>{isRetrying ? "Retrying..." : "Retry Job"}</span>
        </button>

        {/* 2. Cancel Job (Red Outline) */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isCancelling || isJobCancelled || isJobCompleted}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            color: isJobCancelled ? "#A09BA8" : "#E53E3E",
            border: `1px solid ${isJobCancelled ? "#EAE4EE" : "#FCA5A5"}`,
            fontSize: "13px",
            fontWeight: 600,
            cursor: isCancelling || isJobCancelled || isJobCompleted ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            opacity: isJobCancelled || isJobCompleted ? 0.5 : 1,
          }}
        >
          <Ban size={14} />
          <span>{isJobCancelled ? "Job Cancelled" : "Cancel Job"}</span>
        </button>

        {/* 3. View Generated Asset (Neutral Outline) */}
        <button
          type="button"
          onClick={onViewAsset}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Eye size={14} color="#777184" />
          <span>View Generated Asset</span>
        </button>

        {/* 4. Copy Job ID (Neutral Outline) */}
        <button
          type="button"
          onClick={onCopyJobId}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Copy size={14} color="#777184" />
          <span>Copy Job ID</span>
        </button>
      </div>
    </div>
  );
};
