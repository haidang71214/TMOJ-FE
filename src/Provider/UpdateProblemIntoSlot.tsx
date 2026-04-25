"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Switch,
  Chip,
  addToast,
} from "@heroui/react";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { UpdateSlotProblemRequest } from "@/types";
import { useDeleteSlotProblemsMutation, useUpdateSlotProblemsMutation } from "@/store/queries/Class";
import { useTranslation } from "@/hooks/useTranslation";
import { useModal } from "@/Provider/ModalProvider";

interface Props {
  semesterId: string;
  slotId: string;
  problems: ProblemItem[];
}

interface ProblemItem extends UpdateSlotProblemRequest {
  title: string | undefined;
}

export default function UpdateProblemIntoSlot({
  semesterId,
  slotId,
  problems,
}: Props) {
  const { t, language } = useTranslation();
  const { closeModal } = useModal();
  const [items, setItems] = useState<ProblemItem[]>(() => {
    if (problems.length === 0) return problems;
    // Tạm thời chia đều 10 điểm, ưu tiên làm tròn số nguyên sao cho tổng luôn = 10
    const basePts = Math.floor(10 / problems.length);
    const remainder = 10 % problems.length;
    
    return problems.map((p, idx) => ({ 
      ...p, 
      points: basePts + (idx < remainder ? 1 : 0) 
    }));
  });
  const [deleteProblems] = useDeleteSlotProblemsMutation();
  const [updateProblems, { isLoading }] = useUpdateSlotProblemsMutation();

  const updatePoints = (problemId: string, value: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.problemId === problemId
          ? { ...p, points: Math.max(0, value) }
          : p
      )
    );
  };

  const updateOrdinal = (problemId: string, value: number) => {
    setItems((prev) =>
      prev.map((p) =>
        p.problemId === problemId
          ? { ...p, ordinal: Math.max(0, value) }
          : p
      )
    );
  };

  const toggleRequired = (problemId: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((p) =>
        p.problemId === problemId
          ? { ...p, isRequired: checked }
          : p
      )
    );
  };

  const removeProblem = async (problemId: string) => {
    const previous = items;

    setItems((prev) => prev.filter((p) => p.problemId !== problemId));

    try {
      await deleteProblems({
        semesterId,
        slotId,
        problemIds: [problemId],
      }).unwrap();

      addToast({
        title: t('class_semester.problem_removed') || (language === 'vi' ? 'Đã xóa bài tập' : 'Problem removed'),
        color: "success",
      });

    } catch (err) {
      console.error(err);
      setItems(previous);

      addToast({
        title: t('class_semester.delete_failed') || (language === 'vi' ? 'Xóa thất bại' : 'Delete failed'),
        color: "danger",
      });
    }
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error(t('class_semester.no_problems_to_update') || (language === 'vi' ? 'Không có bài tập để cập nhật' : 'No problems to update'));
      return;
    }
    console.log( items.map(({ title, ...rest }) => rest),);
    
    try {
      await updateProblems({
        semesterId,
        slotId,
        data: items.map(({ title, ...rest }) => rest),
      }).unwrap();

      toast.success(t('class_semester.update_slot_success') || (language === 'vi' ? 'Cập nhật thành công!' : 'Update exam problems success!'));
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(t('class_semester.update_failed') || (language === 'vi' ? 'Cập nhật thất bại' : 'Update failed'));
    }
  };

  return (
    <div className="w-[640px] max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-[#0f172a] border border-orange-200 dark:border-orange-500/20 shadow-2xl flex flex-col">

      {/* Header */}
      <div className="px-6 pt-5 pb-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-600/10 dark:to-amber-600/10 border-b border-orange-200 dark:border-orange-500/20">
        <div className="flex items-center gap-4 animate-fade-in-down" style={{ animationFillMode: "both" }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #FF5C00, #f97316)",
              boxShadow: "0 6px 20px rgba(255, 92, 0, 0.35)",
            }}
          >
            ⚙️
          </div>

          <div>
            <h2 className="text-2xl font-[900] text-gray-900 dark:text-white">
              {t('class_semester.update_problems_slot') || (language === 'vi' ? 'Cập nhật bài tập trong Bài kiểm tra' : 'Update Problems In Exam')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t('class_semester.update_problems_slot_desc') || (language === 'vi' ? 'Chỉnh sửa thứ tự, điểm, yêu cầu và xóa bài tập' : 'Edit ordinal, points, required and remove problems')}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-6 overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            {t('class_semester.no_problems_in_slot') || (language === 'vi' ? 'Không còn bài tập nào trong bài kiểm tra này.' : 'No more problems in this exam.')}
          </div>
        ) : (
          items.map((p, index) => (
            <div
              key={p.problemId}
              className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-700 group animate-fade-in-right"
              style={{ animationFillMode: "both", animationDelay: `${index * 50}ms` }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold font-mono flex items-center justify-center shadow-sm text-sm"
              >
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate" title={p.title}>
                  {p.title}
                </p>
              </div>

              <Input
                type="number"
                label={t('class_semester.header_ordinal') || (language === 'vi' ? 'SỐ THỨ TỰ' : 'ORDINAL')}
                size="sm"
                className="w-24"
                value={p.ordinal.toString()}
                onValueChange={(v) => updateOrdinal(p.problemId, Number(v) || 0)}
              />

              <Input
                type="number"
                label={t('class_semester.points') || (language === 'vi' ? 'Điểm' : 'Points')}
                size="sm"
                className="w-28"
                value={p.points.toString()}
                onValueChange={(v) => updatePoints(p.problemId, Number(v) || 0)}
              />

              <Switch
                isSelected={p.isRequired}
                onValueChange={(v) => toggleRequired(p.problemId, v)}
                classNames={{
                  wrapper: "group-data-[selected=true]:bg-orange-500",
                  label: "text-xs font-bold"
                }}
                size="sm"
              >
                {t('class_semester.required') || (language === 'vi' ? 'Bắt buộc' : 'Required')}
              </Switch>

              {/* Nút Xóa */}
              <Button
                color="danger"
                variant="light"
                size="sm"
                isIconOnly
                onPress={() => removeProblem(p.problemId)}
                title={t('common.delete') || (language === 'vi' ? 'Xóa' : 'Delete')}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex justify-end gap-3 bg-white dark:bg-[#0f172a] border-t border-orange-200 dark:border-orange-500/20">
        <Button
          isLoading={isLoading}
          onPress={handleSubmit}
          className="px-8 font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg animate-fade-in-up"
          style={{ animationFillMode: "both", animationDelay: "150ms" }}
          startContent={<Save size={16} />}
        >
          {isLoading ? (t('common.updating') || (language === 'vi' ? 'Đang cập nhật...' : 'Updating...')) : (t('class_semester.update_problems') || (language === 'vi' ? 'Lưu thay đổi' : 'Update Problems'))}
        </Button>
      </div>
    </div>
  );
}