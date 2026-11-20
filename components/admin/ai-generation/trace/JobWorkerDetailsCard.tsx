"use client";

import React from "react";
import { Cpu } from "lucide-react";
import type { JobWorkerDetails } from "@/lib/ai-job-trace";

interface JobWorkerDetailsCardProps {
  worker: JobWorkerDetails;
}

export const JobWorkerDetailsCard: React.FC<JobWorkerDetailsCardProps> = ({ worker }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "16px 18px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#24213A",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            backgroundColor: "#F3EFFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7956C9",
          }}
        >
          <Cpu size={15} />
        </div>
        <span>Worker Details</span>
      </div>

      {/* Key-Value Rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "12.5px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Worker ID:</span>
          <span style={{ color: "#24213A", fontWeight: 600 }}>{worker.workerId}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Worker Pool:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{worker.workerPool}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Assigned Queue:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{worker.assignedQueue}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Worker Version:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{worker.workerVersion}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#777184" }}>Assignment Time:</span>
          <span style={{ color: "#24213A", fontWeight: 500 }}>{worker.assignmentTime}</span>
        </div>
      </div>
    </div>
  );
};
