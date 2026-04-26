"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy, RefreshCcw, Download, Clock, ShieldCheck, Lock, Search, HelpCircle
} from "lucide-react";
import {
  Button, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Avatar, Tooltip, Spinner
} from "@heroui/react";
import {
  useGetScoreboardQuery,
  useFreezeContestMutation,
  useUnfreezeContestMutation
} from "@/store/queries/Contest";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types";
import { toast } from "sonner";
import ContestHeader from "../components/ContestHeader";
import { ErrorForm } from "@/types";
import type { ScoreboardResponseDTO, ProblemAttemptDTO, ScoreboardRowDTO, ACMProblemAttemptDTO, IOIProblemAttemptDTO, ACMScoreboardRowDTO, IOIScoreboardRowDTO } from "./dto";

export default function ScoreboardPage() {
  const params = useParams();
  const contestId = params.id as string;
  const [pollingInterval, setPollingInterval] = useState<number | undefined>(undefined);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const role = currentUser?.role?.toLowerCase();
  const isAdminOrManager = role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.TEACHER;

  const { data: scoreboardData, isLoading, refetch, isFetching } = useGetScoreboardQuery(contestId, {
    pollingInterval: pollingInterval,
    skipPollingIfUnfocused: true,
  });
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
      <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-slate-500 font-medium italic animate-pulse">Đang tải bảng xếp hạng...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="p-20 text-center font-bold">Không tìm thấy dữ liệu bảng xếp hạng.</div>;
  }

  return (
    <div className="w-full pb-20 text-slate-800 dark:text-slate-200 animate-in fade-in duration-500">
      <ContestHeader contestId={contestId} />

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
                startContent={<RefreshCcw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />}
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
                      <div className="flex flex-col items-center justify-center gap-1 cursor-help">
                        <span className="font-bold text-[#F26F21] dark:text-[#F26F21]">{column.data.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium normal-case">{column.data.solvedCount}/{column.data.totalAttempts}</span>
                      </div>
                    </Tooltip>
                  ) : column?.isProblem}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={data.rows || []} emptyContent="No rankings found.">
              {(row: ScoreboardRowDTO) => (
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

                      const label = isIoi ? "Score" : "Penalty";
                      return (
                        <TableCell>
                          <div className="flex flex-col items-center justify-center w-full h-full min-h-[50px] bg-slate-50/50 dark:bg-[#0f172a]/30">
                            {!isIoi && <span className="font-bold text-[15px] text-slate-800 dark:text-slate-200">{totalSolved}</span>}
                            <span className="text-[10px] text-slate-400 font-medium">{label}: {totalValue}</span>
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