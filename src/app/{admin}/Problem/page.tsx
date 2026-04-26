"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  TrendingUp,
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
import { ADMIN_H1, ADMIN_SUBTITLE } from "../adminTable";

export default function ProblemManagementPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const { data: problemListData, isLoading: isQueryLoading, refetch } = useGetProblemListQueryQuery();
  const apiProblems: Problem[] = problemListData?.data || [];

  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);
  const [editProblemId, setEditProblemId] = useState<string | null>(null);
  const [remixProblemId, setRemixProblemId] = useState<string | null>(null);
  const [templateProblemId, setTemplateProblemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

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

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !difficultyFilter || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesType = !typeFilter || typeFilter === "ALGORITHM";
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


  const ActionButtons = ({ prob, isPending }: { prob: Problem; isPending: boolean }) => (
    <div className="flex items-center gap-1">
      {isPending && (
        <>
          <Tooltip content="Approve" className="font-bold text-[10px]">
            <button onClick={() => handleApprove(prob)} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 size={14} /></button>
          </Tooltip>
          <Tooltip content="Reject" className="font-bold text-[10px]" color="danger">
            <button onClick={() => { setSelectedProblem(prob); setIsRejectModalOpen(true); }} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><XCircle size={14} /></button>
          </Tooltip>
        </>
      )}

      <Tooltip content="Tags" className="font-bold text-[10px]">
        <button onClick={() => handleOpenTags(prob)} className="p-2 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"><Tags size={14} /></button>
      </Tooltip>

      <Dropdown>
        <DropdownTrigger>
          <button className="p-2 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"><MoreVertical size={14} /></button>
        </DropdownTrigger>
        <DropdownMenu aria-label="More Actions" classNames={{ base: "dark bg-[#1E2B42] text-white border border-white/10 rounded-xl" }}>
          <DropdownItem key="edit" startContent={<Pencil size={14} />} onClick={() => setEditProblemId(prob.id)}>Edit Details</DropdownItem>
          <DropdownItem key="view" startContent={<Eye size={14} />} onClick={() => router.push(`/Problem/${prob.id}`)}>View Problem</DropdownItem>
          <DropdownItem key="remix" startContent={<Flame size={14} />} onClick={() => setRemixProblemId(prob.id)}>Remix Problem</DropdownItem>
          <DropdownItem key="template" startContent={<Code size={14} />} onClick={() => setTemplateProblemId(prob.id)}>Code Template</DropdownItem>
          <DropdownItem key="editorial" startContent={<BookOpen size={14} />} onClick={() => router.push(`/Problem/${prob.id}/Editorial`)}>Editorial</DropdownItem>
          <DropdownItem key="archive" startContent={<Archive size={14} />} className="text-red-400" onClick={() => handleOpenArchive(prob)}>Archive</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );

  if (isCreatingProblem) return <CreateProblem onCancel={() => setIsCreatingProblem(false)} onFinish={() => { setIsCreatingProblem(false); refreshData(); }} />;
  if (editProblemId) return <EditProblem problemId={editProblemId} onCancel={() => setEditProblemId(null)} onFinish={() => { setEditProblemId(null); refreshData(); }} />;
  if (remixProblemId) return <RemixProblemForm originId={remixProblemId} onCancel={() => setRemixProblemId(null)} />;
  if (templateProblemId) return <ProblemTemplatePage inlineProblemId={templateProblemId} onCancel={() => setTemplateProblemId(null)} />;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h1 className={ADMIN_H1}>
            Problem <span style={{ color: "#3B5BFF" }}>Vault</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>{language === "vi" ? "Quản lý và kiểm duyệt kho bài tập hệ thống" : "Centralized moderation and control for problem registry"}</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="flat"
            className="font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
            isLoading={isLoading || isQueryLoading}
            onPress={refreshData}
            startContent={<RefreshCw size={16} className={isLoading || isQueryLoading ? "animate-spin" : ""} />}
          >
            Refresh
          </Button>
          <Button
            className="font-black uppercase text-[10px] tracking-widest px-8 h-11 rounded-xl text-white shadow-xl active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 15px rgba(59, 91, 255, 0.3)" }}
            startContent={<Plus size={18} strokeWidth={3} />}
            onPress={() => setIsCreatingProblem(true)}
          >
            New Problem
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#3B5BFF] transition-colors" size={16} />
          <input
            placeholder={language === "vi" ? "Tìm kiếm tiêu đề, slug..." : "Search problems, slugs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-[#3B5BFF] transition-all bg-[#1E2B42] border border-white/10"
          />
        </div>

        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="bg-white/5 text-white/40 font-black uppercase text-[10px] h-10 px-5 rounded-xl">
                {difficultyFilter || "Difficulty"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => setDifficultyFilter(key === "all" ? null : key as string)} classNames={{ base: "dark bg-[#1E2B42] text-white border border-white/10 rounded-xl" }}>
              <DropdownItem key="all">All</DropdownItem>
              <DropdownItem key="easy" className="text-emerald-400">Easy</DropdownItem>
              <DropdownItem key="medium" className="text-amber-400">Medium</DropdownItem>
              <DropdownItem key="hard" className="text-red-400">Hard</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-10 pb-2 border-b border-white/5",
          tab: "h-12 text-[11px] font-black uppercase tracking-[0.2em] text-white/30 data-[selected=true]:text-[#3B5BFF]",
          cursor: "h-0.5 rounded-full bg-[#3B5BFF] shadow-[0_0_12px_rgba(59,91,255,0.8)]",
          tabContent: "group-data-[selected=true]:text-[#3B5BFF]",
        }}
      >
        <Tab key="pending" title={`Pending Approval (${pendingProblems.length})`}>
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 mt-6" style={{ background: "#162035" }}>
            <Table
              aria-label="Pending Table"
              removeWrapper
              classNames={{
                th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-widest border-b border-white/[0.08] py-5 px-6",
                td: "py-5 px-6 text-sm border-b border-white/[0.05] text-white/80",
                tr: "hover:bg-white/[0.03] transition-colors group/row",
              }}
            >
              <TableHeader>
                <TableColumn className="w-[40%]">{language === "vi" ? "Tiêu đề" : "Title"}</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>{language === "vi" ? "Độ khó" : "Difficulty"}</TableColumn>
                <TableColumn>{language === "vi" ? "Gắn thẻ" : "Tags"}</TableColumn>
                <TableColumn>{language === "vi" ? "Thao tác" : "Actions"}</TableColumn>
                <TableColumn className="w-[40%]">TITLE & SLUG</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>DIFFICULTY</TableColumn>
                <TableColumn>SUBMITTED</TableColumn>
                <TableColumn align="center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No problems waiting for approval">
                {pendingProblems.map((prob) => (
                  <TableRow key={prob.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white group-hover/row:text-[#3B5BFF] transition-colors">{prob.title}</span>
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">{prob.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-black uppercase italic text-white/30 border border-white/5 px-2 py-0.5 rounded-md bg-white/5">Algorithm</span>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase border" style={difficultyStyle(prob.difficulty)}>{prob.difficulty}</div>
                    </TableCell>
                    <TableCell className="text-white/30 font-bold text-[11px]">{new Date(prob.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell><ActionButtons prob={prob} isPending={true} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tab>

        <Tab key="approved" title={`Published Problems (${approvedProblems.length})`}>
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 mt-6" style={{ background: "#162035" }}>
            <Table
              aria-label="Approved Table"
              removeWrapper
              classNames={{
                th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-widest border-b border-white/[0.08] py-5 px-6",
                td: "py-5 px-6 text-sm border-b border-white/[0.05] text-white/80",
                tr: "hover:bg-white/[0.03] transition-colors group/row",
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
                <TableColumn className="w-[30%]">PROBLEM</TableColumn>
                <TableColumn>LEVEL</TableColumn>
                <TableColumn>LIMITS</TableColumn>
                <TableColumn align="center">ACCEPTANCE</TableColumn>
                <TableColumn align="center">VISIBILITY</TableColumn>
                <TableColumn align="center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No published problems found">
                {approvedProblems.map((prob) => (
                  <TableRow key={prob.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white group-hover/row:text-[#3B5BFF] transition-colors">{prob.title}</span>
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">{prob.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase border" style={difficultyStyle(prob.difficulty)}>{prob.difficulty}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 italic"><Clock size={11} /> {(prob.timeLimitMs / 1000).toFixed(1)}s</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 italic"><Database size={11} /> {(prob.memoryLimitKb / 1024).toFixed(0)}MB</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-xs font-black italic" style={{ color: (prob.acceptancePercent ?? 0) > 60 ? "#10B981" : "#F59E0B" }}>
                          {prob.acceptancePercent?.toFixed(1) || "0.0"}%
                        </div>
                        <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${prob.acceptancePercent || 0}%`, background: (prob.acceptancePercent ?? 0) > 60 ? "#10B981" : "#F59E0B" }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center"><Switch isSelected={prob.statusCode === "published"} size="sm" classNames={{ wrapper: "group-data-[selected=true]:bg-[#3B5BFF]" }} /></div>
                    </TableCell>
                    <TableCell><ActionButtons prob={prob} isPending={false} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      {/* MODALS remain mostly same but with refined dark styles */}
      <Modal isOpen={isApproveModalOpen} onOpenChange={setIsApproveModalOpen} size="sm" classNames={{ base: "dark bg-[#0E1420] text-white border border-white/10" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" size={24} /> Approve Problem
              </ModalHeader>
              <ModalBody>
                <p className="text-white/60">Are you sure to <strong>APPROVE</strong> and publish:</p>
                <p className="font-bold text-white mt-2 text-lg italic tracking-tight">{selectedProblem?.title}</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" className="bg-white/5 text-white" onPress={onClose}>Cancel</Button>
                <Button className="bg-emerald-500 text-white font-bold" onPress={confirmApprove}>Confirm & Publish</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isRejectModalOpen} onOpenChange={setIsRejectModalOpen} size="md" classNames={{ base: "dark bg-[#0E1420] text-white border border-white/10" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase flex items-center gap-3">
                <XCircle className="text-red-500" size={24} /> Reject Problem
              </ModalHeader>
              <ModalBody className="space-y-4">
                <p className="text-white/60">Provide reason for rejecting:</p>
                <p className="font-bold text-white text-lg italic">{selectedProblem?.title}</p>
                <Textarea minRows={3} placeholder="Explain what needs to be improved..." value={rejectionReason} onValueChange={setRejectionReason} classNames={{ input: "text-white", inputWrapper: "bg-white/5 border border-white/10 focus-within:!border-red-500" }} />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" className="bg-white/5 text-white" onPress={onClose}>Cancel</Button>
                <Button color="danger" className="font-bold" onPress={confirmReject} isDisabled={!rejectionReason.trim()}>Confirm Reject</Button>
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
      <AttachTagsModal isOpen={tagsModal.isOpen} onOpenChange={tagsModal.onOpenChange} problem={selectedProblemForTags as any} />
    </div>
  );
}