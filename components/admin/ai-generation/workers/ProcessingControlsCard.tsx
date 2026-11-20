"use client";

import React from "react";
import { Play, Pause, Download, RotateCw, Info } from "lucide-react";
import type { WorkerItem } from "@/lib/ai-workers";

interface ProcessingControlsCardProps {
  selectedWorker: WorkerItem | null;
  onPause: () => void;
  onResume: () => void;
  onDrain: () => void;
  onRestart: () => void;
}

export const ProcessingControlsCard: React.FC<ProcessingControlsCardProps> = ({
  selectedWorker,
  onPause,
  onResume,
  onDrain,
  onRestart,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Play size={16} color="#7956C9" fill="#7956C9" />
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Processing Controls
        </h3>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Pause Worker */}
        <button
          type="button"
          onClick={onPause}
          disabled={!selectedWorker || selectedWorker.runtimeStatus === "Paused"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#7956C9",
            border: "1px solid #7956C9",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            cursor: !selectedWorker || selectedWorker.runtimeStatus === "Paused" ? "not-allowed" : "pointer",
            opacity: !selectedWorker || selectedWorker.runtimeStatus === "Paused" ? 0.6 : 1,
            boxShadow: "0 1px 2px rgba(121, 86, 201, 0.2)",
            transition: "all 0.15s ease",
          }}
        >
          <Pause size={13} fill="#FFFFFF" />
          <span>Pause Worker</span>
        </button>

        {/* Resume Worker */}
        <button
          type="button"
          onClick={onResume}
          disabled={!selectedWorker || selectedWorker.runtimeStatus === "Running"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE4EE",
            color: "#7956C9",
            fontSize: "12px",
            fontWeight: 600,
            cursor: !selectedWorker || selectedWorker.runtimeStatus === "Running" ? "not-allowed" : "pointer",
            opacity: !selectedWorker || selectedWorker.runtimeStatus === "Running" ? 0.6 : 1,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            transition: "all 0.15s ease",
          }}
        >
          <Play size={13} fill="#7956C9" />
          <span>Resume Worker</span>
        </button>

        {/* Drain Worker */}
        <button
          type="button"
          onClick={onDrain}
          disabled={!selectedWorker || selectedWorker.runtimeStatus === "Draining"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFF7ED",
            border: "1px solid #FFEDD5",
            color: "#EA580C",
            fontSize: "12px",
            fontWeight: 600,
            cursor: !selectedWorker || selectedWorker.runtimeStatus === "Draining" ? "not-allowed" : "pointer",
            opacity: !selectedWorker || selectedWorker.runtimeStatus === "Draining" ? 0.6 : 1,
            transition: "all 0.15s ease",
          }}
        >
          <Download size={13} />
          <span>Drain Worker</span>
        </button>

        {/* Restart Worker */}
        <button
          type="button"
          onClick={onRestart}
          disabled={!selectedWorker}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #FCA5A5",
            color: "#DC2626",
            fontSize: "12px",
            fontWeight: 600,
            cursor: !selectedWorker ? "not-allowed" : "pointer",
            opacity: !selectedWorker ? 0.6 : 1,
            transition: "all 0.15s ease",
          }}
        >
          <RotateCw size={13} />
          <span>Restart Worker</span>
        </button>
      </div>

      {/* Info Callout Box */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: "8px",
          backgroundColor: "#F3EFFC",
          color: "#7956C9",
          fontSize: "12px",
        }}
      >
        <Info size={15} style={{ flexShrink: 0 }} />
        <span>
          Drain Worker will stop accepting new jobs while allowing current jobs to finish.
        </span>
      </div>
    </div>
  );
};
