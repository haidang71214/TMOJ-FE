"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Image,
  Chip,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import {
  Coins,
  ArrowLeft,
  ShoppingBag,
  History,
  CheckCircle2,
  Package,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useGetStoreItemDetailQuery, useBuyItemMutation } from "@/store/queries/store";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading, error } = useGetStoreItemDetailQuery(id);
  const [buyItem, { isLoading: isBuying }] = useBuyItemMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBuy = async () => {
    try {
      await buyItem({ itemId: id }).unwrap();
      toast.success("Successfully purchased!");
      router.push("/Coin?tab=inventory");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to purchase item");
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F0F2F5] dark:bg-[#0A0F1C]">
        <div className="w-12 h-12 border-4 border-[#FF5C00] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black italic uppercase text-[#071739] dark:text-white">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F0F2F5] dark:bg-[#0A0F1C]">
        <h1 className="text-2xl font-black italic uppercase text-[#071739] dark:text-white">Product Not Found</h1>
        <Button onPress={() => router.push("/Coin")} className="bg-[#FF5C00] text-white font-black uppercase italic">Back to Store</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] p-8 transition-colors duration-300 custom-scrollbar">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between">
          <Button
            variant="light"
            onPress={() => router.push("/Coin")}
            className="font-[1000] uppercase italic text-[10px] text-slate-500 hover:text-blue-600 dark:hover:text-[#00FF41] p-0 h-auto min-w-0 transition-colors"
            startContent={<ArrowLeft size={14} />}
          >
            Back to Store .
          </Button>

          <Breadcrumbs
            size="sm"
            classNames={{ list: "font-[1000] italic uppercase text-[10px]" }}
          >
            <BreadcrumbItem href="/Coin">Store</BreadcrumbItem>
            <BreadcrumbItem>{product.itemType} Detail</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        {/* MAIN DETAIL CARD */}
        <Card className="bg-white dark:bg-[#111c35] border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardBody className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Image Section */}
              <div className="p-6 bg-slate-50 dark:bg-black/20 flex items-center justify-center">
                <div className="relative group w-full aspect-square rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#111c35]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
              </div>

              {/* Right: Info Section */}
              <div className="p-8 flex flex-col justify-between gap-6">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <Chip
                      variant="flat"
                      size="sm"
                      className="font-[1000] uppercase italic text-[8px] text-blue-600 dark:text-[#00FF41] border-none bg-blue-50 dark:bg-green-500/10"
                    >
                      {product.itemType}
                    </Chip>
                    <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
                      {product.name}
                    </h1>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-black uppercase italic text-slate-400">
                    <span className="text-emerald-500">
                      {product.stockQuantity} In Stock
                    </span>
                    {product.durationDays && (
                      <>
                        <Divider orientation="vertical" className="h-3" />
                        <span>Duration: {product.durationDays} Days</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                    {product.description}
                  </p>

                  <div className="space-y-2">
                    {product.metaJson?.specs?.map((spec: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[9px] font-[1000] uppercase italic text-[#071739] dark:text-slate-300"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-blue-600 dark:text-[#00FF41]"
                        />{" "}
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-baseline gap-2">
                    <Coins
                      size={24}
                      className="text-[#FFB800]"
                      strokeWidth={3}
                    />
                    <span className="text-4xl font-[1000] italic text-[#FFB800]">
                      {product.priceCoin.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    isLoading={isBuying}
                    onPress={handleBuy}
                    className="w-full bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] uppercase italic h-14 rounded-2xl shadow-xl 
                                hover:bg-blue-600 dark:hover:bg-[#00FF41] dark:hover:text-[#071739] transition-all text-md"
                    startContent={!isBuying && <ShoppingBag size={20} />}
                  >
                    {isBuying ? "Processing..." : "Buy now"}
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* BOTTOM QUICK LINKS */}
        <div className="flex gap-4 justify-center pb-10">
          <Button
            variant="flat"
            onPress={() => router.push("/Coin")}
            className="w-40 h-12 bg-white dark:bg-[#111c35] rounded-full border-none shadow-sm px-6 group hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Package
                  size={18}
                  className="text-blue-600 dark:text-[#00FF41]"
                />
                <span className="text-[10px] font-[1000] uppercase italic text-[#071739] dark:text-white">
                  Store
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Button>

          <Button
            variant="flat"
            onPress={() => router.push("/Coin?tab=purchases")}
            className="w-40 h-12 bg-white dark:bg-[#111c35] rounded-full border-none shadow-sm px-6 group hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <History size={18} className="text-emerald-500" />
                <span className="text-[10px] font-[1000] uppercase italic text-[#071739] dark:text-white">
                  Orders
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Button>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
