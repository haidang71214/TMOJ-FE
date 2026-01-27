"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Thêm để chuyển trang
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
} from "lucide-react";

// Type Problem (giữ nguyên)
interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  points: number;
  problem_type: "coding" | "theory" | "quiz" | "reading";
  time_limit_ms: number;
  memory_limit_kb: number;
  status: "pending_review" | "approved" | "rejected";
  is_public: boolean;
  submissions_count?: number;
  accepted_rate?: number;
  created_at: string;
  created_by_username: string;
  rejection_reason?: string;
}

// Mock data (giữ nguyên)
const MOCK_PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "easy",
    points: 100,
    problem_type: "coding",
    time_limit_ms: 1000,
    memory_limit_kb: 128000,
    status: "approved",
    is_public: true,
    submissions_count: 1247,
    accepted_rate: 68.4,
    created_at: "2025-11-15",
    created_by_username: "teacher1",
  },
  {
    id: "p2",
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "medium",
    points: 200,
    problem_type: "coding",
    time_limit_ms: 2000,
    memory_limit_kb: 256000,
    status: "approved",
    is_public: true,
    submissions_count: 856,
    accepted_rate: 42.1,
    created_at: "2025-12-05",
    created_by_username: "admin",
  },
  {
    id: "p3",
    title: "Advanced Graph Shortest Path",
    slug: "advanced-graph-path",
    difficulty: "hard",
    points: 350,
    problem_type: "coding",
    time_limit_ms: 3000,
    memory_limit_kb: 512000,
    status: "pending_review",
    is_public: false,
    submissions_count: 0,
    accepted_rate: 0,
    created_at: "2026-01-25",
    created_by_username: "teacher_hai",
  },
  {
    id: "p4",
    title: "Database Normalization Quiz",
    slug: "db-normalization-quiz",
    difficulty: "medium",
    points: 80,
    problem_type: "quiz",
    time_limit_ms: 0,
    memory_limit_kb: 0,
    status: "pending_review",
    is_public: false,
    submissions_count: 0,
    accepted_rate: 0,
    created_at: "2026-01-26",
    created_by_username: "lecturer_khoa",
  },
  {
    id: "p5",
    title: "Old Problem - Duplicate",
    slug: "old-duplicate",
    difficulty: "easy",
    points: 50,
    problem_type: "theory",
    time_limit_ms: 0,
    memory_limit_kb: 0,
    status: "rejected",
    is_public: false,
    submissions_count: 0,
    accepted_rate: 0,
    created_at: "2026-01-20",
    created_by_username: "user_test",
    rejection_reason: "Duplicate content with existing problem #p1",
  },
];

