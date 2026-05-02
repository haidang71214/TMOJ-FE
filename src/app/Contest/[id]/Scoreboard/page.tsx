"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy, RefreshCcw, Lock, ShieldCheck, Calendar, Clock, Award, Hash, Zap
} from "lucide-react";
import {
  Button, Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Avatar, Tooltip, Spinner, Card, Chip
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
import type { ScoreboardResponseDTO, ACMProblemAttemptDTO, IOIProblemAttemptDTO, ScoreboardRowDTO, ACMScoreboardRowDTO, IOIScoreboardRowDTO } from "./dto";

export default function ScoreboardPage() {
  const params = useParams();
  const contestId = params.id as string;
  const [pollingInterval, setPollingInterval] = useState<number | undefined>(undefined);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const role = currentUser?.role?.toLowerCase();

  const { data: scoreboardData, isLoading, refetch, isFetching } = useGetScoreboardQuery(contestId, {
    pollingInterval: pollingInterval,
    skipPollingIfUnfocused: true,
  });

  const data = scoreboardData?.data as ScoreboardResponseDTO | undefined;

  useEffect(() => {
    if (!data) return;
    const isRunning = data.status === "running";
    const isFrozen = data.frozen;
    if (isRunning && !isFrozen) {
      setPollingInterval(10 * 1000);
    } else {
      setPollingInterval(undefined);
    }
  }, [data?.status, data?.frozen]);

  const renderACMProblemCell = (attempt: ACMProblemAttemptDTO | undefined) => {
    if (!attempt || attempt.attemptsCount === 0) return <div className="min-h-[50px]"></div>;

    if (attempt.isSolved) {
      const isFirst = attempt.isFirstBlood;
      return (
        <div className={`w-full h-full min-h-[50px] flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isFirst ? "bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/30" : "bg-green-500/10 text-green-600 border border-green-500/20"}`}>
          <span className="font-black italic text-sm">{attempt.attemptsCount > 1 ? `+${attempt.attemptsCount - 1}` : "+"}</span>
          <span className="text-[9px] font-bold opacity-80">{attempt.penaltyTime}</span>
          {isFirst && <Zap size={8} className="mt-0.5 fill-current" />}
        </div>
      );
    }

    return (
      <div className="w-full h-full min-h-[50px] flex flex-col items-center justify-center p-2 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl">
        <span className="font-black italic text-sm">-{attempt.attemptsCount}</span>
      </div>
    );
  };

  const renderIOIProblemCell = (attempt: IOIProblemAttemptDTO | undefined) => {
    if (!attempt || attempt.attemptsCount === 0) return <div className="min-h-[50px]"></div>;
    const score = attempt.score;
    const colorClass = score === 100 ? "bg-green-500 text-white" : score > 0 ? "bg-blue-500/10 text-blue-600" : "bg-rose-500/10 text-rose-600";
    
    return (
      <div className={`w-full h-full min-h-[50px] flex flex-col items-center justify-center p-2 rounded-xl border border-transparent ${colorClass}`}>
        <span className="font-black italic text-sm">{score}</span>
        <span className="text-[9px] font-bold opacity-80">{attempt.attemptsCount} tries</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Spinner size="lg" color="warning" />
        <p className="font-[1000] italic uppercase text-2xl animate-pulse text-[#071739]">Loading Scoreboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <ContestHeader contestId={contestId} />

      <div className="container mx-auto px-4 md:px-10 -mt-10 relative z-20 pb-20">
        {/* TOOLBAR */}
        <Card className="rounded-[2.5rem] border-none shadow-2xl mb-8 overflow-hidden">
          <div className="bg-[#071739] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] flex items-center justify-center shadow-lg shadow-[#FF5C00]/30">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-[1000] italic uppercase leading-none mb-1">Live <span className="text-[#FF5C00]">Scoreboard</span></h2>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-white/50">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#FF5C00]" /> {new Date(data?.lastUpdated || "").toLocaleTimeString()}</span>
                  <span className="flex items-center gap-1.5 text-green-500"><ShieldCheck size={12} /> {data?.status}</span>
                  {data?.frozen && <span className="flex items-center gap-1.5 text-[#FF5C00]"><Lock size={12} /> Frozen</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="flat"
                className="bg-white/10 text-white font-black italic uppercase rounded-xl border border-white/10 hover:bg-white/20 transition-all h-12 px-6"
                startContent={<RefreshCcw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />}
                onPress={() => refetch()}
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </Card>

        {/* RANKING TABLE */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-2xl border-none overflow-hidden">
          <Table
            aria-label="Scoreboard table"
            removeWrapper
            classNames={{
              base: "min-w-max",
              table: "min-w-max",
              th: "bg-[#071739] text-white/50 font-black italic uppercase text-[10px] py-6 first:pl-10 last:pr-10 border-none text-center",
              td: "py-4 text-sm font-bold border-b border-slate-100 dark:border-white/5 px-4 text-center align-middle h-full",
              tr: "hover:bg-[#FF5C00]/5 dark:hover:bg-[#FF5C00]/10 transition-all group",
            }}
          >
            <TableHeader columns={[
              { key: "rank", label: "RANK", isProblem: false },
              { key: "participant", label: "COMPETITOR", isProblem: false },
              { key: "total", label: "TOTAL", isProblem: false },
              ...(data?.problems || []).map(p => ({ key: p.id, label: "", isProblem: true as const, data: p }))
            ]}>
              {(column) => (
                <TableColumn key={column.key} className={column.key === "participant" ? "text-left pl-10 w-[300px]" : column.key === "rank" ? "w-[80px]" : "w-[90px]"}>
                  {column.isProblem && 'data' in column && column.data ? (
                    <Tooltip content={column.data.title} placement="top" className="font-black italic uppercase text-[10px]">
                      <div className="flex flex-col items-center gap-1 cursor-help group/th">
                        <span className="text-[#FF5C00] text-sm font-black">{column.data.id}</span>
                        <span className="text-[8px] text-white/30 group-hover/th:text-white/60 transition-colors">{column.data.solvedCount}/{column.data.totalAttempts}</span>
                      </div>
                    </Tooltip>
                  ) : (column as any).label}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={data?.rows || []} emptyContent="NO RANKINGS AVAILABLE">
              {(row: ScoreboardRowDTO) => (
                <TableRow key={row.userId}>
                  {(columnKey) => {
                    if (columnKey === "rank") {
                      return (
                        <TableCell>
                          <div className="flex justify-center items-center h-full">
                            {row.rank <= 3 ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm shadow-lg ${
                                row.rank === 1 ? "bg-yellow-400 text-yellow-900" :
                                row.rank === 2 ? "bg-slate-300 text-slate-700" :
                                "bg-amber-600 text-amber-100"
                              }`}>
                                {row.rank}
                              </div>
                            ) : (
                              <span className="text-slate-400 font-black italic">{row.rank}</span>
                            )}
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "participant") {
                      return (
                        <TableCell className="text-left pl-10">
                          <div className="flex items-center gap-4">
                            <Avatar src={row.avatarUrl} name={row.username} size="sm" isBordered className="border-[#071739] scale-90" />
                            <div className="flex flex-col">
                              <span className="text-slate-800 dark:text-slate-100 font-black italic uppercase tracking-tight leading-none">{row.fullname || row.username}</span>
                              <span className="text-[9px] text-slate-400 font-bold lowercase">@{row.username}</span>
                            </div>
                          </div>
                        </TableCell>
                      );
                    }
                    if (columnKey === "total") {
                      const isIoi = data?.scoringMode === "ioi";
                      const acmRow = row as ACMScoreboardRowDTO;
                      const ioiRow = row as IOIScoreboardRowDTO;
                      return (
                        <TableCell>
                          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-white/5 rounded-2xl">
                            <span className="text-lg font-[1000] italic text-[#071739] dark:text-white leading-none">
                              {isIoi ? ioiRow.totalScore : acmRow.totalSolved}
                            </span>
                            <span className="text-[9px] text-[#FF5C00] font-black uppercase italic">
                              {isIoi ? 'Points' : `P: ${acmRow.totalPenalty}`}
                            </span>
                          </div>
                        </TableCell>
                      );
                    }

                    const attempt = row.problems.find((ap) => ap.problemId === columnKey);
                    return <TableCell>{data?.scoringMode === "ioi" ? renderIOIProblemCell(attempt as IOIProblemAttemptDTO) : renderACMProblemCell(attempt as ACMProblemAttemptDTO)}</TableCell>;
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