"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Tabs, Tab, Chip, Avatar, AvatarGroup } from "@heroui/react";
import { Info, TrendingUp, Users, Calendar, Clock, Timer } from "lucide-react";

import { useGetContestDetailQuery } from "@/store/queries/Contest";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types";

interface ContestHeaderProps {
  contestId: string;
}

const CountdownTimer = ({ endAt, status }: { endAt: string, status: string }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const target = new Date(endAt).getTime();
    
    const updateTimer = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0 || status.toLowerCase() === "ended") {
        setTimeLeft("CONTEST ENDED");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [endAt, status]);

  return (
    <div className="flex items-center gap-2 bg-[#FF5C00]/20 border border-[#FF5C00]/30 px-4 py-2 rounded-2xl backdrop-blur-md animate-pulse">
      <Timer className="w-4 h-4 text-[#FF5C00]" />
      <div className="flex flex-col items-start">
        <p className="text-[8px] font-black uppercase text-[#FF5C00]/70 leading-none mb-0.5">Time Remaining</p>
        <p className="font-[1000] italic uppercase text-lg text-white leading-none tracking-tighter">{timeLeft}</p>
      </div>
    </div>
  );
};

export default function ContestHeader({ contestId }: ContestHeaderProps) {
  const { data: contestResult, isLoading } = useGetContestDetailQuery(contestId);
  const contestData = contestResult?.data;
  const pathname = usePathname();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const role = currentUser?.role?.toLowerCase();

  const isStudent = role === UserRole.STUDENT;

  // Determine which tab is active based on the URL
  let selectedTab = "info";
  if (pathname.includes("/Scoreboard")) {
    selectedTab = "leaderboard";
  } else if (pathname.includes("/Teams") || pathname.includes("/register")) {
    selectedTab = "teams";
  }

  if (isLoading || !contestData) return null;

  return (
    <div className="relative w-full mb-24">
      {/* 1. BANNER SECTION */}
      <div className="relative h-[450px] w-full">
        <img
          src={(contestData as any).image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070"}
          alt={contestData.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0F2F5] dark:from-[#0A0F1C] via-black/40 to-transparent" />

        <div className="container mx-auto px-6 md:px-10 relative h-full flex flex-col justify-end text-white pb-28">
          <div className="max-w-7xl w-full space-y-6 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-wrap items-center gap-3">
              <Chip className={`text-white font-black italic uppercase text-[9px] px-3 py-1 shadow-lg border-none ${contestData.status?.toLowerCase() === 'running' ? 'bg-green-500' : contestData.status?.toLowerCase() === 'upcoming' ? 'bg-[#FF5C00]' : 'bg-gray-500'}`} size="sm">
                {contestData.status || "Upcoming"}
              </Chip>
              <Chip className="bg-white/20 backdrop-blur-xl text-white font-black italic uppercase text-[9px] px-3 py-1 border border-white/20" size="sm">
                {contestData.visibility || "Public"}
              </Chip>
              <Chip className="bg-white/20 backdrop-blur-xl text-[#FF5C00] font-black italic uppercase text-[9px] px-3 py-1 border border-[#FF5C00]" size="sm">
                {contestData.contestType === 'acm' ? 'ACM Format' : (contestData.contestType || "Standard")}
              </Chip>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase leading-[0.85] tracking-[calc(-0.05em)] max-w-3xl">
                {contestData.title}
              </h1>
              
              {contestData.status?.toLowerCase() === "running" && (
                <CountdownTimer endAt={contestData.endAt} status={contestData.status} />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 opacity-90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/20">
                  <Calendar className="w-4 h-4 text-[#FF5C00]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-white/50 leading-none mb-0.5">Starts At</p>
                  <p className="font-black italic uppercase text-[11px] leading-none">{new Date(contestData.startAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/20">
                  <Clock className="w-4 h-4 text-[#FF5C00]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-white/50 leading-none mb-0.5">Duration</p>
                  <p className="font-black italic uppercase text-[11px] leading-none">{contestData.durationMinutes} Minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AvatarGroup isBordered max={3} size="sm" className="opacity-80 scale-85">
                  <Avatar src={`https://i.pravatar.cc/150?u=a042581f4e29026024d`} />
                  <Avatar src={`https://i.pravatar.cc/150?u=a04258a2462d826712d`} />
                </AvatarGroup>
                <p className="font-black italic uppercase text-[10px]">{(contestData as any).participants || 0} Competitors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS (Integrated Style) */}
      <div className="absolute bottom-0 w-full bg-white/10 backdrop-blur-2xl border-t border-white/10 overflow-visible">
        <div className="container mx-auto px-6 overflow-visible">
          <Tabs
            aria-label="Contest tabs"
            variant="underlined"
            selectedKey={selectedTab}
            classNames={{
              base: "overflow-visible",
              tabList: "gap-12 relative rounded-none p-0 border-b-0 w-full overflow-visible scrollbar-hide",
              cursor: "w-full bg-[#FF5C00] h-1 shadow-[0_-2px_10px_rgba(255,92,0,0.5)]",
              tab: "max-w-fit px-0 h-14",
              tabContent: "group-data-[selected=true]:text-[#FF5C00] text-slate-900 dark:text-white font-black italic uppercase text-xs transition-all duration-300"
            }}
          >
            <Tab
              key="info"
              href={`/Contest/${contestId}`}
              title={
                <div className="flex items-center gap-2 px-1">
                  <Info className="w-4 h-4" />
                  <span>Information</span>
                </div>
              }
            />

            {currentUser && (
              <>
                <Tab
                  key="leaderboard"
                  href={`/Contest/${contestId}/Scoreboard`}
                  title={
                    <div className="flex items-center gap-2 px-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Scoreboard</span>
                    </div>
                  }
                />

                <Tab
                  key="teams"
                  href={`/Contest/${contestId}/Teams`}
                  title={
                    <div className="flex items-center gap-2 px-1">
                      <Users className="w-4 h-4" />
                      <span>{isStudent ? "My Team" : "Participants"}</span>
                    </div>
                  }
                />
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
