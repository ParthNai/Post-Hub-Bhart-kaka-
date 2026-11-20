"use client";

import React from "react";
import { History, Info } from "lucide-react";
import type { JobRetryRecord } from "@/lib/ai-job-trace";

interface RetryErrorHistoryCardProps {
  retryHistory: JobRetryRecord[];
  infoNote?: string;
}

export const RetryErrorHistoryCard: React.FC<RetryErrorHistoryCardProps> = ({
  retryHistory,
  infoNote = "No errors in this job (illustrative data).",
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "16px 18px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
        <History size={16} color="#7956C9" />
        <span>Retry & Error History</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", flex: 1 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #EAE4EE" }}>
              <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>
                Attempt
              </th>
              <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>
                Failure Category
              </th>
              <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>
                Error Code
              </th>
              <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>
                Retry Decision
              </th>
              <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>
                Retry Timestamp
              </th>
              <th style={{ padding: "8px 10px", color: "#777184", fontWeight: 600 }}>
                Worker / Provider
              </th>
            </tr>
          </thead>
          <tbody>
            {retryHistory.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "16px 10px",
                    textAlign: "center",
                    color: "#777184",
                    fontStyle: "italic",
                  }}
                >
                  No retry or error events recorded.
                </td>
              </tr>
            ) : (
              retryHistory.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom:
                      idx < retryHistory.length - 1 ? "1px solid #F3EFFC" : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#24213A",
                      fontWeight: 600,
                    }}
                  >
                    {item.attempt}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#24213A",
                    }}
                  >
                    {item.failureCategory}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      fontFamily: "monospace",
                      color: "#E53E3E",
                      fontWeight: 600,
                    }}
                  >
                    {item.errorCode}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#24213A",
                    }}
                  >
                    {item.retryDecision}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#777184",
                    }}
                  >
                    {item.retryTimestamp}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#24213A",
                      fontWeight: 500,
                    }}
                  >
                    {item.workerProvider}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lavender info banner */}
      <div
        style={{
          marginTop: "12px",
          backgroundColor: "#F3EFFC",
          borderRadius: "8px",
          padding: "9px 12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "#7956C9",
          fontWeight: 400,
        }}
      >
        <Info size={15} color="#7956C9" style={{ flexShrink: 0 }} />
        <span>{infoNote}</span>
      </div>
    </div>
  );
};
