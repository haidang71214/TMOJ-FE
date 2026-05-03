"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import {
  Award,
  Bookmark,
  BookOpen,
  Briefcase,
  ChevronRight,
  Clock,
  Edit3,
  Flame,
  Lock,
  Mail,
  MessageSquare,
  MoreVertical,
  Presentation,
  Star,
  User,
  Zap,
  Camera,
  Trash2,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  useGetUserInformationQuery,
  useUpdateMeMutation,
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
} from "@/store/queries/usersProfile";
import { useGetCollectionsQuery } from "@/store/queries/collections";
import { useGetFavoriteProblemsQuery, useGetFavoriteContestsQuery } from "@/store/queries/favorites";
import { useGetStudentByIdQuery, useGetTeacherByIdQuery } from "@/store/queries/user";
import {
  useGetGamificationMeQuery,
  useGetBadgesQuery,
  useGetBadgeProgressQuery,
  useGetStreakQuery,
  useGetGamificationHistoryQuery,
  useGetDailyActivitiesQuery
} from "@/store/queries/gamification";
import { useGetProblemSolvedStatsQuery, useGetProblemSolvedListQuery } from "@/store/queries/ProblemSolved";
import { useGetProblemListPublicQuery } from "@/store/queries/ProblemPublic";
import { useGetDiscussionHistoryQuery } from "@/store/queries/discussion";
import { useGetMyInventoryQuery, useEquipItemMutation } from "@/store/queries/store";
import EditProfileModal from "./EditProfileModal";
import GamificationOverview from "./components/GamificationOverview";
import RatingHistoryChart from "@/components/Common/RatingHistoryChart";
import { toast } from "sonner";
import { ErrorForm } from "@/types";
import { Badge } from "@/types/gamification";
import BadgeCelebrationModal from "@/components/Gamification/BadgeCelebrationModal";
import { useEffect } from "react";
import UserAvatar from "@/components/Common/UserAvatar";

// --- INTERFACES ---
interface DifficultyStat {
  label: string;
  solved: number;
  total: number;
  color: string;
  variant:
  | "success"
  | "primary"
  | "warning"
  | "danger"
  | "default"
  | "secondary";
}

interface BadgeItem {
  id: string;
  name: string;
  date: string;
  isLocked: boolean;
  color: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ── /me ──
  const { data: meData, isLoading: meLoading } = useGetUserInformationQuery();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [deleteAvatar, { isLoading: isDeletingAvatar }] = useDeleteAvatarMutation();

  const { data: collectionsResponse, isLoading: collectionsLoading } = useGetCollectionsQuery();
  const { data: favProblemsResponse, isLoading: favProblemsLoading } = useGetFavoriteProblemsQuery({ page: 1, pageSize: 10 });
  const { data: favContestsResponse, isLoading: favContestsLoading } = useGetFavoriteContestsQuery({ page: 1, pageSize: 10 });

  // ── Gamification ──
  const { data: gMeResponse } = useGetGamificationMeQuery();
  console.log("Gamification", gMeResponse);
  const { data: gBadgesResponse } = useGetBadgesQuery();
  const { data: gProgressResponse } = useGetBadgeProgressQuery();
  const { data: gStreakResponse } = useGetStreakQuery();
  const { data: gHistoryResponse } = useGetGamificationHistoryQuery();
  const { data: gActivitiesResponse } = useGetDailyActivitiesQuery();
  const { data: historyData, isLoading: historyLoading } = useGetDiscussionHistoryQuery({ limit: 10 });

  // ── Solved Stats & List ──
  const { data: solvedStatsResponse } = useGetProblemSolvedStatsQuery();
  const { data: solvedListResponse, isLoading: solvedListLoading } = useGetProblemSolvedListQuery({ page: 1, pageSize: 5 });
  const { data: allSolvedResponse } = useGetProblemSolvedListQuery({ page: 1, pageSize: 1000 });

  const { data: easyProblems } = useGetProblemListPublicQuery({ page: 1, pageSize: 1, difficulty: "easy" });
  const { data: mediumProblems } = useGetProblemListPublicQuery({ page: 1, pageSize: 1, difficulty: "medium" });
  const { data: hardProblems } = useGetProblemListPublicQuery({ page: 1, pageSize: 1, difficulty: "hard" });

  const solvedStats = solvedStatsResponse?.data;
  const recentSolvedProblems = solvedListResponse?.data?.items ?? [];

  const solvedByDifficulty = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    const seenIds = new Set<string>();

