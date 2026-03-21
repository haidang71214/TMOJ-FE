"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Trophy, Search, Filter, HelpCircle 
} from "lucide-react";
import { 
  Table, TableHeader, TableColumn, TableBody, 
  TableRow, TableCell, Avatar, Tooltip, Input, Checkbox
} from "@heroui/react";
import type { ScoreboardResponseDTO, ProblemAttemptDTO } from "../Scoboard/dto";

const mockData: ScoreboardResponseDTO = {
  contestId: "1",
  contestName: "ICPC 2023 Regional",
  status: "running",
  frozen: false,
  problems: [
    { id: "A", title: "Area Query", solvedCount: 12, totalAttempts: 45 },
    { id: "B", title: "Backbone Network", solvedCount: 4, totalAttempts: 32 },
    { id: "C", title: "Coloring Polygon", solvedCount: 0, totalAttempts: 15 },
    { id: "D", title: "Distinctive Number", solvedCount: 18, totalAttempts: 25 },
    { id: "E", title: "Even Paths", solvedCount: 1, totalAttempts: 8 },
  ],
  rows: [
    {
      rank: 1, userId: "u1", username: "FPTU_Win", fullname: "FPTU Team 1",
      totalSolved: 4, totalPenalty: 345,
      problems: [
        { problemId: "A", isSolved: true, isFirstBlood: true, attemptsCount: 1, penaltyTime: 15 },
        { problemId: "B", isSolved: true, isFirstBlood: false, attemptsCount: 3, penaltyTime: 120 },
        { problemId: "C", isSolved: false, isFirstBlood: false, attemptsCount: 4 },
        { problemId: "D", isSolved: true, isFirstBlood: false, attemptsCount: 1, penaltyTime: 40 },
        { problemId: "E", isSolved: true, isFirstBlood: false, attemptsCount: 2, penaltyTime: 130 },
      ]
    },
    {
      rank: 2, userId: "u2", username: "HCMUS_Alpha", fullname: "HCMUS Team",
      totalSolved: 3, totalPenalty: 210,
      problems: [
        { problemId: "A", isSolved: true, isFirstBlood: false, attemptsCount: 2, penaltyTime: 25 },
        { problemId: "B", isSolved: false, isFirstBlood: false, attemptsCount: 5 },
        { problemId: "C", isSolved: false, isFirstBlood: false, attemptsCount: 0 },
        { problemId: "D", isSolved: true, isFirstBlood: true, attemptsCount: 1, penaltyTime: 12 },
        { problemId: "E", isSolved: true, isFirstBlood: true, attemptsCount: 1, penaltyTime: 153 },
      ]
    },
    {
      rank: 3, userId: "u3", username: "haidang71214", fullname: "Hai Dang",
      totalSolved: 2, totalPenalty: 85,
      problems: [
        { problemId: "A", isSolved: true, isFirstBlood: false, attemptsCount: 1, penaltyTime: 35 },
        { problemId: "B", isSolved: false, isFirstBlood: false, attemptsCount: 0 },
        { problemId: "C", isSolved: false, isFirstBlood: false, attemptsCount: 2, pendingCount: 1 },
        { problemId: "D", isSolved: true, isFirstBlood: false, attemptsCount: 2, penaltyTime: 30 },
        { problemId: "E", isSolved: false, isFirstBlood: false, attemptsCount: 0 },
      ]
    },
    {
      rank: 4, userId: "u4", username: "HUST_Avengers", fullname: "HUST Team",
      totalSolved: 1, totalPenalty: 60,
      problems: [
        { problemId: "A", isSolved: true, isFirstBlood: false, attemptsCount: 3, penaltyTime: 20 },
        { problemId: "B", isSolved: false, isFirstBlood: false, attemptsCount: 1 },
        { problemId: "C", isSolved: false, isFirstBlood: false, attemptsCount: 0 },
        { problemId: "D", isSolved: false, isFirstBlood: false, attemptsCount: 0 },
        { problemId: "E", isSolved: false, isFirstBlood: false, attemptsCount: 0 },
      ]
    }
  ],
  lastUpdated: new Date().toISOString()
};

