"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutGrid } from "lucide-react";

export const FESTIVAL_SUBSCREENS = [
  { label: "Festivals & Events Overview", href: "/admin/festivals", icon: Calendar },
  { label: "Festival & Event Categories", href: "/admin/festivals/categories", icon: LayoutGrid },
];

export const FestivalSubscreenNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "12px 14px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
        marginBottom: "22px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {FESTIVAL_SUBSCREENS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin/festivals"
              ? pathname === "/admin/festivals" || pathname === "/admin/festivals/overview"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? "#7956C9" : "#FAF7F2",
                color: isActive ? "#FFFFFF" : "#544E61",
                border: `1px solid ${isActive ? "#7956C9" : "#EAE4EE"}`,
                boxShadow: isActive
                  ? "0 2px 6px rgba(121, 86, 201, 0.28)"
                  : "none",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
            >
              <Icon size={14} color={isActive ? "#FFFFFF" : "#7956C9"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
