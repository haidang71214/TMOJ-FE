"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tabs,
  Tab,
  Progress,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import {
  Flame,
  Edit3,
  Award,
  Globe,
  ChevronRight,
  Terminal,
  Zap,
  Lock,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

// --- INTERFACES ---
interface DifficultyStat {
  label: string;
  solved: number;
  total: number;
  color: string;
  variant:
    | "success"
    | "primary"
    | "warning"
    | "danger"
    | "default"
    | "secondary";
}

interface BadgeItem {
  id: string;
  name: string;
  date: string;
  isLocked: boolean;
  color: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const difficultyData: DifficultyStat[] = useMemo(
    () => [
      {
        label: "Easy",
        solved: 120,
        total: 922,
        color: "text-[#00FF41]",
        variant: "success",
      },
      {
        label: "Med",
        solved: 95,
        total: 1986,
        color: "text-blue-500",
        variant: "primary",
      },
      {
        label: "Hard",
        solved: 11,
        total: 900,
        color: "text-[#FF5C00]",
        variant: "warning",
      },
    ],
    []
  );

  const badges: BadgeItem[] = [
    {
      id: "1",
      name: "Logic Master Lvl 4",
      date: "Jan 2024",
      isLocked: false,
      color: "#00FF41",
    },
    {
      id: "2",
      name: "50 Days Streak",
      date: "Dec 2023",
      isLocked: false,
      color: "#FF5C00",
    },
    {
      id: "3",
      name: "Top 100 Weekly",
      date: "Nov 2023",
      isLocked: false,
      color: "#2563eb",
    },
    {
      id: "4",
      name: "Bug Hunter",
      date: "Locked",
      isLocked: true,
      color: "#94a3b8",
    },
    {
      id: "5",
      name: "Algorithm Knight",
      date: "Locked",
      isLocked: true,
      color: "#94a3b8",
    },
  ];

  const SOLVED_COUNT = 226;
  const TOTAL_COUNT = 3808;

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10 custom-scrollbar">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-10">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#071739] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-xl overflow-hidden relative transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5C00] opacity-5 dark:opacity-10 skew-x-12 translate-x-10 -translate-y-10" />
            <CardBody className="p-8 space-y-6 relative z-10">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <Avatar
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                    className="w-28 h-28 border-4 border-[#FF5C00] rounded-[2.2rem] shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#00FF41] w-7 h-7 rounded-full border-4 border-white dark:border-[#071739] shadow-md animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-[1000] uppercase italic tracking-tighter leading-none text-[#071739] dark:text-white">
                    Đăng <span className="text-[#FF5C00]">Hải</span>
                  </h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">
                    ID: yMXnOfMOzd
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-white/10 text-[#071739] dark:text-white">
                <div className="text-center border-r border-slate-100 dark:border-white/10">
                  <p className="text-[9px] font-black uppercase text-slate-400 italic">
                    Global Rank
                  </p>
                  <p className="text-xl font-[1000] text-[#FF5C00] italic">
                    #5,420
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase text-slate-400 italic">
                    Solved
                  </p>
                  <p className="text-xl font-[1000] text-[#00FF41] italic">
                    {SOLVED_COUNT}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full font-black uppercase italic text-[11px] tracking-widest bg-slate-50 dark:bg-white/5 text-[#071739] dark:text-white hover:bg-[#00FF41] hover:text-[#071739] transition-all rounded-2xl border border-slate-200 dark:border-white/10"
                startContent={<Edit3 size={16} />}
                onClick={() => router.push("/Settings")}
              >
                Edit Profile
              </Button>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm">
            <CardHeader className="px-8 pt-8 flex items-center gap-2">
              <Globe size={18} className="text-[#FF5C00]" />
              <h2 className="text-sm font-[1000] uppercase italic tracking-wider text-[#071739] dark:text-white">
                Community
              </h2>
            </CardHeader>
            <CardBody className="px-8 pb-8 space-y-4">
              {[
                ["Views", "1.2k"],
                ["Solution", "45"],
                ["Discuss", "12"],
                ["Reputation", "850"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center group cursor-default"
                >
                  <span className="text-[10px] font-black uppercase text-slate-400 italic group-hover:text-blue-600 transition-colors">
                    {label}
                  </span>
                  <span className="text-sm font-black italic text-[#071739] dark:text-slate-200">
                    {value}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm">
            <CardHeader className="px-8 pt-8 flex items-center gap-2">
              <Terminal size={18} className="text-[#FF5C00]" />
              <h2 className="text-sm font-[1000] uppercase italic tracking-wider text-[#071739] dark:text-white">
                Languages
              </h2>
            </CardHeader>
            <CardBody className="px-8 pb-8 space-y-4 text-[#071739] dark:text-white">
              <div className="flex justify-between items-center">
                <span className="text-xs font-[1000] italic uppercase">
                  Java
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                  156 Solved
                </span>
              </div>
              <Divider className="opacity-50" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-[1000] italic uppercase">
                  JavaScript
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                  72 Solved
                </span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm">
            <CardHeader className="px-8 pt-8 flex items-center gap-2">
              <Zap size={18} className="text-[#FF5C00]" />
              <h2 className="text-sm font-[1000] uppercase italic tracking-wider text-[#071739] dark:text-white">
                Skills
              </h2>
            </CardHeader>
            <CardBody className="px-8 pb-8 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 italic">
                  Advanced
                </p>
                <Chip
                  size="sm"
                  variant="flat"
                  className="font-black italic uppercase text-[9px] bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                >
                  Dynamic Programming ×12
                </Chip>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 italic">
                  Intermediate
                </p>
                <div className="flex flex-wrap gap-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="font-black italic uppercase text-[9px] bg-orange-50 text-[#FF5C00] dark:bg-[#FF5C00]/10"
                  >
                    Hash Table ×32
                  </Chip>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="font-black italic uppercase text-[9px] bg-green-50 text-[#00FF41] dark:bg-[#00FF41]/10"
                  >
                    Recursion ×14
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[3rem] shadow-sm">
            <CardBody className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
              <div className="flex flex-col items-center justify-center border-r border-slate-100 dark:border-white/5 pr-4">
                <div className="relative w-full max-w-[180px] aspect-square flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100 dark:text-white/5"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#FF5C00"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="282.7"
                      strokeDashoffset={
                        282.7 - (282.7 * SOLVED_COUNT) / TOTAL_COUNT
                      }
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-5xl font-[1000] italic leading-none text-[#071739] dark:text-white">
                      {SOLVED_COUNT}
                    </p>
                    <p className="text-[9px] font-black uppercase text-slate-400 mt-1 italic tracking-widest">
                      Solved
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {difficultyData.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <span
                        className={`text-[10px] font-black uppercase italic ${item.color}`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs font-[1000] text-[#071739] dark:text-white">
                        {item.solved}
                        <span className="text-slate-400 font-bold">
                          /{item.total}
                        </span>
                      </span>
                    </div>
                    <Progress
                      size="sm"
                      value={(item.solved / item.total) * 100}
                      color={item.variant}
                      className="h-2 rounded-full"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-3 border border-slate-100 dark:border-none relative group">
                <Award size={48} className="text-[#FF5C00]" />
                <p className="text-[10px] font-[1000] uppercase italic text-slate-500 tracking-widest">
                  Achievement
                </p>
                <p className="text-base font-black italic uppercase leading-tight text-[#071739] dark:text-white">
                  Logic Master <br />
                  <span className="text-[#00FF41]">Level 4</span>
                </p>
                <Button
                  size="sm"
                  variant="light"
                  className="font-black uppercase italic text-[9px] text-[#FF5C00] tracking-widest hover:bg-[#FF5C00]/10 mt-2"
                  onPress={onOpen}
                >
                  Detail ↗
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[3rem] shadow-sm overflow-hidden">
            <CardHeader className="flex justify-between items-center px-10 pt-10 text-[#071739] dark:text-white">
              <div className="flex items-center gap-3">
                <Flame size={24} className="text-[#FF5C00]" />
                <h2 className="text-xl font-[1000] uppercase italic tracking-tighter">
                  Activity Pulse
                </h2>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Streak: 12 Days 🔥
              </p>
            </CardHeader>
            <CardBody className="px-10 pb-10">
              <div className="grid grid-cols-53 gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 371 }).map((_, i) => {
                  const pseudo = ((i * 9301 + 49297) % 233280) / 233280;
                  let bg = "bg-slate-100 dark:bg-white/5";
                  if (pseudo > 0.85) bg = "bg-[#00FF41]";
                  else if (pseudo > 0.6) bg = "bg-[#00FF41]/60";
                  else if (pseudo > 0.3) bg = "bg-[#00FF41]/30";
                  return (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-sm shrink-0 hover:scale-125 transition-transform cursor-pointer ${bg}`}
                    />
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[3rem] shadow-sm">
            <Tabs
              variant="underlined"
              classNames={{
                tabList:
                  "px-10 pt-8 gap-8 border-b border-slate-100 dark:border-white/5",
                cursor: "bg-[#FF5C00]",
                tabContent:
                  "font-[1000] uppercase italic text-[11px] tracking-widest group-data-[selected=true]:text-[#FF5C00]",
              }}
            >
              <Tab key="recent" title="Recent AC">
                <div className="px-10 pb-10 divide-y divide-slate-100 dark:divide-white/5">
                  {[
                    ["Two Sum", "Easy", "2 mins ago"],
                    ["Longest Palindrome", "Medium", "19 days ago"],
                    ["Median Array", "Hard", "1 month ago"],
                  ].map(([title, diff, time]) => (
                    <div
                      key={title}
                      className="py-6 flex justify-between items-center group cursor-pointer"
                    >
                      <div className="space-y-1">
                        <p className="text-base font-black uppercase italic group-hover:text-blue-600 transition-colors text-[#071739] dark:text-white leading-none">
                          {title}
                        </p>
                        <p
                          className={`text-[9px] font-black uppercase italic ${
                            diff === "Easy"
                              ? "text-[#00FF41]"
                              : diff === "Hard"
                              ? "text-[#FF5C00]"
                              : "text-blue-500"
                          }`}
                        >
                          {diff}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 group-hover:text-[#FF5C00] transition-colors">
                        <span className="text-[10px] font-bold uppercase italic">
                          {time}
                        </span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="light"
                    className="w-full mt-6 font-black uppercase italic text-[10px] text-[#FF5C00] tracking-[0.2em]"
                  >
                    View All Activity →
                  </Button>
                </div>
              </Tab>
              {/* KHÔI PHỤC CÁC TAB BỊ THIẾU */}
              <Tab key="collections" title="Collections">
                <div className="p-10 text-center text-slate-400 italic font-black uppercase text-xs">
                  No collections found.
                </div>
              </Tab>
              <Tab key="solutions" title="Solutions">
                <div className="p-10 text-center text-slate-400 italic font-black uppercase text-xs">
                  No solutions published yet.
                </div>
              </Tab>
              <Tab key="discuss" title="Discuss">
                <div className="p-10 text-center text-slate-400 italic font-black uppercase text-xs">
                  No discussions yet.
                </div>
              </Tab>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* ================= MODAL: BADGE COLLECTION ================= */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        backdrop="blur"
        hideCloseButton={true}
        classNames={{
          base: "dark:bg-[#071739] bg-white rounded-[3rem] p-6 border border-white/10",
          header: "border-b border-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Award size={24} className="text-[#FF5C00]" />
                  <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-[#071739] dark:text-white">
                    Badge <span className="text-[#FF5C00]">Collection</span>
                  </h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic">
                  Unlock your potential through challenges
                </p>
              </ModalHeader>
              <ModalBody className="py-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all relative overflow-hidden group ${
                        badge.isLocked
                          ? "border-slate-100 dark:border-white/5 grayscale opacity-60"
                          : "border-[#FF5C00]/20 bg-slate-50 dark:bg-white/5 shadow-lg"
                      }`}
                    >
                      {badge.isLocked && (
                        <Lock
                          size={16}
                          className="absolute top-4 right-4 text-slate-400"
                        />
                      )}
                      <div
                        className={`p-4 rounded-full bg-white dark:bg-black/20 shadow-inner transition-transform group-hover:scale-110 duration-500`}
                      >
                        <Star
                          size={32}
                          style={{ color: badge.color }}
                          strokeWidth={3}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-[1000] uppercase italic text-[#071739] dark:text-white leading-tight">
                          {badge.name}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {badge.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button
                    className="font-black uppercase italic text-xs bg-[#FF5C00] text-white rounded-xl px-10 shadow-lg"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx global>{`
        .grid-cols-53 {
          grid-template-columns: repeat(53, minmax(0, 1fr));
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00ff41;
        }
      `}</style>
    </div>
  );
}
