"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Tabs, Tab, Button } from "@heroui/react";
import { Info, BarChart2, TrendingUp, Award, FileText, Users } from "lucide-react";

import { useGetContestDetailQuery } from "@/store/queries/Contest";

interface ContestHeaderProps {
  contestId: string;
  title?: string;
}

export default function ContestHeader({ contestId, title: initialTitle }: ContestHeaderProps) {
  // Only fetch if we don't have a title and we have a valid contestId
  const { data: contestData } = useGetContestDetailQuery(contestId, {
    skip: !!initialTitle || !contestId,
  });

  const title = initialTitle || contestData?.data?.title;
  
  const pathname = usePathname();
  // Determine which tab is active based on the URL
  let selectedTab = "info";
  if (pathname.includes("/Scoboard") || pathname.includes("/Scoreboard")) {
    selectedTab = "leaderboard";
  } else if (pathname.includes("/Stats")) {
    selectedTab = "stats";
  } else if (pathname.includes("/Submissions")) {
    selectedTab = "submissions";
  } else if (pathname.includes("/Official")) {
    selectedTab = "official-leaderboard";
  }

  return (
    <div className="bg-white dark:bg-[#1e293b]/70 border-b border-slate-200 dark:border-slate-800 pt-6 pb-0 shadow-sm relative overflow-hidden transition-colors">
      {/* Subtle tech background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 dark:via-sky-400/50 to-transparent blur-[2px]"></div>
      
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight relative z-10 transition-colors">
            {title || "Contest"}
          </h1>
        </div>

        <div className="mt-5 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-transparent">
            <Tabs 
              aria-label="Contest tabs" 
              variant="underlined"
              selectedKey={selectedTab}
              classNames={{
                tabList: "gap-4 sm:gap-6 relative rounded-none p-0 border-b-0 w-full overflow-x-auto",
                cursor: "w-full bg-blue-600 dark:bg-sky-400 rounded-t-lg h-0.5",
                tab: "max-w-fit px-0 h-10",
                tabContent: "group-data-[selected=true]:text-blue-600 dark:group-data-[selected=true]:text-sky-400 text-slate-600 dark:text-slate-400 font-medium text-[15px] transition-colors"
              }}
            >
              <Tab 
                key="info" 
                href={`/Contest/${contestId}`}
                title={
                  <div className="flex items-center gap-2">
                    <Info className="w-[18px] h-[18px]" />
                    <span>Information</span>
                  </div>
                } 
              />
              <Tab 
                key="stats" 
                href={`/Contest/${contestId}/Stats`}
                title={
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-[18px] h-[18px]" />
                    <span>Statistics</span>
                  </div>
                } 
              />
              <Tab 
                key="leaderboard" 
                href={`/Contest/${contestId}/Scoboard`}
                title={
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-[18px] h-[18px]" />
                    <span>Scoreboard</span>
                  </div>
                } 
              />
              <Tab 
                key="official-leaderboard" 
                href={`/Contest/${contestId}/Official`}
                title={
                  <div className="flex items-center gap-2">
                    <Award className="w-[18px] h-[18px]" />
                    <span>Official Scoreboard</span>
                  </div>
                } 
              />
              <Tab 
                key="teams" 
                href={`/Contest/${contestId}/Teams`}
                title={
                  <div className="flex items-center gap-2">
                    <Users className="w-[18px] h-[18px]" />
                    <span>Teams</span>
                  </div>
                } 
              />
              <Tab 
                key="submissions" 
                href={`/Contest/${contestId}/Submissions`}
                title={
                  <div className="flex items-center gap-2">
                    <FileText className="w-[18px] h-[18px]" />
                    <span>Submissions</span>
                  </div>
                } 
              />
            </Tabs>

            <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
              <Button 
                className="bg-[#2f5597] hover:bg-[#1f3864] text-white font-medium px-5 h-9 text-sm shadow-sm shrink-0 whitespace-nowrap transition-all flex-1 sm:flex-auto"
                radius="sm"
              >
                Virtual Participation
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 dark:border dark:border-sky-500/30 text-white font-medium px-5 h-9 text-sm shadow-sm shrink-0 whitespace-nowrap transition-all hidden sm:flex"
                radius="sm"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
