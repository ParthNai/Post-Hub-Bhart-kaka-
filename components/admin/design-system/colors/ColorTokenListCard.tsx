"use client";

import React from "react";
import { DetailedColorToken, isValidHex, normalizeHex } from "@/lib/color-tokens";
import { Plus, ChevronRight, Copy, Check } from "lucide-react";

interface ColorTokenListCardProps {
  tokens: DetailedColorToken[];
  selectedTokenId: string;
  onSelectToken: (token: DetailedColorToken) => void;
  onUpdateHex: (tokenId: string, newHex: string) => void;
  onOpenAddToken: () => void;
  onCopyValue: (val: string, label: string) => void;
  copiedVal: string | null;
  modifiedTokenIds: Set<string>;
}

export const ColorTokenListCard: React.FC<ColorTokenListCardProps> = ({
  tokens,
  selectedTokenId,
  onSelectToken,
  onUpdateHex,
  onOpenAddToken,
  onCopyValue,
  copiedVal,
  modifiedTokenIds,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--surface, #FFFFFF)",
        borderRadius: "16px",
        border: "1px solid var(--border, #EAE4EE)",
        padding: "22px 24px",
        boxShadow: "0 4px 16px -2px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            letterSpacing: "-0.01em",
          }}
        >
          Color Tokens
        </h3>

        <button
          type="button"
          onClick={onOpenAddToken}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            fontSize: "12.5px",
            fontWeight: 600,
            borderRadius: "8px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#FFFFFF",
            color: "var(--text, #24213A)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={14} style={{ color: "var(--primary, #7956C9)" }} />
          <span>Add Token</span>
        </button>
      </div>

      {/* Token Rows */}
      {tokens.length === 0 ? (
        <div
          style={{
            padding: "36px 0",
            textAlign: "center",
            color: "var(--text-muted, #777184)",
            fontSize: "13.5px",
          }}
        >
          No color tokens match the active filter or search query.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {tokens.map((token) => {
            const isSelected = token.id === selectedTokenId;
            const isModified = modifiedTokenIds.has(token.id);
            const isBorderOrIvory = token.id === "border" || token.id === "warm-ivory";

            return (
              <div
                key={token.id}
                onClick={() => onSelectToken(token)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: isSelected
                    ? "1.5px solid var(--primary, #7956C9)"
                    : "1px solid var(--border, #EAE4EE)",
                  backgroundColor: isSelected ? "var(--primary-light, #F9F6FE)" : "#FFFFFF",
                  cursor: "pointer",
                  gap: "16px",
                  transition: "all 0.15s ease",
                }}
                className="color-token-row"
              >
                {/* Left: Swatch + Title/Key */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "8px",
                      backgroundColor: token.hex,
                      border: isBorderOrIvory ? "1px solid #D5CCE0" : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text, #24213A)",
                        lineHeight: 1.3,
                      }}
                    >
                      {token.name}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted, #777184)",
                        fontFamily: "monospace",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {token.key}
                    </span>
                  </div>
                </div>

                {/* Right: HEX Box + Modified Badge + Chevron */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* HEX Control Container */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--border, #EAE4EE)",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "var(--text-muted, #777184)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      HEX
                    </span>

                    <input
                      type="text"
                      value={token.hex}
                      onChange={(e) => onUpdateHex(token.id, e.target.value)}
                      onBlur={(e) => {
                        if (isValidHex(e.target.value)) {
                          onUpdateHex(token.id, normalizeHex(e.target.value));
                        }
                      }}
                      style={{
                        width: "74px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        color: "var(--text, #24213A)",
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                      }}
                    />

                    {/* Color picker circle */}
                    <div style={{ position: "relative", width: "16px", height: "16px" }}>
                      <input
                        type="color"
                        value={isValidHex(token.hex) && normalizeHex(token.hex).length === 7 ? normalizeHex(token.hex) : "#7956C9"}
                        onChange={(e) => onUpdateHex(token.id, e.target.value.toUpperCase())}
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0,
                          cursor: "pointer",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: token.hex,
                          border: "1px solid rgba(0,0,0,0.15)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>

                    {/* Copy button */}
                    <button
                      type="button"
                      onClick={() => onCopyValue(token.hex, `HEX ${token.name}`)}
                      aria-label="Copy hex code"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px",
                        color: "var(--text-muted, #777184)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {copiedVal === token.hex ? (
                        <Check size={13} style={{ color: "var(--success, #12805C)" }} />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>

                  {/* Modified Badge */}
                  {isModified && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        backgroundColor: "var(--secondary, #E8DFF5)",
                        color: "var(--primary, #7956C9)",
                      }}
                    >
                      Modified
                    </span>
                  )}

                  {/* Chevron Right */}
                  <ChevronRight
                    size={16}
                    style={{
                      color: isSelected ? "var(--primary, #7956C9)" : "var(--text-muted, #777184)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
