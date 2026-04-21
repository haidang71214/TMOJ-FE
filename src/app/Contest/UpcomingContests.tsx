"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Tabs,
  Tab,
  Chip,
  useDisclosure,
  addToast,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  Bookmark,
  Calendar,
} from "lucide-react";

// Swiper Components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import AddToCollectionModal from "../Problems/components/AddToCollectionModal";
import "swiper/css/pagination";

import {
  useGetContestListQuery,
  useGetMyContestsQuery,
  useUnregisterContestMutation,
  useGetContestParticipantsQuery,
  useJoinContestByCodeMutation
} from "@/store/queries/Contest";
import { useGetFavoriteContestsQuery, useToggleContestFavoriteMutation } from "@/store/queries/favorites";
import { toast } from "sonner";
import { ContestDto } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useModal } from "@/Provider/ModalProvider";
import LoginModal from "@/app/Modal/LoginModal";

const globalRanking = [
  { rank: 1, name: "Miruu", rating: 3703, attended: 26, crown: "gold" },
  { rank: 2, name: "Neal Wu", rating: 3686, attended: 51, crown: "silver" },
  { rank: 3, name: "Yawn_Sean", rating: 3645, attended: 84, crown: "bronze" },
  { rank: 4, name: "Xiao_Yang", rating: 3611, attended: 107 },
];

const ParticipantCount = ({ contestId }: { contestId: string }) => {
  const { data } = useGetContestParticipantsQuery(contestId);
  return <>{data?.data?.totalUsers || 0}</>;
};

