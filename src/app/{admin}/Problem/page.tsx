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
import { useGetProblemListQueryQuery } from "@/store/queries/problem";
import { Problem } from "@/types";
import { useEffect } from "react";

export default function ProblemManagementPage() {
  const router = useRouter();
  
  // Use the API query
  const { data: problemListData, isLoading: isQueryLoading, refetch } = useGetProblemListQueryQuery();
  // Safe extraction of the problem array
  const apiProblems: Problem[] = problemListData?.data || [];

  // We still need local state if we want optimistic updates for Approve/Reject 
  // before building out the mutations for them.
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);

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
            <div className="flex flex-col items-center gap-6 text-slate-500">
              <AlertTriangle size={64} className="text-amber-500 opacity-70" />
              <div className="text-center">
                <p className="text-xl font-bold">No problems pending approval</p>
                <p className="text-sm mt-2">All submitted problems have been reviewed or none are waiting.</p>
              </div>
              <Button
                color="primary"
                startContent={<Plus size={18} />}
                onPress={() => setIsCreatingProblem(true)}
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

    return approvedProblems.map((prob) => (
      <TableRow key={prob.id}>
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
            isLoading={isLoading || isQueryLoading}
          >
            Refresh
          </Button>
          <Button
            className="bg-[#0B1C3D] text-white font-black"
            startContent={<Plus size={16} />}
            onPress={() => setIsCreatingProblem(true)}
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