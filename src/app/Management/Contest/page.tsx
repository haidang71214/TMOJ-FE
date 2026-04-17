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
  Select,
  SelectItem,
  Pagination,
  useDisclosure,
  Spinner,
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
import { useGetContestListQuery, usePublishContestMutation } from "@/store/queries/Contest";
import { ContestDto } from "@/types";
import { toast } from "sonner";

export default function ContestListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: contestData, isLoading, isFetching, refetch } = useGetContestListQuery({
    page,
    pageSize: rowsPerPage,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchTerm || undefined,
    title: searchTerm || undefined,
    name: searchTerm || undefined,
  });


  const [publishContest] = usePublishContestMutation();

  const handlePublishToggle = async (id: string) => {
    try {
      await publishContest(id).unwrap();
      toast.success("Cập nhật trạng thái hiển thị thành công");
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể cập nhật trạng thái hiển thị");
    }
  };

  // Lấy totalCount linh hoạt (đề phòng API trả về tên trường khác)
  const totalCount = (contestData?.data as any)?.totalCount ??
    (contestData?.data as any)?.total ??
    (contestData as any)?.data?.total_count ??
    (contestData as any)?.totalCount ?? 0;

  const items = contestData?.data?.items || [];

  // Lọc Client-side (dành cho trường hợp Server không hỗ trợ lọc)
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const q = searchTerm.toLowerCase();
    return items.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.visibilityCode?.toLowerCase().includes(q)
    );
  }, [items, searchTerm]);

  // Tính tổng số trang
  const calculatedPages = Math.ceil(totalCount / rowsPerPage);
  const pages = Math.max(1, calculatedPages || (items.length === rowsPerPage ? page + 1 : page));

  // Logic cho Extend Modal
  const extendModal = useDisclosure();
  const [selectedContest, setSelectedContest] = useState<ContestDto | null>(null);

  const handleOpenExtend = (contest: ContestDto) => {
    setSelectedContest(contest);
    extendModal.onOpen();
  };

  // Reset về trang 1 khi search hoặc đổi rowsPerPage
  const onSearchChange = React.useCallback((value?: string) => {
    setSearchTerm(value || "");
    setPage(1);
  }, []);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search contest title or ID..."
            startContent={<Search size={18} className="text-[#A4B5C4]" />}
            value={searchTerm}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
            classNames={{
              inputWrapper: "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5",
            }}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDown size={14} />}
                  variant="flat"
                  className="bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filter Status"
                closeOnSelect={false}
                selectedKeys={new Set([statusFilter])}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  setStatusFilter(Array.from(keys)[0] as string);
                  setPage(1);
                }}
              >
                <DropdownItem key="all">All Status</DropdownItem>
                <DropdownItem key="running">Running</DropdownItem>
                <DropdownItem key="upcoming">Upcoming</DropdownItem>
                <DropdownItem key="ended">Ended</DropdownItem>
                <DropdownItem key="draft">Draft</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              isIconOnly
              onPress={() => refetch()}
              isLoading={isFetching}
              className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs font-bold">
            Total {contestData?.data?.totalCount || 0} contests
          </span>
          <label className="flex items-center text-slate-400 text-xs font-bold gap-2">
            Rows per page:
            <select
              className="bg-transparent outline-none text-slate-500 text-xs font-bold cursor-pointer"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [searchTerm, statusFilter, rowsPerPage, contestData?.data?.totalCount, isFetching, onSearchChange, onRowsPerPageChange, refetch]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-xs font-bold text-slate-400 italic">
          {selectedContest ? `Selected: ${selectedContest.title}` : ""}
        </span>
        <Pagination
          showControls
          showShadow
          color="primary"
          variant="faded"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-black",
            wrapper: "gap-2",
            item: "font-bold hover:bg-slate-100 dark:hover:bg-white/10",
          }}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2 text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
            Showing {Math.min(items.length, rowsPerPage)} of {contestData?.data?.totalCount || 0}
          </span>
        </div>
      </div>
    );
  }, [page, pages, selectedContest]);

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
          onPress={() => router.push("/Management/Contest/create")}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          CREATE NEW CONTEST
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        <Table
          aria-label="Contest Management Table"
          removeWrapper
          topContent={topContent}
          bottomContent={bottomContent}
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
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
          <TableBody
            loadingContent={<Spinner color="primary" />}
            isLoading={isLoading}
            emptyContent={!isLoading && "Không tìm thấy contest nào."}
          >
            {filteredItems.map((c) => (
              <TableRow
                key={c.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => router.push(`/Contest/${c.id}`)}
              >
                <TableCell>
                  <span className="text-slate-400 font-black italic text-[10px]">
                    #{c.id.substring(0, 8)}...
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
                    className={`font-black uppercase text-[9px] px-2 ${c.contestType?.toUpperCase() === "ACM"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                      }`}
                  >
                    {c.contestType || "N/A"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                    {c.visibilityCode}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="dot"
                    color={
                      c.status?.toLowerCase() === "running"
                        ? "success"
                        : c.status?.toLowerCase() === "upcoming"
                          ? "primary"
                          : c.status?.toLowerCase() === "draft"
                            ? "danger"
                            : "default"
                    }
                    className="font-black uppercase text-[9px] border-none"
                  >
                    {c.status}
                  </Chip>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Switch
                    isSelected={c.status?.toLowerCase() !== "draft"}
                    onValueChange={() => handlePublishToggle(c.id)}
                    size="sm"
                    classNames={{
                      wrapper:
                        "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                    }}
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    {c.status?.toLowerCase() === "running" && (
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
                          onPress={() => handleOpenExtend(c)}
                        >
                          <Clock size={16} />
                        </Button>
                      </Tooltip>
                    )}
                    {c.status?.toLowerCase() !== "running" && c.status?.toLowerCase() !== "ended" && (
                      <Tooltip
                        content="Edit Details"
                        className="font-bold text-[10px]"
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onPress={() =>
                            router.push(`/Management/Contest/${c.id}/edit`)
                          }
                          className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                        >
                          <Edit3 size={16} />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip
                      content="Manage Problems"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() =>
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
                        onPress={() =>
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
