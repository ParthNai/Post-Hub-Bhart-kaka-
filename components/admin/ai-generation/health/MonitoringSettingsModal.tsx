"use client";

import React, { useState } from "react";
import { Settings, X, Save, AlertCircle } from "lucide-react";
import { MonitoringSettings } from "@/lib/ai-provider-health";

interface MonitoringSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MonitoringSettings;
  onSave: (updated: Partial<MonitoringSettings>) => Promise<boolean>;
}

export const MonitoringSettingsModal: React.FC<MonitoringSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [schedule, setSchedule] = useState(settings.schedule);
  const [monitoringEnabled, setMonitoringEnabled] = useState(
    settings.monitoringEnabled
  );
  const [alertThreshold, setAlertThreshold] = useState(settings.alertThreshold);
  const [timeoutSeconds, setTimeoutSeconds] = useState(
    settings.timeoutSeconds || 10
  );
  const [degradationThresholdMs, setDegradationThresholdMs] = useState(
    settings.degradationThresholdMs || 1500
  );
  const [notificationDestination, setNotificationDestination] = useState(
    settings.notificationDestination || "Not Connected"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const ok = await onSave({
        schedule,
        monitoringEnabled,
        alertThreshold,
        timeoutSeconds: Number(timeoutSeconds),
        degradationThresholdMs: Number(degradationThresholdMs),
        notificationDestination,
      });
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#24213A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#EAE4EE] shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                Provider Monitoring Settings
              </h3>
              <p className="text-xs text-[#777184]">
                Configure automated health-check intervals, degradation rules, and alert thresholds.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#777184] hover:text-[#24213A] p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 py-1">
          {/* Schedule */}
          <div>
            <label className="text-xs font-semibold text-[#24213A] block mb-1">
              Automated Check Schedule
            </label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value as MonitoringSettings["schedule"])}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
            >
              <option value="Every 5 Minutes">Every 5 Minutes</option>
              <option value="Every 15 Minutes">Every 15 Minutes (Recommended)</option>
              <option value="Every 30 Minutes">Every 30 Minutes</option>
              <option value="Every 1 Hour">Every 1 Hour</option>
            </select>
          </div>

          {/* Toggle Enabled */}
          <div className="flex items-center justify-between p-3 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg">
            <div>
              <p className="text-xs font-semibold text-[#24213A]">
                Background Health Monitoring
              </p>
              <p className="text-[11px] text-[#777184]">
                Automatically track provider latency and model status.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={monitoringEnabled}
                onChange={(e) => setMonitoringEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
            </label>
          </div>

          {/* Alert Threshold */}
          <div>
            <label className="text-xs font-semibold text-[#24213A] block mb-1">
              Alert Trigger Threshold
            </label>
            <select
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value as MonitoringSettings["alertThreshold"])}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
            >
              <option value="Response > 2s">Response &gt; 2 seconds</option>
              <option value="Response > 3s">Response &gt; 3 seconds (Standard)</option>
              <option value="Response > 5s">Response &gt; 5 seconds</option>
            </select>
          </div>

          {/* Timeout & Degradation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#24213A] block mb-1">
                Timeout (seconds)
              </label>
              <input
                type="number"
                min={3}
                max={60}
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#24213A] block mb-1">
                Degradation Threshold (ms)
              </label>
              <input
                type="number"
                min={500}
                max={5000}
                step={100}
                value={degradationThresholdMs}
                onChange={(e) => setDegradationThresholdMs(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              />
            </div>
          </div>

          {/* Notification Destination */}
          <div>
            <label className="text-xs font-semibold text-[#24213A] block mb-1">
              Notification Channel
            </label>
            <input
              type="text"
              value={notificationDestination}
              onChange={(e) => setNotificationDestination(e.target.value)}
              placeholder="e.g. Not Connected, alerts@posthub.io, or Slack Webhook"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {saveSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Monitoring configuration saved successfully!</span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE4EE]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#EAE4EE] rounded-lg text-xs font-medium text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#7956C9] hover:bg-[#6846B8] text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
