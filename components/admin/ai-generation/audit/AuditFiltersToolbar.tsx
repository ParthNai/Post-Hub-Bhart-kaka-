"use client";

import React from "react";
import { Search, Calendar, RotateCcw } from "lucide-react";

interface AuditFiltersToolbarProps {
  searchId: string;
  onSearchIdChange: (val: string) => void;
  searchUser: string;
  onSearchUserChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedSource: string;
  onSourceChange: (val: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (val: string) => void;
  onClearFilters: () => void;
}

export function AuditFiltersToolbar({
  searchId,
  onSearchIdChange,
  searchUser,
  onSearchUserChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedSource,
  onSourceChange,
  selectedDateRange,
  onDateRangeChange,
  onClearFilters,
}: AuditFiltersToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#EAE4EE] shadow-2xs mb-6 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Transaction ID */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => onSearchIdChange(e.target.value)}
            placeholder="Search Transaction ID"
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white transition-all"
          />
        </div>

        {/* Search User */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchUser}
            onChange={(e) => onSearchUserChange(e.target.value)}
            placeholder="Search User"
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white transition-all"
          />
        </div>

        {/* Transaction Type Dropdown */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="px-3.5 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Types">Transaction Type ▾</option>
            <option value="Credit Purchase">Credit Purchase</option>
            <option value="AI Generation Usage">AI Generation Usage</option>
            <option value="Promotional Credit">Promotional Credit</option>
            <option value="Admin Credit Grant">Admin Credit Grant</option>
            <option value="Credit Reversal">Credit Reversal</option>
            <option value="Credit Expiry">Credit Expiry</option>
          </select>
        </div>

        {/* Transaction Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3.5 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Statuses">Transaction Status ▾</option>
            <option value="Successful">Successful</option>
            <option value="Reversed">Reversed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* Credit Source Dropdown */}
        <div className="relative">
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="px-3.5 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Sources">Credit Source ▾</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Generation">Generation</option>
            <option value="Promo">Promo</option>
            <option value="Admin">Admin</option>
            <option value="System">System</option>
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-[#777184]" />
            <select
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All Time">Select Date Range ▾</option>
              <option value="Today">Today (19 Nov)</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month (Nov 2026)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EAE4EE] hover:bg-[#FAF7F2] hover:text-[#7956C9] text-xs font-semibold text-[#24213A] rounded-xl transition-all shadow-2xs cursor-pointer ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#777184]" />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
}
