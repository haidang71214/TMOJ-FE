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
  Switch,
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
  Copy,
  Trash2,
  Search,
  Download,
  RefreshCw,
  SortAsc,
  ChevronDown,
  Archive,
  Tags,
  BookOpen,
  Code,
  Flame,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ArchiveProblemModal from "@/app/components/ArchiveProblemModal";
import AttachTagsModal from "@/app/components/AttachTagsModal";
import EditorialManagementModal from "@/app/components/EditorialManagementModal";
import { useGetProblemListQueryQuery, useUpdateProblemDifficultyMutation, useDownloadProblemStatementMutation } from "@/store/queries/problem";
import { ErrorForm } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface DisplayProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  submissions?: number;           // API chưa có → để tạm optional hoặc fake
  acRate: string;
  visible: boolean;
  access: boolean;                 // giả sử public nếu published
  contest: string;                 // tạm để "None" vì API chưa có
  tags: string[];                  // API chưa trả tags → để rỗng hoặc xử lý sau
}

export default function GlobalProblemListPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Tự động reset về trang 1 khi bộ lọc thay đổi
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, filterDifficulty, filterStatus]);

  // ── RTK Query ───────────────────────────────────────────────
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProblemListQueryQuery();
  console.log(apiResponse);
  const [updateDifficulty] = useUpdateProblemDifficultyMutation();

  const handleDifficultyChange = async (problemId: string, difficulty: string) => {
    try {
      await updateDifficulty({ problemId, difficulty }).unwrap();
      addToast({ title: t('common.success') || "Success", description: "Difficulty updated successfully", color: "success" });
      refetch();
    } catch (error: any) {
      console.error(error);
      const msg = error?.data?.message || "Failed to update difficulty";
      addToast({ title: "Update Failed", description: msg, color: "danger" });
    }
  };

  const [downloadStatement] = useDownloadProblemStatementMutation();

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
      console.error("Download statement error:", error);
      addToast({ title: "Download Failed", description: "Could not download statement", color: "danger" });
    }
  };

  // ── Modal Archive ───────────────────────────────────────────
  const archiveModal = useDisclosure();
  const [selectedProblem, setSelectedProblem] = useState<DisplayProblem | null>(null);

  const handleOpenArchive = (problem: DisplayProblem) => {
    setSelectedProblem(problem);
    archiveModal.onOpen();
  };

  // ── Modal Tags ──────────────────────────────────────────────
  const tagsModal = useDisclosure();
  const [selectedProblemForTags, setSelectedProblemForTags] = useState<DisplayProblem | null>(null);

  const handleOpenTags = (problem: DisplayProblem) => {
    setSelectedProblemForTags(problem);
    tagsModal.onOpen();
  };

  // ── Modal Editorial ────────────────────────────────────────
  const editorialModal = useDisclosure();
  const [selectedProblemForEditorial, setSelectedProblemForEditorial] = useState<DisplayProblem | null>(null);

  const handleOpenEditorial = (problem: DisplayProblem) => {
    setSelectedProblemForEditorial(problem);
    editorialModal.onOpen();
  };


  // ── Transform API data → display format ─────────────────────
  const allProblems = useMemo<DisplayProblem[]>(() => {
    if (!apiResponse?.data) return [];

    return apiResponse.data.map((p) => ({
      id: p.id,
      slug: p.slug || p.id.split("-")[0] || p.id,
      title: p.title,
      difficulty: p.difficulty?.toUpperCase() ?? "UNKNOWN",
      submissions: undefined, // API chưa có → có thể thêm field sau
      acRate: p.acceptancePercent != null ? `${p.acceptancePercent.toFixed(1)}%` : "—",
      visible: p.statusCode === "published",
      access: p.statusCode === "published", // giả sử published = public
      contest: "None", // field này chưa có trong API response
      tags: [], // API chưa trả tags → để sau khi có endpoint tag
    }));
  }, [apiResponse]);

  const filteredProblems = useMemo(() => {
    let filtered = [...allProblems];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(q)
      );
    }

    // Filter
    if (filterDifficulty && filterDifficulty !== "all") {
      filtered = filtered.filter((p) => p.difficulty?.toLowerCase() === filterDifficulty.toLowerCase());
    }

    if (filterStatus && filterStatus !== "all") {
      if (filterStatus === "published") {
        filtered = filtered.filter((p) => p.access);
      } else if (filterStatus === "draft") {
        filtered = filtered.filter((p) => !p.access);
      }
    }

    // Sort
    if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "ac") {
      filtered.sort((a, b) => {
        const acA = parseFloat(a.acRate) || 0;
        const acB = parseFloat(b.acRate) || 0;
        return acB - acA;
      });
    }
    // newest can just remain default

    return filtered;
  }, [allProblems, searchQuery, filterDifficulty, filterStatus, sortBy]);

  const totalItems = filteredProblems.length;
  const pages = Math.ceil(totalItems / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProblems.slice(start, end);
  }, [page, filteredProblems]);

  // ── Loading / Error UI ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500">{t('problem_management.loading') || "Loading problem list..."}</p>
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
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '100ms' }}>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            {t('problem_management.title1') || "PROBLEM"} <span className="text-[#FF5C00]">{t('problem_management.title2') || "REPOSITORY"}</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            {t('problem_management.subtitle') || "Manage and monitor system-wide programming problems"}
          </p>
        </div>
        <Button
          startContent={<Plus size={20} strokeWidth={3} />}
          onClick={() => router.push("/Management/Problem/create")}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '200ms' }}
        >
          {t('problem_management.create_button') || "CREATE NEW PROBLEM"}
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder={t('problem_management.search_placeholder') || "Search by problem title..."}
          startContent={<Search size={18} className="text-slate-400" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] transition-colors",
          }}
          className="max-w-xs font-medium animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '300ms' }}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-black text-[10px] uppercase tracking-widest px-5 active-press animate-fade-in-up"
              style={{ animationFillMode: 'both', animationDelay: '400ms' }}
              startContent={<SortAsc size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              {t('problem_management.sort_by') || "Sort By"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort Options"
            className="font-bold uppercase text-[10px]"
            selectionMode="single"
            selectedKeys={new Set([sortBy])}
            onSelectionChange={(keys) => setSortBy((Array.from(keys)[0] as string) || "newest")}
          >
            <DropdownItem key="newest">{t('problem_management.latest_id') || "Latest ID"}</DropdownItem>
            <DropdownItem key="title">{t('problem_management.title_az') || "Title A-Z"}</DropdownItem>
            <DropdownItem key="ac">{t('problem_management.ac_rate') || "AC Rate"}</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Select
          placeholder={t('problem_management.difficulty') || "Difficulty"}
          className="w-44 animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '500ms' }}
          classNames={{
            trigger:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 border border-slate-200 dark:border-white/5 shadow-sm",
          }}
          selectedKeys={new Set([filterDifficulty])}
          onSelectionChange={(keys) => setFilterDifficulty((Array.from(keys)[0] as string) || "all")}
        >
          <SelectItem key="all" className="font-bold uppercase text-[10px] text-slate-500">
            {t('problem_management.all_difficulties') || "All Difficulties"}
          </SelectItem>
          <SelectItem key="easy" className="font-bold uppercase text-[10px] text-emerald-500">
            {t('problem_management.easy') || "Easy"}
          </SelectItem>
          <SelectItem key="medium" className="font-bold uppercase text-[10px] text-amber-500">
            {t('problem_management.medium') || "Medium"}
          </SelectItem>
          <SelectItem key="hard" className="font-bold uppercase text-[10px] text-rose-500">
            {t('problem_management.hard') || "Hard"}
          </SelectItem>
        </Select>

        <Select
          placeholder="Status"
          className="w-44 animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '550ms' }}
          classNames={{
            trigger:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 border border-slate-200 dark:border-white/5 shadow-sm",
          }}
          selectedKeys={new Set([filterStatus])}
          onSelectionChange={(keys) => setFilterStatus((Array.from(keys)[0] as string) || "all")}
        >
          <SelectItem key="all" className="font-bold uppercase text-[10px] text-slate-500">
            All Status
          </SelectItem>
          <SelectItem key="draft" className="font-bold uppercase text-[10px]">
            Draft
          </SelectItem>
          <SelectItem key="published" className="font-bold uppercase text-[10px] text-blue-500">
            Published
          </SelectItem>
        </Select>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active-press ml-auto animate-fade-in-up"
          style={{ animationFillMode: 'both', animationDelay: '600ms' }}
          onPress={refetch}
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Problem Repository Table"
          removeWrapper
          onRowAction={(key) => router.push(`/Problems/${key}`)}
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
                  onChange={(p) => setPage(p)}
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
            <TableColumn>{t('problem_management.id') || "ID"}</TableColumn>
            <TableColumn>{t('problem_management.problem_title') || "PROBLEM TITLE"}</TableColumn>
            <TableColumn>{t('problem_management.tags') || "TAGS"}</TableColumn>
            <TableColumn>{t('problem_management.difficulty') || "DIFFICULTY"}</TableColumn>
            <TableColumn className="text-center">{t('problem_management.source') || "SOURCE"}</TableColumn>
            <TableColumn>{t('problem_management.visible') || "VISIBLE"}</TableColumn>
            <TableColumn>{t('problem_management.access') || "ACCESS"}</TableColumn>
            <TableColumn className="text-right">{t('problem_management.operations') || "OPERATIONS"}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t('problem_management.empty_state') || "Chưa có bài tập nào"}>
            {items.map((p, index) => (
              <TableRow
                key={p.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors active-press animate-fade-in-right cursor-pointer"
                style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50}ms` }}
              >
                <TableCell>
                  <span className="text-slate-400 font-black italic text-xs">#{index}</span>
                </TableCell>
                <TableCell>
                  <div className="w-[60px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[220px] truncate" title={p.title}>
                    <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                      {p.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.length === 0 ? (
                      <span className="text-[8px] text-slate-400 italic">—</span>
                    ) : (
                      p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md tracking-tighter border border-slate-200/50 dark:border-white/5"
                        >
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Chip
                        variant="flat"
                        size="sm"
                        className={`cursor-pointer font-black uppercase text-[9px] px-2 hover:opacity-80 transition-opacity ${p.difficulty === "EASY"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : p.difficulty === "MEDIUM"
                            ? "bg-amber-500/10 text-amber-500"
                            : p.difficulty === "HARD"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-default/10 text-default-500"
                          }`}
                      >
                        {p.difficulty === "EASY" ? (t('problem_management.easy') || "EASY") :
                          p.difficulty === "MEDIUM" ? (t('problem_management.medium') || "MEDIUM") :
                            p.difficulty === "HARD" ? (t('problem_management.hard') || "HARD") :
                              p.difficulty}
                      </Chip>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Change Difficulty"
                      onAction={(key) => handleDifficultyChange(p.id, String(key))}
                      className="font-bold text-[10px] uppercase tracking-wider"
                    >
                      <DropdownItem key="Easy" className="text-emerald-500">{t('problem_management.easy') || "Easy"}</DropdownItem>
                      <DropdownItem key="Medium" className="text-amber-500">{t('problem_management.medium') || "Medium"}</DropdownItem>
                      <DropdownItem key="Hard" className="text-rose-500">{t('problem_management.hard') || "Hard"}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
                <TableCell>
                  <Tooltip content={t('problem_management.dl_statement') || "Download Statement"} className="font-bold text-[10px]">
                    <span
                      onClick={(e) => { e.stopPropagation(); handleDownloadStatement(p.id, p.slug); }}
                      className="flex items-center justify-center gap-1.5 w-fit mx-auto cursor-pointer text-slate-400 hover:text-emerald-500 transition-colors group"
                    >
                      <Download size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
                      <span className="text-[9px] font-black uppercase tracking-wider">PDF</span>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Switch
                    isSelected={p.visible}
                    size="sm"
                    isReadOnly // nếu chưa có API toggle thì để read-only
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md tracking-tighter border border-slate-200/50 dark:border-white/5">
                    {p.access ? (t('common.public') || "PUBLIC") : (t('common.draft') || "DRAFT")}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Tooltip content={t('problem_management.attach_tags') || "Manage Tags"} className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={(e) => { e.stopPropagation(); handleOpenTags(p); }}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-[#22C55E] transition-all rounded-lg h-9 w-9 active-bump"
                      >
                        <Tags size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Editorial Management" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={(e) => { e.stopPropagation(); handleOpenEditorial(p); }}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-amber-500 transition-all rounded-lg h-9 w-9 active-bump"
                      >
                        <BookOpen size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content={t('common.archive') || "Archive to Bookmark"} className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={(e) => { e.stopPropagation(); handleOpenArchive(p); }}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#FFB800] transition-all rounded-lg h-9 w-9 active-bump"
                      >
                        <Archive size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content={t('common.edit') || "Edit Detail"} className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={(e) => { e.stopPropagation(); router.push(`/Management/Problem/${p.id}/edit`); }}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9 active-bump"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Remix Problem" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={(e) => { e.stopPropagation(); router.push(`/Management/Problem/${p.id}/remix`); }}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9 active-bump"
                      >
                        <Flame size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Problem Template" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={(e) => { e.stopPropagation(); router.push(`/Management/Problem/${p.id}/Template`); }}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9 active-bump"
                      >
                        <Code size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content={t('common.delete') || "Delete"} className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all rounded-lg h-9 w-9 active-bump"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ArchiveProblemModal
        isOpen={archiveModal.isOpen}
        onOpenChange={archiveModal.onOpenChange}
        problem={selectedProblem}
      />

      <AttachTagsModal
        isOpen={tagsModal.isOpen}
        onOpenChange={tagsModal.onOpenChange}
        problem={selectedProblemForTags}
      />

      <EditorialManagementModal
        isOpen={editorialModal.isOpen}
        onOpenChange={editorialModal.onOpenChange}
        problemId={selectedProblemForEditorial?.id}
        problemTitle={selectedProblemForEditorial?.title}
      />
    </div>
  );
}