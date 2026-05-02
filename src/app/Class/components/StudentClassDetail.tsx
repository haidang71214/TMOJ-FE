"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  Chip,
  Pagination,
  Spinner,
  addToast,
} from "@heroui/react";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  ChevronDown,
  Lock,
  Rocket,
  ExternalLink,
  Code2,
  Trophy,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetClassSlotsQuery } from "@/store/queries/ClassSlot";
import { useGetClassDetailQuery } from "@/store/queries/Class";
import { useGetClassContestsQuery } from "@/store/queries/ClassContest";
import { ClassSlotResponse } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import ClassTotalRanking from "./ClassTotalRanking";

export default function StudentClassDetail({ semesterId }: { semesterId: string }) {
  const router = useRouter();
  const { t, language } = useTranslation();

  const searchParams = useSearchParams();
  const classCode = searchParams.get("classCode") || "Unknown";
  const semesterCode = searchParams.get("semesterCode") || "";
  const classId = searchParams.get("classId") || "Unknown";

  const [mounted, setMounted] = useState(false);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [slotPage, setSlotPage] = useState(1);
  const slotsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: slotData, isLoading: slotLoading } = useGetClassSlotsQuery(semesterId, {
    skip: !mounted || !semesterId,
  });
  const { data: contestsData, isLoading: isLoadingContests } = useGetClassContestsQuery({ classSemesterId: semesterId });
  const { data: classDetailResponse } = useGetClassDetailQuery({ id: semesterId });
  const classItem = classDetailResponse?.data;
  const currentInstance = classItem?.instances?.find((inst: any) => inst.classSemesterId === semesterId);

  const slots = slotData?.data ?? [];


  const currentSlots = useMemo(() => {
    const start = (slotPage - 1) * slotsPerPage;
    return slots.slice(start, start + slotsPerPage);
  }, [slotPage, slots]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-20 p-4 transition-colors duration-500 text-[#071739] dark:text-white">
      <div className="w-full flex flex-col gap-8">
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
                  {classCode}
                </h2>
                <Chip className="font-black bg-[#FF5C00] text-white text-[10px] h-6 italic uppercase border-none shadow-lg shadow-orange-500/20">
                  {semesterCode}
                </Chip>
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
              {slotLoading && (
                <div className="flex justify-center py-20">
                  <Spinner />
                </div>
              )}
              {currentSlots.map((slot: ClassSlotResponse) => (
                <Card
                  key={slot.id}
                  className={`bg-white dark:bg-[#1C2737] border border-transparent transition-all shadow-sm rounded-[2rem] hover:shadow-xl cursor-pointer`}
                >
                  <CardBody className="p-0">
                    <div
                      className="p-6 flex items-center justify-between group"
                      onClick={() => {
                        const now = new Date();
                        const isLocked = slot.openAt && new Date(slot.openAt) > now;
                        const isClosed = slot.closeAt && new Date(slot.closeAt) < now;
                        const isUnpublished = !slot.isPublished;

                        if (isUnpublished) {
                          addToast({
                            title: language === 'vi'
                              ? 'Bạn phải đợi giảng viên mở bài kiểm tra này!'
                              : 'Please wait for the teacher to open this exam!',
                            color: "warning"
                          });
                          return;
                        }

                        if (isLocked) {
                          addToast({
                            title: language === 'vi'
                              ? `Bài kiểm tra chưa mở! Sẽ mở vào ${new Date(slot.openAt!).toLocaleString()}`
                              : `Exam not open yet! Will open at ${new Date(slot.openAt!).toLocaleString()}`,
                            color: "warning"
                          });
                          return;
                        }

                        if (isClosed) {
                          addToast({
                            title: language === 'vi'
                              ? 'Bài kiểm tra này đã kết thúc và bị khóa!'
                              : 'This exam has ended and is locked!',
                            color: "danger"
                          });
                          return;
                        }

                        setExpandedSlot(
                          expandedSlot === slot.id ? null : slot.id
                        )
                      }}
                    >
                      <div className="flex items-center gap-5">
                        {(() => {
                          const now = new Date();
                          const isLocked = slot.openAt && new Date(slot.openAt) > now;
                          const isClosed = slot.closeAt && new Date(slot.closeAt) < now;
                          const isUnpublished = !slot.isPublished;

                          if (isUnpublished || isLocked || isClosed) {
                            return (
                              <div className="p-4 rounded-2xl bg-slate-500/10 text-slate-400">
                                <Lock size={22} />
                              </div>
                            );
                          }
                          return (
                            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                              <CheckCircle2 size={22} />
                            </div>
                          );
                        })()}
                        <div>
                          <h4 className="font-black text-lg uppercase italic group-hover:text-[#FF5C00] transition-colors">
                            Exam {slot.slotNo}: {slot.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase italic flex items-center gap-1 mt-1">
                            <Clock size={12} /> {slot.openAt ?? "N/A"} — {slot.closeAt ?? "N/A"}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-slate-300 transition-transform ${expandedSlot === slot.id
                            ? "rotate-180 text-[#FF5C00]"
                            : ""
                          }`}
                      />
                    </div>

                    {expandedSlot === slot.id && (
                      <div className="px-8 pb-10 border-t border-slate-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 gap-10 mt-8">
                          {/* PROBLEMS */}
                          <div className="space-y-4">
                            <p className="text-[11px] font-[1000] uppercase italic text-blue-600 flex items-center gap-2">
                              <Code2 size={14} /> Practice Problems
                            </p>
                            {slot.problems && slot.problems.length > 0 ? (
                              <div className="grid grid-cols-1 gap-3">
                                {slot.problems.map((p) => (
                                  <button
                                    key={p.problemId}
                                    onClick={() =>
                                      router.push(`/Examination/${p.problemId}?classSlotId=${slot.id}`)
                                    }
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0A0F1C]/40 border border-slate-100 dark:border-white/5 hover:border-blue-600 transition-all text-left group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                                        <Rocket size={14} />
                                      </div>
                                      <div>
                                        <p className="text-xs font-black uppercase italic group-hover:text-blue-600">
                                          {p.problemTitle}
                                        </p>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                                          {p.points ?? 0} pts • {p.isRequired ? "Required" : "Optional"}
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
                            ) : (
                              <p className="text-xs text-slate-400 italic">No problems assigned yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
              <div className="flex justify-center mt-6">
                <Pagination
                  total={Math.ceil(slots.length / slotsPerPage) || 1}
                  page={slotPage}
                  onChange={setSlotPage}
                  classNames={{
                    cursor: "bg-[#FF5C00] text-white font-[1000] italic",
                  }}
                />
              </div>
            </div>
          </Tab>

          {/* --- TAB: CLASS RANKING --- */}
          <Tab key="ranking" title={t('class_semester.ranking') || "Class Ranking"}>
            <div className="mt-8">
              {classId !== "Unknown" ? (
                <ClassTotalRanking
                  classId={classId}
                  semesterId={semesterId}
                />
              ) : (
                <div className="flex justify-center py-20">
                  <Spinner />
                </div>
              )}
            </div>
          </Tab>

          {/* --- TAB: CONTESTS --- */}
          <Tab key="contests" title={t('class_semester.contests') || "Contests"}>
            <div className="flex flex-col gap-4 mt-8">
              {isLoadingContests && (
                <div className="flex justify-center py-20">
                  <Spinner />
                </div>
              )}

              {!isLoadingContests && (!contestsData?.data || contestsData.data.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-fade-in-up">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-full mb-4">
                    <Trophy size={48} className="opacity-50" />
                  </div>
                  <h3 className="font-black text-xl italic uppercase tracking-wider mb-2 text-[#071739] dark:text-white">No Contests Found</h3>
                  <p className="font-bold text-sm">Wait for your teacher to create a contest.</p>
                </div>
              )}

              {!isLoadingContests && contestsData?.data && contestsData.data.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contestsData.data.map((contest: any, idx: number) => (
                    <Card
                      key={contest.contestId}
                      className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-sm border border-transparent hover:border-[#FF5C00]/30 transition-all animate-fade-in-up"
                      style={{ animationFillMode: "both", animationDelay: `${idx * 50}ms` }}
                    >
                      <CardBody className="p-6 flex flex-col gap-5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-orange-100 text-[#FF5C00] dark:bg-orange-500/10 shrink-0">
                              <Trophy size={28} />
                            </div>
                            <div>
                              <h4 className="font-black text-lg uppercase italic group-hover:text-[#FF5C00] transition-colors line-clamp-1" title={contest.title}>
                                {contest.title}
                              </h4>
                              <Chip
                                size="sm"
                                variant="flat"
                                color={contest.isActive ? "success" : "default"}
                                className="font-black tracking-widest text-[9px] uppercase h-5 mt-1"
                              >
                                {contest.isActive ? "Active" : "Inactive"}
                              </Chip>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Starts</span>
                            <span className="text-xs font-bold">{new Date(contest.startAt).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ends</span>
                            <span className="text-xs font-bold">{new Date(contest.endAt).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-divider pt-5">
                          <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <span className="text-2xl font-black italic text-blue-600 dark:text-blue-400 leading-none">{contest.problemCount}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Problems</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-2xl font-black italic text-emerald-600 dark:text-emerald-400 leading-none">{contest.participantCount}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Participants</span>
                            </div>
                          </div>

                          <Button
                            color="primary"
                            variant="flat"
                            className="font-bold uppercase tracking-wider text-[11px] rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                            onPress={() => router.push(`/ContestSlotExamintion/${semesterId}/Contest/${contest.contestId}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>


        </Tabs>
      </div>
    </div>
  );
}
