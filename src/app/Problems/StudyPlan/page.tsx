"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { PlanCard } from "./PlanCard";
import { ListCard } from "./ListCard";
import { Button, Spinner } from "@heroui/react";
import {
  Target,
  MessageSquareText,
  Filter,
  Database,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
} from "lucide-react";
import { useGetStudyPlansQuery } from "@/store/queries/StudyPlan";
import { useRouter } from "next/navigation";

export default function StudyPlanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { data: response, isLoading } = useGetStudyPlansQuery();
  const studyPlans = response?.data || [];

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

  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans flex relative transition-colors duration-500">
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-xl text-slate-400 hover:text-[#FF5C00] transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="flex-1 min-w-0 relative">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-16 p-8 lg:p-14 lg:pb-32">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full border-b border-slate-200 dark:border-white/10 pb-10 gap-6">
            <div className="space-y-3">
              <h1 className="text-6xl font-black text-[#071739] dark:text-white tracking-tighter uppercase leading-none">
                STUDY <span className="text-[#FF5C00]">PLAN</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  Strategic learning paths to master coding interviews.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-14 px-8 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
              endContent={<ChevronRight size={18} strokeWidth={3} />}
              onPress={() => router.push('/Management/StudyPlan')}
            >
              My Learning Dashboard
            </Button>
          </div>

          {/* Featured Plans */}
          <section className="flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#FF5C00]/10 rounded-xl">
                <Sparkles
                  size={24}
                  className="text-[#FF5C00]"
                  strokeWidth={2.5}
                />
              </div>
              <h2 className="text-2xl font-black text-[#071739] dark:text-white uppercase tracking-tighter">
                FEATURED <span className="text-slate-400">PLANNING</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-20">
                <Spinner color="warning" size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {studyPlans.map((plan, index) => (
                  <div key={plan.id} onClick={() => router.push(`/Problems/StudyPlan/${plan.id}`)}>
                    <PlanCard
                      title={plan.title}
                      desc={`${plan.problemCount || 0} Problems`}
                      bgGradient={getGradient(index)}
                      className="rounded-[2.5rem] shadow-2xl border border-white/5 h-48"
                      icon={getIcon(index)}
                    />
                  </div>
                ))}
                {studyPlans.length === 0 && (
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm col-span-full text-center py-10">
                    No study plans available at the moment.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Additional Sections could go here */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-10">
            {/* ... placeholders for challenges if needed ... */}
          </div>
        </div>
      </div>
    </main>
  );
}
