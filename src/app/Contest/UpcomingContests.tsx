"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Divider,
  Tabs,
  Tab,
  Chip,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Contest } from "@/types";
import { SwiperSlide } from "swiper/react";
import { ArrowRight, Clock, Users } from "lucide-react";



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
    }
  ];

const pastContests = [
  {
    title: "Weekly Contest 480",
    date: "Dec 14, 2025 9:30 AM GMT+7",
    virtual: true,
  },
  {
    title: "Weekly Contest 479",
    date: "Dec 7, 2025 9:30 AM GMT+7",
    virtual: true,
  },
  {
    title: "Biweekly Contest 171",
    date: "Dec 6, 2025 9:30 PM GMT+7",
    virtual: true,
  },
  {
    title: "Weekly Contest 478",
    date: "Nov 30, 2025 9:30 AM GMT+7",
    virtual: true,
  },
  {
    title: "Weekly Contest 477",
    date: "Nov 23, 2025 9:30 AM GMT+7",
    virtual: true,
  },
];

const globalRanking = [
  { rank: 1, name: "Miruu", rating: 3703, attended: 26, crown: "gold" },
  { rank: 2, name: "Neal Wu us", rating: 3686, attended: 51, crown: "silver" },
  { rank: 3, name: "Yawn_Sean", rating: 3645, attended: 84, crown: "bronze" },
  { rank: 4, name: "小羊肖恩 CN", rating: 3611, attended: 107 },
  { rank: 5, name: "何迦 CN", rating: 3599, attended: 146 },
  { rank: 6, name: "Joshua Chen AU", rating: 3589, attended: 100 },
  { rank: 7, name: "Rohin Garg", rating: 3506, attended: 88 },
];