export default function UpcomingContests() {
  const [selectedTab, setSelectedTab] = useState("my");
  const [inviteCode, setInviteCode] = useState("");
  const {
    isOpen: isCollectionOpen,
    onOpen: onOpenCollection,
    onOpenChange: onOpenChangeCollection
  } = useDisclosure();
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { openModal } = useModal();

  const { data: contestsData, isLoading } = useGetContestListQuery({
    page: 1,
    pageSize: 50,
  });

  // 2. Fetch danh sách contest của tôi (đã đăng ký)
  const { data: myContestsData } = useGetMyContestsQuery({}, { skip: !currentUser });
  const [unregisterContest] = useUnregisterContestMutation();
  const [joinContestByCode, { isLoading: isJoining }] = useJoinContestByCodeMutation();

  // API Favorites cho Contest
  const { data: favoriteContestsData } = useGetFavoriteContestsQuery({ page: 1, pageSize: 1000 }, { skip: !currentUser });
  const [toggleFavorite] = useToggleContestFavoriteMutation();

  const favoriteContestIds = useMemo(() => {
    const rawData: any = favoriteContestsData;
    const items = rawData?.data?.data?.items || rawData?.data?.data || rawData?.data?.items || rawData?.data || [];

    return new Set<string>(items.map((c: any) => String(c.contestId || c.id || "")));
  }, [favoriteContestsData]);

  const handleToggleFavorite = async (e: React.MouseEvent, contestId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      openModal({ title: "Đăng nhập", content: <LoginModal /> });
      return;
    }
    try {
      const res = await toggleFavorite(contestId).unwrap();
      const isFav = res.data?.data?.isFavorited ?? res.data?.isFavorited ?? res.data?.isFavorite;
      toast.success(isFav ? "Added to favorite contests" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  // 3. Xử lý danh sách contest đã đăng ký (an toàn)
  const myRegisteredContests = useMemo(() => {
    const rawData: any = myContestsData?.data;
    if (Array.isArray(rawData)) return rawData;
    if (rawData && typeof rawData === 'object' && 'items' in rawData && Array.isArray(rawData.items)) {
      return rawData.items;
    }
    return [];
  }, [myContestsData]);

  // 4. Mapping thông tin đăng ký vào danh sách chung
  const allContests = useMemo(() => {
    return (contestsData?.data?.items || []).map(contest => {
      const isRegistered = contest.isRegistered ||
        myRegisteredContests.some((mc: any) =>
          String(mc.id) === String(contest.id) ||
          (mc as any).contestId === contest.id
        );

      return {
        ...contest,
        isRegistered
      };
    });
  }, [contestsData, myRegisteredContests]);

  // 5. Phân loại danh sách theo tab
  const activeContests = allContests.filter((c: any) => {
    const isPast = new Date(c.endAt) < new Date();
    const statusLower = c.status?.toLowerCase();
    const visibility = (c.visibilityCode || c.visibility || "public").toLowerCase();

    return (
      statusLower !== "ended" &&
      statusLower !== "past" &&
      !isPast &&
      visibility === "public"
    );
  });

  const myContestsSorted = myRegisteredContests.filter((c: any) => {
    const isPast = new Date(c.endAt) < new Date();
    const statusLower = c.status?.toLowerCase();
    return statusLower !== "ended" && statusLower !== "past" && !isPast;
  });

  const pastContestsSorted = myRegisteredContests.filter((c: any) => {
    const isPast = new Date(c.endAt) < new Date();
    const statusLower = c.status?.toLowerCase();
    return statusLower === "ended" || statusLower === "past" || isPast;
  });

  const handleJoinByCode = async () => {
    if (!inviteCode.trim()) {
      toast.error("Invite code is required!");
      return;
    }
    try {
      const res = await joinContestByCode({ inviteCode: inviteCode.trim() }).unwrap();
      toast.success(res.message || "Joined contest successfully!");
      setInviteCode("");
      // Refresh my contests list to reflect the new registration
      setSelectedTab("my");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to join contest. Check your code.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 font-black italic uppercase">Loading Contests...</div>;
  }

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
                    src={(contest as any).image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070"}
                    alt={contest.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <Chip
                    className="absolute top-4 right-4 font-black uppercase text-[9px] text-white"
                    color={contest.status?.toLowerCase() === "running" ? "success" : "primary"}
                  >
                    {contest.status}
                  </Chip>
                </div>
                <CardBody className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h4 className="text-lg font-black uppercase italic leading-tight line-clamp-2">
                        {contest.title}
                      </h4>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-slate-100 dark:bg-white/5 rounded-xl hover:scale-110 active:scale-95 transition-all"
                          onClick={(e) => handleToggleFavorite(e as any, contest.id)}
                        >
                          <Heart
                            size={16}
                            fill={favoriteContestIds.has(String(contest.id)) ? "#ef4444" : "none"}
                            className={favoriteContestIds.has(String(contest.id)) ? "text-red-500" : "text-slate-400 dark:text-slate-500"}
                          />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-slate-100 dark:bg-white/5 rounded-xl hover:scale-110 active:scale-95 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContestId(String(contest.id));
                            onOpenCollection();
                          }}
                        >
                          <Bookmark size={16} className="text-slate-400 dark:text-slate-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase text-gray-400 italic">
                      <span className="flex gap-2 items-center">
                        <Users size={14} className="text-[#FF5C00]" />{" "}
                        <ParticipantCount contestId={contest.id} /> Students
                      </span>
                      <span className="flex gap-2 items-center">
                        <Clock size={14} className="text-[#FF5C00]" />{" "}
                        {contest.status === "Upcoming" ? `Starts: ${new Date(contest.startAt).toLocaleDateString()}` : `Ends: ${new Date(contest.endAt).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>

                  {!contest.isRegistered ? (
                    contest.status?.toLowerCase() === "running" ? (
                      <Button
                        fullWidth
                        disabled
                        className="bg-gray-400 text-white font-black h-12 rounded-xl uppercase italic mt-4 cursor-not-allowed opacity-70"
                      >
                        In Progress <Clock size={18} />
                      </Button>
                    ) : (
                      (() => {
                        const isRegExpired = new Date(contest.startAt).getTime() - Date.now() < 8 * 60 * 60 * 1000;
                        return (
                          <Button
                            fullWidth
                            isDisabled={isRegExpired}
                            className={`font-black h-12 rounded-xl uppercase italic mt-4 transition-all duration-300 ${isRegExpired ? "bg-gray-400 text-white cursor-not-allowed opacity-70" : "bg-[#071739] text-white hover:opacity-90 shadow-lg"}`}
                            onPress={() => {
                              if (!currentUser) {
                                openModal({ title: "Đăng nhập", content: <LoginModal /> });
                                return;
                              }
                              router.push(`/Contest/${contest.id}/register`);
                            }}
                          >
                            {isRegExpired ? "Registration Closed" : "Register Now"} <ArrowRight size={18} />
                          </Button>
                        );
                      })()
                    )
                  ) : (
                    <Button
                      fullWidth
                      className="bg-green-500 text-white font-black h-12 rounded-xl uppercase italic mt-4 transition-all duration-300 hover:opacity-90 shadow-lg shadow-green-500/20"
                      onPress={() => router.push(`/Contest/${contest.id}`)}
                    >
                      Continue <ArrowRight size={18} />
                    </Button>
                  )}
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

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
        <div className="lg:col-span-3 space-y-6">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(k) => setSelectedTab(k as string)}
            variant="underlined"
            classNames={{
              tabList: "gap-8",
              cursor: "w-full bg-[#FF5C00]",
              tabContent: "group-data-[selected=true]:text-[#FF5C00] font-black uppercase italic text-sm",
            }}
          >
            <Tab key="my" title="My Contests">
              <div className="mt-6 space-y-4">
                {myContestsSorted.map((contest: any, index: number) => {
                  const isRunning = contest.status?.toLowerCase() === "running";
                  return (
                    <div
                      key={contest.id || `my-${index}`}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all group relative overflow-hidden ${isRunning
                        ? "bg-gradient-to-r from-[#FF5C00]/5 to-transparent border border-[#FF5C00]/50 shadow-[0_0_15px_rgba(255,92,0,0.1)] animate-pulse-slow"
                        : "bg-slate-50 dark:bg-black/10 border border-transparent hover:border-[#FF5C00]/30"
                        }`}
                    >
                      {isRunning && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF5C00] shadow-[2px_0_10px_rgba(255,92,0,0.5)]" />
                      )}

                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 relative rounded-xl overflow-hidden shrink-0 shadow-sm border ${isRunning ? "border-[#FF5C00]" : "border-slate-200 dark:border-white/5"
                          }`}>
                          <Image
                            src={(contest as any).image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070"}
                            alt={contest.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-black uppercase italic text-sm transition-colors ${isRunning ? "text-[#FF5C00]" : "group-hover:text-[#FF5C00]"
                              }`}>
                              {contest.title}
                            </h4>
                            {isRunning && (
                              <span className="flex items-center gap-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                                <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                LIVE
                              </span>
                            )}
                          </div>
                          <div className="flex gap-3 items-center mt-1">
                            <Chip
                              size="sm"
                              variant={isRunning ? "solid" : "flat"}
                              color={isRunning ? "success" : "default"}
                              className="font-black italic uppercase text-[8px] h-5"
                            >
                              {contest.status}
                            </Chip>
                            <p className={`text-[10px] font-bold uppercase italic ${isRunning ? "text-green-500 animate-pulse" : "text-gray-400"
                              }`}>
                              {isRunning ? "Compete now • Keep solving!" : `Starts at ${new Date(contest.startAt).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isRunning && (
                          <Button
                            variant="light"
                            size="sm"
                            color="danger"
                            className="font-black italic uppercase text-[10px] rounded-lg h-9 px-4 transition-all duration-300 opacity-60 hover:opacity-100"
                            onPress={async () => {
                              const targetId = contest.id || (contest as any).contestId;
                              if (!targetId) {
                                console.error("Contest ID is missing", contest);
                                return;
                              }
                              if (window.confirm(`Bạn có chắc chắn muốn hủy đăng ký cuộc thi "${contest.title}" không?`)) {
                                try {
                                  await unregisterContest(targetId).unwrap();
                                  addToast({
                                    title: "Hủy đăng ký thành công!",
                                    color: "success",
                                  });
                                } catch (err) {
                                  console.error("Failed to unregister:", err);
                                  addToast({
                                    title: "Hủy đăng ký thất bại!",
                                    color: "danger",
                                  });
                                }
                              }
                            }}
                          >
                            Unregister
                          </Button>
                        )}
                        <Button
                          variant={isRunning ? "solid" : "flat"}
                          size="sm"
                          className={`font-black italic uppercase text-[10px] rounded-lg h-9 px-6 transition-all duration-300 ${isRunning
                            ? "bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/20 hover:scale-105"
                            : "hover:bg-[#00FF41] hover:text-[#071739]"
                            }`}
                          onPress={() => router.push(`/Contest/${contest.id}`)}
                        >
                          {isRunning ? "Enter Contest" : "View"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Tab>

            <Tab key="past" title="Past Contests">
              <div className="mt-6 space-y-3">
                {pastContestsSorted.map((contest: any, index: number) => (
                  <div
                    key={contest.id || `past-${index}`}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-[#FF5C00]/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <Image
                          src={(contest as any).image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070"}
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
                            <Calendar size={10} /> {new Date(contest.endAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="flat"
                      size="sm"
                      className="font-black italic uppercase text-[10px] rounded-lg h-9 px-6 transition-all duration-300 hover:bg-[#FF5C00] hover:text-white"
                      onPress={() => router.push(`/Contest/${contest.id}/ranking`)}
                    >
                      Results
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card className="border-none shadow-none rounded-[2.5rem] bg-[#FFB800] overflow-hidden">
            <CardBody className="p-6 space-y-4 text-center">
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="ENTER INVITE CODE"
                className="w-full rounded-2xl bg-white/30 border-none px-4 py-3 text-xs font-black uppercase italic placeholder:text-[#071739]/50 outline-none focus:bg-white transition-all text-center"
              />
              <Button
                fullWidth
                isLoading={isJoining}
                onPress={handleJoinByCode}
                className="bg-[#071739] text-white font-black rounded-2xl uppercase italic transition-all duration-300 hover:bg-[#00FF41] hover:text-[#071739]"
              >
                Join
              </Button>
            </CardBody>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-8 border-l-4 border-[#FF5C00] pl-4">
              <h2 className="text-xl font-[1000] uppercase italic leading-none">
                Global<br /><span className="text-[#FF5C00]">Ranking</span>
              </h2>
            </div>
            <div className="space-y-6">
              {globalRanking.map((u) => (
                <div key={u.rank} className="flex gap-4 items-center">
                  <div className={`font-black text-xs w-5 ${u.rank <= 3 ? "text-[#FF5C00]" : "text-slate-400"}`}>
                    0{u.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black uppercase italic text-sm truncate flex items-center gap-2">
                      {u.name} {u.crown && "👑"}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase italic">ELO {u.rating}</span>
                      <span className="text-[8px] font-bold text-[#FF5C00] uppercase">{u.attended} Matches</span>
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

      <AddToCollectionModal
        isOpen={isCollectionOpen}
        onOpenChange={onOpenChangeCollection}
        contestId={selectedContestId}
      />
    </div>
  );
}
