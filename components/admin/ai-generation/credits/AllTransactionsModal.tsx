"use client";

import React, { useState } from "react";
import { X, ListOrdered, Search, Download } from "lucide-react";
import type { CreditTransaction } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface AllTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: CreditTransaction[];
  onExportCsv: () => void;
}

export function AllTransactionsModal({
  isOpen,
  onClose,
  transactions,
  onExportCsv,
}: AllTransactionsModalProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  if (!isOpen) return null;

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      t.reason.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === "All Types" || t.transactionType === typeFilter;
    const matchesStatus =
      statusFilter === "All Status" || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-[#EAE4EE] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <ListOrdered className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24213A]">
                Credit Transaction Ledger
              </h3>
              <p className="text-xs text-[#777184]">
                Auditable transaction history and credit adjustments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 bg-[#FAF7F2]/50 border-b border-[#EAE4EE] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID or user..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            >
              <option value="All Types">All Types</option>
              <option value="Credit Purchase">Credit Purchase</option>
              <option value="Usage">Usage</option>
              <option value="Promotional Grant">Promotional Grant</option>
              <option value="Refund">Refund</option>
              <option value="Admin Adjustment">Admin Adjustment</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            >
              <option value="All Status">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAE4EE] text-xs font-semibold text-[#24213A] hover:bg-[#FAF7F2] hover:text-[#7956C9] transition-colors shrink-0 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#7956C9]" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#777184] font-semibold border-b border-[#EAE4EE] sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Transaction ID</th>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Credit Change</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Reason / Note</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4EE]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#777184]">
                    No transactions match the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isPositive = tx.creditChange > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-[#FAF7F2]/40">
                      <td className="py-2.5 px-4 font-mono font-medium text-[#24213A]">
                        {tx.id}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-[#24213A]">
                        {tx.userName}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7956C9] border border-[#E8DFF5]">
                          {tx.transactionType}
                        </span>
                      </td>
                      <td
                        className={`py-2.5 px-4 font-bold ${
                          isPositive ? "text-[#10B981]" : "text-[#D97706]"
                        }`}
                      >
                        {isPositive ? `+${formatCredits(tx.creditChange)}` : formatCredits(tx.creditChange)}
                      </td>
                      <td className="py-2.5 px-4 text-[#777184]">{tx.source}</td>
                      <td className="py-2.5 px-4 text-[#777184] whitespace-nowrap">{tx.date}</td>
                      <td className="py-2.5 px-4 text-[#777184] max-w-xs truncate" title={tx.reason}>
                        {tx.reason}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE4EE] bg-[#FAF7F2]/40 flex items-center justify-between text-xs text-[#777184]">
          <span>Total records: {filtered.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#7956C9] text-white font-semibold hover:bg-[#6847B0] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
