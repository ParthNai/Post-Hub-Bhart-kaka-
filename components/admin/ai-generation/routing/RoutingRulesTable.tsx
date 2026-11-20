"use client";

import React from "react";
import { ListFilter, Search, Edit2 } from "lucide-react";
import { RoutingRule } from "@/lib/ai-failover";

interface RoutingRulesTableProps {
  rules: RoutingRule[];
  search: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onEditRule: (rule: RoutingRule) => void;
  selectedRuleId?: string;
}

export const RoutingRulesTable: React.FC<RoutingRulesTableProps> = ({
  rules,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onEditRule,
  selectedRuleId,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#EAE4EE] shadow-2xs mb-6 overflow-hidden">
      {/* Header & Controls */}
      <div className="px-5 py-4 border-b border-[#EAE4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-2.5">
          <ListFilter className="w-4 h-4 text-[#7956C9]" />
          <h2 className="text-sm font-bold text-[#24213A] tracking-tight">
            Routing Rules
          </h2>
        </div>

        {/* Search & Selectors */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#777184] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search rules..."
              className="pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white transition-all w-36 sm:w-44"
            />
          </div>

          {/* Type selector */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Image">Image</option>
            <option value="Text">Text</option>
            <option value="Multimodal">Multimodal</option>
          </select>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] font-medium focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF7F2]/80 border-b border-[#EAE4EE] text-[11px] font-semibold text-[#777184]">
              <th className="py-2.5 px-5">Rule Name</th>
              <th className="py-2.5 px-4">Request Type</th>
              <th className="py-2.5 px-4">Model Requirement</th>
              <th className="py-2.5 px-4">Preferred Provider</th>
              <th className="py-2.5 px-4">Fallback Policy</th>
              <th className="py-2.5 px-4">Priority</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Last Updated</th>
              <th className="py-2.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE] text-xs">
            {rules.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-xs text-[#777184]">
                  No routing rules found.
                </td>
              </tr>
            ) : (
              rules.map((r) => {
                const isSelected = selectedRuleId === r.id;
                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-[#FAF7FD]"
                        : "hover:bg-[#FAF7F2]/50"
                    }`}
                  >
                    <td className="py-3 px-5 font-bold text-[#24213A]">
                      {r.ruleName}
                    </td>
                    <td className="py-3 px-4 text-[#777184]">{r.requestType}</td>
                    <td className="py-3 px-4 text-[#24213A] font-medium">
                      {r.modelRequirement}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#24213A]">
                      {r.preferredProvider}
                    </td>
                    <td className="py-3 px-4 text-[#777184]">
                      {r.fallbackPolicy}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#24213A]">
                      {r.priority}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#777184]">{r.lastUpdated}</td>
                    <td className="py-3 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => onEditRule(r)}
                        className="p-1.5 text-[#777184] hover:text-[#7956C9] hover:bg-[#FAF5FF] rounded-md transition-colors cursor-pointer"
                        title="Edit routing rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
