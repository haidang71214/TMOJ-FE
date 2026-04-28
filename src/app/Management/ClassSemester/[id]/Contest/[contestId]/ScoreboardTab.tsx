"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy, RefreshCcw, Download, Clock, ShieldCheck, Lock
} from "lucide-react";
import {
  Button, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Avatar, Tooltip, Spinner
} from "@heroui/react";
import { useGetClassContestScoreboardQuery } from "@/store/queries/ClassContest";
import { useFreezeContestMutation, useUnfreezeContestMutation } from "@/store/queries/Contest";
import { toast } from "sonner";
import { ErrorForm } from "@/types";
import type { 
  ScoreboardResponseDTO, 
  ProblemAttemptDTO, 
  ScoreboardRowDTO, 
  ACMProblemAttemptDTO, 
  IOIProblemAttemptDTO, 
  ACMScoreboardRowDTO, 
  IOIScoreboardRowDTO 
} from "@/app/Contest/[id]/Scoreboard/dto";

interface ScoreboardTabProps {
  classSemesterId: string;
  contestId: string;
}

export default function ScoreboardTab({ classSemesterId, contestId }: ScoreboardTabProps) {
  const [pollingInterval, setPollingInterval] = useState<number | undefined>(undefined);

  const { data: scoreboardData, isLoading, refetch, isFetching } = useGetClassContestScoreboardQuery(
    { classSemesterId, contestId },
    {
      pollingInterval: pollingInterval,
      skipPollingIfUnfocused: true,
    }
  );
  console.log("a", scoreboardData);
  
  const [freezeContest, { isLoading: isFreezing }] = useFreezeContestMutation();
  const [unfreezeContest, { isLoading: isUnfreezing }] = useUnfreezeContestMutation();

  const data = scoreboardData?.data as ScoreboardResponseDTO | undefined;

  // Auto-polling mỗi 10s cho ACM/IOI contests trong kỳ thi running
  useEffect(() => {
    if (!data) return;

    const isRunning = data.status === "running";
    const isFrozen = data.frozen;

    if (isRunning && !isFrozen) {
      setPollingInterval(10 * 1000); // 10 seconds
    } else {
      setPollingInterval(undefined);
    }
  }, [data?.scoringMode, data?.status, data?.frozen]);

  const handleRefresh = () => {
    refetch();
  };

  const handleFreezeToggle = async () => {
    if (!data) return;
    try {
      if (data.frozen) {
        await unfreezeContest(contestId).unwrap();
        toast.success("Đã mở băng bảng xếp hạng!");
      } else {
        await freezeContest(contestId).unwrap();
        toast.success("Đã đóng băng bảng xếp hạng!");
      }
    } catch (error) {
      const apiError = error as ErrorForm;
      toast.error(apiError?.data?.data?.message || "Thao tác thất bại");
    }
  };

  const renderACMProblemCell = (attempt: ACMProblemAttemptDTO | undefined) => {
    if (!attempt || attempt.attemptsCount === 0) {
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

    return (
      <div className="w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 rounded">
        <span className="font-bold text-[14px]">-{attempt.attemptsCount}</span>
      </div>
    );
  };

  const renderIOIProblemCell = (attempt: IOIProblemAttemptDTO | undefined) => {
    if (!attempt || attempt.attemptsCount === 0) {
      return <div className="w-full h-full min-h-[50px]"></div>;
    }

    const scoreColor = attempt.score === 100
      ? "bg-[#10b981] text-white shadow-inner"
      : attempt.score > 0
        ? "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400"
        : "bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400";

    return (
      <div className={`w-full h-full min-h-[50px] flex flex-col items-center justify-center p-1 rounded ${scoreColor}`}>
        <span className="font-bold text-[14px]">{attempt.score}</span>
        <span className="text-[10px] opacity-80">{attempt.attemptsCount}x</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-slate-500 font-medium italic animate-pulse">Đang tải bảng xếp hạng...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="p-20 text-center font-bold">Không tìm thấy dữ liệu bảng xếp hạng.</div>;
  }

  return (
    <div className="w-full mt-8 animate-in fade-in duration-500">
      {/* SCOREBOARD TOOLBAR */}
      <div className="bg-white dark:bg-[#111c35] rounded-t-[2.5rem] p-6 shadow-sm border border-transparent dark:border-white/5 relative z-10 transition-all">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#FF5C00] font-black italic text-2xl uppercase tracking-tight">
                <Trophy className="w-6 h-6" />
                <span>Scoreboard</span>
                <span className="text-sm font-mono tracking-normal text-slate-400 ml-2">({data.scoringMode.toUpperCase()})</span>
              </div>
              <div className="flex items-center gap-4 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="uppercase tracking-wider text-[11px] font-black">{data.status}</span>
                </div>
                {data.frozen && (
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <Lock className="w-4 h-4" />
                    <span className="uppercase tracking-wider text-[11px] font-black">Frozen</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF5C00]" />
                  <span className="text-xs">Last updated: {new Date(data.lastUpdated).toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="flat"
                className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold h-10 px-6 rounded-xl"
                startContent={<RefreshCcw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />}
                onPress={handleRefresh}
              >
                REFRESH
              </Button>
              <Button
                className="bg-[#FF5C00] hover:bg-[#d95b16] text-white font-bold h-10 px-6 rounded-xl"
                startContent={<Download className="w-4 h-4" />}
              >
                EXPORT EXCEL
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SCOREBOARD TABLE */}
      <div className="w-full">
        <div className="bg-white dark:bg-[#111c35] rounded-b-[2.5rem] rounded-tr-none p-4 pt-0 shadow-sm border border-transparent dark:border-white/5 border-t-0 overflow-x-auto overflow-y-hidden">
          <Table
            aria-label="Scoreboard table"
            removeWrapper
            classNames={{
              base: "min-w-max",
              table: "min-w-max border-collapse",
              th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-2 text-center whitespace-nowrap",
              td: "p-0 border-b border-r border-slate-50 dark:border-white/5 last:border-r-0 text-sm align-middle h-full",
              tr: "hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group",
            }}
          >
            <TableHeader columns={[
              { key: "rank", label: "RANK", isProblem: false },
              { key: "participant", label: "PARTICIPANT", isProblem: false },
              { key: "total", label: "TOTAL", isProblem: false },
              ...(data?.problems || []).map(p => ({ key: p.id, isProblem: true as const, data: p }))
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
                      <div className="flex flex-col items-center justify-center gap-1 cursor-help py-2">
                        <span className="font-black text-base text-[#FF5C00]">{column.data.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium normal-case">{column.data.solvedCount}/{column.data.totalAttempts}</span>
                      </div>
                    </Tooltip>
                  ) : ('label' in column ? column.label : '')}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={data.rows || []} emptyContent="Chưa có bảng xếp hạng.">
              {(row: ScoreboardRowDTO) => (
                <TableRow key={row.userId}>
                  {(columnKey) => {
                    if (columnKey === "rank") {
                      return (
                        <TableCell>
                          <div className="flex justify-center items-center w-full h-full min-h-[60px]">
                            <span className={`font-black text-[16px] italic ${row.rank <= 3 ? "text-[#FF5C00]" : "text-slate-400"}`}>{row.rank}</span>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "participant") {
                      return (
                        <TableCell>
                          <div className="flex items-center gap-3 w-full h-full px-6 min-h-[60px]">
                            <Avatar
                              name={row.username.charAt(0).toUpperCase()}
                              src={row.avatarUrl}
                              className="w-10 h-10 text-sm font-bold"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-[#071739] dark:text-slate-200 text-[15px]">{row.fullname || row.username}</span>
                              <span className="text-[12px] text-slate-500 font-mono">@{row.username}</span>
                            </div>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "total") {
                      const isIoi = data.scoringMode === "ioi";
                      let totalValue = 0;
                      let totalSolved = 0;

                      if (isIoi) {
                        const ioiRow = row as IOIScoreboardRowDTO;
                        totalValue = ioiRow.totalScore;
                      } else {
                        const acmRow = row as ACMScoreboardRowDTO;
                        totalValue = acmRow.totalPenalty;
                        totalSolved = acmRow.totalSolved;
                      }

                      const label = isIoi ? "PTS" : "PEN";
                      return (
                        <TableCell>
                          <div className="flex flex-col items-center justify-center w-full h-full min-h-[60px] bg-slate-50/50 dark:bg-white/5">
                            {!isIoi && <span className="font-black text-[16px] text-[#071739] dark:text-white">{totalSolved}</span>}
                            <span className="text-[10px] text-slate-400 font-bold">{label}: <span className={isIoi ? "text-[#FF5C00] text-sm" : ""}>{totalValue}</span></span>
                          </div>
                        </TableCell>
                      );
                    }

                    const attempt = row.problems.find((ap) => ap.problemId === columnKey);
                    const isIoi = data.scoringMode === "ioi";
                    if (isIoi) {
                      return <TableCell>{renderIOIProblemCell(attempt as IOIProblemAttemptDTO)}</TableCell>;
                    } else {
                      return <TableCell>{renderACMProblemCell(attempt as ACMProblemAttemptDTO)}</TableCell>;
                    }
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
