"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react"; // Thêm Suspense
import {
  Card,
  CardBody,
  Button,
  Progress,
  Chip,
  Tabs,
  Tab,
  Image,
  Pagination,
  Select,
  SelectItem,
  Input,
  useDisclosure,
} from "@heroui/react";
import {
  Coins,
  Flame,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  History,
  ShoppingBasket,
  Filter,
  Search,
  PlusCircle,
  CalendarDays,
} from "lucide-react";
import DepositModal from "../components/DeposiModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

/* ===== MOCK DATA GIỮ NGUYÊN ===== */
const WALLET_DATA = {
  coins: 12500,
  level: 7,
  exp: 320,
  expNext: 500,
  currentStreak: 5,
};
const SHOP_ITEMS = [
  {
    id: 1,
    name: "TMOJ Pro Mouse",
    price: 5000,
    category: "Gear",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070",
    sales: 120,
    date: "2026-01-20",
  },
  {
    id: 2,
    name: "Noise Cancelling Headset",
    price: 8500,
    category: "Audio",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070",
    sales: 85,
    date: "2026-01-22",
  },
  {
    id: 3,
    name: "TMOJ Oversized Tee",
    price: 3000,
    category: "Fashion",
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974",
    sales: 300,
    date: "2026-01-15",
  },
  {
    id: 4,
    name: "Precision Mousepad",
    price: 1500,
    category: "Gear",
    img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965",
    sales: 450,
    date: "2026-01-10",
  },
  {
    id: 5,
    name: "Algorithm Master Cap",
    price: 2000,
    category: "Fashion",
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=2070",
    sales: 150,
    date: "2026-01-24",
  },
];
const EARNINGS_HISTORY = [
  {
    id: 1,
    amount: +50,
    exp: +20,
    reason: "Solved Problem: Two Sum",
    time: "2026-01-25 10:15",
    isStreak: false,
  },
  {
    id: 2,
    amount: +100,
    exp: +50,
    reason: "Streak Bonus: 5 Days Row!",
    time: "2026-01-24 07:30",
    isStreak: true,
  },
  {
    id: 3,
    amount: +500,
    exp: +150,
    reason: "Contest Rank #5: Spring 2026",
    time: "2026-01-24 18:00",
    isStreak: false,
  },
];
const PURCHASE_HISTORY = [
  {
    id: 1,
    item: "TMOJ Oversized Tee",
    amount: 3000,
    time: "2026-01-20 14:20",
    status: "Delivering",
  },
  {
    id: 2,
    item: "Precision Mousepad",
    amount: 1500,
    time: "2026-01-15 09:10",
    status: "Completed",
  },
];