export default function ContestsPage() {
  const [selectedTab, setSelectedTab] = useState("my");
  const router = useRouter();
const [user, setUser] = useState(false);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  setUser(!!storedUser);
}, []);

  return (
    <div className="max-w-10xl mx-auto px-4 py-8 transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Upcoming Contests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeContests.map((contest) => (
                              <SwiperSlide key={contest.id}>
                                <Card  className="h-[420px] border-none bg-white dark:bg-[#1C2737] rounded-[32px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">
                                  <div onClick={()=>{router.push(`/Contest/${contest.id}`)}} className="h-1/2 relative overflow-hidden">
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
          </div>

          <Divider className="bg-gray-200 dark:bg-[#474F5D]" />

          {/* Tabs */}
          <div className="w-full">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              aria-label="Contest tabs"
              radius="full"
              variant="light"
              classNames={{
                tabList: "bg-gray-100 dark:bg-[#333A45] p-1",
                cursor: "bg-white dark:bg-[#282E3A] shadow-sm",
                tab: "px-6 h-10",
                tabContent:
                  "font-black text-gray-500 dark:text-gray-400 group-data-[selected=true]:text-[#3F4755] dark:group-data-[selected=true]:text-[#FFB800]",
              }}
            >
              <Tab key="my" title="My Contests">
                {user? 
                <div className="mt-8 space-y-4">
    {activeContests.map((contest) => (
      <Card
      
        key={contest.id}
        className="border-none bg-white dark:bg-[#282E3A] hover:translate-x-1 transition-all cursor-pointer"
      >
        <CardBody onClick={()=>{router.push(`/Contest/${contest.id}`)}} className="px-6 py-5">
          <div className="flex items-center justify-between gap-6">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-black text-[#3F4755] dark:text-white uppercase tracking-tight truncate">
                {contest.title}
              </h4>

              <div className="flex items-center gap-4 mt-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {contest.participants}
                </span>
                
              </div>
            </div>

            {/* Right */}
            <Chip
              color={
                contest.status === "Running"
                  ? "danger"
                  : contest.status === "Upcoming"
                  ? "warning"
                  : "default"
              }
              className="font-black uppercase text-[10px]"
              variant="flat"
            >
              {contest.status}
            </Chip>
          </div>
        </CardBody>
      </Card>
    ))}
  </div> 
                :
                
                <div className="mt-8">
                  <Card className="border-none bg-gray-50 dark:bg-[#282E3A]/50 shadow-none">
                    <CardBody className="text-center py-16 flex flex-col items-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFB800]/10 rounded-full mb-6">
                        <svg
                          className="w-10 h-10 text-[#FFB800]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-[#3F4755] dark:text-white mb-3 uppercase tracking-tight">
                        Join TMOJ Contests
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-8 font-medium">
                        Register or log in to view your personalized contest
                        information and global rank
                      </p>
                      <Button className="bg-[#17c964] dark:bg-[#FFB800] text-white dark:text-[#071739] font-black rounded-2xl px-8 h-12 shadow-lg dark:shadow-[#FFB800]/20">
                        Register or Log in
                      </Button>
                    </CardBody>
                  </Card>
                </div>}
              </Tab>

              <Tab key="past" title="Past Contests">
                <div className="mt-8 space-y-4">
                  {pastContests.map((contest) => (
                    <Card
                      key={contest.title}
                      className="border-none bg-white dark:bg-[#282E3A] hover:translate-x-2 transition-all cursor-pointer"
                    >
                      <CardBody className="p-0">
                        <div className="flex items-center">
                          <div className="relative w-32 h-32 shrink-0">
                            <Image
                              src="https://assets.leetcode.com/contest-config/weekly-contest-482/contest_detail/card_img_e222.png"
                              alt={contest.title}
                              fill
                              className="object-cover rounded-l-2xl"
                            />
                          </div>
                          <div className="flex-1 px-8 py-4">
                            <h4 className="text-lg font-black text-[#3F4755] dark:text-white uppercase tracking-tighter italic">
                              {contest.title}
                            </h4>
                            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-1">
                              {contest.date}
                            </p>
                            {contest.virtual && (
                              <Badge
                                className="mt-4 bg-[#FFB800]/10 text-[#FFB800] border-none font-black text-[10px] uppercase tracking-widest px-3"
                                variant="flat"
                                onClick={() =>
                                  router.push(`/Contest/weekly-contest-482`)
                                }
                              >
                                Virtual Participated
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>

        {/* Right Column: Global Ranking */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 border-none bg-white dark:bg-[#282E3A] shadow-xl rounded-[2rem]">
            <CardBody className="p-8">
              <h2 className="text-2xl font-black text-[#3F4755] dark:text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <div className="p-2 bg-[#FFB800]/10 rounded-xl">
                  <svg
                    className="w-6 h-6 text-[#FFB800]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                Global Ranking
              </h2>

              <div className="space-y-6">
                {globalRanking.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center gap-5 group cursor-pointer"
                  >
                    <div className="text-xl font-black text-gray-300 dark:text-[#474F5D] w-6 italic group-hover:text-[#FFB800] transition-colors">
                      {user.rank}
                    </div>
                    <div className="relative w-12 h-12 shrink-0">
                      <div className="w-full h-full bg-gray-100 dark:bg-[#333A45] rounded-2xl border-2 border-transparent group-hover:border-[#FFB800] transition-all overflow-hidden shadow-inner" />
                      {user.crown && (
                        <div className="absolute -top-2 -right-2 text-xl drop-shadow-md">
                          {user.crown === "gold"
                            ? "👑"
                            : user.crown === "silver"
                            ? "🥈"
                            : "🥉"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-[#3F4755] dark:text-white truncate group-hover:text-[#FFB800] transition-colors uppercase text-sm tracking-tight">
                        {user.name}
                      </div>
                      <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">
                        RATING:{" "}
                        <span className="text-[#3F4755] dark:text-[#E3C39D]">
                          {user.rating}
                        </span>{" "}
                        | ATTENDED: {user.attended}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="light"
                className="w-full mt-8 font-black text-gray-400 hover:text-[#FFB800] uppercase text-xs tracking-[0.3em]"
              >
                View Full Ranking
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
