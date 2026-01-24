"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Problems/Sidebar";
import { Card, CardBody, Button, Avatar, Chip } from "@heroui/react";
import Image from "next/image";
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Users,
  Megaphone,
  Clock,
  ChevronRightSquare,
  Code2,
  BarChart3,
  BookOpen,
} from "lucide-react";

// Swiper Components & Styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { Contest } from "@/types";

// Types


interface NewsPost {
  title: string;
  author: string;
  tags: string[];
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const brandOrange = "#FF5C00";
  const brandNavy = "#071739";

  const announcements = [
    "SU26 Enrollment for 'Data Structures' is now open.",
    "System maintenance scheduled for January 25th, 02:00 AM UTC.",
    "Congratulations to FPTU team for winning the ICPC Regional Asia!",
    "New Feature: Grade analytics dashboard is now live.",
  ];

   const activeContests: Contest[] = [
    {
      id: 1,
      title: "FPTU Coding Master Spring 2026",
      status: "Running",
      endsIn: "02h 45m",
      participants: 1240,
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Weekly Challenge #42: Dynamic Programming",
      status: "Upcoming",
      startsIn: "1d 12h",
      participants: 856,
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "ICPC FPTU Qualifier 2026",
      status: "Registration Open",
      startsIn: "Jan 30",
      participants: 2100,
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Internet FPTU 2026",
      status: "Registration Open",
      startsIn: "Jan 30",
      participants: 2100,
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const news: NewsPost[] = [
    {
      title: "Top 10 Algorithms for Coding Interviews 2026",
      author: "DevMaster",
      tags: ["Interview", "2026"],
    },
    {
      title: "My experience with Dynamic Programming",
      author: "AlgoQueen",
      tags: ["DP", "Guide"],
    },
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans text-[#071739] dark:text-[#F9FAFB] flex transition-colors duration-500">
      {/* SIDEBAR */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-[#A4B5C4] dark:border-[#1C2737] bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl ${
          isSidebarOpen ? "w-[260px]" : "w-0"
        }`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white/80 dark:bg-[#1C2737] backdrop-blur-md border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer text-[#FF5C00]"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="flex-1 flex flex-col min-w-0">
        {/* NEWS FEED */}
        <div
          style={{ backgroundColor: brandNavy }}
          className="w-full text-white py-2.5 px-6 flex items-center gap-4 overflow-hidden shrink-0 z-30 shadow-md"
        >
          <div
            style={{ color: brandOrange }}
            className="flex items-center gap-2 z-10 pr-4 shrink-0 font-black text-[10px] uppercase tracking-tighter italic"
          >
            <Megaphone size={16} /> News Feed:
          </div>
          <div className="relative flex overflow-hidden w-full h-5 items-center font-bold italic text-[11px]">
            <div className="marquee-content flex items-center gap-20 absolute">
              {announcements.concat(announcements).map((text, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap flex items-center gap-3"
                >
                  <span style={{ color: brandOrange }} className="opacity-60">
                    /
                  </span>{" "}
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-8 lg:px-12 flex flex-col gap-16 mt-8 pb-20">
          {/* HERO BANNER */}
          <section className="relative w-full h-[450px] rounded-[40px] overflow-hidden shadow-2xl group border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
              alt="FPTU Arena"
              fill
              priority
              className="object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071739] via-[#071739]/80 to-transparent"></div>
            <div className="relative z-10 h-full flex flex-col justify-center p-12 max-w-2xl gap-6">
              <Chip
                style={{ backgroundColor: brandOrange }}
                className="text-white font-black uppercase italic text-[10px]"
              >
                Academic Competitive Hub
              </Chip>
              <h1 className="text-7xl font-black tracking-tighter leading-none text-white uppercase italic">
                FPT UNIVERSITY <br />
                <span style={{ color: brandOrange }}>JUDGE SYSTEM.</span>
              </h1>
              <p
                style={{ borderLeftColor: brandOrange }}
                className="text-white/70 font-bold italic border-l-4 pl-6 py-2 uppercase text-xs tracking-wider"
              >
                Master your logic. Rule the code. Lead the campus.
              </p>
              <div className="flex gap-4">
                <Button
                  style={{ backgroundColor: brandOrange }}
                  className="text-white font-black rounded-xl h-14 px-8 shadow-xl uppercase italic hover:scale-105 transition-transform"
                  onPress={() => router.push("/Contest")}
                >
                  Browse Contests
                </Button>
                <Button
                  variant="bordered"
                  className="text-white border-white/20 font-black rounded-xl h-14 px-8 backdrop-blur-md uppercase italic hover:bg-white/10 transition-all"
                  onPress={() => router.push("/Problems/Library")}
                >
                  Practice
                </Button>
              </div>
            </div>
          </section>

          {/* ACTIVE CONTESTS SLIDER */}
          <section className="flex flex-col gap-8 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4 dark:text-white">
                <Trophy style={{ color: brandOrange }} size={32} /> Active
                Contests
              </h3>
              <Button
                variant="light"
                endContent={<ChevronRightSquare size={18} />}
                className="font-black italic uppercase text-xs hover:text-[#FF5C00]"
                onPress={() => router.push("/Contest")}
              >
                View More
              </Button>
            </div>

            {/* CONTAINER DÙNG ĐỂ CHỨA NÚT HAI BÊN */}
            <div className="relative group/slider px-2">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                }}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="w-full pb-14"
              >
                {activeContests.map((contest) => (
                  <SwiperSlide key={contest.id}>
                    <Card className="h-[420px] border-none bg-white dark:bg-[#1C2737] rounded-[32px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">
                      <div className="h-1/2 relative overflow-hidden">
                        <Image
                          src={contest.image}
                          alt={contest.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 z-10">
                          <Chip
                            color={
                              contest.status === "Running"
                                ? "danger"
                                : "warning"
                            }
                            className="font-black uppercase text-[10px] animate-pulse text-white"
                          >
                            {contest.status}
                          </Chip>
                        </div>
                      </div>
                      <CardBody className="p-7 flex flex-col justify-between">
                        <h4 className="text-lg font-black uppercase italic leading-tight dark:text-white line-clamp-2">
                          {contest.title}
                        </h4>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase text-[#A4B5C4] tracking-widest">
                          <span className="flex items-center gap-1">
                            <Users size={14} /> {contest.participants} Students
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />{" "}
                            {contest.endsIn || contest.startsIn}
                          </span>
                        </div>
                        <Button className="w-full bg-[#071739] text-white font-black h-12 rounded-xl shadow-lg uppercase italic border-none transition-all duration-300 hover:bg-[#22C55E] hover:scale-105">
                          Register Now <ArrowRight size={18} />
                        </Button>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* HAI NÚT ĐIỀU HƯỚNG NẰM HAI BÊN Ở GIỮA */}
              <button className="swiper-button-prev-custom absolute left-[-20px] top-[40%] -translate-y-1/2 z-30 w-12 h-12 bg-white dark:bg-[#1C2737] shadow-2xl rounded-full flex items-center justify-center border border-[#A4B5C4]/20 text-[#071739] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all cursor-pointer">
                <ChevronLeft size={28} />
              </button>
              <button className="swiper-button-next-custom absolute right-[-20px] top-[40%] -translate-y-1/2 z-30 w-12 h-12 bg-white dark:bg-[#1C2737] shadow-2xl rounded-full flex items-center justify-center border border-[#A4B5C4]/20 text-[#071739] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all cursor-pointer">
                <ChevronRight size={28} />
              </button>
            </div>
          </section>

          {/* PHẦN NEWS VÀ LEARNING FLOW (GIỮ NGUYÊN) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3 flex flex-col gap-16">
              {/* Discussions */}
              <div className="flex flex-col gap-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 dark:text-white">
                  <MessageSquare style={{ color: brandOrange }} size={28} />{" "}
                  Discussions & News
                </h3>
                <div className="flex flex-col gap-5">
                  {news.map((post, i) => (
                    <Card
                      key={i}
                      className="bg-white/60 dark:bg-[#1C2737]/80 backdrop-blur-md border-none rounded-3xl hover:scale-[1.01] transition-all p-3 shadow-sm group cursor-pointer"
                    >
                      <CardBody className="flex flex-row gap-6 items-center p-4">
                        <Avatar
                          name={post.author}
                          size="md"
                          style={{ backgroundColor: brandNavy }}
                          className="text-[#FF5C00] font-black"
                        />
                        <div className="flex-1">
                          <h4 className="font-black text-lg text-[#071739] dark:text-white group-hover:text-[#FF5C00] transition-colors uppercase italic">
                            {post.title}
                          </h4>
                          <div className="flex gap-4 mt-2 font-black text-[9px] text-[#A4B5C4] uppercase italic">
                            <span>By {post.author}</span>
                            {post.tags.map((t) => (
                              <span key={t}>#{t}</span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight style={{ color: brandOrange }} />
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Learning Flow */}
              <div className="flex flex-col gap-10">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 dark:text-white">
                  <TrendingUp style={{ color: brandOrange }} size={28} /> TMOJ
                  Learning Flow
                </h3>
                <div className="relative ml-4 md:ml-6 flex flex-col gap-8">
                  <div
                    style={{ background: brandOrange }}
                    className="absolute left-[20px] top-2 bottom-2 w-1 opacity-20 rounded-full"
                  ></div>
                  {[
                    {
                      title: "Enroll in Class",
                      icon: <Users size={20} />,
                      step: "01",
                      border: "text-[#0054A6]",
                    },
                    {
                      title: "Daily Practice",
                      icon: <Code2 size={20} />,
                      step: "02",
                      border: "text-[#FF5C00]",
                    },
                    {
                      title: "Online Assessment",
                      icon: <BookOpen size={20} />,
                      step: "03",
                      border: "text-[#00A651]",
                    },
                    {
                      title: "Performance Tracking",
                      icon: <BarChart3 size={20} />,
                      step: "04",
                      border: "text-[#071739]",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="relative flex items-start gap-8 group"
                    >
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full bg-white dark:bg-[#1C2737] border-4 border-current flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${step.border}`}
                      >
                        {step.icon}
                      </div>
                      <Card className="flex-1 bg-white/40 dark:bg-[#1C2737]/40 border-none shadow-sm rounded-[24px]">
                        <CardBody className="p-6">
                          <h4 className="font-black italic uppercase text-md dark:text-white">
                            {step.title}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                            Step {step.step}
                          </p>
                        </CardBody>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ranking Sidebar */}
            <div className="flex flex-col gap-8">
              <Card className="bg-white dark:bg-[#1C2737] rounded-[32px] border-none p-6 shadow-sm sticky top-24">
                <h3
                  style={{ borderBottomColor: brandOrange }}
                  className="text-md font-black uppercase italic tracking-widest mb-6 flex items-center gap-2 border-b-2 pb-2 dark:text-white"
                >
                  <TrendingUp size={18} style={{ color: brandOrange }} />{" "}
                  Ranking
                </h3>
                <div className="flex flex-col gap-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          style={{ color: i <= 3 ? brandOrange : "#A4B5C4" }}
                          className="text-[10px] font-black"
                        >
                          0{i}
                        </span>
                        <Avatar size="sm" className="h-7 w-7" />
                        <span className="text-[10px] font-black uppercase italic group-hover:text-[#FF5C00] dark:text-white">
                          User_{i}x72
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-[#A4B5C4]">
                        {3000 - i * 200} pts
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .marquee-content {
          display: flex;
          animation: marquee 35s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        .swiper-pagination-bullet-active {
          background: ${brandOrange} !important;
          width: 30px !important;
          border-radius: 10px !important;
        }
      `}</style>
    </main>
  );
}
