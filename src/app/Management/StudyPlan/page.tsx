"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Chip,
} from "@heroui/react";
import {
  Plus,
  Search,
  RefreshCw,
  SortAsc,
  ChevronDown,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";
import CreateStudyPlanModal from "./CreateStudyPlanModal";

import { useTranslation } from "@/hooks/useTranslation";
import { useGetStudyPlansQuery } from "@/store/queries/StudyPlan";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { ErrorForm } from "@/types";

interface StudyPlan {
  id: string;
  title: string;
  order: number;
  problemCount: number;
  price: number;
  isPaid: boolean;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export default function StudyPlanListPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: user } = useGetUserInformationQuery();

  // RTK Query
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStudyPlansQuery(
    user?.userId ? { creatorId: user.userId } : undefined,
    { skip: !user?.userId }
  );
  console.log(apiResponse);
  // ── Transform API data ─────────────────────────────────────
  const allStudyPlans = useMemo<StudyPlan[]>(() => {
    if (!apiResponse?.data) return [];
    return apiResponse.data.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      order: plan.order || 0,
      problemCount: plan.problemCount || 0,
      price: plan.price || 0,
      isPaid: !!plan.isPaid,
      isCompleted: !!plan.isCompleted,
      isUnlocked: !!plan.isUnlocked,
    }));
  }, [apiResponse]);

  const filteredStudyPlans = useMemo(() => {
    let filtered = [...allStudyPlans];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.order - b.order);
    }
    // newest giữ nguyên thứ tự API trả về (thường là mới nhất trước)

    return filtered;
  }, [allStudyPlans, searchQuery, sortBy]);

  const totalItems = filteredStudyPlans.length;
  const pages = Math.ceil(totalItems / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStudyPlans.slice(start, end);
  }, [page, filteredStudyPlans]);

  // ── Create Problem in Study Package ───────────────────────
  const handleCreateProblemInPlan = (studyPlanId: string) => {
    if (studyPlanId) {
      router.push(`/Management/StudyPlan/CreateProblem?studyPlanId=${studyPlanId}`);
    } else {
      router.push("/Management/StudyPlan/CreateProblem");
    }
  };

  // ── Loading / Error ───────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-fade-in-up">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500 font-medium">
          {t('common.loading') || (language === 'vi' ? "Đang tải danh sách Study Plan..." : "Loading Study Plan list...")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8 animate-fade-in-up">
        <div className="text-red-500 text-2xl font-black italic mb-4">
          {t('common.error') || (language === 'vi' ? "Có lỗi xảy ra" : "An error occurred")}
        </div>
        <p className="text-slate-400 mb-6 font-medium">
          {(error as ErrorForm)?.data?.data?.message || (t('studyPlan.loadFail') || (language === 'vi' ? "Không thể tải danh sách Study Plan" : "Failed to load Study Plan list"))}
        </p>
        <Button color="primary" onPress={refetch} className="font-bold">
          {t('common.retry') || (language === 'vi' ? "Thử lại" : "Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: "100ms" }}>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            {language === 'vi' ? (
              <>LỘ TRÌNH <span className="text-[#FF5C00]">HỌC TẬP</span></>
            ) : (
              <>STUDY <span className="text-[#FF5C00]">PLAN</span></>
            )}
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            {t('studyPlan.subtitle') || (language === 'vi' ? "Quản lý các gói bài tập / Study Package" : "Manage Study Packages")}
          </p>
        </div>

        <div className="flex gap-3">
          {/* Nút Create Study Plan (nếu cần) */}
          <Button
            startContent={<Plus size={20} strokeWidth={3} />}
            onPress={onOpen}
            className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump hover:scale-105 active:scale-95 animate-fade-in-up"
            style={{ animationFillMode: "both", animationDelay: "200ms" }}
          >
            {t('studyPlan.createNew') || (language === 'vi' ? "TẠO LỘ TRÌNH MỚI" : "CREATE NEW STUDY PLAN")}
          </Button>

          {/* Nút Create Problem Study Package */}
          <Button
            startContent={<BookOpen size={20} strokeWidth={3} />}
            onClick={() => {
              handleCreateProblemInPlan(""); // truyền id plan nếu có
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump hover:scale-105 active:scale-95 animate-fade-in-up"
            style={{ animationFillMode: "both", animationDelay: "250ms" }}
          >
            {t('studyPlan.createProblemPackage') || (language === 'vi' ? "TẠO BÀI TẬP VÀO LỘ TRÌNH" : "CREATE PROBLEM STUDY PACKAGE")}
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 shrink-0 mt-2">
        <Input
          placeholder={t('studyPlan.searchPlaceholder') || (language === 'vi' ? "Tìm kiếm theo tiêu đề..." : "Search by title...")}
          startContent={<Search size={18} className="text-slate-400" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E]",
          }}
          className="max-w-xs font-medium animate-fade-in-up"
          style={{ animationFillMode: "both", animationDelay: "300ms" }}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-black text-[10px] uppercase tracking-widest px-5 active-press transition-all hover:scale-105 active:scale-95 animate-fade-in-up"
              style={{ animationFillMode: "both", animationDelay: "400ms" }}
              startContent={<SortAsc size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              {t('common.sortBy') || (language === 'vi' ? "Sắp xếp" : "Sort By")}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort Options"
            className="font-bold uppercase text-[10px]"
            selectionMode="single"
            selectedKeys={new Set([sortBy])}
            onSelectionChange={(keys) => setSortBy((Array.from(keys)[0] as string) || "newest")}
          >
            <DropdownItem key="newest">{t('common.newest') || (language === 'vi' ? "Mới nhất" : "Newest")}</DropdownItem>
            <DropdownItem key="title">{t('common.titleAZ') || (language === 'vi' ? "Tiêu đề A-Z" : "Title A-Z")}</DropdownItem>
            <DropdownItem key="oldest">{t('common.oldest') || (language === 'vi' ? "Cũ nhất" : "Oldest")}</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active-press ml-auto animate-fade-in-up"
          style={{ animationFillMode: "both", animationDelay: "600ms" }}
          onPress={refetch}
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Study Plan Table"
          removeWrapper
          bottomContent={
            totalItems > 0 ? (
              <div className="flex w-full justify-center py-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                  classNames={{
                    cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-bold italic shadow-lg",
                  }}
                />
              </div>
            ) : null
          }
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>{t('studyPlan.title') || (language === 'vi' ? "TIÊU ĐỀ LỘ TRÌNH" : "STUDY PLAN TITLE")}</TableColumn>
            <TableColumn>{t('studyPlan.order') || (language === 'vi' ? "THỨ TỰ" : "ORDER")}</TableColumn>
            <TableColumn>{t('studyPlan.problemCount') || (language === 'vi' ? "SỐ LƯỢNG BÀI" : "PROBLEM COUNT")}</TableColumn>
            <TableColumn>{t('studyPlan.price') || (language === 'vi' ? "GIÁ (COIN)" : "PRICE (COIN)")}</TableColumn>
            <TableColumn>{t('common.status') || (language === 'vi' ? "TRẠNG THÁI" : "STATUS")}</TableColumn>
            <TableColumn className="text-right">{t('common.actions') || (language === 'vi' ? "THAO TÁC" : "ACTIONS")}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t('studyPlan.emptyContent') || (language === 'vi' ? "Chưa có Study Plan nào" : "No Study Plans found")}>
            {items.map((plan, index) => (
              <TableRow
                key={plan.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors active-press animate-fade-in-right cursor-pointer"
                style={{ animationFillMode: "both", animationDelay: `${200 + index * 50}ms` }}
                onClick={() => router.push(`/Management/StudyPlan/${plan.id}`)}
              >
                <TableCell>
                  <span className="text-slate-400 font-black italic text-xs">#{index + 1}</span>
                </TableCell>
                <TableCell>
                  <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E]">
                    {plan.title}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 dark:text-slate-400">
                  {plan.order}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-slate-500">{plan.problemCount} Problems</span>
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-bold ${plan.isPaid ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {plan.isPaid ? `${plan.price} Coins` : (language === 'vi' ? 'Miễn phí' : 'Free')}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-black uppercase text-[9px] ${
                      plan.isUnlocked
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {plan.isUnlocked 
                      ? (t('common.unlocked') || (language === 'vi' ? "ĐÃ MỞ KHÓA" : "UNLOCKED")) 
                      : (t('common.locked') || (language === 'vi' ? "ĐÃ KHÓA" : "LOCKED"))}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/Management/StudyPlan/${plan.id}/edit`);
                      }}
                      className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] h-9 w-9"
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateProblemInPlan(plan.id); // Tạo problem trong plan này
                      }}
                      className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-500 h-9 w-9"
                    >
                      <Plus size={16} />
                    </Button>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 h-9 w-9"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CreateStudyPlanModal isOpen={isOpen} onOpenChange={onOpenChange} onSuccess={refetch} />
    </div>
  );
}