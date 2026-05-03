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
  Tooltip,
  Input,
  Select,
  SelectItem,
  Chip,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Spinner,
  addToast,
} from "@heroui/react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  SortAsc,
  ChevronDown,
  Tags,
  Download,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AttachTagsModal from "@/app/components/AttachTagsModal";
import { 
  useGetInPlanProblemListQuery, 
  useUpdateProblemDifficultyMutation, 
  useDownloadProblemStatementMutation, 
  useDownloadTestsetZipMutation 
} from "@/store/queries/problem";
import { ErrorForm } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface DisplayProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  visible: boolean;
  problemMode: string;
  scoringCode: string;
  primaryTestsetId: string;
  tags: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  }[];
}

export default function InPlanProblemListPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetInPlanProblemListQuery({
    page,
    pageSize,
    search: searchQuery,
    difficulty: filterDifficulty === "all" ? "" : filterDifficulty,
  });

  const [updateDifficulty] = useUpdateProblemDifficultyMutation();

  const handleDifficultyChange = async (problemId: string, difficulty: string) => {
    try {
      await updateDifficulty({ problemId, difficulty }).unwrap();
      addToast({ title: t('common.success') || "Success", description: "Difficulty updated successfully", color: "success" });
      refetch();
    } catch (error) {
      const apiError = error as ErrorForm;
      const msg = apiError?.data?.data?.message || "Failed to update difficulty";
      addToast({ title: "Update Failed", description: msg, color: "danger" });
    }
  };

  const tagsModal = useDisclosure();
  const [selectedProblemForTags, setSelectedProblemForTags] = useState<DisplayProblem | null>(null);

  const handleOpenTags = (problem: DisplayProblem) => {
    setSelectedProblemForTags(problem);
    tagsModal.onOpen();
  };

  const [downloadStatement] = useDownloadProblemStatementMutation();
  const [downloadTestsetZip] = useDownloadTestsetZipMutation();

  const handleDownloadStatement = async (problemId: string, slug: string) => {
    try {
      const blob = await downloadStatement(problemId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const extension = blob.type === "application/pdf" ? "pdf" : "md";
      const a = document.createElement("a");
      a.href = url;
      a.download = `statement_${slug}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast({ title: t('common.success') || "Success", description: "Statement downloaded successfully", color: "success" });
    } catch (error) {
      const err = error as ErrorForm;
      addToast({ title: "Download Failed", description: err?.data?.data?.message || "Could not download statement", color: "danger" });
    }
  };

  const handleDownloadTestsetZip = async (problemId: string, testsetId: string, slug: string) => {
    if (!testsetId) {
      addToast({ title: "Error", description: "No primary testset found", color: "danger" });
      return;
    }
    try {
      const blob = await downloadTestsetZip({ problemId, testsetId }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `testset_${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast({ title: t('common.success') || "Success", description: "Testset ZIP downloaded successfully", color: "success" });
    } catch (error) {
      const err = error as ErrorForm;
      addToast({ title: "Download Failed", description: err?.data?.data?.message || "Could not download testset zip", color: "danger" });
    }
  };

  const items = useMemo<DisplayProblem[]>(() => {
    const rawItems = apiResponse?.data || [];

    return rawItems.map((p) => ({
      id: p.id,
      slug: p.slug || p.id.split("-")[0] || p.id,
      title: p.title,
      difficulty: p.difficulty?.toUpperCase() ?? "UNKNOWN",
      visible: p.statusCode === "published",
      problemMode: p.problemMode,
      scoringCode: p.scoringCode,
      primaryTestsetId: p.primaryTestsetId,
      tags: p.tags || [],
    }));
  }, [apiResponse]);

  const totalPages = apiResponse?.pagination?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500">{t('problem_management.loading') || "Loading in-plan problems..."}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8">
        <div className="text-red-500 text-2xl mb-4">{t('common.error') || "Có lỗi xảy ra"}</div>
        <p className="text-slate-400 mb-6">
          {(error as ErrorForm)?.data?.data?.message || t('problem_management.error_loading') || "Failed to load"}
        </p>
        <Button color="primary" onPress={refetch}>
          {t('common.retry') || "Thử lại"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '100ms' }}>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            IN-PLAN <span className="text-[#FF5C00]">PROBLEMS</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Manage problems that are assigned to Study Plans
          </p>
        </div>
        <Button
          startContent={<Plus size={20} strokeWidth={3} />}
          onClick={() => router.push("/Management/StudyPlan/CreateProblem")}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '200ms' }}
        >
          CREATE IN-PLAN PROBLEM
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search by title..."
          startContent={<Search size={18} className="text-slate-400" />}
          classNames={{
            inputWrapper: "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5",
          }}
          className="max-w-xs font-medium animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '300ms' }}
          value={searchQuery}
          onValueChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
        />

        <Select
          placeholder="Difficulty"
          className="w-44 animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '500ms' }}
          classNames={{
            trigger: "bg-white dark:bg-[#111c35] rounded-xl h-12 border border-slate-200 dark:border-white/5",
          }}
          selectedKeys={new Set([filterDifficulty || "all"])}
          onSelectionChange={(keys) => {
            setFilterDifficulty((Array.from(keys)[0] as string) || "");
            setPage(1);
          }}
        >
          <SelectItem key="all" className="font-bold uppercase text-[10px]">All Difficulties</SelectItem>
          <SelectItem key="easy" className="font-bold uppercase text-[10px] text-emerald-500">Easy</SelectItem>
          <SelectItem key="medium" className="font-bold uppercase text-[10px] text-amber-500">Medium</SelectItem>
          <SelectItem key="hard" className="font-bold uppercase text-[10px] text-rose-500">Hard</SelectItem>
        </Select>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 ml-auto animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '600ms' }}
          onPress={refetch}
          isLoading={isFetching}
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#111c35] rounded-[2.5rem] shadow-sm border border-transparent dark:border-[#334155]/50 overflow-hidden animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
        <div className="flex items-center px-6 py-4 bg-slate-50 dark:bg-[#0D1B2A] border-b border-slate-100 dark:border-[#334155]/50 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 opacity-60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-60"></div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 italic">
              Study Plan Inventory v1.0
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 z-10 flex items-center justify-center">
              <Spinner color="primary" />
            </div>
          )}
          <Table
            aria-label="In-Plan Problem Table"
            removeWrapper
            bottomContent={
              totalPages > 1 ? (
                <div className="flex w-full justify-center py-4">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={(p) => setPage(p)}
                    classNames={{
                      cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-bold italic shadow-lg",
                    }}
                  />
                </div>
              ) : null
            }
            classNames={{
              base: "p-4",
              th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
              td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
            }}
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>PROBLEM TITLE</TableColumn>
              <TableColumn>TAGS</TableColumn>
              <TableColumn>DIFFICULTY</TableColumn>
              <TableColumn>MODE</TableColumn>
              <TableColumn>SCORING</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn className="text-right">OPERATIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No in-plan problems found.">
              {items.map((p, index) => (
                <TableRow
                  key={p.id}
                  className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors animate-fade-in-right cursor-pointer"
                  style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50}ms` }}
                  onClick={() => router.push(`/Problems/${p.id}`)}
                >
                  <TableCell>
                    <span className="text-slate-400 font-black italic text-xs">#{(page-1)*pageSize + index + 1}</span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={p.title}>
                      <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                        {p.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.length > 0 ? (
                        p.tags.map(tag => (
                          <span
                            key={tag.id}
                            className="relative flex items-center justify-center bg-slate-100 dark:bg-white/10 text-[10px] font-medium px-2 py-0.5 rounded shadow-sm shrink-0 group/tag hover:bg-slate-200 dark:hover:bg-white/20 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-white/20"
                            style={{ color: tag.color || "inherit" }}
                            title={tag.name}
                          >
                            <span>{tag.name}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-[8px] text-slate-400 italic font-black uppercase tracking-widest block">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Chip
                          variant="flat"
                          size="sm"
                          className={`cursor-pointer font-black uppercase text-[9px] px-2 ${
                            p.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-500" :
                            p.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-500" :
                            p.difficulty === "HARD" ? "bg-rose-500/10 text-rose-500" :
                            "bg-default/10 text-default-500"
                          }`}
                        >
                          {p.difficulty}
                        </Chip>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Change Difficulty"
                        onAction={(key) => handleDifficultyChange(p.id, String(key))}
                        className="font-bold text-[10px] uppercase tracking-wider"
                      >
                        <DropdownItem key="Easy" className="text-emerald-500">Easy</DropdownItem>
                        <DropdownItem key="Medium" className="text-amber-500">Medium</DropdownItem>
                        <DropdownItem key="Hard" className="text-rose-500">Hard</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="font-black uppercase text-[8px] bg-purple-500/10 text-purple-600"
                    >
                      {p.problemMode}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="dot"
                      color={p.scoringCode === "acm" ? "success" : "warning"}
                      className="font-black uppercase text-[8px]"
                    >
                      {p.scoringCode}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      size="sm"
                      className={`font-black uppercase text-[8px] ${p.visible ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
                    >
                      {p.visible ? "PUBLISHED" : "DRAFT"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Tooltip content="Manage Tags" className="font-bold text-[10px]">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={(e) => { e.stopPropagation(); handleOpenTags(p); }}
                          className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-[#22C55E] rounded-lg h-9 w-9"
                        >
                          <Tags size={16} />
                        </Button>
                      </Tooltip>

                      <Tooltip content="Download Statement (PDF/MD)" className="font-bold text-[10px]">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={(e) => { e.stopPropagation(); handleDownloadStatement(p.id, p.slug); }}
                          className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-500 rounded-lg h-9 w-9"
                        >
                          <Download size={16} />
                        </Button>
                      </Tooltip>

                      {p.primaryTestsetId && (
                        <Tooltip content="Download Testset ZIP" className="font-bold text-[10px]">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onClick={(e) => { e.stopPropagation(); handleDownloadTestsetZip(p.id, p.primaryTestsetId, p.slug); }}
                            className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-500 rounded-lg h-9 w-9"
                          >
                            <div className="relative">
                              <Download size={16} />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-[#111c35]"></div>
                            </div>
                          </Button>
                        </Tooltip>
                      )}

                      <Tooltip content="Edit Detail" className="font-bold text-[10px]">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={(e) => { e.stopPropagation(); router.push(`/Management/Problem/${p.id}/edit?source=in-plan`); }}
                          className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 rounded-lg h-9 w-9"
                        >
                          <Edit size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AttachTagsModal
        isOpen={tagsModal.isOpen}
        onOpenChange={tagsModal.onOpenChange}
        problem={selectedProblemForTags ? {
          ...selectedProblemForTags,
          tags: selectedProblemForTags.tags.map(t => t.name)
        } : null}
      />
    </div>
  );
}
