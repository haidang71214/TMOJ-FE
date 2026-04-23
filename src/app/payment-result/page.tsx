"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { useGetVNPayCallbackQuery } from "@/store/queries/payment";
import Link from "next/link";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Các tham số có thể có từ VNPay hoặc từ Backend redirect
  const vnp_TxnRef = searchParams.get("vnp_TxnRef") || searchParams.get("paymentId");
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode") || (searchParams.get("status") === "success" ? "00" : "99");

  const { data, isLoading, isError } = useGetVNPayCallbackQuery(
    { vnp_TxnRef: vnp_TxnRef || "", vnp_ResponseCode: vnp_ResponseCode || "" },
    { skip: !vnp_TxnRef }
  );

  if (!vnp_TxnRef) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle size={64} className="text-danger" />
        <h1 className="text-2xl font-bold">Invalid Payment Information</h1>
        <Button as={Link} href="/Coin" color="primary">Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-4">
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#111c35]">
        <CardBody className="p-10 flex flex-col items-center text-center gap-6">
          {isLoading ? (
            <>
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-[1000] italic uppercase text-[#071739] dark:text-white">
                Verifying <span className="text-blue-500">Payment</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold italic">
                Please wait while we confirm your transaction with VNPay...
              </p>
            </>
          ) : isError || vnp_ResponseCode !== "00" ? (
            <>
              <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mb-4">
                <XCircle size={40} className="text-danger" />
              </div>
              <h2 className="text-2xl font-[1000] italic uppercase text-[#071739] dark:text-white">
                Payment <span className="text-danger">Failed</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold italic">
                Your payment could not be processed. Please try again later.
              </p>
              <div className="w-full space-y-3 mt-4">
                <Button
                  as={Link}
                  href="/Coin"
                  className="w-full bg-[#071739] dark:bg-white text-white dark:text-[#071739] font-black uppercase italic h-12 rounded-2xl"
                >
                  Try Again
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 size={40} className="text-success" />
              </div>
              <h2 className="text-2xl font-[1000] italic uppercase text-[#071739] dark:text-white">
                Payment <span className="text-success">Successful</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold italic">
                Your coins have been added to your wallet. Thank you for your purchase!
              </p>

              <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl w-full text-left space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-400">
                  <span>Transaction ID</span>
                  <span className="text-[#071739] dark:text-white">{vnp_TxnRef}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-400">
                  <span>Status</span>
                  <span className="text-success">COMPLETED</span>
                </div>
              </div>

              <div className="w-full space-y-3 mt-4">
                <Button
                  as={Link}
                  href="/Coin"
                  className="w-full bg-[#FF5C00] text-white font-black uppercase italic h-12 rounded-2xl shadow-lg shadow-orange-500/20"
                  endContent={<ArrowRight size={18} />}
                >
                  Go to Rewards Center
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex items-center justify-center p-4">
      <Suspense fallback={<Spinner size="lg" />}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
