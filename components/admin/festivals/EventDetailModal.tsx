"use client";

import React from "react";
import { X, MapPin, Globe, LayoutTemplate } from "lucide-react";
import type { FestivalEvent } from "@/lib/festivals";

interface EventDetailModalProps {
  isOpen: boolean;
  event: FestivalEvent | null;
  onClose: () => void;
  onEdit: (event: FestivalEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  event,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 12px 36px rgba(36, 33, 58, 0.18)",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>{event.iconEmoji}</span>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                {event.name}
              </h2>
              <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
                Event ID: {event.id} • Slug: /{event.slug}
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
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Key Metrics Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              padding: "14px 16px",
              backgroundColor: "#FAF7F2",
              borderRadius: "10px",
              border: "1px solid #EAE4EE",
              fontSize: "12px",
            }}
          >
            <div>
              <div style={{ color: "#777184", marginBottom: "2px" }}>Date</div>
              <div style={{ fontWeight: 700, color: "#24213A" }}>{event.formattedDate}</div>
            </div>
            <div>
              <div style={{ color: "#777184", marginBottom: "2px" }}>Category</div>
              <div style={{ fontWeight: 700, color: "#24213A" }}>{event.category}</div>
            </div>
            <div>
              <div style={{ color: "#777184", marginBottom: "2px" }}>Content Status</div>
              <div style={{ fontWeight: 700, color: "#10B981" }}>{event.contentStatus}</div>
            </div>
            <div>
              <div style={{ color: "#777184", marginBottom: "2px" }}>Templates</div>
              <div style={{ fontWeight: 700, color: "#7956C9" }}>{event.templateStatus}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#24213A", margin: "0 0 6px 0" }}>
              Event Description
            </h4>
            <p style={{ fontSize: "13px", color: "#777184", lineHeight: 1.5, margin: 0 }}>
              {event.fullDescription || event.shortDescription}
            </p>
          </div>

          {/* Region & Language */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "13px" }}>
            <div style={{ padding: "14px", backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #EAE4EE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#24213A", marginBottom: "8px" }}>
                <MapPin size={15} color="#7956C9" />
                <span>Regional Availability</span>
              </div>
              <div style={{ color: "#777184", fontSize: "12px" }}>Country: {event.region}</div>
              <div style={{ color: "#777184", fontSize: "12px", marginTop: "4px" }}>
                States: {event.states.join(", ")}
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #EAE4EE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#24213A", marginBottom: "8px" }}>
                <Globe size={15} color="#7956C9" />
                <span>Localization</span>
              </div>
              <div style={{ color: "#777184", fontSize: "12px" }}>Primary: {event.language}</div>
              <div style={{ color: "#777184", fontSize: "12px", marginTop: "4px" }}>
                Supported: {event.supportedLanguages.join(", ")}
              </div>
            </div>
          </div>

          {/* Associated Poster Templates */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#24213A", marginBottom: "10px", fontSize: "13px" }}>
              <LayoutTemplate size={15} color="#7956C9" />
              <span>Associated Poster Templates ({event.associatedTemplateIds.length})</span>
            </div>
            {event.associatedTemplateIds.length === 0 ? (
              <div style={{ fontSize: "12px", color: "#F59E0B", padding: "10px 14px", backgroundColor: "#FFFBEB", borderRadius: "8px" }}>
                No poster templates associated yet. Click &quot;Edit Event&quot; to assign templates.
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                {event.associatedTemplateIds.map((tplId) => (
                  <div
                    key={tplId}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #EAE4EE",
                      backgroundColor: "#F4EFFC",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#7956C9",
                    }}
                  >
                    {tplId} — Available
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #EAE4EE",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "12px", color: "#777184" }}>
            Last modified: {event.updatedAt}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "#FFFFFF",
                color: "#777184",
                border: "1px solid #EAE4EE",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(event);
              }}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
