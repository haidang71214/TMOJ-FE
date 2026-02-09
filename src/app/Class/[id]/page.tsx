"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Lock,
  Zap,
  Rocket,
  User,
  Trophy,
  ExternalLink,
  Code2,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award,
  History,
  Medal,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

export default function StudentClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string | undefined;

  const [mounted, setMounted] = useState(false);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [slotPage, setSlotPage] = useState(1);
  const slotsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- MOCK DATA ---------------- */
  const classInfo = useMemo(
    () => ({
      id: classId || "PRF192_SP26",
      name: "Programming Fundamentals",
      semester: "Spring 2026",
      lecturer: "HOAINTT",
    }),
    [classId]
  );

  const myDetailedResult = {
    averageGrade: 9.25,
    rank: 12,
    totalPoints: 1250,
    completionRate: 75,
    skills: {
      easy: { solved: 25, total: 30 },
      medium: { solved: 15, total: 20 },
      hard: { solved: 5, total: 10 },
    },
    slotPerformance: [
      {
        slotId: "s1",
        slotTitle: "Slot 1: Basic Programming",
        status: "Completed",
        totalScore: 10,
        submissions: [
          {
            id: "sub-101",
            type: "PROBLEM",
            name: "Two Sum",
            targetId: "p1",
            score: 10,
            status: "Accepted",
            testPassed: "10/10",
            time: "2026-02-01 09:30",
          },
          {
            id: "sub-102",
            type: "PROBLEM",
            name: "Valid Parentheses",
            targetId: "p2",
            score: 8,
            status: "Partial",
            testPassed: "8/10",
            time: "2026-02-01 10:15",
          },
        ],
      },
      {
        slotId: "s2",
        slotTitle: "Slot 2: Array & String",
        status: "In Progress",
        totalScore: 8.5,
        submissions: [
          {
            id: "sub-201",
            type: "CONTEST",
            name: "Weekly Challenge #1",
            targetId: "c1-1",
            score: 8.5,
            status: "Rank #5",
            testPassed: "17/20",
            time: "2026-02-05 14:00",
          },
        ],
      },
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
          status,
          contests: [
            {
              id: `c${i}-1`,
              title: `Mid-term Quiz Slot ${i + 1}`,
              type: "Exam",
              duration: "45m",
            },
          ],
          problems: [
            {
              id: `p${i}-1`,
              name: `Algorithm Practice ${i + 1}.1`,
              difficulty: "Easy",
            },
            {
              id: `p${i}-2`,
              name: `Logic Challenge ${i + 1}.2`,
              difficulty: "Medium",
            },
          ],
        };
      }),
    []
  );

  const currentSlots = useMemo(() => {
    const start = (slotPage - 1) * slotsPerPage;
    return allSlots.slice(start, start + slotsPerPage);
  }, [slotPage, allSlots]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] flex flex-col gap-8 pb-20 p-4 transition-colors duration-500 text-[#071739] dark:text-white">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-8">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
          <Button
            variant="light"
            onPress={() => router.back()}
            className="w-fit font-black text-slate-400 dark:text-slate-500 uppercase px-0 hover:text-[#FF5C00] text-[10px]"
            startContent={<ChevronLeft size={16} />}
          >
            Back to Dashboard
          </Button>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none">
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
                  Teacher
                </p>
                <p className="text-sm font-black uppercase leading-none">
                  {classInfo.lecturer}
                </p>
              </div>
              <Divider
                orientation="vertical"
                className="h-8 mx-2 bg-slate-200 dark:bg-white/10"
              />
              <div className="p-2 bg-slate-100 dark:bg-[#0A0F1C] rounded-xl text-[#FF5C00]">
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
          {/* --- TAB 1: LEARNING PATH --- */}
          <Tab key="slots" title="Learning Path">
            <div className="flex flex-col gap-4 mt-8">
              {currentSlots.map((slot) => (
                <Card
                  key={slot.id}
                  className={`bg-white dark:bg-[#1C2737] border border-transparent transition-all shadow-sm rounded-[2rem] ${
                    slot.status === "locked"
                      ? "opacity-60 grayscale"
                      : "hover:shadow-xl cursor-pointer"
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
                              ? "bg-blue-500/10 text-[#FF5C00] animate-pulse"
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
                          <h4 className="font-black text-lg uppercase italic group-hover:text-[#FF5C00] transition-colors">
                            {slot.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase italic flex items-center gap-1 mt-1">
                            <Clock size={12} /> {slot.start} — {slot.end}
                          </span>
                        </div>
                      </div>
                      {slot.status !== "locked" && (
                        <ChevronDown
                          size={20}
                          className={`text-slate-300 transition-transform ${
                            expandedSlot === slot.id
                              ? "rotate-180 text-[#FF5C00]"
                              : ""
                          }`}
                        />
                      )}
                    </div>
                    {expandedSlot === slot.id && (
                      <div className="px-8 pb-10 border-t border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
                          {/* CONTESTS */}
                          <div className="space-y-4">
                            <p className="text-[11px] font-[1000] uppercase italic text-[#FF5C00] flex items-center gap-2">
                              <Trophy size={14} /> Active Contests
                            </p>
                            {slot.contests.map((c) => (
                              <Card
                                key={c.id}
                                className="bg-slate-50 dark:bg-black/20 border-none rounded-2xl group transition-all"
                              >
                                <CardBody className="p-4 flex flex-row items-center justify-between">
                                  <div className="min-w-0">
                                    <h5 className="font-black text-sm uppercase italic truncate">
                                      {c.title}
                                    </h5>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                                      {c.type} • {c.duration}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    className="bg-[#FF5C00] text-white font-black uppercase italic text-[10px] rounded-xl px-5 h-9"
                                    onPress={() =>
                                      router.push(`/Contest/${c.id}`)
                                    }
                                  >
                                    Join{" "}
                                    <ArrowRight size={14} className="ml-1" />
                                  </Button>
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                          {/* PROBLEMS */}
                          <div className="space-y-4">
                            <p className="text-[11px] font-[1000] uppercase italic text-blue-600 flex items-center gap-2">
                              <Code2 size={14} /> Practice Problems
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                              {slot.problems.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() =>
                                    router.push(`/Problems/${p.id}`)
                                  }
                                  className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0A0F1C]/40 border border-slate-100 dark:border-white/5 hover:border-blue-600 transition-all text-left group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                                      <Rocket size={14} />
                                    </div>
                                    <div>
                                      <p className="text-xs font-black uppercase italic group-hover:text-blue-600">
                                        {p.name}
                                      </p>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                                        {p.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                  <ExternalLink
                                    size={14}
                                    className="text-slate-300 group-hover:text-blue-600 transition-colors"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
              <div className="flex justify-center mt-6">
                <Pagination
                  total={3}
                  page={slotPage}
                  onChange={setSlotPage}
                  classNames={{
                    cursor: "bg-[#FF5C00] text-white font-[1000] italic",
                  }}
                />
              </div>
            </div>
          </Tab>

          {/* --- TAB 2: MY PERFORMANCE --- */}
          <Tab key="results" title="My Performance">
            <div className="flex flex-col gap-8 mt-8">
              {/* TOP ROW: QUICK STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  isPressable
                  onPress={() => router.push("/Ranking")}
                  className="bg-[#FF5C00] text-white rounded-[2rem] border-none shadow-xl hover:scale-[1.03] active:scale-95 transition-all"
                >
                  <CardBody className="flex flex-row items-center gap-5 p-6">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <Trophy size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase italic opacity-80">
                        Class Rank
                      </p>
                      <p className="text-3xl font-[1000] italic">
                        #{myDetailedResult.rank}
                      </p>
                    </div>
                  </CardBody>
                </Card>
                <Card className="bg-[#071739] dark:bg-[#1C2737] text-white rounded-[2rem] border-none">
                  <CardBody className="flex flex-row items-center gap-5 p-6 text-[#FFB800]">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <TrendingUp size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase italic text-slate-400">
                        Total Points
                      </p>
                      <p className="text-3xl font-[1000] italic text-white">
                        {myDetailedResult.totalPoints.toLocaleString()}
                      </p>
                    </div>
                  </CardBody>
                </Card>
                <Card className="bg-white dark:bg-[#1C2737] rounded-[2rem] border-none shadow-sm">
                  <CardBody className="flex flex-row items-center gap-5 p-6">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                      <Award size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase italic text-slate-400">
                        Avg Grade
                      </p>
                      <p className="text-3xl font-[1000] italic">
                        {myDetailedResult.averageGrade}
                      </p>
                    </div>
                  </CardBody>
                </Card>
                <Card className="bg-white dark:bg-[#1C2737] rounded-[2rem] border-none shadow-sm">
                  <CardBody className="flex flex-row items-center gap-5 p-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase italic text-slate-400">
                        Completion
                      </p>
                      <p className="text-3xl font-[1000] italic">
                        {myDetailedResult.completionRate}%
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* MIDDLE ROW: SKILL RADAR */}
              <Card className="bg-white dark:bg-[#1C2737] rounded-[2.5rem] border-none p-6 shadow-sm">
                <CardBody className="space-y-6">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="text-[#FF5C00]" size={24} />
                    <h4 className="font-black uppercase italic text-lg leading-none">
                      Skill Breakdown
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.entries(myDetailedResult.skills).map(
                      ([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase italic text-slate-400">
                              {key}
                            </span>
                            <span className="text-xs font-black italic">
                              {value.solved}/{value.total}
                            </span>
                          </div>
                          <Progress
                            aria-label={key}
                            value={(value.solved / value.total) * 100}
                            size="sm"
                            classNames={{
                              indicator:
                                key === "easy"
                                  ? "bg-emerald-500"
                                  : key === "medium"
                                  ? "bg-blue-500"
                                  : "bg-rose-500",
                              track: "bg-slate-100 dark:bg-white/5",
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* BOTTOM ROW: DETAILED RESULTS BY SLOT */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <History className="text-[#FF5C00]" size={28} />
                  <h4 className="text-2xl font-[1000] uppercase italic tracking-tighter">
                    Detailed{" "}
                    <span className="text-[#FF5C00]">Slot Results</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {myDetailedResult.slotPerformance.map((slot) => (
                    <Card
                      key={slot.slotId}
                      className="bg-white dark:bg-[#1C2737] rounded-[2.5rem] border-none shadow-sm overflow-hidden"
                    >
                      <CardBody className="p-0">
                        <div className="p-6 bg-slate-50/50 dark:bg-black/10 flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#071739] dark:bg-[#FF5C00] flex items-center justify-center text-white font-black italic text-xs">
                              {slot.slotId.toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-black uppercase italic text-sm">
                                {slot.slotTitle}
                              </h5>
                              <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                                Current Score: {slot.totalScore}/10
                              </p>
                            </div>
                          </div>
                          <Chip
                            size="sm"
                            color={
                              slot.status === "Completed"
                                ? "success"
                                : "warning"
                            }
                            variant="flat"
                            className="font-black italic uppercase text-[9px]"
                          >
                            {slot.status}
                          </Chip>
                        </div>
                        <div className="p-4">
                          <Table removeWrapper aria-label="Submissions table">
                            <TableHeader>
                              <TableColumn className="bg-transparent font-black uppercase text-[10px] text-slate-400">
                                Assignment / Problem
                              </TableColumn>
                              <TableColumn className="bg-transparent font-black uppercase text-[10px] text-slate-400 text-center">
                                Test Passed
                              </TableColumn>
                              <TableColumn className="bg-transparent font-black uppercase text-[10px] text-slate-400 text-center">
                                Score
                              </TableColumn>
                              <TableColumn className="bg-transparent font-black uppercase text-[10px] text-slate-400 text-right">
                                Action
                              </TableColumn>
                            </TableHeader>
                            <TableBody>
                              {slot.submissions.map((sub) => (
                                <TableRow
                                  key={sub.id}
                                  className="border-b border-slate-50 dark:border-white/5 last:border-none group"
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      {sub.type === "CONTEST" ? (
                                        <Medal
                                          size={16}
                                          className="text-[#FFB800]"
                                        />
                                      ) : (
                                        <Code2
                                          size={16}
                                          className="text-blue-500"
                                        />
                                      )}
                                      <div>
                                        <p className="font-black uppercase italic text-xs group-hover:text-[#FF5C00] transition-colors">
                                          {sub.name}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                                          {sub.time}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center font-bold text-xs text-slate-500">
                                    {sub.testPassed}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      className={`font-[1000] italic text-xs border-none ${
                                        sub.score >= 8
                                          ? "text-emerald-500"
                                          : "text-orange-500"
                                      }`}
                                    >
                                      {sub.score}
                                    </Chip>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="flat"
                                      className="bg-slate-100 dark:bg-white/5 font-black uppercase italic text-[9px] rounded-xl hover:bg-[#00FF41] hover:text-[#071739] transition-all"
                                      onPress={() =>
                                        router.push(`/Submissions/${sub.id}`)
                                      }
                                    >
                                      Details{" "}
                                      <ExternalLink
                                        size={12}
                                        className="ml-1"
                                      />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
