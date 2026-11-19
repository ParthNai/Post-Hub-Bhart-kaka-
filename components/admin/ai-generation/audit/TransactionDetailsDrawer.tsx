"use client";

import React from "react";
import { X, Coins, Sparkles, Check } from "lucide-react";
import type { DetailedCreditTransaction } from "@/lib/ai-audit";

interface TransactionDetailsDrawerProps {
  transaction: DetailedCreditTransaction | null;
  onClose: () => void;
}

export function TransactionDetailsDrawer({
  transaction,
  onClose,
}: TransactionDetailsDrawerProps) {
  if (!transaction) return null;

  const isPositive = transaction.creditChange > 0;

  return (
    <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 bg-white border border-[#EAE4EE] rounded-2xl p-5 shadow-2xs self-start space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE4EE]">
        <h3 className="text-sm font-bold text-[#24213A]">
          Transaction Details
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Top Card */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <Coins className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#24213A]">
              {transaction.id}
            </h4>
            <p className="text-[11px] text-[#777184]">
              {transaction.transactionType}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            transaction.status === "Successful"
              ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
              : transaction.status === "Reversed"
              ? "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
              : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
          }`}
        >
          {transaction.status}
        </span>
      </div>

      {/* Key-Value Details */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">User Name:</span>
          <span className="font-bold text-[#24213A] text-right">
            {transaction.userName}
          </span>
        </div>

        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">Account ID:</span>
          <span className="font-mono text-[#24213A] text-right">
            {transaction.userId}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-[#777184]">Transaction Type:</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F2] text-[#7956C9] border border-[#E8DFF5]">
            {transaction.transactionType}
          </span>
        </div>

        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">Credit Amount:</span>
          <span
            className={`font-bold ${
              isPositive ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {isPositive ? `+${transaction.creditChange}` : `${transaction.creditChange}`} Credits
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-[#777184]">Credit Source:</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#24213A]">
            <Sparkles className="w-3 h-3 text-[#7956C9]" />
            <span>{transaction.source === "Generation" ? "AI Generation" : transaction.source}</span>
          </span>
        </div>

        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">Previous Balance:</span>
          <span className="font-medium text-[#777184]">
            {transaction.previousBalance}
          </span>
        </div>

        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">Resulting Balance:</span>
          <span className="font-bold text-[#24213A]">
            {transaction.resultingBalance}
          </span>
        </div>

        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">Transaction Time:</span>
          <span className="text-[#777184] text-right font-medium">
            {transaction.fullDateTime}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-[#777184]">Status:</span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
              transaction.status === "Successful"
                ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                : "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
            }`}
          >
            {transaction.status}
          </span>
        </div>

        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">Related Request:</span>
          <span className="font-mono text-[11px] font-medium text-[#7956C9]">
            {transaction.relatedRequest || "—"}
          </span>
        </div>

        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[#777184]">Administrator:</span>
          <span className="text-[#777184]">
            {transaction.administrator || "—"}
          </span>
        </div>

        <div className="pt-1 space-y-1">
          <span className="text-[#777184] block">Note:</span>
          <p className="text-[11px] text-[#24213A] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE4EE] leading-relaxed">
            {transaction.note}
          </p>
        </div>
      </div>

      {/* Credit Movement Timeline */}
      <div className="pt-2 border-t border-[#EAE4EE] space-y-3">
        <h4 className="text-xs font-bold text-[#24213A]">
          Credit Movement Timeline
        </h4>

        <div className="relative pl-6 space-y-4">
          {/* Vertical connecting line */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#7956C9]/30" />

          {transaction.timeline.map((step) => (
            <div key={step.id} className="relative flex items-start gap-3">
              {/* Checkmark circle node */}
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#7956C9] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#24213A] leading-tight">
                  {step.title}
                </p>
                <p className="text-[10px] text-[#777184] mt-0.5">
                  {step.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
