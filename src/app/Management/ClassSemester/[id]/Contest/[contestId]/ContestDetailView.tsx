"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetClassContestDetailQuery } from "@/store/queries/ClassContest";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
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
  addToast,
} from "@heroui/react";
import {
  ChevronLeft,
  Trophy,
  Clock,
  Calendar,
  Target,
  Eye,
  Play,
  Edit3,
  Trash2,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useDeleteClassContestProblemMutation } from "@/store/queries/Contest";
import ScoreboardTab from "./ScoreboardTab";
import EditContestProblemModal from "./components/EditContestProblemModal";
import AddProblemToClassContestModal from "./components/AddProblemToClassContestModal";
import { toast } from "sonner";

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
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingProblem, setEditingProblem] = React.useState<any>(null);

  const { data: userProfile } = useGetUserInformationQuery();
  const [deleteProblem, { isLoading: isDeleting }] = useDeleteClassContestProblemMutation();
  const isStudent = userProfile?.role?.toLowerCase() === "student";

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
        if (now == start || currentTime == start) {
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
          selectedKey={selectedTab}
          onSelectionChange={(key) => {
            if (key === "problems" && isStudent && timeInfo?.isWaiting) {
              addToast({
                title: t("contest_detail.notStarted") || "The contest has not started yet.",
                color: "warning"
              });
              return;
            }
            setSelectedTab(key as string);
          }}
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

                  {!isStudent && (
                    <Button
                      color="primary"
                      startContent={<Plus size={20} />}
                      className="font-black uppercase tracking-widest text-[13px] bg-[#FF5C00] text-white shadow-xl shadow-[#FF5C00]/20 h-12 px-8"
                      onPress={() => {
                        if (!timeInfo?.isWaiting) {
                          addToast({
                            title: t("contest_detail.alreadyStarted") || "Cuộc thi đã bắt đầu, không thể thêm bài tập!",
                            color: "danger"
                          });
                          return;
                        }
                        setIsAddModalOpen(true);
                      }}
                    >
                      {t("contest_detail.add_problem") || "THÊM BÀI TẬP"}
                    </Button>
                  )}
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
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </motion.span>
                        </TableCell>

                        <TableCell>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                          >
                            <p className="font-black text-base tracking-tight group-hover:text-[#FF5C00] transition-colors">
                              {prob.problemTitle}
                            </p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{prob.problemSlug}</p>
                          </motion.div>
                        </TableCell>

                        <TableCell>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="text-xs font-mono text-slate-400"
                          >
                            {prob.alias || t("common.none") || "none"}
                          </motion.span>
                        </TableCell>

                        <TableCell className="text-center">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.3 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Chip color="primary" variant="flat" className="font-black">
                              {prob.points} {t("contest_detail.pts") || "pts"}
                            </Chip>
                          </motion.div>
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.4 }}
                          >
                            {prob.timeLimitMs ? `${prob.timeLimitMs / 1000}s` : "—"}
                          </motion.span>
                        </TableCell>

                        <TableCell className="text-center text-sm font-medium">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.5 }}
                          >
                            {prob.memoryLimitKb ? `${prob.memoryLimitKb / 1024} MB` : "—"}
                          </motion.span>
                        </TableCell>

                        <TableCell>
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + 0.6 }}
                            className="flex justify-end gap-2"
                          >
                            {!isStudent && (
                              <>
                                <Tooltip content={t("common.edit") || "Chỉnh sửa"}>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
                                    onPress={() => {
                                      if (!timeInfo?.isWaiting) {
                                        addToast({
                                          title: t("contest_detail.alreadyStarted") || "Cuộc thi đã bắt đầu, không thể chỉnh sửa bài tập!",
                                          color: "danger"
                                        });
                                        return;
                                      }
                                      setEditingProblem(prob);
                                      setIsEditModalOpen(true);
                                    }}
                                  >
                                    <Edit3 size={16} />
                                  </Button>
                                </Tooltip>

                                <Tooltip content={t("common.delete") || "Xóa"}>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    color="danger"
                                    className="bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all"
                                    isLoading={isDeleting && editingProblem?.contestProblemId === prob.contestProblemId}
                                    onPress={async () => {
                                      if (!timeInfo?.isWaiting) {
                                        addToast({
                                          title: t("contest_detail.alreadyStarted") || "Cuộc thi đã bắt đầu, không thể xóa bài tập!",
                                          color: "danger"
                                        });
                                        return;
                                      }

                                      if (confirm(t("contest.confirmDeleteProblem") || "Bạn có chắc chắn muốn xóa bài tập này khỏi contest?")) {
                                        try {
                                          setEditingProblem(prob);
                                          await deleteProblem({
                                            classSemesterId,
                                            contestId,
                                            contestProblemId: prob.contestProblemId
                                          }).unwrap();
                                          toast.success(t("contest.deleteProblemSuccess") || "Đã xóa bài tập!");
                                        } catch (err: any) {
                                          toast.error(err?.data?.message || "Xóa thất bại");
                                        } finally {
                                          setEditingProblem(null);
                                        }
                                      }
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </Tooltip>
                              </>
                            )}

                            {!isStudent && (
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
                            )}

                            {isStudent && (
                              <Tooltip content={t("contest_detail.do_it_now") || "Làm bài ngay"}>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="flat"
                                  className="bg-[#FF5C00]/10 text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white"
                                  onPress={() => {
                                    if (isStudent && timeInfo?.isWaiting) {
                                      addToast({
                                        title: t("contest_detail.notStarted") || "The contest has not started yet.",
                                        color: "warning"
                                      });
                                    } else {
                                      router.push(`/Contest/${prob.contestProblemId}/ProblemDetail/${prob.problemId}?classSemesterId=${classSemesterId}&contestId=${contestId}`);
                                    }
                                  }}
                                >
                                  <Play size={16} />
                                </Button>
                              </Tooltip>
                            )}
                          </motion.div>
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
                <ScoreboardTab 
                  classSemesterId={classSemesterId} 
                  contestId={contestId} 
                  isActive={selectedTab === "scoreboard"}
                />
              </motion.div>
            </AnimatePresence>
          </Tab>
        </Tabs>
      </motion.div>

      {/* MODALS */}
      <EditContestProblemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProblem(null);
        }}
        classSemesterId={classSemesterId}
        contestId={contestId}
        problem={editingProblem}
      />

      <AddProblemToClassContestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        classSemesterId={classSemesterId}
        contestId={contestId}
        nextOrdinal={contest.problems.length}
      />
    </motion.div>
  );
}
