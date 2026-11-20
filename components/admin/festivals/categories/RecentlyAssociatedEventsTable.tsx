"use client";

import React from "react";
import { Calendar } from "lucide-react";
import type { FestivalEvent } from "@/lib/festivals";

interface RecentlyAssociatedEventsTableProps {
  events: FestivalEvent[];
  onViewEvent: (event: FestivalEvent) => void;
}

export const RecentlyAssociatedEventsTable: React.FC<RecentlyAssociatedEventsTableProps> = ({
  events,
  onViewEvent,
}) => {
  // Canonical preview rows if live events are limited
  const displayEvents =
    events && events.length > 0
      ? events.slice(0, 4)
      : [
          {
            id: "EVT-001",
            name: "Diwali",
            formattedDate: "Nov 08, 2026",
            region: "India",
            contentStatus: "Published",
          },
          {
            id: "EVT-002",
            name: "Holi",
            formattedDate: "Mar 17, 2027",
            region: "India",
            contentStatus: "Scheduled",
          },
          {
            id: "EVT-003",
            name: "Christmas",
            formattedDate: "Dec 25, 2026",
            region: "Global",
            contentStatus: "Published",
          },
          {
            id: "EVT-004",
            name: "Republic Day",
            formattedDate: "Jan 26, 2027",
            region: "India",
            contentStatus: "Draft",
          },
        ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return {
          bg: "#DEF7EC",
          color: "#03543F",
          dot: "#0E9F6E",
        };
      case "Scheduled":
        return {
          bg: "#FEF3C7",
          color: "#92400E",
          dot: "#F59E0B",
        };
      case "Draft":
        return {
          bg: "#E1EFFE",
          color: "#1E429F",
          dot: "#3B82F6",
        };
      case "Pending Review":
        return {
          bg: "#FDE8E8",
          color: "#9B1C1C",
          dot: "#EF4444",
        };
      default:
        return {
          bg: "#F3F4F6",
          color: "#4B5563",
          dot: "#9CA3AF",
        };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Calendar size={16} color="#7956C9" />
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Recently Associated Events
        </h2>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #EAE4EE",
                color: "#777184",
                fontWeight: 600,
              }}
            >
              <th style={{ padding: "8px 10px 8px 0" }}>Event Name</th>
              <th style={{ padding: "8px 10px" }}>Event Date</th>
              <th style={{ padding: "8px 10px" }}>Region</th>
              <th style={{ padding: "8px 10px" }}>Event Status</th>
              <th style={{ padding: "8px 0 8px 10px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayEvents.map((evt) => {
              const badge = getStatusBadge(evt.contentStatus);
              return (
                <tr
                  key={evt.id}
                  style={{
                    borderBottom: "1px solid #FAF7F2",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 10px 10px 0",
                      fontWeight: 600,
                      color: "#24213A",
                    }}
                  >
                    {evt.name}
                  </td>
                  <td style={{ padding: "10px", color: "#777184" }}>{evt.formattedDate}</td>
                  <td style={{ padding: "10px", color: "#777184" }}>{evt.region || "India"}</td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.color,
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: badge.dot,
                        }}
                      />
                      {evt.contentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "10px 0 10px 10px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => onViewEvent(evt as FestivalEvent)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        border: "1px solid #EAE4EE",
                        backgroundColor: "#FFFFFF",
                        color: "#7956C9",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
