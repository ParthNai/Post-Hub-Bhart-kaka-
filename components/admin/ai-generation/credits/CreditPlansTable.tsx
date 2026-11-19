"use client";

import React, { useState } from "react";
import {
  Crown,
  Search,
  Filter,
  Pencil,
  Copy,
  MoreVertical,
  Check,
  Archive,
} from "lucide-react";
import type { CreditPlan } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface CreditPlansTableProps {
  plans: CreditPlan[];
  onEditPlan: (plan: CreditPlan) => void;
  onDuplicatePlan: (planId: string) => void;
  onToggleStatus: (planId: string) => void;
  onArchivePlan: (planId: string) => void;
}

export function CreditPlansTable({
  plans,
  onEditPlan,
  onDuplicatePlan,
  onToggleStatus,
  onArchivePlan,
}: CreditPlansTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#EAE4EE] shadow-2xs mb-6 overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4EE]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <Crown className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h2 className="text-base font-bold text-[#24213A]">Credit Plans</h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search plans */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans..."
              className="pl-9 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white w-48 transition-all"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] hover:bg-white hover:border-[#7956C9]/40 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#777184]" />
              <span>Filter ▾</span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl border border-[#EAE4EE] shadow-lg py-1 z-20 text-xs">
                {["All", "Active", "Draft", "Archived"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] flex items-center justify-between ${
                      statusFilter === st ? "font-bold text-[#7956C9]" : "text-[#24213A]"
                    }`}
                  >
                    <span>{st}</span>
                    {statusFilter === st && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/60 text-[#777184] font-semibold border-b border-[#EAE4EE]">
            <tr>
              <th className="py-3 px-5">Plan Name</th>
              <th className="py-3 px-4">Credits Included</th>
              <th className="py-3 px-4">Validity</th>
              <th className="py-3 px-4">Plan Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#777184]">
                  No credit plans match your search or filter.
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#24213A]">
                    {plan.name}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#24213A]">
                    {formatCredits(plan.creditQuantity)} Credits
                  </td>
                  <td className="py-3.5 px-4 text-[#777184] font-medium">
                    {plan.validityDays} Days
                  </td>
                  <td className="py-3.5 px-4 text-[#777184] font-medium">
                    {plan.planType}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        plan.status === "Active"
                          ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                          : plan.status === "Draft"
                          ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                          : "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#777184]">
                    {plan.updatedAt}
                  </td>
                  <td className="py-3.5 px-5 text-right relative">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => onEditPlan(plan)}
                        title="Edit Plan"
                        className="p-1 rounded-lg text-[#777184] hover:text-[#7956C9] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate Button */}
                      <button
                        onClick={() => onDuplicatePlan(plan.id)}
                        title="Duplicate Plan"
                        className="p-1 rounded-lg text-[#777184] hover:text-[#7956C9] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* More Menu Toggle */}
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === plan.id ? null : plan.id)
                        }
                        title="More Actions"
                        className="p-1 rounded-lg text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Popover Menu */}
                    {activeMenuId === plan.id && (
                      <div className="absolute right-5 top-full mt-1 w-36 bg-white rounded-xl border border-[#EAE4EE] shadow-lg py-1 z-20 text-xs text-left">
                        <button
                          onClick={() => {
                            onToggleStatus(plan.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-[#FAF7F2] text-[#24213A] flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-[#7956C9]" />
                          <span>
                            {plan.status === "Active" ? "Set as Draft" : "Activate"}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            onArchivePlan(plan.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-[#FAF7F2] text-red-600 flex items-center gap-2"
                        >
                          <Archive className="w-3.5 h-3.5 text-red-500" />
                          <span>Archive Plan</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between text-xs text-[#777184] border-t border-[#EAE4EE]">
        <span>
          Showing 1 to {filteredPlans.length} of {plans.length} plans
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled
            className="w-7 h-7 rounded-lg border border-[#EAE4EE] flex items-center justify-center text-[#777184] disabled:opacity-40"
          >
            ‹
          </button>
          <button className="w-7 h-7 rounded-lg bg-[#7956C9] text-white font-bold flex items-center justify-center">
            1
          </button>
          <button
            disabled
            className="w-7 h-7 rounded-lg border border-[#EAE4EE] flex items-center justify-center text-[#777184] disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
