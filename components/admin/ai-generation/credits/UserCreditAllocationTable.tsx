"use client";

import React, { useState } from "react";
import { Users, Search, MoreVertical, PlusCircle, History } from "lucide-react";
import type { UserCreditAccount } from "@/lib/ai-credits";
import { formatCredits } from "@/lib/ai-credits";

interface UserCreditAllocationTableProps {
  users: UserCreditAccount[];
  onSelectUserForAllocation: (user: UserCreditAccount) => void;
  onViewUserTransactions?: (user: UserCreditAccount) => void;
}

export function UserCreditAllocationTable({
  users,
  onSelectUserForAllocation,
  onViewUserTransactions,
}: UserCreditAllocationTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || u.status === statusFilter;
    const matchesPlan =
      planFilter === "All Plans" || u.planName === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#EAE4EE] shadow-2xs mb-6 overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE4EE]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DFF5] flex items-center justify-center text-[#7956C9] shrink-0">
            <Users className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h2 className="text-base font-bold text-[#24213A]">
            User Credit Allocation
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#777184] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs text-[#24213A] placeholder-[#777184] focus:outline-none focus:border-[#7956C9] focus:bg-white w-48 transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Status">All Status ▾</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Plans filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF7F2] border border-[#EAE4EE] rounded-xl text-xs font-semibold text-[#24213A] focus:outline-none focus:border-[#7956C9] cursor-pointer"
          >
            <option value="All Plans">All Plans ▾</option>
            <option value="Starter">Starter</option>
            <option value="Creator">Creator</option>
            <option value="Professional">Professional</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2]/60 text-[#777184] font-semibold border-b border-[#EAE4EE]">
            <tr>
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-4">Account / Email</th>
              <th className="py-3 px-4">Purchased Credits</th>
              <th className="py-3 px-4">Promotional Credits</th>
              <th className="py-3 px-4">Admin Granted</th>
              <th className="py-3 px-4">Credits Used</th>
              <th className="py-3 px-4">Available Balance</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE4EE]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#777184]">
                  No users found matching the selected criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-[#FAF7F2]/40 transition-colors">
                  {/* User Avatar + Name */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#E8DFF5] text-[#7956C9] font-bold text-xs flex items-center justify-center shrink-0 border border-[#D5C2EE]">
                        {user.avatarInitials}
                      </div>
                      <span className="font-bold text-[#24213A] whitespace-nowrap">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Account / Email */}
                  <td className="py-3.5 px-4 text-[#777184] font-medium">
                    {user.email}
                  </td>

                  {/* Purchased Credits */}
                  <td className="py-3.5 px-4 font-semibold text-[#24213A]">
                    {formatCredits(user.purchasedCredits)}
                  </td>

                  {/* Promotional Credits */}
                  <td className="py-3.5 px-4 font-semibold text-[#24213A]">
                    {formatCredits(user.promotionalCredits)}
                  </td>

                  {/* Admin Granted */}
                  <td className="py-3.5 px-4 font-semibold text-[#24213A]">
                    {formatCredits(user.adminGrantedCredits)}
                  </td>

                  {/* Credits Used */}
                  <td className="py-3.5 px-4 font-semibold text-[#24213A]">
                    {formatCredits(user.creditsUsed)}
                  </td>

                  {/* Available Balance */}
                  <td className="py-3.5 px-4 font-bold text-[#24213A]">
                    {formatCredits(user.availableBalance)}
                  </td>

                  {/* Actions (Three dots menu) */}
                  <td className="py-3.5 px-5 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === user.userId ? null : user.userId)
                      }
                      title="User Actions"
                      className="p-1 rounded-lg text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Popover Menu */}
                    {activeMenuId === user.userId && (
                      <div className="absolute right-5 top-full mt-1 w-44 bg-white rounded-xl border border-[#EAE4EE] shadow-lg py-1.5 z-20 text-xs text-left">
                        <button
                          onClick={() => {
                            onSelectUserForAllocation(user);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-[#FAF7F2] text-[#24213A] flex items-center gap-2 font-medium"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-[#7956C9]" />
                          <span>Allocate Credits</span>
                        </button>
                        {onViewUserTransactions && (
                          <button
                            onClick={() => {
                              onViewUserTransactions(user);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-[#FAF7F2] text-[#24213A] flex items-center gap-2 font-medium"
                          >
                            <History className="w-3.5 h-3.5 text-[#777184]" />
                            <span>View Transactions</span>
                          </button>
                        )}
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
          Showing 1 to {filteredUsers.length} of {users.length} users
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
