"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export const SignOutButton: React.FC = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoggingOut}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        borderRadius: "8px",
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        fontSize: "13px",
        fontWeight: 500,
        cursor: isLoggingOut ? "not-allowed" : "pointer",
        transition: "all 0.16s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--error)";
        e.currentTarget.style.color = "var(--error)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text)";
      }}
    >
      <LogOut size={15} />
      <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
};
