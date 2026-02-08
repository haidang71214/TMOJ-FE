"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Tabs,
  Tab,
  Chip,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

// Swiper Components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* ---------------- TYPES ---------------- */
interface Contest {
  id: number;
  title: string;
  status: "Running" | "Upcoming" | "Ended";
  image: string;
  participants: number;
  endsIn?: string;
  startsIn?: string;
  date?: string;
}

/* ---------------- MOCK DATA (Đã thêm mới) ---------------- */
const allContests: Contest[] = [
  {
    id: 1,
    title: "FPTU Coding Master Spring 2026",
    status: "Running",
    endsIn: "02h 45m",
    participants: 1240,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070",
  },
  {
    id: 2,
    title: "Weekly Challenge #42: Dynamic Programming",
    status: "Upcoming",
    startsIn: "1d 12h",
    participants: 856,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
  },
  {
    id: 3,
    title: "Biweekly Contest 172: Advanced Data Structures",
    status: "Upcoming",
    startsIn: "5d 20h",
    participants: 420,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069",
  },
  {
    id: 7,
    title: "Cyber Security Challenge 2026",
    status: "Upcoming",
    startsIn: "10d 05h",
    participants: 310,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
  },
  {
    id: 8,
    title: "AI Generation Hackathon",
    status: "Running",
    endsIn: "15h 20m",
    participants: 2100,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
  },
  {
    id: 4,
    title: "Winter Code Sprint 2025",
    status: "Ended",
    date: "Jan 10, 2026",
    participants: 3200,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070",
  },
  {
    id: 5,
    title: "Algorithm Masters Cup",
    status: "Ended",
    date: "Dec 20, 2025",
    participants: 1500,
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128",
  },
  {
    id: 6,
    title: "Weekly Contest 480",
    status: "Ended",
    date: "Dec 14, 2025",
    participants: 5600,
    image:
      "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?q=80&w=2070",
  },
];

const myRegisteredIds = [1, 4, 8];

const globalRanking = [
  { rank: 1, name: "Miruu", rating: 3703, attended: 26, crown: "gold" },
  { rank: 2, name: "Neal Wu", rating: 3686, attended: 51, crown: "silver" },
  { rank: 3, name: "Yawn_Sean", rating: 3645, attended: 84, crown: "bronze" },
  { rank: 4, name: "Xiao_Yang", rating: 3611, attended: 107 },
];

