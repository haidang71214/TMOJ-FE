"use client";

import { Button, Card, CardBody, Chip, Progress } from "@heroui/react";
import { Bookmark, CheckCircle2, ChevronLeft, ChevronRight, Clock, Lock, Play, Trophy } from "lucide-react";
import { useState } from "react";

const MOCK_PACKAGE = {
  id: "pkg-1",
  name: "Top Interview 150",
  description: "Comprehensive 150 questions covering Array, Hash Map, Two Pointers, Sliding Window, Matrix, Linked List, Tree, Graph, Backtracking, and Dynamic Programming.",
  enrolled: 12450,
  estimatedHours: 45,
  level: "INTERMEDIATE",
  modules: [
    {
      id: "m1",
      title: "Array / String",
      progress: 100,
      totalQs: 12,
      solvedQs: 12,
      isLocked: false,
    },
    {
      id: "m2",
      title: "Two Pointers",
      progress: 60,
      totalQs: 5,
      solvedQs: 3,
      isLocked: false,
    },
    {
      id: "m3",
      title: "Sliding Window",
      progress: 25,
      totalQs: 4,
      solvedQs: 1,
      isLocked: false,
    },
    {
      id: "m4",
      title: "Matrix / Grid",
      progress: 0,
      totalQs: 8,
      solvedQs: 0,
      isLocked: false,
    },
    {
      id: "m5",
      title: "Hash Map / Set",
      progress: 0,
      totalQs: 10,
      solvedQs: 0,
      isLocked: true,
    },
    {
      id: "m6",
      title: "Linked List",
      progress: 0,
      totalQs: 7,
      solvedQs: 0,
      isLocked: true,
    },
    {
      id: "m7",
      title: "Binary Tree / BST",
      progress: 0,
      totalQs: 14,
      solvedQs: 0,
      isLocked: true,
    },
    {
      id: "m8",
      title: "Backtracking",
      progress: 0,
      totalQs: 12,
      solvedQs: 0,
      isLocked: true,
    },
    {
      id: "m9",
      title: "Dynamic Programming",
      progress: 0,
      totalQs: 15,
      solvedQs: 0,
      isLocked: true,
    }
  ]
};

export default function PackageEnrollPage() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const handleEnroll = () => {
    setIsEnrolled(true);
    setOverallProgress(25); // Mock starting progress
  };

  const handleSaveProgress = () => {
    alert("Learning progress saved successfully!");
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans pb-24">
      {/* HEADER BANNER */}
      <div className="bg-[#071739] dark:bg-[#1a2035] text-white pt-16 pb-12 px-8">
        <div className="max-w-[1000px] mx-auto space-y-6">
          <Button 
            variant="light" 
            className="text-slate-400 hover:text-white -ml-4"
            startContent={<ChevronLeft size={16} />}
          >
            Back to Study Plans
          </Button>

          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <Chip size="sm" className="bg-[#FF5C00]/20 text-[#FF5C00] font-black tracking-widest uppercase">{MOCK_PACKAGE.level}</Chip>
                <span className="text-slate-400 text-sm flex items-center gap-1"><Clock size={14} /> {MOCK_PACKAGE.estimatedHours}h estimated</span>
                <span className="text-slate-400 text-sm flex items-center gap-1"><Trophy size={14} /> {MOCK_PACKAGE.enrolled.toLocaleString()} enrolled</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">{MOCK_PACKAGE.name}</h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {MOCK_PACKAGE.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              {isEnrolled ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-[#FF5C00] text-white font-black uppercase shadow-xl hover:bg-[#ff7a33]"
                    startContent={<Play size={18} fill="currentColor" />}
                  >
                    Continue Learning
                  </Button>
                  <Button 
                    size="lg" 
                    variant="bordered"
                    className="text-white border-white/20 font-bold hover:bg-white/10"
                    startContent={<Bookmark size={18} />}
                    onPress={handleSaveProgress}
                  >
                    Save Progress
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-[#FF5C00] text-white font-black uppercase text-lg shadow-xl shadow-[#FF5C00]/20 h-16 transition-transform active:scale-95"
                  onPress={handleEnroll}
                >
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-[1000px] mx-auto px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: MODULES */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Modules <span className="text-slate-400 text-sm font-medium">({MOCK_PACKAGE.modules.length})</span>
          </h2>

          <div className="space-y-4">
            {MOCK_PACKAGE.modules.map((mod, idx) => (
              <Card 
                key={mod.id} 
                className={`border-none shadow-sm ${mod.isLocked ? "bg-slate-50 dark:bg-black/20 opacity-70" : "bg-white dark:bg-[#1C2737]"}`}
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black 
                        ${mod.progress === 100 ? "bg-emerald-100 text-emerald-600" : mod.isLocked ? "bg-slate-200 text-slate-400" : "bg-indigo-100 text-indigo-600"}`}
                      >
                        {mod.progress === 100 ? <CheckCircle2 size={20} /> : mod.isLocked ? <Lock size={18} /> : idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{mod.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{mod.solvedQs} / {mod.totalQs} Problems</p>
                      </div>
                    </div>

                    {!mod.isLocked && isEnrolled && (
                      <Button size="sm" variant="flat" className="bg-[#071739]/5 dark:bg-white/5 font-bold" endContent={<ChevronRight size={14} />}>
                        Solve Practice Problem
                      </Button>
                    )}
                  </div>

                  {isEnrolled && !mod.isLocked && (
                    <div className="pl-14">
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>Learning Progress</span>
                        <span className={mod.progress === 100 ? "text-emerald-500" : "text-[#FF5C00]"}>{mod.progress}%</span>
                      </div>
                      <Progress 
                        value={mod.progress} 
                        color={mod.progress === 100 ? "success" : "warning"}
                        className="h-2"
                        classNames={{ indicator: mod.progress === 100 ? "bg-emerald-500" : "bg-[#FF5C00]" }}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: OVERALL PROGRESS (Only visible if enrolled) */}
        <div className="space-y-6">
          {isEnrolled && (
            <Card className="bg-white dark:bg-[#1C2737] border-none shadow-xl rounded-3xl overflow-hidden sticky top-32">
              <div className="bg-linear-to-br from-[#071739] to-[#1a2a4a] p-6 text-white">
                <h3 className="font-black uppercase tracking-widest text-xs mb-6 opacity-80">Your Overall Progress</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black">{overallProgress}%</span>
                  <span className="text-sm font-bold opacity-70 mb-1">COMPLETED</span>
                </div>
                <Progress 
                  value={overallProgress} 
                  className="h-3 bg-white/10" 
                  classNames={{ indicator: "bg-[#FF5C00]" }} 
                />
                <p className="text-xs font-medium opacity-70 mt-4 leading-relaxed">
                  You are tracking well! Complete the next 2 arrays problems to reach 30%.
                </p>
              </div>
            </Card>
          )}

          {!isEnrolled && (
            <Card className="bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 shadow-sm p-6 rounded-3xl">
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-4">Package Includes</h3>
              <ul className="space-y-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 150 Core Problems</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 10 Modules</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Video Editorials</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Complete Contest trigger badge</li>
              </ul>
            </Card>
          )}
        </div>

      </div>
    </main>
  );
}
