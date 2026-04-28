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
  Input,
} from "@heroui/react";
import { Crown, ChevronRight, CreditCard, Zap } from "lucide-react";
import { useCreatePayOsPaymentMutation } from "@/store/queries/payment";
import { toast } from "sonner";

interface DepositModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function DepositModal({ isOpen, onOpenChange }: DepositModalProps) {
  const [amount, setAmount] = React.useState<string>("10000");
  const [createPayOsPayment, { isLoading }] = useCreatePayOsPaymentMutation();

  const handleDeposit = async () => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount < 10000) {
      toast.error("Minimum deposit is 10,000 VND");
      return;
    }
    try {
      const response = await createPayOsPayment({ amount: numAmount }).unwrap();
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create payment request");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      backdrop="blur"
      placement="top"
      hideCloseButton={true}
      classNames={{
        wrapper: "z-[9999]",
        backdrop: "z-[9998] bg-[#071739]/50 backdrop-blur-md",
        base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] my-8",
        header: "border-b border-divider dark:border-white/5",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2 className="text-2xl font-[1000] italic uppercase text-[#071739] dark:text-white">
                DEPOSIT <span className="text-[#FF5C00]">TMOJ COINS</span>
              </h2>
            </ModalHeader>

            <ModalBody className="py-6 overflow-y-auto custom-scrollbar">
              {/* BANNER */}
              <div className="relative w-full h-36 rounded-3xl overflow-hidden mb-6 group border border-divider dark:border-white/5 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000"
                  alt="Deposit Banner"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071739] via-[#071739]/40 to-transparent flex flex-col justify-center items-center text-white z-10 p-6 text-center">
                  <p className="font-black italic text-[10px] uppercase tracking-[0.3em] text-[#FF5C00] mb-1">
                    Instant Deposit
                  </p>
                  <h3 className="text-3xl font-[1000] italic uppercase leading-none drop-shadow-lg">
                    1,000 VND <span className="text-xl mx-2 text-slate-300">=</span> 1,000 COINS
                  </h3>
                </div>
              </div>

              {/* MEMBERSHIP BANNER */}
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-500/40">
                    <Crown size={20} />
                  </div>
                  <div>
                    <h4 className="font-[1000] italic uppercase text-xs text-amber-700 dark:text-amber-400">
                      Buy Membership Plan
                    </h4>
                    <p className="text-[9px] font-bold uppercase text-amber-600/70 dark:text-amber-500/70">
                      Step 1: Deposit → Step 2: Buy Plan
                    </p>
                  </div>
                </div>
                <Button
                  as={Link}
                  href="/Premium"
                  size="sm"
                  className="bg-amber-500 text-white font-[1000] uppercase italic rounded-xl px-4 shadow-md hover:bg-amber-600"
                  endContent={<ChevronRight size={14} />}
                >
                  Plans
                </Button>
              </div>

              {/* PAYOS SECTION */}
              <div className="p-6 bg-[#00c853]/5 dark:bg-[#00c853]/10 rounded-[2.5rem] border border-[#00c853]/20 flex flex-col items-center gap-5">
                {/* Logo / Label */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-[#00c853] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                    <Zap size={28} />
                  </div>
                  <h4 className="font-[1000] italic uppercase text-lg text-[#00c853]">
                    Pay with PayOS
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center">
                    QR Code · ATM · Internet Banking · E-Wallet
                  </p>
                </div>

                {/* Amount Input */}
                <div className="w-full max-w-xs space-y-2">
                  <Input
                    type="number"
                    label="Amount (VND)"
                    placeholder="10,000"
                    value={amount}
                    onValueChange={setAmount}
                    min={10000}
                    variant="bordered"
                    classNames={{
                      label: "font-bold italic text-slate-400",
                      input: "font-[1000] italic text-lg",
                      inputWrapper: "rounded-2xl border-divider dark:border-white/10 h-14",
                    }}
                  />
                  <p className="text-[10px] font-black uppercase text-[#00c853]/60 italic tracking-widest text-left px-2">
                    Minimum deposit: 10,000 VND
                  </p>
                </div>

                {/* Button */}
                <Button
                  className="bg-[#00c853] text-white font-[1000] uppercase italic rounded-2xl px-10 h-12 shadow-xl shadow-green-500/20 hover:scale-105 transition-all w-full"
                  isLoading={isLoading}
                  onClick={handleDeposit}
                  startContent={!isLoading && <CreditCard size={18} />}
                >
                  Deposit Now
                </Button>
              </div>
            </ModalBody>

            <ModalFooter className="pb-6 pt-3">
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
