"use client";

import React, { useState } from "react";
import { ListFilter, Edit2, Eye, MoreVertical, Copy, Trash2, LayoutTemplate } from "lucide-react";
import type { FestivalEvent } from "@/lib/festivals";

interface UpcomingEventsTableProps {
  events: FestivalEvent[];
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
  onEditEvent: (event: FestivalEvent) => void;
  onViewEvent: (event: FestivalEvent) => void;
  onDuplicateEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

export const UpcomingEventsTable: React.FC<UpcomingEventsTableProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  onEditEvent,
  onViewEvent,
  onDuplicateEvent,
  onDeleteEvent,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getContentStatusBadge = (status: FestivalEvent["contentStatus"]) => {
    switch (status) {
      case "Published":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#ECFDF5",
              color: "#059669",
              border: "1px solid #A7F3D0",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#059669",
              }}
            />
            Published
          </span>
        );
      case "Scheduled":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid #BFDBFE",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#2563EB",
              }}
            />
            Scheduled
          </span>
        );
      case "Pending Review":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#FFFBEB",
              color: "#D97706",
              border: "1px solid #FDE68A",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#D97706",
              }}
            />
            Pending Review
          </span>
        );
      case "Draft":
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#F3F4F6",
              color: "#4B5563",
              border: "1px solid #E5E7EB",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#4B5563",
              }}
            />
            Draft
          </span>
        );
    }
  };

  const getTemplateStatusBadge = (status: FestivalEvent["templateStatus"]) => {
    switch (status) {
      case "Available":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#ECFDF5",
              color: "#059669",
              border: "1px solid #A7F3D0",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#059669",
              }}
            />
            Available
          </span>
        );
      case "In Progress":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid #BFDBFE",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#2563EB",
              }}
            />
            In Progress
          </span>
        );
      case "Missing":
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "#FFFBEB",
              color: "#D97706",
              border: "1px solid #FDE68A",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#D97706",
              }}
            />
            Missing
          </span>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid #EAE4EE",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            backgroundColor: "#F4EFFC",
            color: "#7956C9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ListFilter size={16} />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Upcoming Festivals &amp; Events
        </h2>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAF7F2", borderBottom: "1px solid #EAE4EE" }}>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Event Name</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Event Date</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Category</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Region</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Language</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Content Status</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184" }}>Template Status</th>
              <th style={{ padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: "#777184", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(0, 8).map((evt) => {
              const isSelected = evt.id === selectedEventId;
              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  style={{
                    borderBottom: "1px solid #EAE4EE",
                    backgroundColor: isSelected ? "#F8F5FD" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {/* Event Name */}
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px" }}>{evt.iconEmoji}</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#24213A" }}>{evt.name}</span>
                    </div>
                  </td>

                  {/* Event Date */}
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#24213A" }}>
                    {evt.formattedDate}
                  </td>

                  {/* Category */}
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#777184" }}>
                    {evt.category}
                  </td>

                  {/* Region */}
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#777184" }}>
                    {evt.region}
                  </td>

                  {/* Language */}
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#777184" }}>
                    {evt.language}
                  </td>

                  {/* Content Status */}
                  <td style={{ padding: "14px 20px" }}>
                    {getContentStatusBadge(evt.contentStatus)}
                  </td>

                  {/* Template Status */}
                  <td style={{ padding: "14px 20px" }}>
                    {getTemplateStatusBadge(evt.templateStatus)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 20px", textAlign: "center", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      {/* Pencil Edit */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(evt);
                        }}
                        title="Edit Event"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#777184",
                          padding: "3px",
                          display: "flex",
                        }}
                      >
                        <Edit2 size={15} />
                      </button>

                      {/* Eye View */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewEvent(evt);
                        }}
                        title="View Details"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#777184",
                          padding: "3px",
                          display: "flex",
                        }}
                      >
                        <Eye size={15} />
                      </button>

                      {/* Kebab More */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === evt.id ? null : evt.id);
                        }}
                        title="More actions"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#777184",
                          padding: "3px",
                          display: "flex",
                        }}
                      >
                        <MoreVertical size={15} />
                      </button>
                    </div>

                    {/* Kebab Dropdown */}
                    {activeMenuId === evt.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "40px",
                          backgroundColor: "#FFFFFF",
                          borderRadius: "10px",
                          border: "1px solid #EAE4EE",
                          boxShadow: "0 4px 14px rgba(36, 33, 58, 0.12)",
                          zIndex: 40,
                          minWidth: "160px",
                          padding: "6px 0",
                          textAlign: "left",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDuplicateEvent(evt.id);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            width: "100%",
                            padding: "8px 14px",
                            fontSize: "12px",
                            color: "#24213A",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Copy size={13} color="#7956C9" />
                          <span>Duplicate Event</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onViewEvent(evt);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            width: "100%",
                            padding: "8px 14px",
                            fontSize: "12px",
                            color: "#24213A",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <LayoutTemplate size={13} color="#2563EB" />
                          <span>Manage Templates</span>
                        </button>

                        <div style={{ height: "1px", backgroundColor: "#EAE4EE", margin: "4px 0" }} />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDeleteEvent(evt.id);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            width: "100%",
                            padding: "8px 14px",
                            fontSize: "12px",
                            color: "#EF4444",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={13} color="#EF4444" />
                          <span>Delete Event</span>
                        </button>
                      </div>
                    )}
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
