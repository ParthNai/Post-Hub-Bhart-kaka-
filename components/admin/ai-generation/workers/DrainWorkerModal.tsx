"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import type { WorkerItem } from "@/lib/ai-workers";

interface DrainWorkerModalProps {
  isOpen: boolean;
  worker: WorkerItem | null;
  onClose: () => void;
  onConfirm: (worker: WorkerItem, reason: string) => Promise<void>;
}

export const DrainWorkerModal: React.FC<DrainWorkerModalProps> = ({
  isOpen,
  worker,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !worker) return null;

  const handleDrain = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(worker, "Due to maintenance");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EAE4EE",
        borderRadius: "12px",
        padding: "16px 20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Header with icon and close button */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#F3EFFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7956C9",
              flexShrink: 0,
            }}
          >
            <AlertCircle size={20} />
          </div>
          <div>
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#24213A",
                margin: "0 0 4px 0",
              }}
            >
              Drain Worker
            </h4>
            <p
              style={{
                fontSize: "12px",
                color: "#544E61",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              This will stop accepting new jobs for worker <strong>{worker.id}</strong>, but allow current jobs to finish. Do you want to continue?
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#777184",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          style={{
            padding: "7px 16px",
            borderRadius: "8px",
            border: "1px solid #EAE4EE",
            backgroundColor: "#FFFFFF",
            color: "#544E61",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDrain}
          disabled={isSubmitting}
          style={{
            padding: "7px 18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#7956C9",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            cursor: isSubmitting ? "wait" : "pointer",
            boxShadow: "0 2px 4px rgba(121, 86, 201, 0.2)",
          }}
        >
          {isSubmitting ? "Draining..." : "Drain Worker"}
        </button>
      </div>
    </div>
  );
};
