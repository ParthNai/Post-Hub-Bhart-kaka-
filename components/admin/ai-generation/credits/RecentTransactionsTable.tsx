"use client";

import React from "react";
import { ListOrdered, ArrowRight } from "lucide-react";
import type { CreditTransaction } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface RecentTransactionsTableProps {
  transactions: CreditTransaction[];
  onViewAll?: () => void;
}

export function RecentTransactionsTable({
  transactions,
  onViewAll,
}: RecentTransactionsTableProps) {
  // Show up to 4 recent transactions in this primary card view
  const displayTransactions = transactions.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-[#EAE4EE] shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#EAE4EE]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <ListOrdered className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h2 className="text-base font-bold text-[#24213A]">
            Recent Credit Transactions
          </h2>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-bold text-[#7956C9] hover:text-[#6847B0] transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/60 text-[#777184] font-semibold border-b border-[#EAE4EE]">
            <tr>
              <th className="py-3 px-5">Transaction ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Transaction Type</th>
              <th className="py-3 px-4">Credit Change</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {displayTransactions.map((tx) => {
              const isPositive = tx.creditChange > 0;
              const formattedChange = isPositive
                ? `+${formatCredits(tx.creditChange)}`
                : `${formatCredits(tx.creditChange)}`;

              return (
                <tr key={tx.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                  {/* Transaction ID */}
                  <td className="py-3.5 px-5 font-medium text-[#24213A]">
                    {tx.id}
                  </td>

                  {/* User */}
                  <td className="py-3.5 px-4 font-bold text-[#24213A]">
                    {tx.userName}
                  </td>

                  {/* Transaction Type Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        tx.transactionType === "Credit Purchase"
                          ? "bg-[#F3E8FF] text-[#7956C9] border border-[#E9D5FF]"
                          : tx.transactionType === "Usage"
                          ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                          : tx.transactionType === "Promotional Grant"
                          ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                          : tx.transactionType === "Refund"
                          ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                          : "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                      }`}
                    >
                      {tx.transactionType}
                    </span>
                  </td>

                  {/* Credit Change */}
                  <td
                    className={`py-3.5 px-4 font-bold ${
                      isPositive ? "text-[#10B981]" : "text-[#D97706]"
                    }`}
                  >
                    {formattedChange}
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4 text-[#777184] font-medium">
                    {tx.source}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-[#777184]">
                    {tx.date}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
