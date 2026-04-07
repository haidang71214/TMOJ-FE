"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Switch,
  Chip,
  addToast,
} from "@heroui/react";
import { Save, Trash2 } from "lucide-react";   // ← thêm Trash2
import { toast } from "sonner";
import { UpdateSlotProblemRequest } from "@/types";
import { useDeleteSlotProblemsMutation, useUpdateSlotProblemsMutation } from "@/store/queries/Class";

interface Props {
  instanceId: string;
  slotId: string;
  problems: ProblemItem[];
}

interface ProblemItem extends UpdateSlotProblemRequest {
  title: string | undefined;
}

export default function UpdateProblemIntoSlot({
  instanceId,
  slotId,
  problems,
}: Props) {

  const [items, setItems] = useState<ProblemItem[]>(problems);
  const [deleteProblems] = useDeleteSlotProblemsMutation();
  const [updateProblems, { isLoading }] = useUpdateSlotProblemsMutation();

  // Các hàm update giữ nguyên
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

  // === Hàm xóa problem ===
  const removeProblem = async (problemId: string) => {
  const previous = items;

  // optimistic update
  setItems((prev) => prev.filter((p) => p.problemId !== problemId));

  try {
    await deleteProblems({
      instanceId,
      slotId,
      problemIds: [problemId],
    }).unwrap();

    addToast({
      title: "Problem removed",
      color: "success",
    });

  } catch (err) {
    console.error(err);

    // rollback nếu fail
    setItems(previous);

    addToast({
      title: "Delete failed",
      color: "danger",
    });
  }
};

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Không có bài tập để update");
      return;
    }
    console.log( items.map(({ title, ...rest }) => rest),);
    
    try {
      await updateProblems({
        instanceId,
        slotId,
        data: items.map(({ title, ...rest }) => rest),
      }).unwrap();

      toast.success("Update slot problems success!");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-[640px] max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-[#0f172a] border border-orange-200 dark:border-orange-500/20 shadow-2xl flex flex-col">

      {/* Header */}
      <div className="px-6 pt-5 pb-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-600/10 dark:to-amber-600/10 border-b border-orange-200 dark:border-orange-500/20">
        <div className="flex items-center gap-4">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Update Problems In Slot
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Chỉnh sửa ordinal, points, required và xóa bài tập
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-6 overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            Không còn bài tập nào trong slot này.
          </div>
        ) : (
          items.map((p, index) => (
            <div
              key={p.problemId}
              className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-700 group"
            >
              <Chip
                variant="flat"
                size="sm"
                className="min-w-[32px] h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold font-mono"
              >
                {index + 1}
              </Chip>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate">
                  {p.title}
                </p>
              </div>

              <Input
                type="number"
                label="Ordinal"
                size="sm"
                className="w-24"
                value={p.ordinal.toString()}
                onValueChange={(v) => updateOrdinal(p.problemId, Number(v) || 0)}
              />

              <Input
                type="number"
                label="Points"
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
                }}
                size="sm"
              >
                Required
              </Switch>

              {/* Nút Xóa */}
              <Button
                color="danger"
                variant="light"
                size="sm"
                onPress={() => removeProblem(p.problemId)}
                title="Delete this asginment"
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
          className="px-8 font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
          startContent={<Save size={16} />}
        >
          {isLoading ? "Updating..." : "Update Problems"}
        </Button>
      </div>
    </div>
  );
}