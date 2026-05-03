"use client";
import React, { useMemo } from "react";
import { Card, CardBody, Progress, Spinner } from "@heroui/react";
import { Play, Lock, LogIn, Sparkles, BookOpen, GraduationCap } from "lucide-react";
import { useAppSelector } from "@/utils/redux";
import { useModal } from "@/Provider/ModalProvider";
import LoginModal from "@/app/Modal/LoginModal";
import {
  useGetStudyPlansQuery,
  useGetUnlockedPlansQuery,
  useGetMyStudyProgressQuery
} from "@/store/queries/StudyPlan";
import { useRouter } from "next/navigation";

export const QuestBanners = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticatedAccount);
  const { openModal } = useModal();
  const router = useRouter();

  // 1. Fetch data
  const { data: plansData, isLoading: isLoadingPlans } = useGetStudyPlansQuery(undefined, { skip: !isAuthenticated });
  const { data: unlockedData } = useGetUnlockedPlansQuery(undefined, { skip: !isAuthenticated });
  const { data: progressData } = useGetMyStudyProgressQuery(undefined, { skip: !isAuthenticated });

  const allPlans = useMemo(() => {
    const data: any = plansData?.data;
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  }, [plansData]);
  const unlockedIds = useMemo(() => {
    const data: any = (unlockedData as any)?.data || unlockedData;
    const list = Array.isArray(data) ? data : (data?.items || []);
    return new Set(list.map((p: any) => p.id));
  }, [unlockedData]);

  const progressList = useMemo(() => {
    const data: any = (progressData as any)?.data || progressData;
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  }, [progressData]);

  // 2. Phân loại Study Plans
  const displayBanners = useMemo(() => {
    if (isLoadingPlans) return [];

    const result: any[] = [];
    const usedIds = new Set();


    // -- Trạng thái 2: Đang làm (In Progress) --
    if (isAuthenticated) {
      const inProgress = allPlans.find((p: any) => {
        const prog = progressList.find((pr: any) => pr.planId === p.id);
        return prog && prog.progress > 0 && prog.progress < 100;
      });
      if (inProgress) {
        const prog = progressList.find((pr: any) => pr.planId === inProgress.id);
        result.push({
          ...inProgress,
          displaySub: "In Progress",
          displayBtn: "Resume",
          type: "resume",
          progress: prog?.progress,
          color: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10",
          icon: <BookOpen size={40} className="text-[#FF5C00]" />
        });
        usedIds.add(inProgress.id);
      }
    }

    // -- Trạng thái 3: Miễn phí (Free) --
    const freePlan = allPlans.find((p: any) => p.price === 0 && !usedIds.has(p.id));
    if (freePlan) {
      result.push({
        ...freePlan,
        displaySub: "Free Plan",
        displayBtn: "Start Now",
        type: "free",
        color: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10",
        icon: <Sparkles size={40} className="text-teal-500" />
      });
      usedIds.add(freePlan.id);
    }

    // -- Trạng thái 4: Cần mua (To Buy) --
    const toBuyPlan = allPlans.find((p: any) => p.price > 0 && !unlockedIds.has(p.id) && !usedIds.has(p.id));
    if (toBuyPlan) {
      result.push({
        ...toBuyPlan,
        displaySub: "Unlock Premium",
        displayBtn: "Explore",
        type: "buy",
        color: "bg-gradient-to-br from-indigo-500 to-purple-600",
        icon: <Lock size={40} className="text-white/20" />
      });
      usedIds.add(toBuyPlan.id);
    }

    // -- Lấp đầy nếu chưa đủ 4 cái --
    allPlans.forEach((p: any) => {
      if (result.length < 4 && !usedIds.has(p.id)) {
        const isUnlocked = p.price === 0 || unlockedIds.has(p.id);
        result.push({
          ...p,
          displaySub: isUnlocked ? "Unlocked" : "Premium",
          displayBtn: isUnlocked ? "Start Now" : "Explore",
          type: isUnlocked ? "free" : "buy",
          color: isUnlocked
            ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10"
            : "bg-gradient-to-br from-indigo-500 to-purple-600",
          icon: isUnlocked ? <GraduationCap size={40} className="text-blue-500" /> : <Lock size={40} className="text-white/20" />
        });
        usedIds.add(p.id);
      }
    });

    return result;
  }, [allPlans, unlockedIds, progressList, isAuthenticated, isLoadingPlans]);

  const handleAction = (banner: any) => {
    router.push(`/StudyPlan/${banner.id}`);
  };

  if (!isAuthenticated) return null;

  if (isLoadingPlans) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="h-36 border-none bg-slate-50 dark:bg-white/5 animate-pulse">
            <CardBody className="flex items-center justify-center">
              <Spinner size="sm" color="warning" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {displayBanners.map((b, i) => (
        <Card
          key={b.id || i}
          isPressable
          onClick={() => handleAction(b)}
          className={`${b.color} h-36 border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`}
        >
          <CardBody className="p-5 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex justify-between items-start">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${b.type === "buy" ? "text-white/80" : "text-gray-400 dark:text-gray-500"}`}>
                  {b.displaySub}
                </p>
                {b.progress && (
                  <span className="text-[10px] font-black text-[#FF5C00] bg-white px-2 py-0.5 rounded-full shadow-sm">
                    {b.progress}%
                  </span>
                )}
              </div>
              <h4 className={`text-sm font-black mt-1 leading-tight line-clamp-2 max-w-[80%] ${b.type === "buy" ? "text-white" : "text-[#071739] dark:text-white"}`}>
                {b.name || b.title}
              </h4>
            </div>

            <div className="space-y-3">
              {b.progress && (
                <Progress
                  aria-label="Progress"
                  size="sm"
                  value={b.progress}
                  color="warning"
                  className="max-w-full"
                  classNames={{ indicator: "bg-[#FF5C00]" }}
                />
              )}
              <div
                className={`w-fit h-8 px-4 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 ${b.type === "buy" ? "bg-white text-indigo-600 shadow-xl" : "bg-[#071739] text-white dark:bg-white dark:text-[#071739]"
                  }`}
              >
                {b.type === "buy" ? <Lock size={12} /> :
                  <Play size={10} fill="currentColor" />
                }
                {b.displayBtn}
              </div>
            </div>

            <div className="absolute -right-2 -bottom-2 opacity-10 dark:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 pointer-events-none text-black dark:text-white">
              {b.icon}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
