"use client";

import React from "react";
import { Zap, Plus, CalendarPlus, Upload, LayoutGrid, Globe } from "lucide-react";

interface QuickActionsSectionProps {
  onAddNewFestival: () => void;
  onCreateCustomEvent: () => void;
  onImportCalendar: () => void;
  onManageCategories: () => void;
  onConfigureRegional: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onAddNewFestival,
  onCreateCustomEvent,
  onImportCalendar,
  onManageCategories,
  onConfigureRegional,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          <Zap size={16} fill="#7956C9" />
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Quick Actions
        </h2>
      </div>

      {/* Buttons Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {/* + Add New Festival */}
        <button
          type="button"
          onClick={onAddNewFestival}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={15} color="#7956C9" />
          <span>Add New Festival</span>
        </button>

        {/* Import Festival Calendar */}
        <button
          type="button"
          onClick={onImportCalendar}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Upload size={14} color="#7956C9" />
          <span>Import Festival Calendar</span>
        </button>

        {/* Create Custom Event */}
        <button
          type="button"
          onClick={onCreateCustomEvent}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <CalendarPlus size={14} color="#7956C9" />
          <span>Create Custom Event</span>
        </button>

        {/* Manage Event Categories */}
        <button
          type="button"
          onClick={onManageCategories}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <LayoutGrid size={14} color="#7956C9" />
          <span>Manage Event Categories</span>
        </button>

        {/* Configure Regional Calendars */}
        <button
          type="button"
          onClick={onConfigureRegional}
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            border: "1px solid #EAE4EE",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Globe size={14} color="#7956C9" />
          <span>Configure Regional Calendars</span>
        </button>
      </div>
    </div>
  );
};
