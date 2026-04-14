"use client";

import { useState, useEffect } from "react";
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
} from "@heroui/react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  BookOpen, // Icon cho nút Editorial (có thể thay bằng FileText hoặc Edit3 nếu thích)
  MoreVertical,
  Download,
  UploadCloud,
  FileArchive,
} from "lucide-react";
import CreateProblem from "./CreateProblem";
import EditProblem from "./EditProblem";
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

  // Lọc dữ liệu
  const pendingProblems = problems.filter((p) => p.statusCode === "draft");
  const approvedProblems = problems.filter((p) => p.statusCode === "published");

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
          <TableCell colSpan={7}>
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
          <TableCell colSpan={7} className="text-center py-20">
            <div className="flex flex-col items-center gap-6 text-slate-500 opacity-0 animate-fade-in-up"  style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <AlertTriangle size={64} className="text-amber-500 opacity-70" />
              <div className="text-center">
                <p className="text-xl font-bold">{language === 'vi' ? "Không có câu hỏi chờ duyệt" : "No problems pending approval"}</p>
                <p className="text-sm mt-2">{language === 'vi' ? "Tất cả các câu hỏi đã được duyệt hoặc chưa có bài tập nào." : "All submitted problems have been reviewed or none are waiting."}</p>
              </div>
              <Button
                color="primary"
                startContent={<Plus size={18} />}
                onPress={() => setIsCreatingProblem(true)}
                className="font-black uppercase tracking-wider mt-4 active-bump"
              >
                {t('admin_problem.create') || (language === 'vi' ? "Tạo bài tập mới" : "Create New Problem")}
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return pendingProblems.map((prob, index) => (
      <TableRow key={prob.id} className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: `${index * 50 + 100}ms` }}>
        <TableCell>
          <div className="font-bold">{prob.title}</div>
          <div className="text-xs text-slate-500">{prob.slug}</div>
        </TableCell>
        <TableCell>
          <Chip variant="flat" color="secondary" size="sm">
            ALGORITHM
          </Chip>
        </TableCell>
        <TableCell>
          <Chip
            size="sm"
            color={
              prob.difficulty === "easy" ? "success" :
              prob.difficulty === "medium" ? "warning" :
              prob.difficulty === "hard" ? "danger" : "default"
            }
          >
            {prob.difficulty}
          </Chip>
        </TableCell>
        <TableCell>100</TableCell>
        <TableCell>Unknown</TableCell>
        <TableCell className="text-slate-500">{new Date(prob.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              color="success"
              className="active-bump"
              onPress={() => handleApprove(prob)}
            >
              <CheckCircle2 size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              color="danger"
              className="active-bump"
              onPress={() => handleReject(prob)}
            >
              <XCircle size={16} />
            </Button>
            <Button isIconOnly size="sm" className="active-bump">
              <Eye size={16} />
            </Button>
            <Button 
              isIconOnly 
              size="sm" 
              className="active-bump"
              onPress={() => setEditProblemId(prob.id)}
            >
              <Pencil size={16} />
            </Button>
            {/* Nút mới: Chuyển đến trang edit Editorial */}
            <Button
              isIconOnly
              size="sm"
              color="default" // hoặc primary/warning tùy thích
              className="active-bump"
              onPress={() => router.push(`Problem/${prob.id}/Editorial`)}
              title="Chỉnh sửa Editorial"
            >
              <BookOpen size={16} />
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="flat">
                  <MoreVertical size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Extra Actions">
                <DropdownItem
                  key="upload"
                  startContent={<UploadCloud size={14} />}
                  onPress={() => alert("Upload New Solution triggered")}
                >
                  Upload New Solution
                </DropdownItem>
                <DropdownItem
                  key="dl_testset"
                  startContent={<FileArchive size={14} />}
                  onPress={() => alert("Download Testset triggered")}
                >
                  Download Testset
                </DropdownItem>
                <DropdownItem
                  key="dl_solution"
                  startContent={<Download size={14} />}
                  onPress={() => alert("Download Solution triggered")}
                >
                  Download Solution
                </DropdownItem>
                <DropdownItem
                  key="set_score"
                  startContent={<Pencil size={14} />}
                  onPress={() => alert("Set Problem Score triggered")}
                >
                  Set Problem Score
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
          <TableCell colSpan={9} className="text-center py-20 text-slate-500">
            No approved or public problems yet
          </TableCell>
        </TableRow>
      );
    }

    return approvedProblems.map((prob, index) => (
      <TableRow key={prob.id} className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "both", animationDelay: `${index * 50 + 100}ms` }}>
        <TableCell>
          <div className="font-bold">{prob.title}</div>
          <div className="text-xs text-slate-500">{prob.slug}</div>
        </TableCell>
        <TableCell>
          <Chip variant="flat" color="secondary" size="sm">
            ALGORITHM
          </Chip>
        </TableCell>
        <TableCell>
          <Chip
            size="sm"
            color={
              prob.difficulty === "easy" ? "success" :
              prob.difficulty === "medium" ? "warning" :
              prob.difficulty === "hard" ? "danger" : "default"
            }
          >
            {prob.difficulty}
          </Chip>
        </TableCell>
        <TableCell>100</TableCell>
        <TableCell>
            <div className="text-xs">
              <Clock size={14} className="inline mr-1" />
              {(prob.timeLimitMs / 1000).toFixed(1)}s
              <br />
              <Database size={14} className="inline mr-1" />
              {(prob.memoryLimitKb / 1024).toFixed(0)}MB
            </div>
        </TableCell>
        <TableCell>0</TableCell>
        <TableCell>
          <span className={prob.acceptancePercent && prob.acceptancePercent > 60 ? "text-emerald-500" : "text-amber-500"}>
            {prob.acceptancePercent?.toFixed(1) || "—"}%
          </span>
        </TableCell>
        <TableCell>
          <Switch isSelected={prob.statusCode === "published"} size="sm" />
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button 
              isIconOnly 
              size="sm" 
              className="active-bump"
              onPress={() => setEditProblemId(prob.id)}
            >
              <Pencil size={16} />
            </Button>
            <Button isIconOnly size="sm" className="active-bump">
              <Eye size={16} />
            </Button>
            <Button isIconOnly size="sm" color="danger" className="active-bump">
              <Trash2 size={16} />
            </Button>
            {/* Nút mới: Chuyển đến trang edit Editorial */}
            <Button
              isIconOnly
              size="sm"
              color="default"
              className="active-bump"
              onPress={() => router.push(`/problems/${prob.id}/editorial`)}
              title="Chỉnh sửa Editorial"
            >
              <BookOpen size={16} />
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="flat">
                  <MoreVertical size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Extra Actions">
                <DropdownItem
                  key="upload"
                  startContent={<UploadCloud size={14} />}
                  onPress={() => alert("Upload New Solution triggered")}
                >
                  Upload New Solution
                </DropdownItem>
                <DropdownItem
                  key="dl_testset"
                  startContent={<FileArchive size={14} />}
                  onPress={() => alert("Download Testset triggered")}
                >
                  Download Testset
                </DropdownItem>
                <DropdownItem
                  key="dl_solution"
                  startContent={<Download size={14} />}
                  onPress={() => alert("Download Solution triggered")}
                >
                  Download Solution
                </DropdownItem>
                <DropdownItem
                  key="set_score"
                  startContent={<Pencil size={14} />}
                  onPress={() => alert("Set Problem Score triggered")}
                >
                  Set Problem Score
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            {t('sidebar.problem') || (language === 'vi' ? "BÀI TẬP" : "PROBLEM")} <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 mt-1">
            {language === 'vi' ? "XÉT DUYỆT, QUẢN LÝ DANH SÁCH BÀI TẬP VÀ LÝ THUYẾT" : "REVIEW, APPROVE/REJECT & MONITOR PROGRAMMING & THEORY PROBLEMS"}
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="bordered"
            startContent={<RefreshCw size={16} />}
            onPress={refreshData}
            isLoading={isLoading || isQueryLoading}
            className="active-bump"
          >
            {language === 'vi' ? "Làm Mới" : "Refresh"}
          </Button>
          <Button
            className="bg-[#0B1C3D] text-white font-black active-bump"
            startContent={<Plus size={16} />}
            onPress={() => setIsCreatingProblem(true)}
          >
            {language === 'vi' ? "Tạo Bài Mới" : "Create New Problem"}
          </Button>
        </div>
      </div>

      {/* TABS - Mặc định mở Pending Approval */}
      <Tabs
        defaultSelectedKey="pending"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-8 border-b border-slate-200 dark:border-white/10 pb-2",
          tab: "text-lg font-black uppercase tracking-wide",
          cursor: "bg-[#FF5C00] h-1",
        }}
      >
        <Tab title={language === 'vi' ? `Chờ duyệt (${pendingProblems.length})` : `Pending Approval (${pendingProblems.length})`}>
          <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <Table aria-label="Pending Approval Problems" removeWrapper>
              <TableHeader>
                <TableColumn>{language === 'vi' ? "TIÊU ĐỀ / SLUG" : "TITLE / SLUG"}</TableColumn>
                <TableColumn>{language === 'vi' ? "THỂ LOẠI" : "TYPE"}</TableColumn>
                <TableColumn>{language === 'vi' ? "ĐỘ KHÓ" : "DIFFICULTY"}</TableColumn>
                <TableColumn>{language === 'vi' ? "ĐIỂM" : "POINTS"}</TableColumn>
                <TableColumn>{language === 'vi' ? "TÁC GIẢ" : "SUBMITTED BY"}</TableColumn>
                <TableColumn>{language === 'vi' ? "TẠO LÚC" : "SUBMITTED AT"}</TableColumn>
                <TableColumn>{language === 'vi' ? "THAO TÁC" : "ACTIONS"}</TableColumn>
              </TableHeader>
              <TableBody>{renderPendingBody()}</TableBody>
            </Table>
          </div>
        </Tab>

        <Tab title={language === 'vi' ? `Công khai (${approvedProblems.length})` : `Approved / Public (${approvedProblems.length})`}>
          <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <Table aria-label="Approved Problems" removeWrapper>
              <TableHeader>
                <TableColumn>{language === 'vi' ? "TIÊU ĐỀ / SLUG" : "TITLE / SLUG"}</TableColumn>
                <TableColumn>{language === 'vi' ? "THỂ LOẠI" : "TYPE"}</TableColumn>
                <TableColumn>{language === 'vi' ? "ĐỘ KHÓ" : "DIFFICULTY"}</TableColumn>
                <TableColumn>{language === 'vi' ? "ĐIỂM" : "POINTS"}</TableColumn>
                <TableColumn>{language === 'vi' ? "T/G / BN" : "TIME / MEM"}</TableColumn>
                <TableColumn>{language === 'vi' ? "LƯỢT NỘP" : "SUBMISSIONS"}</TableColumn>
                <TableColumn>{language === 'vi' ? "TỈ LỆ ĐÚNG" : "ACCEPT %"}</TableColumn>
                <TableColumn>{language === 'vi' ? "C.KHAI" : "PUBLIC"}</TableColumn>
                <TableColumn>{language === 'vi' ? "THAO TÁC" : "ACTIONS"}</TableColumn>
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
                <p className="text-sm text-slate-500">by Unknown</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="success" onPress={confirmApprove}>
                  Approve & Publish
                </Button>
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
                <p>Provide reason for rejection (will be sent to author):</p>
                <p className="font-medium">{selectedProblem?.title}</p>
                <Textarea
                  minRows={3}
                  placeholder="Rejection reason..."
                  value={rejectionReason}
                  onValueChange={setRejectionReason}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={confirmReject} isDisabled={!rejectionReason.trim()}>
                  Reject
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}