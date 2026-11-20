"use client";

import React from "react";
import { Eye } from "lucide-react";
import type { DetailedCreditTransaction } from "@/lib/ai-audit";

interface TransactionLedgerTableProps {
  transactions: DetailedCreditTransaction[];
  selectedTransactionId?: string;
  onSelectTransaction: (tx: DetailedCreditTransaction) => void;
}

export function TransactionLedgerTable({
  transactions,
  selectedTransactionId,
  onSelectTransaction,
}: TransactionLedgerTableProps) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/80 text-[#777184] font-semibold border-b border-[#EAE4EE]">
            <tr>
              <th className="py-3 px-4 font-semibold">Transaction ID</th>
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold">Transaction Type</th>
              <th className="py-3 px-4 font-semibold">Credit Change</th>
              <th className="py-3 px-4 font-semibold">Previous Balance</th>
              <th className="py-3 px-4 font-semibold">Resulting Balance</th>
              <th className="py-3 px-4 font-semibold">Source</th>
              <th className="py-3 px-4 font-semibold">Date &amp; Time</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-[#777184]">
                  No credit transactions match the selected filter criteria.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isPositive = tx.creditChange > 0;
                const isSelected = selectedTransactionId === tx.id;

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#FAF7F2] font-medium"
                        : "hover:bg-[#FAF7F2]/40"
                    }`}
                  >
                    {/* Transaction ID */}
                    <td className="py-3 px-4 font-medium text-[#24213A]">
                      {tx.id}
                    </td>

                    {/* User */}
                    <td className="py-3 px-4 font-medium text-[#24213A]">
                      {tx.userName}
                    </td>

                    {/* Transaction Type */}
                    <td className="py-3 px-4 text-[#24213A]">
                      {tx.transactionType}
                    </td>

                    {/* Credit Change */}
                    <td
                      className={`py-3 px-4 font-bold ${
                        isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}
                    >
                      {isPositive ? `+${tx.creditChange}` : `${tx.creditChange}`}
                    </td>

                    {/* Previous Balance */}
                    <td className="py-3 px-4 text-[#777184] font-medium">
                      {tx.previousBalance}
                    </td>

                    {/* Resulting Balance */}
                    <td className="py-3 px-4 font-bold text-[#24213A]">
                      {tx.resultingBalance}
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4 text-[#777184]">
                      {tx.source}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 text-[#777184] whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          tx.status === "Successful"
                            ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                            : tx.status === "Reversed"
                            ? "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
                            : tx.status === "Pending"
                            ? "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                            : "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    {/* Action (Eye Icon) */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx);
                        }}
                        title="Inspect Transaction Details"
                        className="p-1 rounded-lg text-[#7956C9] hover:bg-[#E8DFF5]/60 transition-colors inline-flex items-center justify-center cursor-pointer"
                      >
                        <Eye className="w-4 h-4 stroke-[2]" />
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
}
