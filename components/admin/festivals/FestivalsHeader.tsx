"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Upload, Download, Plus, Bell, ChevronDown } from "lucide-react";
import { FestivalSubscreenNav } from "./FestivalSubscreenNav";

interface FestivalsHeaderProps {
  onAddNewEvent: () => void;
  onImportEvents: () => void;
  onExportEvents: () => void;
  onCalendarViewClick?: () => void;
  adminName?: string;
}

export const FestivalsHeader: React.FC<FestivalsHeaderProps> = ({
  onAddNewEvent,
  onImportEvents,
  onExportEvents,
  onCalendarViewClick,
  adminName = "Parth Patel",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        marginBottom: "16px",
      }}
    >
      {/* Top Meta Bar: Breadcrumbs & Admin Profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Breadcrumbs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "#777184",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{ color: "#777184", textDecoration: "none" }}
          >
            Dashboard
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "#7956C9", fontWeight: 600 }}>
            Festivals &amp; Events
          </span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "#24213A", fontWeight: 600 }}>Overview</span>
        </div>

        {/* Right profile chip & notification bell */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            title="Notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              color: "#777184",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "7px",
                height: "7px",
                backgroundColor: "#EF4444",
                borderRadius: "50%",
                border: "2px solid #FFFFFF",
              }}
            />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "4px 10px 4px 6px",
              borderRadius: "20px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {adminName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "PP"}
            </div>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "#24213A",
              }}
            >
              {adminName}
            </span>
            <ChevronDown size={14} color="#777184" />
          </div>
        </div>
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
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #E8DFF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
              boxShadow: "0 2px 5px rgba(121, 86, 201, 0.12)",
            }}
          >
            <Calendar size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#24213A",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Festivals &amp; Events Management
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#777184",
                margin: "4px 0 0 0",
              }}
            >
              Manage festivals, national holidays, religious occasions, business events and yearly celebration content across Post Hub.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {/* Calendar View Button */}
          <button
            type="button"
            onClick={onCalendarViewClick}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 15px",
              borderRadius: "10px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <Calendar size={15} color="#7956C9" />
            <span>Calendar View</span>
          </button>

          {/* Import Events Button */}
          <button
            type="button"
            onClick={onImportEvents}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 15px",
              borderRadius: "10px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <Upload size={15} color="#7956C9" />
            <span>Import Events</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={onExportEvents}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 15px",
              borderRadius: "10px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
          >
            <Download size={15} color="#7956C9" />
            <span>Export</span>
          </button>

          {/* + Add New Event Button */}
          <button
            type="button"
            onClick={onAddNewEvent}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "10px",
              fontSize: "12.5px",
              fontWeight: 600,
              backgroundColor: "#7956C9",
              color: "#FFFFFF",
              border: "1px solid #7956C9",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(121, 86, 201, 0.35)",
              transition: "all 0.15s ease",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* Sub-screens Navigation Ribbon */}
      <FestivalSubscreenNav />
    </div>
  );
};
