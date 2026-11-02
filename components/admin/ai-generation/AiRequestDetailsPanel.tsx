"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  AlertCircle,
  Ban,
  Loader2,
} from "lucide-react";
import type { AiGenerationRequest } from "@/lib/ai-generation";
import { AiArtworkPreview } from "./AiArtworkPreview";

interface AiRequestDetailsPanelProps {
  request: AiGenerationRequest | null;
  onClose: () => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onViewFull: (req: AiGenerationRequest) => void;
  isActionLoading?: boolean;
}

export const AiRequestDetailsPanel: React.FC<AiRequestDetailsPanelProps> = ({
  request,
  onClose,
  onRetry,
  onCancel,
  onViewFull,
  isActionLoading = false,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!request) {
    return (
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderRadius: "14px",
          border: "1px solid var(--border)",
          padding: "36px 20px",
          textAlign: "center",
          color: "var(--text-muted)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", marginBottom: "4px" }}>
          No Request Selected
        </div>
        <div style={{ fontSize: "13px" }}>
          Select a request from the table to view its details and artwork preview.
        </div>
      </div>
    );
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(request.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const isFailed = request.status === "failed";
  const isCancelled = request.status === "cancelled";
  const isPending = request.status === "pending" || request.status === "processing";

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.02)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--foreground)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Request Details
        </h3>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "6px",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Close details"
        >
          <X size={16} />
        </button>
      </div>

      {/* Featured Artwork Preview */}
      <div style={{ padding: "16px 20px 12px 20px" }}>
        <div
          style={{
            width: "100%",
            aspectRatio: "4 / 4.6",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid var(--border)",
            position: "relative",
          }}
        >
          <AiArtworkPreview request={request} size="full" />
        </div>
      </div>

      {/* Details List */}
      <div
        style={{
          padding: "8px 20px 16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontSize: "13px",
          flex: 1,
        }}
      >
        {/* Full Prompt */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: "90px", flexShrink: 0 }}>
            Full Prompt:
          </span>
          <div
            style={{
              color: "var(--foreground)",
              lineHeight: "1.4",
              flex: 1,
              wordBreak: "break-word",
            }}
          >
            {request.prompt}
          </div>
          <button
            type="button"
            onClick={handleCopyPrompt}
            title="Copy prompt"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              color: copiedPrompt ? "#137333" : "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            {copiedPrompt ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: "90px", flexShrink: 0 }}>
            User:
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              {request.userName.charAt(0)}
            </div>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
              {request.userName}
            </span>
          </div>
        </div>

        {/* Dimensions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: "90px", flexShrink: 0 }}>
            Dimensions:
          </span>
          <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
            {request.dimensions}
          </span>
        </div>

        {/* Style */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: "90px", flexShrink: 0 }}>
            Style:
          </span>
          <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
            {request.style}
          </span>
        </div>

        {/* Provider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: "90px", flexShrink: 0 }}>
            Provider:
          </span>
          <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
            {request.provider}
          </span>
        </div>

        {/* Submitted */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600, minWidth: "90px", flexShrink: 0 }}>
            Submitted:
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            {request.submittedAt}
          </span>
        </div>

        {/* Error message callout if Failed */}
        {isFailed && request.errorMessage && (
          <div
            style={{
              marginTop: "4px",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FEE2E2",
              color: "#991B1B",
              fontSize: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
            <div>
              <div style={{ fontWeight: 600 }}>Generation Failed</div>
              <div style={{ marginTop: "2px" }}>{request.errorMessage}</div>
            </div>
          </div>
        )}

        {/* Cancellation reason callout if Cancelled */}
        {isCancelled && request.cancellationReason && (
          <div
            style={{
              marginTop: "4px",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "#F3F4F6",
              border: "1px solid #E5E7EB",
              color: "#4B5563",
              fontSize: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Ban size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
            <div>
              <div style={{ fontWeight: 600 }}>Request Cancelled</div>
              <div style={{ marginTop: "2px" }}>{request.cancellationReason}</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons at bottom */}
      <div
        style={{
          padding: "14px 20px 18px 20px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* View Request button */}
        <button
          type="button"
          onClick={() => onViewFull(request)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "9px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            transition: "all 0.15s ease",
          }}
        >
          <ExternalLink size={14} />
          <span>View Request</span>
        </button>

        {/* Retry or Cancel Action Button */}
        {isPending ? (
          <button
            type="button"
            onClick={() => onCancel(request.id)}
            disabled={isActionLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#DC2626",
              color: "#ffffff",
              border: "none",
              cursor: isActionLoading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)",
              transition: "all 0.15s ease",
            }}
          >
            {isActionLoading ? (
              <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Ban size={15} />
            )}
            <span>Cancel Request</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onRetry(request.id)}
            disabled={isActionLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              cursor: isActionLoading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
              transition: "all 0.15s ease",
            }}
          >
            {isActionLoading ? (
              <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <RotateCcw size={15} />
            )}
            <span>Retry Generation</span>
          </button>
        )}
      </div>
    </div>
  );
};

