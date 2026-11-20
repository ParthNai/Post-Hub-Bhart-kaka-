"use client";

import React, { useState } from "react";
import {
  X,
  Link as LinkIcon,
  ShieldCheck,
  Grid,
  Calendar,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Info,
  Bell,
  Mail,
} from "lucide-react";
import {
  ProviderHealthRecord,
  ModelPerformanceRecord,
  HealthCheckHistoryItem,
  MonitoringSettings,
} from "@/lib/ai-provider-health";
import { ProviderIcon } from "./ProviderLogos";

interface ProviderDetailsDrawerProps {
  provider: ProviderHealthRecord | null;
  models: ModelPerformanceRecord[];
  history: HealthCheckHistoryItem[];
  settings: MonitoringSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (updates: Partial<MonitoringSettings>) => void;
}

export const ProviderDetailsDrawer: React.FC<ProviderDetailsDrawerProps> = ({
  provider,
  models,
  history,
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Models" | "Health History" | "Performance"
  >("Overview");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !provider) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const providerModels = models.filter(
    (m) =>
      m.providerId.toLowerCase() === provider.id.toLowerCase() ||
      m.provider.toLowerCase() === provider.name.toLowerCase()
  );

  const providerHistory = history.filter(
    (h) => h.providerId.toLowerCase() === provider.id.toLowerCase()
  );

  return (
    <div className="w-full lg:w-[380px] bg-white rounded-xl border border-[#EAE4EE] shadow-2xs flex flex-col shrink-0 overflow-hidden">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-[#EAE4EE] flex items-center justify-between bg-white">
        <h3 className="text-sm font-bold text-[#24213A] tracking-tight">
          Provider Details
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[#777184] hover:text-[#24213A] p-1 rounded-md hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        {/* Provider Profile Card */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-[#EAE4EE] flex items-center justify-center shrink-0 shadow-2xs">
              <ProviderIcon providerId={provider.id} size={28} />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#24213A] leading-snug">
                {provider.name}
              </h4>
              <p className="text-[11px] text-[#777184]">{provider.description}</p>
            </div>
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                provider.status === "Healthy"
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : provider.status === "Degraded"
                  ? "bg-[#FEF3C7] text-[#B45309]"
                  : provider.status === "Checking"
                  ? "bg-[#DBEAFE] text-[#1D4ED8]"
                  : provider.status === "Unavailable"
                  ? "bg-[#FEE2E2] text-[#B91C1C]"
                  : "bg-[#F1F5F9] text-[#475569]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  provider.status === "Healthy"
                    ? "bg-[#16A34A]"
                    : provider.status === "Degraded"
                    ? "bg-[#D97706]"
                    : provider.status === "Checking"
                    ? "bg-[#2563EB] animate-pulse"
                    : provider.status === "Unavailable"
                    ? "bg-[#DC2626]"
                    : "bg-[#64748B]"
                }`}
              />
              {provider.status}
            </span>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center border-b border-[#EAE4EE] text-xs font-semibold">
          {(["Overview", "Models", "Health History", "Performance"] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab
                    ? "border-[#7956C9] text-[#7956C9] font-bold"
                    : "border-transparent text-[#777184] hover:text-[#24213A]"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "Overview" && (
          <div className="space-y-4">
            {/* Key-Value Details */}
            <div className="space-y-3 text-xs">
              {/* Endpoint */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <LinkIcon className="w-3.5 h-3.5" />
                  Endpoint
                </span>
                <span className="font-mono text-[#24213A] flex items-center gap-1.5 bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE4EE]">
                  {provider.endpointMasked}
                  <button
                    type="button"
                    onClick={() => handleCopy(provider.endpointMasked)}
                    className="text-[#777184] hover:text-[#7956C9] cursor-pointer"
                    title="Copy endpoint"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-[#16A34A]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </span>
              </div>

              {/* Authentication */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authentication
                </span>
                <span className="inline-flex items-center gap-1 text-[#15803D] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  {provider.authStatus}
                </span>
              </div>

              {/* Supported Models */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <Grid className="w-3.5 h-3.5" />
                  Supported Models
                </span>
                <span className="text-[#24213A] font-medium text-right max-w-[200px] truncate">
                  {provider.supportedModels.slice(0, 3).join(", ")}
                </span>
              </div>

              {/* Last Successful Check */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <Calendar className="w-3.5 h-3.5" />
                  Last Successful Check
                </span>
                <span className="text-[#24213A] font-medium">
                  {provider.lastCheckText.replace("Last Check: ", "")}
                </span>
              </div>

              {/* Latest Response Time */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <Clock className="w-3.5 h-3.5" />
                  Latest Response Time
                </span>
                <span className="text-[#24213A] font-semibold">
                  {provider.responseTimeText.replace("Response: ", "")}
                </span>
              </div>

              {/* Recent Error */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Recent Error
                </span>
                <span
                  className={
                    provider.hasError
                      ? "text-[#DC2626] font-semibold"
                      : "text-[#777184]"
                  }
                >
                  {provider.recentError || "—"}
                </span>
              </div>
            </div>

            {/* Monitoring History Section */}
            <div className="pt-3 border-t border-[#EAE4EE]">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold text-[#24213A]">
                  Monitoring History
                </h5>
                <button
                  type="button"
                  onClick={() => setActiveTab("Health History")}
                  className="text-[11px] font-semibold text-[#7956C9] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {/* Timeline Items */}
              <div className="space-y-2.5">
                {providerHistory.length === 0 ? (
                  <p className="text-xs text-[#777184]">
                    No recorded checks for this provider.
                  </p>
                ) : (
                  providerHistory.slice(0, 3).map((h) => (
                    <div key={h.id} className="text-xs flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#777184]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              h.status === "passed"
                                ? "bg-[#16A34A]"
                                : h.status === "elevated"
                                ? "bg-[#D97706]"
                                : "bg-[#DC2626]"
                            }`}
                          />
                          {h.timestamp}
                        </span>
                        <span className="font-semibold text-[#24213A]">
                          {h.latencyText}
                        </span>
                      </div>
                      <div className="pl-3.5 text-[11px]">
                        <span
                          className={`font-semibold ${
                            h.status === "passed"
                              ? "text-[#15803D]"
                              : h.status === "elevated"
                              ? "text-[#B45309]"
                              : "text-[#B91C1C]"
                          }`}
                        >
                          {h.statusLabel}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Info alert box matching screenshot */}
              <div className="mt-3.5 p-3 rounded-lg bg-[#FAF5FF] border border-[#E8DFF5] flex items-start gap-2 text-[11px] text-[#7956C9]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Insufficient historical data for detailed analysis.</span>
              </div>
            </div>

            {/* Monitoring Settings Box */}
            <div className="pt-3 border-t border-[#EAE4EE] space-y-3">
              <h5 className="text-xs font-bold text-[#24213A]">
                Monitoring Settings
              </h5>

              {/* Health-Check Schedule */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <Calendar className="w-3.5 h-3.5" />
                  Health-Check Schedule
                </span>
                <select
                  value={settings.schedule}
                  onChange={(e) =>
                    onUpdateSettings({ schedule: e.target.value as MonitoringSettings["schedule"] })
                  }
                  className="px-2 py-1 bg-[#FAF7F2] border border-[#EAE4EE] rounded text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
                >
                  <option value="Every 5 Minutes">Every 5 Minutes</option>
                  <option value="Every 15 Minutes">Every 15 Minutes</option>
                  <option value="Every 30 Minutes">Every 30 Minutes</option>
                  <option value="Every 1 Hour">Every 1 Hour</option>
                </select>
              </div>

              {/* Monitoring Enabled Toggle */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <Clock className="w-3.5 h-3.5" />
                  Monitoring Enabled
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.monitoringEnabled}
                    onChange={(e) =>
                      onUpdateSettings({ monitoringEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7956C9]"></div>
                </label>
              </div>

              {/* Alert Threshold */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <Bell className="w-3.5 h-3.5" />
                  Alert Threshold
                </span>
                <select
                  value={settings.alertThreshold}
                  onChange={(e) =>
                    onUpdateSettings({ alertThreshold: e.target.value as MonitoringSettings["alertThreshold"] })
                  }
                  className="px-2 py-1 bg-[#FAF7F2] border border-[#EAE4EE] rounded text-xs font-medium text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
                >
                  <option value="Response > 2s">Response &gt; 2s</option>
                  <option value="Response > 3s">Response &gt; 3s</option>
                  <option value="Response > 5s">Response &gt; 5s</option>
                </select>
              </div>

              {/* Notification Destination */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#777184]">
                  <Mail className="w-3.5 h-3.5" />
                  Notification Destination
                </span>
                <span className="text-xs text-[#777184] font-medium">
                  {settings.notificationDestination}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Models */}
        {activeTab === "Models" && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#24213A]">
              Configured Models ({providerModels.length})
            </h5>
            <div className="space-y-2">
              {providerModels.length === 0 ? (
                <p className="text-xs text-[#777184]">
                  No configured models found for {provider.name}.
                </p>
              ) : (
                providerModels.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border border-[#EAE4EE] bg-[#FAF7F2]/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#24213A]">{m.name}</span>
                      <span className="font-semibold text-[#7956C9]">
                        {m.avgResponseText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#777184]">
                      <span>{m.successfulRequests.toLocaleString()} successful</span>
                      <span className="text-[#DC2626]">
                        {m.failedRequests.toLocaleString()} failed
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Health History */}
        {activeTab === "Health History" && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#24213A]">
              Full Health History Logs
            </h5>
            <div className="space-y-2.5">
              {providerHistory.length === 0 ? (
                <p className="text-xs text-[#777184]">
                  No historical health checks logged.
                </p>
              ) : (
                providerHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-lg border border-[#EAE4EE] bg-[#FAF7F2]/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#24213A]">{h.id}</span>
                      <span className="font-mono text-[#7956C9] font-bold">
                        {h.latencyText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#777184]">
                      <span>{h.timestamp}</span>
                      <span
                        className={`font-semibold ${
                          h.status === "passed"
                            ? "text-[#15803D]"
                            : h.status === "elevated"
                            ? "text-[#B45309]"
                            : "text-[#DC2626]"
                        }`}
                      >
                        {h.statusLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777184] mt-1 pt-1 border-t border-[#EAE4EE]">
                      {h.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Performance */}
        {activeTab === "Performance" && (
          <div className="space-y-3 text-xs">
            <h5 className="text-xs font-bold text-[#24213A]">
              Performance Breakdown
            </h5>
            <div className="p-3 rounded-lg border border-[#EAE4EE] bg-[#FAF7F2]/40 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#777184]">P50 Response Time</span>
                <span className="font-semibold text-[#24213A]">780ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777184]">P90 Response Time</span>
                <span className="font-semibold text-[#24213A]">1.1s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777184]">P99 Response Time</span>
                <span className="font-semibold text-[#24213A]">1.6s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777184]">Observed Availability</span>
                <span className="font-semibold text-[#15803D]">99.4%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
