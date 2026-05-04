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
  const [deduction, setDeduction] = React.useState<number | null>(null);
  const [isShaking, setIsShaking] = React.useState(false);

  React.useEffect(() => {
    const handleDeduction = (e: any) => {
      setDeduction(e.detail.amount);
      setIsShaking(true);
      // Reset sau 2 giây để có thể chạy lại lần sau
      setTimeout(() => {
        setDeduction(null);
        setIsShaking(false);
      }, 2000);
    };

    window.addEventListener("coin-deducted", handleDeduction);
    return () => window.removeEventListener("coin-deducted", handleDeduction);
  }, []);

  if (isLoading) return (
    <NavbarItem className="hidden sm:flex">
      <div className="h-9 w-24 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
    </NavbarItem>
  );

  return (
    <NavbarItem className="hidden sm:flex relative">
      <Tooltip content="TMOJ Gold Coins" className="font-bold text-[10px] uppercase tracking-widest">
        <div
          id="navbar-coin-balance"
          onClick={() => openModal({ content: <DepositContent onClose={closeModal} />, size: "lg" })}
          className={`flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-100 dark:border-orange-500/20 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group ${isShaking ? "animate-shake border-red-500/50 shadow-lg shadow-red-500/20" : ""}`}
        >
          <div className={`w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${isShaking ? "bg-red-500" : ""}`}>
            <Coins size={12} />
          </div>
          <span className={`text-[13px] font-black italic transition-colors ${isShaking ? "text-red-500" : "text-orange-600 dark:text-orange-400"}`}>
            {walletData?.toLocaleString() || 0}
          </span>
        </div>
      </Tooltip>

      {/* Hiệu ứng mất hồn khi bị trừ tiền */}
      {deduction && (
        <div className="absolute top-0 right-4 pointer-events-none z-50">
          <span className="text-red-500 font-black italic text-sm animate-ghost-fly whitespace-nowrap">
            -{deduction} COINS
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes ghostFly {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          20% {
            transform: translateY(-10px) scale(1.2) rotate(-5deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.8) rotate(15deg);
            opacity: 0;
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-ghost-fly {
          animation: ghostFly 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </NavbarItem>
  );
}
