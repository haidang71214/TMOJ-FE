"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Thêm để chuyển trang
import { useTranslation } from "@/hooks/useTranslation";
import {
  Button,
  Chip,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Skeleton,
  Switch,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import {
  Plus,
  Pencil,
  Eye,
  Clock,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  MoreVertical,
  Download,
  UploadCloud,
  FileArchive,
  Search,
  Tags,
  Flame,
  Code,
  Archive,
} from "lucide-react";
import { iconBtnGhost, iconBtnDanger, iconBtnSuccess, difficultyStyle } from "../adminTheme";
import CreateProblem from "./CreateProblem";
import EditProblem from "./EditProblem";
import AttachTagsModal from "@/app/components/AttachTagsModal";
import ArchiveProblemModal from "@/app/components/ArchiveProblemModal";
import EditorialManagementModal from "@/app/components/EditorialManagementModal";
import RemixProblemForm from "@/app/Problems/components/RemixProblemForm";
import ProblemTemplatePage from "@/app/Management/Problem/[id]/Template/page";
import { useGetProblemListQueryQuery } from "@/store/queries/problem";
import { Problem } from "@/types";

export default function ProblemManagementPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  // Use the API query
  const { data: problemListData, isLoading: isQueryLoading, refetch } = useGetProblemListQueryQuery();
  // Safe extraction of the problem array
  const apiProblems: Problem[] = problemListData?.data || [];

  // We still need local state if we want optimistic updates for Approve/Reject 
  // before building out the mutations for them.
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);
  const [editProblemId, setEditProblemId] = useState<string | null>(null);
  const [remixProblemId, setRemixProblemId] = useState<string | null>(null);
  const [templateProblemId, setTemplateProblemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Sync API data to local state when it loads
  useEffect(() => {
    if (problemListData?.data) {
      setProblems(problemListData.data);
    }
  }, [problemListData]);

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const tagsModal = useDisclosure();
  const [selectedProblemForTags, setSelectedProblemForTags] = useState<Problem | null>(null);

  const handleOpenTags = (problem: Problem) => {
    setSelectedProblemForTags(problem);
    tagsModal.onOpen();
  };

  const archiveModal = useDisclosure();
  const [selectedProblemForArchive, setSelectedProblemForArchive] = useState<Problem | null>(null);

  const handleOpenArchive = (problem: Problem) => {
    setSelectedProblemForArchive(problem);
    archiveModal.onOpen();
  };

  const editorialModal = useDisclosure();
  const [selectedProblemForEditorial, setSelectedProblemForEditorial] = useState<Problem | null>(null);

  const handleOpenEditorial = (problem: Problem) => {
    setSelectedProblemForEditorial(problem);
    editorialModal.onOpen();
  };

  // Lọc dữ liệu
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !difficultyFilter || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesType = !typeFilter || typeFilter === "ALGORITHM"; // Mock logic since all are algorithm for now
    return matchesSearch && matchesDifficulty && matchesType;
  });

  const pendingProblems = filteredProblems.filter((p) => p.statusCode === "draft");
  const approvedProblems = filteredProblems.filter((p) => p.statusCode === "published");

  const handleApprove = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsApproveModalOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedProblem) return;
    setProblems((prev) =>
      prev.map((p) =>
        p.id === selectedProblem.id ? { ...p, statusCode: "published" } : p
      )
    );
    setIsApproveModalOpen(false);
    setSelectedProblem(null);
  };

  const handleReject = (problem: Problem) => {
    setSelectedProblem(problem);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (!selectedProblem || !rejectionReason.trim()) return;
    setProblems((prev) =>
      prev.map((p) =>
        p.id === selectedProblem.id
          ? { ...p, statusCode: "draft" }
          : p
      )
    );
    setIsRejectModalOpen(false);
    setSelectedProblem(null);
  };

  const refreshData = async () => {
    setIsLoading(true);
    await refetch();
    setIsLoading(false);
  };

  // Render body cho Pending tab
  const renderPendingBody = () => {
    if (isLoading || isQueryLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <div className="space-y-4 py-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (pendingProblems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-24">
            <div className="flex flex-col items-center gap-6 opacity-0 animate-fade-in-up"  style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle size={32} className="text-amber-500/50" />
              </div>
              <div className="text-center max-w-xs">
                <p className="text-lg font-black uppercase tracking-tight text-white/80">{language === 'vi' ? "Hộp thư trống" : "Queue is Empty"}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/20 mt-2 leading-relaxed">{language === 'vi' ? "Tất cả các câu hỏi đã được duyệt hoặc chưa có bài tập nào mới." : "All submissions have been reviewed. No new problems in the queue."}</p>
              </div>
              <button
                onClick={() => setIsCreatingProblem(true)}
                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)" }}
              >
                {language === 'vi' ? "Tạo bài tập" : "Create Problem"}
              </button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return pendingProblems.map((prob, index) => (
      <TableRow key={prob.id} className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: `${index * 50 + 100}ms` }}>
        <TableCell>
          <div className="font-bold text-white tracking-tight leading-tight">{prob.title}</div>
          <div className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-tight">{prob.slug}</div>
        </TableCell>
        <TableCell>
          <div className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-secondary/10 text-secondary border border-secondary/20 italic">
            ALGORITHM
          </div>
        </TableCell>
        <TableCell>
          <div
            className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase border"
            style={difficultyStyle(prob.difficulty)}
          >
            {prob.difficulty}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {prob.tags && prob.tags.length > 0 ? (
              prob.tags.map((tag: any) => (
                <span key={tag.id || tag} className="text-[8px] font-black uppercase px-2 py-0.5 bg-white/5 text-white/40 rounded-md tracking-tighter border border-white/5">
                  {tag.name || tag}
                </span>
              ))
            ) : (
              <span className="text-[8px] text-white/20 italic">—</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Tooltip content="Approve Problem" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleApprove(prob)}
                className="bg-emerald-400/10 text-emerald-400 min-w-8 h-8 rounded-lg"
              >
                <CheckCircle2 size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Reject Problem" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleReject(prob)}
                className="bg-red-400/10 text-red-400 min-w-8 h-8 rounded-lg"
              >
                <XCircle size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Manage Tags" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleOpenTags(prob)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Tags size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Archive to Bookmark" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleOpenArchive(prob)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Archive size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Remix Problem" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => setRemixProblemId(prob.id)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Flame size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Problem Template" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => setTemplateProblemId(prob.id)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Code size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Editorial Management" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleOpenEditorial(prob)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <BookOpen size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Edit Problem" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => setEditProblemId(prob.id)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Pencil size={15} />
              </Button>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  // Render body cho Approved tab
  const renderApprovedBody = () => {
    if (approvedProblems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-20 text-white/20 font-bold uppercase tracking-widest text-[10px]">
            No approved or public problems yet
          </TableCell>
        </TableRow>
      );
    }

    return approvedProblems.map((prob, index) => (
      <TableRow key={prob.id} className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: `${index * 50 + 100}ms` }}>
        <TableCell>
          <div className="font-bold text-white tracking-tight leading-tight">{prob.title}</div>
          <div className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-tight">{prob.slug}</div>
        </TableCell>
        <TableCell>
          <Chip variant="flat" color="secondary" size="sm">
            ALGORITHM
          </Chip>
        </TableCell>
        <TableCell>
          <div
            className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase border"
            style={difficultyStyle(prob.difficulty)}
          >
            {prob.difficulty}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {prob.tags && prob.tags.length > 0 ? (
              prob.tags.map((tag: any) => (
                <span key={tag.id || tag} className="text-[8px] font-black uppercase px-2 py-0.5 bg-white/5 text-white/40 rounded-md tracking-tighter border border-white/5">
                  {tag.name || tag}
                </span>
              ))
            ) : (
              <span className="text-[8px] text-white/20 italic">—</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/50">
              <Clock size={11} className="text-white/30" />
              {(prob.timeLimitMs / 1000).toFixed(1)}s
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/50">
              <Database size={11} className="text-white/30" />
              {(prob.memoryLimitKb / 1024).toFixed(0)}MB
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-xs font-black text-white/80">0</div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-black" style={{ color: (prob.acceptancePercent ?? 0) > 60 ? "#10B981" : "#F59E0B" }}>
              {prob.acceptancePercent?.toFixed(1) || "—"}%
            </div>
            <div className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
               <div
                 className="h-full rounded-full"
                 style={{
                   width: `${prob.acceptancePercent || 0}%`,
                   background: (prob.acceptancePercent ?? 0) > 60 ? "#10B981" : "#F59E0B"
                 }}
               />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Switch isSelected={prob.statusCode === "published"} size="sm" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Tooltip content="Manage Tags" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleOpenTags(prob)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Tags size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Archive to Bookmark" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleOpenArchive(prob)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Archive size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Remix Problem" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => setRemixProblemId(prob.id)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Flame size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Problem Template" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => setTemplateProblemId(prob.id)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Code size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Edit Detail" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => setEditProblemId(prob.id)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <Pencil size={15} />
              </Button>
            </Tooltip>

            <Tooltip content="Editorial Management" className="text-[10px] font-bold">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleOpenEditorial(prob)}
                className="bg-white/5 text-white/40 hover:text-white/80 min-w-8 h-8 rounded-lg"
              >
                <BookOpen size={15} />
              </Button>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
    ));
  };



  if (isCreatingProblem) {
    return (
      <CreateProblem
        onCancel={() => setIsCreatingProblem(false)}
        onFinish={() => {
          setIsCreatingProblem(false);
          refreshData();
        }}
      />
    );
  }

  if (editProblemId) {
    return (
      <EditProblem
        problemId={editProblemId}
        onCancel={() => setEditProblemId(null)}
        onFinish={() => {
          setEditProblemId(null);
          refreshData();
        }}
      />
    );
  }

  if (remixProblemId) {
    return (
      <RemixProblemForm
        originId={remixProblemId}
        onCancel={() => setRemixProblemId(null)}
      />
    );
  }

  if (templateProblemId) {
    return (
      <ProblemTemplatePage
        inlineProblemId={templateProblemId}
        onCancel={() => setTemplateProblemId(null)}
      />
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-end opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Problem <span className="text-[#3B5BFF]">Vault</span>
          </h1>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mt-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B5BFF] animate-pulse" />
            {language === "vi" ? "Hệ thống quản lý & Kiểm duyệt bài tập" : "Centralized Problem Moderation & Control"}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={refreshData}
            disabled={isLoading || isQueryLoading}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white"
          >
            <RefreshCw size={14} className={isLoading || isQueryLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
            {language === "vi" ? "Làm mới" : "Refresh"}
          </button>
          <button
            onClick={() => setIsCreatingProblem(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all active:scale-95 hover:brightness-110 uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 8px 24px rgba(59,91,255,0.25)" }}
          >
            <Plus size={16} />
            {language === "vi" ? "Tạo bài mới" : "New Problem"}
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#3B5BFF] transition-colors" size={16} />
          <input
            placeholder={language === "vi" ? "Tìm kiếm tiêu đề, slug..." : "Search problems, slugs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#162035] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:border-[#3B5BFF]/50 focus:bg-[#1E2B42] outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
           <Dropdown>
             <DropdownTrigger>
               <button className="px-4 py-3 rounded-2xl bg-[#162035] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/10 transition-all">
                 {difficultyFilter || "Difficulty"}
               </button>
             </DropdownTrigger>
             <DropdownMenu 
               aria-label="Filter Difficulty"
               onAction={(key) => setDifficultyFilter(key === "all" ? null : key as string)}
             >
               <DropdownItem key="all">All Difficulties</DropdownItem>
               <DropdownItem key="easy" className="text-green-500">Easy</DropdownItem>
               <DropdownItem key="medium" className="text-orange-500">Medium</DropdownItem>
               <DropdownItem key="hard" className="text-red-500">Hard</DropdownItem>
             </DropdownMenu>
           </Dropdown>

           <Dropdown>
             <DropdownTrigger>
               <button className="px-4 py-3 rounded-2xl bg-[#162035] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/10 transition-all">
                 {typeFilter || "Type"}
               </button>
             </DropdownTrigger>
             <DropdownMenu 
               aria-label="Filter Type"
               onAction={(key) => setTypeFilter(key === "all" ? null : key as string)}
             >
               <DropdownItem key="all">All Types</DropdownItem>
               <DropdownItem key="ALGORITHM">Algorithm</DropdownItem>
             </DropdownMenu>
           </Dropdown>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        defaultSelectedKey="pending"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-10 pb-2 border-b border-white/5",
          tab: "h-12 text-[11px] font-black uppercase tracking-[0.2em] text-white/30 data-[selected=true]:text-[#3B5BFF]",
          cursor: "h-0.5 rounded-full bg-[#3B5BFF] shadow-[0_0_12px_rgba(59,91,255,0.8)]",
          tabContent: "group-data-[selected=true]:text-[#3B5BFF]",
        }}
      >
        <Tab key="pending" title={language === "vi" ? `Chờ duyệt (${pendingProblems.length})` : `Pending (${pendingProblems.length})`}>
          <div
            className="rounded-2xl border overflow-hidden opacity-0 animate-fade-in-up"
            style={{ borderColor: "rgba(255,255,255,0.10)", background: "#162035", animationDelay: "200ms", animationFillMode: "both" }}
          >
            <Table
              aria-label="Pending Approval Problems"
              removeWrapper
              classNames={{
                th: "text-white/40 text-[11px] font-black uppercase tracking-wider border-b border-white/[0.08]",
                td: "text-white/75 border-b border-white/[0.05] py-3",
                tr: "hover:bg-white/[0.03] transition-colors",
                thead: "[&>tr]:bg-[#1E2B42]",
              }}
            >
              <TableHeader>
                <TableColumn className="w-[40%]">{language === "vi" ? "Tiêu đề" : "Title"}</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>{language === "vi" ? "Độ khó" : "Difficulty"}</TableColumn>
                <TableColumn>{language === "vi" ? "Gắn thẻ" : "Tags"}</TableColumn>
                <TableColumn>{language === "vi" ? "Thao tác" : "Actions"}</TableColumn>
              </TableHeader>
              <TableBody>{renderPendingBody()}</TableBody>
            </Table>
          </div>
        </Tab>

        <Tab key="approved" title={language === "vi" ? `Công khai (${approvedProblems.length})` : `Published (${approvedProblems.length})`}>
          <div
            className="rounded-2xl border overflow-hidden opacity-0 animate-fade-in-up"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", animationDelay: "200ms", animationFillMode: "both" }}
          >
            <Table
              aria-label="Approved Problems"
              removeWrapper
              classNames={{
                th: "bg-white/[0.04] text-white/40 text-[11px] font-black uppercase tracking-wider border-b border-white/[0.06]",
                td: "text-white/70 border-b border-white/[0.04] py-3",
                tr: "hover:bg-white/[0.02] transition-colors",
              }}
            >
              <TableHeader>
                <TableColumn className="w-[30%]">{language === "vi" ? "Tiêu đề" : "Title"}</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>{language === "vi" ? "Độ khó" : "Difficulty"}</TableColumn>
                <TableColumn>{language === "vi" ? "Gắn thẻ" : "Tags"}</TableColumn>
                <TableColumn>Time / Memory</TableColumn>
                <TableColumn>Stats</TableColumn>
                <TableColumn>Accept %</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>{language === "vi" ? "Thao tác" : "Actions"}</TableColumn>
              </TableHeader>
              <TableBody>{renderApprovedBody()}</TableBody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      {/* MODAL APPROVE */}
      <Modal isOpen={isApproveModalOpen} onOpenChange={setIsApproveModalOpen} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={24} />
                Approve Problem
              </ModalHeader>
              <ModalBody>
                <p>Are you sure to <strong>APPROVE</strong> and publish:</p>
                <p className="font-bold mt-2">{selectedProblem?.title}</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="success" onPress={confirmApprove}>Approve & Publish</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL REJECT */}
      <Modal isOpen={isRejectModalOpen} onOpenChange={setIsRejectModalOpen} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase flex items-center gap-3">
                <XCircle className="text-red-500" size={24} />
                Reject Problem
              </ModalHeader>
              <ModalBody className="space-y-4">
                <p>Provide reason for rejection:</p>
                <p className="font-medium">{selectedProblem?.title}</p>
                <Textarea minRows={3} placeholder="Rejection reason..." value={rejectionReason} onValueChange={setRejectionReason} />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={confirmReject} isDisabled={!rejectionReason.trim()}>Reject</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <AttachTagsModal
        isOpen={tagsModal.isOpen}
        onOpenChange={tagsModal.onOpenChange}
        // @ts-ignore - Map Admin Problem type to DisplayProblem
        problem={selectedProblemForTags}
      />

      <ArchiveProblemModal
        isOpen={archiveModal.isOpen}
        onOpenChange={archiveModal.onOpenChange}
        // @ts-ignore
        problem={selectedProblemForArchive}
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