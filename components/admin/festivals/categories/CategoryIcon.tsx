"use client";

import React from "react";
import {
  Flag,
  MapPin,
  Theater,
  Briefcase,
  Globe,
  Star,
  Sun,
  Users,
  Gift,
} from "lucide-react";
import type { CategoryIconIdentifier } from "@/lib/festival-categories";

interface CategoryIconProps {
  icon: CategoryIconIdentifier | string;
  size?: number;
  color?: string;
  className?: string;
}

export const NamastePrayingHands: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Stylized Namaste / folded prayer hands */}
    <path d="M12 3.5c-1.8 2.2-2.5 5.5-2.5 9.5 0 2 .5 4.2 2.5 6.5 2-2.3 2.5-4.5 2.5-6.5 0-4-.7-7.3-2.5-9.5z" />
    <path d="M9.5 7.5C8 9 7.2 11.2 7.2 14c0 1.8.6 3.5 1.8 5" />
    <path d="M14.5 7.5c1.5 1.5 2.3 3.7 2.3 6.5 0 1.8-.6 3.5-1.8 5" />
    <path d="M7 11.5c-1.2 1.3-1.8 2.8-1.8 4.5 0 1.6.6 3 1.8 4" />
    <path d="M17 11.5c1.2 1.3 1.8 2.8 1.8 4.5 0 1.6-.6 3-1.8 4" />
  </svg>
);

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  size = 20,
  color = "currentColor",
}) => {
  switch (icon) {
    case "hands-praying":
      return <NamastePrayingHands size={size} color={color} />;
    case "flag":
      return <Flag size={size} color={color} />;
    case "map-pin":
      return <MapPin size={size} color={color} />;
    case "theater":
      return <Theater size={size} color={color} />;
    case "briefcase":
      return <Briefcase size={size} color={color} />;
    case "globe":
      return <Globe size={size} color={color} />;
    case "star":
      return <Star size={size} color={color} />;
    case "sun":
      return <Sun size={size} color={color} />;
    case "users":
      return <Users size={size} color={color} />;
    case "gift":
      return <Gift size={size} color={color} />;
    default:
      return <Star size={size} color={color} />;
  }
};
