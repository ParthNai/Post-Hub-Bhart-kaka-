"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { DesignTokenItem, TokenCategory } from "@/lib/token-usage";

interface TokenInventoryCardProps {
  tokens: DesignTokenItem[];
  selectedTokenId: string | null;
  onSelectToken: (token: DesignTokenItem) => void;
  activeCategory: TokenCategory;
  onSelectCategory: (cat: TokenCategory) => void;
}

const CATEGORY_TABS: TokenCategory[] = [
  "All",
  "Colors",
  "Typography",
  "Spacing",
  "Radius",
  "Layout",
];

export const TokenInventoryCard: React.FC<TokenInventoryCardProps> = ({
  tokens,
  selectedTokenId,
  onSelectToken,
  activeCategory,
  onSelectCategory,
}) => {
  const getStatusDot = (status: DesignTokenItem["status"]) => {
    switch (status) {
      case "indexed":
        return { color: "#12805C", label: "Indexed" };
      case "no_references":
        return { color: "#777184", label: "No references found" };
      case "not_scanned":
        return { color: "#D97706", label: "Not scanned" };
      case "unavailable":
        return { color: "#7956C9", label: "Usage data unavailable" };
      case "failed":
        return { color: "#D9383A", label: "Scan failed" };
      default:
        return { color: "#777184", label: status };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
      }}
    >
      {/* Card Header & Description */}
      <div>
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: 0,
          }}
        >
          Design tokens
        </h3>
        <p
          style={{
            fontSize: "12.5px",
            color: "var(--text-muted, #777184)",
            marginTop: "3px",
            marginBottom: 0,
          }}
        >
          This is an illustrative list of design tokens. Actual data may vary based on your configuration.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "2px",
        }}
      >
        {CATEGORY_TABS.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? "var(--primary, #7956C9)" : "#F4EFF8",
                color: isActive ? "#FFFFFF" : "var(--text-muted, #777184)",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div
        style={{
          overflowX: "auto",
          marginTop: "4px",
        }}
      >
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
                borderBottom: "1px solid var(--border, #EAE4EE)",
                color: "var(--text-muted, #777184)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <th style={{ padding: "10px 12px", width: "30%" }}>Token</th>
              <th style={{ padding: "10px 12px", width: "20%" }}>Category</th>
              <th style={{ padding: "10px 12px", width: "25%" }}>Current value</th>
              <th style={{ padding: "10px 12px", width: "22%" }}>Usage status</th>
              <th style={{ padding: "10px 8px", width: "3%", textAlign: "right" }} aria-label="Action" />
            </tr>
          </thead>
          <tbody>
            {tokens.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "36px 12px",
                    textAlign: "center",
                    color: "var(--text-muted, #777184)",
                    fontSize: "13px",
                  }}
                >
                  No tokens match the selected category or search filter.
                </td>
              </tr>
            ) : (
              tokens.map((token) => {
                const isSelected = selectedTokenId === token.id;
                const statusInfo = getStatusDot(token.status);

                return (
                  <tr
                    key={token.id}
                    onClick={() => onSelectToken(token)}
                    style={{
                      borderBottom: "1px solid #F5F1F8",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "rgba(121, 86, 201, 0.06)" : "transparent",
                      transition: "background-color 0.12s ease",
                    }}
                    className="token-row"
                  >
                    {/* Token ID */}
                    <td
                      style={{
                        padding: "13px 12px",
                        fontWeight: 600,
                        color: isSelected ? "var(--primary, #7956C9)" : "var(--text, #24213A)",
                        fontFamily: "var(--font-mono, monospace, sans-serif)",
                        fontSize: "13px",
                      }}
                    >
                      {token.id}
                    </td>

                    {/* Category */}
                    <td style={{ padding: "13px 12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 9px",
                          borderRadius: "12px",
                          fontSize: "11.5px",
                          fontWeight: 500,
                          backgroundColor: "#F2EDF8",
                          color: "var(--primary, #7956C9)",
                        }}
                      >
                        {token.category}
                      </span>
                    </td>

                    {/* Current Value */}
                    <td style={{ padding: "13px 12px", color: "var(--text, #24213A)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {token.colorHex && (
                          <span
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: token.colorHex,
                              display: "inline-block",
                              border: "1px solid rgba(0,0,0,0.1)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span style={{ fontWeight: 500 }}>{token.value}</span>
                      </div>
                    </td>

                    {/* Usage Status */}
                    <td style={{ padding: "13px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: statusInfo.color,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 500,
                            color: "var(--text, #24213A)",
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </td>

                    {/* Arrow */}
                    <td style={{ padding: "13px 8px", textAlign: "right" }}>
                      <ChevronRight
                        size={15}
                        style={{
                          color: isSelected ? "var(--primary, #7956C9)" : "#BFBAC7",
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination & Count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "12px",
          fontSize: "12px",
          color: "var(--text-muted, #777184)",
          borderTop: "1px solid var(--border, #EAE4EE)",
        }}
      >
        <span>
          Showing 1-{tokens.length} of {tokens.length} tokens (illustrative data)
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            disabled
            aria-label="Previous page"
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "#BFBAC7",
              cursor: "not-allowed",
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              backgroundColor: "var(--primary, #7956C9)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            1
          </span>
          <button
            type="button"
            disabled
            aria-label="Next page"
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              border: "1px solid var(--border, #EAE4EE)",
              backgroundColor: "#FFFFFF",
              color: "#BFBAC7",
              cursor: "not-allowed",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