export default function UpcomingContests() {
  const [selectedTab, setSelectedTab] = useState("my");
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();

  const activeContests = allContests.filter((c) => c.status !== "Ended");
  const myContests = allContests.filter((c) => myRegisteredIds.includes(c.id));
  const pastContests = allContests.filter((c) => c.status === "Ended");

  return (
    <div className="flex flex-col gap-12">
      {/* 1. FEATURED EVENTS - FULL WIDTH SLIDER */}
      <section className="relative group/slider w-full px-2">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            1024: { slidesPerView: 2.5 },
            1440: { slidesPerView: 3.2 },
          }}
          navigation={{
            nextEl: ".swiper-button-next-contest",
            prevEl: ".swiper-button-prev-contest",
          }}
          className="w-full pb-10"
        >
          {activeContests.map((contest) => (
            <SwiperSlide key={contest.id}>
              <Card className="h-[400px] border-none rounded-[32px] shadow-sm overflow-hidden bg-slate-50 dark:bg-black/20">
                <div
                  onClick={() => router.push(`/Contest/${contest.id}`)}
                  className="h-[200px] relative cursor-pointer overflow-hidden"
                >
                  <Image
                    src={contest.image}
                    alt={contest.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <Chip
                    className="absolute top-4 right-4 font-black uppercase text-[9px] text-white"
                    color={contest.status === "Running" ? "danger" : "warning"}
                  >
                    {contest.status}
                  </Chip>
                </div>
                <CardBody className="p-8 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-black uppercase italic leading-tight mb-4 line-clamp-2">
                      {contest.title}
                    </h4>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase text-gray-400 italic">
                      <span className="flex gap-2 items-center">
                        <Users size={14} className="text-[#FF5C00]" />{" "}
                        {contest.participants} Students
                      </span>
                      <span className="flex gap-2 items-center">
                        <Clock size={14} className="text-[#FF5C00]" />{" "}
                        {contest.endsIn || contest.startsIn}
                      </span>
                    </div>
                  </div>
                  <Button
                    fullWidth
                    className="bg-[#071739] dark:bg-[#071739] text-white font-black h-12 rounded-xl uppercase italic mt-4 transition-all duration-300 hover:bg-[#00FF41] hover:text-[#071739] dark:hover:bg-[#00FF41] dark:hover:text-[#071739]"
                    onPress={() =>
                      router.push(`/Contest/${contest.id}/register`)
                    }
                  >
                    Register Now <ArrowRight size={18} />
                  </Button>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CUSTOM NAVIGATION BUTTONS */}
        <button className="swiper-button-prev-contest absolute left-[-25px] top-[45%] -translate-y-1/2 z-30 w-12 h-12 bg-white dark:bg-[#1C2737] shadow-2xl rounded-full flex items-center justify-center border border-slate-200 dark:border-white/5 text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100">
          <ChevronLeft size={28} />
        </button>
        <button className="swiper-button-next-contest absolute right-[-25px] top-[45%] -translate-y-1/2 z-30 w-12 h-12 bg-white dark:bg-[#1C2737] shadow-2xl rounded-full flex items-center justify-center border border-slate-200 dark:border-white/5 text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all cursor-pointer opacity-0 group-hover/slider:opacity-100">
          <ChevronRight size={28} />
        </button>
      </section>

      <Divider />

      {/* 2. SECOND ROW: TABS & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* TABS LIST VIEW (3/4 WIDTH) */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(k) => setSelectedTab(k as string)}
            variant="underlined"
            classNames={{
              tabList: "gap-8",
              cursor: "w-full bg-[#FF5C00]",
              tabContent:
                "group-data-[selected=true]:text-[#FF5C00] font-black uppercase italic text-sm",
            }}
          >
            {/* MY CONTESTS LIST - Sử dụng ảnh thay cho icon */}
            <Tab key="my" title="My Contests">
              <div className="mt-6 space-y-4">
                {myContests.map((contest) => (
                  <div
                    key={contest.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/10 border border-transparent hover:border-[#FF5C00]/30 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 relative rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200 dark:border-white/5">
                        <Image
                          src={contest.image}
                          alt={contest.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="font-black uppercase italic text-sm group-hover:text-[#FF5C00] transition-colors">
                          {contest.title}
                        </h4>
                        <div className="flex gap-3 items-center mt-1">
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              contest.status === "Running"
                                ? "danger"
                                : "default"
                            }
                            className="font-black italic uppercase text-[8px] h-5"
                          >
                            {contest.status}
                          </Chip>
                          <p className="text-[10px] font-bold text-gray-400 uppercase italic">
                            {contest.status === "Running"
                              ? "Compete now"
                              : `Ended on ${contest.date}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="flat"
                      size="sm"
                      className="font-black italic uppercase text-[10px] rounded-lg h-9 px-6 transition-all duration-300 hover:bg-[#00FF41] hover:text-[#071739] dark:hover:bg-[#00FF41] dark:hover:text-[#071739]"
                      onPress={() =>
                        router.push(
                          `/Contest/${contest.id}${
                            contest.status !== "Running" ? "/ranking" : ""
                          }`
                        )
                      }
                    >
                      {contest.status === "Running" ? "Enter" : "Results"}
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>

            {/* PAST CONTESTS LIST */}
            <Tab key="past" title="Past Contests">
              <div className="mt-6 space-y-3">
                {pastContests.map((contest) => (
                  <div
                    key={contest.id}
                    onClick={() => router.push(`/Contest/${contest.id}`)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-[#FF5C00]/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <Image
                          src={contest.image}
                          alt={contest.title}
                          fill
                          className="object-cover opacity-50"
                        />
                      </div>
                      <div>
                        <h4 className="font-black uppercase italic text-sm group-hover:text-[#FF5C00] transition-colors">
                          {contest.title}
                        </h4>
                        <div className="flex gap-4 items-center">
                          <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase italic">
                            <Calendar size={10} /> {contest.date}
                          </span>
                          <span className="text-[9px] font-black text-[#FF5C00] uppercase italic">
                            {contest.participants} Solved
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-slate-300 group-hover:text-[#FF5C00]"
                    />
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* SIDEBAR AREA */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none shadow-none rounded-[2.5rem] bg-[#FFB800] overflow-hidden">
            <CardBody className="p-6 space-y-4 text-center">
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="INVITE CODE"
                className="w-full rounded-2xl bg-white/30 border-none px-4 py-3 text-xs font-black uppercase italic placeholder:text-[#071739]/50 outline-none focus:bg-white transition-all text-center"
              />
              <Button
                fullWidth
                className="bg-[#071739] dark:bg-[#071739] text-white font-black rounded-2xl uppercase italic transition-all duration-300 hover:bg-[#00FF41] hover:text-[#071739] dark:hover:bg-[#00FF41] dark:hover:text-[#071739]"
              >
                Enter
              </Button>
            </CardBody>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-8 border-l-4 border-[#FF5C00] pl-4">
              <h2 className="text-xl font-[1000] uppercase italic leading-none">
                Global
                <br />
                <span className="text-[#FF5C00]">Ranking</span>
              </h2>
            </div>
            <div className="space-y-6">
              {globalRanking.map((u) => (
                <div key={u.rank} className="flex gap-4 items-center">
                  <div
                    className={`font-black text-xs w-5 ${
                      u.rank <= 3 ? "text-[#FF5C00]" : "text-slate-400"
                    }`}
                  >
                    0{u.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black uppercase italic text-sm truncate flex items-center gap-2">
                      {u.name} {u.crown && "👑"}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase italic">
                        ELO {u.rating}
                      </span>
                      <span className="text-[8px] font-bold text-[#FF5C00] uppercase">
                        {u.attended} Matches
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              fullWidth
              variant="light"
              className="mt-8 font-black uppercase italic text-[10px] text-slate-400 hover:text-[#FF5C00]"
              onPress={() => router.push("/Ranking")}
            >
              View Full
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
