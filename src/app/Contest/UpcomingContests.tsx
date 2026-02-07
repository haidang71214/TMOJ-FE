"use client";

import React, { useEffect, useState } from "react";
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
import { Contest } from "@/types";
import { SwiperSlide } from "swiper/react";
import { ArrowRight, Clock, Users } from "lucide-react";
import { useModal } from "@/Provider/ModalProvider";
import RegisterContestModal from "./RegisterContestModal";

/* ---------------- MOCK DATA ---------------- */

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
];

const pastContests = [
  { title: "Weekly Contest 480", date: "Dec 14, 2025 9:30 AM GMT+7", virtual: true },
  { title: "Weekly Contest 479", date: "Dec 7, 2025 9:30 AM GMT+7", virtual: true },
  { title: "Biweekly Contest 171", date: "Dec 6, 2025 9:30 PM GMT+7", virtual: true },
];

const globalRanking = [
  { rank: 1, name: "Miruu", rating: 3703, attended: 26, crown: "gold" },
  { rank: 2, name: "Neal Wu us", rating: 3686, attended: 51, crown: "silver" },
  { rank: 3, name: "Yawn_Sean", rating: 3645, attended: 84, crown: "bronze" },
  { rank: 4, name: "小羊肖恩 CN", rating: 3611, attended: 107 },
];

/* ---------------- PAGE ---------------- */

export default function ContestsPage() {
  const [selectedTab, setSelectedTab] = useState("my");
  const [user, setUser] = useState(false);
  const [inviteCode, setInviteCode] = useState(""); // 👈 THÊM
  const router = useRouter();
  const { openModal } = useModal();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(!!storedUser);
  }, []);

  return (
    <div className="max-w-10xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-12">
          {/* Active contests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeContests.map((contest) => (
              <SwiperSlide key={contest.id}>
                <Card className="h-[420px] border-none rounded-[32px] overflow-hidden">
                  <div
                    onClick={() => router.push(`/Contest/${contest.id}`)}
                    className="h-1/2 relative cursor-pointer"
                  >
                    <Image
                      src={contest.image}
                      alt={contest.title}
                      fill
                      className="object-cover"
                    />
                    <Chip
                      className="absolute top-4 right-4 font-black uppercase text-[10px]"
                      color={contest.status === "Running" ? "danger" : "warning"}
                    >
                      {contest.status}
                    </Chip>
                  </div>

                  <CardBody className="p-7 flex flex-col justify-between">
                    <h4 className="text-lg font-black uppercase italic">
                      {contest.title}
                    </h4>

                    <div className="flex gap-4 text-[10px] font-black uppercase text-gray-400">
                      <span className="flex gap-1 items-center">
                        <Users size={14} /> {contest.participants}
                      </span>
                      <span className="flex gap-1 items-center">
                        <Clock size={14} />{" "}
                        {contest.endsIn || contest.startsIn}
                      </span>
                    </div>

                    <Button
                      className="bg-[#071739] text-white font-black h-12 rounded-xl uppercase"
                      onPress={() =>
                        openModal({
                          content: (
                            <RegisterContestModal contestId={contest.id} />
                          ),
                        })
                      }
                    >
                      Register Now <ArrowRight size={18} />
                    </Button>
                  </CardBody>
                </Card>
              </SwiperSlide>
            ))}
          </div>

          <Divider />

          {/* Tabs */}
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(k) => setSelectedTab(k as string)}
          >
            <Tab key="my" title="My Contests">
              {!user && (
                <Card className="mt-8">
                  <CardBody className="text-center py-16">
                    <h3 className="text-xl font-black mb-4">
                      Join TMOJ Contests
                    </h3>
                    <Button className="font-black">Register or Login</Button>
                  </CardBody>
                </Card>
              )}
            </Tab>

            <Tab key="past" title="Past Contests">
              <div className="mt-8 space-y-4">
                {pastContests.map((contest) => (
                  <Card key={contest.title}>
                    <CardBody>
                      <h4 className="font-black">{contest.title}</h4>
                      <p className="text-sm text-gray-400">{contest.date}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:col-span-1 space-y-6">
          {/* ===== JOIN BY INVITE CODE (TAO THÊM) ===== */}
          <Card className="border-none shadow-xl rounded-[2rem]">
            <CardBody className="p-6">
              <h3 className="text-lg font-black uppercase mb-4">
                Join by Invite Code
              </h3>

              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                className="w-full rounded-xl border px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-[#FFB800]"
              />

              <Button
                className="w-full bg-[#FFB800] text-[#071739] font-black h-11 rounded-xl uppercase"
                isDisabled={!inviteCode.trim()}
              >
                Join Contest
              </Button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Use invite code from contest organizer
              </p>
            </CardBody>
          </Card>

          {/* ===== GLOBAL RANKING ===== */}
          <Card className="border-none shadow-xl rounded-[2rem] sticky top-8">
            <CardBody className="p-8">
              <h2 className="text-2xl font-black mb-8 uppercase">
                Global Ranking
              </h2>

              <div className="space-y-6">
                {globalRanking.map((u) => (
                  <div key={u.rank} className="flex gap-4 items-center">
                    <div className="font-black text-gray-400">{u.rank}</div>
                    <div className="flex-1">
                      <div className="font-black uppercase">{u.name}</div>
                      <div className="text-xs text-gray-400">
                        Rating {u.rating} | Attended {u.attended}
                      </div>
                    </div>
                    {u.crown && <span>👑</span>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
