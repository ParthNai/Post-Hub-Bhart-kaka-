"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Loader2,
  RotateCcw,
  Eye,
  Copy,
} from "lucide-react";
import type { AiGenerationRequest, AiGenerationStatus } from "@/lib/ai-generation";
import { AiArtworkPreview } from "./AiArtworkPreview";

interface AiRequestsTableProps {
  requests: AiGenerationRequest[];
  selectedRequest: AiGenerationRequest | null;
  onSelectRequest: (req: AiGenerationRequest) => void;
  onRetryRequest: (id: string) => void;
  onCancelRequest: (id: string) => void;
  onViewFullRequest: (req: AiGenerationRequest) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export const AiRequestsTable: React.FC<AiRequestsTableProps> = ({
  requests,
  selectedRequest,
  onSelectRequest,
  onRetryRequest,
  onCancelRequest,
  onViewFullRequest,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  const renderStatusBadge = (status: AiGenerationStatus) => {
    switch (status) {
      case "completed":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#E6F4EA",
              color: "#137333",
              padding: "4px 10px",
              borderRadius: "14px",
            }}
          >
            <CheckCircle2 size={13} />
            <span>Completed</span>
          </span>
        );
      case "processing":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#EEF2FF",
              color: "#4F46E5",
              padding: "4px 10px",
              borderRadius: "14px",
            }}
          >
            <Loader2 size={13} style={{ animation: "spin 1.2s linear infinite" }} />
            <span>Processing</span>
          </span>
        );
      case "failed":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#FEF3C7",
              color: "#D97706",
              padding: "4px 10px",
              borderRadius: "14px",
            }}
          >
            <AlertCircle size={13} />
            <span>Failed</span>
          </span>
        );
      case "pending":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#F3E8FF",
              color: "#7E22CE",
              padding: "4px 10px",
              borderRadius: "14px",
            }}
          >
            <Clock size={13} />
            <span>Pending</span>
          </span>
        );
      case "cancelled":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#F3F4F6",
              color: "#6B7280",
              padding: "4px 10px",
              borderRadius: "14px",
            }}
          >
            <Ban size={13} />
            <span>Cancelled</span>
          </span>
        );
    }
  };

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
      {/* Table Header Section */}
      <div
        style={{
          padding: "18px 22px 14px 22px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--foreground)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Generation Requests
        </h2>
      </div>

      {/* Table container */}
      <div style={{ overflowX: "auto", minHeight: "320px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--text-muted)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <th style={{ padding: "12px 16px" }}>Request ID</th>
              <th style={{ padding: "12px 16px" }}>User</th>
              <th style={{ padding: "12px 16px" }}>Prompt Preview</th>
              <th style={{ padding: "12px 16px" }}>Image Format</th>
              <th style={{ padding: "12px 16px" }}>AI Provider</th>
              <th style={{ padding: "12px 16px" }}>Submitted At</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px auto" }} />
                  <div>Loading generation requests...</div>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)", marginBottom: "4px" }}>
                    No requests found
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    Try adjusting your search criteria or filter options.
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                const isMenuOpen = openMenuId === req.id;

                return (
                  <tr
                    key={req.id}
                    onClick={() => onSelectRequest(req)}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      backgroundColor: isSelected
                        ? "rgba(121, 86, 201, 0.05)"
                        : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.1s ease",
                    }}
                  >
                    {/* Request ID + Artwork Thumbnail */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "44px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid var(--border)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          }}
                        >
                          <AiArtworkPreview request={req} size="thumb" />
                        </div>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "var(--foreground)",
                            fontFamily: "var(--font-mono, monospace)",
                            fontSize: "12.5px",
                          }}
                        >
                          {req.id}
                        </span>
                      </div>
                    </td>

                    {/* User */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary-light)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "11px",
                            flexShrink: 0,
                          }}
                        >
                          {req.userName.charAt(0)}
                        </div>
                        <span
                          style={{
                            color: "var(--foreground)",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {req.userName}
                        </span>
                      </div>
                    </td>

                    {/* Prompt Preview */}
                    <td
                      style={{
                        padding: "12px 16px",
                        maxWidth: "200px",
                        color: "var(--text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={req.prompt}
                    >
                      {req.promptPreview || req.prompt}
                    </td>

                    {/* Format */}
                    <td style={{ padding: "12px 16px", color: "var(--foreground)", fontWeight: 500 }}>
                      {req.format}
                    </td>

                    {/* AI Provider */}
                    <td style={{ padding: "12px 16px", color: "var(--foreground)", whiteSpace: "nowrap" }}>
                      {req.provider}
                    </td>

                    {/* Submitted At */}
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {req.submittedAt}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      {renderStatusBadge(req.status)}
                    </td>

                    {/* Actions Menu */}
                    <td
                      style={{ padding: "12px 16px", textAlign: "right", position: "relative" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(isMenuOpen ? null : req.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "6px",
                          color: "var(--text-muted)",
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {isMenuOpen && (
                        <div
                          style={{
                            position: "absolute",
                            right: "16px",
                            top: "40px",
                            backgroundColor: "var(--surface)",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                            zIndex: 20,
                            minWidth: "160px",
                            padding: "4px 0",
                            textAlign: "left",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onViewFullRequest(req);
                              setOpenMenuId(null);
                            }}
                            style={{
                              width: "100%",
                              padding: "8px 14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "13px",
                              color: "var(--foreground)",
                            }}
                          >
                            <Eye size={14} />
                            <span>View Details</span>
                          </button>

                          {(req.status === "failed" || req.status === "cancelled") && (
                            <button
                              type="button"
                              onClick={() => {
                                onRetryRequest(req.id);
                                setOpenMenuId(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "8px 14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                color: "var(--primary)",
                              }}
                            >
                              <RotateCcw size={14} />
                              <span>Retry Generation</span>
                            </button>
                          )}

                          {(req.status === "pending" || req.status === "processing") && (
                            <button
                              type="button"
                              onClick={() => {
                                onCancelRequest(req.id);
                                setOpenMenuId(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "8px 14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                color: "#DC2626",
                              }}
                            >
                              <Ban size={14} />
                              <span>Cancel Request</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(req.id);
                              setOpenMenuId(null);
                            }}
                            style={{
                              width: "100%",
                              padding: "8px 14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "13px",
                              color: "var(--text-muted)",
                            }}
                          >
                            <Copy size={14} />
                            <span>Copy Request ID</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          padding: "14px 22px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        {/* Left: Showing range */}
        <div>
          Showing {totalCount === 0 ? "0" : `${startRecord} – ${endRecord}`} of {totalCount} requests
        </div>

        {/* Right: Rows per page + Page numbers */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                padding: "4px 8px",
                fontSize: "13px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page numbers navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Prev button */}
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: currentPage <= 1 ? "var(--text-muted)" : "var(--foreground)",
                cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                opacity: currentPage <= 1 ? 0.5 : 1,
              }}
            >
              &lt;
            </button>

            {/* Page 1 */}
            <button
              type="button"
              onClick={() => onPageChange(1)}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: currentPage === 1 ? "1px solid var(--primary)" : "1px solid var(--border)",
                backgroundColor: currentPage === 1 ? "var(--primary)" : "var(--surface)",
                color: currentPage === 1 ? "#ffffff" : "var(--foreground)",
                fontWeight: currentPage === 1 ? 700 : 500,
                cursor: "pointer",
              }}
            >
              1
            </button>

            {/* Page 2 if totalPages >= 2 */}
            {totalPages >= 2 && (
              <button
                type="button"
                onClick={() => onPageChange(2)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: currentPage === 2 ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: currentPage === 2 ? "var(--primary)" : "var(--surface)",
                  color: currentPage === 2 ? "#ffffff" : "var(--foreground)",
                  fontWeight: currentPage === 2 ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                2
              </button>
            )}

            {/* Page 3 if totalPages >= 3 */}
            {totalPages >= 3 && (
              <button
                type="button"
                onClick={() => onPageChange(3)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: currentPage === 3 ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: currentPage === 3 ? "var(--primary)" : "var(--surface)",
                  color: currentPage === 3 ? "#ffffff" : "var(--foreground)",
                  fontWeight: currentPage === 3 ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                3
              </button>
            )}

            {/* Ellipsis if totalPages > 4 */}
            {totalPages > 4 && (
              <span style={{ padding: "0 4px", color: "var(--text-muted)" }}>...</span>
            )}

            {/* Last Page button if totalPages > 3 */}
            {totalPages > 3 && (
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: currentPage === totalPages ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: currentPage === totalPages ? "var(--primary)" : "var(--surface)",
                  color: currentPage === totalPages ? "#ffffff" : "var(--foreground)",
                  fontWeight: currentPage === totalPages ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {totalPages}
              </button>
            )}

            {/* Next button */}
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              style={{
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: currentPage >= totalPages ? "var(--text-muted)" : "var(--foreground)",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                opacity: currentPage >= totalPages ? 0.5 : 1,
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

