"use client";

import React, { useState, use, useMemo, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Button,
  Chip,
  Divider,
  Pagination,
} from "@heroui/react";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  ChevronDown,
  BookOpen,
  Lock,
  Target,
  Zap,
  Rocket,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);

  // Logic phân trang cho Slots
  const [slotPage, setSlotPage] = useState(1);
  const slotsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  const classInfo = useMemo(
    () => ({
      id: resolvedParams.id || "PRF192_SP26",
      name: "Programming Fundamentals",
      semester: "Spring 2026",
      lecturer: "HOAINTT",
    }),
    [resolvedParams.id]
  );

  const myResult = {
    name: "Dang Hai",
    id: "SE180123",
    totalSolved: 45,
    totalProblems: 60,
    averageGrade: 9.25,
    rank: 12,
    history: [
      { slot: "Slot 1", problem: "Two Sum", score: 10, status: "Passed" },
      {
        slot: "Slot 1",
        problem: "Valid Parentheses",
        score: 8.5,
        status: "Passed",
      },
      { slot: "Slot 2", problem: "Merge Sort", score: 10, status: "Passed" },
    ],
  };

  const allSlots = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const now = new Date();
        const startDate = new Date();
        const endDate = new Date();
        if (i < 2) {
          startDate.setHours(now.getHours() - 48);
          endDate.setHours(now.getHours() - 24);
        } else if (i === 2) {
          startDate.setHours(now.getHours() - 1);
          endDate.setHours(now.getHours() + 2);
        } else {
          startDate.setDate(now.getDate() + i * 2);
        }

        const status =
          now > endDate ? "completed" : now >= startDate ? "active" : "locked";

        return {
          id: `s${i + 1}`,
          title: `Slot ${i + 1}: Lesson Content ${i + 1}`,
          start: startDate.toLocaleString("vi-VN"),
          end: endDate.toLocaleString("vi-VN"),
          description: `Practice and master the concepts of week ${Math.ceil(
            (i + 1) / 2
          )}.`,
          problems: [
            { name: `Problem ${i + 1}.1`, difficulty: "Easy" },
            { name: `Problem ${i + 1}.2`, difficulty: "Medium" },
          ],
          status,
        };
      }),
    []
  );

  // Tính toán dữ liệu hiển thị theo trang
  const totalSlotPages = Math.ceil(allSlots.length / slotsPerPage);
  const currentSlots = useMemo(() => {
    const start = (slotPage - 1) * slotsPerPage;
    return allSlots.slice(start, start + slotsPerPage);
  }, [slotPage, allSlots]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex flex-col gap-8 pb-20 p-4 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="w-fit font-black text-slate-400 dark:text-slate-500 uppercase px-0 hover:text-blue-600 dark:hover:text-[#FF5C00] text-[10px]"
            startContent={<ChevronLeft size={16} />}
          >
            Back to My Courses
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none text-[#071739] dark:text-white">
                  {classInfo.id}
                </h2>
                <Chip className="font-black bg-[#FF5C00] text-white text-[10px] h-6 italic uppercase border-none shadow-lg shadow-orange-500/20">
                  {classInfo.semester}
                </Chip>
              </div>
              <h3 className="text-2xl font-black uppercase italic text-slate-500 dark:text-slate-400">
                {classInfo.name}
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-[#1C2737] px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase italic leading-none mb-1">
                  Teacher In Charge
                </p>
                <p className="text-sm font-black text-[#071739] dark:text-white uppercase leading-none">
                  {classInfo.lecturer}
                </p>
              </div>
              <Divider
                orientation="vertical"
                className="h-8 mx-2 bg-slate-200 dark:bg-white/10"
              />
              <div className="p-2 bg-slate-100 dark:bg-[#0A0F1C] rounded-xl text-[#071739] dark:text-[#FF5C00]">
                <User size={20} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        <Tabs
          variant="underlined"
          classNames={{
            cursor: "bg-[#FF5C00]",
            tab: "font-black uppercase italic text-sm h-12 mr-12",
            tabContent:
              "group-data-[selected=true]:text-[#FF5C00] text-slate-400",
          }}
        >
          {/* TAB 1: LEARNING PATH */}
          <Tab key="slots" title="Learning Path">
            <div className="flex flex-col gap-4 mt-8">
              {currentSlots.map((slot) => (
                <Card
                  key={slot.id}
                  className={`bg-white dark:bg-[#1C2737] border border-transparent transition-all shadow-sm rounded-[2rem] ${
                    slot.status === "locked"
                      ? "opacity-60 grayscale"
                      : "hover:border-blue-600 dark:hover:border-[#FF5C00] cursor-pointer shadow-xl"
                  }`}
                >
                  <CardBody className="p-0">
                    <div
                      className="p-6 flex items-center justify-between group"
                      onClick={() =>
                        slot.status !== "locked" &&
                        setExpandedSlot(
                          expandedSlot === slot.id ? null : slot.id
                        )
                      }
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`p-4 rounded-2xl ${
                            slot.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : slot.status === "active"
                              ? "bg-blue-500/10 text-blue-600 dark:text-[#FF5C00] animate-pulse"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {slot.status === "locked" ? (
                            <Lock size={22} />
                          ) : slot.status === "active" ? (
                            <Zap size={22} />
                          ) : (
                            <CheckCircle2 size={22} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-lg uppercase italic text-[#071739] dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#FF5C00] transition-colors">
                            {slot.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase italic flex items-center gap-1">
                              <Clock size={12} /> {slot.start} — {slot.end}
                            </span>
                            {slot.status === "active" && (
                              <Chip
                                size="sm"
                                className="bg-blue-600 dark:bg-[#FF5C00] text-white font-black text-[8px] uppercase h-5 border-none"
                              >
                                Open Now
                              </Chip>
                            )}
                          </div>
                        </div>
                      </div>
                      {slot.status !== "locked" && (
                        <ChevronDown
                          size={20}
                          className={`text-slate-300 dark:text-slate-600 transition-transform ${
                            expandedSlot === slot.id
                              ? "rotate-180 text-blue-600 dark:text-[#FF5C00]"
                              : ""
                          }`}
                        />
                      )}
                    </div>

                    {expandedSlot === slot.id && (
                      <div className="px-8 pb-8 border-t border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                          <div className="lg:col-span-2 space-y-4">
                            <p className="text-[11px] font-black uppercase italic text-blue-600 dark:text-[#FF5C00] opacity-80">
                              Assignment Description
                            </p>
                            <div className="p-6 bg-slate-50 dark:bg-[#0A0F1C]/60 rounded-3xl text-sm italic font-medium text-slate-500 dark:text-slate-400 border dark:border-white/5">
                              {slot.description}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <p className="text-[11px] font-black uppercase italic text-[#FF5C00] opacity-80">
                              Solve Problems
                            </p>
                            <div className="space-y-2">
                              {slot.problems.map((p, i) => (
                                <Button
                                  key={i}
                                  fullWidth
                                  variant="flat"
                                  className="h-14 justify-between bg-slate-50 dark:bg-[#0A0F1C]/40 rounded-2xl border border-transparent hover:border-blue-600 dark:hover:border-[#FF5C00] transition-all"
                                  endContent={
                                    <Rocket
                                      size={16}
                                      className="text-blue-600 dark:text-[#FF5C00]"
                                    />
                                  }
                                >
                                  <div className="text-left">
                                    <p className="text-xs font-black italic uppercase text-[#071739] dark:text-white">
                                      {p.name}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                                      {p.difficulty}
                                    </p>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}

              {/* PHẦN PHÂN TRANG CHO SLOTS */}
              <div className="flex justify-center mt-6">
                <Pagination
                  total={totalSlotPages}
                  page={slotPage}
                  onChange={setSlotPage}
                  classNames={{
                    cursor:
                      "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic",
                  }}
                />
              </div>
            </div>
          </Tab>

          {/* TAB 2: MY PERFORMANCE */}
          <Tab key="results" title="My Performance">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <Card className="lg:col-span-1 bg-[#071739] dark:bg-[#1C2737] text-white rounded-[2.5rem] p-4 shadow-2xl border-none">
                <CardBody className="space-y-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/10 rounded-2xl text-[#FF5C00]">
                      <Target size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase italic">
                        Overall Grade
                      </p>
                      <p className="text-4xl font-[1000] italic text-[#FF5C00]">
                        {myResult.averageGrade}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase italic text-slate-400">
                        Solved Progress
                      </p>
                      <p className="text-sm font-black italic text-[#00FF41]">
                        {myResult.totalSolved}/{myResult.totalProblems}
                      </p>
                    </div>
                    <Progress
                      aria-label="Student progress"
                      value={
                        (myResult.totalSolved / myResult.totalProblems) * 100
                      }
                      size="md"
                      classNames={{
                        indicator: "bg-[#00FF41]",
                        track: "bg-white/10",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase italic">
                        Class Rank
                      </p>
                      <p className="text-xl font-black italic">
                        #{myResult.rank}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase italic">
                        Accuracy
                      </p>
                      <p className="text-xl font-black italic">94%</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="lg:col-span-2 bg-white dark:bg-[#1C2737] rounded-[2.5rem] p-6 shadow-sm border-none">
                <CardBody className="space-y-6">
                  <h4 className="text-xl font-black italic uppercase text-[#071739] dark:text-white flex items-center gap-3">
                    <BookOpen
                      size={24}
                      className="text-blue-600 dark:text-[#FF5C00]"
                    />
                    Submission History
                  </h4>
                  <Table removeWrapper aria-label="Submission history table">
                    <TableHeader>
                      <TableColumn className="font-black uppercase text-[10px] bg-transparent">
                        Assignment
                      </TableColumn>
                      <TableColumn className="font-black uppercase text-[10px] bg-transparent">
                        Problem
                      </TableColumn>
                      <TableColumn className="font-black uppercase text-[10px] text-center bg-transparent">
                        Score
                      </TableColumn>
                      <TableColumn className="font-black uppercase text-[10px] text-right bg-transparent">
                        Status
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      {myResult.history.map((h, i) => (
                        <TableRow
                          key={i}
                          className="border-b border-slate-50 dark:border-white/5 h-16 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="font-bold italic text-slate-400 dark:text-slate-500 text-xs">
                            {h.slot}
                          </TableCell>
                          <TableCell className="font-black italic uppercase text-sm text-[#071739] dark:text-slate-200">
                            {h.problem}
                          </TableCell>
                          <TableCell className="text-center font-black text-lg text-blue-600 dark:text-[#00FF41]">
                            {h.score}
                          </TableCell>
                          <TableCell className="text-right">
                            <Chip
                              size="sm"
                              variant="flat"
                              className="font-black uppercase italic text-[9px] bg-emerald-500/10 text-emerald-500 border-none"
                            >
                              {h.status}
                            </Chip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
        }
      `}</style>
    </div>
  );
}
