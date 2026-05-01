"use client";

import React from "react";
import { useGetWalletBalanceQuery } from "@/store/queries/wallet";
import { Coins } from "lucide-react";
import { Tooltip, NavbarItem } from "@heroui/react";
import { useModal } from "./ModalProvider";
import { DepositContent } from "@/app/components/DeposiModal";

export default function CoinBalanceInNavbar() {
  const { data: walletData, isLoading } = useGetWalletBalanceQuery();
  const { openModal, closeModal } = useModal();

  if (isLoading) return (
    <NavbarItem className="hidden sm:flex">
      <div className="h-9 w-24 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
    </NavbarItem>
  );

  return (
    <NavbarItem className="hidden sm:flex">
      <Tooltip content="TMOJ Gold Coins" className="font-bold text-[10px] uppercase tracking-widest">
        <div
          onClick={() => openModal({ content: <DepositContent onClose={closeModal} />, size: "lg" })}
          className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-100 dark:border-orange-500/20 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Coins size={12} />
          </div>
          <span className="text-[13px] font-black italic text-orange-600 dark:text-orange-400">
            {walletData?.toLocaleString() || 0}
          </span>
        </div>
      </Tooltip>
    </NavbarItem>
  );
}