export default function ProblemManagementPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Lọc dữ liệu
  const pendingProblems = problems.filter((p) => p.status === "pending_review");
  const approvedProblems = problems.filter((p) => p.status === "approved");
  const rejectedProblems = problems.filter((p) => p.status === "rejected");

  const handleApprove = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsApproveModalOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedProblem) return;
    setProblems((prev) =>
      prev.map((p) =>
        p.id === selectedProblem.id ? { ...p, status: "approved", is_public: true } : p
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
          ? { ...p, status: "rejected", rejection_reason: rejectionReason }
          : p
      )
    );
    setIsRejectModalOpen(false);
    setSelectedProblem(null);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProblems([...MOCK_PROBLEMS]);
      setIsLoading(false);
    }, 800);
  };

  // Render body cho Pending tab
  const renderPendingBody = () => {
    if (isLoading) {
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
            <div className="flex flex-col items-center gap-6 text-slate-500">
              <AlertTriangle size={64} className="text-amber-500 opacity-70" />
              <div className="text-center">
                <p className="text-xl font-bold">No problems pending approval</p>
                <p className="text-sm mt-2">All submitted problems have been reviewed or none are waiting.</p>
              </div>
              <Button
                color="primary"
                startContent={<Plus size={18} />}
                onPress={() => alert("Open create problem modal - not implemented yet")}
                className="font-black uppercase tracking-wider mt-4"
              >
                Create New Problem
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return pendingProblems.map((prob) => (
      <TableRow key={prob.id}>
        <TableCell>
          <div className="font-bold">{prob.title}</div>
          <div className="text-xs text-slate-500">{prob.slug}</div>
        </TableCell>
        <TableCell>
          <Chip variant="flat" color="secondary" size="sm">
            {prob.problem_type.toUpperCase()}
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
            {prob.difficulty.toUpperCase()}
          </Chip>
        </TableCell>
        <TableCell>{prob.points}</TableCell>
        <TableCell className="font-medium">{prob.created_by_username}</TableCell>
        <TableCell className="text-slate-500">{prob.created_at}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              color="success"
              onPress={() => handleApprove(prob)}
            >
              <CheckCircle2 size={16} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              color="danger"
              onPress={() => handleReject(prob)}
            >
              <XCircle size={16} />
            </Button>
            <Button isIconOnly size="sm">
              <Eye size={16} />
            </Button>
            <Button isIconOnly size="sm">
              <Pencil size={16} />
            </Button>
            {/* Nút mới: Chuyển đến trang edit Editorial */}
            <Button
              isIconOnly
              size="sm"
              color="default" // hoặc primary/warning tùy thích
              onPress={() => router.push(`Problem/${prob.id}/Editorial`)}
              title="Chỉnh sửa Editorial"
            >
              <BookOpen size={16} />
            </Button>
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

    return approvedProblems.map((prob) => (
      <TableRow key={prob.id}>
        <TableCell>
          <div className="font-bold">{prob.title}</div>
          <div className="text-xs text-slate-500">{prob.slug}</div>
        </TableCell>
        <TableCell>
          <Chip variant="flat" color="secondary" size="sm">
            {prob.problem_type.toUpperCase()}
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
            {prob.difficulty.toUpperCase()}
          </Chip>
        </TableCell>
        <TableCell>{prob.points}</TableCell>
        <TableCell>
          {prob.problem_type === "coding" ? (
            <div className="text-xs">
              <Clock size={14} className="inline mr-1" />
              {(prob.time_limit_ms / 1000).toFixed(1)}s
              <br />
              <Database size={14} className="inline mr-1" />
              {(prob.memory_limit_kb / 1024).toFixed(0)}MB
            </div>
          ) : "-"}
        </TableCell>
        <TableCell>{prob.submissions_count?.toLocaleString() || "0"}</TableCell>
        <TableCell>
          <span className={prob.accepted_rate && prob.accepted_rate > 60 ? "text-emerald-500" : "text-amber-500"}>
            {prob.accepted_rate?.toFixed(1) || "—"}%
          </span>
        </TableCell>
        <TableCell>
          <Switch isSelected={prob.is_public} size="sm" />
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button isIconOnly size="sm">
              <Pencil size={16} />
            </Button>
            <Button isIconOnly size="sm">
              <Eye size={16} />
            </Button>
            <Button isIconOnly size="sm" color="danger">
              <Trash2 size={16} />
            </Button>
            {/* Nút mới: Chuyển đến trang edit Editorial */}
            <Button
              isIconOnly
              size="sm"
              color="default"
              onPress={() => router.push(`/problems/${prob.id}/editorial`)}
              title="Chỉnh sửa Editorial"
            >
              <BookOpen size={16} />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  // Render body cho Rejected tab
  const renderRejectedBody = () => {
    if (rejectedProblems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-20 text-slate-500">
            No rejected problems
          </TableCell>
        </TableRow>
      );
    }

    return rejectedProblems.map((prob) => (
      <TableRow key={prob.id}>
        <TableCell>
          <div className="font-bold">{prob.title}</div>
          <div className="text-xs text-slate-500">{prob.slug}</div>
        </TableCell>
        <TableCell>
          <Chip variant="flat" color="secondary" size="sm">
            {prob.problem_type.toUpperCase()}
          </Chip>
        </TableCell>
        <TableCell>
          <Chip size="sm" color="danger">
            {prob.difficulty.toUpperCase()}
          </Chip>
        </TableCell>
        <TableCell className="font-medium">{prob.created_by_username}</TableCell>
        <TableCell className="text-red-600 dark:text-red-400 text-sm">
          {prob.rejection_reason || "No reason provided"}
        </TableCell>
        <TableCell>{prob.created_at}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button isIconOnly size="sm">
              <Eye size={16} />
            </Button>
            {/* Nút mới: Chuyển đến trang edit Editorial (nếu muốn cho phép edit lại) */}
            <Button
              isIconOnly
              size="sm"
              color="default"
              onPress={() => router.push(`/problems/${prob.id}/editorial`)}
              title="Chỉnh sửa Editorial"
            >
              <BookOpen size={16} />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            PROBLEM <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 mt-1">
            REVIEW, APPROVE/REJECT & MONITOR PROGRAMMING & THEORY PROBLEMS
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="bordered"
            startContent={<RefreshCw size={16} />}
            onPress={refreshData}
            isLoading={isLoading}
          >
            Refresh
          </Button>
          <Button
            className="bg-[#0B1C3D] text-white font-black"
            startContent={<Plus size={16} />}
          >
            Create New Problem
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
        <Tab title={`Pending Approval (${pendingProblems.length})`}>
          <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <Table aria-label="Pending Approval Problems" removeWrapper>
              <TableHeader>
                <TableColumn>TITLE / SLUG</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>DIFFICULTY</TableColumn>
                <TableColumn>POINTS</TableColumn>
                <TableColumn>SUBMITTED BY</TableColumn>
                <TableColumn>SUBMITTED AT</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>{renderPendingBody()}</TableBody>
            </Table>
          </div>
        </Tab>

        <Tab title={`Approved / Public (${approvedProblems.length})`}>
          <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <Table aria-label="Approved Problems" removeWrapper>
              <TableHeader>
                <TableColumn>TITLE / SLUG</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>DIFFICULTY</TableColumn>
                <TableColumn>POINTS</TableColumn>
                <TableColumn>TIME / MEM</TableColumn>
                <TableColumn>SUBMISSIONS</TableColumn>
                <TableColumn>ACCEPT %</TableColumn>
                <TableColumn>PUBLIC</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>{renderApprovedBody()}</TableBody>
            </Table>
          </div>
        </Tab>

        <Tab title={`Rejected (${rejectedProblems.length})`}>
          <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <Table aria-label="Rejected Problems" removeWrapper>
              <TableHeader>
                <TableColumn>TITLE / SLUG</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>DIFFICULTY</TableColumn>
                <TableColumn>SUBMITTED BY</TableColumn>
                <TableColumn>REJECTION REASON</TableColumn>
                <TableColumn>SUBMITTED AT</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>{renderRejectedBody()}</TableBody>
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
                <p className="text-sm text-slate-500">by {selectedProblem?.created_by_username}</p>
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