// Tạo một component con để sử dụng useSearchParams (vì Next.js yêu cầu bọc Suspense khi dùng hook này)
function CoinShopContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("shop");
  const [filterType, setFilterType] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setMounted(true);
    // LOGIC QUAN TRỌNG: Kiểm tra tham số tab trên URL
    const tab = searchParams.get("tab");
    if (tab === "purchases") {
      setSelectedTab("purchases");
    } else if (tab === "earnings") {
      setSelectedTab("earnings");
    }
  }, [searchParams]);

  const { paginatedItems, totalPages } = useMemo(() => {
    const filtered = SHOP_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sorted = [...filtered];
    switch (filterType) {
      case "latest":
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "bestseller":
        sorted.sort((a, b) => b.sales - a.sales);
        break;
      case "low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high":
        sorted.sort((a, b) => b.price - a.price);
        break;
    }
    const start = (page - 1) * rowsPerPage;
    return {
      paginatedItems: sorted.slice(start, start + rowsPerPage),
      totalPages: Math.ceil(sorted.length / rowsPerPage),
    };
  }, [searchQuery, filterType, page]);

  if (!mounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 text-[#071739] dark:text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-[1000] italic tracking-tighter uppercase leading-none">
          REWARDS <span className="text-[#FF5C00]">CENTER</span>
        </h1>
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic leading-none">
          USE YOUR EARNED COINS FOR EXCLUSIVE GEAR
        </p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35]">
          <CardBody className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Coins className="text-[#FFB800]" size={18} />
              <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
                Balance
              </p>
            </div>
            <p className="text-4xl font-[1000] text-[#FFB800] italic leading-none">
              {WALLET_DATA.coins.toLocaleString()}
            </p>
          </CardBody>
        </Card>

        <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35]">
          <CardBody className="p-6 space-y-3">
            <div className="flex justify-between items-center text-purple-500">
              <div className="flex items-center gap-2">
                <Trophy size={18} />
                <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
                  Level {WALLET_DATA.level}
                </p>
              </div>
              <span className="text-[9px] font-black">
                {WALLET_DATA.exp}/{WALLET_DATA.expNext} EXP
              </span>
            </div>
            <Progress
              size="sm"
              value={(WALLET_DATA.exp / WALLET_DATA.expNext) * 100}
              classNames={{
                indicator: "bg-purple-500",
                track: "bg-slate-100 dark:bg-white/10",
              }}
              className="h-1.5"
            />
          </CardBody>
        </Card>

        <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35]">
          <CardBody className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#FF5C00]">
              <Flame size={18} />
              <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
                Streak
              </p>
            </div>
            <p className="text-4xl font-[1000] text-[#FF5C00] italic leading-none">
              {WALLET_DATA.currentStreak} DAYS
            </p>
          </CardBody>
        </Card>
      </div>

      {/* MAIN TABS */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => {
          setSelectedTab(key as string);
          setPage(1);
        }}
        variant="underlined"
        classNames={{
          cursor: "bg-[#FF5C00]",
          tab: "font-black uppercase italic text-sm h-12 mr-6 transition-all",
          tabContent:
            "group-data-[selected=true]:text-[#FF5C00] dark:text-slate-400 group-data-[selected=true]:dark:text-white",
        }}
      >
        <Tab
          key="shop"
          title={
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <span>Coin Shop</span>
            </div>
          }
        >
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                placeholder="Search product..."
                startContent={<Search size={18} className="text-slate-400" />}
                className="max-w-xs font-bold italic"
                value={searchQuery}
                onValueChange={setSearchQuery}
                classNames={{
                  inputWrapper:
                    "bg-white dark:bg-[#111c35] rounded-lg h-11 border border-divider shadow-none",
                }}
              />
              <Select
                placeholder="Sort by"
                className="max-w-[160px]"
                size="sm"
                variant="flat"
                startContent={<Filter size={14} className="text-slate-400" />}
                onSelectionChange={(keys) =>
                  setFilterType(Array.from(keys)[0] as string)
                }
                classNames={{
                  trigger:
                    "bg-white dark:bg-[#111c35] rounded-lg border-divider h-11 font-bold italic text-[#071739] dark:text-white",
                }}
              >
                <SelectItem key="latest">Latest Arrivals</SelectItem>
                <SelectItem key="bestseller">Best Sellers</SelectItem>
                <SelectItem key="low">Price: Low to High</SelectItem>
                <SelectItem key="high">Price: High to Low</SelectItem>
              </Select>
              <Button
                className="bg-[#FF5C00] text-white font-black uppercase italic rounded-lg h-11 px-6 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                startContent={<PlusCircle size={18} strokeWidth={3} />}
                onPress={onOpen}
              >
                Deposit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
              {paginatedItems.map((item) => (
                <Link
                  href={`/Coin/Product/${item.id}`}
                  key={item.id}
                  className="group"
                >
                  <Card className="bg-white dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-xl shadow-sm transition-all h-full hover:border-blue-600 dark:hover:border-[#00FF41] hover:-translate-y-1 overflow-hidden">
                    <CardBody className="p-0">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={item.img}
                          alt={item.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />
                        <Chip className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white border-none font-black text-[8px] uppercase italic">
                          {item.category}
                        </Chip>
                      </div>
                      <div className="p-5 space-y-4">
                        <h4 className="text-sm font-[1000] uppercase italic leading-tight group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between border-t border-divider dark:border-white/5 pt-4">
                          <div className="flex items-center gap-1.5 text-[#FFB800]">
                            <Coins size={16} strokeWidth={3} />
                            <span className="text-xl font-[1000] italic">
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black uppercase italic rounded-lg h-9 hover:bg-blue-600 dark:hover:border-[#00FF41] dark:hover:text-[#071739] transition-all"
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="flex justify-center pb-8">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                classNames={{
                  cursor:
                    "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic",
                }}
              />
            </div>
          </div>
        </Tab>

        {/* REWARDS LOG */}
        <Tab
          key="earnings"
          title={
            <div className="flex items-center gap-2">
              <History size={18} />
              <span>Rewards Log</span>
            </div>
          }
        >
          <div className="mt-6 space-y-4 pb-8">
            {EARNINGS_HISTORY.map((h) => (
              <Card
                key={h.id}
                className="bg-white dark:bg-[#111c35] border-none shadow-sm rounded-xl overflow-hidden group hover:border-l-4 hover:border-blue-600 dark:hover:border-[#00FF41] transition-all"
              >
                <CardBody className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                        h.isStreak
                          ? "bg-orange-500/10 text-[#FF5C00]"
                          : "bg-emerald-500/10 text-[#00FF41]"
                      }`}
                    >
                      {h.isStreak ? (
                        <CalendarDays size={20} strokeWidth={3} />
                      ) : (
                        <ArrowUpRight size={20} strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <p className="font-black uppercase italic text-sm leading-none group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                        {h.reason} {h.isStreak && "🔥"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic tracking-widest">
                        {h.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#FFB800] font-[1000] italic text-lg leading-none">
                      +{h.amount} Coins
                    </p>
                    <p className="text-blue-500 dark:text-blue-400 font-black italic text-[9px] uppercase mt-1">
                      +{h.exp} EXP
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        {/* MY ORDERS */}
        <Tab
          key="purchases"
          title={
            <div className="flex items-center gap-2">
              <ShoppingBasket size={18} />
              <span>My Orders</span>
            </div>
          }
        >
          <div className="mt-6 space-y-4 pb-8">
            {PURCHASE_HISTORY.map((p) => (
              <Card
                key={p.id}
                className="bg-white dark:bg-[#111c35] border-none shadow-sm rounded-xl group hover:border-l-4 hover:border-blue-600 dark:hover:border-red-500 transition-all"
              >
                <CardBody className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                      <ArrowDownRight size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-black uppercase italic text-sm leading-none group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                        {p.item}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic tracking-widest">
                        {p.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-slate-500 dark:text-slate-300 font-[1000] italic text-lg">
                      -{p.amount.toLocaleString()}
                    </span>
                    <Chip
                      variant="flat"
                      color={p.status === "Delivering" ? "warning" : "success"}
                      className="font-black uppercase italic text-[9px] rounded-lg h-7 border-none"
                    >
                      {p.status}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>
      <DepositModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}

// Export component chính bọc trong Suspense
export default function CoinShopPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] p-8 transition-colors duration-300 custom-scrollbar">
      <Suspense fallback={<div>Loading...</div>}>
        <CoinShopContent />
      </Suspense>
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
