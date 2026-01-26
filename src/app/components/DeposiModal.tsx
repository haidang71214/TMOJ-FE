"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Link,
} from "@heroui/react";
import {
  Copy,
  AlertCircle,
  QrCode,
  Info,
  Crown,
  ChevronRight,
} from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function DepositModal({
  isOpen,
  onOpenChange,
}: DepositModalProps) {
  const accountInfo = {
    bank: "MB BANK",
    number: "0345678999",
    name: "NGUYEN DUY RIM",
    content: "TMOJ DEPOSIT [USER_ID]",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="blur"
      placement="top"
      hideCloseButton={true}
      classNames={{
        wrapper: "z-[9999]",
        backdrop: "z-[9998] bg-[#071739]/50 backdrop-blur-md",
        base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] my-8",
        header: "border-b border-divider dark:border-white/5",
        closeButton:
          "hover:bg-[#FF5C00]/10 hover:text-[#FF5C00] transition-all",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-[1000] italic uppercase text-[#071739] dark:text-white">
                DEPOSIT <span className="text-[#FF5C00]">TMOJ COINS</span>
              </h2>
            </ModalHeader>
            <ModalBody className="py-6 overflow-y-auto custom-scrollbar">
              {/* ENHANCED BANNER */}
              <div className="relative w-full h-44 rounded-3xl overflow-hidden mb-8 group border border-divider dark:border-white/5 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000"
                  alt="Deposit Banner"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071739] via-[#071739]/40 to-transparent flex flex-col justify-center items-center text-white z-10 p-6 text-center">
                  <p className="font-black italic text-[10px] uppercase tracking-[0.3em] text-[#FF5C00] mb-2">
                    Automated Payment
                  </p>
                  <h3 className="text-4xl font-[1000] italic uppercase leading-none drop-shadow-lg">
                    1,000 VND{" "}
                    <span className="text-xl mx-2 text-slate-300">=</span> 1,000
                    COINS
                  </h3>
                </div>
              </div>

              {/* MEMBERSHIP SECTION (Dẫn đến /Premium) */}
              <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-[2rem] border border-amber-200 dark:border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/40">
                    <Crown size={24} />
                  </div>
                  <div>
                    <h4 className="font-[1000] italic uppercase text-sm text-amber-700 dark:text-amber-400">
                      Buy Membership Plan
                    </h4>
                    <p className="text-[10px] font-bold uppercase text-amber-600/70 dark:text-amber-500/70">
                      Step 1: Deposit Coins → Step 2: Buy Plan
                    </p>
                  </div>
                </div>
                <Button
                  as={Link}
                  href="/Premium"
                  className="bg-amber-500 text-white font-[1000] uppercase italic rounded-xl px-6 h-10 shadow-md hover:bg-amber-600"
                  endContent={<ChevronRight size={16} />}
                >
                  View Plans
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 mb-6">
                {/* ACCOUNT INFO */}
                <div className="space-y-4">
                  <h4 className="font-[1000] italic uppercase text-[10px] text-slate-400 flex items-center gap-2 tracking-widest">
                    <Info size={14} className="text-blue-500" /> TRANSFER
                    DETAILS
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "BANKING", value: accountInfo.bank },
                      { label: "ACCOUNT NO.", value: accountInfo.number },
                      { label: "RECIPIENT", value: accountInfo.name },
                      { label: "REFERENCE", value: accountInfo.content },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-divider dark:border-white/5 flex justify-between items-center group transition-all"
                      >
                        <div className="overflow-hidden">
                          <p className="text-[9px] font-black text-slate-400 uppercase italic leading-none mb-2">
                            {item.label}
                          </p>
                          <p className="text-xs font-[1000] uppercase text-[#071739] dark:text-white truncate">
                            {item.value}
                          </p>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-white dark:bg-white/5 text-slate-400 hover:text-[#FF5C00] rounded-xl"
                          onClick={() => copyToClipboard(item.value)}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR CODE */}
                <div className="flex flex-col items-center gap-5">
                  <h4 className="font-[1000] italic uppercase text-[10px] text-slate-400 flex items-center gap-2 w-full tracking-widest">
                    <QrCode size={14} className="text-[#FF5C00]" /> QUICK SCAN
                    (VIETQR)
                  </h4>
                  <div className="p-5 bg-white rounded-[2rem] shadow-xl border-4 border-[#FF5C00]/10">
                    <Image
                      src={`https://api.vietqr.io/image/970422-0345678999-mUInGfP.jpg?accountName=NGUYEN%20DUY%20RIM&amount=50000&addInfo=${encodeURIComponent(
                        accountInfo.content
                      )}`}
                      alt="Payment QR"
                      width={200}
                    />
                  </div>
                </div>
              </div>

              {/* IMPORTANT NOTES (Dài ngang ra) */}
              <div className="bg-blue-50 dark:bg-blue-500/5 p-5 rounded-[2rem] border border-blue-100 dark:border-blue-500/10 flex flex-col gap-3 shadow-inner mx-2">
                <div className="flex items-center gap-2 border-b border-blue-200/50 dark:border-blue-500/20 pb-2">
                  <AlertCircle size={18} className="text-blue-500" />
                  <h4 className="font-[1000] italic uppercase text-[10px] text-blue-700 dark:text-blue-400 tracking-widest">
                    Important Notes
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                  {[
                    "Enter the EXACT Reference content",
                    "Wait 1-5 minutes for processing",
                    "Avoid transfers at 23:59 (Bank Sync)",
                    "Support Contact: Meiying",
                  ].map((note, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      <p className="text-[10px] font-bold text-blue-900/70 dark:text-blue-300/70 uppercase italic tracking-tight">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="pb-8 pt-4">
              <Button
                variant="light"
                onPress={onClose}
                className="font-black uppercase italic text-xs px-8"
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
