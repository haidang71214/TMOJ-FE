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
  useGetReportByIdQuery
} from "@/store/queries/reports";
import { useGetUserListQuery } from "@/store/queries/user";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { ReportItem, UserRole } from "@/types";
import { BannedUsersModal } from "./BannedUsersModal";
import ModerateReportActionModal from "./ModerateReportActionModal";
import { useModal } from "@/Provider/ModalProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PAGE_URL } from "@/constants";

export default function ModerationManagementPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: allReportsRes, isLoading, refetch } = useGetAllReportsQuery({
    targetType: typeFilter,
    status: statusFilter,
  });
  const { data: userListRes } = useGetUserListQuery();
  const { data: currentUser } = useGetUserInformationQuery();

  console.log(allReportsRes);
  
  let reports: ReportItem[] = useMemo(() => {
    let rawReports = allReportsRes?.data || [];
    
    // Filter to only show reports where the author is a student and not the current user
    if (userListRes?.data) {
      rawReports = rawReports.filter((r: ReportItem) => {
        const author = userListRes.data.find(u => u.userId === r.authorId);
        if (!author) return false;
        
        const roleStr = (author.role || "").toLowerCase();
        const isPrivileged = 
          roleStr.includes("admin") || 
          roleStr.includes("teacher") || 
          roleStr.includes("manager") ||
          (author as any).roles?.some((r: any) => {
            const rs = String(r || "").toLowerCase();
            return rs.includes("admin") || rs.includes("teacher") || rs.includes("manager");
          });

        const isStudent = !isPrivileged;
        const isNotSelf = !currentUser?.userId || author.userId !== currentUser.userId;
        
        return isStudent && isNotSelf;
      });
    }
    
    return rawReports;
  }, [allReportsRes, userListRes, currentUser]);

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

  const { openModal } = useModal();
  const router = useRouter();
  const [bannedUsersModalOpen, setBannedUsersModalOpen] = useState(false);


  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReportForDetails, setSelectedReportForDetails] = useState<ReportItem | null>(null);

  const { data: reportDetailRes, isLoading: isLoadingDetail } = useGetReportByIdQuery(
    { id: selectedReportForDetails?.id as string },
    { skip: !selectedReportForDetails?.id }
  );
  
  const reportDetail = reportDetailRes?.data || selectedReportForDetails;


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

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Reports", value: pendingCount, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)" },
          { label: "In Review", value: inReviewCount, color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)" },
          { label: "Resolved", value: resolvedCount, color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
          { label: "Active Bans", value: "--", color: "#C084FC", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.15)" },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-5 border text-center" style={{ background: stat.bg, borderColor: stat.border }}>
            <div className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>{stat.label}</div>
          </div>
        ))}
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
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#162035", border: "1px solid rgba(255,255,255,0.10)" }}
      >
        <Table
          aria-label="Reports"
          removeWrapper
          classNames={{
            th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-wider border-b border-white/[0.08]",
            td: "text-white/75 border-b border-white/[0.05] py-3",
            tr: "hover:bg-white/[0.03] transition-colors",
          }}
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
            <TableColumn>AUTHOR</TableColumn>
            <TableColumn>PROBLEM ID</TableColumn>
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
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{r.authorName || "N/A"}</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">{r.authorId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {r.problemId ? (
                    <div 
                      onClick={() => window.location.href = `${PAGE_URL}/Problems/${r.problemId}`}
                      className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 transition-colors group cursor-pointer"
                    >
                      <span className="text-xs font-mono font-bold">{r.problemId}</span>
                      <Eye size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-slate-400">N/A</span>
                  )}
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
                  <span className="text-slate-500 text-xs truncate max-w-[100px] inline-block" title={r.targetId}>
                    {r.targetId}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(r.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {r.status === "pending" && (
                      <Button
                        isIconOnly
                        size="sm"
                        color="primary"
                        onPress={() => {
                          openModal({ content: <ModerateReportActionModal selectedReport={r} onSuccess={refetch} /> })
                        }}
                      >
                        <ShieldAlert size={16} />
                      </Button>
                    )}
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
                          <div className="font-bold text-xs text-slate-500">Author</div>
                          <p className="font-medium text-sm">{(reportDetail as any)?.authorName || "N/A"}</p>
                          <p className="text-[10px] text-slate-400">{(reportDetail as any)?.authorId}</p>
                        </div>
                          <div className="font-bold text-xs text-slate-500">Problem ID</div>
                          <p 
                            className={`font-medium text-sm ${((reportDetail as any)?.problemId) ? "text-blue-500 cursor-pointer hover:underline" : ""}`}
                            onClick={() => {
                              const pid = (reportDetail as any)?.problemId;
                              if (pid) {
                                setDetailsModalOpen(false);
                                window.location.href = `${PAGE_URL}/Problems/${pid}`;
                              }
                            }}
                          >
                            {(reportDetail as any)?.problemId || "N/A"}
                          </p>
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

                    {((reportDetail as any)?.moderatorNote) && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="font-bold text-sm text-blue-800 dark:text-blue-300 mb-2">Lý do xử lý của admin</div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          {(reportDetail as any).moderatorNote}
                        </p>
                        {((reportDetail as any).resolvedAt || (reportDetail as any).updatedAt) && (
                          <div className="text-xs text-blue-500 mt-2">
                            Resolved at: {new Date((reportDetail as any).resolvedAt || (reportDetail as any).updatedAt).toLocaleString()}
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



      <BannedUsersModal 
        isOpen={bannedUsersModalOpen}
        onOpenChange={setBannedUsersModalOpen}
      />
    </div>
  );
}