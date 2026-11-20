"use client";

import React from "react";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CategoryIcon } from "./CategoryIcon";
import type { FestivalCategory } from "@/lib/festival-categories";
import type { FestivalEvent } from "@/lib/festivals";

interface CategoryEventsModalProps {
  isOpen: boolean;
  category: FestivalCategory | null;
  events: FestivalEvent[];
  onClose: () => void;
}

export const CategoryEventsModal: React.FC<CategoryEventsModalProps> = ({
  isOpen,
  category,
  events,
  onClose,
}) => {
  if (!isOpen || !category) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(36, 33, 58, 0.4)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "680px",
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
          border: "1px solid #EAE4EE",
          overflow: "hidden",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#F5F3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: category.displayColor || "#7956C9",
              }}
            >
              <CategoryIcon icon={category.icon} size={18} color={category.displayColor || "#7956C9"} />
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                {category.name} — Associated Events
              </h3>
              <p style={{ fontSize: "11.5px", color: "#777184", margin: 0 }}>
                {events.length} events categorized under this taxonomy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Table */}
        <div style={{ padding: "16px 22px", overflowY: "auto", flex: 1 }}>
          {events.length === 0 ? (
            <div
              style={{
                padding: "36px",
                textAlign: "center",
                color: "#777184",
                fontSize: "13px",
              }}
            >
              No events are currently associated with this category.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #EAE4EE", color: "#777184", textAlign: "left" }}>
                  <th style={{ padding: "8px 0" }}>Event Name</th>
                  <th style={{ padding: "8px 10px" }}>Date</th>
                  <th style={{ padding: "8px 10px" }}>Region</th>
                  <th style={{ padding: "8px 10px" }}>Status</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id} style={{ borderBottom: "1px solid #FAF7F2" }}>
                    <td style={{ padding: "10px 0", fontWeight: 600, color: "#24213A" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{evt.iconEmoji || "🎉"}</span>
                        <span>{evt.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px", color: "#777184" }}>{evt.formattedDate}</td>
                    <td style={{ padding: "10px", color: "#777184" }}>{evt.region || "India"}</td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: evt.contentStatus === "Published" ? "#DEF7EC" : "#FEF3C7",
                          color: evt.contentStatus === "Published" ? "#03543F" : "#92400E",
                        }}
                      >
                        {evt.contentStatus}
                      </span>
                    </td>
                    <td style={{ padding: "10px 0", textAlign: "right" }}>
                      <Link
                        href="/admin/festivals"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          color: "#7956C9",
                          textDecoration: "none",
                        }}
                      >
                        <span>Open in Screen 36</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "#FAF7F2",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
