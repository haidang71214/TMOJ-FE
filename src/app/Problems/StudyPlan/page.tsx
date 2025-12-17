"use client";
import React from "react";
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
} from "lucide-react";

export default function StudyPlanPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] font-sans">
      <div className="max-w-[1450px] mx-auto p-6 flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar />

        <div className="flex-1 w-full flex flex-col gap-10">
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
          <section className="flex flex-col gap-4">
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
    </main>
  );
}
