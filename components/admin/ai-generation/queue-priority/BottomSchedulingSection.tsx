"use client";

import React from "react";
import { PriorityConfigurationCard } from "./PriorityConfigurationCard";
import { SchedulingSettingsCard } from "./SchedulingSettingsCard";
import { QueueActivityHistoryCard } from "./QueueActivityHistoryCard";
import type {
  PriorityConfig,
  QueueSchedulingSettings,
  QueueActivityEvent,
} from "@/lib/ai-queue-priority";

interface BottomSchedulingSectionProps {
  priorityConfig: PriorityConfig;
  onPriorityConfigChange: (updated: Partial<PriorityConfig>) => void;
  schedulingSettings: QueueSchedulingSettings;
  onSchedulingSettingsChange: (updated: Partial<QueueSchedulingSettings>) => void;
  activityHistory: QueueActivityEvent[];
}

export const BottomSchedulingSection: React.FC<BottomSchedulingSectionProps> = ({
  priorityConfig,
  onPriorityConfigChange,
  schedulingSettings,
  onSchedulingSettingsChange,
  activityHistory,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
        marginBottom: "24px",
      }}
    >
      {/* Col 1: Priority Configuration */}
      <PriorityConfigurationCard
        config={priorityConfig}
        onChange={onPriorityConfigChange}
      />

      {/* Col 2: Scheduling Settings */}
      <SchedulingSettingsCard
        settings={schedulingSettings}
        onChange={onSchedulingSettingsChange}
      />

      {/* Col 3: Queue Activity History */}
      <QueueActivityHistoryCard events={activityHistory} />
    </div>
  );
};
