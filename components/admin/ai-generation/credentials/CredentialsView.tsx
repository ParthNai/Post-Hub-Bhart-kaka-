"use client";

import { AiSubscreenNav } from "../AiSubscreenNav";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Smartphone,
  Palette,
  LayoutTemplate,
  Sparkles,
  PartyPopper,
  Users,
  CreditCard,
  Home,
  ShieldCheck,
  Activity,
  Settings as SettingsIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { CredentialsHeader } from "./CredentialsHeader";
import { CredentialsSummaryCards } from "./CredentialsSummaryCards";
import { ProviderCredentialsTable } from "./ProviderCredentialsTable";
import { CredentialDetailsCard } from "./CredentialDetailsCard";
import { KeyRotationCard } from "./KeyRotationCard";
import { AccessControlCard } from "./AccessControlCard";
import { CredentialAuditHistoryTable } from "./CredentialAuditHistoryTable";
import { AddCredentialDrawer } from "./AddCredentialDrawer";
import { RevokeConfirmModal } from "./RevokeConfirmModal";
import { CredentialAuditModal } from "./CredentialAuditModal";
import { SecuritySettingsModal } from "./SecuritySettingsModal";
import {
  type CredentialsDataset,
  type AddCredentialInput,
  CANONICAL_CREDENTIALS_SEED,
} from "@/lib/ai-credentials";

export const CredentialsView: React.FC = () => {
  const [dataset, setDataset] = useState<CredentialsDataset>(CANONICAL_CREDENTIALS_SEED);
  const [selectedId, setSelectedId] = useState<string>("cred_openai_prod_01");

  // Drawer & Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokingCredId, setRevokingCredId] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/ai-generation/credentials")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          const loaded: CredentialsDataset = data.dataset || data;
          if (loaded?.credentials) {
            setDataset(loaded);
          }
        }
      })
      .catch((err) => {
        console.error("Initial load error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCredential =
    dataset.credentials.find((c) => c.id === selectedId) || dataset.credentials[0] || null;

  // Handler: Add Credential
  const handleAddCredential = async (input: AddCredentialInput) => {
    const res = await fetch("/api/admin/ai-generation/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", input }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to add credential");
    }

    setDataset(data.dataset);
    if (data.credential?.id) {
      setSelectedId(data.credential.id);
    }
    showToast(`Added ${input.credentialName} with encrypted AES-256-GCM vault storage`);
  };

  // Handler: Rotate Key
  const handleRotateKey = async (credentialId: string, replacementSecret: string) => {
    const res = await fetch("/api/admin/ai-generation/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rotate", credentialId, replacementSecret }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to rotate credential");
    }

    setDataset(data.dataset);
    showToast("Key rotated successfully with zero downtime!");
  };

  // Handler: Verify Key
  const handleVerifyKey = async (credentialId: string) => {
    showToast("Verifying provider credentials...", "success");
    try {
      const res = await fetch("/api/admin/ai-generation/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", credentialId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Verification failed");
      }

      setDataset(data.dataset);
      showToast("Live provider verification passed successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      showToast(msg, "error");
    }
  };

  // Handler: Revoke Confirm
  const handleOpenRevokeModal = (credentialId: string) => {
    setRevokingCredId(credentialId);
    setRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async (credentialId: string, reason: string) => {
    const res = await fetch("/api/admin/ai-generation/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke", credentialId, reason }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to revoke credential");
    }

    setDataset(data.dataset);
    showToast("Credential marked as revoked", "success");
  };

  // Handler: Delete Key
  const handleDeleteKey = async (credentialId: string) => {
    if (!confirm("Are you sure you want to permanently delete this credential record and purge its secret from the vault?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/ai-generation/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", credentialId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete credential");
      }

      setDataset(data.dataset);
      showToast("Credential record deleted and purged from vault");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete error";
      showToast(msg, "error");
    }
  };

  // Navigation Items
  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "App Screens", href: "/admin/screens", icon: Smartphone },
    { label: "Design System", href: "/admin/design-system", icon: Palette },
    { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
    { label: "AI Image Generation", href: "/admin/ai-generation", icon: Sparkles, active: true },
    { label: "Festivals & Events", href: "/admin/festivals", icon: PartyPopper },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Subscriptions & Payments", href: "/admin/subscriptions", icon: CreditCard },
    { label: "Home Content", href: "/admin/home-content", icon: Home },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
    { label: "System Health", href: "/admin/system-health", icon: Activity },
    { label: "Support & Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div
      style={{
        padding: "24px 32px 60px",
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "#FAF7F2",
      }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            borderRadius: "10px",
            backgroundColor: toastMessage.type === "success" ? "#10B981" : "#EF4444",
            color: "#FFFFFF",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {toastMessage.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Left Sidebar */}
      
          {/* Header */}
          <CredentialsHeader
            onAddCredential={() => setIsDrawerOpen(!isDrawerOpen)}
            onOpenAuditHistory={() => setAuditModalOpen(true)}
            onOpenSecuritySettings={() => setSecurityModalOpen(true)}
            isDrawerOpen={isDrawerOpen}
          />

          {/* Sub-screens Navigation Ribbon */}
          <AiSubscreenNav />

          {/* 4 Summary Cards */}
          <CredentialsSummaryCards metrics={dataset.summary} />

          {/* Main 2-Column Responsive Workspace */}
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
            {/* Left Column (Table, Details, Rotation, Access Control, Audit) */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              {/* Provider Credentials Table */}
              <ProviderCredentialsTable
                credentials={dataset.credentials}
                selectedId={selectedId}
                onSelectCredential={(id) => setSelectedId(id)}
                onRotateKey={(id) => {
                  setSelectedId(id);
                }}
                onVerifyKey={(id) => handleVerifyKey(id)}
                onRevokeKey={(id) => handleOpenRevokeModal(id)}
                onDeleteKey={(id) => handleDeleteKey(id)}
              />

              {/* Middle Row: 3 Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "18px",
                  marginBottom: "24px",
                }}
              >
                <CredentialDetailsCard credential={selectedCredential} />
                <KeyRotationCard
                  credential={selectedCredential}
                  onRotateKey={handleRotateKey}
                />
                <AccessControlCard credential={selectedCredential} />
              </div>

              {/* Credential Audit History Table */}
              <CredentialAuditHistoryTable
                auditEvents={dataset.auditHistory}
                onViewAllLogs={() => setAuditModalOpen(true)}
              />
            </div>

            {/* Right Column: Add Credential Drawer & Best Practices */}
            {isDrawerOpen && (
              <AddCredentialDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSave={handleAddCredential}
              />
            )}
          </div>
        

      {/* Revoke Confirmation Modal */}
      <RevokeConfirmModal
        isOpen={revokeModalOpen}
        credential={dataset.credentials.find((c) => c.id === revokingCredId) || null}
        onClose={() => {
          setRevokeModalOpen(false);
          setRevokingCredId(null);
        }}
        onConfirmRevoke={handleConfirmRevoke}
      />

      {/* Full Audit History Modal */}
      <CredentialAuditModal
        isOpen={auditModalOpen}
        auditEvents={dataset.auditHistory}
        onClose={() => setAuditModalOpen(false)}
      />

      {/* Security Settings Modal */}
      <SecuritySettingsModal
        isOpen={securityModalOpen}
        settings={dataset.securitySettings}
        onClose={() => setSecurityModalOpen(false)}
      />
    </div>
  );
};
