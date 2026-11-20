"use client";

import React, { useState } from "react";
import { Users, Search } from "lucide-react";
import type { UserUsageRecord } from "@/lib/ai-analytics";

interface UserUsageTableProps {
  users: UserUsageRecord[];
}

export function UserUsageTable({ users }: UserUsageTableProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = users.filter((u) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    return u.user.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q);
  });

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "24px",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header + Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <Users className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#24213A]">
              User Usage Analytics
            </h2>
            <p className="text-xs text-[#777184] font-medium">
              Top users by image generation
            </p>
          </div>
        </div>

        <div className="relative w-36 sm:w-44">
          <Search className="w-3.5 h-3.5 text-[#777184] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter user..."
            className="w-full pl-8 pr-2.5 py-1 bg-[#FAF7F2] border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#EAE4EE] rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF7F2] text-[#777184] font-semibold border-b border-[#EAE4EE]">
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3 text-right">Total Generations</th>
              <th className="py-2.5 px-3 text-right">Credits Consumed</th>
              <th className="py-2.5 px-3 text-right">Successful</th>
              <th className="py-2.5 px-3 text-right">Failed</th>
              <th className="py-2.5 px-3 text-right">Last Generation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {filtered.slice(0, 3).map((usr) => (
              <tr
                key={usr.userId}
                className="hover:bg-[#FAF7F2]/50 transition-colors text-[#24213A]"
              >
                <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-[#7956C9] font-bold text-[10px] flex items-center justify-center">
                    {usr.user.charAt(0).toUpperCase()}
                  </div>
                  <span>{usr.user}</span>
                </td>
                <td className="py-2.5 px-3 text-right font-medium">
                  {usr.totalGenerations.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-medium">
                  {usr.creditsConsumed.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[#10B981]">
                  {usr.successful.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[#EF4444]">
                  {usr.failed.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-[#777184]">
                  {usr.lastGeneration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
