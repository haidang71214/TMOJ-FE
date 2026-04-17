"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Switch,
  Tooltip,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { AddProblemModal } from "@/app/components/AddProblemModal";
import {
  useGetContestProblemsQuery,
  useAddProblemToContestMutation,
  useRemoveProblemFromContestMutation,
  useGetContestDetailQuery
} from "@/store/queries/Contest";
import { toast } from "sonner";
import { Problem, ContestProblemDto } from "@/types";

export default function ContestProblemsPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params.id as string;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // RTK Query hooks
  const { data: contestDetailResponse } = useGetContestDetailQuery(contestId);
  const { data: response, isLoading: isLoadingProblems, refetch } = useGetContestProblemsQuery(contestId);
  const [addProblemToContest, { isLoading: isAdding }] = useAddProblemToContestMutation();
  const [removeProblemFromContest] = useRemoveProblemFromContestMutation();

  const contestStatus = contestDetailResponse?.data?.status?.toLowerCase();
  const isLocked = contestStatus === "running" || contestStatus === "ended";

  // Định nghĩa danh sách cột động để tránh lỗi TypeScript của HeroUI
  const columns = [
    { key: "id", label: "ID" },
    { key: "index", label: "INDEX" },
    { key: "name", label: "PROBLEM NAME" },
    { key: "alias", label: "ALIAS / TITLE ID" },
    { key: "points", label: "POINTS" },
    { key: "visible", label: "VISIBLE" },
    ...(!isLocked ? [{ key: "ops", label: "OPERATIONS", align: "right" }] : [])
  ];

  // Debug log để kiểm tra dữ liệu thực tế từ API
  React.useEffect(() => {
    if (response) {
      console.log("Contest Problems API Response:", response);
    }
  }, [response]);

  // Bóc tách dữ liệu linh hoạt (hỗ trợ nhiều cấu trúc trả về của Backend)
  const problems = React.useMemo(() => {
    if (!response?.data) return [];

    // Trường hợp 1: data.items (Chuẩn phổ biến)
    if (Array.isArray(response.data.items)) return response.data.items;

    // Trường hợp 2: data trực tiếp là mảng
    if (Array.isArray(response.data)) return response.data;

    // Trường hợp 3: data.data.items (Cấu trúc wrapper đôi)
    if ((response.data as any).data && Array.isArray((response.data as any).data.items)) {
      return (response.data as any).data.items;
    }

    return [];
  }, [response]) as ContestProblemDto[];

  // Hàm điều hướng sang trang chỉnh sửa bài tập
  const goToEdit = (problemId: string) => {
    router.push(`/Management/Contest/${contestId}/problems/${problemId}/edit`);
  };

  // Hàm xử lý nhận dữ liệu từ Modal
  const handleAddFromBank = async (selectedWithConfigs: any[]) => {
    try {
      const results = await Promise.all(
        selectedWithConfigs.map((item) =>
          addProblemToContest({
            contestId,
            body: {
              problemId: item.problemId,
              alias: item.alias || undefined,
              points: item.points,
              ordinal: item.ordinal,
              maxScore: item.points, // Default maxScore to points
            },
          }).unwrap()
        )
      );
      toast.success(`Đã thêm ${results.length} bài tập vào contest!`);
      refetch();
    } catch (error: any) {
      console.error("Failed to add problems:", error);
      toast.error(error?.data?.message || "Đã xảy ra lỗi khi thêm bài tập");
    }
  };

  // Hàm xử lý xóa bài tập
  const handleDeleteProblem = async (problemId: string, title?: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài tập "${title || problemId}" khỏi contest không?`)) {
      return;
    }

    try {
      await removeProblemFromContest({ contestId, id: problemId }).unwrap();
      toast.success("Đã xóa bài tập khỏi contest!");
      refetch();
    } catch (error: any) {
      console.error("Failed to remove problem:", error);
      toast.error(error?.data?.message || "Không thể xóa bài tập");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20 p-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <Button
          variant="light"
          onPress={() => router.push(`/Management/Contest`)}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 transition-colors h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          Back to Contest List
        </Button>

        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
              CONTEST <span className="text-[#FF5C00]">PROBLEMS</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              Contest ID: #{contestId.substring(0, 8)}...
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              isIconOnly
              variant="flat"
              onPress={() => refetch()}
              className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 h-12 w-12 rounded-xl"
            >
              <RefreshCw size={20} className={isLoadingProblems ? "animate-spin" : ""} />
            </Button>
            {!isLocked && (
              <Button
                startContent={<Plus size={20} strokeWidth={3} />}
                onPress={onOpen}
                isLoading={isAdding}
                className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black rounded-xl h-12 px-8 uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Add from Problem Bank
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <Table
        aria-label="Contest Problem List"
        removeWrapper
        classNames={{
          base: "bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
          th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4",
          td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={column.align === "right" ? "text-right" : ""}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={isLoadingProblems ? <Spinner color="warning" /> : "Chưa có bài tập nào trong contest này"}>
          {problems.map((p, idx) => (
            <TableRow
              key={p.problemId}
              className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <TableCell>
                <span className="text-slate-400 font-black italic text-xs">
                  #{p.problemId.substring(0, 8)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xl font-black text-blue-600 dark:text-[#FF5C00] italic">
                  {p.displayIndex || idx + 1}
                </span>
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/Problems/${p.problemId}`, "_blank");
                  }}
                >
                  <span className="text-base font-black uppercase text-slate-700 dark:text-slate-200 leading-none">
                    {(p as any).problemTitle || (p as any).title || "Untitled Problem"}
                  </span>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                </div>
              </TableCell>
              <TableCell>
                <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                  {p.alias || p.problemId.substring(0, 12)}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-bold">{p.points || 0}</span>
              </TableCell>
              <TableCell>
                <Switch
                  size="sm"
                  isDisabled={isLocked}
                  defaultSelected={true} // Tạm thời để mặc định do chưa có field visible trong DTO
                  classNames={{
                    wrapper:
                      "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
                  }}
                />
              </TableCell>
              {!isLocked ? (
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip
                      content="Edit Details"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => goToEdit(p.problemId)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      content="Remove from Contest"
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => handleDeleteProblem(p.problemId, p.alias)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all rounded-lg h-9 w-9"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              ) : (
                // Phải trả về một TableCell rỗng hoặc dùng mảng để khớp số lượng cột
                // Tuy nhiên, HeroUI TableRow mapping sẽ tự bóc tách nếu chúng ta dùng đúng structure
                // Ở đây tôi sẽ dùng mảng TableCell thủ công khớp với columns.key
                null as any
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* RENDER MODAL*/}
      <AddProblemModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={handleAddFromBank}
      />

      {/* FOOTER DECOR */}
      <div className="flex justify-center opacity-20 italic font-black uppercase text-[10px] tracking-[1em] text-slate-400 pt-10">
        TMOJ &bull; PROBLEMS &bull; SYSTEM
      </div>

    </div>
  );
}
