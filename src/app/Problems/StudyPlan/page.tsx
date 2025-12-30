"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { PlanCard } from "./PlanCard";
import { ListCard } from "./ListCard";
import { Button } from "@heroui/react";
import {
  Target,
  MessageSquareText,
  Filter,
  Database,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function StudyPlanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="min-h-screen bg-[#f7f8fa] font-sans flex">
      {/* SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-gray-100 bg-white sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6">
          <Sidebar />
        </div>
      </aside>

      {/* NỘI DUNG VÀ NÚT TOGGLE */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* NÚT TOGGLE - Vị trí top-24 (Cao hơn) */}
        <div className="absolute top-24 -left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:text-blue-500 hover:scale-110 transition-all cursor-pointer"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        <div className="w-full overflow-y-auto h-screen">
          <div className="max-w-[1200px] mx-auto p-8 flex flex-col gap-10">
            {/* Header */}
            <div className="flex justify-between items-center w-full">
              <h1 className="text-3xl font-bold text-gray-900">Study Plan</h1>
              <Button
                size="sm"
                variant="flat"
                className="bg-gray-100 text-gray-500 font-bold px-4"
              >
                My Study Plan <ChevronRight size={16} />
              </Button>
            </div>

            {/* Section: Featured */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">Featured</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PlanCard
                  title="TMOJCode 75"
                  desc="Ace Coding Interview with 75 Qs"
                  bgGradient="bg-gradient-to-br from-blue-600 to-indigo-700"
                  icon={<Target size={80} />}
                />
                <PlanCard
                  title="Top Interview 150"
                  desc="Must-do List for Interview Prep"
                  bgGradient="bg-gradient-to-br from-teal-500 to-emerald-700"
                  icon={<MessageSquareText size={80} />}
                />
                <PlanCard
                  title="Binary Search"
                  desc="8 Patterns, 42 Qs = Master BS"
                  bgGradient="bg-gradient-to-br from-purple-600 to-violet-800"
                  icon={<Filter size={80} />}
                />
                <PlanCard
                  title="SQL 50"
                  desc="Crack SQL Interview in 50 Qs"
                  bgGradient="bg-gradient-to-br from-cyan-600 to-blue-800"
                  icon={<Database size={80} />}
                />
              </div>
            </section>

            {/* Section: 30 Days Challenge */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                30 Days Challenge
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ListCard
                  title="30 Days of Pandas"
                  desc="Essential for pandas interviews"
                  image="/path-to-pandas.png"
                />
                <ListCard
                  title="30 Days of JavaScript"
                  desc="Learn JS Basics with 30 Qs"
                  image="/path-to-js.png"
                />
              </div>
            </section>

            {/* Section: Cracking Coding Interview */}
            <section className="pb-20 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                Cracking Coding Interview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ListCard
                  title="Top Interview 150"
                  desc="Must-do List for Interview Prep"
                  image="/path-to-top150.png"
                />
                <ListCard
                  title="TMOJCode 75"
                  desc="Ace Coding Interview with 75 Qs"
                  image="/path-to-75.png"
                />
                <ListCard
                  title="Top 100 Liked"
                  desc="100 Best Rated Problems"
                  image="/path-to-liked.png"
                />
                <ListCard
                  title="SQL 50"
                  desc="Crack SQL Interview in 50 Qs"
                  image="/path-to-sql.png"
                />
                <ListCard
                  title="Premium Algo 100"
                  desc="TMOJCode Staff Pick"
                  image="/path-to-algo.png"
                  isLocked
                />
                <ListCard
                  title="Advanced SQL 50"
                  desc="50 Advanced SQL Problems"
                  image="/path-to-advsql.png"
                  isLocked
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
