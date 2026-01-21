"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import {
  Sparkles,
  Zap,
  Code2,
  Users,
  Layout,
  BarChart3,
  Lock,
  Bug,
  CheckCircle2,
} from "lucide-react";

export default function PremiumPage() {
  const features = [
    {
      icon: <Sparkles className="text-purple-500" size={32} />,
      title: "Ask Leet",
      badge: "New",
      description:
        "Your coding agent — brainstorm solutions, optimize code, generate test cases, and debug. Premium members get 500 extra monthly credits.",
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: "Lightning Judge",
      description:
        "Priority judging — up to 10× faster during peak hours — so you can stay ahead in your interview prep.",
    },
    {
      icon: <Code2 className="text-blue-500" size={32} />,
      title: "Autocomplete",
      description:
        "Get smart code autocompletion based on your language and context — no memorization needed.",
    },
    {
      icon: <Users className="text-emerald-500" size={32} />,
      title: "Interview Simulations",
      description:
        "Practice under pressure with mock assessments. Choose a company, get a timed question, and test your skills.",
    },
    {
      icon: <Layout className="text-pink-500" size={32} />,
      title: "Unlimited Playgrounds",
      description:
        "No more limits — create unlimited Playgrounds and keep them organized with advanced folders.",
    },
    {
      icon: <BarChart3 className="text-cyan-500" size={32} />,
      title: "Company Questions",
      description:
        "Practice smarter with real questions from top companies like Google, Meta, and Amazon.",
    },
    {
      icon: <Lock className="text-amber-500" size={32} />,
      title: "Premium Content",
      description:
        "Exclusive access to premium questions, detailed solutions, and advanced Explore cards.",
    },
    {
      icon: <Bug className="text-rose-500" size={32} />,
      title: "Debugger",
      description:
        "Set breakpoints and debug interactively in our powerful web editor instead of using print statements.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-7xl font-[1000] text-[#071739] dark:text-white uppercase tracking-tighter italic leading-none">
            TMOJ <span className="text-[#FF5C00]">PREMIUM</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
            <p className="text-[11px] font-black text-[#4B6382] dark:text-[#98A2B3] uppercase tracking-[0.4em] italic">
              Invest in your future
            </p>
            <div className="h-1 w-12 bg-[#FF5C00] rounded-full" />
          </div>
        </div>

        {/* Pricing Plans Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24 items-stretch">
          {/* Monthly Plan */}
          <Card
            shadow="none"
            className="h-full border-none bg-white/80 dark:bg-[#1C2737] rounded-[3rem] backdrop-blur-md shadow-xl flex flex-col"
          >
            <CardHeader className="flex flex-col items-start p-10 pb-4">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-widest italic">
                Monthly
              </h2>
              <p className="text-[10px] font-black text-[#4B6382] dark:text-[#667085] uppercase tracking-[0.2em] mt-1">
                Flexibility for short-term goals
              </p>
            </CardHeader>
            <CardBody className="px-10 py-0 flex-grow flex flex-col justify-start">
              <div className="text-7xl font-black text-[#071739] dark:text-white tracking-tighter flex items-baseline">
                $35
                <span className="text-xl font-bold text-[#A4B5C4] ml-2">
                  /mo
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Priority Judging",
                  "Premium Content",
                  "All AI Credits",
                  "Debugger Access",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-bold text-[#4B6382] dark:text-[#98A2B3]"
                  >
                    <CheckCircle2 size={16} className="text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </CardBody>
            <CardFooter className="p-10">
              <Button
                size="lg"
                className="w-full text-xs font-black uppercase tracking-widest rounded-2xl bg-[#071739] dark:bg-[#101828] text-white border border-[#A4B5C4]/20 dark:border-[#344054] h-14 hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all"
              >
                Choose Monthly
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card
            shadow="none"
            className="h-full border-none bg-white dark:bg-[#1C2737] relative overflow-hidden rounded-[3rem] ring-4 ring-[#FFB800]/20 flex flex-col shadow-2xl"
          >
            <div className="absolute top-0 right-0 bg-[#FFB800] text-[#071739] px-12 py-2 rotate-12 translate-x-8 translate-y-4 text-[10px] font-black uppercase tracking-[0.2em] z-10 shadow-lg">
              Most popular
            </div>
            <CardHeader className="flex flex-col items-start p-10 pb-4">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-widest italic">
                Yearly
              </h2>
              <p className="text-[10px] font-black text-[#FFB800] uppercase tracking-[0.2em] mt-1">
                Save 62% • $13.25/mo
              </p>
            </CardHeader>
            <CardBody className="px-10 py-0 flex-grow flex flex-col justify-start">
              <div className="text-7xl font-black text-[#071739] dark:text-white tracking-tighter flex items-baseline">
                $159
                <span className="text-xl font-bold text-[#FFB800] ml-2">
                  /yr
                </span>
              </div>
              <p className="mt-6 text-sm font-medium text-[#4B6382] dark:text-gray-400">
                Full access to all features plus{" "}
                <span className="text-[#FFB800] font-black">
                  6000 AI Credits
                </span>{" "}
                per year.
              </p>
              <div className="mt-4 p-3 rounded-2xl bg-[#FFB800]/5 border border-[#FFB800]/10 italic text-[11px] text-[#A68868] dark:text-[#FFB800] font-bold">
                * Includes all Monthly features and exclusive early access to
                new algorithms.
              </div>
            </CardBody>
            <CardFooter className="p-10">
              <Button
                size="lg"
                className="w-full text-xs font-black uppercase tracking-widest rounded-2xl bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#071739] shadow-xl dark:shadow-[#FFB800]/20 h-14 hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all"
              >
                Subscribe Yearly Now
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex gap-6 p-6 rounded-[2rem] bg-white/40 dark:bg-[#1C2737]/30 border border-[#A4B5C4]/20 dark:border-white/5 group hover:bg-white dark:hover:bg-[#1C2737] transition-all duration-300"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-[#101828] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-[#071739] dark:text-white uppercase tracking-tight group-hover:text-[#FFB800] transition-colors">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <span className="bg-[#FFB800] text-[#071739] font-black text-[8px] uppercase px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[#4B6382] dark:text-[#98A2B3] font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
