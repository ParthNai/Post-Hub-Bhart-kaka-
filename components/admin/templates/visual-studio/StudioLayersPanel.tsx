"use client";

import React from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Type,
  Camera,
  Square,
  Sparkles,
} from "lucide-react";
import { TemplateSlotZone } from "@/lib/templates";

interface StudioLayersPanelProps {
  zones: TemplateSlotZone[];
  selectedZoneId: string | null;
  onSelectZone: (id: string) => void;
  onUpdateZone: (id: string, updates: Partial<TemplateSlotZone>) => void;
  onDeleteZone: (id: string) => void;
  onDuplicateZone: (id: string) => void;
  onMoveLayerUp: (id: string) => void;
  onMoveLayerDown: (id: string) => void;
}

export const StudioLayersPanel: React.FC<StudioLayersPanelProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  onUpdateZone,
  onDeleteZone,
  onDuplicateZone,
  onMoveLayerUp,
  onMoveLayerDown,
}) => {
  // Sort layers top-to-bottom for intuitive display (highest z-index on top)
  const sortedZones = [...zones].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #ECE7F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#1E1A33" }}>
          Layers & Hierarchy ({zones.length})
        </span>
        <span style={{ fontSize: "11px", color: "#6E687A" }}>Top to Bottom</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {sortedZones.map((zone, idx) => {
          const isSelected = selectedZoneId === zone.id;
          const isVisible = zone.visible !== false;
          const isLocked = Boolean(zone.locked);

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "8px",
                border: isSelected ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                backgroundColor: isSelected ? "#F4F0FB" : "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.15s ease",
                opacity: isVisible ? 1 : 0.45,
                boxShadow: isSelected ? "0 2px 6px rgba(121, 86, 201, 0.12)" : "none",
              }}
            >
              {/* Left: Type Icon + Label */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    backgroundColor:
                      zone.type === "photo"
                        ? "#FEE2E2"
                        : zone.type === "text"
                        ? "#EDE9FE"
                        : "#FEF3C7",
                    color:
                      zone.type === "photo"
                        ? "#DC2626"
                        : zone.type === "text"
                        ? "#7956C9"
                        : "#D97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {zone.type === "photo" && <Camera size={13} />}
                  {zone.type === "text" && <Type size={13} />}
                  {zone.type === "shape" && <Square size={13} />}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? "#543399" : "#1E1A33",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {zone.label || (zone.type === "photo" ? "Photo Slot" : zone.type === "text" ? "Text Field" : "Shape Element")}
                  </div>
                  <div style={{ fontSize: "10px", color: "#8E8899" }}>
                    z: {zone.zIndex || 1} • {Math.round(zone.x)}%, {Math.round(zone.y)}%
                  </div>
                </div>
              </div>

              {/* Right: Actions (Visibility, Lock, Order, Duplicate, Delete) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  flexShrink: 0,
                  marginLeft: "4px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Visibility Toggle */}
                <button
                  type="button"
                  title={isVisible ? "Hide Layer" : "Show Layer"}
                  onClick={() => onUpdateZone(zone.id, { visible: !isVisible })}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "3px",
                    color: isVisible ? "#6E687A" : "#EF4444",
                    borderRadius: "4px",
                  }}
                >
                  {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>

                {/* Lock Toggle */}
                <button
                  type="button"
                  title={isLocked ? "Unlock Layer" : "Lock Layer"}
                  onClick={() => onUpdateZone(zone.id, { locked: !isLocked })}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "3px",
                    color: isLocked ? "#D97706" : "#A099AB",
                    borderRadius: "4px",
                  }}
                >
                  {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  title="Bring Forward"
                  disabled={idx === 0}
                  onClick={() => onMoveLayerUp(zone.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: idx === 0 ? "default" : "pointer",
                    padding: "3px",
                    color: idx === 0 ? "#D1CAD9" : "#6E687A",
                    borderRadius: "4px",
                  }}
                >
                  <ArrowUp size={13} />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  title="Send Backward"
                  disabled={idx === sortedZones.length - 1}
                  onClick={() => onMoveLayerDown(zone.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: idx === sortedZones.length - 1 ? "default" : "pointer",
                    padding: "3px",
                    color: idx === sortedZones.length - 1 ? "#D1CAD9" : "#6E687A",
                    borderRadius: "4px",
                  }}
                >
                  <ArrowDown size={13} />
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  title="Duplicate Layer"
                  onClick={() => onDuplicateZone(zone.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "3px",
                    color: "#6E687A",
                    borderRadius: "4px",
                  }}
                >
                  <Copy size={13} />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  title="Delete Layer"
                  onClick={() => onDeleteZone(zone.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "3px",
                    color: "#EF4444",
                    borderRadius: "4px",
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
