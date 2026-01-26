"use client";

import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import {
  Sparkles,
  Trophy,
  Users,
  Code2,
  Zap,
  ChevronRight,
  Target,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const router = useRouter();

  const FEATURES = [
    {
      title: "Powerful Online Judge",
      description:
        "Support multiple languages (C++, Java, Python, Node.js) with high-speed execution and precision grading.",
      icon: <Code2 className="text-[#ff5c00]" size={24} />,
      color: "border-[#ff5c00]",
    },
    {
      title: "Weekly Contests",
      description:
        "Compete with top developers, earn exclusive badges, and climb the global ranking leaderboard.",
      icon: <Trophy className="text-yellow-500" size={24} />,
      color: "border-yellow-500",
    },
    {
      title: "Academic Curriculum",
      description:
        "Structure your learning with a dedicated Subject system designed for software engineering students.",
      icon: <Target className="text-blue-500" size={24} />,
      color: "border-blue-500",
    },
    {
      title: "Mutual Aid System",
      description:
        "A community-driven platform where students help each other solve complex algorithmic problems.",
      icon: <Users className="text-green-500" size={24} />,
      color: "border-green-500",
    },
  ];

  return (
    <div className="flex flex-col gap-12 pb-20 animate-in fade-in duration-700">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[400px] rounded-[3rem] overflow-hidden bg-[#071739] flex items-center px-12 border-2 border-blue-600/20 dark:border-[#ff5c00]/20 shadow-2xl">
        <div className="z-10 max-w-2xl space-y-6">
          <Chip
            startContent={<Sparkles size={14} />}
            variant="flat"
            className="bg-[#ff5c00]/10 text-[#ff5c00] border-none font-black italic uppercase text-[10px] px-4 h-8"
          >
            Welcome to the Future of Coding
          </Chip>
          <h1 className="text-7xl font-[1000] text-white italic uppercase tracking-tighter leading-none">
            UNLEASH YOUR <br />
            <span className="text-[#ff5c00]">CODE POWER.</span>
          </h1>
          <p className="text-slate-400 font-bold italic text-sm max-w-md leading-relaxed">
            TMOJ is more than just an Online Judge. It is an ecosystem for
            developers to learn, compete, and share knowledge through
            professional algorithmic challenges.
          </p>
          <div className="flex gap-4 pt-4">
            <Button
              onPress={() => router.push("/Problems/Library")}
              className="bg-[#ff5c00] text-[#071739] font-black italic uppercase text-xs h-12 px-8 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              Start Solving Now
            </Button>
            <Button
              variant="bordered"
              className="border-2 border-white/10 text-white font-black italic uppercase text-xs h-12 px-8 rounded-2xl hover:bg-white/5 active:scale-95 transition-all"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-[#ff5c00] rounded-full blur-[120px] opacity-10 animate-pulse" />
        <Code2
          size={400}
          className="absolute right-0 opacity-5 text-white -rotate-12 translate-x-20"
        />
      </section>

      {/* 2. CORE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Users", value: "2,500+", icon: <Users size={20} /> },
          {
            label: "Problems Solved",
            value: "50,000+",
            icon: <Zap size={20} />,
          },
          { label: "Daily Contests", value: "24/7", icon: <Globe size={20} /> },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-[#111c35] border border-divider dark:border-white/5 rounded-[2rem] shadow-sm"
          >
            <CardBody className="flex flex-row items-center gap-6 p-8">
              <div className="p-4 rounded-2xl bg-[#ff5c00]/10 text-[#ff5c00]">
                {stat.icon}
              </div>
              <div>
                <h4 className="text-3xl font-[1000] italic text-[#071739] dark:text-white leading-none">
                  {stat.value}
                </h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">
                  {stat.label}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 3. KEY FEATURES GRID */}
      <div className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white">
            WHY CHOOSE <span className="text-[#ff5c00]">TMOJ?</span>
          </h2>
          <div className="h-1.5 w-24 bg-[#ff5c00] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <Card
              key={i}
              isPressable
              className={`bg-white dark:bg-[#111c35] border-2 border-transparent hover:border-[#ff5c00]/30 transition-all rounded-[2.5rem] p-4 group`}
            >
              <CardBody className="flex flex-row items-start gap-8 p-6 text-left">
                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 group-hover:bg-[#ff5c00]/10 transition-colors">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white leading-tight group-hover:text-[#ff5c00] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    {feature.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. CALL TO ACTION */}
      <Card className="bg-gradient-to-r from-[#071739] to-[#111c35] border-none rounded-[3rem] p-12 overflow-hidden relative shadow-2xl shadow-orange-500/10">
        <CardBody className="flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left relative z-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-[1000] italic uppercase tracking-tighter text-white leading-none">
              READY TO <span className="text-[#ff5c00]">LEVEL UP?</span>
            </h2>
            <p className="text-slate-400 font-bold italic text-sm">
              Join thousands of students and improve your logic daily.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-[#071739] font-[1000] italic uppercase text-sm h-14 px-10 rounded-[1.5rem] shadow-xl hover:scale-105 active:scale-95 transition-all"
            endContent={<ChevronRight size={18} strokeWidth={3} />}
          >
            Create Your Account
          </Button>
        </CardBody>
        <div className="absolute left-[-5%] bottom-[-50%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-10" />
      </Card>
    </div>
  );
}
