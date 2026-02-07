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
  Switch,
  Chip,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  useDisclosure,
} from "@heroui/react";
import {
  Edit3,
  FolderCode,
  Megaphone,
  Download,
  Plus,
  Search,
  Filter,
  ChevronDown,
  SortAsc,
  RefreshCw,
  Clock,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ExtendTimeModal from "./../../components/ExtendTimeModal";
interface Contest {
  id: number;
  title: string;
  rule: string;
  type: string;
  status: string;
  visible: boolean;
}

const CONTESTS_DATA = [
  {
    id: 1024,
    title: "TMOJ Spring Contest 2025",
    rule: "ACM",
    type: "Public",
    status: "Running",
    visible: true,
  },
  {
    id: 1025,
    title: "Beginner Free Contest #01",
    rule: "OI",
    type: "Password",
    status: "Ended",
    visible: false,
  },
  {
    id: 1026,
    title: "ICPC Regional Qualifiers",
    rule: "ACM",
    type: "Public",
    status: "Upcoming",
    visible: true,
  },
  {
    id: 1027,
    title: "Monthly Challenge #12",
    rule: "OI",
    type: "Public",
    status: "Ended",
    visible: true,
  },
  {
    id: 1028,
    title: "Algorithm Masters 2026",
    rule: "ACM",
    type: "Private",
    status: "Upcoming",
    visible: false,
  },
];

export default function ContestListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil(CONTESTS_DATA.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return CONTESTS_DATA.slice(start, end);
  }, [page]);
  // Logic cho Extend Modal
  const extendModal = useDisclosure();
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const handleOpenExtend = (contest: Contest) => {
    setSelectedContest(contest);
    extendModal.onOpen();
  };

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION - BLUE & ORANGE STYLE */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            CONTEST <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Organize and monitor programming competitions
          </p>
        </div>
        <Button
          startContent={<Plus size={20} strokeWidth={3} />}
          onClick={() => router.push("/Management/Contest/create")}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          CREATE NEW CONTEST
        </Button>
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search contest title or ID..."
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111827] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] transition-colors",
          }}
          className="max-w-xs font-medium"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
              startContent={<Filter size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Rule Type
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Rule Type">
            <DropdownItem key="acm">ACM</DropdownItem>
            <DropdownItem key="oi">OI</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
              startContent={<SortAsc size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Sort By
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Sort">
            <DropdownItem key="id">Latest ID</DropdownItem>
            <DropdownItem key="status">Status</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Contest Management Table"
          removeWrapper
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none",
          }}
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>CONTEST TITLE</TableColumn>
            <TableColumn>RULE</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>VISIBLE</TableColumn>
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow
                key={c.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
// 
                onClick={()=> router.push(`/Contest/${c.id}`)}
              >
                <TableCell>
                  <span className="text-slate-400 font-black italic text-xs">
                    #{c.id}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                    {c.title}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-black uppercase text-[9px] px-2 ${
                      c.rule === "ACM"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                    }`}
                  >
                    {c.rule}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                    {c.type}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="dot"
                    color={
                      c.status === "Running"
                        ? "success"
                        : c.status === "Upcoming"
                        ? "warning"
                        : "default"
                    }
                    className="font-black uppercase text-[9px] border-none"
                  >
                    {c.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Switch
                    defaultSelected={c.visible}
                    size="sm"
                    classNames={{
                      wrapper:
                        "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {c.status === "Running" && (
                      <Tooltip
                        content="Extend Time"
                        className="font-bold text-[10px]"
                        color="success"
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-[#22C55E] hover:bg-green-600 hover:text-white transition-all rounded-lg h-9 w-9"
                          onClick={() => handleOpenExtend(c)}
                        >
                          <Clock size={16} />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip
                      content="Edit Details"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() =>
                          router.push(`/Management/Contest/${c.id}/edit`)
                        }
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Edit3 size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Manage Problems"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() =>
                          router.push(`/Management/Contest/${c.id}/problems`)
                        }
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <FolderCode size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Remix Contest"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() =>
                          router.push(`/Management/Contest/${c.id}/remix`)
                        }
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Copy size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Announcements"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Megaphone size={16} />
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION SECTION */}
        <div className="flex w-full justify-center py-6">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(p) => setPage(p)}
            classNames={{
              cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-bold",
            }}
          />
        </div>
      </div>
      <ExtendTimeModal
        isOpen={extendModal.isOpen}
        onOpenChange={extendModal.onOpenChange}
        contest={selectedContest}
      />
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
