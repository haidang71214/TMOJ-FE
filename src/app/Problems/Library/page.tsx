"use client";
import "./hehe.css";
import React, { useState, useMemo } from "react";
import Sidebar from "../Sidebar";
import { QuestBanners } from "./QuestBanners";

import { ProblemsTable } from "./ProblemsTable";
import { CalendarSidebar } from "./CalendarSidebar";
import { Input, Button, Progress, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useGetProblemListPublicQuery } from "@/store/queries/ProblemPublic";
import { Pagination } from "@heroui/react";
import { useGetFavoriteProblemsQuery, useToggleProblemFavoriteMutation } from "@/store/queries/favorites";
import { useGetTagsQuery } from "@/store/queries/Tags";
import { toast } from "sonner";

export default function LibraryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  // API cho Like (trái tim)
  const { data: favoriteData } = useGetFavoriteProblemsQuery({ page: 1, pageSize: 1000 });
  const [toggleFavorite] = useToggleProblemFavoriteMutation();

  // API cho Tags
  const { data: tags } = useGetTagsQuery();

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

  const [page, setPage] = useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedDifficulty, selectedTagId]);

  const [sortBy, setSortBy] = useState<string>("title");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const PAGE_SIZE = 10;

  // When tag filtering client-side, fetch all data at once; otherwise use server pagination
  const { data: problemResponse, isLoading } = useGetProblemListPublicQuery({
    page: selectedTagId ? 1 : page,
    pageSize: selectedTagId ? 1000 : PAGE_SIZE,
    search: searchQuery.trim() !== "" ? searchQuery.trim() : undefined,
    difficulty: selectedDifficulty,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  const rawProblems = problemResponse?.data || [];
  const serverTotalPages = problemResponse?.pagination?.totalPages || 1;
  const totalCount = problemResponse?.pagination?.totalCount || 0;

  // Filter + sort, then paginate client-side when tag filter is active
  const filteredProblems = useMemo(() => {
    let result = [...rawProblems];

    // Client-side tag filtering: filter by checking nested tags array
    if (selectedTagId) {
      result = result.filter((p) =>
        (p as any).tags?.some((t: { id: string }) => t.id === selectedTagId)
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) => sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    } else if (sortBy === "acceptancePercent") {
      result.sort((a, b) => {
        const valA = a.acceptancePercent || 0;
        const valB = b.acceptancePercent || 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      });
    } else if (sortBy === "createdAt") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    return result;
  }, [rawProblems, sortBy, sortOrder, selectedTagId]);

  // Effective pagination values
  const totalPages = selectedTagId
    ? Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE))
    : serverTotalPages;

  // Current page items
  const problems = selectedTagId
    ? filteredProblems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filteredProblems;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("All");
    setSelectedTagId(null);
    setSortBy("title");
    setSortOrder("asc");
  };

  const hasActiveFilters = searchQuery !== "" || selectedDifficulty !== "All" || selectedTagId !== null || sortBy !== "title" || sortOrder !== "asc";

  const getSortLabel = () => {
    if (sortBy === "title") return sortOrder === "asc" ? "Title (A-Z)" : "Title (Z-A)";
    if (sortBy === "acceptancePercent") return "AC Rate";
    return "Sort";
  };

  return (
    <div className="min-h-screen bg-[#CDD5DB] dark:bg-[#101828] font-sans text-[#071739] dark:text-[#F9FAFB] flex relative transition-colors duration-500 ">
      {/* SIDEBAR TRÁI */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-[#A4B5C4] dark:border-[#1C2737] bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden flex-shrink-0 z-40 shadow-xl
          ${isSidebarOpen ? "w-[260px]" : "w-0 border-none"}`}
      >
        <div className="w-[260px] p-6 pr-2">
          <Sidebar />
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* NÚT TOGGLE SIDEBAR */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ left: isSidebarOpen ? "244px" : "12px" }}
          className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-[#A4B5C4] dark:border-[#344054] rounded-full flex items-center justify-center shadow-lg text-[#4B6382] dark:text-[#98A2B3] hover:text-[#071739] dark:hover:text-[#FFB800] transition-all duration-300 cursor-pointer hover:scale-110"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        <div className="overflow-y-auto custom-scrollbar dark:bg-[#101828]">
          <div className="max-w-[1400px] mx-auto p-8 lg:p-12 flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 flex flex-col gap-8 w-full min-w-0">
              <QuestBanners />

              {/* TOPIC BUTTONS */}
              <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
                <Button
                  size="sm"
                  onPress={() => setSelectedTagId(null)}
                  className={`text-[12px] rounded-xl h-10 px-5 font-black uppercase tracking-widest transition-all ${selectedTagId === null
                    ? "bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#101828] shadow-lg shadow-[#FFB800]/20"
                    : "bg-white dark:bg-[#1C2737] text-gray-500 dark:text-[#98A2B3] hover:bg-gray-100 dark:hover:bg-[#344054] hover:text-[#071739] dark:hover:text-white border border-transparent dark:border-[#344054]/50"
                    }`}
                >
                  All Topics
                </Button>
                {tags?.map((tag) => (
                  <Button
                    key={tag.id}
                    size="sm"
                    onPress={() => setSelectedTagId(tag.id)}
                    className={`text-[12px] rounded-xl h-10 px-5 font-black uppercase tracking-widest transition-all ${selectedTagId === tag.id
                      ? "bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#101828] shadow-lg shadow-[#FFB800]/20"
                      : "bg-white dark:bg-[#1C2737] text-gray-500 dark:text-[#98A2B3] hover:bg-gray-100 dark:hover:bg-[#344054] hover:text-[#071739] dark:hover:text-white border border-transparent dark:border-[#344054]/50"
                      }`}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>

              {/* FILTER & SEARCH ROW */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <Input
                    placeholder="Search questions..."
                    startContent={<Search size={18} className="text-gray-400 dark:text-[#667085]" />}
                    className="w-full md:w-[320px]"
                    classNames={{
                      inputWrapper:
                        "bg-white dark:bg-[#1C2737] border-2 border-transparent focus-within:!border-[#FFB800] transition-all rounded-2xl h-12 shadow-sm",
                      input: "dark:text-white font-medium",
                    }}
                    variant="flat"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />

                  {/* DIFFICULTY DROPDOWN */}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className="bg-white dark:bg-[#1C2737] text-[#4B6382] dark:text-white rounded-2xl h-12 px-4 shadow-sm border border-transparent dark:border-[#344054]"
                        startContent={<Filter size={18} />}
                      >
                        {selectedDifficulty === "All" ? "Difficulty" : (selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1))}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Filter Difficulty"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={new Set([selectedDifficulty])}
                      onSelectionChange={(keys: any) => setSelectedDifficulty(Array.from(keys)[0] as string)}
                    >
                      <DropdownItem key="All">All Difficulties</DropdownItem>
                      <DropdownItem key="easy" className="text-green-500 font-bold">Easy</DropdownItem>
                      <DropdownItem key="medium" className="text-yellow-500 font-bold">Medium</DropdownItem>
                      <DropdownItem key="hard" className="text-red-500 font-bold">Hard</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className="bg-white dark:bg-[#1C2737] font-black uppercase text-[10px] tracking-widest text-[#4B6382] dark:text-white px-6 rounded-2xl h-12 shadow-sm border border-transparent dark:border-[#344054]"
                        startContent={<ArrowUpDown size={16} />}
                      >
                        {getSortLabel()}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Sort options"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      onAction={(key) => {
                        const k = String(key);
                        if (k === "title_az") { setSortBy("title"); setSortOrder("asc"); }
                        else if (k === "title_za") { setSortBy("title"); setSortOrder("desc"); }
                        else if (k === "ac_rate") { setSortBy("acceptancePercent"); setSortOrder("desc"); }
                      }}
                    >
                      <DropdownItem key="title_az">Title (A-Z)</DropdownItem>
                      <DropdownItem key="title_za">Title (Z-A)</DropdownItem>
                      <DropdownItem key="ac_rate">AC Rate</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  {hasActiveFilters && (
                    <Button
                      variant="light"
                      color="danger"
                      className="font-black uppercase text-[10px] tracking-widest px-4 rounded-2xl h-12"
                      onPress={resetFilters}
                      startContent={<X size={16} />}
                    >
                      Reset
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-white/40 dark:bg-[#1C2737]/30 p-4 rounded-2xl border border-[#A4B5C4]/10">
                  <div className="flex flex-col items-end w-40 text-right">
                    <span className="text-[10px] font-black text-[#4B6382] dark:text-[#FFB800] uppercase tracking-widest leading-none mb-2">
                      0 / {totalCount} Solved
                    </span>
                    <Progress
                      aria-label="Solved progress"
                      size="sm"
                      value={0}
                      classNames={{
                        indicator: "bg-green-500 dark:bg-[#FFB800]",
                        track: "bg-gray-200 dark:bg-[#101828]",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* TABLE AREA */}
              <div className="bg-white dark:bg-[#1C2737] rounded-[2.5rem] shadow-xl border border-transparent dark:border-[#344054]/50 overflow-hidden transition-all duration-300 p-4 min-h-[400px]">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center p-20 text-gray-400 dark:text-[#98A2B3] font-medium animate-pulse">
                    Loading problems...
                  </div>
                ) : problems.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <ProblemsTable
                      key={`${searchQuery}-${selectedDifficulty}-${selectedTagId}`}
                      problems={problems}
                      likedProblems={likedProblems}
                      toggleLike={toggleLike}
                      page={page}
                      pageSize={10}
                    />
                    {totalPages > 1 && (
                      <div className="flex justify-center pb-2">
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
                  <div className="w-full h-full flex items-center justify-center p-20 text-gray-400 dark:text-[#98A2B3] font-medium flex-col gap-2">
                    <p>No problems found.</p>
                    {hasActiveFilters && (
                      <Button size="sm" variant="flat" color="warning" onPress={resetFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR PHẢI */}
            <div className="sticky top-10 flex flex-col gap-6">
              <CalendarSidebar />
              <div className="flex justify-center opacity-20 italic font-black uppercase text-[10px] tracking-[0.5em] dark:text-white mt-4">
                TMOJ &bull; 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
