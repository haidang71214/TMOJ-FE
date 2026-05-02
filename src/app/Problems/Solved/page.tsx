"use client";
import React, { useState, useMemo } from "react";
import Sidebar from "../Sidebar";
import { ProblemsTable } from "../Library/ProblemsTable";
import { Input, Button, Pagination, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Search, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import { useGetProblemSolvedListQuery } from "@/store/queries/ProblemSolved";
import { useGetFavoriteProblemsQuery, useToggleProblemFavoriteMutation } from "@/store/queries/favorites";
import { toast } from "sonner";
import { useAppSelector } from "@/utils/redux";
import { Problem } from "@/types";

export default function SolvedProblemsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticatedAccount);

  // API cho danh sách bài đã giải
  const { data: solvedListResponse, isLoading: isLoadingSolved } = useGetProblemSolvedListQuery(
    {
      page,
      pageSize: PAGE_SIZE,
      solvedSourceCode: selectedSource !== "All" ? selectedSource : undefined,
      visibilityCode: selectedVisibility !== "All" ? selectedVisibility : undefined,
      difficulty: selectedDifficulty !== "All" ? selectedDifficulty.toLowerCase() : undefined
    },
    { skip: !isAuthenticated }
  );

  // API cho Like (để đồng bộ trái tim trong table)
  const { data: favoriteData } = useGetFavoriteProblemsQuery({ page: 1, pageSize: 1000 }, { skip: !isAuthenticated });
  const [toggleFavorite] = useToggleProblemFavoriteMutation();

  const likedProblems = useMemo(() => {
    const rawData: any = favoriteData;
    const favoriteList = rawData?.data?.data?.items || rawData?.data?.data || rawData?.data?.items || rawData?.data || [];
    return new Set<string>(favoriteList.map((p: any) => String(p.problemId || p.id || "")));
  }, [favoriteData]);

  const toggleLike = async (problemId: string) => {
    try {
      const res = await toggleFavorite(problemId).unwrap();
      const isFav = res.data?.data?.isFavorited ?? res.data?.isFavorited ?? res.data?.isFavorite;
      toast.success(isFav ? "Added to favorite problems" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  // Chuyển đổi SolvedProblemItem sang Problem type để dùng chung ProblemsTable
  const solvedProblemsMapped = useMemo(() => {
    const items = solvedListResponse?.data?.items || [];
    return items.map((item) => ({
      id: item.problemId,
      slug: item.slug,
      title: item.title,
      difficulty: item.difficulty as any,
      acceptancePercent: item.acceptedSubmissionsCount > 0 ? 100 : 0, // Tạm thời vì SolvedItem ko có AP
      tags: [], // SolvedItem ko trả về tags, có thể FE tự xử lý nếu cần
    })) as unknown as Problem[];
  }, [solvedListResponse]);

  const solvedIds = useMemo(() => {
    return new Set<string>(solvedProblemsMapped.map(p => p.id));
  }, [solvedProblemsMapped]);

  // Lọc client-side cho search (nếu cần, hoặc chờ API hỗ trợ)
  const displayProblems = useMemo(() => {
    if (!searchQuery.trim()) return solvedProblemsMapped;
    return solvedProblemsMapped.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [solvedProblemsMapped, searchQuery]);

  const totalPages = solvedListResponse?.data?.totalCount
    ? Math.ceil(solvedListResponse.data.totalCount / PAGE_SIZE)
    : 1;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] flex items-center justify-center p-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black uppercase italic dark:text-white">Access Denied</h2>
          <p className="text-slate-500">Please login to view your solved problems.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans text-[#071739] dark:text-[#F9FAFB] flex relative transition-colors duration-500">
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-[#A4B5C4] dark:border-[#1C2737] bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ left: isSidebarOpen ? "244px" : "12px" }}
          className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-[#4B6382] dark:text-[#98A2B3] hover:text-[#071739] dark:hover:text-[#FFB800] transition-all duration-300 cursor-pointer hover:scale-110"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        <div className="overflow-y-auto custom-scrollbar dark:bg-[#101828]">
          <div className="max-w-[1400px] mx-auto p-8 lg:p-12 flex flex-col gap-8 items-start">

            <div className="w-full space-y-2">
              <h1 className="text-4xl font-black uppercase italic text-[#071739] dark:text-white tracking-tighter">
                Solved <span className="text-[#FF5C00]">Problems</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                Your journey of {solvedListResponse?.data?.totalCount || 0} conquered challenges
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <Input
                  placeholder="Search your solved problems..."
                  startContent={<Search size={18} className="text-gray-400 dark:text-[#667085]" />}
                  className="w-full md:w-[320px]"
                  classNames={{
                    inputWrapper: "bg-white dark:bg-[#1C2737] border-2 border-transparent focus-within:!border-[#FFB800] transition-all rounded-2xl h-12 shadow-sm",
                    input: "dark:text-white font-medium",
                  }}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />

                {/* SOURCE FILTER */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="bg-white dark:bg-[#1C2737] text-[#4B6382] dark:text-white rounded-2xl h-12 px-4 shadow-sm border border-transparent dark:border-[#344054]"
                      startContent={<Filter size={18} />}
                    >
                      {selectedSource === "All" ? "All Sources" :
                        selectedSource === "public" ? "Public Practice" :
                          selectedSource === "contest" ? "Contest" :
                            selectedSource === "bank" ? "Question Bank" : "Class"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter Source"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={new Set([selectedSource])}
                    onSelectionChange={(keys: any) => {
                      setSelectedSource(Array.from(keys)[0] as string);
                      setPage(1);
                    }}
                  >
                    <DropdownItem key="All">All Sources</DropdownItem>
                    <DropdownItem key="public">Public Practice</DropdownItem>
                    <DropdownItem key="contest">Contests</DropdownItem>
                    <DropdownItem key="bank">Question Bank</DropdownItem>
                    <DropdownItem key="class">Class Assignments</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                {/* VISIBILITY FILTER */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="bg-white dark:bg-[#1C2737] text-[#4B6382] dark:text-white rounded-2xl h-12 px-4 shadow-sm border border-transparent dark:border-[#344054]"
                      startContent={<Filter size={18} />}
                    >
                      {selectedVisibility === "All" ? "All Visibility" :
                        selectedVisibility === "public" ? "Public" : "Private"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter Visibility"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={new Set([selectedVisibility])}
                    onSelectionChange={(keys: any) => {
                      setSelectedVisibility(Array.from(keys)[0] as string);
                      setPage(1);
                    }}
                  >
                    <DropdownItem key="All">All Visibility</DropdownItem>
                    <DropdownItem key="public">Public</DropdownItem>
                    <DropdownItem key="private">Private</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                {/* DIFFICULTY FILTER */}
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="bg-white dark:bg-[#1C2737] text-[#4B6382] dark:text-white rounded-2xl h-12 px-4 shadow-sm border border-transparent dark:border-[#344054]"
                      startContent={<Filter size={18} />}
                    >
                      {selectedDifficulty === "All" ? "All Difficulty" :
                        selectedDifficulty === "Easy" ? "Easy" :
                          selectedDifficulty === "Medium" ? "Medium" : "Hard"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Filter Difficulty"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={new Set([selectedDifficulty])}
                    onSelectionChange={(keys: any) => {
                      setSelectedDifficulty(Array.from(keys)[0] as string);
                      setPage(1);
                    }}
                  >
                    <DropdownItem key="All">All Difficulty</DropdownItem>
                    <DropdownItem key="Easy" className="text-teal-500 font-bold">Easy</DropdownItem>
                    <DropdownItem key="Medium" className="text-orange-400 font-bold">Medium</DropdownItem>
                    <DropdownItem key="Hard" className="text-red-500 font-bold">Hard</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                {(searchQuery || selectedSource !== "All" || selectedVisibility !== "All" || selectedDifficulty !== "All") && (
                  <Button
                    variant="light"
                    color="danger"
                    onPress={() => {
                      setSearchQuery("");
                      setSelectedSource("All");
                      setSelectedVisibility("All");
                      setSelectedDifficulty("All");
                      setPage(1);
                    }}
                    startContent={<X size={16} />}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1C2737] w-full rounded-[2.5rem] shadow-xl border border-transparent dark:border-[#344054]/50 overflow-hidden transition-all duration-300 p-6 min-h-[500px]">
              {isLoadingSolved ? (
                <div className="w-full h-full flex items-center justify-center p-20">
                  <Spinner color="warning" label="Loading your achievements..." />
                </div>
              ) : displayProblems.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <ProblemsTable
                    problems={displayProblems}
                    likedProblems={likedProblems}
                    solvedProblems={solvedIds}
                    toggleLike={toggleLike}
                    page={page}
                    pageSize={PAGE_SIZE}
                  />
                  {totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                      <Pagination
                        isCompact
                        showControls
                        color="warning"
                        page={page}
                        total={totalPages}
                        onChange={setPage}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-20 text-gray-400 dark:text-[#98A2B3] gap-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center">
                    <Search size={32} className="opacity-20" />
                  </div>
                  <p className="font-medium italic">No solved problems found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
