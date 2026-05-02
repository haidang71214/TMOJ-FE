"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy, Download, Clock, ShieldCheck, Lock, Snowflake
} from "lucide-react";
import {
  Button, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Avatar, Tooltip, Spinner
} from "@heroui/react";
import { 
  useGetClassContestScoreboardQuery, 
  useFreezeClassContestMutation, 
  useUnfreezeClassContestMutation 
} from "@/store/queries/ClassContest";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { toast } from "sonner";
import { ErrorForm } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
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
  const { t } = useTranslation();

  const { data: scoreboardData, isLoading, refetch, isFetching } = useGetClassContestScoreboardQuery(
    { classSemesterId, contestId },
    {
      pollingInterval: pollingInterval,
      skipPollingIfUnfocused: true,
    }
  );
  console.log(scoreboardData);
  
  console.log("Scoreboard State:", { isLoading, isFetching, pollingInterval });
  
  const { data: userProfile } = useGetUserInformationQuery();
  const isStudent = userProfile?.role?.toLowerCase() === "student";
  
  const [freezeContest, { isLoading: isFreezing }] = useFreezeClassContestMutation();
  const [unfreezeContest, { isLoading: isUnfreezing }] = useUnfreezeClassContestMutation();

  const data = scoreboardData?.data as ScoreboardResponseDTO | undefined;

  // Auto-polling mỗi 10s cho ACM/IOI contests trong kỳ thi running
  useEffect(() => {
    console.log("Checking Scoreboard Polling:", { 
      status: data?.status, 
      frozen: data?.frozen, 
      hasData: !!data 
    });

    if (!data) return;
    
    const isRunning = data.status?.toLowerCase() === "running" || data.status?.toLowerCase() === "ongoing";
    const isFrozen = data.frozen;

    if (isRunning && !isFrozen) {
      setPollingInterval(3 * 1000); // 3 seconds
    } else {
      setPollingInterval(undefined);
    }
  }, [data?.status, data?.frozen]);


  const handleFreezeToggle = async () => {
    console.log("Freeze Toggle");
    console.log(data?.frozen);
    
    if (!data) return;
    try {
      if (data?.frozen) {
       const res = await unfreezeContest({ classSemesterId, contestId }).unwrap();
        toast.success(t("scoreboard.unfreezeSuccess") || "Đã mở băng bảng xếp hạng!");
       console.log("Unfreeze");
       
        console.log(res);
        
      } else {
       const res = await freezeContest({ classSemesterId, contestId }).unwrap();
        toast.success(t("scoreboard.freezeSuccess") || "Đã đóng băng bảng xếp hạng!");
        console.log("Freeze");
       
        console.log(res);
      }
      refetch();
    } catch (error) {
      const apiError = error as ErrorForm;
      toast.error(apiError?.data?.data?.message || t("common.error") || "Thao tác thất bại");
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Spinner size="lg" color="primary" />
        </motion.div>
        <p className="text-slate-500 font-medium italic animate-pulse">
          {t("scoreboard.loading") || "Đang tải bảng xếp hạng..."}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-20 text-center font-bold">
        {t("scoreboard.not_found") || "Không tìm thấy dữ liệu bảng xếp hạng."}
      </div>
    );
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
                <span>{t("scoreboard.title") || "Scoreboard"}</span>
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
                    <span className="uppercase tracking-wider text-[11px] font-black">{t("scoreboard.frozen") || "Frozen"}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF5C00]" />
                  <span className="text-xs">
                    {t("scoreboard.last_updated") || "Last updated"}: {new Date(data.lastUpdated).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isStudent && (
                <Button
                  variant="flat"
                  className={`${data.frozen 
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" 
                    : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"} font-bold h-10 px-6 rounded-xl`}
                  startContent={<Snowflake className={`w-4 h-4 ${isFreezing || isUnfreezing ? "animate-pulse" : ""}`} />}
                  isLoading={isFreezing || isUnfreezing}
                  onPress={handleFreezeToggle}
                >
                  {data.frozen 
                    ? (t("scoreboard.unfreeze") || "UNFREEZE") 
                    : (t("scoreboard.freeze") || "FREEZE")}
                </Button>
              )}
              <Button
                className="bg-[#FF5C00] hover:bg-[#d95b16] text-white font-bold h-10 px-6 rounded-xl"
                startContent={<Download className="w-4 h-4" />}
              >
                {t("scoreboard.export") || "EXPORT EXCEL"}
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
              { key: "rank", label: t("scoreboard.table.rank") || "RANK", isProblem: false },
              { key: "participant", label: t("scoreboard.table.participant") || "PARTICIPANT", isProblem: false },
              { key: "total", label: t("scoreboard.table.total") || "TOTAL", isProblem: false },
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

            <TableBody 
              items={data.rows || []} 
              emptyContent={t("scoreboard.empty") || "Chưa có bảng xếp hạng."}
            >
              {(row: ScoreboardRowDTO) => {
                const rowIndex = (data.rows as any[]).indexOf(row);
                return (
                  <TableRow key={row.userId}>
                    {(columnKey) => {
                      const cellContent = (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: rowIndex * 0.03 }}
                          className="h-full w-full"
                        >
                          {(() => {
                            if (columnKey === "rank") {
                              return (
                                <div className="flex justify-center items-center w-full h-full min-h-[60px]">
                                  <span className={`font-black text-[16px] italic ${row.rank <= 3 ? "text-[#FF5C00]" : "text-slate-400"}`}>{row.rank}</span>
                                </div>
                              );
                            }
                            if (columnKey === "participant") {
                              return (
                                <div className="flex items-center gap-3 w-full h-full px-6 min-h-[60px]">
                                  <Avatar
                                    name={row.username.charAt(0).toUpperCase()}
                                    src={row.avatarUrl}
                                    className="w-10 h-10 text-sm font-bold"
                                  />
                                  <div className="flex flex-col text-left">
                                    <span className="font-bold text-[#071739] dark:text-slate-200 text-[15px]">{row.fullname || row.username}</span>
                                    <span className="text-[12px] text-slate-500 font-mono">@{row.username}</span>
                                  </div>
                                </div>
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

                              const label = isIoi ? t("scoreboard.table.pts") || "PTS" : t("scoreboard.table.pen") || "PEN";
                              return (
                                <div className="flex flex-col items-center justify-center w-full h-full min-h-[60px] bg-slate-50/50 dark:bg-white/5">
                                  {!isIoi && <span className="font-black text-[16px] text-[#071739] dark:text-white">{totalSolved}</span>}
                                  <span className="text-[10px] text-slate-400 font-bold">{label}: <span className={isIoi ? "text-[#FF5C00] text-sm" : ""}>{totalValue}</span></span>
                                </div>
                              );
                            }

                            const attempt = row.problems.find((ap) => ap.problemId === columnKey);
                            const isIoi = data.scoringMode === "ioi";
                            
                            return (
                              <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: rowIndex * 0.03 + 0.1 }}
                                className="h-full w-full"
                              >
                                {isIoi 
                                  ? renderIOIProblemCell(attempt as IOIProblemAttemptDTO)
                                  : renderACMProblemCell(attempt as ACMProblemAttemptDTO)
                                }
                              </motion.div>
                            );
                          })()}
                        </motion.div>
                      );
                      return <TableCell>{cellContent}</TableCell>;
                    }}
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