export default function TeamsPage() {
  const params = useParams();
  const contestId = params.id as string;
  const [data] = useState<ScoreboardResponseDTO>(mockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrg, setShowOrg] = useState(false);

  // Filter rows
  let filteredRows = data.rows;
  if (searchQuery.trim() !== "") {
    filteredRows = data.rows.filter(r => 
      r.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.fullname && r.fullname.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const renderProblemCell = (attempt: ProblemAttemptDTO | undefined) => {
    if (!attempt || (attempt.attemptsCount === 0 && !attempt.pendingCount)) {
      return <div className="w-full h-full min-h-[50px]"></div>;
    }

    if (attempt.isSolved) {
      const classes = attempt.isFirstBlood
        ? "bg-[#10b981] text-white shadow-inner"
        : "bg-emerald-400 text-white dark:bg-emerald-500/20";
      return (
        <div className={`w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 rounded-sm ${classes}`}>
          <span className="font-bold text-[14px]">
            {attempt.attemptsCount > 1 ? `+${attempt.attemptsCount - 1}` : "+"}
          </span>
          <span className="text-[11px] opacity-90">{attempt.penaltyTime}</span>
        </div>
      );
    }

    if (attempt.pendingCount && attempt.pendingCount > 0) {
      return (
        <div className="w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 bg-indigo-500 text-white dark:bg-indigo-500/40 rounded-sm">
          <span className="font-bold text-[14px] animate-pulse">?</span>
          <span className="text-[11px] opacity-80">{attempt.attemptsCount} + {attempt.pendingCount}</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 bg-rose-400 text-white dark:bg-rose-500/20 rounded-sm">
        <span className="font-bold text-[14px]">-{attempt.attemptsCount}</span>
      </div>
    );
  };

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 pb-20">

      {/* TEAMS CONTENT */}
      <div className="w-full max-w-[1500px] mx-auto mt-6 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Input 
              classNames={{
                base: "max-w-[300px]",
                inputWrapper: "bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 shadow-sm rounded-md h-10",
                input: "text-[14px]"
              }}
              placeholder="Search participant..."
              startContent={<Search className="w-4 h-4 text-slate-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Checkbox 
              isSelected={showOrg}
              onValueChange={setShowOrg}
              classNames={{
                label: "text-[14px] text-slate-700 dark:text-slate-300 font-medium"
              }}
              color="primary"
            >
              Show name/organization
            </Checkbox>
          </div>

          <Tooltip 
            content={
              <div className="w-[180px] bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-md shadow-lg overflow-hidden text-[13px] font-medium text-center">
                <div className="bg-[#18181b] text-white py-2 font-semibold">Cell Color</div>
                <div className="bg-[#10b981] text-white py-2 border-b border-white/20">First Blood</div>
                <div className="bg-emerald-400 text-white dark:bg-emerald-500/20 py-2 border-b border-white/20">Solved</div>
                <div className="bg-rose-400 text-white dark:bg-rose-500/20 py-2 border-b border-white/20">Attempted, Incorrect</div>
                <div className="bg-indigo-500 text-white dark:bg-indigo-500/40 py-2 border-b border-slate-200 dark:border-slate-700">Attempted, Pending</div>
                <div className="bg-white dark:bg-[#1e293b] text-slate-500 py-2">Unattempted</div>
              </div>
            }
            classNames={{
              base: "p-0 bg-transparent shadow-none",
              content: "p-0 bg-transparent outline-none overflow-hidden"
            }}
            placement="bottom-end"
            delay={100}
          >
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <HelpCircle className="w-4 h-4" />
              <span className="text-[13px] font-medium">Legend</span>
            </button>
          </Tooltip>
        </div>

        {/* SCOREBOARD TABLE */}
        <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-x-auto overflow-y-hidden">
          <Table 
            aria-label="Teams table" 
            removeWrapper
            classNames={{
              base: "min-w-max",
              table: "min-w-max border-collapse",
              th: "bg-[#18181b] dark:bg-[#0f172a] text-white dark:text-slate-300 font-semibold text-[13px] tracking-wider py-4 first:rounded-none last:rounded-none border-b border-r border-slate-700 dark:border-slate-800 last:border-r-0 text-center whitespace-nowrap",
              td: "p-0 border-b border-r border-slate-200 dark:border-slate-800/50 last:border-r-0 text-sm align-middle h-full",
              tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group",
            }}
          >
            <TableHeader columns={[
              { key: "rank", label: "Rank", isProblem: false },
              { key: "participant", label: "Username" + (showOrg ? " / Orgs" : ""), isProblem: false },
              { key: "total", label: "Score", isProblem: false },
              { key: "penalty", label: "Penalty", isProblem: false },
              ...data.problems.map(p => ({ key: p.id, label: p.id, isProblem: true as const, data: p }))
            ]}>
              {(column) => (
                <TableColumn key={column.key} className={
                  column.key === "rank" ? "w-[60px]" : 
                  column.key === "participant" ? "w-[280px] !text-left pl-6" : 
                  column.key === "total" || column.key === "penalty" ? "w-[80px]" : 
                  "w-[70px] px-2 font-bold text-[16px]"
                }>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody>
              {/* Data Rows */}
              {filteredRows.map((row) => (
                <TableRow key={row.userId}>
                  {[
                    "rank", "participant", "total", "penalty",
                    ...data.problems.map(p => p.id)
                  ].map((columnKey) => {
                    if (columnKey === "rank") {
                      return (
                        <TableCell key={columnKey}>
                          <div className="flex justify-center items-center w-full h-full min-h-[50px]">
                            <span className="font-medium text-[15px]">{row.rank}</span>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "participant") {
                      return (
                        <TableCell key={columnKey}>
                          <div className="flex items-center gap-3 w-full h-full px-6 min-h-[50px]">
                            {showOrg && (
                                <Avatar 
                                name={row.username.charAt(0)} 
                                size="sm" 
                                className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-7 h-7 text-xs"
                                />
                            )}
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#185adb] dark:text-sky-400 text-[14.5px] cursor-pointer hover:underline">
                                {showOrg ? (row.fullname || row.username) : row.username}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "total") {
                      return (
                        <TableCell key={columnKey}>
                          <div className="flex flex-col items-center justify-center w-full h-full min-h-[50px]">
                            <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">{row.totalSolved}</span>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "penalty") {
                      return (
                        <TableCell key={columnKey}>
                          <div className="flex flex-col items-center justify-center w-full h-full min-h-[50px]">
                            <span className="text-[14px] text-slate-500 font-medium">{row.totalPenalty}</span>
                          </div>
                        </TableCell>
                      );
                    }
                    const attempt = row.problems.find((ap) => ap.problemId === columnKey);
                    return <TableCell key={columnKey}>{renderProblemCell(attempt)}</TableCell>;
                  })}
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}
