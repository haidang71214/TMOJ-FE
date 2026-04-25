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
  Pagination,
} from "@heroui/react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
  import { Selection } from "@react-types/shared";
import { useModal } from "@/Provider/ModalProvider";
import { useGetProblemListPublicQuery } from "@/store/queries/ProblemPublic";
import { useCreateClassSlotMutation } from "@/store/queries/ClassSlot";
import { CreateClassSlotRequest, ErrorForm, Problem } from "@/types";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

interface CreateSlotFormProps {
  semesterId: string;
}

interface SelectedProblem {
  problemId: string;
  ordinal: number;
  points: number;
  isRequired: boolean;
}

export default function CreateSlotForm({ semesterId }: CreateSlotFormProps) {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const [createSlot, { isLoading: isCreating }] = useCreateClassSlotMutation();
  console.log("semesterId", semesterId);
  
  const [page, setPage] = useState(1);
  const { data: problemResponse, isLoading: isLoadingProblems } = useGetProblemListPublicQuery({ page, pageSize: 5 });
  console.log("problemResponse", problemResponse);
  
  const problems = problemResponse?.data || [];
  const totalPages = problemResponse?.pagination?.totalPages || 1;
  console.log("problems", problems);
  
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = t("slot.titleRequired") || "Exam title is required";
    if (slotNo < 1) newErrors.slotNo = t("slot.slotNoMin") || "Exam number must be at least 1";

    if (mode === "problemset" && selectedProblems.length === 0) {
      newErrors.problems = t("slot.problemRequiredForProblemset") || "At least one problem is required for Problem Set mode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error(t("common.fixErrors") || "Please fix the errors in the form!");
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
          ordinal: index,          // 0, 1, 2,...
          points: p.points || 0,
          isRequired: p.isRequired,
        })),
      };

      await createSlot({ semesterId, data: payload }).unwrap();

      toast.success(t("slot.createSuccess") || "Class exam created successfully!");
      closeModal();
    } catch (err) {
      const apiError = err as ErrorForm;
      const errorMessage =
        apiError?.data?.data?.message ||
        (t("slot.createFailed") || "Failed to create exam. Please try again.");
      toast.error(errorMessage);
    }
  };
  const [search, setSearch] = useState("");
const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const filteredProblems = problems.filter((p: Problem) => {
  const matchSearch =
    !search ||
    (p.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchDifficulty =
    !difficultyFilter || p.difficulty === difficultyFilter;

  return matchSearch && matchDifficulty;
});

const handleSelectionChange = (keys : Selection) => {
    const selectedIds = Array.from(keys) as string[];

    // Tạo danh sách mới, giữ thông tin cũ nếu có, cập nhật ordinal theo thứ tự mới
    const newSelected: SelectedProblem[] = selectedIds.map((id, index) => {
      const existing = selectedProblems.find((p) => p.problemId === id);
      return existing
        ? { ...existing, ordinal: index }
        : {
            problemId: id,
            ordinal: index,
            points: 0,
            isRequired: true, // mặc định required
          };
    });

    setSelectedProblems(newSelected);
  };

  const toggleRequired = (problemId: string, checked: boolean) => {
    setSelectedProblems((prev) =>
      prev.map((p) =>
        p.problemId === problemId ? { ...p, isRequired: checked } : p
      )
    );
  };

  return (
    <div className="w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-indigo-500/20 shadow-2xl dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 pt-5 pb-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-600/10 dark:to-purple-600/5 border-b border-indigo-100 dark:border-indigo-500/15 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
            }}
          >
            📚
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {t("slot.createNewSlot") || "Create New Exam"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {t("slot.createNewSlotDesc") || "Configure a new learning/activity exam for this class"}
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
                {t("slot.slotNumber") || "Exam Number"} <RequiredStar rules={[t("common.required") || "Required"]} />
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
                {t("slot.slotTitle") || "Exam Title"} <RequiredStar rules={[t("common.required") || "Required"]} />
              </div>
            }
            value={title}
            onValueChange={setTitle}
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            placeholder={t("slot.titlePlaceholder") || "e.g. Week 3 - Dynamic Programming"}
            variant="bordered"
          />
        </div>

        <Textarea
          label={t("slot.descriptionOptional") || "Description (optional)"}
          value={description}
          onValueChange={setDescription}
          placeholder={t("slot.descPlaceholder") || "Short description of what this slot covers..."}
          variant="bordered"
          minRows={2}
        />

        <Textarea
          label={t("slot.rulesOptional") || "Rules / Guidelines (optional)"}
          value={rules}
          onValueChange={setRules}
          placeholder={t("slot.rulesPlaceholder") || "Time limit, submission rules, scoring policy..."}
          variant="bordered"
          minRows={2}
        />

        {/* Mode */}
        <Select
          label={t("slot.slotMode") || "Exam Mode"}
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as "problemset" | "contest";
            setMode(selected);
          }}
          variant="bordered"
        >
          <SelectItem key="problemset">{t("slot.modeProblemSet") || "Problem Set (Practice)"}</SelectItem>
          <SelectItem key="contest">{t("slot.modeContest") || "Contest (Timed Competition)"}</SelectItem>
        </Select>
         <div className="grid grid-cols-3 gap-4">

  <div className="flex flex-col gap-1">
    <div className="text-sm font-medium">{t("slot.openAt") || "Open At"} <RequiredStar rules={[t("common.optional") || "Optional",]} /></div>
    <Input
      type="datetime-local"
      labelPlacement="outside"
      value={openAt}
      onValueChange={setOpenAt}
      variant="bordered"
    />
  </div>

  <div className="flex flex-col gap-1">
    <div className="text-sm font-medium">{t("slot.dueAt") || "Due At"} <RequiredStar rules={[t("common.optional") || "Optional"]}/> </div>
    <Input
      type="datetime-local"
      labelPlacement="outside"
      value={dueAt}
      onValueChange={setDueAt}
      variant="bordered"
    />
  </div>

  <div className="flex flex-col gap-1">
    <div className="text-sm font-medium">{t("slot.closeAt") || "Close At"} <RequiredStar rules={[t("common.optional") || "Optional"]}/> </div>
    <Input
      type="datetime-local"
      labelPlacement="outside"
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
              {t("slot.problems") || "Problems"}
              {mode === "problemset" && <RequiredStar rules={[t("slot.atLeastOneReq") || "At least 1 required"]} />}
            </label>
            {selectedProblems.length > 0 && (
              <Chip variant="flat" color="primary" size="sm">
                {selectedProblems.length} {t("common.selected") || "selected"}
              </Chip>
            )}
          </div>
            <div className="flex gap-2">
  <Input
    placeholder={t("slot.searchProblems") || "Search problems..."}
    value={search}
    onValueChange={setSearch}
    variant="bordered"
  />

  <Select
    placeholder={t("slot.difficulty") || "Difficulty"}
    selectedKeys={difficultyFilter ? [difficultyFilter] : []}
    onSelectionChange={(keys) => {
      const value = Array.from(keys)[0] as string;
      setDifficultyFilter(value || null);
    }}
    variant="bordered"
    className="w-40"
  >
    <SelectItem key="easy">{t("slot.diffEasy") || "Easy"}</SelectItem>
    <SelectItem key="medium">{t("slot.diffMedium") || "Medium"}</SelectItem>
    <SelectItem key="hard">{t("slot.diffHard") || "Hard"}</SelectItem>
  </Select>
