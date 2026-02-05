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
} from "@heroui/react";
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  SortAsc,
  ChevronDown,
  Tag,
  Archive,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ArchiveProblemModal from "./../../components/ArchiveProblemModal";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  submissions: number;
  acRate: string;
  visible: boolean;
  contest: string;
  tags: string[];
}

export default function GlobalProblemListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Logic Modal Archive
  const archiveModal = useDisclosure();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const handleOpenArchive = (problem: Problem) => {
    setSelectedProblem(problem);
    archiveModal.onOpen();
  };

  const allProblems = useMemo(
    () => [
      {
        id: 1,
        title: "A + B Problem",
        difficulty: "Easy",
        submissions: 1250,
        acRate: "85%",
        visible: true,
        contest: "None",
        tags: ["Basic"],
      },
      {
        id: 501,
        title: "Two Sum",
        difficulty: "Medium",
        submissions: 850,
        acRate: "45%",
        visible: true,
        contest: "Spring 2025",
        tags: ["Array", "Hash Table"],
      },
      {
        id: 102,
        title: "Quick Sort Implementation",
        difficulty: "Hard",
        submissions: 320,
        acRate: "12%",
        visible: false,
        contest: "None",
        tags: ["Sort", "Algorithm"],
      },
      {
        id: 502,
        title: "Longest Substring",
        difficulty: "Medium",
        submissions: 600,
        acRate: "38%",
        visible: true,
        contest: "Spring 2025",
        tags: ["String", "Sliding Window"],
      },
      {
        id: 105,
        title: "Binary Tree Level Order",
        difficulty: "Medium",
        submissions: 450,
        acRate: "50%",
        visible: true,
        contest: "None",
        tags: ["Tree"],
      },
    ],
    []
  );

  const pages = Math.ceil(allProblems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return allProblems.slice(start, end);
  }, [page, allProblems]);

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

      {/* FILTER BAR SECTION */}
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
          <DropdownMenu
            aria-label="Sort Options"
            className="font-bold uppercase text-[10px]"
          >
            <DropdownItem key="newest">Latest ID</DropdownItem>
            <DropdownItem key="title">Title A-Z</DropdownItem>
            <DropdownItem key="ac">AC Rate</DropdownItem>
            <DropdownItem key="subs">Submissions</DropdownItem>
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
          <SelectItem
            key="easy"
            className="font-bold uppercase text-[10px] text-emerald-500"
          >
            Easy
          </SelectItem>
          <SelectItem
            key="medium"
            className="font-bold uppercase text-[10px] text-amber-500"
          >
            Medium
          </SelectItem>
          <SelectItem
            key="hard"
            className="font-bold uppercase text-[10px] text-rose-500"
          >
            Hard
          </SelectItem>
        </Select>

        <Select
          placeholder="Tags"
          className="w-44"
          startContent={<Tag size={14} className="text-slate-400" />}
          classNames={{
            trigger:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 border border-slate-200 dark:border-white/5 shadow-sm",
          }}
        >
          <SelectItem key="dp" className="font-bold uppercase text-[10px]">
            Dynamic Programming
          </SelectItem>
          <SelectItem key="math" className="font-bold uppercase text-[10px]">
            Math
          </SelectItem>
          <SelectItem key="graph" className="font-bold uppercase text-[10px]">
            Graph
          </SelectItem>
        </Select>

        <Button
          variant="flat"
          className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-black text-[10px] uppercase tracking-widest px-6"
          startContent={<Filter size={16} />}
        >
          More
        </Button>

        {/* REFRESH BUTTON: LUÔN CỐ ĐỊNH MÀU BLUE 600 */}
        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-90 ml-auto"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE SECTION */}
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
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow
                key={p.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <span className="text-slate-400 font-black italic text-xs">
                    #{p.id}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                    {p.title}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md tracking-tighter border border-slate-200/50 dark:border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-black uppercase text-[9px] px-2 ${
                      p.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : p.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {p.difficulty}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-[10px] font-black uppercase ${
                      p.contest === "None"
                        ? "text-slate-400 italic"
                        : "text-blue-600 dark:text-[#FF5C00]"
                    }`}
                  >
                    {p.contest}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="text-emerald-500 font-black italic text-sm">
                      {p.acRate}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-tighter">
                      {p.submissions} Subs
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    defaultSelected={p.visible}
                    size="sm"
                    classNames={{
                      wrapper:
                        "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {/* NÚT ARCHIVE  */}
                    <Tooltip
                      content="Archive to Bookmark"
                      className="font-bold text-[10px]"
                      // color="warning"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() => handleOpenArchive(p as Problem)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#FFB800] transition-all rounded-lg h-9 w-9"
                      >
                        <Archive size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      content="Edit Detail"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() =>
                          router.push(`/Management/Problem/${p.id}/edit`)
                        }
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Remix Problem"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() =>
                          router.push(`/Management/Problem/${p.id}/remix`)
                        }
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Copy size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Download Data"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Download size={16} />
                      </Button>
                    </Tooltip>
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

        {/* PAGINATION SECTION */}
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
              cursor:
                "bg-[#071739] dark:bg-[#FF5C00] text-white font-bold italic shadow-lg",
            }}
          />
        </div>
      </div>
      {/* GỌI MODAL ARCHIVE */}
      <ArchiveProblemModal
        isOpen={archiveModal.isOpen}
        onOpenChange={archiveModal.onOpenChange}
        problem={selectedProblem}
      />
    </div>
  );
}
