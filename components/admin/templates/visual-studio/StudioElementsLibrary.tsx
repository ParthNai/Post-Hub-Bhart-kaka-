"use client";

import React from "react";
import { TemplateSlotZone } from "@/lib/templates";

export interface StudioAssetItem {
  id: string;
  name: string;
  category: "party" | "festive" | "contact" | "badge" | "qr";
  svg: React.ReactNode;
  defaultZone: Partial<TemplateSlotZone>;
}

export const PARTY_AND_CULTURAL_ASSETS: StudioAssetItem[] = [
  // Political Party Symbols & Emblems
  {
    id: "asset-lotus",
    name: "Lotus (कमल)",
    category: "party",
    svg: (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <path d="M24 8 C22 16 14 22 14 30 C14 37 19 40 24 40 C29 40 34 37 34 30 C34 22 26 16 24 8 Z" fill="#FF7722" />
        <path d="M24 16 C23 24 18 28 18 34 C18 38 21 40 24 40 C27 40 30 38 30 34 C30 28 25 24 24 16 Z" fill="#FF9933" />
        <path d="M12 24 C8 28 6 34 8 38 C10 40 14 40 18 38 C14 32 12 28 12 24 Z" fill="#E65100" />
        <path d="M36 24 C40 28 42 34 40 38 C38 40 34 40 30 38 C34 32 36 28 36 24 Z" fill="#E65100" />
        <path d="M16 42 Q24 45 32 42" stroke="#138808" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    defaultZone: {
      type: "shape",
      label: "Party Symbol (Lotus)",
      iconType: "lotus",
      width: 14,
      height: 14,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 999,
      opacity: 1,
    },
  },
  {
    id: "asset-flag",
    name: "Indian Tricolor (तिरंगा)",
    category: "festive",
    svg: (
      <svg viewBox="0 0 48 32" width="30" height="20" fill="none">
        <rect width="48" height="10.6" fill="#FF9933" rx="2" />
        <rect y="10.6" width="48" height="10.6" fill="#FFFFFF" />
        <rect y="21.2" width="48" height="10.6" fill="#138808" rx="2" />
        <circle cx="24" cy="16" r="4.2" stroke="#000080" strokeWidth="1.2" fill="none" />
      </svg>
    ),
    defaultZone: {
      type: "shape",
      label: "Tricolor Flag Ribbon",
      iconType: "flag",
      width: 25,
      height: 6,
      backgroundColor: "transparent",
      borderRadius: 4,
    },
  },
  {
    id: "asset-diya",
    name: "Diwali Golden Diya (दीपक)",
    category: "festive",
    svg: (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <path d="M24 6 C21 12 19 16 19 20 C19 23 21 25 24 25 C27 25 29 23 29 20 C29 16 27 12 24 6 Z" fill="#FFA000" />
        <path d="M24 10 C22 14 21 16 21 19 C21 21 22 22 24 22 C26 22 27 21 27 19 C27 16 26 14 24 10 Z" fill="#FFEB3B" />
        <path d="M8 26 C12 36 36 36 40 26 C42 34 32 42 24 42 C16 42 6 34 8 26 Z" fill="#8D4004" />
        <ellipse cx="24" cy="27" rx="16" ry="4" fill="#E65100" />
      </svg>
    ),
    defaultZone: {
      type: "shape",
      label: "Golden Diya Accent",
      iconType: "diya",
      width: 15,
      height: 15,
      backgroundColor: "transparent",
    },
  },
  {
    id: "asset-ashoka",
    name: "Ashoka Chakra (चक्र)",
    category: "festive",
    svg: (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <circle cx="24" cy="24" r="18" stroke="#000088" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="3.5" fill="#000088" />
        <line x1="24" y1="6" x2="24" y2="42" stroke="#000088" strokeWidth="1" />
        <line x1="6" y1="24" x2="42" y2="24" stroke="#000088" strokeWidth="1" />
        <line x1="11" y1="11" x2="37" y2="37" stroke="#000088" strokeWidth="1" />
        <line x1="11" y1="37" x2="37" y2="11" stroke="#000088" strokeWidth="1" />
      </svg>
    ),
    defaultZone: {
      type: "shape",
      label: "Ashoka Chakra Badge",
      iconType: "party_symbol",
      width: 12,
      height: 12,
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: 999,
    },
  },
  {
    id: "asset-badge-verified",
    name: "Verified Leader Badge",
    category: "badge",
    svg: (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <circle cx="24" cy="24" r="20" fill="#1D9BF0" />
        <path d="M15 24 L21 30 L33 18" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    defaultZone: {
      type: "shape",
      label: "Verified Leader Mark",
      iconType: "party_symbol",
      width: 8,
      height: 8,
      backgroundColor: "transparent",
      borderRadius: 999,
    },
  },
  {
    id: "asset-qr-code",
    name: "Dynamic QR Code Slot",
    category: "qr",
    svg: (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <rect x="6" y="6" width="14" height="14" rx="2" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF" />
        <rect x="11" y="11" width="4" height="4" fill="#1E293B" />
        <rect x="28" y="6" width="14" height="14" rx="2" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF" />
        <rect x="33" y="11" width="4" height="4" fill="#1E293B" />
        <rect x="6" y="28" width="14" height="14" rx="2" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF" />
        <rect x="11" y="33" width="4" height="4" fill="#1E293B" />
        <circle cx="35" cy="35" r="5" fill="#7956C9" />
      </svg>
    ),
    defaultZone: {
      type: "shape",
      label: "Dynamic QR Code",
      iconType: "qr",
      width: 15,
      height: 15,
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      shadow: true,
    },
  },
];

/**
 * Creates a complete, pre-configured 4-item contact footer bar (Phone, Email, Location, Website)
 * with a dark pill backdrop and clean aligned text zones.
 */
export function createSmartContactBarZones(startY = 90): TemplateSlotZone[] {
  const timestamp = Date.now().toString(36);
  return [
    {
      id: `zone-bar-bg-${timestamp}`,
      type: "shape",
      label: "Footer Bar Background",
      x: 4,
      y: startY,
      width: 92,
      height: 7.5,
      shapeType: "pill",
      backgroundColor: "rgba(16, 43, 101, 0.92)",
      borderRadius: 999,
      opacity: 0.95,
      zIndex: 2,
    },
    {
      id: `zone-phone-${timestamp}`,
      type: "text",
      label: "Phone Contact",
      textBinding: "phone",
      x: 8,
      y: startY + 1.2,
      width: 25,
      height: 5,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: "Poppins",
      color: "#FFFFFF",
      alignment: "center",
      autoFitText: true,
      zIndex: 3,
    },
    {
      id: `zone-email-${timestamp}`,
      type: "text",
      label: "Email / Brand ID",
      textBinding: "custom",
      customText: "info@brand.com",
      x: 36,
      y: startY + 1.2,
      width: 28,
      height: 5,
      fontSize: 11,
      fontWeight: "600",
      fontFamily: "Inter",
      color: "#FACC15",
      alignment: "center",
      autoFitText: true,
      zIndex: 3,
    },
    {
      id: `zone-web-${timestamp}`,
      type: "text",
      label: "Website / Location",
      textBinding: "business",
      x: 67,
      y: startY + 1.2,
      width: 26,
      height: 5,
      fontSize: 11,
      fontWeight: "600",
      fontFamily: "Poppins",
      color: "#FFFFFF",
      alignment: "center",
      autoFitText: true,
      zIndex: 3,
    },
  ];
}
