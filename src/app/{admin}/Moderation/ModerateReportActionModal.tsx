import { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useModal } from "@/Provider/ModalProvider";
import {
  useApproveReportMutation,
  useRejectReportMutation,
  useLazyGetAllReportsQuery,
} from "@/store/queries/reports";
import { useLockUserMutation } from "@/store/queries/user";
import { useHideCommentMutation, useDeleteDiscussionMutation } from "@/store/queries/discussion";
import { ReportItem } from "@/types";
import { useRouter } from "next/navigation";
import { PAGE_URL } from "@/constants";

interface ModerateReportActionModalProps {
  selectedReport: ReportItem;
  onSuccess: () => void;
}

export default function ModerateReportActionModal({ selectedReport, onSuccess }: ModerateReportActionModalProps) {
  const { closeModal } = useModal();
  const router = useRouter();
  const [approveReport, { isLoading: isApproving }] = useApproveReportMutation();
  const [rejectReport, { isLoading: isRejecting }] = useRejectReportMutation();

  const [adminReason, setAdminReason] = useState("");

  const [triggerGetAllReports] = useLazyGetAllReportsQuery();
  const [lockUser] = useLockUserMutation();
  const [hideComment] = useHideCommentMutation();
  const [deleteDiscussion] = useDeleteDiscussionMutation();

  const handleTakeAction = async (action: "approve" | "reject") => {
    if (!selectedReport) return;
    
    // Yêu cầu nhập lý do nếu là Approve hoặc Reject
    if (action === "reject" && !adminReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối báo cáo.");
      return;
    }

      try {
        if (action === "approve") {
          await approveReport({ id: selectedReport.id, reason: adminReason }).unwrap();
          toast.success("Báo cáo đã được phê duyệt hợp lệ.");
          
          // Đóng modal ngay lập tức để không bắt user chờ
          onSuccess();
          closeModal();

          // Phần auto-action chạy ngầm
          (async () => {
            try {
              // Tối ưu: Chỉ fetch nếu thực sự cần tính toán ngưỡng
              const allRes = await triggerGetAllReports(undefined, true).unwrap();
              const allData = allRes?.data || [];
              const authorId = selectedReport.authorId;
              const targetId = selectedReport.targetId;
              const targetType = (selectedReport.targetType || "").toLowerCase();

              // 1. Tính toán số vi phạm cho Target
              const targetReports = allData.filter((r: any) => r.targetId === targetId);
              const targetApprovedCount = targetReports.filter((r: any) => r.status?.toLowerCase() === "approved").length;
              const isTargetCurrentCounted = targetReports.some(r => r.id === selectedReport.id && r.status?.toLowerCase() === "approved");
              const effectiveTargetCount = isTargetCurrentCounted ? targetApprovedCount : targetApprovedCount + 1;

              let targetThresholdReached = false;
              if (targetType === "comment" || targetType === "discussion") {
                if (effectiveTargetCount >= 3) targetThresholdReached = true;
              } else {
                if (effectiveTargetCount >= 5) targetThresholdReached = true;
              }

              // 2. Tính toán số vi phạm cho Author
              let authorThresholdReached = false;
              let effectiveAuthorCount = 0;
              if (authorId) {
                const authorApprovedReports = allData.filter((r: any) => 
                  r.authorId === authorId && r.status?.toLowerCase() === "approved"
                );
                const authorApprovedCount = authorApprovedReports.length;
                const isAuthorCurrentCounted = authorApprovedReports.some(r => r.id === selectedReport.id && r.status?.toLowerCase() === "approved");
                effectiveAuthorCount = isAuthorCurrentCounted ? authorApprovedCount : authorApprovedCount + 1;
                
                if (effectiveAuthorCount >= 5) authorThresholdReached = true;
              }

              // 3. Thực hiện auto-approve các report pending khác liên quan
              if (targetThresholdReached || authorThresholdReached) {
                const pendingToAutoApprove = allData.filter((r: any) => 
                  r.id !== selectedReport.id && 
                  r.status?.toLowerCase() === "pending" &&
                  (targetThresholdReached ? r.targetId === targetId : r.authorId === authorId)
                );
                
                for (const pr of pendingToAutoApprove) {
                  try {
                    await approveReport({ id: pr.id, reason: "Hệ thống tự động duyệt do đạt ngưỡng vi phạm." }).unwrap();
                  } catch (subErr) { console.error(subErr); }
                }
              }

              // 4. Thực hiện các hành động ẩn nội dung / khóa user
              if (targetThresholdReached) {
                if (targetType === "comment" && targetId) {
                  await hideComment({ commentId: targetId, isHidden: true }).unwrap();
                  toast.success(`Bình luận đã bị ẩn tự động do vi phạm ${effectiveTargetCount} lần!`);
                } else if (targetType === "discussion" && targetId) {
                  await deleteDiscussion({ id: targetId }).unwrap();
                  toast.success(`Thảo luận đã bị xóa tự động do vi phạm ${effectiveTargetCount} lần!`);
                }
              }

              if (authorThresholdReached && authorId) {
                await lockUser(authorId).unwrap();
                toast.success(`Tài khoản ${selectedReport.authorName || authorId} đã bị khóa tự động do vi phạm ${effectiveAuthorCount} lần!`);

                // Tự động ẩn/xóa toàn bộ nội dung vi phạm của người dùng này
                const authorContents = allData.filter((r: any) => r.authorId === authorId);
                const uniqueTargets = Array.from(new Set(authorContents.map((r: any) => `${r.targetType.toLowerCase()}:${r.targetId}`)));

                for (const targetKey of uniqueTargets) {
                  const [tType, tId] = targetKey.split(":");
                  if (!tId) continue;
                  try {
                    if (tType === "comment") {
                      await hideComment({ commentId: tId, isHidden: true }).unwrap();
                    } else if (tType === "discussion") {
                      await deleteDiscussion({ id: tId }).unwrap();
                    }
                  } catch (subErr) {
                    console.error(`Lỗi auto-hide nội dung ${targetKey}:`, subErr);
                  }
                }
                toast.success(`Đã tự động ẩn các nội dung vi phạm của ${selectedReport.authorName || authorId}.`);
              }

            } catch (autoErr) {
              console.error("Lỗi auto-action (background):", autoErr);
            }
          })();

        } else if (action === "reject") {
          await rejectReport({ id: selectedReport.id, reason: adminReason }).unwrap();
          toast.success("Báo cáo đã bị từ chối.");
          onSuccess();
          closeModal();
        }
        
      } catch (error: any) {
        console.log(error);
        toast.error(error?.data?.message || error?.message || "Đã xảy ra lỗi hệ thống khi xử lý");
      }
  };

  return (
    <div className="relative flex flex-col gap-5 py-8 px-8 bg-white dark:bg-[#282E3A] transition-colors duration-500 rounded-3xl shadow-2xl max-w-lg w-full border-none outline-none">
      {/* Close Button */}
      <button
        onClick={closeModal}
        disabled={isApproving || isRejecting}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-xl font-black uppercase text-[#3F4755] dark:text-white flex items-center">
          Moderate <span className="text-[#FF5C00] ml-2">#{selectedReport?.id?.substring(0, 8)}...</span>
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl">
          <div className="font-medium mb-2 text-[#3F4755] dark:text-gray-200">Reported Reason:</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
            {selectedReport?.reason}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-bold text-[#FF5C00] uppercase">Target</div>
              <div className="text-slate-500 truncate">{selectedReport?.targetType} - {selectedReport?.targetId}</div>
            </div>
            {selectedReport?.authorName && (
              <div>
                <div className="font-bold text-[#FF5C00] uppercase">Author</div>
                <div className="text-slate-500 truncate">{selectedReport.authorName}</div>
              </div>
            )}
            {selectedReport?.problemId && (
              <div className="col-span-2">
                <div className="font-bold text-[#FF5C00] uppercase">Problem ID</div>
                <div 
                  className="text-blue-500 cursor-pointer hover:underline truncate"
                  onClick={() => {
                    closeModal(); // Đảm bảo đóng modal trước
                    window.location.href = `${PAGE_URL}/Problems/${selectedReport.problemId}`;
                  }}
                >
                  {selectedReport.problemId}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedReport?.status === "pending" ? (
          <div className="space-y-3">
            <div className="font-black uppercase text-sm tracking-widest text-[#3F4755] dark:text-gray-400">
              Lý do xử lý (Admin Note)
            </div>
            <Textarea
              placeholder="Nhập lý do phê duyệt hoặc từ chối báo cáo này..."
              variant="bordered"
              value={adminReason}
              onValueChange={setAdminReason}
              classNames={{
                input: "text-sm",
              }}
            />
          </div>
        ) : (
          selectedReport?.moderatorNote && (
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <div className="font-bold text-xs text-blue-800 dark:text-blue-400 uppercase tracking-tighter mb-1">Admin Processing Note:</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                "{selectedReport.moderatorNote}"
              </p>
              {selectedReport.resolvedBy && (
                <div className="text-[10px] text-blue-500 mt-2 text-right">
                  Processed by: {selectedReport.resolvedBy}
                </div>
              )}
            </div>
          )
        )}

        <div>
          <div className="font-black uppercase text-sm tracking-widest mb-3 text-[#3F4755] dark:text-gray-400">
            Moderation Actions
          </div>
          
          {selectedReport?.status === "pending" ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="sm"
                variant="flat"
                startContent={<CheckCircle size={16} />}
                className="justify-start text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 font-bold"
                onPress={() => handleTakeAction("approve")}
                isLoading={isApproving || isRejecting}
              >
                Approve (Hide Content)
              </Button>
              <Button
                size="sm"
                variant="flat"
                startContent={<XCircle size={16} />}
                className="justify-start text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 font-bold"
                onPress={() => handleTakeAction("reject")}
                isLoading={isApproving || isRejecting}
              >
                Reject (Ignore)
              </Button>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" />
                This report has been <span className="uppercase text-emerald-600 dark:text-emerald-400">{selectedReport?.status}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
