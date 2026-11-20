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
        width: "100%",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          overflowX: "auto",
          padding: "4px 2px 6px 2px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
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
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? "#7956C9" : "#FFFFFF",
                color: isActive ? "#FFFFFF" : "#4A4658",
                border: `1px solid ${isActive ? "#7956C9" : "#EAE4EE"}`,
                boxShadow: isActive
                  ? "0 2px 6px rgba(121, 86, 201, 0.28)"
                  : "0 1px 2px rgba(0, 0, 0, 0.03)",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
            >
              <Icon size={15} color={isActive ? "#FFFFFF" : "#7956C9"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
