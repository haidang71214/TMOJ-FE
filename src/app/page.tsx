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
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const discussions = [
    {
      title: "Top 10 Algorithms for Coding Interviews 2026",
      author: "DevMaster",
      likes: 245,
      replies: 56,
      tags: ["Interview", "2026"],
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "My experience with Dynamic Programming",
      author: "AlgoQueen",
      likes: 189,
      replies: 32,
      tags: ["DP", "Guide"],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Weekly Contest 430: Solutions & Discussion",
      author: "TMOJ_Staff",
      likes: 567,
      replies: 412,
      tags: ["Contest"],
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <main className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans text-[#071739] dark:text-[#F9FAFB] flex relative overflow-hidden transition-colors duration-500">
      {/* 1. LEFT SIDEBAR */}
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
        className="fixed top-24 z-50 w-8 h-8 bg-white/80 dark:bg-[#1C2737] backdrop-blur-md border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-[#4B6382] dark:text-[#98A2B3] hover:text-[#071739] dark:hover:text-[#FFB800] dark:hover:shadow-[0_0_15px_rgba(255,184,0,0.4)] transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-y-auto p-8 lg:p-12">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-12">
          {/* WELCOME SECTION */}
          <section className="flex flex-col gap-3">
            <h1 className="text-6xl font-black tracking-tighter text-[#3F4755] dark:text-white leading-none">
              Welcome back, <br />
              <span className="bg-gradient-to-r from-[#071739] to-[#4B6382] dark:from-[#FFB800] dark:to-[#E3C39D] bg-clip-text text-transparent italic">
                Toitapcode_
              </span>
            </h1>
            <p className="text-[#4B6382] dark:text-[#98A2B3] font-bold text-lg italic opacity-70 border-l-4 border-[#A68868] pl-6 py-1">
              &ldquo;Turn your caffeine into clean code.&rdquo;
            </p>
          </section>

          {/* DASHBOARD STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Streak",
                val: "12 Days",
                icon: <Flame size={32} fill="currentColor" />,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                label: "Solved",
                val: "145",
                icon: <Trophy size={32} />,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
              },
              {
                label: "Activity",
                val: "Active",
                icon: <CalendarIcon size={32} />,
                color: "text-rose-500",
                bg: "bg-rose-500/10",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="bg-white dark:bg-[#1C2737] border-none rounded-[32px] shadow-sm hover:-translate-y-2 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
              >
                <CardBody className="flex flex-row items-center gap-5 p-7">
                  <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#A4B5C4] uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-black dark:text-white">
                      {stat.val}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* RESUME LEARNING - Đồng bộ Progress và Button */}
          <Card className="bg-[#071739] dark:bg-[#1C2737] text-white rounded-[40px] overflow-hidden shadow-2xl relative border border-white/5 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800] opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity"></div>
            <CardBody className="p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="flex flex-col gap-5 max-w-md w-full">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#A68868] dark:bg-[#FFB800] text-white dark:text-[#071739] text-[10px] font-black rounded-lg uppercase italic tracking-tighter">
                    In Progress
                  </span>
                  <span className="text-white/40 text-sm font-bold uppercase tracking-widest">
                    Top Interview 150
                  </span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter italic group-hover:text-[#A68868] dark:group-hover:text-[#FFB800] transition-colors">
                  Next: 3Sum Closest
                </h2>
                <div className="space-y-3">
                  <Progress
                    size="sm"
                    value={68}
                    classNames={{
                      indicator: "bg-[#A68868] dark:bg-[#FFB800]", // Đồng bộ thanh tiến độ
                      track: "bg-white/10",
                    }}
                  />
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                    68% Completed • 102/150 Solved
                  </p>
                </div>
              </div>
              <Button className="bg-[#A68868] dark:bg-[#FFB800] text-white dark:text-[#071739] font-black h-16 px-12 rounded-2xl text-lg hover:scale-105 transition-all shadow-xl dark:hover:shadow-[0_0_20px_rgba(255,184,0,0.6)]">
                RESUME NOW <ArrowRight size={24} />
              </Button>
            </CardBody>
          </Card>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                  <MessageSquare className="text-[#A68868]" size={32} />{" "}
                  Discussions
                </h3>
                <Button
                  variant="flat"
                  className="font-black uppercase text-[10px] tracking-widest rounded-xl bg-white dark:bg-[#1C2737] text-[#4B6382] dark:text-[#98A2B3] hover:bg-[#A68868] dark:hover:bg-[#FFB800] hover:text-white dark:hover:text-[#071739] transition-all"
                >
                  View All
                </Button>
              </div>

              <div className="flex flex-col gap-6">
                {discussions.map((post, i) => (
                  <Card
                    key={i}
                    className="bg-white/60 dark:bg-[#1C2737]/80 backdrop-blur-md border-none rounded-[32px] hover:scale-[1.02] transition-all cursor-pointer p-4 group"
                  >
                    <CardBody className="flex flex-row gap-6 items-center p-4">
                      <div
                        className={`p-1 rounded-full bg-gradient-to-tr ${post.color} group-hover:scale-110 transition-transform`}
                      >
                        <Avatar
                          name={post.author}
                          className="w-14 h-14 bg-white dark:bg-[#101828] text-[#071739] dark:text-white font-black"
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <h4 className="font-black text-xl text-[#071739] dark:text-white group-hover:text-[#A68868] dark:group-hover:text-[#FFB800] transition-colors leading-tight">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest mt-1">
                          <span className="text-indigo-500 dark:text-indigo-400">
                            By {post.author}
                          </span>
                          <div className="flex gap-3 text-[#A4B5C4] dark:text-[#667085]">
                            {post.tags.map((tag) => (
                              <span key={tag}>#{tag}</span>
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
            <div className="flex flex-col gap-10">
              <section className="flex flex-col gap-6">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <TrendingUp size={24} className="text-[#A68868]" /> Trending
                </h3>
                <div className="flex flex-col gap-3">
                  {["#SlidingWindow", "#Recursion", "#SystemDesign"].map(
                    (tag) => (
                      <div
                        key={tag}
                        className="bg-white/50 dark:bg-[#1C2737]/50 p-4 rounded-2xl font-black text-sm text-[#4B6382] dark:text-[#98A2B3] flex justify-between items-center hover:bg-[#A68868] dark:hover:bg-[#FFB800] hover:text-white dark:hover:text-[#071739] transition-all cursor-pointer group"
                      >
                        {tag}{" "}
                        <ChevronRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="flex flex-col gap-6">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Users size={24} className="text-[#A68868]" /> Masters
                </h3>
                <div className="flex flex-col gap-5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white dark:bg-[#1C2737] p-4 rounded-3xl shadow-sm border border-transparent hover:border-[#A68868] dark:hover:border-[#FFB800] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar
                          size="sm"
                          className="bg-[#071739] text-[#FFB800] font-black"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-black dark:text-white leading-none">
                            CodeNinja_{i}
                          </span>
                          <span className="text-[10px] font-black text-[#A68868] italic tracking-widest">
                            LV. 99
                          </span>
                        </div>
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
