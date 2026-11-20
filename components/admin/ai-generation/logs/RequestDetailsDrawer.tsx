"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  FileText,
  Code,
  CheckCircle,
  ExternalLink,
  Laptop,
  ShieldCheck,
} from "lucide-react";
import type { ApiRequestLog } from "@/lib/ai-request-logs";

interface RequestDetailsDrawerProps {
  log: ApiRequestLog | null;
  onClose: () => void;
}

export const RequestDetailsDrawer: React.FC<RequestDetailsDrawerProps> = ({ log, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Request Metadata" | "Response Metadata" | "Related Events"
  >("Overview");

  if (!log) return null;

  // Response Code pill style
  let codeBg = "#EAFBF0";
  let codeColor = "#1E824C";
  if (log.responseCode >= 500) {
    codeBg = "#FEE2E2";
    codeColor = "#DC2626";
  } else if (log.responseCode >= 400) {
    codeBg = "#FEF3C7";
    codeColor = "#D97706";
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #EAE4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
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
            color: "#777184",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #EAE4EE",
          padding: "0 12px",
          gap: "8px",
          overflowX: "auto",
        }}
      >
        {(["Overview", "Request Metadata", "Response Metadata", "Related Events"] as const).map(
          (tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 8px",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#7956C9" : "#777184",
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid #7956C9" : "2px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {tab}
              </button>
            );
          }
        )}
      </div>

      {/* Content Area */}
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {activeTab === "Overview" && (
          <>
            {/* 1. Request Information Section */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#24213A",
                  marginBottom: "12px",
                }}
              >
                <FileText size={15} color="#7956C9" />
                <span>Request Information</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Request ID:</span>
                  <span style={{ color: "#24213A", fontWeight: 600, fontFamily: "monospace" }}>
                    {log.id}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Correlation ID:</span>
                  <span style={{ color: "#24213A", fontWeight: 500, fontFamily: "monospace" }}>
                    {log.correlationId}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Related Job ID:</span>
                  <Link
                    href={`/admin/ai-generation/trace?jobId=${encodeURIComponent(log.relatedJobId)}`}
                    style={{
                      color: "#7956C9",
                      fontWeight: 600,
                      fontFamily: "monospace",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>{log.relatedJobId}</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Endpoint:</span>
                  <span style={{ color: "#24213A", fontFamily: "monospace" }}>{log.endpoint}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Method:</span>
                  <span
                    style={{
                      backgroundColor: "#F3EFFC",
                      color: "#7956C9",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {log.method}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Request Timestamp:</span>
                  <span style={{ color: "#24213A" }}>{log.fullTimestamp}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Response Timestamp:</span>
                  <span style={{ color: "#24213A" }}>
                    {log.fullTimestamp.replace("10:46 AM", "10:47 AM")}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Response Code:</span>
                  <span
                    style={{
                      backgroundColor: codeBg,
                      color: codeColor,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {log.responseCode}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Latency:</span>
                  <span style={{ color: "#24213A", fontWeight: 600 }}>{log.latency}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Request Source:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#24213A" }}>
                    <Laptop size={13} color="#777184" />
                    <span>{log.requestSource}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Request Metadata Section */}
            <div style={{ borderTop: "1px solid #F1EDF5", paddingTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#24213A",
                  marginBottom: "12px",
                }}
              >
                <Code size={15} color="#7956C9" />
                <span>Request Metadata</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Generation Type:</span>
                  <span style={{ color: "#24213A", fontWeight: 500 }}>
                    {log.requestMetadata.generationType}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Model:</span>
                  <span style={{ color: "#24213A", fontWeight: 500 }}>
                    {log.requestMetadata.model}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Priority:</span>
                  <span
                    style={{
                      backgroundColor: "#FEF3C7",
                      color: "#D97706",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {log.requestMetadata.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Response Metadata Section */}
            <div style={{ borderTop: "1px solid #F1EDF5", paddingTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#24213A",
                  marginBottom: "12px",
                }}
              >
                <CheckCircle size={15} color="#7956C9" />
                <span>Response Metadata</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Processing Status:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: log.status === "Success" ? "#10B981" : "#EF4444",
                      }}
                    />
                    <span
                      style={{
                        color: log.status === "Success" ? "#10B981" : "#EF4444",
                        fontWeight: 600,
                      }}
                    >
                      {log.responseMetadata.processingStatus}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#777184" }}>Result Size:</span>
                  <span style={{ color: "#24213A", fontWeight: 500 }}>
                    {log.responseMetadata.resultSize}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "Request Metadata" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
            <div
              style={{
                backgroundColor: "#F3EFFC",
                border: "1px solid #EAE4EE",
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#7956C9",
              }}
            >
              <ShieldCheck size={16} />
              <span style={{ fontSize: "11.5px" }}>
                Sensitive credentials, authorization tokens and secrets are redacted server-side.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Prompt Tokens:</span>
              <span style={{ color: "#24213A", fontWeight: 600 }}>
                {log.requestMetadata.promptTokens || "—"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Dimensions:</span>
              <span style={{ color: "#24213A" }}>{log.requestMetadata.dimensions || "—"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Aspect Ratio:</span>
              <span style={{ color: "#24213A" }}>{log.requestMetadata.aspectRatio || "—"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Client IP:</span>
              <span style={{ color: "#24213A", fontFamily: "monospace" }}>
                {log.requestMetadata.clientIp || "127.0.0.1"}
              </span>
            </div>
          </div>
        )}

        {activeTab === "Response Metadata" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Asset Reference:</span>
              <span style={{ color: "#7956C9", fontFamily: "monospace" }}>
                {log.responseMetadata.outputAssetRef || "—"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Provider Response Time:</span>
              <span style={{ color: "#24213A" }}>
                {log.responseMetadata.providerResponseTime || "—"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Queue Wait Duration:</span>
              <span style={{ color: "#24213A" }}>
                {log.responseMetadata.queueWaitDuration || "—"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#777184" }}>Worker Processing Time:</span>
              <span style={{ color: "#24213A" }}>
                {log.responseMetadata.workerProcessingDuration || "—"}
              </span>
            </div>
          </div>
        )}

        {activeTab === "Related Events" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {log.relatedEvents && log.relatedEvents.length > 0 ? (
              log.relatedEvents.map((evt, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    backgroundColor: "#FAF9FD",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#24213A" }}>{evt.step}</span>
                    <span
                      style={{
                        fontSize: "10.5px",
                        color: evt.status === "Success" ? "#10B981" : "#EF4444",
                        fontWeight: 600,
                      }}
                    >
                      {evt.status}
                    </span>
                  </div>
                  <div style={{ color: "#777184", fontSize: "11px", marginBottom: "2px" }}>
                    {evt.component} • {evt.timestamp}
                  </div>
                  <div style={{ color: "#544E61", fontSize: "11.5px" }}>{evt.details}</div>
                </div>
              ))
            ) : (
              <div style={{ color: "#777184", fontSize: "12px", fontStyle: "italic" }}>
                No execution events linked to this request.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
