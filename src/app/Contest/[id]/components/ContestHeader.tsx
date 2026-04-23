// rác,
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Tabs, Tab, Button } from "@heroui/react";
import { Info, BarChart2, TrendingUp, Award, FileText, Users } from "lucide-react";

import { useGetContestDetailQuery } from "@/store/queries/Contest";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types";

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
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const role = currentUser?.role?.toLowerCase();

  const isAdminOrTeacher = role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.TEACHER;
  const isStudent = role === UserRole.STUDENT;

  // Determine which tab is active based on the URL
  let selectedTab = "info";
  if (pathname.includes("/Scoreboard")) {
    selectedTab = "leaderboard";
  } else if (pathname.includes("/Stats")) {
    selectedTab = "stats";
  } else if (pathname.includes("/Submissions")) {
    selectedTab = "submissions";
  } else if (pathname.includes("/Teams") || pathname.includes("/register")) {
    selectedTab = "teams";
  }

  return (
    <div className="bg-white dark:bg-[#1e293b]/70 border-b border-slate-200 dark:border-slate-800 pt-6 pb-0 shadow-sm relative overflow-hidden transition-colors">
      {/* Subtle tech background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 dark:via-sky-400/50 to-transparent blur-[2px]"></div>

      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title removed here because it's already shown in the banner in page.tsx */}

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

              {isAdminOrTeacher && (
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
              )}

              {currentUser && (
                <>
                  <Tab
                    key="leaderboard"
                    href={`/Contest/${contestId}/Scoreboard`}
                    title={
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-[18px] h-[18px]" />
                        <span>Scoreboard</span>
                      </div>
                    }
                  />

                  <Tab
                    key="teams"
                    href={`/Contest/${contestId}/Teams`}
                    title={
                      <div className="flex items-center gap-2">
                        <Users className="w-[18px] h-[18px]" />
                        <span>{isStudent ? "My Team" : "Participants"}</span>
                      </div>
                    }
                  />
                </>
              )}

              {isAdminOrTeacher && (
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
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
