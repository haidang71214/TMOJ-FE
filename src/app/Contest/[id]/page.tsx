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

      {/* MAIN CONTENT AREA */}
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-20">
        
        {/* INFO TAB CONTENT */}
        {selectedTab === "info" && (
          <div className="space-y-6 animate-in fade-in zoom-in-[0.99] duration-300">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT / MAIN COLUMN: Info & Rules */}
              <div className="lg:col-span-12 space-y-6">
                
                {/* CONTEST STATUS BANNER */}
                <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-sky-400"></div>
                  <h2 className="text-xl sm:text-2xl text-blue-600 dark:text-sky-400 font-semibold m-0 flex items-center gap-2">
                    {contest?.status || "Contest"}
                  </h2>
                  <div className="hidden sm:block w-[1px] h-6 bg-slate-300 dark:bg-slate-700"></div>
                  <div className="flex items-center gap-2 text-[15px] font-medium text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                    <p>
                      {new Date(contest?.startAt || "").toLocaleString()} - {new Date(contest?.endAt || "").toLocaleString()}
                    </p>
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

            {/* PROBLEMS TABLE */}
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
