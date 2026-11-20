"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Share2,
  Download,
  UserCheck,
  Sparkles,
  Wifi,
  Battery,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { TemplateSlotZone, TemplateFormat } from "@/lib/templates";
import { CurvedTextRenderer } from "./CurvedTextRenderer";

export interface MobilePersona {
  id: string;
  role: string;
  name: string;
  designation: string;
  phone: string;
  businessName: string;
  avatarUrl: string;
  partySymbol?: string;
}

export const SIMULATED_PERSONAS: MobilePersona[] = [
  {
    id: "persona-pol",
    role: "Political Leader",
    name: "विक्रमसिंह परमार",
    designation: "प्रदेश महामंत्री • समाजसेवी",
    phone: "+91 98765 43210",
    businessName: "गुजरात प्रदेश",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "persona-biz",
    role: "Business Owner",
    name: "अनन्या शर्मा",
    designation: "संस्थापक एवं निदेशक",
    phone: "+91 91234 56789",
    businessName: "शर्मा ज्वेलर्स & क्राफ्ट्स",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "persona-doc",
    role: "Medical Professional",
    name: "Dr. Rajesh Rao",
    designation: "Senior Cardiologist",
    phone: "+91 99887 76655",
    businessName: "Apex Heart & Life Care",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
  },
];

interface LiveMobileAppSimulatorProps {
  backgroundUrl: string;
  zones: TemplateSlotZone[];
  format: TemplateFormat;
  artworkAspectRatio: number | null;
}

export const LiveMobileAppSimulator: React.FC<LiveMobileAppSimulatorProps> = ({
  backgroundUrl,
  zones,
  format,
  artworkAspectRatio,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<MobilePersona>(SIMULATED_PERSONAS[0]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Aspect ratio calculation for the phone screen preview
  const canvasRatio = artworkAspectRatio && artworkAspectRatio > 0
    ? artworkAspectRatio
    : format === "3:4"
    ? 0.75
    : format === "4:5"
    ? 0.8
    : format === "1:1"
    ? 1.0
    : 0.5625; // 9:16

  const previewWidth = 240;
  const previewHeight = Math.round(previewWidth / canvasRatio);

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", padding: "14px" }}>
      {/* Persona Switcher Chips */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#1E1A33", display: "flex", alignItems: "center", gap: "5px" }}>
            <UserCheck size={14} color="#7956C9" />
            <span>Test Persona:</span>
          </span>
          <span style={{ fontSize: "11px", color: "#6E687A" }}>{selectedPersona.role}</span>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {SIMULATED_PERSONAS.map((p) => {
            const isCurrent = p.id === selectedPersona.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersona(p)}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: "8px",
                  border: isCurrent ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: isCurrent ? "#F4F0FB" : "#FFFFFF",
                  color: isCurrent ? "#543399" : "#6E687A",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.role.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Realistic Phone Device Mockup */}
      <div
        style={{
          width: "270px",
          margin: "0 auto",
          borderRadius: "38px",
          border: "8px solid #1E1A33",
          backgroundColor: "#0F172A",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Dynamic Island / Speaker Notch & Status Bar */}
        <div
          style={{
            height: "28px",
            backgroundColor: "#0F172A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            color: "#FFFFFF",
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          <span>9:41</span>
          <div
            style={{
              width: "56px",
              height: "12px",
              backgroundColor: "#000000",
              borderRadius: "999px",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Wifi size={10} />
            <Battery size={11} />
          </div>
        </div>

        {/* Mobile App Bar Header */}
        <div
          style={{
            height: "36px",
            backgroundColor: "#1E1A33",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            color: "#FFFFFF",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.5px" }}>POST HUB</span>
          <span
            style={{
              fontSize: "9.5px",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "rgba(121, 86, 201, 0.3)",
              color: "#D8B4FE",
              fontWeight: 700,
            }}
          >
            Flutter Preview
          </span>
        </div>

        {/* Phone Screen Canvas Container */}
        <div
          style={{
            backgroundColor: "#FAF7F2",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
              position: "relative",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
              background: `url(${backgroundUrl}) center center / 100% 100% no-repeat`,
            }}
          >
            {/* Render Slot Zones in Mobile Preview */}
            {zones
              .filter((z) => z.visible !== false)
              .map((zone) => {
                if (zone.type === "photo") {
                  const avatarSrc = selectedPersona.avatarUrl;
                  const isCutout = zone.photoShape === "cutout";

                  return (
                    <div
                      key={zone.id}
                      style={{
                        position: "absolute",
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        zIndex: zone.zIndex || 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={avatarSrc}
                        alt="User Portrait"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: isCutout ? "contain" : (zone.objectFit || "cover"),
                          borderRadius:
                            zone.photoShape === "circle"
                              ? "999px"
                              : zone.photoShape === "squircle"
                              ? "22%"
                              : "0",
                          border:
                            !isCutout && zone.borderWidth
                              ? `${Math.max(1, zone.borderWidth * 0.5)}px solid ${zone.borderColor || "#FFFFFF"}`
                              : "none",
                          maskImage:
                            zone.featherBottom && isCutout
                              ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                              : undefined,
                          WebkitMaskImage:
                            zone.featherBottom && isCutout
                              ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                              : undefined,
                        }}
                      />
                    </div>
                  );
                }

                if (zone.type === "text") {
                  let textVal = zone.customText || "Text Sample";
                  if (zone.textBinding === "name") textVal = selectedPersona.name;
                  else if (zone.textBinding === "designation") textVal = selectedPersona.designation;
                  else if (zone.textBinding === "phone") textVal = selectedPersona.phone;
                  else if (zone.textBinding === "business") textVal = selectedPersona.businessName;

                  const mobileFontSize = Math.max(7, Math.round((zone.fontSize || 13) * 0.7));

                  return (
                    <div
                      key={zone.id}
                      style={{
                        position: "absolute",
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        zIndex: zone.zIndex || 5,
                      }}
                    >
                      <CurvedTextRenderer
                        zone={{ ...zone, fontSize: mobileFontSize }}
                        displayText={textVal}
                      />
                    </div>
                  );
                }

                if (zone.type === "shape") {
                  return (
                    <div
                      key={zone.id}
                      style={{
                        position: "absolute",
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        zIndex: zone.zIndex || 2,
                        backgroundColor: zone.backgroundColor || "rgba(15, 23, 42, 0.75)",
                        borderRadius: zone.shapeType === "pill" ? "999px" : `${zone.borderRadius || 6}px`,
                        opacity: zone.opacity ?? 1,
                      }}
                    />
                  );
                }

                return null;
              })}
          </div>

          {/* Interactive Mobile CTA Buttons */}
          <div style={{ width: "100%", marginTop: "12px", display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleSimulateDownload}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                backgroundColor: downloadSuccess ? "#10B981" : "#7956C9",
                color: "#FFFFFF",
                border: "none",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                boxShadow: "0 2px 6px rgba(121, 86, 201, 0.3)",
              }}
            >
              <Download size={12} />
              <span>{downloadSuccess ? "Saved!" : "Download"}</span>
            </button>
            <button
              type="button"
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#25D366",
                color: "#FFFFFF",
                border: "none",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              title="Share on WhatsApp Status"
            >
              <Share2 size={12} />
            </button>
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div style={{ height: "16px", backgroundColor: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "72px", height: "3px", backgroundColor: "rgba(255,255,255,0.4)", borderRadius: "999px" }} />
        </div>
      </div>
    </div>
  );
};
