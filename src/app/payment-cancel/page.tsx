"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#111c35]">
        <CardBody className="p-10 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <XCircle size={40} className="text-warning" />
          </div>

          <h2 className="text-2xl font-[1000] italic uppercase text-[#071739] dark:text-white">
            Payment <span className="text-warning">Cancelled</span>
          </h2>

          <p className="text-slate-500 dark:text-slate-400 font-bold italic">
            You cancelled the payment. No coins were deducted from your wallet.
          </p>

          {orderCode && (
            <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl w-full text-left space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-400">
                <span>Order Code</span>
                <span className="text-[#071739] dark:text-white">{orderCode}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-400">
                <span>Status</span>
                <span className="text-warning">CANCELLED</span>
              </div>
            </div>
          )}

          <div className="w-full space-y-3 mt-2">
            <Button
              as={Link}
              href="/Coin"
              className="w-full bg-[#FF5C00] text-white font-black uppercase italic h-12 rounded-2xl shadow-lg shadow-orange-500/20"
              startContent={<RotateCcw size={16} />}
            >
              Try Again
            </Button>
            <Button
              as={Link}
              href="/"
              variant="light"
              className="w-full font-black uppercase italic h-12 rounded-2xl"
              startContent={<ArrowLeft size={16} />}
            >
              Back to Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex items-center justify-center p-4">
      <Suspense fallback={<Spinner size="lg" />}>
        <PaymentCancelContent />
      </Suspense>
    </div>
  );
}
