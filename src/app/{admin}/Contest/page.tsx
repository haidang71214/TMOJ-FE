"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Chip,
  Switch,
  RadioGroup,
  Radio,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Select,
  SelectItem,
  Pagination,
  Tooltip,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Download,
  X,
  Trophy,
  Lock,
  CalendarDays,
  Heading1,
  Bold,
  Italic,
  List,
  Link2,
  Search,
  RotateCcw,
  Clock,
  Users,
  FolderCode,
  Megaphone,
  Globe,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import {
  ADMIN_H1, ADMIN_SUBTITLE,
} from "../adminTable";
import { iconBtnGhost, iconBtnDanger } from "../adminTheme";
import {
  useGetContestListQuery,
  useDeleteContestMutation,
  useChangeVisibilityMutation,
  useCreateContestMutation,
  useUpdateContestMutation,
} from "@/store/queries/Contest";
import { CreateContestRequest, ContestDto } from "@/types";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import ExtendTimeModal from "@/app/components/ExtendTimeModal";

export default function ContestManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isFetching, refetch } = useGetContestListQuery({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    title: debouncedSearch || undefined,
    name: debouncedSearch || undefined,
    status: filterStatus,
    visibilityCode: filterVisibility,
  });

  const [deleteContest] = useDeleteContestMutation();
  const [changeVisibility] = useChangeVisibilityMutation();
  const [createContest] = useCreateContestMutation();
  const [updateContest] = useUpdateContestMutation();

  const items = data?.data?.items || [];

  // Lọc Client-side (dành cho trường hợp Server không hỗ trợ lọc hoặc lọc chưa chính xác)
  const contests = useMemo(() => {
    if (!debouncedSearch.trim()) return items;
    const q = debouncedSearch.toLowerCase();
    return items.filter(c =>
      c.title?.toLowerCase().includes(q) ||
      c.id?.toLowerCase().includes(q)
    );
  }, [items, debouncedSearch]);

  // Linh hoạt lấy totalCount từ nhiều nguồn khác nhau tùy theo response của API
  const totalCount = (data?.data as any)?.totalCount ??
    (data?.data as any)?.total ??
    (data as any)?.totalCount ??
    (data as any)?.total ?? 0;

  const totalPages = Math.ceil(totalCount / pageSize);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateContestRequest>({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    visibilityCode: "public",
    allowTeams: false,
    contestType: "acm",
  });

  // Logic cho Extend Modal
  const extendModal = useDisclosure();
  const [selectedContest, setSelectedContest] = useState<ContestDto | null>(null);

  const handleOpenExtend = (contest: ContestDto) => {
    setSelectedContest(contest);
    extendModal.onOpen();
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      startAt: "",
      endAt: "",
      visibilityCode: "public",
      allowTeams: false,
      contestType: "acm",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (contest: any) => {
    setEditingId(contest.id);
    setForm({
      title: contest.title,
      description: contest.description || "",
      startAt: contest.startAt ? new Date(contest.startAt).toISOString().slice(0, 16) : "",
      endAt: contest.endAt ? new Date(contest.endAt).toISOString().slice(0, 16) : "",
      visibilityCode: contest.visibilityCode || "public",
      allowTeams: contest.allowTeams || false,
      contestType: contest.contestType?.toLowerCase() || "acm",
    });
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateContest({ id: editingId, body: form }).unwrap();
        addToast({ title: "Updated contest successfully", color: "success" });
      } else {
        await createContest(form).unwrap();
        addToast({ title: "Created contest successfully", color: "success" });
      }
      setIsOpen(false);
    } catch (error) {
      addToast({ title: "Operation failed", color: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contest?")) return;
    try {
      await deleteContest(id).unwrap();
      addToast({ title: "Deleted contest successfully", color: "success" });
    } catch (error) {
      addToast({ title: "Failed to delete contest", color: "danger" });
    }
  };

  const handleChangeVisibility = async (id: string, visibilityCode: string) => {
    try {
      await changeVisibility({ id, body: { visibilityCode } }).unwrap();
      addToast({ title: `Visibility changed to ${visibilityCode.toUpperCase()}`, color: "success" });
    } catch (error) {
      addToast({ title: "Failed to change visibility", color: "danger" });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterVisibility("all");
    setPage(1);
  };

  const EditorToolbar = () => (
    <div className="bg-slate-50 dark:bg-black/20 p-2 border-b border-slate-200 dark:border-white/10 flex gap-1">
      {[Heading1, Bold, Italic, List, Link2].map((Icon, i) => (
        <Button key={i} isIconOnly size="sm" variant="light" className="text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E]">
          <Icon size={16} />
        </Button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 dark text-white bg-[#0E1420] min-h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={ADMIN_H1}>
            Contest <span style={{ color: "#3B5BFF" }}>Management</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>Organize and monitor programming competitions</p>
        </div>
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="light"
            className="text-white/30 hover:text-white h-11 w-11 rounded-xl"
            onPress={() => refetch()}
            isLoading={isFetching}
          >
            <RotateCcw size={18} />
          </Button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 16px rgba(59,91,255,0.3)" }}
            onClick={handleOpenCreate}
          >
            <Plus size={15} /> Create New Contest
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#3B5BFF] transition-colors" size={16} />
          <input
            placeholder="Search contest title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl pl-10 pr-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-[#3B5BFF] transition-all"
            style={{ background: "#1E2B42", border: "1px solid rgba(255,255,255,0.10)", width: 280 }}
          />
        </div>

        <Select
          placeholder="Status"
          size="sm"
          className="w-40"
          selectedKeys={[filterStatus]}
          onSelectionChange={(keys) => {
            setFilterStatus(Array.from(keys)[0] as string);
            setPage(1);
          }}
          classNames={{
            trigger: "bg-[#1E2B42] border-white/10 text-white/60",
            value: "text-white/80 font-bold",
            popoverContent: "bg-[#1E2B42] border-white/10 text-white",
          }}
        >
          <SelectItem key="all" className="text-white">All Status</SelectItem>
          <SelectItem key="UPCOMING" className="text-white">Upcoming</SelectItem>
          <SelectItem key="RUNNING" className="text-white">Running</SelectItem>
          <SelectItem key="ENDED" className="text-white">Ended</SelectItem>
        </Select>

        <Select
          placeholder="Visibility"
          size="sm"
          className="w-40"
          selectedKeys={[filterVisibility]}
          onSelectionChange={(keys) => {
            setFilterVisibility(Array.from(keys)[0] as string);
            setPage(1);
          }}
          classNames={{
            trigger: "bg-[#1E2B42] border-white/10 text-white/60",
            value: "text-white/80 font-bold",
            popoverContent: "bg-[#1E2B42] border-white/10 text-white",
          }}
        >
          <SelectItem key="all" className="text-white">All Visibility</SelectItem>
          <SelectItem key="public" className="text-white">Public</SelectItem>
          <SelectItem key="private" className="text-white">Private</SelectItem>
          <SelectItem key="hidden" className="text-white">Hidden</SelectItem>
        </Select>

        <Button
          variant="light"
          className="text-white/30 hover:text-white font-bold text-xs"
          onPress={handleResetFilters}
          startContent={<RotateCcw size={14} />}
        >
          Reset Filters
        </Button>
      </div>

      {/* TABLE */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "#162035" }}
      >
        <Table
          aria-label="Contest Management Table"
          removeWrapper
          classNames={{
            th: "text-white/40 text-[11px] font-black uppercase tracking-wider border-b border-white/[0.08] py-4",
            td: "text-white/75 border-b border-white/[0.05] py-4",
            tr: "hover:bg-white/[0.03] transition-colors",
            thead: "[&>tr]:bg-[#1E2B42]",
          }}
          bottomContent={
            <div className="flex justify-center items-center px-6 py-4 border-t border-white/[0.08] relative">
              <span className="absolute left-6 text-[10px] font-bold text-white/30 italic hidden sm:inline">
                Showing {contests.length} of {totalCount} contests
              </span>
              <Pagination
                showControls
                showShadow
                color="primary"
                variant="faded"
                page={page}
                total={totalPages || 1}
                onChange={setPage}
                classNames={{
                  cursor: "bg-[#3B5BFF] text-white font-black",
                  wrapper: "gap-2",
                  item: "text-white/60 hover:text-white hover:bg-white/10",
                }}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn className="w-[30%]">Contest Title</TableColumn>
            <TableColumn>Rule</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Visible</TableColumn>
            <TableColumn align="center">Actions</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={(isLoading || isFetching) ? <Spinner color="primary" /> : "No contests found"}
            isLoading={isLoading || isFetching}
            loadingContent={<Spinner color="primary" />}
          >
            {contests.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <span className="text-[10px] font-bold text-white/30 font-mono">
                    #{c.id.slice(0, 8)}
                  </span>
                </TableCell>
                <TableCell>
                  <div
                    className="font-bold text-white tracking-tight leading-tight cursor-pointer hover:text-[#3B5BFF] transition-colors"
                    onClick={() => router.push(`/Contest/${c.id}`)}
                  >
                    {c.title}
                  </div>
                  <div className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-tight">
                    {new Date(c.startAt).toLocaleDateString()} - {new Date(c.endAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase italic"
                    style={c.contestType?.toUpperCase() === "ACM"
                      ? { color: "#7B9FFF", background: "rgba(59,91,255,0.12)", borderColor: "rgba(59,91,255,0.25)" }
                      : { color: "#C084FC", background: "rgba(155,59,255,0.12)", borderColor: "rgba(155,59,255,0.25)" }
                    }
                  >
                    {c.contestType || "ACM"}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase"
                    style={c.status?.toUpperCase() === "RUNNING"
                      ? { color: "#10B981", background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.25)" }
                      : c.status?.toUpperCase() === "UPCOMING"
                        ? { color: "#F59E0B", background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.25)" }
                        : { color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }
                    }
                  >
                    {c.status}
                  </div>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/5 text-white/60 font-bold uppercase text-[9px] h-8 rounded-lg min-w-24"
                        startContent={(() => {
                          const vis = (c.visibilityCode || "public").toLowerCase();
                          if (vis === "public") return <Globe size={12} className="text-[#10B981]" />;
                          if (vis === "private") return <Lock size={12} className="text-[#F59E0B]" />;
                          return <EyeOff size={12} className="text-white/30" />;
                        })()}
                        endContent={<ChevronDown size={12} />}
                      >
                        {(c.visibilityCode || "PUBLIC").toUpperCase()}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Change Visibility"
                      onAction={(key) => handleChangeVisibility(c.id, key as string)}
                      classNames={{
                        base: "dark bg-[#1E2B42] text-white border border-white/10 rounded-xl",
                      }}
                    >
                      <DropdownItem
                        key="public"
                        startContent={<Globe size={14} className="text-[#10B981]" />}
                        className="font-bold text-[10px] uppercase text-white hover:bg-white/5"
                      >
                        Public
                      </DropdownItem>
                      <DropdownItem
                        key="private"
                        startContent={<Lock size={14} className="text-[#F59E0B]" />}
                        className="font-bold text-[10px] uppercase text-white hover:bg-white/5"
                      >
                        Private
                      </DropdownItem>
                      <DropdownItem
                        key="hidden"
                        startContent={<EyeOff size={14} className="text-white/30" />}
                        className="font-bold text-[10px] uppercase text-white hover:bg-white/5"
                      >
                        Hidden
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Tooltip content="Edit Details" className="font-bold text-[10px]">
                      <button className={iconBtnGhost} onClick={() => handleOpenEdit(c)}><Pencil size={15} /></button>
                    </Tooltip>

                    {c.status?.toUpperCase() === "RUNNING" && (
                      <Tooltip content="Extend Time" className="font-bold text-[10px]" color="success">
                        <button className={iconBtnGhost} style={{ color: "#10B981" }} onClick={() => handleOpenExtend(c as ContestDto)}>
                          <Clock size={15} />
                        </button>
                      </Tooltip>
                    )}

                    <Tooltip content="Manage Problems" className="font-bold text-[10px]">
                      <button className={iconBtnGhost} onClick={() => router.push(`/Management/Contest/${c.id}/problems`)}>
                        <FolderCode size={15} />
                      </button>
                    </Tooltip>

                    <Tooltip content="Participants" className="font-bold text-[10px]">
                      <button className={iconBtnGhost} onClick={() => router.push(`/Management/Contest/${c.id}/participants`)}>
                        <Users size={15} />
                      </button>
                    </Tooltip>

                    <Tooltip content="Announcements" className="font-bold text-[10px]">
                      <button className={iconBtnGhost}><Megaphone size={15} /></button>
                    </Tooltip>

                    <Tooltip content="Download Data" className="font-bold text-[10px]">
                      <button className={iconBtnGhost}><Download size={15} /></button>
                    </Tooltip>

                    <Tooltip content="Delete" color="danger" className="font-bold text-[10px]">
                      <button
                        className={iconBtnDanger}
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL CREATE/EDIT CONTEST */}
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="4xl"
        scrollBehavior="inside"
        placement="center"
        backdrop="blur"
        classNames={{
          base: "dark text-white bg-[#0E1420] border border-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4 pb-8">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                    {editingId ? "EDIT" : "CREATE NEW"} <span className="text-[#FF5C00]">CONTEST</span>
                  </h1>
                  <Chip variant="dot" color="warning" className="font-black uppercase text-[10px] border-none italic">
                    {editingId ? "Edit Mode" : "Draft Mode"}
                  </Chip>
                </div>
              </ModalHeader>

              <ModalBody className="space-y-10">
                {/* TITLE */}
                <Input
                  label="Contest Title"
                  placeholder="e.g. TMOJ Spring Contest 2025"
                  labelPlacement="outside"
                  value={form.title}
                  onValueChange={(v) => setForm({ ...form, title: v })}
                  classNames={{
                    inputWrapper: "rounded-2xl bg-black/20 h-14 border-2 border-transparent focus-within:!border-blue-600 transition-all",
                    label: "text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                    input: "font-bold italic uppercase tracking-tight text-lg text-white",
                  }}
                />

                {/* DESCRIPTION */}
                <div className="space-y-3">
                  <label className="text-white font-black uppercase text-[10px] tracking-widest ml-1">
                    Contest Description & Rules
                  </label>
                  <div className="rounded-2xl border-2 border-white/10 overflow-hidden focus-within:border-blue-600 bg-black/10">
                    <EditorToolbar />
                    <Textarea
                      placeholder="Explain the rules, prizes, and details..."
                      variant="flat"
                      minRows={5}
                      value={form.description}
                      onValueChange={(v) => setForm({ ...form, description: v })}
                      classNames={{
                        inputWrapper: "bg-transparent shadow-none p-4",
                        input: "font-medium text-slate-300",
                      }}
                    />
                  </div>
                </div>

                {/* SETTINGS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Input
                    label="Start Time"
                    type="datetime-local"
                    labelPlacement="outside"
                    value={form.startAt}
                    onValueChange={(v) => setForm({ ...form, startAt: v })}
                    startContent={<CalendarDays size={18} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600",
                      label: "text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                      input: "text-white",
                    }}
                  />
                  <Input
                    label="End Time"
                    type="datetime-local"
                    labelPlacement="outside"
                    value={form.endAt}
                    onValueChange={(v) => setForm({ ...form, endAt: v })}
                    startContent={<CalendarDays size={18} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600",
                      label: "text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                      input: "text-white",
                    }}
                  />
                  <Input
                    label="Security Password (Not implemented)"
                    type="password"
                    placeholder="Keep empty for public"
                    labelPlacement="outside"
                    isDisabled
                    startContent={<Lock size={18} className="text-slate-400" />}
                    classNames={{
                      inputWrapper: "rounded-2xl bg-black/20 h-12 border-2 border-transparent focus-within:!border-blue-600",
                      label: "text-white font-black uppercase text-[10px] tracking-widest mb-3 ml-1",
                      input: "text-white",
                    }}
                  />
                </div>

                {/* CONFIGURATION BOX */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-black/20 rounded-[2rem] border border-white/5">
                  <RadioGroup
                    label="Rule System"
                    orientation="horizontal"
                    value={form.contestType}
                    onValueChange={(v) => setForm({ ...form, contestType: v })}
                    classNames={{
                      label: "text-white font-black uppercase text-[10px] tracking-widest mb-4",
                    }}
                  >
                    <div className="flex gap-8">
                      <Radio value="acm" classNames={{ label: "text-xs font-black uppercase italic text-white" }}>
                        ACM
                      </Radio>
                      <Radio value="oi" classNames={{ label: "text-xs font-black uppercase italic text-white" }}>
                        OI
                      </Radio>
                    </div>
                  </RadioGroup>

                  <div className="flex flex-col gap-4">
                    <span className="text-white font-black uppercase text-[10px] tracking-widest leading-none">
                      Allow Teams
                    </span>
                    <Switch
                      isSelected={form.allowTeams}
                      onValueChange={(v) => setForm({ ...form, allowTeams: v })}
                      size="sm"
                      classNames={{
                        wrapper: "group-data-[selected=true]:bg-blue-600",
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-white font-black uppercase text-[10px] tracking-widest leading-none">
                      Publicly Visible
                    </span>
                    <Switch
                      isSelected={form.visibilityCode === "public"}
                      onValueChange={(v) => setForm({ ...form, visibilityCode: v ? "public" : "private" })}
                      size="sm"
                      classNames={{
                        wrapper: "group-data-[selected=true]:bg-blue-600",
                      }}
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-between pt-8 border-t border-white/5">
                <Button
                  variant="flat"
                  startContent={<X size={18} />}
                  className="rounded-xl font-black uppercase text-[10px] tracking-widest px-10 h-12 bg-white/5 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                  onPress={onClose}
                >
                  Discard
                </Button>
                <Button
                  startContent={<Trophy size={20} strokeWidth={3} />}
                  className="bg-[#FF5C00] text-white font-black rounded-2xl h-14 px-16 uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                  onPress={handleSubmit}
                >
                  {editingId ? "Update Contest" : "Launch Contest"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ExtendTimeModal
        isOpen={extendModal.isOpen}
        onOpenChange={extendModal.onOpenChange}
        contest={selectedContest}
      />

      <style jsx global>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}