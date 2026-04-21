"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  HelpCircle, BarChart2, Award,
  AlertCircle, Clock
} from "lucide-react";
import {
  Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Card, CardBody, Divider
} from "@heroui/react";

import { useGetContestDetailQuery } from "@/store/queries/Contest";
import ContestHeader from "./components/ContestHeader";

export default function ContestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params.id as string;

  const { data: contestData, isLoading } = useGetContestDetailQuery(contestId);
  const [selectedTab] = useState("info");

  if (isLoading) {
    return <div className="text-center py-20 font-black italic uppercase">Loading Contest Details...</div>;
  }

  const contest = contestData?.data;
  const problems = contest?.problems || [];

  return (
    <div className="w-full">
      <ContestHeader contestId={contestId} />

      {/* MAIN CONTENT AREA */}
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-20">

        {/* INFO TAB CONTENT */}
        {selectedTab === "info" && (
          <div className="space-y-6 animate-in fade-in zoom-in-[0.99] duration-300">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT / MAIN COLUMN: Info & Rules */}
              <div className="lg:col-span-12 space-y-6">

                {/* CONTEST STATUS BANNER */}
                <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800/60 rounded-xl p-8 flex flex-col items-start gap-6 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-sky-400"></div>

                  <div className="space-y-4 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl sm:text-4xl font-[1000] italic uppercase tracking-tighter text-slate-900 dark:text-white">
                        {contest?.title}
                      </h1>
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 rounded-full text-xs font-black uppercase italic">
                        <Clock className="w-3 h-3" />
                        {contest?.status}
                      </div>
                    </div>

                    {contest?.description && (
                      <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-4xl border-l-4 border-slate-200 dark:border-slate-700 pl-6 italic">
                        {contest.description}
                      </p>
                    )}
                  </div>

                  <Divider className="bg-slate-100 dark:bg-slate-800" />

                  <div className="flex flex-wrap items-center gap-8 text-[15px] font-medium text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-sky-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Time Window</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {(() => {
                            if (!contest?.startAt || !contest?.endAt) return "TBA";
                            const start = new Date(contest.startAt);
                            const end = new Date(contest.endAt);

                            if (isNaN(start.getTime()) || isNaN(end.getTime())) return "TBA";

                            const formatOptions: Intl.DateTimeFormatOptions = {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            };

                            return `${start.toLocaleString('vi-VN', formatOptions)} - ${end.toLocaleString('vi-VN', formatOptions)}`;
                          })()}
                        </p>
                      </div>
                    </div>

                    {contest?.isFrozen && (
                      <div className="flex items-center gap-3 text-red-500 font-black italic uppercase text-sm">
                        <AlertCircle className="w-5 h-5 animate-pulse" />
                        Scoreboard Frozen
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTEST RULES */}
                <Card className="shadow-sm border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#1e293b]/50 rounded-xl">
                  <CardBody className="p-6 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[14px] sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">

                      {/* Rule block 1 */}
                      <div>
                        <h3 className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100 font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-md inline-flex">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          Unrated
                        </h3>
                        <ul className="list-none pl-2 space-y-2 mt-2">
                          <li className="flex items-start gap-3">
                            <span className="text-blue-500 dark:text-sky-400 mt-1.5 text-[8px]">◆</span>
                            <span>This contest requires you to <strong className="font-semibold text-blue-600 dark:text-sky-400">pass all test cases</strong> of a problem to get points.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-blue-500 dark:text-sky-400 mt-1.5 text-[8px]">◆</span>
                            <span>This contest <strong className="font-semibold text-slate-800 dark:text-slate-200">does not</strong> use pretests.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-blue-500 dark:text-sky-400 mt-1.5 text-[8px]">◆</span>
                            <span>This contest <strong className="font-semibold text-slate-800 dark:text-slate-200">has no limit</strong> on the number of submissions.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-red-500 dark:text-red-400 mt-1.5 text-[8px]">◆</span>
                            <span className="text-red-600 dark:text-red-400 font-bold uppercase text-[13px]">Registration deadline: 8 hours before start.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Rule block 2 */}
                      <div>
                        <h3 className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100 font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-md inline-flex">
                          <Award className="w-4 h-4 text-blue-500" />
                          ICPC Format
                        </h3>
                        <ul className="list-none pl-2 space-y-2 mt-2">
                          <li className="flex items-start gap-3">
                            <span className="text-blue-500 dark:text-sky-400 mt-1.5 text-[8px]">◆</span>
                            <span>The score of a problem will be the score of the submission with the highest score.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-blue-500 dark:text-sky-400 mt-1.5 text-[8px]">◆</span>
                            <span>Submissions prior to the highest scoring submission will incur a <strong className="font-semibold text-red-500 dark:text-red-400">20-minute penalty.</strong></span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-blue-500 dark:text-sky-400 mt-1.5 text-[8px]">◆</span>
                            <span>Ties will be broken by the total time of the <strong className="font-semibold text-slate-800 dark:text-slate-200">last submission that changed the result</strong> (for a 0 point problem, penalty applies). If still tied, it is decided by the <strong className="font-semibold text-slate-800 dark:text-slate-200">time of the last result-changing submission.</strong></span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <Divider className="my-5 bg-slate-200 dark:bg-slate-700/50" />

                    <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                      <BarChart2 className="w-[14px] h-[14px] text-blue-500" />
                      The scoreboard is continuously updated during the contest.
                    </p>
                  </CardBody>
                </Card>

              </div>
            </div>

            {/* PROBLEMS TABLE - Only show when Running or Ended */}
            {contest?.status?.toLowerCase() !== "upcoming" && contest?.status?.toLowerCase() !== "draft" && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 px-1">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                    Problem List
                  </h3>
                </div>

                <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-hidden">
                  <Table
                    aria-label="Problems table"
                    removeWrapper
                    classNames={{
                      base: "min-w-full",
                      table: "min-w-full",
                      th: "bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 font-semibold text-[13px] uppercase tracking-wider py-3 first:rounded-none last:rounded-none border-b border-slate-200 dark:border-slate-800",
                      td: "py-3 lg:py-4 text-sm font-medium border-b border-slate-100 dark:border-slate-800/50 group-last:border-none relative z-10",
                      tr: "hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group",
                    }}
                  >
                    <TableHeader>
                      <TableColumn key="id" className="w-[60px] lg:w-[80px] text-center">#</TableColumn>
                      <TableColumn key="title">Problem Name</TableColumn>
                    </TableHeader>
                    <TableBody items={problems}>
                      {(item) => (
                        <TableRow key={item.problemId} onClick={() => router.push(`/Contest/${contestId}/Problems/${item.problemId}`)}>
                          <TableCell className="text-center font-bold text-slate-700 dark:text-slate-300">
                            {item.alias || item.problemId.substring(0, 4)}
                          </TableCell>
                          <TableCell>
                            <span className="text-blue-600 dark:text-sky-400 group-hover:underline transition-all">
                              {item.alias}: {item.problemId}
                            </span>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* OTHER TABS PLACEHOLDER */}
        {selectedTab !== "info" && (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center gap-4 animate-in fade-in zoom-in-[0.98] duration-300">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Content is being updated...</p>
          </div>
        )}
      </div>

    </div>
  );
}
