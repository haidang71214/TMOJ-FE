"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Listbox,
  ListboxItem,
  Spinner,
  Switch,
  Chip,
} from "@heroui/react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Selection } from "@react-types/shared";
import { useModal } from "@/Provider/ModalProvider";
import { useGetProblemListQuery } from "@/store/queries/ProblemPublic";
import { useCreateClassSlotMutation } from "@/store/queries/ClassSlot";
import { CreateClassSlotRequest, ErrorForm, Problem } from "@/types";
import { RequiredStar } from "@/Common/RequiredStar";

interface CreateSlotFormProps {
  classId: string;
}

interface SelectedProblem {
  problemId: string;
  ordinal: number;
  points: number;
  isRequired: boolean;
}

export default function CreateSlotForma({ classId }: CreateSlotFormProps) {
  const { closeModal } = useModal();
  const [createSlot, { isLoading: isCreating }] = useCreateClassSlotMutation();

  const { data: problemResponse, isLoading: isLoadingProblems } = useGetProblemListQuery();
  const problems = problemResponse?.data || [];

  const [slotNo, setSlotNo] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [mode, setMode] = useState<"problemset" | "contest">("problemset");
  const [openAt, setOpenAt] = useState<string>("");
  const [dueAt, setDueAt] = useState<string>("");
  const [closeAt, setCloseAt] = useState<string>("");
  const [selectedProblems, setSelectedProblems] = useState<SelectedProblem[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Slot title is required";
    if (slotNo < 1) newErrors.slotNo = "Slot number must be at least 1";

    if (mode === "problemset" && selectedProblems.length === 0) {
      newErrors.problems = "At least one problem is required for Problem Set mode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form!");
      return;
    }

    try {
      const payload: CreateClassSlotRequest = {
        slotNo,
        title: title.trim(),
        description: description.trim() || undefined,
        rules: rules.trim() || undefined,
        openAt: openAt ? new Date(openAt).toISOString() : undefined,
        dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
        closeAt: closeAt ? new Date(closeAt).toISOString() : undefined,
        mode,
        problems: selectedProblems.map((p, index) => ({
          problemId: p.problemId,
          ordinal: index,
          points: p.points || 0,
          isRequired: p.isRequired,
        })),
      };

      await createSlot({ classId, data: payload }).unwrap();

      toast.success("Class slot created successfully!");
      closeModal();
    } catch (err) {
      const apiError = err as ErrorForm;
      const errorMessage = apiError?.data?.data?.message || "Failed to create slot. Please try again.";
      toast.error(errorMessage);
    }
  };

  const filteredProblems = problems.filter((p: Problem) => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = !difficultyFilter || p.difficulty === difficultyFilter;
    return matchSearch && matchDifficulty;
  });

  const handleSelectionChange = (keys: Selection) => {
    const selectedIds = Array.from(keys) as string[];

    const newSelected: SelectedProblem[] = selectedIds.map((id, index) => {
      const existing = selectedProblems.find((p) => p.problemId === id);
      return existing
        ? { ...existing, ordinal: index }
        : {
            problemId: id,
            ordinal: index,
            points: 0,
            isRequired: true,
          };
    });

    setSelectedProblems(newSelected);
  };

  const toggleRequired = (problemId: string, checked: boolean) => {
    setSelectedProblems((prev) =>
      prev.map((p) => (p.problemId === problemId ? { ...p, isRequired: checked } : p))
    );
  };

  return (
    <div className="w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0f172a] border border-orange-200 dark:border-orange-500/20 shadow-2xl">
      {/* Header - Màu cam */}
      <div className="sticky top-0 z-10 px-6 pt-5 pb-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-600/10 dark:to-amber-600/10 border-b border-orange-200 dark:border-orange-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #FF5C00, #f97316)",
              boxShadow: "0 6px 20px rgba(255, 92, 0, 0.35)",
            }}
          >
            📅
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create New Slot
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Configure a new learning/activity slot for this class
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 flex flex-col gap-6">
        {/* Slot Number & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={
              <div className="flex items-center gap-1.5">
                Slot Number <RequiredStar rules={["Required"]} />
              </div>
            }
            type="number"
            min={1}
            value={slotNo.toString()}
            onValueChange={(v) => setSlotNo(Number(v) || 1)}
            isInvalid={!!errors.slotNo}
            errorMessage={errors.slotNo}
            variant="bordered"
            classNames={{ input: "font-mono" }}
          />

          <Input
            label={
              <div className="flex items-center gap-1.5">
                Slot Title <RequiredStar rules={["Required"]} />
              </div>
            }
            value={title}
            onValueChange={setTitle}
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            placeholder="e.g. Week 3 - Dynamic Programming"
            variant="bordered"
          />
        </div>

        <Textarea
          label="Description (optional)"
          value={description}
          onValueChange={setDescription}
          placeholder="Short description of what this slot covers..."
          variant="bordered"
          minRows={2}
        />

        <Textarea
          label="Rules / Guidelines (optional)"
          value={rules}
          onValueChange={setRules}
          placeholder="Time limit, submission rules, scoring policy..."
          variant="bordered"
          minRows={2}
        />

        {/* Mode */}
        <Select
          label="Slot Mode"
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as "problemset" | "contest";
            setMode(selected);
          }}
          variant="bordered"
        >
          <SelectItem key="problemset">Problem Set (Practice)</SelectItem>
          <SelectItem key="contest">Contest (Timed Competition)</SelectItem>
        </Select>

        {/* Date Time */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-orange-700 dark:text-orange-400">Open At</div>
            <Input
              type="datetime-local"
              value={openAt}
              onValueChange={setOpenAt}
              variant="bordered"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-orange-700 dark:text-orange-400">Due At</div>
            <Input
              type="datetime-local"
              value={dueAt}
              onValueChange={setDueAt}
              variant="bordered"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-orange-700 dark:text-orange-400">Close At</div>
            <Input
              type="datetime-local"
              value={closeAt}
              onValueChange={setCloseAt}
              variant="bordered"
            />
          </div>
        </div>

        {/* Problems Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
              Problems
              {mode === "problemset" && <RequiredStar rules={["At least 1 required"]} />}
            </label>
            {selectedProblems.length > 0 && (
              <Chip variant="flat" color="warning" size="sm" className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                {selectedProblems.length} selected
              </Chip>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search problems..."
              value={search}
              onValueChange={setSearch}
              variant="bordered"
            />

            <Select
              placeholder="Difficulty"
              selectedKeys={difficultyFilter ? [difficultyFilter] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setDifficultyFilter(value || null);
              }}
              variant="bordered"
              className="w-40"
            >
              <SelectItem key="easy">Easy</SelectItem>
              <SelectItem key="medium">Medium</SelectItem>
              <SelectItem key="hard">Hard</SelectItem>
            </Select>
          </div>

          {isLoadingProblems ? (
            <div className="flex items-center justify-center gap-3 py-6 text-gray-500 dark:text-slate-400">
              <Spinner size="sm" /> Loading available problems...
            </div>
          ) : problems.length === 0 ? (
            <div className="py-6 text-center text-gray-500 dark:text-slate-400 border border-dashed border-orange-200 rounded-xl">
              No problems available yet.
            </div>
          ) : (
            <div className="h-64 overflow-y-auto border border-orange-200 dark:border-orange-700 rounded-xl bg-orange-50/50 dark:bg-slate-800/30">
              <Listbox
                selectionMode="multiple"
                selectedKeys={new Set(selectedProblems.map((p) => p.problemId))}
                onSelectionChange={handleSelectionChange}
                className="p-1"
              >
                {filteredProblems.map((prob: Problem) => (
                  <ListboxItem
                    key={prob.id}
                    textValue={prob.title}
                    className="data-[hover=true]:bg-orange-100 dark:data-[hover=true]:bg-orange-900/30"
                  >
                    <div className="flex flex-col py-1">
                      <span className="font-medium">{prob.title}</span>
                      {prob.difficulty && (
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          Difficulty: {prob.difficulty}
                        </span>
                      )}
                    </div>
                  </ListboxItem>
                ))}
              </Listbox>
            </div>
          )}

          {/* Selected Problems */}
          {selectedProblems.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
                Selected order:
              </p>
              <div className="space-y-2">
                {selectedProblems.map((p, idx) => {
                  const prob = problems.find((pr: Problem) => pr.id === p.problemId);
                  return (
                    <div
                      key={p.problemId}
                      className="flex items-center justify-between gap-4 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-700"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Chip
                          variant="flat"
                          size="sm"
                          className="min-w-[28px] h-6 bg-orange-500 text-white font-mono font-bold"
                        >
                          {idx + 1}
                        </Chip>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-slate-200">
                            {prob?.title || "Unknown Problem"}
                          </p>
                        </div>
                      </div>

                      <Switch
                        size="sm"
                        isSelected={p.isRequired}
                        onValueChange={(checked) => toggleRequired(p.problemId, checked)}
                        classNames={{
                          wrapper: "group-data-[selected=true]:bg-orange-500",
                        }}
                      >
                        Required
                      </Switch>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors.problems && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
              <AlertCircle size={16} />
              {errors.problems}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-10 px-6 py-4 flex justify-end gap-4 bg-orange-50 dark:bg-[#0b1120] border-t border-orange-200 dark:border-orange-500/10 backdrop-blur-sm">
        <Button
          variant="flat"
          onPress={closeModal}
          className="px-6 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-300"
        >
          Cancel
        </Button>

        <Button
          isLoading={isCreating}
          onPress={onSubmit}
          isDisabled={isCreating}
          className="px-8 font-semibold text-white min-w-[140px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
        >
          {isCreating ? "Creating..." : "Create Slot"}
        </Button>
      </div>
    </div>
  );
}