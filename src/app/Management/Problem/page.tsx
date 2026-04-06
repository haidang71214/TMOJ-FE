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
} from "lucide-react";
import { useRouter } from "next/navigation";
import ArchiveProblemModal from "./../../components/ArchiveProblemModal";
import { useGetProblemListQueryQuery } from "@/store/queries/problem";
import { ErrorForm } from "@/types";

interface DisplayProblem {
  id: string;
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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // ── RTK Query ───────────────────────────────────────────────
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProblemListQueryQuery();

  // ── Modal Archive ───────────────────────────────────────────
  const archiveModal = useDisclosure();
  const [selectedProblem, setSelectedProblem] = useState<DisplayProblem | null>(null);

  const handleOpenArchive = (problem: DisplayProblem) => {
    setSelectedProblem(problem);
    archiveModal.onOpen();
  };

  // ── Transform API data → display format ─────────────────────
  const allProblems = useMemo<DisplayProblem[]>(() => {
    if (!apiResponse?.data) return [];

    return apiResponse.data.map((p) => ({
      id: p.id,
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

  const totalItems = allProblems.length;
  const pages = Math.ceil(totalItems / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return allProblems.slice(start, end);
  }, [page, allProblems]);

  // ── Loading / Error UI ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500">Đang tải danh sách bài tập...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8">
        <div className="text-red-500 text-2xl mb-4">Có lỗi xảy ra</div>
        <p className="text-slate-400 mb-6">
          {(error as ErrorForm)?.data?.data?.message || "Không thể tải danh sách bài tập"}
        </p>
        <Button color="primary" onPress={refetch}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            PROBLEM <span className="text-[#FF5C00]">REPOSITORY</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Manage and monitor system-wide programming problems
          </p>
        </div>
        <Button
          startContent={<Plus size={20} strokeWidth={3} />}
          onClick={() => router.push("/Management/Problem/create")}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          CREATE NEW PROBLEM
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search by title or ID..."
          startContent={<Search size={18} className="text-slate-400" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] transition-colors",
          }}
          className="max-w-xs font-medium"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-black text-[10px] uppercase tracking-widest px-5"
              startContent={<SortAsc size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Sort By
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Sort Options" className="font-bold uppercase text-[10px]">
            <DropdownItem key="newest">Latest ID</DropdownItem>
            <DropdownItem key="title">Title A-Z</DropdownItem>
            <DropdownItem key="ac">AC Rate</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Select
          placeholder="Difficulty"
          className="w-40"
          classNames={{
            trigger:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 border border-slate-200 dark:border-white/5 shadow-sm",
          }}
        >
          <SelectItem key="easy" className="font-bold uppercase text-[10px] text-emerald-500">
            Easy
          </SelectItem>
          <SelectItem key="medium" className="font-bold uppercase text-[10px] text-amber-500">
            Medium
          </SelectItem>
          <SelectItem key="hard" className="font-bold uppercase text-[10px] text-rose-500">
            Hard
          </SelectItem>
        </Select>

        {/* Các filter khác giữ nguyên, sau này connect với query params nếu cần */}

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-90 ml-auto"
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
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>PROBLEM TITLE</TableColumn>
            <TableColumn>TAGS</TableColumn>
            <TableColumn>DIFFICULTY</TableColumn>
            <TableColumn>SOURCE</TableColumn>
            <TableColumn>AC RATE</TableColumn>
            <TableColumn>VISIBLE</TableColumn>
            <TableColumn>ACCESS</TableColumn>
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Chưa có bài tập nào">
            {items.map((p) => (
              <TableRow
                key={p.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <span className="text-slate-400 font-black italic text-xs">#{p.id}</span>
                </TableCell>
                <TableCell>
                  <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                    {p.title}
                  </span>
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
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-black uppercase text-[9px] px-2 ${
                      p.difficulty === "EASY"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : p.difficulty === "MEDIUM"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-[10px] font-black uppercase ${
                      p.contest === "None" ? "text-slate-400 italic" : "text-blue-600 dark:text-[#FF5C00]"
                    }`}
                  >
                    {p.contest}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="text-emerald-500 font-black italic text-sm">{p.acRate}</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-tighter">
                      {p.submissions ?? "—"} Subs
                    </span>
                  </div>
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
                    {p.access ? "PUBLIC" : "DRAFT"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Tooltip content="Archive to Bookmark" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() => handleOpenArchive(p)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#FFB800] transition-all rounded-lg h-9 w-9"
                      >
                        <Archive size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Edit Detail" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() => router.push(`/Management/Problem/${p.id}/edit`)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Remix Problem" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() => router.push(`/Management/Problem/${p.id}/remix`)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Copy size={16} />
                      </Button>
                    </Tooltip>

                    <Dropdown placement="bottom-end" className="dark:bg-[#111c35] dark:border-white/10">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-500 transition-all rounded-lg h-9 w-9"
                        >
                          <Download size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Judging Operations" className="font-bold uppercase text-[10px]">
                        <DropdownItem key="dl-solution">Download Solution</DropdownItem>
                        <DropdownItem key="dl-testset">Download Testset</DropdownItem>
                        <DropdownItem key="ul-solution">Upload New Solution</DropdownItem>
                        <DropdownItem key="set-score" className="text-amber-500">Set Problem Score</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <Tooltip content="Delete" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all rounded-lg h-9 w-9"
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

        {totalItems > 0 && (
          <div className="flex w-full justify-center py-8">
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
        )}
      </div>

      <ArchiveProblemModal
        isOpen={archiveModal.isOpen}
        onOpenChange={archiveModal.onOpenChange}
        problem={selectedProblem}
      />
    </div>
  );
}