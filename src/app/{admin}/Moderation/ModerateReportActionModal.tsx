import { Button } from "@heroui/react";
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

interface ModerateReportActionModalProps {
  selectedReport: ReportItem;
  onSuccess: () => void;
}

export default function ModerateReportActionModal({ selectedReport, onSuccess }: ModerateReportActionModalProps) {
  const { closeModal } = useModal();
  const [approveReport, { isLoading: isApproving }] = useApproveReportMutation();
  const [rejectReport, { isLoading: isRejecting }] = useRejectReportMutation();

  const [triggerGetAllReports] = useLazyGetAllReportsQuery();
  const [lockUser] = useLockUserMutation();
  const [hideComment] = useHideCommentMutation();
  const [deleteDiscussion] = useDeleteDiscussionMutation();

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
                 const res =    await approveReport({ id: pr.id }).unwrap();
                    console.log(res);
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
      
      onSuccess();
      closeModal();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || error?.message || "Đã xảy ra lỗi hệ thống khi duyệt");
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
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {selectedReport?.reason}
          </p>
          <div className="font-medium mt-4 mb-2 text-[#3F4755] dark:text-gray-200">Target Type & ID:</div>
          <p className="text-xs text-slate-500">
            <span className="uppercase font-bold text-[#FF5C00]">{selectedReport?.targetType}</span> - {selectedReport?.targetId}
          </p>
        </div>

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
            <p className="text-sm text-slate-500 font-bold italic">
              Báo cáo này đã được duyệt (Status: <span className="uppercase">{selectedReport?.status}</span>).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