    (allSolvedResponse?.data?.items ?? []).forEach(p => {
      // Count all solved problems unique by problemId
      if (!seenIds.has(p.problemId)) {
        seenIds.add(p.problemId);
        const d = p.difficulty.toLowerCase();
        if (d === "easy") counts.easy++;
        else if (d === "medium") counts.medium++;
        else if (d === "hard") counts.hard++;
      }
    });
    return counts;
  }, [allSolvedResponse]);

  const gMe = gMeResponse?.data;
  const gStreak = gStreakResponse?.data;
  const gBadges = gProgressResponse?.data || [];

  const easyTotal = Math.max(easyProblems?.pagination?.totalCount ?? 0, gMe?.easyTotal ?? 0);
  const mediumTotal = Math.max(mediumProblems?.pagination?.totalCount ?? 0, gMe?.mediumTotal ?? 0);
  const hardTotal = Math.max(hardProblems?.pagination?.totalCount ?? 0, gMe?.hardTotal ?? 0);
  const completedBadges = useMemo(() => {
    return gBadges.filter((b: any) =>
      b.isCompleted === true ||
      b.progressPercent >= 100 ||
      (b.targetValue > 0 && b.currentValue >= b.targetValue)
    );
  }, [gBadges]);
  const gProgress = gProgressResponse?.data || [];
  const gHistory = gHistoryResponse?.data || [];
  const gActivities = gActivitiesResponse?.data || [];

  const { data: inventoryData } = useGetMyInventoryQuery();
  const equippedFrame = useMemo(() =>
    inventoryData?.find(item => item.itemType === "avatar_frame" && item.isEquipped && !item.isExpired),
    [inventoryData]
  );

  const [equipItem, { isLoading: isEquipping }] = useEquipItemMutation();

  // Badge Celebration Logic
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);



  const handleCloseCelebration = () => {
    if (celebrationBadge) {
      const seenBadges = JSON.parse(localStorage.getItem("seenBadges") || "[]");
      if (!seenBadges.includes(celebrationBadge.badgeId)) {
        localStorage.setItem("seenBadges", JSON.stringify([...seenBadges, celebrationBadge.badgeId]));
      }
    }
    setIsCelebrationOpen(false);
    setCelebrationBadge(null);
  };

  const userId = meData?.userId ?? "";
  const role = meData?.role ?? "";

  // ── Role-based detail query ──
  const { data: studentData, isLoading: studentLoading } = useGetStudentByIdQuery(
    { id: userId },
    { skip: !userId || role !== "student" }
  );
  const { data: teacherData, isLoading: teacherLoading } = useGetTeacherByIdQuery(
    { id: userId },
    { skip: !userId || role !== "teacher" }
  );

  const isDetailLoading = meLoading || studentLoading || teacherLoading;

  // ── Derived data ──
  const student = (studentData as any)?.data?.student;
  const studentClasses = (studentData as any)?.data?.classes ?? [];

  const teacher = (teacherData as any)?.data?.teacher;
  const teacherSubjects = (teacherData as any)?.data?.subjects ?? [];
  const teacherClasses = (teacherData as any)?.data?.classes ?? [];
  const totalClasses = (teacherData as any)?.data?.totalClasses ?? 0;

  const profile = role === "student" ? student : role === "teacher" ? teacher : meData;
  const displayName = profile?.displayName ?? meData?.displayName ?? "";
  const email = profile?.email ?? meData?.email ?? "";
  const username = profile?.username ?? meData?.username ?? "";
  const avatarUrl = profile?.avatarUrl ?? "";

  const difficultyData: DifficultyStat[] = useMemo(
    () => [
      { label: "Easy", solved: solvedByDifficulty.easy, total: easyTotal, color: "text-[#00FF41]", variant: "success" },
      { label: "Med", solved: solvedByDifficulty.medium, total: mediumTotal, color: "text-blue-500", variant: "primary" },
      { label: "Hard", solved: solvedByDifficulty.hard, total: hardTotal, color: "text-[#FF5C00]", variant: "warning" },
    ],
    [solvedByDifficulty, easyTotal, mediumTotal, hardTotal]
  );

  const SOLVED_COUNT = solvedStats?.totalSolved ?? gMe?.solvedProblems ?? 0;
  const TOTAL_COUNT = easyTotal + mediumTotal + hardTotal;

  const userCollections = useMemo(() => {
    const raw = collectionsResponse?.data;
    if (Array.isArray(raw)) return raw;
    if ((raw as any)?.data) return (raw as any).data;
    return [];
  }, [collectionsResponse]);

  const favoriteProblems = favProblemsResponse?.data ?? [];
  const favoriteContests = favContestsResponse?.data ?? [];

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await updateAvatar(formData).unwrap();
      toast.success("Avatar updated successfully");
    } catch (err) {
      const apiError = err as ErrorForm;
      toast.error(apiError?.data?.data?.message || "Failed to update avatar");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar().unwrap();
      toast.success("Avatar removed successfully");
    } catch (err) {
      const apiError = err as ErrorForm;
      toast.error(apiError?.data?.data?.message || "Failed to remove avatar");
    }
  };

  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="text-[#FF5C00]">{icon}</div>
        <span className="text-[10px] font-black uppercase italic text-slate-400">{label}</span>
      </div>
      <span className="text-xs font-[1000] italic text-[#071739] dark:text-white text-right truncate max-w-[55%]">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen text-foreground px-6 py-10 custom-scrollbar bg-[#F0F2F5] dark:bg-[#0A0F1C]  transition-colors ">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-10">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm">
            <CardBody className="p-8 relative z-10">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative group/avatar">
                  <UserAvatar
                    src={avatarUrl}
                    frameUrl={equippedFrame?.itemImageUrl}
                    size="xl"
                    className={`cursor-pointer transition-all duration-500 shadow-2xl rounded-[2.5rem] border-4 border-white dark:border-[#111827] group-hover/avatar:scale-[1.02] ${isUpdatingAvatar || isDeletingAvatar ? "opacity-50" : ""
                      }`}
                  />

                  {/* Loading Spinner Over Avatar */}
                  {(isUpdatingAvatar || isDeletingAvatar) && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <Spinner color="warning" size="lg" />
                    </div>
                  )}

                  {/* Hover overlay for actions */}
                  <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 z-30 backdrop-blur-sm">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-white/20 text-white border-white/20 hover:bg-white/40"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-white/20 text-red-500 border-white/20 hover:bg-red-500 hover:text-white"
                      onClick={handleDeleteAvatar}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                />
              </div>
              <div className="flex flex-col items-center gap-2 mt-8">
                <h1 className="text-2xl font-[1000] uppercase italic tracking-tighter leading-none">
                  {displayName || username || (meLoading ? "..." : "—")}
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                  {username ? `@${username}` : ""}
                </p>
                {role && (
                  <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF5C00]/10 text-[#FF5C00]">
                    {role}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-white/10 text-[#071739] dark:text-white">
                <div className="text-center border-r border-slate-100 dark:border-white/10">
                  <p className="text-[9px] font-black uppercase text-slate-400 italic">
                    Global Rank
                  </p>
                  <p className="text-xl font-[1000] text-[#FF5C00] italic">
                    #5,420
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase text-slate-400 italic">
                    Solved
                  </p>
                  <p className="text-xl font-[1000] text-[#00FF41] italic">
                    {SOLVED_COUNT}
                  </p>
                </div>
              </div>
            </CardBody>

            {/* ── BASIC INFO ── */}
            <CardHeader className="px-8 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#FF5C00]" />
                <h2 className="text-sm font-[1000] uppercase italic tracking-wider text-[#071739] dark:text-white">
                  Basic Info
                </h2>
              </div>
              <Button isIconOnly size="sm" variant="light" onClick={() => router.push("/Settings")} className="text-[#FF5C00]">
                <Settings size={14} />
              </Button>
            </CardHeader>

            <CardBody className="px-8 pb-8 space-y-4">
              {isDetailLoading ? (
                <div className="flex justify-center py-6"><Spinner color="warning" /></div>
              ) : (
                <>
                  <InfoItem icon={<User size={14} />} label="Display Name" value={displayName || "—"} />
                  <Divider className="opacity-30" />
                  <InfoItem icon={<Mail size={14} />} label="Email" value={email || "—"} />
                  <Divider className="opacity-30" />
                  <InfoItem icon={<User size={14} />} label="Username" value={username ? `@${username}` : "—"} />
                  <Divider className="opacity-30" />
                  <InfoItem icon={<Zap size={14} />} label="Role" value={role || "—"} />

                  {/* Student-specific */}
                  {role === "student" && student && (
                    <>
                      <Divider className="opacity-30" />
                      <InfoItem icon={<BookOpen size={14} />} label="Roll Number" value={student.rollNumber || "—"} />
                      <Divider className="opacity-30" />
                      <InfoItem icon={<Briefcase size={14} />} label="Member Code" value={student.memberCode || "—"} />
                    </>
                  )}

                  {/* Teacher-specific */}
                  {role === "teacher" && teacher && (
                    <>
                      <Divider className="opacity-30" />
                      <InfoItem icon={<Presentation size={14} />} label="Total Classes" value={String(totalClasses)} />
                    </>
                  )}
                </>
              )}

              <Button
                size="lg"
                className="w-full font-black uppercase italic text-[11px] tracking-widest bg-slate-50 dark:bg-white/5 text-[#071739] dark:text-white hover:bg-[#00FF41] hover:text-[#071739] transition-all rounded-2xl border border-slate-200 dark:border-white/10 mt-2"
                startContent={<Edit3 size={16} />}
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="w-full font-[1000] uppercase italic text-xs tracking-widest border-divider hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all rounded-2xl mt-2"
                startContent={<Zap size={14} />}
                onClick={() => setIsEquipmentModalOpen(true)}
              >
                Equipments
              </Button>
            </CardBody>
          </Card>

          {/* ── ROLE EXTRA CARD ── */}
          {role === "teacher" && teacherSubjects.length > 0 && (
            <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm">
              <CardHeader className="px-8 pt-8 flex items-center gap-2">
                <BookOpen size={18} className="text-[#FF5C00]" />
                <h2 className="text-sm font-[1000] uppercase italic tracking-wider text-[#071739] dark:text-white">
                  Subjects
                </h2>
              </CardHeader>
              <CardBody className="px-8 pb-8 space-y-3">
                {teacherSubjects.map((s: any) => (
                  <div key={s.subjectId} className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black uppercase italic text-[#071739] dark:text-white">{s.code}</p>
                      <p className="text-[10px] text-slate-400 italic">{s.name}</p>
                    </div>
                    <Chip size="sm" variant="flat" className="font-black italic uppercase text-[9px] bg-orange-50 text-[#FF5C00] dark:bg-[#FF5C00]/10">
                      {s.classCount} class{s.classCount !== 1 ? "es" : ""}
                    </Chip>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {role === "student" && studentClasses.length > 0 && (
            <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm">
              <CardHeader className="px-8 pt-8 flex items-center gap-2">
                <Briefcase size={18} className="text-[#FF5C00]" />
                <h2 className="text-sm font-[1000] uppercase italic tracking-wider text-[#071739] dark:text-white">
                  Classes
                </h2>
              </CardHeader>
              <CardBody className="px-8 pb-8 space-y-4">
                {studentClasses.slice(0, 4).map((c: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black uppercase italic text-[#071739] dark:text-white">{c.classCode}</p>
                      <Chip size="sm" variant="flat" className="text-[9px] font-black italic uppercase bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                        {c.semesterCode}
                      </Chip>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">{c.subjectName}</p>
                    {i < studentClasses.slice(0, 4).length - 1 && <Divider className="opacity-30 mt-2" />}
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {role === "teacher" && teacherClasses.length > 0 && (
            <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[2.5rem] shadow-sm">
              <CardHeader className="px-8 pt-8 flex items-center gap-2">
                <Clock size={18} className="text-[#FF5C00]" />
                <h2 className="text-sm font-[1000] uppercase italic tracking-wider text-[#071739] dark:text-white">
                  Active Classes
                </h2>
              </CardHeader>
              <CardBody className="px-8 pb-8 space-y-4">
                {teacherClasses.slice(0, 4).map((c: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black uppercase italic text-[#071739] dark:text-white">{c.classCode}</p>
                      <Chip size="sm" variant="flat" className="text-[9px] font-black italic uppercase bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                        {c.semesterCode}
                      </Chip>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">{c.subjectName} · {c.memberCount} students</p>
                    {i < teacherClasses.slice(0, 4).length - 1 && <Divider className="opacity-30 mt-2" />}
                  </div>
                ))}
              </CardBody>
            </Card>
          )}


          {/* ================= MAIN CONTENT ================= */}
        </div>
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[3rem] shadow-sm">
            <CardBody className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
              <div className="flex flex-col items-center justify-center border-r border-slate-100 dark:border-white/5 pr-4">
                <div className="relative w-full max-w-[180px] aspect-square flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100 dark:text-white/5"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#FF5C00"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset={TOTAL_COUNT > 0 ? 283 - (SOLVED_COUNT / TOTAL_COUNT) * 283 : 283}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-5xl font-[1000] italic leading-none text-[#071739] dark:text-white">
                      {SOLVED_COUNT}
                    </p>
                    <p className="text-[9px] font-black uppercase text-slate-400 mt-1 italic tracking-widest">
                      Solved
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {difficultyData.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <span
                        className={`text-[10px] font-black uppercase italic ${item.color}`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs font-[1000] text-[#071739] dark:text-white">
                        {item.solved}
                        <span className="text-slate-400 font-bold">
                          /{item.total}
                        </span>
                      </span>
                    </div>
                    <Progress
                      size="sm"
                      value={item.total > 0 ? (item.solved / item.total) * 100 : 0}
                      color={item.variant as any}
                      className="h-2 rounded-full"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-3 border border-slate-100 dark:border-none relative group min-h-[240px] overflow-hidden">
                {/* Celebratory Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C00]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF5C00]/10 blur-[50px] rounded-full group-hover:bg-[#FF5C00]/20 transition-all duration-1000" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />

                {/* Floating Particles (Decorations) */}
                <div className="absolute top-6 left-10 text-[#FF5C00]/30 animate-bounce transition-transform group-hover:scale-150 duration-700" style={{ animationDuration: '3s' }}>
                  <Star size={12} fill="currentColor" />
                </div>
                <div className="absolute bottom-10 right-12 text-blue-500/30 animate-pulse transition-transform group-hover:scale-150 duration-1000">
                  <Award size={14} />
                </div>
                <div className="absolute top-1/2 right-4 text-[#FF5C00]/20 animate-spin transition-transform group-hover:rotate-180 duration-1000" style={{ animationDuration: '8s' }}>
                  <Star size={10} fill="currentColor" />
                </div>

                {completedBadges.length > 0 && completedBadges[0].iconUrl ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#FF5C00]/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                    <img
                      src={completedBadges[0].iconUrl}
                      alt={completedBadges[0].name}
                      className="w-20 h-20 object-contain mb-2 relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500"
                    />
                  </div>
                ) : (
                  <div className="relative p-6 rounded-full bg-white dark:bg-white/5 shadow-xl transition-transform group-hover:scale-110 duration-500">
                    <Award size={48} className="text-[#FF5C00] relative z-10" />
                    <div className="absolute inset-0 bg-[#FF5C00]/20 blur-xl rounded-full animate-pulse" />
                  </div>
                )}

                <p className="text-[10px] font-[1000] uppercase italic text-slate-500 tracking-widest relative z-10">
                  Latest Achievement
                </p>


                {completedBadges.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-base font-black italic uppercase leading-tight text-[#071739] dark:text-white">
                      {completedBadges[0].name}
                    </p>
                    <p className="text-[#00FF41] text-[10px] font-bold uppercase italic">
                      {completedBadges[0].awardedAt || "Achieved"}
                    </p>
                    {completedBadges[0].description && (
                      <p className="text-[9px] text-slate-400 font-bold uppercase italic max-w-[180px] mx-auto leading-tight">
                        {completedBadges[0].description}
                      </p>
                    )}
                  </div>
                ) : (

                  <p className="text-sm font-black italic uppercase text-slate-400">
                    No Badges <br />
                    <span className="text-[10px]">Keep grinding!</span>
                  </p>
                )}
                <Button
                  size="sm"
                  variant="light"
                  className="font-black uppercase italic text-[9px] text-[#FF5C00] tracking-widest hover:bg-[#FF5C00]/10 mt-2"
                  onPress={onOpen}
                >
                  Collection ↗
                </Button>

              </div>
            </CardBody>
          </Card>

          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[3rem] shadow-sm overflow-hidden">
            <CardHeader className="flex justify-between items-center px-10 pt-10 text-[#071739] dark:text-white">
              <div className="flex items-center gap-3">
                <Flame size={24} className="text-[#FF5C00]" />
                <h2 className="text-xl font-[1000] uppercase italic tracking-tighter">
                  Activity Pulse
                </h2>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Streak: {gStreak?.currentStreak ?? 0} Days 🔥
              </p>
            </CardHeader>
            <CardBody className="px-10 pb-10">
              <div className="flex flex-col gap-2">
                {/* Month Labels */}
                <div className="grid grid-cols-53 gap-2 text-[8px] font-black uppercase italic text-slate-400">
                  {Array.from({ length: 53 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (52 - i) * 7);
                    // Hiển thị tên tháng nếu là cột đầu tiên của tháng đó
                    const isFirstColumnOfMonth = date.getDate() <= 7;
                    return (
                      <div key={i} className="h-3">
                        {isFirstColumnOfMonth ? date.toLocaleString("en-US", { month: "short" }) : ""}
                      </div>
                    );
                  })}
                </div>

                {/* Activity Grid */}
                <div className="grid grid-cols-53 gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {Array.from({ length: 371 }).map((_, i) => {
                    const today = new Date();
                    const dateAtI = new Date();
                    dateAtI.setDate(today.getDate() - (370 - i));
                    const dateStr = dateAtI.toISOString().split('T')[0];

                    const activity = gActivities.find(a => a.date === dateStr);
                    const count = activity?.count ?? 0;

                    let bg = "bg-slate-100 dark:bg-white/5";

                    if (count >= 10) bg = "bg-[#00FF41]";
                    else if (count >= 5) bg = "bg-[#00FF41]/80";
                    else if (count >= 3) bg = "bg-[#00FF41]/60";
                    else if (count >= 1) bg = "bg-[#00FF41]/30";

                    return (
                      <div
                        key={i}
                        title={`${dateAtI.toDateString()}: ${count} activities`}
                        className={`w-3.5 h-3.5 rounded-sm shrink-0 hover:scale-125 transition-transform cursor-pointer ${bg}`}
                      />
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          {userId && <RatingHistoryChart userId={userId} />}

          <Card className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-none rounded-[3rem] shadow-sm">
            <Tabs
              variant="underlined"
              classNames={{
                tabList:
                  "px-10 pt-8 gap-8 border-b border-slate-100 dark:border-white/5",
                cursor: "bg-[#FF5C00]",
                tabContent:
                  "font-[1000] uppercase italic text-[11px] tracking-widest group-data-[selected=true]:text-[#FF5C00]",
              }}
            >
              <Tab key="recent" title="Recent AC">
                <div className="px-10 pb-10 divide-y divide-slate-100 dark:divide-white/5">
                  {solvedListLoading ? (
                    <div className="flex justify-center py-10"><Spinner color="warning" /></div>
                  ) : recentSolvedProblems.length > 0 ? (
                    recentSolvedProblems.map((p) => (
                      <div
                        key={p.problemId}
                        className="py-6 flex justify-between items-center group cursor-pointer"
                        onClick={() => router.push(`/Problems/${p.slug}`)}
                      >
                        <div className="space-y-1">
                          <p className="text-base font-black uppercase italic group-hover:text-blue-600 transition-colors text-[#071739] dark:text-white leading-none">
                            {p.title}
                          </p>
                          <p
                            className={`text-[9px] font-black uppercase italic ${p.difficulty === "easy"
                              ? "text-[#00FF41]"
                              : p.difficulty === "hard"
                                ? "text-[#FF5C00]"
                                : "text-blue-500"
                              }`}
                          >
                            {p.difficulty}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 group-hover:text-[#FF5C00] transition-colors">
                          <span className="text-[10px] font-bold uppercase italic">
                            {new Date(p.lastSolvedAt).toLocaleDateString()}
                          </span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-slate-400 italic">No solved problems yet.</div>
                  )}
                  <Button
                    variant="light"
                    className="w-full mt-6 font-black uppercase italic text-[10px] text-[#FF5C00] tracking-[0.2em]"
                    onClick={() => router.push("/Problems/Solved")}
                  >
                    View All solved problems →
                  </Button>
                </div>
              </Tab>
              {/* KHÔI PHỤC CÁC TAB BỊ THIẾU */}
              <Tab key="collections" title="Collections">
                <div className="px-10 pb-10 divide-y divide-slate-100 dark:divide-white/5">
                  {collectionsLoading ? (
                    <div className="flex justify-center py-10"><Spinner color="warning" /></div>
                  ) : userCollections.length > 0 ? (
                    userCollections.slice(0, 4).map((col: any) => (
                      <div
                        key={col.id}
                        className="py-6 flex justify-between items-center group cursor-pointer"
                        onClick={() => router.push(`/Problems/MyLists/${col.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-[#FF5C00] group-hover:bg-[#FF5C00]/20 transition-colors">
                            <Bookmark size={20} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-black uppercase italic group-hover:text-[#FF5C00] transition-colors text-[#071739] dark:text-white leading-none">
                              {col.name}
                            </p>
                            <p className="text-[9px] font-black uppercase italic text-slate-400">
                              {(col.itemsCount ?? col.totalItems ?? col.items?.length ?? 0)} Items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 group-hover:text-[#FF5C00] transition-colors">
                          <span className="text-[10px] font-bold uppercase italic">
                            {new Date(col.updatedAt || col.createdAt).toLocaleDateString()}
                          </span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-slate-400 italic">No collections found.</div>
                  )}
                  {userCollections.length > 4 && (
                    <Button
                      variant="light"
                      className="w-full mt-6 font-black uppercase italic text-[10px] text-[#FF5C00] tracking-[0.2em]"
                      onClick={() => router.push("/Problems/MyLists")}
                    >
                      View All Collections ({userCollections.length}) →
                    </Button>
                  )}
                </div>
              </Tab>
              <Tab key="discussion" title="Discussion">
                <div className="px-10 pb-10 divide-y divide-slate-100 dark:divide-white/5">
                  {historyLoading ? (
                    <div className="flex justify-center py-10"><Spinner color="warning" /></div>
                  ) : historyData?.data && historyData.data.length > 0 ? (
                    historyData.data.map((item: any) => (
                      <div
                        key={item.id}
                        className="py-6 flex justify-between items-center group cursor-pointer"
                        onClick={() => router.push(`/Problems/${item.problemId}?discussionId=${item.discussionId}`)}
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                            <MessageSquare size={20} />
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase italic text-slate-400 truncate">
                              {item.problemTitle || "General Discussion"}
                            </p>
                            <p className="text-base font-black uppercase italic group-hover:text-blue-600 transition-colors text-[#071739] dark:text-white leading-none truncate">
                              {item.title || item.content?.substring(0, 50) + "..."}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 italic">
                              {item.type === "discussion" ? "Started a discussion" : "Commented"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 group-hover:text-[#FF5C00] transition-colors shrink-0 ml-4">
                          <span className="text-[10px] font-bold uppercase italic">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-16 text-center space-y-6">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-[#FF5C00] shadow-sm">
                        <MessageSquare size={36} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase italic text-[#071739] dark:text-white leading-none">Your voice matters</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider max-w-xs mx-auto">You haven&apos;t joined any discussions yet. Share your thoughts on a problem to get started!</p>
                      </div>
                      <Button
                        className="bg-[#FF5C00] text-white font-black uppercase italic text-[11px] tracking-widest px-8 rounded-2xl h-12"
                        onClick={() => router.push("/Problems")}
                      >
                        Explore Problems
                      </Button>
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </Card>
        </div>
      </div>
      {/* ================= MODAL: BADGE COLLECTION ================= */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        backdrop="blur"
        hideCloseButton={true}
        placement="top-center"
        scrollBehavior="inside"
        classNames={{
          wrapper: "pt-10",
          base: "dark:bg-[#071739] bg-white rounded-[3rem] p-6 border border-white/10",
          header: "border-b border-white/10",
          body: "no-scrollbar",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Award size={24} className="text-[#FF5C00]" />
                  <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-[#071739] dark:text-white">
                    Badge <span className="text-[#FF5C00]">Collection</span>
                  </h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic">
                  Unlock your potential through challenges
                </p>
              </ModalHeader>
              <ModalBody className="py-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Achieved Badges */}
                  {completedBadges.map((badge: any) => (
                    <div
                      key={badge.badgeId}
                      className="p-6 rounded-4xl border-2 border-[#FF5C00]/20 bg-slate-50 dark:bg-white/5 shadow-lg flex flex-col items-center gap-4 relative overflow-hidden group"
                    >
                      <div className="p-4 rounded-full bg-white dark:bg-black/20 shadow-inner transition-transform group-hover:scale-110 duration-500 flex items-center justify-center w-20 h-20">
                        {badge.iconUrl ? (
                          <img src={badge.iconUrl} alt={badge.name} className="w-12 h-12 object-contain" />
                        ) : (
                          <Star size={32} className="text-[#FF5C00] fill-current" strokeWidth={3} />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-[1000] uppercase italic text-[#071739] dark:text-white leading-tight">
                          {badge.name}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {badge.awardedAt || "Achieved"}
                        </p>
                        {badge.description && (
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 max-w-[120px] mx-auto opacity-80 italic">
                            {badge.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}


                  {/* Progress Badges from gBadges */}
                  {gBadges.filter((b: any) =>
                    !(b.isCompleted === true ||
                      b.progressPercent >= 100 ||
                      (b.targetValue > 0 && b.currentValue >= b.targetValue))
                  ).map((p: any, i: number) => (
                    <div
                      key={i}
                      className="p-6 rounded-4xl border-2 border-slate-100 dark:border-white/5 grayscale opacity-60 flex flex-col items-center gap-4 relative overflow-hidden group"
                    >
                      <Lock size={16} className="absolute top-4 right-4 text-slate-400" />
                      <div className="p-4 rounded-full bg-white dark:bg-black/20 shadow-inner flex items-center justify-center w-20 h-20">
                        {p.iconUrl ? (
                          <img src={p.iconUrl} alt={p.name} className="w-12 h-12 object-contain" />
                        ) : (
                          <Star size={32} className="text-slate-300" strokeWidth={3} />
                        )}
                      </div>
                      <div className="text-center w-full">
                        <p className="text-sm font-[1000] uppercase italic text-[#071739] dark:text-white leading-tight">
                          {p.name}
                        </p>
                        {p.description && (
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 opacity-80 italic">
                            {p.description}
                          </p>
                        )}
                        <div className="mt-2 space-y-1">
                          <Progress
                            size="sm"
                            value={p.targetValue > 0 ? (p.currentValue / p.targetValue) * 100 : 0}
                            color="warning"
                            className="h-1.5"
                          />
                          <p className="text-[8px] font-black text-slate-400 uppercase italic">
                            {p.currentValue}/{p.targetValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    className="font-black uppercase italic text-xs bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl px-10"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    className="font-black uppercase italic text-xs bg-[#FF5C00] text-white rounded-xl px-10 shadow-lg"
                    onPress={() => {
                      onClose();
                      router.push("/Achievements");
                    }}
                  >
                    View All ↗
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={meData ?? null}
      />

      <BadgeCelebrationModal
        badge={celebrationBadge}
        isOpen={isCelebrationOpen}
        onClose={handleCloseCelebration}
      />

      {/* ================= MODAL: EQUIPMENT MANAGEMENT ================= */}
      <Modal
        isOpen={isEquipmentModalOpen}
        onOpenChange={setIsEquipmentModalOpen}
        size="4xl"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "dark:bg-[#071739] bg-white rounded-[3rem] p-6 border border-white/10",
          header: "border-b border-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Zap size={24} className="text-[#FF5C00]" />
                  <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-[#071739] dark:text-white">
                    Manage <span className="text-[#FF5C00]">Equipments</span>
                  </h2>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic">
                  Customize your presence in the community
                </p>
              </ModalHeader>
              <ModalBody className="py-8">
                <Tabs
                  variant="underlined"
                  classNames={{
                    tabList: "gap-8 border-b border-white/5 mb-6",
                    cursor: "bg-[#FF5C00]",
                    tabContent: "font-black uppercase italic text-xs tracking-widest group-data-[selected=true]:text-[#FF5C00]"
                  }}
                >
                  {/* TAB: AVATAR FRAMES */}
                  <Tab key="frames" title="Avatar Frames">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inventoryData?.filter(item => item.itemType === "avatar_frame" && !item.isExpired).map((item) => (
                        <div key={item.inventoryId} className={`p-6 rounded-4xl border-2 transition-all group relative ${item.isEquipped ? "border-[#FF5C00] bg-[#FF5C00]/5" : "border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5"}`}>
                          <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-24 h-24 relative flex items-center justify-center">
                              <Avatar src={avatarUrl} className="w-16 h-16" />
                              <img src={item.itemImageUrl} alt={item.itemName} className="absolute inset-0 w-full h-full object-contain scale-[1.2]" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-[1000] uppercase italic text-[#071739] dark:text-white leading-tight">{item.itemName}</p>
                            </div>
                            <Button
                              size="sm"
                              isLoading={isEquipping}
                              className={`w-full font-black uppercase italic text-[10px] tracking-widest rounded-xl ${item.isEquipped ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" : "bg-[#FF5C00] text-white hover:bg-[#FF5C00]/80"}`}
                              onClick={async () => {
                                try {
                                  await equipItem({ inventoryId: item.inventoryId, isEquipped: !item.isEquipped }).unwrap();
                                  toast.success(item.isEquipped ? "Unequipped!" : "Equipped!");
                                } catch (err: any) {
                                  toast.error(err?.data?.message || "Action failed");
                                }
                              }}
                            >
                              {item.isEquipped ? "Unequip" : "Equip"}
                            </Button>
                          </div>
                        </div>
                      ))}
                      {inventoryData?.filter(item => item.itemType === "avatar_frame" && !item.isExpired).length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400 italic">You don&apos;t own any avatar frames.</div>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx global>{`
        .grid-cols-53 {
          grid-template-columns: repeat(53, minmax(0, 1fr));
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