</div>

          {isLoadingProblems ? (
            <div className="flex items-center justify-center gap-3 py-6 text-gray-500 dark:text-slate-400">
              <Spinner size="sm" /> {t("slot.loadingProblems") || "Loading available problems..."}
            </div>
          ) : problems.length === 0 ? (
            <div className="py-6 text-center text-gray-500 dark:text-slate-400 border border-dashed rounded-xl">
              {t("slot.noProblems") || "No problems available yet."}
            </div>
          ) : (
            <>
            <div className="h-64 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-800/30">
  <Listbox
    selectionMode="multiple"
    selectedKeys={new Set(selectedProblems.map((p) => p.problemId))}
    onSelectionChange={handleSelectionChange}
    className="p-1"
  >
    {filteredProblems.map((prob: Problem, index: number) => (
      <ListboxItem
        key={prob.id}
        textValue={prob.title}
        className="data-[hover=true]:bg-indigo-50 dark:data-[hover=true]:bg-indigo-900/20"
      >
        <div 
          className="flex flex-col py-1 animate-fade-in-right opacity-0"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="font-medium">{prob.title}</span>

          {prob.difficulty && (
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {t("slot.difficulty") || "Difficulty"}: {prob.difficulty}
            </span>
          )}
        </div>
      </ListboxItem>
    ))}
  </Listbox>
</div>
<div className="flex justify-center mt-2">
  <Pagination
    isCompact
    showControls
    color="primary"
    page={page}
    total={totalPages}
    onChange={setPage}
  />
</div>
</>
          )}

          {/* Selected Problems List with Order & Required Toggle */}
          {selectedProblems.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
                {t("slot.selectedOrder") || "Selected order (drag to reorder in future versions):"}
              </p>
              <div className="space-y-2">
                {selectedProblems.map((p, idx) => {
                  const prob = problems.find((pr: Problem) => pr.id === p.problemId);
                  return (
                    <div
                      key={p.problemId}
                      className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 animate-fade-in-right opacity-0"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Chip
                          variant="flat"
                          size="sm"
                          className="min-w-[28px] h-6 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-mono"
                        >
                          {idx + 1}
                        </Chip>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-slate-200">
                            {prob?.title  || (t("slot.unknownProblem") || "Unknown Problem")}
                          </p>
                         
                        </div>
                      </div>

                      <Switch
                        size="sm"
                        isSelected={p.isRequired}
                        onValueChange={(checked) => toggleRequired(p.problemId, checked)}
                        classNames={{
                          wrapper: "group-data-[selected=true]:bg-indigo-600",
                        }}
                      >
                        {t("slot.requiredToggle") || "Required"}
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
      <div className="sticky bottom-0 z-10 px-6 py-4 flex justify-end gap-4 bg-gray-50 dark:bg-[#0b1120] border-t border-gray-200 dark:border-indigo-500/10 backdrop-blur-sm">
        <Button
          variant="flat"
          onPress={closeModal}
          className="px-6 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600"
        >
          {t("common.cancel") || "Cancel"}
        </Button>

        <Button
          isLoading={isCreating}
          onPress={onSubmit}
          isDisabled={isCreating}
          className="px-8 font-semibold text-white min-w-[140px]"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
          }}
        >
          {isCreating ? (t("slot.creating") || "Creating...") : (t("slot.createSlot") || "Create Exam")}
        </Button>
      </div>
    </div>
  );
}