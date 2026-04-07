"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Input,
  Switch,
  Listbox,
  ListboxItem,
  Chip,
  Spinner,
} from "@heroui/react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useImportProblemToSlotMutation } from "@/store/queries/Class";
import { useGetProblemListQueryQuery } from "@/store/queries/problem";
import { ImportProblemClassRequest } from "@/types";
import { useModal } from "./ModalProvider";

interface Props {
  instanceId: string;
  slotId: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
}

interface SelectedProblem {
  problemId: string;
  ordinal: number;
  points: number;
  isRequired: boolean;
}

export default function AddProblemToSlotForm({ instanceId, slotId }: Props) {
  const [selectedProblems, setSelectedProblems] = useState<SelectedProblem[]>([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const { closeModal } = useModal();
  const [importProblems, { isLoading }] = useImportProblemToSlotMutation();

  const { data: apiResponse, isLoading: isLoadingProblems } =
    useGetProblemListQueryQuery();

  const problems = useMemo<Problem[]>(() => {
    if (!apiResponse?.data) return [];
    return apiResponse.data.map((p: any) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty ?? "unknown",
    }));
  }, [apiResponse]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchSearch = !search || 
        p.title.toLowerCase().includes(search.toLowerCase());
      const matchDifficulty = !difficultyFilter || p.difficulty === difficultyFilter;
      return matchSearch && matchDifficulty;
    });
  }, [problems, search, difficultyFilter]);

  const handleSelectionChange = (keys: any) => {
    const ids = Array.from(keys) as string[];

    const newSelected = ids.map((id, index) => {
      const existing = selectedProblems.find((p) => p.problemId === id);
      return existing || {
        problemId: id,
        ordinal: index,
        points: 0,
        isRequired: true,
      };
    });

    setSelectedProblems(newSelected);
  };

  const updatePoints = (problemId: string, value: number) => {
    setSelectedProblems((prev) =>
      prev.map((p) =>
        p.problemId === problemId ? { ...p, points: Math.max(0, value) } : p
      )
    );
  };

  const toggleRequired = (problemId: string, checked: boolean) => {
    setSelectedProblems((prev) =>
      prev.map((p) =>
        p.problemId === problemId ? { ...p, isRequired: checked } : p
      )
    );
  };

const handleSubmit = async () => {
  if (selectedProblems.length === 0) {
    toast.error("Vui lòng chọn ít nhất một bài tập");
    return;
  }

  const payload: ImportProblemClassRequest[] = selectedProblems.map((p, index) => ({
    problemId: p.problemId,
    ordinal: index,
    points: p.points,
    isRequired: p.isRequired,
  }));

  try {
    await importProblems({
      instanceId,
      slotId,
      data: payload,
    }).unwrap();
    closeModal();
    toast.success("Add assignment to slot Success!");
  } catch (err) {
    console.error(err);
    toast.error("Can not add assisgnment, please act again.");
  }
};

  return (
    <div className="w-[640px] max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-[#0f172a] border border-orange-200 dark:border-orange-500/20 shadow-2xl flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-10 px-6 pt-5 pb-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-600/10 dark:to-amber-600/10 border-b border-orange-200 dark:border-orange-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #FF5C00, #f97316)",
              boxShadow: "0 6px 20px rgba(255, 92, 0, 0.35)",
            }}
          >
            📝
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Add Problems to Slot
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Chọn và cấu hình bài tập cho slot này
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-6">

        {/* Search & Filter */}
        <div className="flex gap-3">
          <Input
            placeholder="Tìm kiếm bài tập..."
            value={search}
            onValueChange={setSearch}
            variant="bordered"
            startContent={<span className="text-gray-400">🔍</span>}
          />

          <select
            value={difficultyFilter || ""}
            onChange={(e) => setDifficultyFilter(e.target.value || null)}
            className="px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-orange-500 w-40"
          >
            <option value="">Tất cả độ khó</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Problem List */}
        <div className="flex-1 flex flex-col min-h-0">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            Danh sách bài tập
            {selectedProblems.length > 0 && (
              <Chip variant="flat" color="warning" size="sm" className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                {selectedProblems.length} đã chọn
              </Chip>
            )}
          </label>

          <div className="border border-orange-200 dark:border-orange-700 rounded-xl bg-orange-50/50 dark:bg-slate-800/30 h-[260px] overflow-hidden flex flex-col">
            {isLoadingProblems ? (
              <div className="flex-1 flex items-center justify-center gap-3 text-gray-500 dark:text-slate-400">
                <Spinner size="sm" />
                Đang tải danh sách bài tập...
              </div>
            ) : problems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-slate-400">
                Chưa có bài tập nào.
              </div>
            ) : (
              <Listbox
                selectionMode="multiple"
                selectedKeys={new Set(selectedProblems.map((p) => p.problemId))}
                onSelectionChange={handleSelectionChange}
                className="p-2 overflow-y-auto flex-1"
              >
                {filteredProblems.map((p) => (
                  <ListboxItem
                    key={p.id}
                    textValue={p.title}
                    className="data-[hover=true]:bg-orange-100 dark:data-[hover=true]:bg-orange-900/30 rounded-lg"
                  >
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-gray-800 dark:text-slate-200">
                        {p.title}
                      </span>
                      <Chip
                        size="sm"
                        variant="flat"
                        className={`text-xs font-medium ${
                          p.difficulty === "easy"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : p.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {p.difficulty.toUpperCase()}
                      </Chip>
                    </div>
                  </ListboxItem>
                ))}
              </Listbox>
            )}
          </div>
        </div>

        {/* Selected Problems */}
        {selectedProblems.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
              <PlusCircle size={18} className="text-orange-500" />
              Bài tập đã chọn (thứ tự)
            </p>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {selectedProblems.map((p, idx) => {
                const problem = problems.find((x) => x.id === p.problemId);

                return (
                  <div
                    key={p.problemId}
                    className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-700"
                  >
                    <Chip
                      variant="flat"
                      size="sm"
                      className="min-w-[32px] h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold font-mono shadow-sm"
                    >
                      {idx + 1}
                    </Chip>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-slate-200 truncate">
                        {problem?.title}
                      </p>
                    </div>

                    <Input
                      type="number"
                      label="Points"
                      size="sm"
                      className="w-28"
                      value={p.points.toString()}
                      onValueChange={(v) => updatePoints(p.problemId, Number(v) || 0)}
                      variant="bordered"
                      min={0}
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
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-10 px-6 py-4 flex justify-end gap-3 bg-white/80 dark:bg-[#0f172a]/80 border-t border-orange-200 dark:border-orange-500/20 backdrop-blur-sm">
        <Button
          variant="flat"
          className="px-6"
          onPress={() => {
            // Nếu bạn dùng modal, có thể thêm closeModal ở đây
            setSelectedProblems([]);
            setSearch("");
            setDifficultyFilter(null);
          }}
        >
          Hủy
        </Button>

        <Button
          isLoading={isLoading}
          onPress={handleSubmit}
          isDisabled={selectedProblems.length === 0 || isLoading}
          className="px-8 font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg min-w-[160px]"
        >
          {isLoading ? "Đang lưu..." : "Lưu bài tập"}
        </Button>
      </div>
    </div>
  );
}