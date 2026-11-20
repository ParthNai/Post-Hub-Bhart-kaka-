"use client";

import React from "react";
import { TemplateSlotZone } from "@/lib/templates";

export type BottomKind = "only_bottom" | "bottom_with_frame";

export interface BottomPresetItem {
  id: string;
  name: string;
  kind: BottomKind;
  tag: "Corporate" | "Festive" | "Political" | "Minimal" | "Tech" | "Luxury";
  description: string;
  accentColor: string;
  previewSvg: (primaryColor?: string, accentColor?: string) => React.ReactNode;
  generateZones: (options?: {
    startY?: number;
    avatarSide?: "left" | "right" | "none";
    primaryColor?: string;
    accentColor?: string;
  }) => TemplateSlotZone[];
}

/**
 * Checks if a slot zone belongs to an applied bottom strip or framing set
 */
export function isZoneFromBottomOrFrame(zone: TemplateSlotZone): boolean {
  if (zone.isBottomZone) return true;
  if (zone.frameGroupId) return true;
  const label = (zone.label || "").toLowerCase();
  const id = (zone.id || "").toLowerCase();
  return (
    id.includes("bottom") ||
    id.includes("frame-") ||
    id.includes("zone-bar-") ||
    label.includes("bottom") ||
    label.includes("footer") ||
    label.includes("frame") ||
    label.includes("contact bar") ||
    label.includes("contact footer")
  );
}

/**
 * Removes all existing bottom footer and frame zones from the template
 */
export function stripExistingBottomZones(zones: TemplateSlotZone[]): TemplateSlotZone[] {
  return zones.filter((z) => !isZoneFromBottomOrFrame(z));
}

