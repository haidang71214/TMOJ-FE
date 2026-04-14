"use client";

import React, { use, useEffect } from "react";
import {
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Textarea,
  RadioGroup,
  Radio,
  Divider,
  Chip,
  addToast,
  Autocomplete,
  AutocompleteItem,
  Skeleton
} from "@heroui/react";

import { Save, X, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateProblemContentMutation } from "@/store/queries/problem";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";
import { useGetTagsQuery } from "@/store/queries/Tags";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

export default function AdminProblemEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { t, language } = useTranslation();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const { data: detailData, isLoading: isDetailLoading } = useGetDetailProblemPublicQuery({ id });
  const problemData = detailData?.data as any;

  const [updateProblemContent, { isLoading: isUpdatingProblem }] = useUpdateProblemContentMutation();
  const { data: fetchTags, isLoading: isTagsLoading } = useGetTagsQuery();

  const [form, setForm] = React.useState<any>({
    slug: "",
    title: "",
    typeCode: "algorithm",
    statusCode: "draft",
    visibilityCode: "public",
    scoringCode: "acm",
    descriptionMd: "",
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    difficulty: "medium",
    tagIds: [] as string[],
  });
  const [statementFile, setStatementFile] = React.useState<File | null>(null);

  useEffect(() => {
    if (problemData) {
      setForm({
        title: problemData.title || "",
        slug: problemData.slug || "",
        descriptionMd: problemData.content || problemData.descriptionMd || "",
        timeLimitMs: problemData.timeLimitMs || 1000,
        memoryLimitKb: problemData.memoryLimitKb || 262144,
        difficulty: problemData.difficulty?.toLowerCase() || "medium",
        statusCode: problemData.statusCode || "draft",
        scoringCode: problemData.scoringCode || "acm",
        visibilityCode: problemData.visibilityCode || "public",
        typeCode: problemData.typeCode || "algorithm",
        tagIds: problemData.tags?.map((t: any) => t.id) || [],
      });
    }
  }, [problemData]);

  const handleUpdate = async () => {
    if (!form.slug || !form.title) {
      addToast({ title: t('common.error') || "Error", description: "Slug and Title are required", color: "danger" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("slug", form.slug);
      formData.append("title", form.title);
      formData.append("difficulty", form.difficulty ? form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1).toLowerCase() : "Medium");
      formData.append("typeCode", form.typeCode);
      formData.append("visibilityCode", form.visibilityCode);
      formData.append("scoringCode", form.scoringCode);
      formData.append("descriptionMd", form.descriptionMd);
      formData.append("timeLimitMs", form.timeLimitMs.toString());
      formData.append("memoryLimitKb", form.memoryLimitKb.toString());
      formData.append("statusCode", form.statusCode);
      if (statementFile) {
        formData.append("StatementFile", statementFile);
      }
      if (form.tagIds && form.tagIds.length > 0) {
        form.tagIds.forEach((tagId: string) => {
          formData.append("TagIds", tagId);
        });
      }
      
      await updateProblemContent({ problemId: id, body: formData }).unwrap();  
      addToast({ title: t('common.success') || "Success", description: "Problem updated successfully!", color: "success" });
      router.back();
    } catch (error: any) {
      console.error("Update problem failed:", error);
      addToast({ title: "Update Failed", description: error?.data?.message || "Failed to update problem", color: "danger" });
    }
  };

  if (isDetailLoading) {
    return (
      <div className="flex flex-col gap-8 pb-20 p-2 max-w-6xl mx-auto items-center pt-20">
        <Skeleton className="w-[300px] h-[50px] rounded-2xl" />
        <Skeleton className="w-full h-[500px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <Button
          variant="light"
          onPress={() => router.back()}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 transition-colors h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          {t('problem_create.back_to_repo') || "Back to Management"}
        </Button>
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            EDIT <span className="text-[#FF5C00]">PROBLEM</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              Admin Edit ID: #{id}
            </span>
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              className="font-black uppercase text-[8px] h-5 italic px-2"
            >
              System Data
            </Chip>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10">
        
        <Input
          label={
            <div className="flex items-center gap-1">
              {t('problem_create.problem_title') || "Title"}
              <RequiredStar rules={["Required field"]} />
            </div>
          } 
          placeholder={t('problem_create.slug_placeholder') || "Ex: Two Sum"}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          classNames={{
            inputWrapper: "h-14 rounded-2xl",
            input: "font-bold text-lg",
          }}
        />

        <Input
          label={
            <div className="flex items-center gap-1">
              {t('problem_create.slug') || "Slug"}
              <RequiredStar rules={["Required field"]} />
            </div>
          } 
          placeholder="Ex: two-sum-problem"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          classNames={{
            inputWrapper: "h-14 rounded-2xl",
          }}
        />

        <Divider />

        <Textarea
          label={
            <div className="flex items-center gap-1">
              {t('problem_create.description') || "Description (Markdown)"}
            </div>
          }
          value={form.descriptionMd}
          onChange={(e) => setForm({ ...form, descriptionMd: e.target.value })}
          minRows={5}
        />

        <div className="flex flex-col gap-2">
          <label className="text-small font-medium text-foreground">
            {t('problem_create.selected_tags') || "Selected Tags (Optional)"}
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-default-100 hover:bg-default-200 focus-within:bg-default-100 transition-colors rounded-medium min-h-12 border-none">
            {form.tagIds.map((tagId: string) => {
              const tagObj = fetchTags?.find(t => t.id === tagId);
              return (
                <Chip
                  key={tagId}
                  onClose={() => setForm({ ...form, tagIds: form.tagIds.filter((id: string) => id !== tagId) })}
                  variant="flat"
                  color="primary"
                  size="sm"
                >
                  {tagObj?.name || tagId.substring(0, 8)}
                </Chip>
              );
            })}
            
            <Autocomplete
              aria-label="Tags"
              placeholder={form.tagIds.length === 0 ? (t('problem_create.select_tags_placeholder') || "Select auto complete tags") : ""}
              onSelectionChange={(key) => {
                if (key && !form.tagIds.includes(String(key))) {
                  setForm({ ...form, tagIds: [...form.tagIds, String(key)] });
                }
              }}
              className="flex-1 min-w-[200px]"
              isLoading={isTagsLoading}
              listboxProps={{ emptyContent: "No tags found." }}
              inputProps={{
                classNames: {
                  inputWrapper: "bg-transparent border-none shadow-none hover:bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent !min-h-8 p-0",
                  innerWrapper: "pb-1"
                }
              }}
            >
              {(fetchTags || []).map((tag) => (
                <AutocompleteItem key={tag.id} textValue={tag.name || tag.id}>{tag.name || tag.id}</AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
            {t('problem_create.statement_file') || "Statement File (.md / .pdf) - Optional"}
          </label>
          <input
            type="file"
            accept=".md,.pdf"
            onChange={(e) => setStatementFile(e.target.files?.[0] ?? null)}
            className="text-sm border border-slate-200 dark:border-white/10 rounded-xl p-3 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Input
            label={
              <div className="flex items-center gap-1">
                {t('problem_create.time_limit') || "Time Limit (ms)"}
                <RequiredStar rules={["Required"]} />
              </div>
            }
            type="number"
            value={form.timeLimitMs.toString()}
            onChange={(e) => setForm({ ...form, timeLimitMs: Number(e.target.value) })}
          />

          <Input
            label={
              <div className="flex items-center gap-1">
                {t('problem_create.memory_limit') || "Memory Limit (MB)"}
                <RequiredStar rules={["Required"]} />
              </div>
            }
            type="number"
            value={(form.memoryLimitKb / 1024).toString()}
            onChange={(e) => setForm({ ...form, memoryLimitKb: Number(e.target.value) * 1024 })}
          />

          <Select
            label={
              <div className="flex items-center gap-1">
                {t('problem_create.difficulty') || "Difficulty"}
                <RequiredStar rules={["Required"]} />
              </div>
            }
            selectedKeys={[form.difficulty]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as "easy" | "medium" | "hard";
              setForm({ ...form, difficulty: value });
            }}
          >
            <SelectItem key="easy">{t('problem_management.easy') || "Easy"}</SelectItem>
            <SelectItem key="medium">{t('problem_management.medium') || "Medium"}</SelectItem>
            <SelectItem key="hard">{t('problem_management.hard') || "Hard"}</SelectItem>
          </Select>

          <Select
            label={
              <div className="flex items-center gap-1">
                {t('problem_create.status_code') || "Status"}
                <RequiredStar rules={["Required"]} />
              </div>
            }
            selectedKeys={[form.statusCode]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as "draft" | "pending" | "published" | "archived";
              setForm({ ...form, statusCode: value });
            }}
          >
            <SelectItem key="draft">Draft</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="published">Published</SelectItem>
            <SelectItem key="archived">Archived</SelectItem>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5">
            <RadioGroup
              label={t('problem_create.scoring_method') || "Scoring Mode"}
              value={form.scoringCode}
              onValueChange={(value) => setForm({ ...form, scoringCode: value as "acm" | "oi" })}
              classNames={{ label: "text-black dark:text-white font-black uppercase text-[10px] tracking-widest mb-4" }}
            >
              <div className="flex gap-8">
                <Radio value="acm" classNames={{ label: "text-[11px] font-black uppercase italic" }}>ACM Mode</Radio>
                <Radio value="oi" classNames={{ label: "text-[11px] font-black uppercase italic" }}>OI Mode</Radio>
              </div>
            </RadioGroup>
          </div>
          
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5 flex items-center">
            <Switch
              isSelected={form.visibilityCode === "public"}
              onValueChange={(checked) =>
                setForm({ ...form, visibilityCode: checked ? "public" : "private" })
              }
              classNames={{
                wrapper: "group-data-[selected=true]:bg-blue-600 dark:group-data-[selected=true]:bg-[#22C55E]",
              }}
            >
              <span className="text-[11px] font-black uppercase italic text-slate-500 dark:text-slate-300">
                {t('problem_create.visibility') || "Public Visible"}
              </span>
            </Switch>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-white/5">
          <Button
            variant="flat"
            startContent={<X size={18} />}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest px-10 h-12 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all"
            onClick={() => router.back()}
          >
            Discard Changes
          </Button>
          <Button
            startContent={<Save size={20} strokeWidth={3} />}
            onPress={handleUpdate}
            isLoading={isUpdatingProblem}
            className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all hover:bg-[#22C55E] hover:shadow-green-500/20 active:scale-95"
          >
            Update Admin Problem
          </Button>
        </div>
      </div>
    </div>
  );
}
