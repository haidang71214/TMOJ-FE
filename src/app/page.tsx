"use client";
import React, { useState } from "react";
import Sidebar from "./Problems/Sidebar";
import { Card, CardBody, Button, Progress, Avatar } from "@heroui/react";
import {
  Trophy,
  Calendar as CalendarIcon,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Target,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const discussions = [
    {
      title: "Top 10 Algorithms for Coding Interviews 2026",
      author: "DevMaster",
      likes: 245,
      replies: 56,
      tags: ["Interview", "2026"],
    },
    {
      title: "My experience with Dynamic Programming",
      author: "AlgoQueen",
      likes: 189,
      replies: 32,
      tags: ["DP", "Guide"],
    },
    {
      title: "Weekly Contest 430: Solutions & Discussion",
      author: "TMOJ_Staff",
      likes: 567,
      replies: 412,
      tags: ["Contest"],
    },
  ];

  return (
    <main className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans text-[#071739] dark:text-[#F9FAFB] flex relative overflow-hidden transition-colors duration-500">
      {/* 1. LEFT SIDEBAR - Sử dụng #1C2737 */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-[#A4B5C4] dark:border-[#1C2737] bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      {/* 2. SIDEBAR TOGGLE BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white/80 dark:bg-[#1C2737] backdrop-blur-md border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-[#4B6382] dark:text-[#98A2B3] hover:text-[#071739] dark:hover:text-white transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-y-auto p-8 lg:p-12">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-10">
          {/* WELCOME SECTION */}
          <section className="flex flex-col gap-3">
            <h1 className="text-5xl font-extrabold tracking-tight text-[#3F4755] dark:text-white flex items-center gap-3">
              Welcome back,{" "}
              <span className="text-[#071739] dark:text-[#FFB800]">
                Toitapcode
              </span>
            </h1>
            <p className="text-[#4B6382] dark:text-[#98A2B3] font-medium text-lg opacity-80 border-l-2 border-[#A68868] pl-4">
              &ldquo;Mastering code is like carving stone; precision and
              patience lead to a masterpiece.&rdquo;
            </p>
          </section>

          {/* DASHBOARD STATS - Sử dụng #1C2737 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-[#1C2737] border-none rounded-[28px] shadow-sm hover:-translate-y-1 transition-transform group">
              <CardBody className="flex flex-row items-center gap-5 p-6">
                <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl text-[#F59E0B] shadow-sm transition-all">
                  <Flame size={28} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#A4B5C4] dark:text-[#667085] uppercase tracking-widest">
                    Streak
                  </p>
                  <p className="text-3xl font-black text-[#F59E0B]">12 Days</p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1C2737] border-none rounded-[28px] shadow-sm hover:-translate-y-1 transition-transform">
              <CardBody className="flex flex-row items-center gap-5 p-6">
                <div className="p-4 bg-[#071739] dark:bg-[#344054] rounded-2xl text-[#E3C39D] shadow-lg">
                  <Trophy size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#A4B5C4] dark:text-[#667085] uppercase tracking-widest">
                    Solved
                  </p>
                  <p className="text-3xl font-black dark:text-[#F9FAFB]">145</p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white dark:bg-[#1C2737] border-none rounded-[28px] shadow-sm hover:-translate-y-1 transition-transform">
              <CardBody className="flex flex-row items-center gap-5 p-6">
                <div className="p-4 bg-[#A4B5C4] dark:bg-[#475467] rounded-2xl text-white shadow-lg">
                  <CalendarIcon size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#A4B5C4] dark:text-[#667085] uppercase tracking-widest">
                    Date
                  </p>
                  <p className="text-xl font-black dark:text-[#F9FAFB]">
                    Dec 30, 2025
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* RESUME LEARNING - Gradient sâu hơn */}
          <Card className="bg-gradient-to-r from-[#1C2737] to-[#101828] text-white rounded-[40px] overflow-hidden shadow-2xl border border-white/5 dark:border-white/10">
            <CardBody className="p-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col gap-4 max-w-md w-full">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#A68868] text-white text-[10px] font-bold rounded-full uppercase">
                    In Progress
                  </span>
                  <span className="text-white/60 text-sm font-medium">
                    Top Interview 150
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  Next: 3Sum Closest{" "}
                  <Target size={24} className="text-[#E3C39D]" />
                </h2>
                <div className="space-y-2">
                  <Progress
                    size="md"
                    value={68}
                    classNames={{
                      indicator: "bg-[#E3C39D]",
                      track: "bg-white/10",
                    }}
                  />
                  <div className="flex justify-between text-xs font-bold text-white/50">
                    <span>68% Completed</span>
                  </div>
                </div>
              </div>
              <Button className="bg-white dark:bg-[#E3C39D] text-[#101828] font-black h-14 px-10 rounded-2xl flex items-center gap-3 shrink-0 hover:scale-105 transition-all">
                RESUME NOW <ArrowRight size={20} />
              </Button>
            </CardBody>
          </Card>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-black text-[#071739] dark:text-white flex items-center gap-3">
                  <MessageSquare className="text-[#A68868]" /> Community Discuss
                </h3>
                <Button
                  variant="light"
                  className="font-bold text-[#4B6382] dark:text-[#98A2B3]"
                >
                  View All
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {discussions.map((post, i) => (
                  <Card
                    key={i}
                    className="bg-white dark:bg-[#1C2737] border-none rounded-[24px] shadow-sm hover:shadow-md transition-all cursor-pointer p-2"
                  >
                    <CardBody className="flex flex-row gap-5 items-start p-4">
                      <Avatar
                        name={post.author}
                        className="bg-[#CDD5DB] dark:bg-[#101828] text-[#071739] dark:text-[#E3C39D] font-bold shrink-0"
                      />
                      <div className="flex flex-col gap-2 flex-1">
                        <h4 className="font-bold text-lg text-[#071739] dark:text-[#F9FAFB] hover:text-[#A68868] transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-[#A4B5C4] dark:text-[#667085]">
                          <span className="text-[#A68868]">@{post.author}</span>
                          <div className="flex gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#F7F8FA] dark:bg-[#101828] px-2 py-0.5 rounded italic dark:text-[#E3C39D]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            {/* SIDEBAR WIDGETS */}
            <div className="flex flex-col gap-8">
              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-black text-[#071739] dark:text-white flex items-center gap-2 px-2">
                  <TrendingUp size={20} className="text-[#A68868]" /> Trending
                </h3>
                <Card className="bg-white dark:bg-[#1C2737] border-none rounded-[24px] p-2 shadow-sm">
                  <CardBody className="flex flex-col gap-3">
                    {[
                      "#SlidingWindow",
                      "#Recursion",
                      "#SystemDesign",
                      "#BigO",
                    ].map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between hover:bg-[#CDD5DB]/20 dark:hover:bg-[#101828] p-2 rounded-xl cursor-pointer transition-all"
                      >
                        <span className="font-bold text-sm text-[#4B6382] dark:text-[#98A2B3]">
                          {tag}
                        </span>
                        <ChevronRight size={14} className="text-[#A4B5C4]" />
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </section>

              <section className="flex flex-col gap-4">
                <h3 className="text-lg font-black text-[#071739] dark:text-white flex items-center gap-2 px-2">
                  <Users size={20} className="text-[#A68868]" /> Top
                  Contributors
                </h3>
                <div className="flex flex-col gap-4 px-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        className="bg-[#A4B5C4] dark:bg-[#475467]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#071739] dark:text-[#F9FAFB]">
                          User_{i}00
                        </span>
                        <span className="text-[10px] text-[#A68868] font-bold uppercase italic">
                          4.2k XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
