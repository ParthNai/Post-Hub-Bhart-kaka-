"use client";

import React from "react";
import {
  Briefcase,
  Sparkles,
  GraduationCap,
  Tag,
  LayoutGrid,
  Snowflake,
  Folder,
} from "lucide-react";
import { CategoryIconType } from "@/lib/template-categories";

interface CategoryIconProps {
  icon: CategoryIconType | string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  size = 18,
  style,
}) => {
  switch (icon) {
    case "briefcase":
      return <Briefcase size={size} style={style} />;
    case "party-popper":
    case "sparkles":
      return <Sparkles size={size} style={style} />;
    case "graduation-cap":
      return <GraduationCap size={size} style={style} />;
    case "tag":
      return <Tag size={size} style={style} />;
    case "layout-grid":
      return <LayoutGrid size={size} style={style} />;
    case "snowflake":
      return <Snowflake size={size} style={style} />;
    default:
      return <Folder size={size} style={style} />;
  }
};
