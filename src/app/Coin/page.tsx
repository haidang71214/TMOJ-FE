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
  CheckCircle2,
} from "lucide-react";
import DepositModal from "../components/DeposiModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { useGetWalletBalanceQuery, useGetWalletTransactionsQuery } from "@/store/queries/wallet";
import { useGetPaymentHistoryMeQuery } from "@/store/queries/payment";
import { useGetStreakQuery } from "@/store/queries/gamification";
import { useGetStoreItemsQuery, useGetMyInventoryQuery, useEquipItemMutation } from "@/store/queries/store";
import { WalletTransaction, PaymentHistoryItem } from "@/types";
import { toast } from "sonner";

interface MissionItem {
  id: number;
  title: string;
  reward: number;
  exp: number;
  icon?: string;
}
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
    name: "Áo Polo FPT Cam",
    price: 80000,
    category: "Fashion",
    img: "https://dongphuchaianh.vn/wp-content/uploads/2022/07/trang-phuc-ao-thun-polo-dong-phuc-3.jpg",
    sales: 120,
    date: "2026-01-20",
  },
  {
    id: 2,
    name: "Áo Polo FPT Trắng Phối Cam",
    price: 90000,
    category: "Fashion",
    img: "https://dongphuccati.com/images/products/2020/05/18/original/2-1.jpg",
    sales: 85,
    date: "2026-01-22",
  },
  {
    id: 3,
    name: "Balo FPT Software",
    price: 250000,
    category: "Gear",
    img: "https://bizweb.dktcdn.net/100/390/135/products/balo-fpt-software.png?v=1681977970063",
    sales: 300,
    date: "2026-01-15",
  },
  {
    id: 4,
    name: "Cặp FPT",
    price: 300000,
    category: "Accessories",
    img: "https://5.imimg.com/data5/ANDROID/Default/2022/8/ND/IF/PO/22020579/product-jpeg-500x500.jpg",
    sales: 450,
    date: "2026-01-10",
  },
  {
    id: 5,
    name: "Bút FPT Excellence",
    price: 30000,
    category: "Collection",
    img: "https://tse1.mm.bing.net/th/id/OIP.6s4XuaMBVNzZBi9C_Rl_CQHaFj?w=700&h=525&rs=1&pid=ImgDetMain&o=7&rm=3",
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
const MISSIONS = {
  checkIn: [
    {
      id: 1,
      title: "Daily Check-in",
      reward: 1,
      type: "Coin",
      icon: "🔥",
      exp: 5,
    },
    {
      id: 2,
      title: "30-day Streak Check-in",
      reward: 30,
      type: "Coin",
      icon: "📅",
      exp: 50,
    },
    {
      id: 3,
      title: "Complete Daily Challenge",
      reward: 10,
      type: "Coin",
      icon: "🎯",
      exp: 20,
    },
  ],
  contribution: [
    {
      id: 4,
      title: "Contribute a Testcase",
      reward: 100,
      type: "Coin",
      icon: "🛠️",
      exp: 150,
    },
    {
      id: 5,
      title: "Contribute a Question",
      reward: 1000,
      type: "Coin",
      icon: "💡",
      exp: 500,
    },
    {
      id: 6,
      title: "File Content Issue",
      reward: 100,
      type: "Coin",
      icon: "🚩",
      exp: 50,
    },
  ],
  contest: [
    {
      id: 7,
      title: "Join a Weekly Contest",
      reward: 50,
      type: "Coin",
      icon: "🏆",
      exp: 100,
    },
    {
      id: 8,
      title: "First Time Rank Top 10",
      reward: 500,
      type: "Coin",
      icon: "🥇",
      exp: 1000,
    },
  ],
  profile: [
    {
      id: 9,
      title: "Complete Profile Info",
      reward: 50,
      type: "Coin",
      icon: "👤",
      exp: 100,
    },
    {
      id: 10,
      title: "Verify Email Address",
      reward: 20,
      type: "Coin",
      icon: "📧",
      exp: 50,
    },
  ],
};

function CoinShopContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("shop");
  const [filterType, setFilterType] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const { data: balanceData, isLoading: isBalanceLoading } = useGetWalletBalanceQuery();
  const { data: walletTransactionsData, isLoading: isWalletLoading } = useGetWalletTransactionsQuery({ page: 1, pageSize: 50 });
  const { data: paymentHistoryData, isLoading: isPaymentLoading } = useGetPaymentHistoryMeQuery({ page: 1, pageSize: 50 });
  const { data: streakData, isLoading: isStreakLoading } = useGetStreakQuery();

  const { data: storeItems, isLoading: isStoreLoading } = useGetStoreItemsQuery();
  const { data: inventoryData, isLoading: isInventoryLoading } = useGetMyInventoryQuery();
  const [equipItem] = useEquipItemMutation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const MissionCard = ({ mission }: { mission: MissionItem }) => (
    <Card className="bg-white dark:bg-[#111c35] border-none shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all group">
      <CardBody className="p-5 flex flex-row items-center gap-4">
        <div className="flex flex-col items-center justify-center min-w-[60px]">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-2xl mb-1 group-hover:scale-110 transition-transform">
            <Coins className="text-[#FFB800]" size={24} />
          </div>
          <span className="text-[#FFB800] font-[1000] italic text-sm">
            +{mission.reward}
          </span>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-black uppercase italic text-sm text-[#071739] dark:text-white leading-tight">
              {mission.title}
            </h4>
            <p className="text-[9px] font-bold text-blue-500 uppercase mt-1">
              +{mission.exp} EXP Points
            </p>
          </div>
          <Button
            size="sm"
            variant="bordered"
            className="border-[#FF5C00] text-[#FF5C00] font-black uppercase italic text-[10px] h-8 w-full rounded-lg hover:bg-[#FF5C00] hover:text-white transition-all"
          >
            Go to mission
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  useEffect(() => {
    setMounted(true);
    const tab = searchParams.get("tab");
    if (tab === "purchases") {
      setSelectedTab("purchases");
    } else if (tab === "earnings") {
      setSelectedTab("earnings");
    } else if (tab === "inventory") {
      setSelectedTab("inventory");
    }
  }, [searchParams]);

  const { paginatedItems, totalPages } = useMemo(() => {
    if (!storeItems) return { paginatedItems: [], totalPages: 0 };
    const filtered = storeItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sorted = [...filtered];
    switch (filterType) {
      case "latest":
        // Assuming latest items are at the end or have a date field, if not, just keep order
        break;
      case "low":
        sorted.sort((a, b) => a.priceCoin - b.priceCoin);
        break;
      case "high":
        sorted.sort((a, b) => b.priceCoin - a.priceCoin);
        break;
    }
    const start = (page - 1) * rowsPerPage;
    return {
      paginatedItems: sorted.slice(start, start + rowsPerPage),
      totalPages: Math.ceil(sorted.length / rowsPerPage),
    };
  }, [storeItems, searchQuery, filterType, page]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-none rounded-xl bg-white dark:bg-[#111c35]">
          <CardBody className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Coins className="text-[#FFB800]" size={18} />
              <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">
                Balance
              </p>
            </div>
            <p className="text-4xl font-[1000] text-[#FFB800] italic leading-none">
              {isBalanceLoading ? "..." : (balanceData?.data?.balance ?? 0).toLocaleString()}
            </p>
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
              {isStreakLoading ? "..." : `${streakData?.data?.currentStreak ?? 0} DAYS`}
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

            {isStoreLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="h-[300px] bg-white dark:bg-[#111c35] animate-pulse rounded-xl" />
                ))}
              </div>
            ) : paginatedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {paginatedItems.map((item) => (
                  <Link
                    href={`/Coin/Product/${item.itemId}`}
                    key={item.itemId}
                    className="group"
                  >
                    <Card className="bg-white dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-xl shadow-sm transition-all h-full hover:border-blue-600 dark:hover:border-[#00FF41] hover:-translate-y-1 overflow-hidden">
                      <CardBody className="p-0">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                          />
                          <Chip className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white border-none font-black text-[8px] uppercase italic">
                            {item.itemType}
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
                                {item.priceCoin.toLocaleString()}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black uppercase italic rounded-lg h-9 hover:bg-blue-600 dark:hover:border-[#00FF41] dark:hover:text-[#071739] transition-all"
                            >
                              Buy now
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#111c35] rounded-3xl">
                <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-black italic uppercase text-slate-400">No products found</p>
              </div>
            )}

            {totalPages > 1 && (
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
            )}
          </div>
        </Tab>

        {/* MY INVENTORY */}
        <Tab
          key="inventory"
          title={
            <div className="flex items-center gap-2">
              <ShoppingBasket size={18} />
              <span>My Inventory</span>
            </div>
          }
        >
          <div className="mt-6 space-y-6">
            {isInventoryLoading ? (
              <p className="text-center py-10 font-bold italic text-slate-400">Loading inventory...</p>
            ) : inventoryData && inventoryData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {inventoryData.map((item) => (
                  <Card key={item.inventoryId} className="bg-white dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-xl shadow-sm overflow-hidden group">
                    <CardBody className="p-0">
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          src={item.itemImageUrl}
                          alt={item.itemName}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />
                        <Chip className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white border-none font-black text-[8px] uppercase italic">
                          {item.itemType}
                        </Chip>
                        {item.isEquipped && (
                          <Chip color="success" size="sm" className="absolute top-3 right-3 z-10 font-black uppercase italic text-[8px]">
                            Equipped
                          </Chip>
                        )}
                      </div>
                      <div className="p-5 space-y-4">
                        <h4 className="text-sm font-[1000] uppercase italic leading-tight group-hover:text-[#FF5C00] transition-colors">
                          {item.itemName}
                        </h4>
                        <div className="flex items-center justify-between border-t border-divider dark:border-white/5 pt-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            {item.expiresAt ? `Expires: ${new Date(item.expiresAt).toLocaleDateString()}` : "Permanent"}
                          </p>
                          <Button
                            size="sm"
                            variant={item.isEquipped ? "flat" : "solid"}
                            className={`${item.isEquipped ? "bg-slate-100 text-slate-600" : "bg-[#FF5C00] text-white"} font-black uppercase italic rounded-lg h-9 transition-all`}
                            onPress={async () => {
                              try {
                                await equipItem({ inventoryId: item.inventoryId, isEquipped: !item.isEquipped }).unwrap();
                                toast.success(item.isEquipped ? "Item unequipped" : "Item equipped");
                              } catch (err: any) {
                                toast.error(err?.data?.message || "Action failed");
                              }
                            }}
                          >
                            {item.isEquipped ? "Unequip" : "Equip"}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#111c35] rounded-3xl">
                <ShoppingBasket size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-black italic uppercase text-slate-400">Your inventory is empty</p>
              </div>
            )}
          </div>
        </Tab>

        {/* EARN COIN */}
        <Tab
          key="earn"
          title={
            <div className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>Earn Coin</span>
            </div>
          }
        >
          <div className="mt-8 space-y-12 pb-12">
            {Object.entries(MISSIONS).map(([key, items]) => {
              const titles: Record<
                string,
                { main: string; sub: string; color: string }
              > = {
                checkIn: {
                  main: "Check-in",
                  sub: "Missions",
                  color: "text-[#FF5C00]",
                },
                contest: {
                  main: "Contest",
                  sub: "Challenges",
                  color: "text-purple-500",
                },
                contribution: {
                  main: "Contribution",
                  sub: "Tasks",
                  color: "text-blue-500",
                },
                profile: {
                  main: "Profile",
                  sub: "Completion",
                  color: "text-emerald-500",
                },
              };

              return (
                <section key={key} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-[1000] italic uppercase tracking-tighter text-slate-400 whitespace-nowrap">
                      {titles[key].main}{" "}
                      <span className={titles[key].color}>
                        {titles[key].sub}
                      </span>
                    </h3>
                    <div className="w-full h-[1px] bg-slate-200 dark:bg-white/5" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((m) => (
                      <MissionCard key={m.id} mission={m} />
                    ))}
                  </div>
                </section>
              );
            })}
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
            {isWalletLoading ? (
              <p className="text-center py-10 font-bold italic text-slate-400">Loading history...</p>
            ) : walletTransactionsData?.data && walletTransactionsData.data.length > 0 ? (
              walletTransactionsData.data.map((h: WalletTransaction, index: number) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-[#111c35] border-none shadow-sm rounded-xl overflow-hidden group hover:border-l-4 hover:border-blue-600 dark:hover:border-[#00FF41] transition-all"
                >
                  <CardBody className="flex flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${h.direction === "in"
                          ? "bg-emerald-500/10 text-[#00FF41]"
                          : "bg-orange-500/10 text-[#FF5C00]"
                          }`}
                      >
                        {h.direction === "in" ? (
                          <ArrowUpRight size={20} strokeWidth={3} />
                        ) : (
                          <ArrowDownRight size={20} strokeWidth={3} />
                        )}
                      </div>
                      <div>
                        <p className="font-black uppercase italic text-sm leading-none group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                          {h.type === "deposit" ? "Coin Deposit" : h.type === "withdraw" ? "Coin Withdrawal" : h.type}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic tracking-widest">
                          Status: {h.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`${h.direction === "in" ? "text-[#00FF41]" : "text-red-500"} font-[1000] italic text-lg leading-none`}>
                        {h.direction === "in" ? "+" : "-"}{h.amount.toLocaleString()} Coins
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#111c35] rounded-3xl">
                <History size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-black italic uppercase text-slate-400">No transaction history found</p>
              </div>
            )}
          </div>
        </Tab>

        {/* PAYMENT HISTORY */}
        <Tab
          key="purchases"
          title={
            <div className="flex items-center gap-2">
              <ShoppingBasket size={18} />
              <span>Payment History</span>
            </div>
          }
        >
          <div className="mt-6 space-y-4 pb-8">
            {isPaymentLoading ? (
              <p className="text-center py-10 font-bold italic text-slate-400">Loading payments...</p>
            ) : paymentHistoryData?.data?.data && paymentHistoryData.data.data.length > 0 ? (
              paymentHistoryData.data.data.map((p: PaymentHistoryItem) => (
                <Card
                  key={p.paymentId}
                  className="bg-white dark:bg-[#111c35] border-none shadow-sm rounded-xl group hover:border-l-4 hover:border-blue-600 dark:hover:border-[#00FF41] transition-all"
                >
                  <CardBody className="flex flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center transition-transform group-hover:scale-110">
                        <ShoppingBag size={20} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="font-black uppercase italic text-sm leading-none group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                          Deposit via {p.paymentMethod.toUpperCase()}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic tracking-widest">
                          {new Date(p.createdAt).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[#FFB800] font-[1000] italic text-lg">
                        {p.amount.toLocaleString()} VND
                      </span>
                      <Chip
                        variant="flat"
                        color={p.status === "paid" ? "success" : p.status === "pending" ? "warning" : "danger"}
                        className="font-black uppercase italic text-[9px] rounded-lg h-7 border-none"
                      >
                        {p.status}
                      </Chip>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#111c35] rounded-3xl">
                <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-black italic uppercase text-slate-400">No payment history found</p>
              </div>
            )}
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