export const BOTTOMS_AND_FRAMES_CATALOG: BottomPresetItem[] = [
  // =========================================================================
  // CATEGORY 1: "THE ONLY BOTTOMS" (Footer branding strips without outer frame)
  // =========================================================================
  {
    id: "bottom-corp-pill",
    name: "Corporate Pro Pill Bottom",
    kind: "only_bottom",
    tag: "Corporate",
    description: "Dark navy pill footer with glowing cyan ring avatar and structured contact badges.",
    accentColor: "#38BDF8",
    previewSvg: (primary = "#0F172A", accent = "#38BDF8") => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        <rect x="10" y="78" width="140" height="24" rx="12" fill={primary} stroke={accent} strokeWidth="1" />
        <circle cx="23" cy="90" r="8" fill="#334155" stroke={accent} strokeWidth="1.5" />
        <rect x="36" y="84" width="34" height="4.5" rx="1" fill="#FFFFFF" />
        <rect x="36" y="91" width="26" height="3.5" rx="1" fill="#94A3B8" />
        <rect x="85" y="88" width="28" height="4" rx="1" fill={accent} />
        <rect x="118" y="88" width="26" height="4" rx="1" fill="#E2E8F0" />
      </svg>
    ),
    generateZones: (opts) => {
      const startY = opts?.startY ?? 88.5;
      const primary = opts?.primaryColor ?? "#0F172A";
      const accent = opts?.accentColor ?? "#38BDF8";
      const avatarSide = opts?.avatarSide ?? "left";
      const timestamp = Date.now().toString(36);
      const groupId = `bottom-pill-${timestamp}`;

      const avatarX = avatarSide === "right" ? 84 : 4.5;
      const textX = avatarSide === "right" ? 8 : 17;

      return [
        {
          id: `zone-bottom-bg-${timestamp}`,
          type: "shape",
          label: "Corporate Pill Footer",
          shapeType: "pill",
          x: 3,
          y: startY,
          width: 94,
          height: 9,
          backgroundColor: primary,
          borderColor: accent,
          borderWidth: 1.5,
          borderRadius: 999,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        ...(avatarSide !== "none"
          ? [
              {
                id: `zone-bottom-avatar-${timestamp}`,
                type: "photo" as const,
                label: "User Avatar Ring",
                photoShape: "circle" as const,
                x: avatarX,
                y: startY - 1.2,
                width: 10.5,
                height: 10.5,
                borderColor: accent,
                borderWidth: 2.5,
                shadow: true,
                zIndex: 4,
                isBottomZone: true,
                frameGroupId: groupId,
              },
            ]
          : []),
        {
          id: `zone-bottom-name-${timestamp}`,
          type: "text",
          label: "Full Name",
          textBinding: "name",
          x: textX,
          y: startY + 1.2,
          width: 32,
          height: 4,
          fontSize: 13,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-bottom-desig-${timestamp}`,
          type: "text",
          label: "Designation / Role",
          textBinding: "designation",
          x: textX,
          y: startY + 5.2,
          width: 32,
          height: 3.2,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#94A3B8",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-bottom-phone-${timestamp}`,
          type: "text",
          label: "Phone Contact",
          textBinding: "phone",
          x: avatarSide === "right" ? 44 : 52,
          y: startY + 2.6,
          width: 22,
          height: 4,
          fontSize: 10.5,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: accent,
          alignment: "center",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-bottom-biz-${timestamp}`,
          type: "text",
          label: "Company / Website",
          textBinding: "business",
          x: avatarSide === "right" ? 68 : 74,
          y: startY + 2.6,
          width: 21,
          height: 4,
          fontSize: 10,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#E2E8F0",
          alignment: "center",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "bottom-festive-royal",
    name: "Royal Festive Gold Bottom",
    kind: "only_bottom",
    tag: "Festive",
    description: "Deep crimson & royal gold bar with decorative gold borders and warm Hindi/English typography.",
    accentColor: "#F59E0B",
    previewSvg: (primary = "#78102A", accent = "#F59E0B") => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        <rect x="8" y="76" width="144" height="26" rx="4" fill={primary} stroke={accent} strokeWidth="1.5" />
        <circle cx="24" cy="89" r="9" fill="#991B1B" stroke="#FEF08A" strokeWidth="2" />
        <rect x="38" y="82" width="40" height="5" rx="1" fill="#FEF08A" />
        <rect x="38" y="90" width="30" height="4" rx="1" fill="#FFFFFF" />
        <rect x="100" y="84" width="45" height="4.5" rx="1" fill="#FDE68A" />
        <rect x="100" y="91" width="45" height="4" rx="1" fill="#FEE2E2" />
      </svg>
    ),
    generateZones: (opts) => {
      const startY = opts?.startY ?? 87;
      const primary = opts?.primaryColor ?? "#78102A";
      const accent = opts?.accentColor ?? "#F59E0B";
      const timestamp = Date.now().toString(36);
      const groupId = `bottom-festive-${timestamp}`;

      return [
        {
          id: `zone-festive-bg-${timestamp}`,
          type: "shape",
          label: "Festive Gold Footer Bar",
          shapeType: "rectangle",
          x: 2,
          y: startY,
          width: 96,
          height: 10.5,
          backgroundColor: primary,
          borderColor: accent,
          borderWidth: 2,
          borderRadius: 8,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-festive-avatar-${timestamp}`,
          type: "photo",
          label: "Avatar Golden Ring",
          photoShape: "circle",
          x: 4.5,
          y: startY - 1.8,
          width: 12,
          height: 12,
          borderColor: "#FEF08A",
          borderWidth: 3,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-festive-name-${timestamp}`,
          type: "text",
          label: "Festive Name",
          textBinding: "name",
          x: 18,
          y: startY + 1.2,
          width: 38,
          height: 4.5,
          fontSize: 14,
          fontWeight: "800",
          fontFamily: "Rozha One",
          color: "#FEF08A",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-festive-sub-${timestamp}`,
          type: "text",
          label: "Festival Subheadline",
          textBinding: "designation",
          x: 18,
          y: startY + 5.8,
          width: 38,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-festive-phone-${timestamp}`,
          type: "text",
          label: "Phone / Contact",
          textBinding: "phone",
          x: 58,
          y: startY + 1.8,
          width: 38,
          height: 4,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FDE68A",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-festive-biz-${timestamp}`,
          type: "text",
          label: "Business / Social Handle",
          textBinding: "business",
          x: 58,
          y: startY + 6,
          width: 38,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "bottom-political-tricolor",
    name: "Political Leader Tricolor Bottom",
    kind: "only_bottom",
    tag: "Political",
    description: "Saffron-white-green tricolor banner with cutout candidate photo slot and party designation.",
    accentColor: "#FF9933",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        <rect x="0" y="74" width="160" height="3" fill="#FF9933" />
        <rect x="0" y="77" width="160" height="28" fill="#FFFFFF" />
        <rect x="0" y="105" width="160" height="5" fill="#138808" />
        <path d="M12 70 C12 60 22 55 26 55 C30 55 40 60 40 70 L40 100 L12 100 Z" fill="#E2E8F0" />
        <rect x="46" y="82" width="50" height="6" rx="1" fill="#000080" />
        <rect x="46" y="91" width="40" height="4.5" rx="1" fill="#E65100" />
        <rect x="110" y="85" width="44" height="4.5" rx="1" fill="#138808" />
        <rect x="110" y="92" width="44" height="4" rx="1" fill="#64748B" />
      </svg>
    ),
    generateZones: (opts) => {
      const startY = opts?.startY ?? 86;
      const timestamp = Date.now().toString(36);
      const groupId = `bottom-political-${timestamp}`;

      return [
        {
          id: `zone-pol-saffron-${timestamp}`,
          type: "shape",
          label: "Saffron Top Accent",
          shapeType: "bar",
          x: 0,
          y: startY,
          width: 100,
          height: 1.2,
          backgroundColor: "#FF9933",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-pol-white-${timestamp}`,
          type: "shape",
          label: "Tricolor White Base",
          shapeType: "rectangle",
          x: 0,
          y: startY + 1.2,
          width: 100,
          height: 10.8,
          backgroundColor: "#FFFFFF",
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-pol-green-${timestamp}`,
          type: "shape",
          label: "Green Bottom Border",
          shapeType: "bar",
          x: 0,
          y: startY + 12,
          width: 100,
          height: 2,
          backgroundColor: "#138808",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-pol-cutout-${timestamp}`,
          type: "photo",
          label: "Candidate Cutout Photo",
          photoShape: "cutout",
          featherBottom: true,
          x: 2,
          y: startY - 14,
          width: 25,
          height: 26,
          zIndex: 5,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-pol-name-${timestamp}`,
          type: "text",
          label: "Candidate Name",
          textBinding: "name",
          x: 28,
          y: startY + 2,
          width: 44,
          height: 4.5,
          fontSize: 14,
          fontWeight: "800",
          fontFamily: "Yatra One",
          color: "#000080",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-pol-desig-${timestamp}`,
          type: "text",
          label: "Political Designation",
          textBinding: "designation",
          x: 28,
          y: startY + 6.8,
          width: 44,
          height: 4,
          fontSize: 10.5,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#E65100",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-pol-phone-${timestamp}`,
          type: "text",
          label: "Contact Helpline",
          textBinding: "phone",
          x: 73,
          y: startY + 2.8,
          width: 25,
          height: 4,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#138808",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-pol-social-${timestamp}`,
          type: "text",
          label: "Social / Constituency",
          textBinding: "business",
          x: 73,
          y: startY + 7,
          width: 25,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#475569",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "bottom-minimal-card",
    name: "Minimal Clean White Card Bottom",
    kind: "only_bottom",
    tag: "Minimal",
    description: "Floating modern white card with smooth shadow, dark slate typography, and sleek rounded corners.",
    accentColor: "#2563EB",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#1E1A33" }}>
        <rect x="12" y="76" width="136" height="26" rx="6" fill="#FFFFFF" />
        <circle cx="26" cy="89" r="8" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
        <rect x="39" y="83" width="38" height="4.5" rx="1" fill="#0F172A" />
        <rect x="39" y="90" width="28" height="3.5" rx="1" fill="#64748B" />
        <rect x="94" y="86" width="46" height="4.5" rx="1" fill="#2563EB" />
      </svg>
    ),
    generateZones: (opts) => {
      const startY = opts?.startY ?? 88;
      const timestamp = Date.now().toString(36);
      const groupId = `bottom-min-${timestamp}`;

      return [
        {
          id: `zone-min-card-${timestamp}`,
          type: "shape",
          label: "Minimal White Card Base",
          shapeType: "card",
          x: 4,
          y: startY,
          width: 92,
          height: 9.5,
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          shadow: true,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.08)",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-min-avatar-${timestamp}`,
          type: "photo",
          label: "User Photo Circle",
          photoShape: "circle",
          x: 6.5,
          y: startY - 1.2,
          width: 10.5,
          height: 10.5,
          borderColor: "#0F172A",
          borderWidth: 2,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-min-name-${timestamp}`,
          type: "text",
          label: "Full Name",
          textBinding: "name",
          x: 19,
          y: startY + 1.5,
          width: 38,
          height: 4,
          fontSize: 13,
          fontWeight: "700",
          fontFamily: "Inter",
          color: "#0F172A",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-min-desig-${timestamp}`,
          type: "text",
          label: "Role / Subtitle",
          textBinding: "designation",
          x: 19,
          y: startY + 5.5,
          width: 38,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#64748B",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-min-phone-${timestamp}`,
          type: "text",
          label: "Phone / Channel",
          textBinding: "phone",
          x: 58,
          y: startY + 3,
          width: 35,
          height: 4,
          fontSize: 11,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#2563EB",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "bottom-glass-neon",
    name: "Dark Glassmorphic Neon Bottom",
    kind: "only_bottom",
    tag: "Tech",
    description: "Translucent frosted glass bar with purple neon border and squircle avatar cutout.",
    accentColor: "#A855F7",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#090D1A" }}>
        <rect x="8" y="76" width="144" height="26" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#A855F7" strokeWidth="1.5" />
        <rect x="18" y="82" width="14" height="14" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
        <rect x="38" y="82" width="42" height="4.5" rx="1" fill="#F3E8FF" />
        <rect x="38" y="89" width="32" height="3.5" rx="1" fill="#A78BFA" />
        <rect x="96" y="84" width="48" height="4" rx="1" fill="#38BDF8" />
        <rect x="96" y="90" width="48" height="3.5" rx="1" fill="#F472B6" />
      </svg>
    ),
    generateZones: (opts) => {
      const startY = opts?.startY ?? 87.5;
      const timestamp = Date.now().toString(36);
      const groupId = `bottom-glass-${timestamp}`;

      return [
        {
          id: `zone-glass-bar-${timestamp}`,
          type: "shape",
          label: "Frosted Glass Container",
          shapeType: "rectangle",
          x: 3,
          y: startY,
          width: 94,
          height: 10,
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          borderColor: "#A855F7",
          borderWidth: 1.5,
          borderRadius: 10,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-glass-avatar-${timestamp}`,
          type: "photo",
          label: "Avatar Squircle",
          photoShape: "squircle",
          x: 5,
          y: startY - 1.2,
          width: 11,
          height: 11,
          borderColor: "#38BDF8",
          borderWidth: 2,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-glass-name-${timestamp}`,
          type: "text",
          label: "Creator Name",
          textBinding: "name",
          x: 18,
          y: startY + 1.2,
          width: 42,
          height: 4,
          fontSize: 13,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#F3E8FF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-glass-desig-${timestamp}`,
          type: "text",
          label: "Role",
          textBinding: "designation",
          x: 18,
          y: startY + 5.5,
          width: 42,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#A78BFA",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-glass-phone-${timestamp}`,
          type: "text",
          label: "Direct Phone",
          textBinding: "phone",
          x: 62,
          y: startY + 1.8,
          width: 32,
          height: 3.8,
          fontSize: 10.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#38BDF8",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-glass-web-${timestamp}`,
          type: "text",
          label: "Website / Social",
          textBinding: "business",
          x: 62,
          y: startY + 5.8,
          width: 32,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#F472B6",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "bottom-dual-tier",
    name: "Dual-Tier Executive Bottom",
    kind: "only_bottom",
    tag: "Corporate",
    description: "Two-stage footer: upper colored band for Brand/Tagline + lower dark bar for all contact channels.",
    accentColor: "#3B82F6",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        <rect x="16" y="68" width="128" height="12" rx="3" fill="#2563EB" />
        <rect x="30" y="72" width="100" height="4" rx="1" fill="#FFFFFF" />
        <rect x="6" y="78" width="148" height="24" rx="4" fill="#0F172A" />
        <circle cx="20" cy="90" r="7.5" fill="#334155" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="32" y="85" width="40" height="4" rx="1" fill="#FFFFFF" />
        <rect x="32" y="91" width="30" height="3" rx="1" fill="#94A3B8" />
        <rect x="90" y="87" width="58" height="4.5" rx="1" fill="#38BDF8" />
      </svg>
    ),
    generateZones: (opts) => {
      const startY = opts?.startY ?? 83;
      const timestamp = Date.now().toString(36);
      const groupId = `bottom-dual-${timestamp}`;

      return [
        {
          id: `zone-tier-top-${timestamp}`,
          type: "shape",
          label: "Top Brand Ribbon",
          shapeType: "pill",
          x: 8,
          y: startY,
          width: 84,
          height: 5.5,
          backgroundColor: "#2563EB",
          borderRadius: 999,
          borderColor: "#60A5FA",
          borderWidth: 1,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-tier-brand-${timestamp}`,
          type: "text",
          label: "Company Headline",
          textBinding: "business",
          x: 10,
          y: startY + 0.8,
          width: 80,
          height: 4,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "center",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-tier-bottom-${timestamp}`,
          type: "shape",
          label: "Bottom Base Container",
          shapeType: "rectangle",
          x: 2,
          y: startY + 5.5,
          width: 96,
          height: 9.5,
          backgroundColor: "#0F172A",
          borderRadius: 8,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-tier-avatar-${timestamp}`,
          type: "photo",
          label: "Member Avatar",
          photoShape: "circle",
          x: 4.5,
          y: startY + 4.5,
          width: 10.5,
          height: 10.5,
          borderColor: "#FFFFFF",
          borderWidth: 2,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-tier-name-${timestamp}`,
          type: "text",
          label: "Executive Name",
          textBinding: "name",
          x: 17,
          y: startY + 6.8,
          width: 38,
          height: 4,
          fontSize: 12.5,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-tier-desig-${timestamp}`,
          type: "text",
          label: "Designation",
          textBinding: "designation",
          x: 17,
          y: startY + 10.8,
          width: 38,
          height: 3.2,
          fontSize: 9,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#94A3B8",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-tier-phone-${timestamp}`,
          type: "text",
          label: "Direct Phone",
          textBinding: "phone",
          x: 58,
          y: startY + 8.2,
          width: 38,
          height: 4,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#38BDF8",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "bottom-slim-social",
    name: "Compact Single-Line Social Bottom",
    kind: "only_bottom",
    tag: "Minimal",
    description: "Slim 6.5% height strip across the bottom with inline avatar, name, and contact on one sleek horizontal row.",
    accentColor: "#FACC15",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        <rect x="0" y="88" width="160" height="22" fill="#0A0A0F" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="14" cy="99" r="6" fill="#334155" stroke="#FFFFFF" strokeWidth="1" />
        <rect x="25" y="97" width="38" height="4" rx="1" fill="#FFFFFF" />
        <rect x="70" y="97" width="36" height="4" rx="1" fill="#38BDF8" />
        <rect x="114" y="97" width="38" height="4" rx="1" fill="#FACC15" />
      </svg>
    ),
    generateZones: (opts) => {
      const startY = opts?.startY ?? 93;
      const timestamp = Date.now().toString(36);
      const groupId = `bottom-slim-${timestamp}`;

      return [
        {
          id: `zone-slim-bar-${timestamp}`,
          type: "shape",
          label: "Slim Bottom Bar",
          shapeType: "rectangle",
          x: 0,
          y: startY,
          width: 100,
          height: 7,
          backgroundColor: "rgba(10, 10, 15, 0.94)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-slim-avatar-${timestamp}`,
          type: "photo",
          label: "Compact Avatar",
          photoShape: "circle",
          x: 2,
          y: startY + 0.5,
          width: 6,
          height: 6,
          borderColor: "#FFFFFF",
          borderWidth: 1.5,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-slim-name-${timestamp}`,
          type: "text",
          label: "Inline Name",
          textBinding: "name",
          x: 9,
          y: startY + 1.2,
          width: 30,
          height: 4.5,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-slim-phone-${timestamp}`,
          type: "text",
          label: "Inline Phone",
          textBinding: "phone",
          x: 41,
          y: startY + 1.2,
          width: 28,
          height: 4.5,
          fontSize: 10,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#38BDF8",
          alignment: "center",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-slim-biz-${timestamp}`,
          type: "text",
          label: "Inline Brand",
          textBinding: "business",
          x: 71,
          y: startY + 1.2,
          width: 27,
          height: 4.5,
          fontSize: 10,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#FACC15",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },

  // =========================================================================
  // CATEGORY 2: "BOTTOMS WITH FRAMES" (Full poster frames + integrated bottom)
  // =========================================================================
  {
    id: "frame-royal-gold",
    name: "Royal Gold Ornate Frame + Bottom",
    kind: "bottom_with_frame",
    tag: "Festive",
    description: "Gold dual-line outer border wrapping the whole poster, with top ceremonial badge and gold bottom footer.",
    accentColor: "#F59E0B",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        {/* Outer border */}
        <rect x="5" y="5" width="150" height="100" rx="3" fill="none" stroke="#D97706" strokeWidth="2" />
        <rect x="8" y="8" width="144" height="94" rx="2" fill="none" stroke="#FDE68A" strokeWidth="1" />
        {/* Top header badge */}
        <rect x="48" y="6" width="64" height="9" rx="4.5" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
        <rect x="58" y="8.5" width="44" height="4" rx="1" fill="#FEF08A" />
        {/* Bottom integrated bar */}
        <rect x="6" y="78" width="148" height="24" rx="4" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
        <circle cx="22" cy="90" r="8" fill="#991B1B" stroke="#FEF08A" strokeWidth="2" />
        <rect x="36" y="84" width="42" height="4.5" rx="1" fill="#FEF08A" />
        <rect x="36" y="91" width="32" height="3.5" rx="1" fill="#FFFFFF" />
        <rect x="100" y="86" width="48" height="4" rx="1" fill="#FDE68A" />
      </svg>
    ),
    generateZones: (opts) => {
      const timestamp = Date.now().toString(36);
      const groupId = `frame-gold-${timestamp}`;
      const startY = opts?.startY ?? 86;

      return [
        // Outer decorative gold border
        {
          id: `zone-frame-outer-${timestamp}`,
          type: "shape",
          label: "Gold Frame Outer Border",
          shapeType: "rectangle",
          x: 2.5,
          y: 2,
          width: 95,
          height: 96,
          backgroundColor: "transparent",
          borderColor: "#D97706",
          borderWidth: 2.5,
          borderRadius: 4,
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Inner thin accent line
        {
          id: `zone-frame-inner-${timestamp}`,
          type: "shape",
          label: "Gold Frame Inner Accent",
          shapeType: "rectangle",
          x: 4,
          y: 3.5,
          width: 92,
          height: 93,
          backgroundColor: "transparent",
          borderColor: "#FDE68A",
          borderWidth: 1,
          borderRadius: 2,
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Top ceremonial arch badge
        {
          id: `zone-frame-top-arch-${timestamp}`,
          type: "shape",
          label: "Top Ornate Greeting Arch",
          shapeType: "pill",
          x: 28,
          y: 2.2,
          width: 44,
          height: 4.5,
          backgroundColor: "#78350F",
          borderColor: "#F59E0B",
          borderWidth: 1.5,
          borderRadius: 999,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-frame-top-text-${timestamp}`,
          type: "text",
          label: "Greeting Slogan",
          customText: "✨ हार्दिक शुभकामनाएँ ✨",
          textBinding: "custom",
          x: 30,
          y: 2.5,
          width: 40,
          height: 4,
          fontSize: 10,
          fontWeight: "700",
          fontFamily: "Rozha One",
          color: "#FEF08A",
          alignment: "center",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Integrated Royal Gold Bottom Footer Bar
        {
          id: `zone-frame-bottom-bar-${timestamp}`,
          type: "shape",
          label: "Royal Gold Footer Base",
          shapeType: "rectangle",
          x: 3.5,
          y: startY,
          width: 93,
          height: 11.5,
          backgroundColor: "#78350F",
          borderColor: "#F59E0B",
          borderWidth: 2,
          borderRadius: 8,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Avatar circle with gold ring
        {
          id: `zone-frame-avatar-${timestamp}`,
          type: "photo",
          label: "Golden Ring Photo",
          photoShape: "circle",
          x: 5.5,
          y: startY - 1.8,
          width: 12.5,
          height: 12.5,
          borderColor: "#FEF08A",
          borderWidth: 3,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Name
        {
          id: `zone-frame-name-${timestamp}`,
          type: "text",
          label: "Full Name",
          textBinding: "name",
          x: 20,
          y: startY + 1.5,
          width: 44,
          height: 4.5,
          fontSize: 14,
          fontWeight: "800",
          fontFamily: "Rozha One",
          color: "#FEF08A",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Designation
        {
          id: `zone-frame-desig-${timestamp}`,
          type: "text",
          label: "Role",
          textBinding: "designation",
          x: 20,
          y: startY + 6.2,
          width: 44,
          height: 3.5,
          fontSize: 10,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Phone
        {
          id: `zone-frame-phone-${timestamp}`,
          type: "text",
          label: "Phone Contact",
          textBinding: "phone",
          x: 65,
          y: startY + 2,
          width: 30,
          height: 4,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FDE68A",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Business
        {
          id: `zone-frame-biz-${timestamp}`,
          type: "text",
          label: "Company / Location",
          textBinding: "business",
          x: 65,
          y: startY + 6.5,
          width: 30,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "frame-corporate-modern",
    name: "Modern Corporate Border Frame + Bottom",
    kind: "bottom_with_frame",
    tag: "Corporate",
    description: "Architectural 3-sided border framing the poster (top, left, right) flowing into a solid dark corporate footer.",
    accentColor: "#3B82F6",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        {/* 3-sided frame */}
        <polyline points="10,76 10,8 150,8 150,76" fill="none" stroke="#3B82F6" strokeWidth="2" />
        <rect x="110" y="12" width="34" height="8" rx="2" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1" />
        <rect x="114" y="14.5" width="26" height="3" rx="1" fill="#93C5FD" />
        {/* Bottom solid bar */}
        <rect x="0" y="76" width="160" height="34" fill="#0F172A" stroke="#3B82F6" strokeWidth="1.5" />
        <circle cx="22" cy="92" r="9" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
        <rect x="38" y="85" width="45" height="5" rx="1" fill="#FFFFFF" />
        <rect x="38" y="93" width="35" height="4" rx="1" fill="#94A3B8" />
        <rect x="104" y="87" width="48" height="4.5" rx="1" fill="#38BDF8" />
        <rect x="104" y="94" width="48" height="4" rx="1" fill="#E2E8F0" />
      </svg>
    ),
    generateZones: (opts) => {
      const timestamp = Date.now().toString(36);
      const groupId = `frame-corp-${timestamp}`;
      const startY = opts?.startY ?? 86.5;

      return [
        // Top border line
        {
          id: `zone-corp-top-${timestamp}`,
          type: "shape",
          label: "Corporate Frame Top Border",
          shapeType: "bar",
          x: 3,
          y: 2.5,
          width: 94,
          height: 0.8,
          backgroundColor: "#3B82F6",
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Left border line
        {
          id: `zone-corp-left-${timestamp}`,
          type: "shape",
          label: "Corporate Frame Left Line",
          shapeType: "bar",
          x: 3,
          y: 2.5,
          width: 0.8,
          height: startY - 2.5,
          backgroundColor: "#3B82F6",
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Right border line
        {
          id: `zone-corp-right-${timestamp}`,
          type: "shape",
          label: "Corporate Frame Right Line",
          shapeType: "bar",
          x: 96.2,
          y: 2.5,
          width: 0.8,
          height: startY - 2.5,
          backgroundColor: "#3B82F6",
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Top right official badge
        {
          id: `zone-corp-badge-${timestamp}`,
          type: "shape",
          label: "Official Verified Badge",
          shapeType: "badge",
          x: 75,
          y: 3.5,
          width: 19,
          height: 4.5,
          backgroundColor: "#1E3A8A",
          borderColor: "#60A5FA",
          borderWidth: 1,
          borderRadius: 4,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-corp-badgetext-${timestamp}`,
          type: "text",
          label: "Badge Label",
          customText: "★ VERIFIED",
          textBinding: "custom",
          x: 76,
          y: 4,
          width: 17,
          height: 3.5,
          fontSize: 9,
          fontWeight: "700",
          fontFamily: "Inter",
          color: "#93C5FD",
          alignment: "center",
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Full width dark footer bar
        {
          id: `zone-corp-footer-bg-${timestamp}`,
          type: "shape",
          label: "Full-Width Corporate Footer",
          shapeType: "rectangle",
          x: 0,
          y: startY,
          width: 100,
          height: 100 - startY,
          backgroundColor: "#0F172A",
          borderColor: "#3B82F6",
          borderWidth: 2,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Avatar circle
        {
          id: `zone-corp-avatar-${timestamp}`,
          type: "photo",
          label: "Executive Avatar",
          photoShape: "circle",
          x: 4,
          y: startY - 2,
          width: 12.5,
          height: 12.5,
          borderColor: "#38BDF8",
          borderWidth: 3,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Name
        {
          id: `zone-corp-name-${timestamp}`,
          type: "text",
          label: "Full Name",
          textBinding: "name",
          x: 19,
          y: startY + 1.5,
          width: 44,
          height: 4.5,
          fontSize: 14,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Designation
        {
          id: `zone-corp-desig-${timestamp}`,
          type: "text",
          label: "Designation",
          textBinding: "designation",
          x: 19,
          y: startY + 6.2,
          width: 44,
          height: 3.8,
          fontSize: 10,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#94A3B8",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Phone
        {
          id: `zone-corp-phone-${timestamp}`,
          type: "text",
          label: "Phone Contact",
          textBinding: "phone",
          x: 65,
          y: startY + 2,
          width: 32,
          height: 4,
          fontSize: 11,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#38BDF8",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Business
        {
          id: `zone-corp-biz-${timestamp}`,
          type: "text",
          label: "Company / Domain",
          textBinding: "business",
          x: 65,
          y: startY + 6.5,
          width: 32,
          height: 3.8,
          fontSize: 10,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#E2E8F0",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "frame-tricolor-nationalist",
    name: "Tricolor Nationalist Frame + Bottom",
    kind: "bottom_with_frame",
    tag: "Political",
    description: "Saffron top ribbon, vertical tricolor borders, top patriotism slogan badge, and bottom candidate bar.",
    accentColor: "#FF9933",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        {/* Top ribbon */}
        <rect x="0" y="0" width="160" height="4" fill="#FF9933" />
        <rect x="2" y="4" width="2" height="72" fill="#FF9933" />
        <rect x="156" y="4" width="2" height="72" fill="#138808" />
        {/* Top center slogan */}
        <rect x="44" y="6" width="72" height="8" rx="4" fill="#000080" />
        <rect x="52" y="8" width="56" height="4" rx="1" fill="#FFFFFF" />
        {/* Bottom full footer */}
        <rect x="0" y="76" width="160" height="34" fill="#FFFFFF" stroke="#138808" strokeWidth="2" />
        <path d="M6 72 C6 62 16 57 20 57 C24 57 34 62 34 72 L34 105 L6 105 Z" fill="#E2E8F0" />
        <rect x="42" y="82" width="54" height="6" rx="1" fill="#000080" />
        <rect x="42" y="91" width="44" height="4.5" rx="1" fill="#E65100" />
        <rect x="108" y="84" width="48" height="4.5" rx="1" fill="#138808" />
        <rect x="108" y="91" width="48" height="4" rx="1" fill="#475569" />
      </svg>
    ),
    generateZones: (opts) => {
      const timestamp = Date.now().toString(36);
      const groupId = `frame-tricolor-${timestamp}`;
      const startY = opts?.startY ?? 86;

      return [
        // Saffron top banner
        {
          id: `zone-tri-top-${timestamp}`,
          type: "shape",
          label: "Saffron Top Header Banner",
          shapeType: "bar",
          x: 0,
          y: 0,
          width: 100,
          height: 2.5,
          backgroundColor: "#FF9933",
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Left border
        {
          id: `zone-tri-left-${timestamp}`,
          type: "shape",
          label: "Left Frame Accent",
          shapeType: "bar",
          x: 1.5,
          y: 2.5,
          width: 0.8,
          height: startY - 2.5,
          backgroundColor: "#FF9933",
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Right green border
        {
          id: `zone-tri-right-${timestamp}`,
          type: "shape",
          label: "Right Frame Accent",
          shapeType: "bar",
          x: 97.7,
          y: 2.5,
          width: 0.8,
          height: startY - 2.5,
          backgroundColor: "#138808",
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Top center slogan pill
        {
          id: `zone-tri-pill-${timestamp}`,
          type: "shape",
          label: "Top Slogan Pill",
          shapeType: "pill",
          x: 22,
          y: 3.5,
          width: 56,
          height: 4.5,
          backgroundColor: "rgba(0,0,128,0.92)",
          borderColor: "#FFFFFF",
          borderWidth: 1.5,
          borderRadius: 999,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-tri-slogan-${timestamp}`,
          type: "text",
          label: "National Slogan",
          customText: "🇮🇳 जय हिन्द • जय भारत 🇮🇳",
          textBinding: "custom",
          x: 24,
          y: 4,
          width: 52,
          height: 3.5,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Yatra One",
          color: "#FFFFFF",
          alignment: "center",
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Bottom White Base with Green Border
        {
          id: `zone-tri-footer-${timestamp}`,
          type: "shape",
          label: "Bottom Leader Banner",
          shapeType: "rectangle",
          x: 0,
          y: startY,
          width: 100,
          height: 100 - startY,
          backgroundColor: "#FFFFFF",
          borderColor: "#138808",
          borderWidth: 3,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Leader Cutout Photo
        {
          id: `zone-tri-leader-${timestamp}`,
          type: "photo",
          label: "Leader Cutout",
          photoShape: "cutout",
          featherBottom: true,
          x: 2,
          y: startY - 15,
          width: 26,
          height: 29,
          zIndex: 5,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Candidate Name
        {
          id: `zone-tri-name-${timestamp}`,
          type: "text",
          label: "Leader Name",
          textBinding: "name",
          x: 30,
          y: startY + 2,
          width: 44,
          height: 4.5,
          fontSize: 15,
          fontWeight: "800",
          fontFamily: "Yatra One",
          color: "#000080",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Designation
        {
          id: `zone-tri-desig-${timestamp}`,
          type: "text",
          label: "Leader Post",
          textBinding: "designation",
          x: 30,
          y: startY + 7,
          width: 44,
          height: 4,
          fontSize: 10.5,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#E65100",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Phone
        {
          id: `zone-tri-phone-${timestamp}`,
          type: "text",
          label: "Phone / Helpline",
          textBinding: "phone",
          x: 74,
          y: startY + 2.8,
          width: 24,
          height: 4,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#138808",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Social
        {
          id: `zone-tri-social-${timestamp}`,
          type: "text",
          label: "Constituency",
          textBinding: "business",
          x: 74,
          y: startY + 7,
          width: 24,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#334155",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "frame-festive-mandala",
    name: "Festive Mandala Floral Frame + Bottom",
    kind: "bottom_with_frame",
    tag: "Festive",
    description: "Traditional corner flourishes, perimeter border, top festive banner, and vermilion bottom footer.",
    accentColor: "#EA580C",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#13111E" }}>
        <rect x="6" y="6" width="148" height="98" rx="4" fill="none" stroke="#EA580C" strokeWidth="1.5" />
        <rect x="8" y="8" width="18" height="12" fill="rgba(234, 88, 12, 0.25)" stroke="#FBBF24" strokeWidth="1" />
        <rect x="134" y="8" width="18" height="12" fill="rgba(234, 88, 12, 0.25)" stroke="#FBBF24" strokeWidth="1" />
        <rect x="8" y="78" width="144" height="24" rx="4" fill="#881337" stroke="#F59E0B" strokeWidth="1.5" />
        <circle cx="24" cy="90" r="8" fill="#991B1B" stroke="#FDE68A" strokeWidth="2" />
        <rect x="38" y="84" width="44" height="4.5" rx="1" fill="#FEF08A" />
        <rect x="38" y="91" width="34" height="3.5" rx="1" fill="#FFFFFF" />
        <rect x="100" y="86" width="46" height="4" rx="1" fill="#FEF08A" />
      </svg>
    ),
    generateZones: (opts) => {
      const timestamp = Date.now().toString(36);
      const groupId = `frame-mandala-${timestamp}`;
      const startY = opts?.startY ?? 86.5;

      return [
        // Perimeter frame
        {
          id: `zone-mandala-frame-${timestamp}`,
          type: "shape",
          label: "Mandala Frame Perimeter",
          shapeType: "rectangle",
          x: 2.5,
          y: 2.5,
          width: 95,
          height: 95,
          backgroundColor: "transparent",
          borderColor: "#EA580C",
          borderWidth: 2,
          borderRadius: 8,
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Top-Left corner bracket
        {
          id: `zone-mandala-c1-${timestamp}`,
          type: "shape",
          label: "Top-Left Corner Motif",
          shapeType: "card",
          x: 3,
          y: 3,
          width: 14,
          height: 8,
          backgroundColor: "rgba(234, 88, 12, 0.15)",
          borderColor: "#FBBF24",
          borderWidth: 1.5,
          borderRadius: 4,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Top-Right corner bracket
        {
          id: `zone-mandala-c2-${timestamp}`,
          type: "shape",
          label: "Top-Right Corner Motif",
          shapeType: "card",
          x: 83,
          y: 3,
          width: 14,
          height: 8,
          backgroundColor: "rgba(234, 88, 12, 0.15)",
          borderColor: "#FBBF24",
          borderWidth: 1.5,
          borderRadius: 4,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Bottom Festive Vermilion Footer
        {
          id: `zone-mandala-bottom-${timestamp}`,
          type: "shape",
          label: "Festive Vermilion Footer",
          shapeType: "rectangle",
          x: 3,
          y: startY,
          width: 94,
          height: 11,
          backgroundColor: "#881337",
          borderColor: "#F59E0B",
          borderWidth: 2,
          borderRadius: 8,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Avatar circle
        {
          id: `zone-mandala-avatar-${timestamp}`,
          type: "photo",
          label: "Avatar Golden Ring",
          photoShape: "circle",
          x: 5,
          y: startY - 2,
          width: 12.5,
          height: 12.5,
          borderColor: "#FDE68A",
          borderWidth: 3,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Name
        {
          id: `zone-mandala-name-${timestamp}`,
          type: "text",
          label: "Full Name",
          textBinding: "name",
          x: 20,
          y: startY + 1.5,
          width: 44,
          height: 4.5,
          fontSize: 14,
          fontWeight: "700",
          fontFamily: "Rozha One",
          color: "#FEF08A",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Designation
        {
          id: `zone-mandala-desig-${timestamp}`,
          type: "text",
          label: "Festival Subheadline",
          textBinding: "designation",
          x: 20,
          y: startY + 6.2,
          width: 44,
          height: 3.5,
          fontSize: 10,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#FFFFFF",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Phone
        {
          id: `zone-mandala-phone-${timestamp}`,
          type: "text",
          label: "Phone / Social",
          textBinding: "phone",
          x: 65,
          y: startY + 3.5,
          width: 30,
          height: 4,
          fontSize: 11,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#FEF08A",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "frame-cyber-neon",
    name: "Tech Cyber Neon Bracket Frame + Bottom",
    kind: "bottom_with_frame",
    tag: "Tech",
    description: "Futuristic corner brackets in cyan and magenta, neon border lines, and dark glass bottom bar.",
    accentColor: "#06B6D4",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#080B14" }}>
        {/* Corner Brackets */}
        <polyline points="20,6 6,6 6,20" fill="none" stroke="#06B6D4" strokeWidth="2.5" />
        <polyline points="140,6 154,6 154,20" fill="none" stroke="#D946EF" strokeWidth="2.5" />
        <rect x="8" y="8" width="144" height="94" rx="2" fill="none" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1" />
        {/* Cyber bottom */}
        <rect x="8" y="78" width="144" height="24" rx="4" fill="rgba(10, 15, 30, 0.9)" stroke="#06B6D4" strokeWidth="1.5" />
        <rect x="16" y="83" width="14" height="14" rx="3" fill="#1E293B" stroke="#06B6D4" strokeWidth="1.5" />
        <rect x="36" y="84" width="44" height="4.5" rx="1" fill="#38BDF8" />
        <rect x="36" y="91" width="34" height="3.5" rx="1" fill="#E2E8F0" />
        <rect x="96" y="86" width="50" height="4" rx="1" fill="#D946EF" />
      </svg>
    ),
    generateZones: (opts) => {
      const timestamp = Date.now().toString(36);
      const groupId = `frame-cyber-${timestamp}`;
      const startY = opts?.startY ?? 87;

      return [
        // Top-Left Cyan Bracket
        {
          id: `zone-cyber-c1-h-${timestamp}`,
          type: "shape",
          label: "Top-Left Neon Horizontal",
          shapeType: "bar",
          x: 2.5,
          y: 2.5,
          width: 15,
          height: 1.2,
          backgroundColor: "#06B6D4",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-cyber-c1-v-${timestamp}`,
          type: "shape",
          label: "Top-Left Neon Vertical",
          shapeType: "bar",
          x: 2.5,
          y: 2.5,
          width: 1,
          height: 12,
          backgroundColor: "#06B6D4",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Top-Right Magenta Bracket
        {
          id: `zone-cyber-c2-h-${timestamp}`,
          type: "shape",
          label: "Top-Right Neon Horizontal",
          shapeType: "bar",
          x: 82.5,
          y: 2.5,
          width: 15,
          height: 1.2,
          backgroundColor: "#D946EF",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        {
          id: `zone-cyber-c2-v-${timestamp}`,
          type: "shape",
          label: "Top-Right Neon Vertical",
          shapeType: "bar",
          x: 96.5,
          y: 2.5,
          width: 1,
          height: 12,
          backgroundColor: "#D946EF",
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Perimeter wire
        {
          id: `zone-cyber-perimeter-${timestamp}`,
          type: "shape",
          label: "Cyber Wire Frame",
          shapeType: "rectangle",
          x: 2.5,
          y: 2.5,
          width: 95,
          height: 95,
          backgroundColor: "transparent",
          borderColor: "rgba(6, 182, 212, 0.35)",
          borderWidth: 1,
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Dark Glass Cyber Footer
        {
          id: `zone-cyber-footer-${timestamp}`,
          type: "shape",
          label: "Dark Glass Cyber Base",
          shapeType: "rectangle",
          x: 2.5,
          y: startY,
          width: 95,
          height: 10.5,
          backgroundColor: "rgba(10, 15, 30, 0.92)",
          borderColor: "#06B6D4",
          borderWidth: 1.5,
          borderRadius: 6,
          shadow: true,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Avatar squircle
        {
          id: `zone-cyber-avatar-${timestamp}`,
          type: "photo",
          label: "Cyber Squircle Avatar",
          photoShape: "squircle",
          x: 4.5,
          y: startY - 1.5,
          width: 11.5,
          height: 11.5,
          borderColor: "#06B6D4",
          borderWidth: 2,
          shadow: true,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Name
        {
          id: `zone-cyber-name-${timestamp}`,
          type: "text",
          label: "Handle / Name",
          textBinding: "name",
          x: 18,
          y: startY + 1.2,
          width: 44,
          height: 4.5,
          fontSize: 13,
          fontWeight: "700",
          fontFamily: "Poppins",
          color: "#38BDF8",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Designation
        {
          id: `zone-cyber-desig-${timestamp}`,
          type: "text",
          label: "Tech Role",
          textBinding: "designation",
          x: 18,
          y: startY + 5.8,
          width: 44,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#E2E8F0",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Phone
        {
          id: `zone-cyber-phone-${timestamp}`,
          type: "text",
          label: "Phone Contact",
          textBinding: "phone",
          x: 64,
          y: startY + 1.8,
          width: 32,
          height: 4,
          fontSize: 10.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#D946EF",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Web
        {
          id: `zone-cyber-web-${timestamp}`,
          type: "text",
          label: "Tech Domain",
          textBinding: "business",
          x: 64,
          y: startY + 6,
          width: 32,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Poppins",
          color: "#38BDF8",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
  {
    id: "frame-luxury-minimal",
    name: "Luxury Minimal Double-Line Frame + Bottom",
    kind: "bottom_with_frame",
    tag: "Luxury",
    description: "Dual hairline border framing the poster with 12px inset and an integrated floating white bottom card.",
    accentColor: "#CBD5E1",
    previewSvg: () => (
      <svg viewBox="0 0 160 110" width="100%" height="80" style={{ borderRadius: 6, background: "#1E1A33" }}>
        <rect x="6" y="6" width="148" height="98" fill="none" stroke="#CBD5E1" strokeWidth="1.2" />
        <rect x="9" y="9" width="142" height="92" fill="none" stroke="rgba(203, 213, 225, 0.45)" strokeWidth="0.8" />
        <rect x="12" y="78" width="136" height="22" rx="4" fill="#FFFFFF" />
        <circle cx="24" cy="89" r="7.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
        <rect x="38" y="84" width="40" height="4" rx="1" fill="#0F172A" />
        <rect x="38" y="90" width="30" height="3" rx="1" fill="#64748B" />
        <rect x="96" y="86" width="48" height="4" rx="1" fill="#0F172A" />
      </svg>
    ),
    generateZones: (opts) => {
      const timestamp = Date.now().toString(36);
      const groupId = `frame-lux-${timestamp}`;
      const startY = opts?.startY ?? 88;

      return [
        // Outer fine line
        {
          id: `zone-lux-outer-${timestamp}`,
          type: "shape",
          label: "Luxury Outer Border",
          shapeType: "rectangle",
          x: 2.5,
          y: 2,
          width: 95,
          height: 96,
          backgroundColor: "transparent",
          borderColor: "#CBD5E1",
          borderWidth: 1.5,
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Inner hairline
        {
          id: `zone-lux-inner-${timestamp}`,
          type: "shape",
          label: "Luxury Hairline Inset",
          shapeType: "rectangle",
          x: 4,
          y: 3.5,
          width: 92,
          height: 93,
          backgroundColor: "transparent",
          borderColor: "rgba(203, 213, 225, 0.45)",
          borderWidth: 0.8,
          zIndex: 1,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Floating bottom card
        {
          id: `zone-lux-card-${timestamp}`,
          type: "shape",
          label: "Floating Luxury Base",
          shapeType: "card",
          x: 4.5,
          y: startY,
          width: 91,
          height: 9.5,
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          shadow: true,
          borderColor: "#E2E8F0",
          borderWidth: 1,
          zIndex: 2,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Avatar circle
        {
          id: `zone-lux-avatar-${timestamp}`,
          type: "photo",
          label: "Luxury Photo Circle",
          photoShape: "circle",
          x: 6.5,
          y: startY - 1.2,
          width: 10.5,
          height: 10.5,
          borderColor: "#0F172A",
          borderWidth: 1.5,
          zIndex: 4,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Name
        {
          id: `zone-lux-name-${timestamp}`,
          type: "text",
          label: "Full Name",
          textBinding: "name",
          x: 19,
          y: startY + 1.5,
          width: 42,
          height: 4,
          fontSize: 13,
          fontWeight: "700",
          fontFamily: "Inter",
          color: "#0F172A",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Designation
        {
          id: `zone-lux-desig-${timestamp}`,
          type: "text",
          label: "Title",
          textBinding: "designation",
          x: 19,
          y: startY + 5.5,
          width: 42,
          height: 3.5,
          fontSize: 9.5,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#64748B",
          alignment: "left",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
        // Phone
        {
          id: `zone-lux-phone-${timestamp}`,
          type: "text",
          label: "Phone / Web",
          textBinding: "phone",
          x: 64,
          y: startY + 3,
          width: 30,
          height: 4,
          fontSize: 10.5,
          fontWeight: "600",
          fontFamily: "Inter",
          color: "#0F172A",
          alignment: "right",
          autoFitText: true,
          zIndex: 3,
          isBottomZone: true,
          frameGroupId: groupId,
        },
      ];
    },
  },
];
