"use client";

import React, { useState } from "react";
import { Database, Sparkles, Mail, RefreshCw } from "lucide-react";
import { HealthStatusResponse } from "@/app/api/admin/health/route";

interface SystemStatusProps {
  onHealthChecked?: (data: HealthStatusResponse) => void;
}

type CheckState = "not_checked" | "healthy" | "degraded" | "unavailable" | "not_configured";

export const SystemStatus: React.FC<SystemStatusProps> = ({ onHealthChecked }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);
  const [statuses, setStatuses] = useState<{
    database: { status: CheckState; label: string; latency?: number };
    aiProvider: { status: CheckState; label: string; provider?: string };
    emailService: { status: CheckState; label: string };
  }>({
    database: { status: "not_checked", label: "Not checked" },
    aiProvider: { status: "not_checked", label: "Not checked" },
    emailService: { status: "not_checked", label: "Not checked" },
  });

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data: HealthStatusResponse = await res.json();
        onHealthChecked?.(data);

        setStatuses({
          database: {
            status: data.services.database.status,
            label:
              data.services.database.status === "healthy"
                ? `Operational (${data.services.database.latencyMs}ms)`
                : data.services.database.status,
            latency: data.services.database.latencyMs,
          },
          aiProvider: {
            status: data.services.aiProvider.status,
            label:
              data.services.aiProvider.status === "healthy"
                ? `${data.services.aiProvider.provider || "Operational"}`
                : "Not configured",
            provider: data.services.aiProvider.provider,
          },
          emailService: {
            status: data.services.emailService.status,
            label:
              data.services.emailService.status === "healthy"
                ? "Operational"
                : "Not configured",
          },
        });
        setCheckedOnce(true);
      }
    } catch {
      setStatuses((prev) => ({
        ...prev,
        database: { status: "unavailable", label: "Check failed" },
      }));
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: CheckState) => {
    switch (status) {
      case "healthy":
        return "var(--success)";
      case "degraded":
      case "not_configured":
        return "#E69B00";
      case "unavailable":
        return "var(--error)";
      case "not_checked":
      default:
        return "var(--text-light)";
    }
  };

  const services = [
    {
      id: "database",
      name: "Database",
      icon: Database,
      status: statuses.database.status,
      label: statuses.database.label,
    },
    {
      id: "ai-provider",
      name: "AI Provider",
      icon: Sparkles,
      status: statuses.aiProvider.status,
      label: statuses.aiProvider.label,
    },
    {
      id: "email-service",
      name: "Email Service",
      icon: Mail,
      status: statuses.emailService.status,
      label: statuses.emailService.label,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        padding: "22px 24px 20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 4px 0",
            }}
          >
            System Status
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
            {checkedOnce ? "Live operational status" : "Illustrative demo state"}
          </span>
        </div>

        {/* Live Health Check Trigger */}
        <button
          type="button"
          onClick={runHealthCheck}
          disabled={isChecking}
          title="Run real server-side health checks"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "4px 8px",
            fontSize: "11.5px",
            color: "var(--primary)",
            cursor: isChecking ? "wait" : "pointer",
            fontWeight: 500,
          }}
          className="health-check-btn"
        >
          <RefreshCw size={12} className={isChecking ? "spin" : ""} />
          {isChecking ? "Checking..." : checkedOnce ? "Re-check" : "Check now"}
        </button>
      </div>

      {/* 3 Status rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {services.map((srv) => {
          const Icon = srv.icon;
          const dotColor = getStatusColor(srv.status);

          return (
            <div
              key={srv.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #FAF7F2",
              }}
            >
              {/* Left icon and service name */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {srv.name}
                </span>
              </div>

              {/* Status dot and label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12.5px",
                  color: srv.status === "healthy" ? "var(--success)" : "var(--text-light)",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: dotColor,
                  }}
                />
                <span>{srv.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .health-check-btn:hover:not(:disabled) {
          border-color: var(--primary) !important;
          background-color: var(--primary-light) !important;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
