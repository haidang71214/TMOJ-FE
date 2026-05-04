"use client";
import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../Problems/Sidebar";
import { Button, Chip } from "@heroui/react";
import {
  Target,
  MessageSquareText,
  Filter,
  Database,
  ChevronRight,
  ChevronLeft,
  Layers,
  Trophy,
  Lock,
  Users,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  LogIn,
} from "lucide-react";
import {
  useGetStudyPlansQuery,
  useBuyStudyPlanMutation,
  useGetUnlockedPlansQuery,
  useGetMyStudyProgressQuery
} from "@/store/queries/StudyPlan";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { StudyPlan, UserRole } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSelector } from "@/utils/redux";
import { useModal } from "@/Provider/ModalProvider";
import LoginModal from "@/app/Modal/LoginModal";
import { toast } from "sonner";

type SortOption = "default" | "learners" | "price_asc" | "price_desc" | "name_asc";
type PriceFilter = "all" | "free" | "paid";

export default function StudyPlanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const { openModal } = useModal();

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const searchParams = useSearchParams();

  const tabs = useMemo(() => [
    t("studyplan_page.tab_all") || "All",
    t("studyplan_page.tab_in_progress") || "In Progress",
    t("studyplan_page.tab_unlocked") || "Unlocked",
  ], [t]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "inprogress") {
      setActiveTab(tabs[1]);
    } else if (tab === "unlocked") {
      setActiveTab(tabs[2]);
    } else if (tab === "all") {
      setActiveTab(tabs[0]);
    }
  }, [searchParams, tabs]);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticatedAccount);
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);

  const { data: user } = useGetUserInformationQuery();
  const { data: studyPlansResponse, isLoading: isLoadingAll, refetch } = useGetStudyPlansQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: unlockedPlansResponse, isLoading: isLoadingUnlocked } = useGetUnlockedPlansQuery(undefined, {
    skip: !isAuthenticated || (activeTab !== "All" && activeTab !== t("studyplan_page.tab_unlocked"))
  });
  const { data: myProgressResponse, isLoading: isLoadingProgress } = useGetMyStudyProgressQuery(undefined, {
    skip: !isAuthenticated || (activeTab !== t("studyplan_page.tab_in_progress") && activeTab !== "In Progress")
  });

  const [buyPlan] = useBuyStudyPlanMutation();

  const studyPlans = studyPlansResponse?.data || [];
  const unlockedPlans = unlockedPlansResponse?.data || [];
  const myProgress = myProgressResponse?.items || [];



  const isLoading = activeTab === tabs[2] ? isLoadingUnlocked :
    activeTab === tabs[1] ? isLoadingProgress :
      isLoadingAll;

  const handleBuy = async (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    const plan = studyPlans.find(p => p.id === planId);
    try {
      await buyPlan(planId).unwrap();
      if (plan?.price) {
        window.dispatchEvent(new CustomEvent("coin-deducted", { detail: { amount: plan.price } }));
      }
      toast.success(t("studyplan_detail.buy_success") || "Plan purchased successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || t("studyplan_detail.buy_fail") || "Failed to purchase.");
    }
  };

  const getGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-[#071739] to-[#1e293b]",
      "bg-gradient-to-br from-[#134e4a] to-[#064e3b]",
      "bg-gradient-to-br from-[#4c1d95] to-[#2e1065]",
      "bg-gradient-to-br from-[#164e63] to-[#083344]",
      "bg-gradient-to-br from-[#1e1b4b] to-[#312e81]",
    ];
    return gradients[index % gradients.length];
  };

  const getIcon = (index: number) => {
    const icons = [
      <Target key="target" size={80} className="text-[#FF5C00] opacity-20" />,
      <MessageSquareText key="msg" size={80} className="text-emerald-400 opacity-20" />,
      <Filter key="filter" size={80} className="text-purple-400 opacity-20" />,
      <Database key="db" size={80} className="text-cyan-400 opacity-20" />,
      <Layers key="layers" size={80} className="text-indigo-400 opacity-20" />,
    ];
    return icons[index % icons.length];
  };

  const sortLabels: Record<SortOption, string> = {
    default: t("studyplan_page.sort_default") || "Default",
    learners: t("studyplan_page.sort_learners") || "Most Learners",
    price_asc: t("studyplan_page.sort_price_asc") || "Price: Low to High",
    price_desc: t("studyplan_page.sort_price_desc") || "Price: High to Low",
    name_asc: t("studyplan_page.sort_name_asc") || "Name A to Z",
  };

  const filteredPlans: StudyPlan[] = useMemo(() => {
    // Tab filter
    let base: StudyPlan[] = [];
    if (activeTab === tabs[0]) {
      base = studyPlans;
    } else if (activeTab === tabs[1]) {
      const ids = new Set(myProgress.map((p) => p.studyPlanId));
      base = studyPlans.filter((plan) => ids.has(plan.id));
    } else if (activeTab === tabs[2]) {
      base = unlockedPlans;
    } else {
      base = studyPlans;
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter((p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    // Price filter
    if (priceFilter === "free") base = base.filter((p) => !p.isPaid);
    if (priceFilter === "paid") base = base.filter((p) => p.isPaid);


    // Sort
    switch (sortBy) {
      case "learners": return [...base].sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
      case "price_asc": return [...base].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price_desc": return [...base].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name_asc": return [...base].sort((a, b) => a.title.localeCompare(b.title));
      default: return base;
    }
  }, [studyPlans, unlockedPlans, myProgress, activeTab, searchQuery, priceFilter, sortBy, tabs]);

  const hasActiveFilters = !!searchQuery || priceFilter !== "all" || sortBy !== "default";

  const clearFilters = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setSortBy("default");
  };

  const priceLabels: Record<PriceFilter, string> = {
    all: t("studyplan_page.filter_all_price") || "All Price",
    free: t("studyplan_page.filter_free") || "Free",
    paid: t("studyplan_page.filter_paid") || "Paid",
  };


  const resultCount = filteredPlans.length;
  const resultLabel = resultCount === 1
    ? `1 ${t("studyplan_page.result") || "result"}`
    : `${resultCount} ${t("studyplan_page.results") || "results"}`;

  // Auth guard: show login prompt if not authenticated after hydration
  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#06080F] font-sans flex relative transition-colors duration-500">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#FF5C00] border-t-transparent animate-spin" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#06080F] font-sans flex relative transition-colors duration-500">
        <aside
          className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0D121F] sticky top-0 h-screen overflow-hidden shrink-0 z-40
            ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
        >
          <div className="w-[260px] p-6 pr-2 h-full flex flex-col">
            <Sidebar />
          </div>
        </aside>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-2xl text-slate-400 hover:text-[#FF5C00] transition-all duration-500 cursor-pointer hover:scale-110
            ${isSidebarOpen ? "left-[244px]" : "left-6"}`}
        >
          {isSidebarOpen ? <ChevronLeft size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
        </button>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-8 text-center max-w-md">
            {/* Icon */}
            <div className="relative">
              <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#071739] to-[#1e293b] dark:from-[#FF5C00]/20 dark:to-[#FF5C00]/5 flex items-center justify-center shadow-2xl shadow-[#FF5C00]/10">
                <Lock size={44} className="text-[#FF5C00]" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF5C00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF5C00]/40">
                <LogIn size={14} className="text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#FF5C00] font-black text-[10px] tracking-[0.3em] uppercase">
                <div className="w-6 h-[2px] bg-[#FF5C00]" />
                <span>Authentication Required</span>
                <div className="w-6 h-[2px] bg-[#FF5C00]" />
              </div>
              <h2 className="text-4xl font-black text-[#071739] dark:text-white tracking-tighter uppercase">
                Study{" "}
                <span className="text-slate-400">Pathways</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                You need to be logged in to access Study Plans.
                <br />
                Sign in to track your progress and unlock curated learning pathways.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => openModal({ title: t("common.login") || "Đăng nhập", content: <LoginModal /> })}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#FF5C00] hover:bg-[#e05200] text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg shadow-[#FF5C00]/30 hover:shadow-xl hover:shadow-[#FF5C00]/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn size={16} strokeWidth={3} />
                Sign In
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 border border-slate-200 dark:border-white/10 hover:border-[#FF5C00]/50 hover:text-[#FF5C00] hover:scale-[1.02] active:scale-[0.98]"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#06080F] font-sans flex relative transition-colors duration-500">
      <aside
        className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0D121F] sticky top-0 h-screen overflow-hidden shrink-0 z-40
          ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
      >
        <div className="w-[260px] p-6 pr-2 h-full flex flex-col">
          <Sidebar />
        </div>
      </aside>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-2xl text-slate-400 hover:text-[#FF5C00] transition-all duration-500 cursor-pointer hover:scale-110
          ${isSidebarOpen ? "left-[244px]" : "left-6"}`}
      >
        {isSidebarOpen ? <ChevronLeft size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0 relative overflow-y-auto">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-8 p-8 lg:p-16">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#FF5C00] font-black text-[10px] tracking-[0.3em] uppercase">
                <div className="w-8 h-[2px] bg-[#FF5C00]" />
                <span>{t("studyplan_page.curated_label") || "Curated Learning"}</span>
              </div>
              <h1 className="text-5xl font-black text-[#071739] dark:text-white tracking-tighter uppercase">
                {t("studyplan_page.title1") || "Study"}{" "}
                <span className="text-slate-400">{t("studyplan_page.title2") || "Pathways"}</span>
              </h1>
            </div>
            {user?.role !== UserRole.STUDENT && (
              <Button
                size="lg"
                className="bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-white/10 h-12 rounded-xl"
                onPress={() => router.push('/Management/StudyPlan')}
              >
                {t("studyplan_page.dashboard") || "Dashboard"}
              </Button>
            )}
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-col gap-3">
            {/* Row 1: Search + Sort */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center bg-white dark:bg-[#0D121F] p-2 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="study-plan-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("studyplan_page.search_placeholder") || "Search pathways..."}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#FF5C00]/50 transition-colors dark:text-white"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="relative shrink-0">
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-xs font-black uppercase tracking-wider appearance-none cursor-pointer focus:outline-none focus:border-[#FF5C00]/50 transition-colors text-slate-600 dark:text-slate-300 min-w-[160px]"
                >
                  {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                    <option key={key} value={key}>{sortLabels[key]}</option>
                  ))}
                </select>
                <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
              </div>
            </div>

            {/* Row 2: Tabs + Filter chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tabs */}
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap
                    ${activeTab === tab
                      ? "bg-[#FF5C00] text-white border-[#FF5C00] shadow-sm shadow-[#FF5C00]/20"
                      : "bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 hover:text-[#FF5C00] hover:border-[#FF5C00]/50"}`}
                >
                  {tab}
                </button>
              ))}

              <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
              <SlidersHorizontal size={13} className="text-slate-400 shrink-0" />

              {/* Price chips */}
              {(["all", "free", "paid"] as PriceFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setPriceFilter(f)}
                  className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
                    ${priceFilter === f
                      ? "bg-[#FF5C00] text-white border-[#FF5C00] shadow-sm"
                      : "bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 hover:border-[#FF5C00]/50 hover:text-[#FF5C00]"}`}
                >
                  {priceLabels[f]}
                </button>
              ))}


              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                >
                  <X size={10} />
                  {t("studyplan_page.clear_all") || "Clear all"}
                </button>
              )}

              <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {resultLabel}
              </span>
            </div>
          </div>

          {/* MAIN GRID */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
                <Search size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-400">
                  {t("studyplan_page.no_pathways_title") || "No pathways found"}
                </h3>
                <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                  {hasActiveFilters
                    ? t("studyplan_page.no_pathways_desc_filter") || "Try adjusting your search or filters."
                    : t("studyplan_page.no_pathways_desc_empty") || "Try exploring all pathways."}
                </p>
              </div>
              {hasActiveFilters ? (
                <Button variant="flat" className="font-black uppercase tracking-widest text-[10px] bg-slate-100 dark:bg-white/5" onPress={clearFilters}>
                  {t("studyplan_page.clear_filters") || "Clear Filters"}
                </Button>
              ) : (
                <Button variant="flat" className="font-black uppercase tracking-widest text-[10px] bg-slate-100 dark:bg-white/5" onPress={() => setActiveTab(tabs[0])}>
                  {t("studyplan_page.back_to_all") || "Back to All"}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  onClick={() => router.push(`/StudyPlan/${plan.id}`)}
                  className="group relative bg-white dark:bg-[#0D121F] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-[#FF5C00]/10 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-white/5">
                    {plan.imageUrl ? (
                      <img src={plan.imageUrl} alt={plan.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-white/50 ${getGradient(index)}`}>
                        <div className="scale-[1.5] opacity-40">{getIcon(index)}</div>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
                      {plan.isPaid ? (
                        <Chip size="sm" className="bg-[#FF5C00] text-white font-black text-[9px] uppercase border-none shadow-lg h-5">
                          {plan.price} {t("studyplan_page.coins") || "COINS"}
                        </Chip>
                      ) : (
                        <Chip size="sm" className="bg-emerald-500 text-white font-black text-[9px] uppercase border-none shadow-lg h-5">
                          {t("studyplan_page.free") || "Free"}
                        </Chip>
                      )}
                      <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                        <Trophy size={8} className="text-yellow-400" fill="currentColor" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{plan.problemCount || 0}</span>
                      </div>
                    </div>

                    {!plan.isUnlocked && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white shadow-2xl border border-white/20">
                          <Lock size={20} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-[#071739] dark:text-white uppercase leading-tight tracking-tighter group-hover:text-[#FF5C00] transition-colors line-clamp-1">
                        {plan.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-2 leading-snug">
                        {plan.description || t("studyplan_detail.description_fallback") || "Master these fundamental coding patterns."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                          <Users size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {plan.enrollmentCount || 0} {t("studyplan_page.learners") || "Learners"}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#FF5C00] group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                        {plan.isUnlocked ? <ChevronRight size={16} strokeWidth={3} /> : <Lock size={12} />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
