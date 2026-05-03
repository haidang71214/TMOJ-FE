"use client";

import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import UserAvatar from "@/components/Common/UserAvatar";
import RatingBadge, { getRatingTier } from "@/components/Common/RatingBadge";
import { BarChart3, Crown, LayoutList, Medal, RotateCcw, Search, Star, TrendingUp, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useGetRatingLeaderboardQuery } from "@/store/queries/ranking";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { useDebounce } from "@/hooks/useDebounce";

export default function RatingLeaderboardPage() {
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

  const { data: response, isLoading, isFetching } = useGetRatingLeaderboardQuery({
    page,
    pageSize: 20,
    search: search || undefined,
  });

  // Fetch my own rating
  const { data: myRatingResponse } = useGetRatingLeaderboardQuery(
    { search: user?.username },
    { skip: !user?.username }
  );

  const myRatingData = myRatingResponse?.data?.rows?.find(r => r.userId === user?.userId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rows = response?.data?.rows ?? [];
  const totalPages = response?.data?.totalPages ?? 1;

  const podium = useMemo(() => {
    const p1 = rows[0] ?? null;
    const p2 = rows[1] ?? null;
    const p3 = rows[2] ?? null;
    return [p2, p1, p3];
  }, [rows]);

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
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#FF5C00] rounded-xl shadow-lg text-white">
              <Zap size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-[1000] italic tracking-tighter uppercase leading-none">
                Elo <span className="text-[#FF5C00]">Rating</span>
              </h1>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase italic mt-2">
                Bảng xếp hạng theo phong độ tổng hợp qua các contest (Elo-MMR)
              </p>
            </div>
          </div>

          <div className="flex bg-white dark:bg-[#1C2737] p-1.5 rounded-2xl shadow-sm border dark:border-white/5">
            <Button
              size="sm"
              className="rounded-xl font-black italic text-[9px] uppercase transition-all bg-[#071739] text-white dark:bg-[#FF5C00]"
              startContent={<Zap size={16} />}
            >
              Elo Rating
            </Button>
            <Link href="/Ranking">
              <Button
                size="sm"
                className="rounded-xl font-black italic text-[9px] uppercase transition-all bg-transparent text-slate-400"
                startContent={<LayoutList size={16} />}
              >
                Leaderboard
              </Button>
            </Link>

          </div>
        </div>

        {/* PODIUM */}
        {!search && rows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-[1000px] mx-auto w-full mb-8 pt-10">
            {podium.map((u, index) => {
              if (!u) return <div key={`empty-${index}`} className="hidden md:block h-full" />;
              const isFirst = index === 1;
              const isSecond = index === 0;
              const tier = getRatingTier(u.rating);

              const rankStyles = isFirst
                ? { border: "border-amber-400", shadow: "shadow-[0_0_30px_rgba(251,191,36,0.3)]", badge: "bg-amber-400" }
                : isSecond
                  ? { border: "border-slate-300", shadow: "shadow-[0_0_20px_rgba(203,213,225,0.3)]", badge: "bg-slate-300" }
                  : { border: "border-orange-700", shadow: "shadow-[0_0_20px_rgba(194,65,12,0.3)]", badge: "bg-orange-700" };

              return (
                <Card
                  key={u.userId}
                  className={`rounded-[3rem] transition-all duration-500 overflow-visible border-4 ${rankStyles.border} ${rankStyles.shadow} ${isFirst
                    ? "bg-linear-to-br from-[#071739] to-[#1a2a4a] text-white scale-110 z-20 h-[380px]"
                    : "bg-white dark:bg-[#1C2737] h-[300px] z-10"
                    }`}
                >
                  <CardBody className="p-6 flex flex-col items-center justify-center text-center gap-3 relative">
                    <div
                      className={`absolute top-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 z-30 transform -translate-y-[30%] border-white ${rankStyles.badge} text-white`}
                    >
                      {isFirst ? <Crown size={24} /> : <Medal size={22} />}
                    </div>

                    <UserAvatar
                      src={u.avatarUrl || `https://i.pravatar.cc/150?u=${u.userId}`}
                      size="lg"
                    />

                    <div className="space-y-0.5">
                      <h3 className={`text-lg font-[1000] italic uppercase leading-tight ${isFirst ? "text-white" : ""}`}>
                        {u.fullname || u.username}
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isFirst ? "text-white/70" : "text-slate-400"}`}>
                        @{u.username}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-3">
                      <span
                        className="text-3xl font-[1000] italic"
                        style={{ color: tier.color }}
                      >
                        {u.rating}
                      </span>
                      <span
                        className="text-[10px] font-black italic uppercase px-3 py-1 rounded-full"
                        style={{
                          color: tier.color,
                          backgroundColor: `${tier.color}22`,
                          border: `1px solid ${tier.color}55`,
                        }}
                      >
                        {tier.title}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${isFirst ? "text-white/60" : "text-slate-400"}`}>
                        Max {u.maxRating} • {u.timesPlayed} contests
                      </span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* SEARCH */}
        <Card className="bg-white dark:bg-[#1C2737] rounded-4xl border-none shadow-sm">
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search by username or fullname..."
                value={searchInput}
                onValueChange={setSearchInput}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                startContent={<Search size={18} className="text-slate-400" />}
                classNames={{
                  inputWrapper: "bg-[#F0F2F5] dark:bg-[#0A0F1C] rounded-2xl h-12 shadow-none font-bold italic",
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-[#FF5C00] text-white font-[1000] italic h-12 rounded-2xl uppercase text-[11px] px-6 shadow-lg"
                >
                  Search
                </Button>
                <Button
                  isIconOnly
                  onClick={handleReset}
                  title="Reset"
                  className="bg-red-500/10 text-red-500 border border-red-500/20 font-[1000] italic h-12 w-12 shrink-0 rounded-2xl uppercase shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* TABLE */}
        <Card className="bg-white dark:bg-[#1C2737] rounded-[3rem] border-none shadow-xl overflow-hidden mb-10">
          <CardBody className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" color="warning" />
              </div>
            ) : (
              <Table removeWrapper aria-label="Rating leaderboard">
                <TableHeader>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 px-10 italic text-slate-400">
                    Rank
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400">
                    Player
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Rating
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Max
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Contests
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-right px-10">
                    Last Competed
                  </TableColumn>
                </TableHeader>
                <TableBody emptyContent="Chưa có dữ liệu rating.">
                  {[
                    ...rows.map((row) => {
                      const tier = getRatingTier(row.rating);
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
                            <Link href={`/Profile/${row.username}`} className="flex items-center gap-4">
                              <UserAvatar
                                src={row.avatarUrl || `https://i.pravatar.cc/150?u=${row.userId}`}
                                size="sm"
                              />
                              <div className="flex flex-col">
                                <span
                                  className={`font-[1000] uppercase italic text-sm group-hover:text-[#FF5C00] transition-colors ${isMe ? "text-[#FF5C00]" : ""}`}
                                >
                                  {row.fullname || row.username} {isMe && "(You)"}
                                </span>
                                <span className="font-bold text-[9px] text-slate-400 uppercase leading-none">
                                  @{row.username} · {tier.title}
                                </span>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className={`text-center font-black italic text-sm ${isMe ? "text-[#FF5C00]" : "text-slate-600 dark:text-slate-400"}`}>
                            {row.rating.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center font-black italic text-sm text-slate-500">
                            {row.maxRating}
                          </TableCell>
                          <TableCell className="text-center font-black italic text-sm">
                            {row.timesPlayed}
                          </TableCell>
                          <TableCell className="text-right px-10 font-bold italic text-xs text-slate-400">
                            {row.lastCompetedAt
                              ? new Date(row.lastCompetedAt).toLocaleDateString()
                              : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    }),
                    // LUÔN HIỆN BẢN THÂN KHI SEARCH - Nếu không có trong list hiện tại
                    ...(myRatingData && !rows.some(r => r.userId === user?.userId) ? [
                      <TableRow
                        key="my-fixed-rating"
                        className="bg-[#FF5C00]/5 dark:bg-[#FF5C00]/10 border-t-2 border-[#FF5C00]/20 sticky bottom-0 z-20 h-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] backdrop-blur-md"
                      >
                        <TableCell className="px-10 font-[1000] italic text-sm leading-none text-[#FF5C00]">
                          <div className="flex flex-col items-center">
                            <Star size={14} fill="currentColor" className="mb-1" />
                            <span>YOU</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/Profile/${myRatingData.username}`} className="flex items-center gap-4">
                            <UserAvatar
                              src={myRatingData.avatarUrl || `https://i.pravatar.cc/150?u=${myRatingData.userId}`}
                              size="sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-[1000] uppercase italic text-sm text-[#FF5C00]">
                                {myRatingData.fullname || myRatingData.username} (You)
                              </span>
                              <span className="font-bold text-[9px] text-slate-400 uppercase leading-none">
                                @{myRatingData.username} · {getRatingTier(myRatingData.rating).title}
                              </span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center font-black italic text-sm text-[#FF5C00]">
                          {myRatingData.rating.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center font-black italic text-sm text-slate-500">
                          {myRatingData.maxRating}
                        </TableCell>
                        <TableCell className="text-center font-black italic text-sm">
                          {myRatingData.timesPlayed}
                        </TableCell>
                        <TableCell className="text-right px-10 font-bold italic text-xs text-[#FF5C00]">
                          {myRatingData.lastCompetedAt
                            ? new Date(myRatingData.lastCompetedAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ] : [])
                  ]}
                </TableBody>
              </Table>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center p-10 border-t border-divider">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={setPage}
                  isDisabled={isFetching}
                  classNames={{
                    cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic shadow-xl",
                  }}
                />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
