"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Divider,
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

export default function ClassContestDetailPage() {
  const params = useParams();
  const router = useRouter();

  const classSemesterId = params?.id as string;
  const contestId = params?.contestId as string;

  const { data: response, isLoading, error } = useGetClassContestDetailQuery(
    { classSemesterId, contestId },
    { skip: !classSemesterId || !contestId }
  );

  const contest = response?.data;

  const timeInfo = useMemo(() => {
    if (!contest) return null;

    const now = new Date();
    const start = new Date(contest.startAt);
    const end = new Date(contest.endAt);

    let statusText = "Upcoming";
    let chipColor: "default" | "primary" | "secondary" | "success" | "warning" | "danger" = "warning";

    if (now >= start && now <= end) {
      statusText = "Ongoing";
      chipColor = "success";
    } else if (now > end) {
      statusText = "Finished";
      chipColor = "default";
    }

    return {
      statusText,
      chipColor,
      startTime: start.toLocaleString("vi-VN"),
      endTime: end.toLocaleString("vi-VN"),
      duration: Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60)),
    };
  }, [contest]);

  // Xử lý description và rules
  const description = contest?.descriptionMd && contest.descriptionMd !== "None" 
    ? contest.descriptionMd 
    : "Chưa có mô tả chi tiết cho cuộc thi này.";

  const rules = contest?.rules && contest.rules !== "None" 
    ? contest.rules 
    : "Không có quy tắc đặc biệt nào được chỉ định cho cuộc thi này.";

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500">Đang tải thông tin contest...</p>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-center">
        <p className="text-red-500 text-2xl mb-4">Không tìm thấy contest</p>
        <Button onPress={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2 bg-[#F0F2F5] dark:bg-[#0A0F1C]">
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
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
            <div className="p-3 bg-gradient-to-br from-[#FF5C00] to-orange-600 rounded-2xl text-white shadow-xl">
              <Trophy size={28} />
            </div>
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
              ✓ ĐÃ THAM GIA
            </Chip>
          )}
        </div>
      </div>

      {/* TABS */}
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
        <Tab key="overview" title="OVERVIEW">
          <div className="mt-8 space-y-8">
            {/* Thời gian - 2 card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BẮT ĐẦU */}
              <div className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                    <Calendar size={22} />
                  </div>
                  <p className="uppercase text-xs font-black tracking-[2px]">BẮT ĐẦU</p>
                </div>
                <p className="text-3xl font-black tracking-tighter text-[#071739] dark:text-white">
                  {timeInfo?.startTime}
                </p>
              </div>

              {/* KẾT THÚC */}
              <div className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                    <Clock size={22} />
                  </div>
                  <p className="uppercase text-xs font-black tracking-[2px]">KẾT THÚC</p>
                </div>
                <p className="text-3xl font-black tracking-tighter text-[#071739] dark:text-white">
                  {timeInfo?.endTime}
                </p>
              </div>
            </div>

            {/* Thời lượng còn lại */}
            <div className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <Target size={22} />
              </div>
              <div>
                <p className="uppercase text-xs font-black tracking-widest text-slate-500">THỜI LƯỢNG CÒN LẠI</p>
                <p className="text-2xl font-black text-emerald-500">
                  {Math.floor(contest.timeRemainingSeconds / 3600)} giờ {Math.floor((contest.timeRemainingSeconds % 3600) / 60)} phút
                </p>
              </div>
            </div>

            {/* Mô tả và Quy tắc - Chia 2 card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card MÔ TẢ */}
              <div className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm h-full">
                <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="uppercase text-xs font-black tracking-[2px]">MÔ TẢ CUỘC THI</p>
                </div>
                <div className="prose dark:prose-invert text-[15px] leading-relaxed whitespace-pre-wrap text-[#071739] dark:text-slate-200">
                  {description}
                </div>
              </div>

              {/* Card QUY TẮC */}
              <div className="bg-white dark:bg-[#111c35] rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm h-full">
                <div className="flex items-center gap-3 text-[#FF5C00] mb-6">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#FF5C00]/10 rounded-2xl">
                    <span className="text-2xl">📜</span>
                  </div>
                  <p className="uppercase text-xs font-black tracking-[2px]">QUY TẮC CUỘC THI</p>
                </div>
                <div className="prose dark:prose-invert text-[15px] leading-relaxed whitespace-pre-wrap text-[#071739] dark:text-slate-200">
                  {rules}
                </div>
              </div>
            </div>
          </div>
        </Tab>

        {/* TAB 2: PROBLEMS */}
        <Tab key="problems" title={`PROBLEMS (${contest.problems.length})`}>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">
                DANH SÁCH BÀI TẬP
              </h2>
              <Button
                color="primary"
                startContent={<Play size={18} />}
                className="bg-[#FF5C00] text-white font-black rounded-xl px-8"
              >
                BẮT ĐẦU LÀM BÀI
              </Button>
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
                <TableColumn className="w-12">#</TableColumn>
                <TableColumn>PROBLEM TITLE</TableColumn>
                <TableColumn>ALIAS</TableColumn>
                <TableColumn className="text-center">POINTS</TableColumn>
                <TableColumn className="text-center">TIME LIMIT</TableColumn>
                <TableColumn className="text-center">MEMORY</TableColumn>
                <TableColumn className="text-right">ACTIONS</TableColumn>
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
                        <Tooltip content="Xem bài tập">
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

                        <Tooltip content="Làm bài ngay">
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
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}