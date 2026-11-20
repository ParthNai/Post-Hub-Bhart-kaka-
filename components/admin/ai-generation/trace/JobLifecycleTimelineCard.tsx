"use client";

import React from "react";
import { History, Check, ArrowRight } from "lucide-react";
import type { JobLifecycleStage } from "@/lib/ai-job-trace";

interface JobLifecycleTimelineCardProps {
  stages: JobLifecycleStage[];
}

export const JobLifecycleTimelineCard: React.FC<JobLifecycleTimelineCardProps> = ({
  stages,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <History size={16} color="#7956C9" />
        <span>Job Lifecycle Timeline</span>
      </div>

      {/* Pipeline Stages */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflowX: "auto",
          paddingBottom: "8px",
          gap: "8px",
        }}
      >
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === "completed";
          const isActive = stage.status === "active";
          const isLast = idx === stages.length - 1;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Node */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "75px",
                  textAlign: "center",
                }}
              >
                {/* Node Icon Circle */}
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isCompleted
                      ? "#22C55E"
                      : isActive
                      ? "#F3EFFC"
                      : "#FFFFFF",
                    border: isCompleted
                      ? "none"
                      : isActive
                      ? "3px solid #7956C9"
                      : "2px solid #D1D5DB",
                    color: isCompleted ? "#FFFFFF" : isActive ? "#7956C9" : "#9CA3AF",
                    marginBottom: "8px",
                    position: "relative",
                  }}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : isActive ? (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#7956C9",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#D1D5DB",
                      }}
                    />
                  )}
                </div>

                {/* Stage Label */}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                    color: isActive ? "#7956C9" : isCompleted ? "#24213A" : "#9CA3AF",
                    lineHeight: 1.2,
                    borderBottom: isActive ? "2px solid #7956C9" : "none",
                    paddingBottom: isActive ? "2px" : "0",
                  }}
                >
                  {stage.label}
                </span>
              </div>

              {/* Arrow Connector */}
              {!isLast && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isCompleted ? "#7956C9" : "#D1D5DB",
                    marginBottom: "16px",
                    flexShrink: 0,
                  }}
                >
                  <ArrowRight size={14} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
