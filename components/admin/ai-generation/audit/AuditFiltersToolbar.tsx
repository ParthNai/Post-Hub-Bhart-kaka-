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
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "16px 20px",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Search Transaction ID */}
        <div style={{ position: "relative", flex: 1, minWidth: "170px" }}>
          <Search
            size={14}
            color="#777184"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchId}
            onChange={(e) => onSearchIdChange(e.target.value)}
            placeholder="Search Transaction ID"
            style={{
              width: "100%",
              paddingLeft: "32px",
              paddingRight: "12px",
              paddingTop: "7px",
              paddingBottom: "7px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #EAE4EE",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#24213A",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Search User */}
        <div style={{ position: "relative", flex: 1, minWidth: "170px" }}>
          <Search
            size={14}
            color="#777184"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchUser}
            onChange={(e) => onSearchUserChange(e.target.value)}
            placeholder="Search User"
            style={{
              width: "100%",
              paddingLeft: "32px",
              paddingRight: "12px",
              paddingTop: "7px",
              paddingBottom: "7px",
              backgroundColor: "#FAF7F2",
              border: "1px solid #EAE4EE",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#24213A",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Transaction Type Dropdown */}
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          style={{
            padding: "7px 12px",
            backgroundColor: "#FAF7F2",
            border: "1px solid #EAE4EE",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#24213A",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All Types">Transaction Type ▾</option>
          <option value="Credit Purchase">Credit Purchase</option>
          <option value="AI Generation Usage">AI Generation Usage</option>
          <option value="Promotional Credit">Promotional Credit</option>
          <option value="Admin Credit Grant">Admin Credit Grant</option>
          <option value="Credit Reversal">Credit Reversal</option>
          <option value="Credit Expiry">Credit Expiry</option>
        </select>

        {/* Transaction Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            padding: "7px 12px",
            backgroundColor: "#FAF7F2",
            border: "1px solid #EAE4EE",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#24213A",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All Statuses">Transaction Status ▾</option>
          <option value="Successful">Successful</option>
          <option value="Reversed">Reversed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        {/* Credit Source Dropdown */}
        <select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          style={{
            padding: "7px 12px",
            backgroundColor: "#FAF7F2",
            border: "1px solid #EAE4EE",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#24213A",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All Sources">Credit Source ▾</option>
          <option value="Stripe Checkout">Stripe Checkout</option>
          <option value="PayPal">PayPal</option>
          <option value="Razorpay">Razorpay</option>
          <option value="Poster Generation API">Poster Generation API</option>
          <option value="Promotion Campaign">Promotion Campaign</option>
          <option value="Admin Console">Admin Console</option>
          <option value="Support Refund">Support Refund</option>
        </select>

        {/* Date Range Dropdown */}
        <select
          value={selectedDateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          style={{
            padding: "7px 12px",
            backgroundColor: "#FAF7F2",
            border: "1px solid #EAE4EE",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#24213A",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="All Time">Date Range ▾</option>
          <option value="Today">Today</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 90 Days">Last 90 Days</option>
        </select>

        {/* Clear Filters Button */}
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "7px 12px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EAE4EE",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#777184",
            cursor: "pointer",
          }}
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
