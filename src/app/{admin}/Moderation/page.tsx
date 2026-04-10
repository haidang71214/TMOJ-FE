"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Input,
  Chip,
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
  Select,
  SelectItem,
  Card,
  CardBody,
  Textarea,
  Spinner,
  Pagination,
} from "@heroui/react";
import {
  Flag,
  ShieldAlert,
  Ban,
  AlertTriangle,
  Users,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { 
  useGetAllReportsQuery, 
  useLazyGetAllReportsQuery,
  useApproveReportMutation, 
  useRejectReportMutation,
  useGetReportByIdQuery
} from "@/store/queries/reports";
import { useLockUserMutation } from "@/store/queries/user";
import { useHideCommentMutation, useDeleteDiscussionMutation } from "@/store/queries/discussion";
import { ReportItem } from "@/types";
import { toast } from "sonner";
import { BannedUsersModal } from "./BannedUsersModal";

export default function ModerationManagementPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: allReportsRes, isLoading, refetch } = useGetAllReportsQuery({
    targetType: typeFilter,
    status: statusFilter,
  });

  let reports: ReportItem[] = allReportsRes?.data || [];

  if (typeFilter !== "all") {
    reports = reports.filter((r) => r.targetType?.toLowerCase() === typeFilter.toLowerCase());
  }
  if (statusFilter !== "all") {
    reports = reports.filter((r) => r.status?.toLowerCase() === statusFilter.toLowerCase());
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    reports = reports.filter(
      (r) =>
        r.reason?.toLowerCase().includes(q) ||
        r.targetId?.toLowerCase().includes(q)
    );
  }

  const rowsPerPage = 20;
  const pages = Math.ceil(reports.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reports.slice(start, end);
  }, [page, reports]);

  const [approveReport, { isLoading: isApproving }] = useApproveReportMutation();
  const [rejectReport, { isLoading: isRejecting }] = useRejectReportMutation();

  const [triggerGetAllReports] = useLazyGetAllReportsQuery();
  const [lockUser] = useLockUserMutation();
  const [hideComment] = useHideCommentMutation();
  const [deleteDiscussion] = useDeleteDiscussionMutation();

  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [bannedUsersModalOpen, setBannedUsersModalOpen] = useState(false);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReportForDetails, setSelectedReportForDetails] = useState<ReportItem | null>(null);

  const { data: reportDetailRes, isLoading: isLoadingDetail } = useGetReportByIdQuery(
    { id: selectedReportForDetails?.id as string },
    { skip: !selectedReportForDetails?.id }
  );
  
  const reportDetail = reportDetailRes?.data || selectedReportForDetails;

  const handleTakeAction = async (action: "approve" | "reject") => {
    if (!selectedReport) return;
    try {
      if (action === "approve") {
        await approveReport({ id: selectedReport.id }).unwrap();
        toast.success("Báo cáo đã được phê duyệt hợp lệ.");

        try {
          // Lấy TẤT CẢ report để tránh các lỗi filter từ backend và case sensitivity
          const allRes = await triggerGetAllReports(undefined, false).unwrap();
          const allData = allRes.data || [];

          // Tìm các report cùng một đối tượng (bỏ qua case sensitivity của targetType)
          const targetReports = allData.filter((r: any) => r.targetId === selectedReport.targetId);
          
          // Đếm số lượng report đã bị duyệt (bao gồm cái hiện tại nếu nó chưa đc update phản hồi kịp trong API)
          let approvedCount = targetReports.filter((r: any) => r.status?.toLowerCase() === "approved").length;
          const isCurrentInApproved = targetReports.some((r: any) => r.id === selectedReport.id && r.status?.toLowerCase() === "approved");
          if (!isCurrentInApproved) {
            approvedCount += 1;
          }

          let thresholdReached = false;
          const rawType = selectedReport.targetType || "";
          const type = rawType.toLowerCase();

          // DETERMINE IF THRESHOLD IS REACHED
          if (type === "comment") {
            if (approvedCount >= 3) thresholdReached = true;
          } else if (type === "discussion") {
            if (approvedCount >= 3) thresholdReached = true;
          } else {
            // User target
            if (approvedCount >= 5) thresholdReached = true;
          }

          // 1) AUTO APPROVE REST OF PENDING REPORTS (Run FIRST to avoid 400 error on locked/hidden targets)
          if (thresholdReached) {
            try {
              const pendingForTarget = targetReports.filter((r: any) => 
                r.id !== selectedReport.id && r.status?.toLowerCase() === "pending"
              );
              
              if (pendingForTarget.length > 0) {
                let successCount = 0;
                for (const pr of pendingForTarget) {
                  try {
                    // Cố tình không gửi moderatorNote vì có thể DTO của backend sẽ block và quăng lỗi 400 
                    // nếu gửi chuỗi có dấu hoặc body field không đúng.
                    await approveReport({ id: pr.id }).unwrap();
                    successCount++;
                  } catch (subErr) {
                    console.error("Lỗi khi auto duyệt:", pr.id, subErr);
                  }
                }
                if (successCount > 0) {
                  toast.success(`Đã tự động duyệt ${successCount} báo cáo tương tự còn lại.`);
                }
              }
            } catch (e) {
              console.error("Error auto-approving remaining pending reports", e);
            }
          }

          // 2) EXECUTE AUTO ACTION ON TARGET (Lock/Hide/Delete)
          if (type === "comment") {
            if (thresholdReached) {
              try {
                await hideComment({ commentId: selectedReport.targetId, isHidden: true }).unwrap();
                toast.success(`Bình luận đã bị ẩn tự động do vi phạm ${approvedCount} lần!`);
              } catch (e: any) {
                toast.error(`Auto-hide comment failed: ${e?.data?.message || e?.message}`);
                console.error("Hide comment error", e);
              }
            }
          } else if (type === "discussion") {
            if (thresholdReached) {
              try {
                await deleteDiscussion({ id: selectedReport.targetId }).unwrap();
                toast.success(`Bài đăng thảo luận đã bị xóa tự động do vi phạm ${approvedCount} lần!`);
              } catch (e: any) {
                toast.error(`Auto-delete discussion failed: ${e?.data?.message || e?.message}`);
                console.error("Delete discussion error", e);
              }
            }
          } else {
            // Xem như mọi type khác (User, Account, Profile...) đều là User
            if (thresholdReached) {
              try {
                // Thử thay string thành uppercase nếu backend bắt validation url path, bằng không thì nó sẽ là targetId bt
                await lockUser(selectedReport.targetId).unwrap();
                toast.success(`Tài khoản ${selectedReport.targetId} đã bị khóa tự động do vi phạm ${approvedCount} lần!`);
              } catch (e: any) {
                toast.error(`Auto-lock user failed: ${e?.data?.message || e?.message}`);
                console.error("Lock error", e);
              }
            }
          }
        } catch(err: any) {
          console.error("Lỗi khi đếm số report và auto-action:", err);
          toast.error("Process error: " + err?.message);
        }

      } else if (action === "reject") {
        await rejectReport({ id: selectedReport.id }).unwrap();
        toast.success("Báo cáo đã bị từ chối.");
      }
      setActionModalOpen(false);
      setSelectedReport(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Đã xảy ra lỗi hệ thống khi duyệt");
    }
  };

  const pendingCount = reports.filter(r => r.status === "pending").length;
  const inReviewCount = reports.filter(r => r.status === "in_review").length;
  const resolvedCount = reports.filter(r => r.status === "approved" || r.status === "rejected").length;

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase">
            Moderation & <span className="text-[#FF5C00]">Reports</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Manage reported content, flags, queue & moderation actions
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="bordered" 
            startContent={<Users size={16} />}
            onPress={() => setBannedUsersModalOpen(true)}
          >
            Banned Users
          </Button>
          <Button className="bg-[#0B1C3D] text-white font-black" startContent={<Flag size={16} />}>
            View Queue
          </Button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-linear-to-br from-amber-500/10 to-red-500/10">
          <CardBody className="text-center">
            <div className="text-4xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
              <AlertTriangle size={14} /> Pending Reports
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-red-600">{inReviewCount}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">In Review</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-emerald-600">{resolvedCount}</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">Resolved This Week</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-purple-600">--</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
              <Ban size={14} /> Active Bans
            </div>
          </CardBody>
        </Card>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input 
          placeholder="Search reason or id..." 
          className="max-w-xs" 
          value={searchQuery}
          onValueChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
        />
        <Select 
          placeholder="Type" 
          className="w-36"
          selectedKeys={new Set([typeFilter])}
          onChange={(e) => {
            setTypeFilter(e.target.value || "all");
            setPage(1);
          }}
        >
          <SelectItem key="all">All Types</SelectItem>
          <SelectItem key="comment">Comment</SelectItem>
          <SelectItem key="discussion">Discussion</SelectItem>
        </Select>
        <Select 
          placeholder="Status" 
          className="w-36"
          selectedKeys={new Set([statusFilter])}
          onChange={(e) => {
            setStatusFilter(e.target.value || "all");
            setPage(1);
          }}
        >
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="approved">Approved</SelectItem>
          <SelectItem key="rejected">Rejected</SelectItem>
        </Select>
      </div>

      {/* REPORTS TABLE */}
      <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden">
        <Table 
          aria-label="Reports" 
          removeWrapper
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center pb-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>REASON (VIOLATION)</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>TARGET ID</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={isLoading ? <Spinner size="lg" color="primary"/> : "Không có báo cáo nào."}
          >
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Chip variant="flat" color="secondary" size="sm">
                    {r.targetType?.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate font-medium">
                    {r.reason}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={
                      r.status === "pending" ? "warning" :
                      r.status === "approved" ? "danger" :
                      "default"
                    }
                  >
                    {r.status.toUpperCase()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-slate-500 text-xs truncate max-w-[150px] inline-block" title={r.targetId}>
                    {r.targetId}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(r.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      onPress={() => {
                        setSelectedReport(r);
                        setActionModalOpen(true);
                      }}
                    >
                      <ShieldAlert size={16} />
                    </Button>
                    <Button 
                      isIconOnly 
                      size="sm"
                      onPress={() => {
                        setSelectedReportForDetails(r);
                        setDetailsModalOpen(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL VIEW DETAILS */}
      <Modal isOpen={detailsModalOpen} onOpenChange={setDetailsModalOpen} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-black uppercase">
                Report Details <span className="text-slate-500 ml-2">#{selectedReportForDetails?.id?.substring(0, 8)}...</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                {isLoadingDetail ? (
                  <div className="flex justify-center p-6"><Spinner /></div>
                ) : (
                  <>
                    <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl space-y-4">
                      <div>
                        <div className="font-bold text-sm text-slate-500">Reported Reason</div>
                        <p className="text-base font-medium">{reportDetail?.reason}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-bold text-xs text-slate-500">Target Type</div>
                          <p className="font-medium text-sm">{reportDetail?.targetType}</p>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-500">Target ID</div>
                          <p className="font-medium text-sm truncate" title={reportDetail?.targetId}>{reportDetail?.targetId}</p>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-500">Status</div>
                          <Chip size="sm" color={reportDetail?.status === "pending" ? "warning" : reportDetail?.status === "approved" ? "danger" : "default"}>
                            {reportDetail?.status?.toUpperCase()}
                          </Chip>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-500">Reported At</div>
                          <p className="font-medium text-sm">{new Date(reportDetail?.createdAt || "").toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {((reportDetail as any)?.adminNote) && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="font-bold text-sm text-blue-800 dark:text-blue-300 mb-2">Lý do xử lý của admin</div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          {(reportDetail as any).adminNote}
                        </p>
                        {(reportDetail as any).resolvedAt && (
                          <div className="text-xs text-blue-500 mt-2">
                            Resolved at: {new Date((reportDetail as any).resolvedAt).toLocaleString()}
                          </div>
                        )}
                        {(reportDetail as any).resolvedBy && (
                          <div className="text-xs text-blue-500 mt-1">
                            Resolved by: {(reportDetail as any).resolvedBy}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL TAKE ACTION */}
      <Modal isOpen={actionModalOpen} onOpenChange={setActionModalOpen} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-black uppercase">
                Moderate Report <span className="text-[#FF5C00] ml-2">#{selectedReport?.id?.substring(0, 8)}...</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl">
                  <div className="font-medium mb-2">Reported Reason:</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {selectedReport?.reason}
                  </p>
                  <div className="font-medium mt-4 mb-2">Target Type & ID:</div>
                  <p className="text-xs text-slate-500">
                    {selectedReport?.targetType} - {selectedReport?.targetId}
                  </p>
                </div>

                <div>
                  <div className="font-black uppercase text-sm tracking-widest mb-3">
                    Moderation Actions
                  </div>
                  
                  {selectedReport?.status === "pending" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<CheckCircle size={16} />}
                        className="justify-start text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                        onPress={() => handleTakeAction("approve")}
                        isLoading={isApproving || isRejecting}
                      >
                        Approve (Hide Content)
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<XCircle size={16} />}
                        className="justify-start text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
                        onPress={() => handleTakeAction("reject")}
                        isLoading={isApproving || isRejecting}
                      >
                        Reject (Ignore)
                      </Button>
                    </div>
                  ) : (
                   <p className="text-sm text-slate-500 font-bold italic">
                     Báo cáo này đã được duyệt (Status: {selectedReport?.status.toUpperCase()}).
                   </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} isDisabled={isApproving || isRejecting}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <BannedUsersModal 
        isOpen={bannedUsersModalOpen}
        onOpenChange={setBannedUsersModalOpen}
      />
    </div>
  );
}