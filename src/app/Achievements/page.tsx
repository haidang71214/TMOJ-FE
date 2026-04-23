"use client";

import React from "react";
import {
  Card, CardBody, CardHeader, Progress, Chip, Spinner, Avatar,
  Tabs, Tab
} from "@heroui/react";
import { Award, Target, History, Sparkles, Trophy, Lock } from "lucide-react";
import {
  useGetBadgesQuery,
  useGetBadgeProgressQuery,
  useGetGamificationHistoryQuery
} from "@/store/queries/gamification";

const BadgeIcon = ({ name, isLocked }: { name: string, isLocked?: boolean }) => {
  // Simple logic to determine icon based on name
  const iconClass = "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6";

  if (isLocked) {
    return (
      <div className={`${iconClass} bg-slate-200 dark:bg-white/5 grayscale`}>
        <Lock className="text-slate-400" size={24} />
      </div>
    );
  }

  return (
    <div className={`${iconClass} bg-gradient-to-tr from-[#FF5C00] to-yellow-400 shadow-lg shadow-orange-500/20`}>
      <Trophy className="text-white" size={24} />
    </div>
  );
};

export default function AchievementsPage() {
  const { data: badgesResponse, isLoading: badgesLoading } = useGetBadgesQuery();
  const { data: progressResponse, isLoading: progressLoading } = useGetBadgeProgressQuery();
  const { data: historyResponse, isLoading: historyLoading } = useGetGamificationHistoryQuery();

  const badges = badgesResponse;
  const progress = progressResponse?.data;
  const history = historyResponse?.data;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] py-20 px-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-[0.8]">
            Your<br /><span className="text-[#FF5C00]">Achievements</span>
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic max-w-lg mx-auto">
            Collect badges, track your progress, and rewrite history.
          </p>
        </div>

        <Tabs
          aria-label="Achievement sections"
          variant="underlined"
          classNames={{
            tabList: "gap-8 border-b border-slate-200 dark:border-white/5 w-full",
            cursor: "w-full bg-[#FF5C00]",
            tab: "h-14",
            tabContent: "font-black italic uppercase text-sm tracking-widest group-data-[selected=true]:text-[#FF5C00]"
          }}
        >
          {/* BADGES TAB */}
          <Tab
            key="badges"
            title={
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>My Badges</span>
              </div>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-10">
              {badgesLoading ? (
                <div className="col-span-full flex justify-center py-20"><Spinner color="warning" /></div>
              ) : (
                badges?.map((badge) => (
                  <Card key={badge.badgeId} className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
                    <CardBody className="p-6 flex flex-col items-center text-center space-y-4">
                      <BadgeIcon name={badge.name} />
                      <div>
                        <p className="text-xs font-black italic uppercase text-[#071739] dark:text-white leading-tight mb-1">{badge.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(badge.awardedAt).toLocaleDateString()}</p>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </Tab>

          {/* PROGRESS TAB */}
          <Tab
            key="progress"
            title={
              <div className="flex items-center gap-2">
                <Target size={18} />
                <span>In Progress</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
              {progressLoading ? (
                <div className="col-span-full flex justify-center py-20"><Spinner color="warning" /></div>
              ) : (
                progress?.map((p, idx) => (
                  <Card key={idx} className="bg-white dark:bg-[#111827] border-none rounded-[2.5rem] shadow-xl overflow-hidden group">
                    <CardBody className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <BadgeIcon name={p.badge} isLocked />
                          <div>
                            <h4 className="text-lg font-[1000] italic uppercase text-[#071739] dark:text-white leading-none">{p.badge}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase italic mt-1">Goal: {p.target}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-[1000] text-[#FF5C00] italic leading-none">{p.progress}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase">current</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Progress
                          size="md"
                          value={(p.progress / p.target) * 100}
                          className="h-3"
                          classNames={{
                            indicator: "bg-gradient-to-r from-slate-400 to-slate-600",
                            track: "bg-slate-100 dark:bg-white/5"
                          }}
                        />
                        <div className="flex justify-between text-[9px] font-black uppercase italic text-slate-400">
                          <span>Progress</span>
                          <span>{Math.round((p.progress / p.target) * 100)}%</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </Tab>

          {/* HISTORY TAB */}
          <Tab
            key="history"
            title={
              <div className="flex items-center gap-2">
                <History size={18} />
                <span>History</span>
              </div>
            }
          >
            <div className="max-w-2xl mx-auto pt-10 space-y-6">
              {historyLoading ? (
                <div className="flex justify-center py-20"><Spinner color="warning" /></div>
              ) : (
                history?.map((h, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] shadow-lg flex items-center justify-center border-2 border-slate-100 dark:border-white/10 z-10 group-hover:border-[#FF5C00] transition-colors">
                        {h.type === "badge" ? <Award size={18} className="text-[#FF5C00]" /> : <Sparkles size={18} className="text-blue-500" />}
                      </div>
                      {idx !== history.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-white/5 my-2" />}
                    </div>
                    <div className="pb-8">
                      <p className="text-xs text-slate-400 font-bold uppercase">{new Date(h.time).toLocaleString()}</p>
                      <h5 className="text-xl font-[1000] italic uppercase text-[#071739] dark:text-white leading-tight mt-1">{h.name}</h5>
                      <p className="text-xs text-slate-500 italic mt-1">You earned a new {h.type}!</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
