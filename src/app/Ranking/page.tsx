"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Progress,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import UserAvatar from "@/components/Common/UserAvatar";
import {
  ArrowUpRight,
  Crown,
  LayoutList,
  Medal,
  RefreshCw,
  RotateCcw,
  Search,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";


const RANKING_DATA = [
  {
    rank: 1,
    fullname: "Van Ngoc Thang",
    username: "vanngocthang",
    userId: "DE180947",
    rollNumber: "DE180947",
    class: "SDN302",
    solved: 125,
    points: 1250,
    accuracy: 98,
    time: 45,
  },
  {
    rank: 2,
    fullname: "Nguyen Duy Rim",
    username: "nguyenduyrim",
    userId: "DE180459",
    rollNumber: "DE180459",
    class: "WDP301",
    solved: 118,
    points: 1180,
    accuracy: 95,
    time: 52,
  },
  {
    rank: 3,
    fullname: "Pham Nguyen Hai Dang",
    username: "haidang",
    userId: "DE170023",
    rollNumber: "DE170023",
    class: "SDN302",
    solved: 110,
    points: 1100,
    accuracy: 92,
    time: 48,
  },
  {
    rank: 4,
    fullname: "Nguyen Thanh Tuan",
    username: "thanhtuan",
    userId: "DE180464",
    rollNumber: "DE180464",
    class: "PRF192",
    solved: 105,
    points: 1050,
    accuracy: 94,
    time: 60,
  },
  {
    rank: 5,
    fullname: "Nguyen Le Viet Huy",
    username: "viethuy",
    userId: "DE170254",
    rollNumber: "DE170254",
    class: "SDN302",
    solved: 98,
    points: 980,
    accuracy: 89,
    time: 55,
  },
];

import { useGetGlobalRankingQuery, useGetPublicContestsQuery } from "@/store/queries/ranking";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { useDebounce } from "@/hooks/useDebounce";

export default function RankingPage() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: user } = useGetUserInformationQuery();
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
    setPage(1);
  }, [debouncedSearch]);

  const { data: rankingResponse, isLoading } = useGetGlobalRankingQuery({
    page,
    pageSize: 20,
    search: search || undefined,
  });

  // Fetch my own rank
  const { data: myRankResponse } = useGetGlobalRankingQuery(
    { search: user?.username },
    { skip: !user?.username }
  );

  const myRankData = myRankResponse?.data?.rows?.find(r => r.userId === user?.userId);

  const { data: contestsResponse } = useGetPublicContestsQuery();

  const combinedContests = useMemo(() => {
    const publicContests = contestsResponse?.data || [];
    return [{ id: "global", title: "Global Rank" }, ...publicContests];
  }, [contestsResponse]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rankingData = rankingResponse?.data?.rows?.length ? rankingResponse.data.rows : RANKING_DATA as any[];
  const totalPages = rankingResponse?.data?.totalPages || 1;

  const podium = useMemo(() => {
    const p1 = rankingData[0] || null;
    const p2 = rankingData[1] || null;
    const p3 = rankingData[2] || null;
    return [p2, p1, p3]; // Order: [Silver, Gold, Bronze]
  }, [rankingData]);



  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] transition-colors duration-500 p-4 lg:p-8 text-[#071739] dark:text-white">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#FF5C00] rounded-xl shadow-lg text-white">
              <Trophy size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-[1000] italic tracking-tighter uppercase leading-none">
              Hall of <span className="text-[#FF5C00]">Fame</span>
            </h1>
          </div>

          <div className="flex bg-white dark:bg-[#1C2737] p-1.5 rounded-2xl shadow-sm border dark:border-white/5">
            <Link href="/Ranking/rating">
              <Button
                size="sm"
                className="rounded-xl font-black italic text-[9px] uppercase transition-all bg-transparent text-slate-400"
                startContent={<Zap size={16} />}
              >
                Elo Rating
              </Button>
            </Link>
            <Button
              size="sm"
              className="rounded-xl font-black italic text-[9px] uppercase transition-all bg-[#071739] text-white dark:bg-[#FF5C00]"
              startContent={<LayoutList size={16} />}
            >
              Leaderboard
            </Button>
          </div>
        </div>

        {/* PODIUM SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-[1000px] mx-auto w-full animate-in fade-in zoom-in duration-700 mb-8 pt-10">
            {podium.map((student, index) => {
              if (!student) return <div key={`empty-${index}`} className="hidden md:block h-full" />;
              const isFirst = index === 1;
              const isSecond = index === 0;
              const isThird = index === 2;

              // Styles cho viền nhất, nhì, ba
              const rankStyles = isFirst
                ? {
                  border: "border-amber-400",
                  shadow: "shadow-[0_0_30px_rgba(251,191,36,0.3)]",
                  badge: "bg-amber-400",
                }
                : isSecond
                  ? {
                    border: "border-slate-300",
                    shadow: "shadow-[0_0_20px_rgba(203,213,225,0.3)]",
                    badge: "bg-slate-300",
                  }
                  : {
                    border: "border-orange-700",
                    shadow: "shadow-[0_0_20px_rgba(194,65,12,0.3)]",
                    badge: "bg-orange-700",
                  };

              return (
                <Card
                  key={student.userId}
                  className={`rounded-[3rem] transition-all duration-500 overflow-visible border-4 ${rankStyles.border
                    } ${rankStyles.shadow} ${isFirst
                      ? "bg-linear-to-br from-[#071739] to-[#1a2a4a] text-white scale-110 z-20 h-[360px]"
                      : "bg-white dark:bg-[#1C2737] h-[280px] z-10"
                    }`}
                >
                  <CardBody className="p-6 flex flex-col items-center justify-center text-center gap-3 relative">
                    <div
                      className={`absolute top-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 z-30 transform -translate-y-[30%] border-white ${rankStyles.badge} text-white`}
                    >
                      {isFirst ? (
                        <Crown size={24} />
                      ) : isSecond ? (
                        <Medal size={22} />
                      ) : isThird ? (
                        <Medal size={22} />
                      ) : null}
                    </div>

                    <UserAvatar
                      src={student.avatarUrl || `https://i.pravatar.cc/150?u=${student.userId}`}
                      frameUrl={student.equippedFrameUrl || student.frameUrl}
                      size="lg"
                    />

                    <div className="space-y-0.5 mt-8">
                      <h3
                        className={`text-lg font-[1000] italic uppercase leading-tight ${isFirst
                          ? "text-white"
                          : "text-[#071739] dark:text-white"
                          }`}
                      >
                        {student.fullname || student.username}
                      </h3>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-widest ${isFirst ? "text-white/70" : "text-slate-400"
                          }`}
                      >
                        {student.rollNumber || student.username}
                      </p>
                    </div>

                    <div
                      className={`grid grid-cols-2 gap-3 w-full pt-4 border-t ${isFirst
                        ? "border-white/20"
                        : "border-slate-100 dark:border-white/5"
                        }`}
                    >
                      <div className="text-center">
                        <p
                          className={`text-[8px] font-black uppercase italic ${isFirst ? "text-[#FF5C00]" : "text-[#FF5C00]"
                            }`}
                        >
                          Solved
                        </p>
                        <p className="text-lg font-[1000] italic">
                          {student.solved}
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-[8px] font-black uppercase italic ${isFirst ? "text-[#FF5C00]" : "text-[#FF5C00]"
                            }`}
                        >
                          Points
                        </p>
                        <p className="text-lg font-[1000] italic">
                          {student.points}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

        {/* FILTERS TOOLBAR */}
        <Card className="bg-white dark:bg-[#1C2737] rounded-4xl border-none shadow-sm">
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search name or ID..."
                value={searchInput}
                onValueChange={setSearchInput}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                startContent={<Search size={18} className="text-slate-400" />}
                className="flex-1"
                classNames={{
                  inputWrapper:
                    "bg-[#F0F2F5] dark:bg-[#0A0F1C] rounded-2xl h-12 shadow-none font-bold italic",
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="bg-[#FF5C00] text-white font-[1000] italic h-12 rounded-2xl uppercase text-[11px] px-8 shadow-lg"
                >
                  Search
                </Button>
                <Button
                  isIconOnly
                  onClick={handleReset}
                  title="Reset Filters"
                  className="bg-red-500/10 text-red-500 border border-red-500/20 font-[1000] italic h-12 w-12 shrink-0 rounded-2xl uppercase shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white dark:bg-[#1C2737] rounded-[3rem] border-none shadow-xl overflow-hidden mb-10 animate-in slide-in-from-bottom-4 duration-500">
            <CardBody className="p-0">
              <Table removeWrapper aria-label="Ranking table">
                <TableHeader>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 px-10 italic text-slate-400">
                    Rank
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400">
                    Athlete
                  </TableColumn>

                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Solved
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Accuracy
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-right px-10">
                    Score
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {[
                    ...rankingData.map((row) => {
                      const isMe = user?.userId === row.userId;
                      return (
                        <TableRow
                          key={row.userId}
                          className={`border-b border-slate-50 dark:border-white/5 last:border-none transition-all h-20 group ${isMe
                            ? "bg-orange-500/10 dark:bg-orange-500/20"
                            : "hover:bg-[#F0F2F5] dark:hover:bg-[#0A0F1C]"
                            }`}
                        >
                          <TableCell className="px-10 font-[1000] italic text-2xl leading-none">
                            <span
                              className={
                                row.rank === 1
                                  ? "text-amber-500"
                                  : row.rank === 2
                                    ? "text-slate-400"
                                    : row.rank === 3
                                      ? "text-orange-700"
                                      : "text-slate-300"
                              }
                            >
                              {row.rank.toString().padStart(2, "0")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <UserAvatar
                                src={row.avatarUrl || `https://i.pravatar.cc/150?u=${row.userId}`}
                                size="sm"
                              />
                              <div className="flex flex-col">
                                <span className={`font-[1000] uppercase italic text-sm group-hover:text-[#FF5C00] transition-colors ${isMe ? "text-[#FF5C00]" : ""}`}>
                                  {row.fullname || row.username} {isMe && "(You)"}
                                </span>
                                <span className="font-bold text-[9px] text-slate-400 uppercase leading-none">
                                  {row.rollNumber || row.username}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center font-black italic text-sm">
                            {row.solved}
                          </TableCell>
                          <TableCell className="text-center font-black italic text-emerald-500">
                            {row.accuracy}%
                          </TableCell>
                          <TableCell className="text-right px-10 font-[1000] italic text-xl text-blue-600 dark:text-[#FF5C00]">
                            {row.points.toLocaleString()}
                            <ArrowUpRight
                              size={18}
                              className="inline-block ml-2 text-slate-300"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    }),
                    // LUÔN HIỆN BẢN THÂN KHI SEARCH - Nếu không có trong list hiện tại
                    ...(myRankData && !rankingData.some(r => r.userId === user?.userId) ? [
                      <TableRow
                        key="my-fixed-rank"
                        className="bg-[#FF5C00]/5 dark:bg-[#FF5C00]/10 border-t-2 border-[#FF5C00]/20 sticky bottom-0 z-20 h-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] backdrop-blur-md"
                      >
                        <TableCell className="px-10 font-[1000] italic text-sm leading-none text-[#FF5C00]">
                          <div className="flex flex-col items-center">
                            <Star size={14} fill="currentColor" className="mb-1" />
                            <span>YOU</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <UserAvatar
                              src={myRankData.avatarUrl || `https://i.pravatar.cc/150?u=${myRankData.userId}`}
                              size="sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-[1000] uppercase italic text-sm text-[#FF5C00]">
                                {myRankData.fullname || myRankData.username} (You)
                              </span>
                              <span className="font-bold text-[9px] text-slate-400 uppercase leading-none">
                                {myRankData.rollNumber || myRankData.username}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-black italic text-sm">
                          {myRankData.solved}
                        </TableCell>
                        <TableCell className="text-center font-black italic text-emerald-500">
                          {myRankData.accuracy}%
                        </TableCell>
                        <TableCell className="text-right px-10 font-[1000] italic text-xl text-[#FF5C00]">
                          {myRankData.points.toLocaleString()}
                          <ArrowUpRight size={18} className="inline-block ml-2 text-[#FF5C00]/30" />
                        </TableCell>
                      </TableRow>
                    ] : [])
                  ]}
                </TableBody>
              </Table>
              <div className="flex justify-center p-10 border-t border-divider">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={setPage}
                  classNames={{
                    cursor:
                      "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic shadow-xl",
                  }}
                />
              </div>
            </CardBody>
          </Card>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
