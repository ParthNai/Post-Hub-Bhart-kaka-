"use client";

import React from "react";
import { Calendar, Upload, Download, Plus } from "lucide-react";

interface FestivalsHeaderProps {
  onAddNewEvent: () => void;
  onImportEvents: () => void;
  onExportEvents: () => void;
  onCalendarViewClick?: () => void;
}

export const FestivalsHeader: React.FC<FestivalsHeaderProps> = ({
  onAddNewEvent,
  onImportEvents,
  onExportEvents,
  onCalendarViewClick,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      {/* Breadcrumbs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "#777184",
        }}
      >
        <span style={{ color: "#777184" }}>Dashboard</span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: "#777184" }}>Festivals & Events</span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: "#7956C9", fontWeight: 600 }}>Overview</span>
      </div>

      {/* Main Title Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Title and Icon */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
            }}
          >
            <Calendar size={20} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#24213A",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Festivals & Events Management
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#777184",
                margin: "3px 0 0 0",
              }}
            >
              Manage festivals, national holidays, religious occasions, business events and yearly celebration content across Post Hub.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Calendar View Button */}
          <button
            type="button"
            onClick={onCalendarViewClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#7956C9",
              border: "1px solid #7956C9",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Calendar size={15} />
            <span>Calendar View</span>
          </button>

          {/* Import Events Button */}
          <button
            type="button"
            onClick={onImportEvents}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#7956C9",
              border: "1px solid #7956C9",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Upload size={15} />
            <span>Import Events</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={onExportEvents}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#7956C9",
              border: "1px solid #7956C9",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Download size={15} />
            <span>Export</span>
          </button>

          {/* + Add New Event Button */}
          <button
            type="button"
            onClick={onAddNewEvent}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 18px",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
              transition: "all 0.15s ease",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add New Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};
