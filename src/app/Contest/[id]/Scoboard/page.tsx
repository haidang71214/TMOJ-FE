"use client";

import React, { useState } from "react";
import { 
  Trophy, RefreshCcw, Download, Clock, ShieldCheck, Lock 
} from "lucide-react";
import { 
  Button, Table, TableHeader, TableColumn, TableBody, 
  TableRow, TableCell, Avatar, Tooltip 
} from "@heroui/react";
import type { ScoreboardResponseDTO, ProblemAttemptDTO } from "./dto";

const mockData: ScoreboardResponseDTO = {
  contestId: "1",
  contestName: "ICPC 2023 vòng Regional",
  status: "running",
  frozen: false,
  problems: [
    { id: "A", title: "Area Query", solvedCount: 12, totalAttempts: 45},
    { id: "B", title: "Backbone Network", solvedCount: 4, totalAttempts: 32},
    { id: "C", title: "Coloring Polygon", solvedCount: 0, totalAttempts: 15},
    { id: "D", title: "Distinctive Number", solvedCount: 18, totalAttempts: 25},
    { id: "E", title: "Even Paths", solvedCount: 1, totalAttempts: 8 },
  ],
  rows: [
    {
      rank: 1, userId: "u1", username: "FPTU_Win", fullname: "Đội FPTU 1",
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
      rank: 2, userId: "u2", username: "HCMUS_Alpha", fullname: "Đội KHTN",
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
      rank: 3, userId: "u3", username: "haidang71214", fullname: "Hải Đăng",
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
      rank: 4, userId: "u4", username: "HUST_Avengers", fullname: "Đội Bách Khoa",
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
  lastUpdated: "2026-03-21T10:23:32+07:00"
};

export default function ScoreboardPage() {
  const [data] = useState<ScoreboardResponseDTO>(mockData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const renderProblemCell = (attempt: ProblemAttemptDTO | undefined) => {
    if (!attempt || (attempt.attemptsCount === 0 && !attempt.pendingCount)) {
      return <div className="w-full h-full min-h-[50px]"></div>;
    }

    if (attempt.isSolved) {
      const classes = attempt.isFirstBlood
        ? "bg-[#10b981] text-white shadow-inner"
        : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
      return (
        <div className={`w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 rounded ${classes}`}>
          <span className="font-bold text-[14px]">
            {attempt.attemptsCount > 1 ? `+${attempt.attemptsCount - 1}` : "+"}
          </span>
          <span className="text-[11px] opacity-90">{attempt.penaltyTime}</span>
        </div>
      );
    }

    if (attempt.pendingCount && attempt.pendingCount > 0) {
      return (
        <div className="w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded">
          <span className="font-bold text-[14px] animate-pulse">?</span>
          <span className="text-[11px] opacity-80">{attempt.attemptsCount} + {attempt.pendingCount}</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 rounded">
        <span className="font-bold text-[14px]">-{attempt.attemptsCount}</span>
      </div>
    );
  };

  return (
    <div className="w-full pb-20 text-slate-800 dark:text-slate-200">

      {/* SCOREBOARD TOOLBAR */}
      <div className="bg-white dark:bg-[#1e293b]/70 border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm relative z-10 transition-all">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#F26F21] font-semibold text-lg">
                <Trophy className="w-5 h-5" />
                <span>Scoreboard (ICPC Format)</span>
              </div>
              <div className="flex items-center gap-4 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Running</span>
                </div>
                {data.frozen && (
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <Lock className="w-4 h-4" />
                    <span>Frozen</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F26F21]" />
                  <span>Last updated: {new Date(data.lastUpdated).toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="flat" 
                color="default"
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium h-9"
                startContent={<RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button 
                className="bg-[#F26F21] hover:bg-[#d95b16] text-white font-medium shadow-sm shadow-[#F26F21]/20 h-9"
                startContent={<Download className="w-4 h-4" />}
                radius="sm"
              >
                Export Excel
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* SCOREBOARD TABLE */}
      <div className="w-full max-w-[1500px] mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-x-auto overflow-y-hidden">
          <Table 
            aria-label="Scoreboard table" 
            removeWrapper
            classNames={{
              base: "min-w-max",
              table: "min-w-max border-collapse",
              th: "bg-[#f1f5f9] dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 font-semibold text-[13px] uppercase tracking-wider py-4 first:rounded-none last:rounded-none border-b border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-center whitespace-nowrap",
              td: "p-0 border-b border-r border-slate-200 dark:border-slate-800/50 last:border-r-0 text-sm align-middle h-full",
              tr: "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group",
            }}
          >
            <TableHeader columns={[
              { key: "rank", label: "Rank", isProblem: false },
              { key: "participant", label: "Participant / Team", isProblem: false },
              { key: "total", label: "Total", isProblem: false },
              ...data.problems.map(p => ({ key: p.id, isProblem: true as const, data: p }))
            ]}>
              {(column) => (
                <TableColumn key={column.key} className={
                  column.key === "rank" ? "w-[60px]" : 
                  column.key === "participant" ? "w-[280px] !text-left pl-6" : 
                  column.key === "total" ? "w-[80px]" : 
                  "w-[70px] px-2"
                }>
                  {column.isProblem && 'data' in column && column.data ? (
                    <Tooltip content={column.data.title} placement="top" className="text-xs">
                      <div className="flex flex-col items-center justify-center gap-1 cursor-help">
                        <span className="font-bold text-[#F26F21] dark:text-[#F26F21]">{column.data.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium normal-case">{column.data.solvedCount}/{column.data.totalAttempts}</span>
                      </div>
                    </Tooltip>
                  ) : column?.isProblem}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={data.rows}>
              {(row) => (
                <TableRow key={row.userId}>
                  {(columnKey) => {
                    if (columnKey === "rank") {
                      return (
                        <TableCell>
                          <div className="flex justify-center items-center w-full h-full min-h-[50px]">
                            <span className={`font-bold text-[15px] ${row.rank <= 3 ? "text-[#F26F21] dark:text-[#F26F21]" : "text-slate-600 dark:text-slate-400"}`}>{row.rank}</span>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "participant") {
                      return (
                        <TableCell>
                          <div className="flex items-center gap-3 w-full h-full px-6 min-h-[50px]">
                            <Avatar 
                              name={row.username.charAt(0)} 
                              src={row.avatarUrl} 
                              size="sm" 
                              className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-8 h-8 text-xs"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900 dark:text-slate-100 text-[14.5px]">{row.fullname || row.username}</span>
                              <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-tight">@{row.username}</span>
                            </div>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "total") {
                      return (
                        <TableCell>
                          <div className="flex flex-col items-center justify-center w-full h-full min-h-[50px] bg-slate-50/50 dark:bg-[#0f172a]/30">
                            <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">{row.totalSolved}</span>
                            <span className="text-[11px] text-slate-500 font-medium">{row.totalPenalty}</span>
                          </div>
                        </TableCell>
                      );
                    }
                    const attempt = row.problems.find((ap) => ap.problemId === columnKey);
                    return <TableCell>{renderProblemCell(attempt)}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}