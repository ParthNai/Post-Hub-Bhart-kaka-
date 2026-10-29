"use client";

import React from "react";
import type { BrandAsset } from "@/lib/design-system";
import { BrandLogo } from "@/components/BrandLogo";
import { Upload } from "lucide-react";
import Image from "next/image";

interface BrandAssetsCardProps {
  assets: BrandAsset[];
  onOpenUpload: (asset: BrandAsset) => void;
}

export const BrandAssetsCard: React.FC<BrandAssetsCardProps> = ({
  assets,
  onOpenUpload,
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
          Brand Assets
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {assets.map((asset) => {
          const isUploaded = asset.status === "available";
          const isDarkLogo = asset.id === "dark-logo";
          const isAppIcon = asset.id === "app-icon";

          return (
            <div
              key={asset.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid var(--border, #EAE4EE)",
                backgroundColor: "#FFFFFF",
                gap: "16px",
                transition: "border-color 0.15s ease",
              }}
            >
              {/* Asset Left: Preview Box & Metadata */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {/* Visual Preview Box */}
                <div
                  style={{
                    width: "124px",
                    height: "56px",
                    borderRadius: "8px",
                    backgroundColor: isDarkLogo ? "#1E202C" : "#FFFFFF",
                    border: isDarkLogo ? "1px solid #2D3142" : "1px solid var(--border, #EAE4EE)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px 12px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {asset.url ? (
                    <Image
                      src={asset.url}
                      alt={asset.title}
                      width={110}
                      height={44}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      unoptimized
                    />
                  ) : isAppIcon ? (
                    <BrandLogo size="md" iconOnly={true} />
                  ) : isDarkLogo ? (
                    <BrandLogo size="xs" variant="dark" />
                  ) : (
                    <BrandLogo size="xs" variant="light" />
                  )}
                </div>

                {/* Info & Badges */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14.5px",
                      fontWeight: 600,
                      color: "var(--text, #24213A)",
                    }}
                  >
                    {asset.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted, #777184)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {asset.format}
                  </div>
                  <div>
                    {isUploaded ? (
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "#16A34A",
                          backgroundColor: "#EDF7F2",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          border: "1px solid #C8E8D7",
                        }}
                      >
                        Available
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "#777184",
                          backgroundColor: "#F4F3F7",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          border: "1px solid #EAE4EE",
                        }}
                      >
                        Not uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onOpenUpload(asset)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  borderRadius: "8px",
                  border: "1px solid var(--border, #EAE4EE)",
                  backgroundColor: "#FFFFFF",
                  color: "var(--text, #24213A)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
                className="asset-action-btn"
              >
                <Upload size={14} style={{ color: "var(--text-muted, #777184)" }} />
                <span>{isUploaded ? "Replace" : "Upload"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
