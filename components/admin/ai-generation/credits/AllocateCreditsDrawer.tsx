"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Gift,
  Calendar,
  Info,
  Check,
  Search,
  AlertCircle,
} from "lucide-react";
import type { UserCreditAccount } from "@/lib/ai-credits";

interface AllocateCreditsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserCreditAccount[];
  selectedUser: UserCreditAccount | null;
  onSelectUser: (user: UserCreditAccount | null) => void;
  onAllocateCredits: (params: {
    userId: string;
    source: "Promotional Credits" | "Admin Granted";
    amount: number;
    expiryDate?: string;
    reason: string;
  }) => Promise<void>;
}

export function AllocateCreditsDrawer({
  isOpen,
  onClose,
  users,
  selectedUser,
  onSelectUser,
  onAllocateCredits,
}: AllocateCreditsDrawerProps) {
  const [creditSource, setCreditSource] = useState<
    "Promotional Credits" | "Admin Granted"
  >("Promotional Credits");
  const [amount, setAmount] = useState<number>(500);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [reason, setReason] = useState<string>(
    "Special campaign for active users."
  );
  const [userSearch, setUserSearch] = useState("");
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default selected user if none
  useEffect(() => {
    if (isOpen && !selectedUser && users.length > 0) {
      // Find Rohit Sharma by default matching reference image
      const rohit = users.find((u) => u.name.includes("Rohit")) || users[0];
      onSelectUser(rohit);
    }
  }, [isOpen, selectedUser, users, onSelectUser]);

  if (!isOpen) return null;

  const filteredUserOptions = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Please select a user account to allocate credits.");
      return;
    }
    if (amount <= 0) {
      setError("Number of credits must be greater than zero.");
      return;
    }
    if (!reason || reason.trim().length < 3) {
      setError("Please enter a valid reason or note for this allocation.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAllocateCredits({
        userId: selectedUser.userId,
        source: creditSource,
        amount,
        expiryDate: expiryDate || undefined,
        reason: reason.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to allocate credits.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white border-l border-[#EAE4EE] shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE4EE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
                <Gift className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#24213A]">
                  Allocate Credits
                </h3>
                <p className="text-xs text-[#777184]">
                  Grant credits to a user account.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Select User */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#24213A]">
                Select User
              </label>

              {/* Selected User Pill / Chip */}
              {selectedUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE4EE]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#E8DFF5] text-[#7956C9] font-bold text-xs flex items-center justify-center shrink-0 border border-[#D5C2EE]">
                      {selectedUser.avatarInitials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#24213A]">
                        {selectedUser.name}
                      </p>
                      <p className="text-[11px] text-[#777184]">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectUser(null);
                      setIsSearchingUsers(true);
                    }}
                    className="p-1 rounded-md text-[#777184] hover:text-[#24213A] hover:bg-black/5"
                    title="Change user"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setIsSearchingUsers(true);
                    }}
                    onFocus={() => setIsSearchingUsers(true)}
                    placeholder="Search user by name or email..."
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white transition-all"
                  />

                  {/* Dropdown Options */}
                  {isSearchingUsers && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-[#EAE4EE] shadow-lg max-h-48 overflow-y-auto z-30 py-1 divide-y divide-[#EAE4EE]">
                      {filteredUserOptions.map((u) => (
                        <button
                          key={u.userId}
                          type="button"
                          onClick={() => {
                            onSelectUser(u);
                            setIsSearchingUsers(false);
                            setUserSearch("");
                          }}
                          className="w-full p-2.5 hover:bg-[#FAF7F2] flex items-center gap-2.5 text-left transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#E8DFF5] text-[#7956C9] font-bold text-[10px] flex items-center justify-center shrink-0">
                            {u.avatarInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#24213A] truncate">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-[#777184] truncate">
                              {u.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Credit Source */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#24213A]">
                Credit Source
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="creditSource"
                    checked={creditSource === "Promotional Credits"}
                    onChange={() => setCreditSource("Promotional Credits")}
                    className="w-4 h-4 text-[#7956C9] border-[#EAE4EE] focus:ring-[#7956C9] accent-[#7956C9]"
                  />
                  <span className="text-xs font-medium text-[#24213A]">
                    Promotional Credits
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="creditSource"
                    checked={creditSource === "Admin Granted"}
                    onChange={() => setCreditSource("Admin Granted")}
                    className="w-4 h-4 text-[#7956C9] border-[#EAE4EE] focus:ring-[#7956C9] accent-[#7956C9]"
                  />
                  <span className="text-xs font-medium text-[#24213A]">
                    Admin Granted
                  </span>
                </label>
              </div>
            </div>

            {/* Number of Credits */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#24213A]">
                Number of Credits
              </label>
              <input
                type="number"
                min="1"
                max="100000"
                step="50"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] font-semibold focus:outline-none focus:border-[#7956C9]"
              />
            </div>

            {/* Expiry Date (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#24213A]">
                Expiry Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
                  placeholder="Select expiry date"
                />
              </div>
            </div>

            {/* Reason / Note */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#24213A]">
                  Reason / Note
                </label>
                <span className="text-[11px] text-[#777184]">
                  {reason.length} / 500
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter mandatory reason for this credit allocation..."
                className="w-full p-3 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] resize-none"
              />
            </div>

            {/* Info notice banner */}
            <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#1E40AF] leading-relaxed">
                This allocation will create an auditable credit transaction.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              {/* Primary: Confirm Allocation */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7956C9] hover:bg-[#6847B0] text-xs font-bold text-white shadow-2xs active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isSubmitting ? "Allocating Credits..." : "Confirm Allocation"}
                </span>
              </button>

              {/* Secondary: Cancel */}
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-[#EAE4EE] text-xs font-bold text-[#24213A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-[#777184]" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
