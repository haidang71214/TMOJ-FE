"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetClassContestDetailQuery } from "@/store/queries/ClassContest";
import {
  Button,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Tooltip,
} from "@heroui/react";
import {
  ChevronLeft,
  Trophy,
  Clock,
  Calendar,
  Target,
  Eye,
  Play,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import ScoreboardTab from "./ScoreboardTab";

interface ContestDetailViewProps {
  classSemesterId: string;
  contestId: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function ContestDetailView({ classSemesterId, contestId }: ContestDetailViewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [now, setNow] = React.useState(new Date());
  const { data: response, isLoading, error, refetch } = useGetClassContestDetailQuery(
    { classSemesterId, contestId },
    { skip: !classSemesterId || !contestId }
  );

  const contest = response?.data;

  React.useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      
      if (contest) {
        const start = new Date(contest.startAt);
        const end = new Date(contest.endAt);
        
        // Auto refresh when contest starts or ends
        if (now < start && currentTime >= start) {
          refetch();
        } else if (now <= end && currentTime > end) {
          refetch();
        }
      }
      
      setNow(currentTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [contest, now, refetch]);

  const timeInfo = useMemo(() => {
    if (!contest) return null;

    const start = new Date(contest.startAt);
    const end = new Date(contest.endAt);

    let statusText = t("contest_detail.upcoming") || "Upcoming";
    let chipColor: "default" | "primary" | "secondary" | "success" | "warning" | "danger" = "warning";
    let countdownTitle = t("contest_detail.time_until_start") || "TIME UNTIL START";
    let remainingSeconds = 0;

    if (now >= start && now <= end) {
      statusText = t("contest_detail.ongoing") || "Ongoing";
      chipColor = "success";
      countdownTitle = t("contest_detail.time_remaining") || "TIME REMAINING";
      remainingSeconds = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
    } else if (now > end) {
      statusText = t("contest_detail.finished") || "Finished";
      chipColor = "default";
      countdownTitle = t("contest_detail.finished") || "FINISHED";
      remainingSeconds = 0;
    } else {
      // Upcoming
      countdownTitle = t("contest_detail.time_until_start") || "TIME UNTIL START";
      remainingSeconds = Math.max(0, Math.floor((start.getTime() - now.getTime()) / 1000));
    }

    const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return {
      statusText,
      chipColor,
      startTime: start.toLocaleString("vi-VN"),
      endTime: end.toLocaleString("vi-VN"),
      countdownTitle,
      countdownValue: formatTime(remainingSeconds),
      isFinished: now > end,
      isOngoing: now >= start && now <= end,
      isWaiting: now < start,
    };
  }, [contest, t, now]);

  // Xử lý description và rules
  const description = contest?.descriptionMd && contest.descriptionMd !== "None" 
    ? contest.descriptionMd 
    : (t("contest_detail.no_description") || "Chưa có mô tả chi tiết cho cuộc thi này.");

  const rules = contest?.rules && contest.rules !== "None" 
    ? contest.rules 
    : (t("contest_detail.no_rules") || "Không có quy tắc đặc biệt nào được chỉ định cho cuộc thi này.");

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Spinner size="lg" color="primary" />
        </motion.div>
        <p className="mt-4 text-slate-500">{t("contest_detail.loading") || "Đang tải thông tin contest..."}</p>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-center">
        <p className="text-red-500 text-2xl mb-4">{t("contest_detail.not_found") || "Không tìm thấy contest"}</p>
        <Button onPress={() => router.back()}>{t("contest_detail.back") || "Quay lại"}</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col h-full gap-8 p-2 bg-[#F0F2F5] dark:bg-[#0A0F1C]"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            className="h-12 w-12 rounded-2xl"
            onPress={() => router.back()}
          >
            <ChevronLeft size={28} />
          </Button>

          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-3 bg-gradient-to-br from-[#FF5C00] to-orange-600 rounded-2xl text-white shadow-xl"
            >
              <Trophy size={28} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
                {contest.title}
              </h1>
              <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1">
                {contest.slug}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Chip
            color={timeInfo?.chipColor || "warning"}
            variant="flat"
            className="font-black uppercase text-sm px-6 py-2"
          >
            {timeInfo?.statusText || "Unknown"}
          </Chip>

          {contest.isJoined && (
            <Chip color="success" variant="flat" className="font-black uppercase text-sm px-5 py-2">
              ✓ {t("contest_detail.joined") || "ĐÃ THAM GIA"}
            </Chip>
          )}
        </div>
      </motion.div>

      {/* TABS */}
      <motion.div variants={itemVariants}>
        <Tabs
          aria-label="Contest Detail Tabs"
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-10 pb-2 border-b border-slate-200 dark:border-white/10",
            tab: "h-12 text-sm font-black uppercase tracking-widest text-slate-500 data-[selected=true]:text-[#FF5C00]",
            cursor: "bg-[#FF5C00] h-0.5",
          }}
        >
          {/* TAB 1: OVERVIEW */}
          <Tab key="overview" title={t("contest_detail.overview") || "OVERVIEW"}>
            <AnimatePresence mode="wait">
              <motion.div 
                key="overview-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mt-8 space-y-8"
              >
                {/* Thời gian - 2 card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* BẮT ĐẦU */}
                  <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                      <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                        <Calendar size={22} />
                      </div>
                      <p className="uppercase text-xs font-black tracking-[2px]">{t("contest_detail.start_at") || "BẮT ĐẦU"}</p>
                    </div>
                    <p className="text-3xl font-black tracking-tighter text-[#071739] dark:text-white">
                      {timeInfo?.startTime}
                    </p>
                  </motion.div>

                  {/* KẾT THÚC */}
                  <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                      <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                        <Clock size={22} />
                      </div>
                      <p className="uppercase text-xs font-black tracking-[2px]">{t("contest_detail.end_at") || "KẾT THÚC"}</p>
                    </div>
                    <p className="text-3xl font-black tracking-tighter text-[#071739] dark:text-white">
                      {timeInfo?.endTime}
                    </p>
                  </motion.div>
                </div>

                {/* Thời lượng còn lại */}
                <motion.div whileHover={{ scale: 1.01 }} className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center bg-emerald-500/10 text-emerald-500 rounded-2xl">
                    <Target size={22} />
                  </div>
                  <div>
                    <p className="uppercase text-xs font-black tracking-widest text-slate-500">
                      {timeInfo?.countdownTitle}
                    </p>
                    <p className="text-3xl font-mono font-black text-emerald-500">
                      {timeInfo?.countdownValue}
                    </p>
                  </div>
                </motion.div>

                {/* Mô tả và Quy tắc - Chia 2 card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card MÔ TẢ */}
                  <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm h-full">
                    <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                      <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                        <span className="text-2xl">📝</span>
                      </div>
                      <p className="uppercase text-xs font-black tracking-[2px]">{t("contest_detail.description") || "MÔ TẢ CUỘC THI"}</p>
                    </div>
                    <div className="prose dark:prose-invert text-[15px] leading-relaxed whitespace-pre-wrap text-[#071739] dark:text-slate-200">
                      {description}
                    </div>
                  </motion.div>

                  {/* Card QUY TẮC */}
                  <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm h-full">
                    <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                      <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                        <span className="text-2xl">📜</span>
                      </div>
                      <p className="uppercase text-xs font-black tracking-[2px]">{t("contest_detail.rules") || "QUY TẮC CUỘC THI"}</p>
                    </div>
                    <div className="prose dark:prose-invert text-[15px] leading-relaxed whitespace-pre-wrap text-[#071739] dark:text-slate-200">
                      {rules}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Tab>

          {/* TAB 2: PROBLEMS */}
          <Tab key="problems" title={`${t("contest_detail.problems") || "PROBLEMS"} (${contest.problems.length})`}>
            <AnimatePresence mode="wait">
              <motion.div 
                key="problems-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black italic uppercase tracking-tight">
                    {t("contest_detail.problem_list") || "DANH SÁCH BÀI TẬP"}
                  </h2>
                  {(() => {
                    const isOngoing = timeInfo?.isOngoing;
                    const isFinished = timeInfo?.isFinished;
                    const isWaiting = timeInfo?.isWaiting;

                    if (isFinished) {
                      return (
                        <Button
                          disabled
                          variant="flat"
                          className="bg-slate-100 text-slate-400 font-black rounded-xl px-8"
                        >
                          {t("contest_detail.finished") || "ENDED"}
                        </Button>
                      );
                    }

                    if (isWaiting) {
                      return (
                        <Button
                          disabled
                          variant="flat"
                          className="bg-slate-100 text-slate-400 font-black rounded-xl px-8"
                        >
                          {t("contest_detail.upcoming") || "WAITING"}
                        </Button>
                      );
                    }

                    return (
                      <Button
                        color="primary"
                        disabled={!contest.isActive || !isOngoing}
                        startContent={<Play size={18} />}
                        className={`${
                          contest.isActive && isOngoing 
                            ? "bg-[#FF5C00] text-white" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        } font-black rounded-xl px-8 transition-all active:scale-95`}
                      >
                        {t("contest_detail.start_working") || "BẮT ĐẦU LÀM BÀI"}
                      </Button>
                    );
                  })()}
                </div>

                <Table
                  aria-label="Contest Problems Table"
                  removeWrapper
                  classNames={{
                    base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
                    th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
                    td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
                  }}
                >
                  <TableHeader>
                    <TableColumn className="w-12">{t("contest_detail.table.ordinal") || "#"}</TableColumn>
                    <TableColumn>{t("contest_detail.table.title") || "PROBLEM TITLE"}</TableColumn>
                    <TableColumn>{t("contest_detail.table.alias") || "ALIAS"}</TableColumn>
                    <TableColumn className="text-center">{t("contest_detail.table.points") || "POINTS"}</TableColumn>
                    <TableColumn className="text-center">{t("contest_detail.table.time_limit") || "TIME LIMIT"}</TableColumn>
                    <TableColumn className="text-center">{t("contest_detail.table.memory") || "MEMORY"}</TableColumn>
                    <TableColumn className="text-right">{t("contest_detail.table.actions") || "ACTIONS"}</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {contest.problems.map((prob, index) => (
                      <TableRow
                        key={prob.contestProblemId}
                        className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="text-slate-400 font-black italic">
                          {String(index + 1).padStart(2, "0")}
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="font-black text-base tracking-tight group-hover:text-[#FF5C00] transition-colors">
                              {prob.problemTitle}
                            </p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{prob.problemSlug}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs font-mono text-slate-400">{prob.alias || "none"}</span>
                        </TableCell>

                        <TableCell className="text-center">
                          <Chip color="primary" variant="flat" className="font-black">
                            {prob.points} pts
                          </Chip>
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          {prob.timeLimitMs ? `${prob.timeLimitMs / 1000}s` : "—"}
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          {prob.memoryLimitKb ? `${prob.memoryLimitKb / 1024} MB` : "—"}
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Tooltip content={t("contest_detail.view_problem") || "Xem bài tập"}>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="bg-slate-100 dark:bg-white/5 hover:text-[#FF5C00]"
                                onPress={() => router.push(`/Problems/${prob.problemId}`)}
                              >
                                <Eye size={16} />
                              </Button>
                            </Tooltip>

                            <Tooltip content={t("contest_detail.do_it_now") || "Làm bài ngay"}>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="bg-[#FF5C00]/10 text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white"
                                onPress={() => router.push(`/contest/${contest.contestId}/problem/${prob.problemId}`)}
                              >
                                <Play size={16} />
                              </Button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            </AnimatePresence>
          </Tab>

          {/* TAB 3: SCOREBOARD */}
          <Tab key="scoreboard" title={t("contest_detail.scoreboard") || "SCOREBOARD"}>
            <AnimatePresence mode="wait">
              <motion.div
                key="scoreboard-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ScoreboardTab classSemesterId={classSemesterId} contestId={contestId} />
              </motion.div>
            </AnimatePresence>
          </Tab>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
