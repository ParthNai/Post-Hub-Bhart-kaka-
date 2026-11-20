"use client";

import React from "react";
import { Globe, X, MapPin } from "lucide-react";

interface RegionalCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionalCalendarModal: React.FC<RegionalCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const states = [
    { state: "Gujarat", events: 14, primaryLanguage: "Gujarati", status: "Active" },
    { state: "Maharashtra", events: 12, primaryLanguage: "Marathi", status: "Active" },
    { state: "Uttar Pradesh", events: 11, primaryLanguage: "Hindi", status: "Active" },
    { state: "Delhi (NCR)", events: 15, primaryLanguage: "Hindi / English", status: "Active" },
    { state: "Punjab", events: 9, primaryLanguage: "Punjabi", status: "Active" },
    { state: "Rajasthan", events: 10, primaryLanguage: "Hindi", status: "Active" },
    { state: "Karnataka", events: 8, primaryLanguage: "Kannada", status: "Active" },
  ];

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
          maxWidth: "620px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: "#F4EFFC",
                color: "#7956C9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#24213A", margin: 0 }}>
                Regional Calendar Configuration
              </h2>
              <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
                Active state calendar partitions and regional holiday coverage.
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

        {/* States Table */}
        <div style={{ overflowY: "auto", maxHeight: "360px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: "#FAF7F2", borderBottom: "1px solid #EAE4EE" }}>
                <th style={{ padding: "10px 14px", color: "#777184" }}>State / Region</th>
                <th style={{ padding: "10px 14px", color: "#777184" }}>Active Events</th>
                <th style={{ padding: "10px 14px", color: "#777184" }}>Primary Language</th>
                <th style={{ padding: "10px 14px", color: "#777184" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {states.map((st) => (
                <tr key={st.state} style={{ borderBottom: "1px solid #EAE4EE" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "#24213A" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={13} color="#7956C9" />
                      <span>{st.state}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#24213A" }}>{st.events}</td>
                  <td style={{ padding: "10px 14px", color: "#777184" }}>{st.primaryLanguage}</td>
                  <td style={{ padding: "10px 14px", color: "#10B981", fontWeight: 600 }}>● {st.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "13px",
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
