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

import { Save, X, ChevronLeft, ChevronRight, Upload, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateProblemContentMutation, useCreateTestCaseMutation, useCreateTestSetMutation } from "@/store/queries/problem";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";
import { useGetTagsQuery } from "@/store/queries/Tags";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";
import { ErrorForm } from "@/types";

export default function GlobalProblemEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { t, language } = useTranslation();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const { data: detailData, isLoading: isDetailLoading } = useGetDetailProblemPublicQuery({ id });
  const problemData = detailData as any;
  console.log(problemData);
  const [updateProblemContent, { isLoading: isUpdatingProblem }] = useUpdateProblemContentMutation();
  const { data: fetchTags, isLoading: isTagsLoading } = useGetTagsQuery();

  const [zipFile, setZipFile] = React.useState<File | null>(null);
  const [uploadedCases, setUploadedCases] = React.useState<{ name: string; total: number }[]>([]);
  const zipRef = React.useRef<HTMLInputElement>(null);

  const [createTestSet] = useCreateTestSetMutation();
  const [createTestCase, { isLoading: isCreatingTestCase }] = useCreateTestCaseMutation();
  const [step, setStep] = React.useState(0);

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
    problemMode: "amateur",
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
        problemMode: problemData.problemMode || "amateur",
      });
    }
  }, [problemData]);

  const handleUploadTestCase = async (): Promise<boolean> => {
    if (!id) return false;
    if (!zipFile) {
      addToast({ title: t('common.error') || (language === 'vi' ? "Lỗi" : "Error"), description: t('problem_create.select_zip') || (language === 'vi' ? "Vui lòng chọn file zip" : "Please select a zip file"), color: "danger" });
      return false;
    }

    try {
      let targetTestsetId = problemData?.primaryTestsetId;
      
      if (!targetTestsetId) {
        // Create one if it doesn't exist
        const ts = await createTestSet({
          id: id,
          body: { type: "public", note: "" },
        }).unwrap();
        targetTestsetId = ts?.data.id;
      }
      
      if (!targetTestsetId) {
        addToast({ title: "Error", description: "Could not resolve Testset ID", color: "danger" });
        return false;
      }

      const formData = new FormData();
      formData.append("File", zipFile);
      formData.append("ReplaceExisting", "true");
      formData.append("TestsetId", targetTestsetId);

      const res = await createTestCase({
        id: id,
        body: formData,
      }).unwrap();

      setUploadedCases((prev) => [
        ...prev,
        { name: zipFile.name, total: res.data?.total ?? 0 },
      ]);
      setZipFile(null);
      if (zipRef.current) zipRef.current.value = "";
      addToast({ title: t('common.success') || (language === 'vi' ? "Thành công" : "Success"), description: t('problem_create.upload_success') || (language === 'vi' ? "Tải testcase thành công!" : "Testcases uploaded successfully!"), color: "success" });
      return true;
    } catch (error) {
      const err = error as ErrorForm;
      addToast({ title: t('problem_create.upload_failed') || (language === 'vi' ? "Tải lên thất bại" : "Upload Failed"), description: err?.data?.data?.message || t('problem_create.check_zip_format') || (language === 'vi' ? "Kiểm tra lại định dạng file zip." : "Check your zip file format."), color: "danger" });
      return false;
    }
  };

  const handleStep1 = async () => {
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
      formData.append("problemMode", form.problemMode);
      formData.append("statusCode", form.statusCode);

          if (statementFile) {
        formData.append("StatementFile", statementFile);
      }
      if (form.tagIds && form.tagIds.length > 0) {
        form.tagIds.forEach((tagId: string) => {
          formData.append("TagIds", tagId);
        });
      }
      
    const a =   await updateProblemContent({ problemId: id, body: formData }).unwrap();  
    console.log(a);
      addToast({ title: t('common.success') || "Success", description: "Problem updated successfully!", color: "success" });
      setStep(1);
    } catch (error) {
      console.error("Update problem failed:", error);
      const err = error as ErrorForm;
      addToast({ title: "Update Failed", description: err?.data?.data?.message || "Failed to update problem", color: "danger" });
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

  const StepIndicator = () => {
    return (
      <div className="flex items-center gap-0 mt-4 mb-2">
        {[
          { label: t('problem_create.step_info') || "Problem Info", description: t('problem_create.step_info_desc') || "Basic info & limits" },
          { label: t('problem_create.step_testcases') || "TestCases", description: t('problem_create.step_testcases_desc') || "Upload zip file with test cases" },
        ].map((s, i, arr) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all
                ${i < step ? "bg-[#22C55E] text-white" : i === step ? "bg-[#071739] dark:bg-[#FF5C00] text-white" : "bg-slate-100 dark:bg-white/10 text-slate-400"}`}
              >
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <div className={`text-[10px] font-black uppercase tracking-widest ${i === step ? "text-[#071739] dark:text-white" : "text-slate-400"}`}>
                  {s.label}
                </div>
                <div className="text-[9px] text-slate-400">{s.description}</div>
              </div>
            </div>
            {i < arr.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${i < step ? "bg-[#22C55E]" : "bg-slate-200 dark:bg-white/10"}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

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
          {t('problem_create.back_to_repo') || "Back to Repository"}
        </Button>
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            EDIT <span className="text-[#FF5C00]">REPOSITORY PROBLEM</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              Global ID: #{id}
            </span>
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              className="font-black uppercase text-[8px] h-5 italic px-2"
            >
              Master Data
            </Chip>
          </div>
        </div>
        <StepIndicator />
      </div>

      {step === 0 && (
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
                  {t('problem_create.mode') || "Mode"}
                  <RequiredStar rules={["Required"]} />
                </div>
              }
              selectedKeys={[form.problemMode]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as "amateur" | "pro";
                setForm({ ...form, problemMode: value });
              }}
            >
              <SelectItem key="amateur">Amateur</SelectItem>
              <SelectItem key="pro">Pro</SelectItem>
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
            startContent={<ChevronRight size={20} strokeWidth={3} />}
            onPress={handleStep1}
            isLoading={isUpdatingProblem}
            className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all hover:bg-[#22C55E] hover:shadow-green-500/20 active:scale-95"
          >
            Update & Next
          </Button>
        </div>
      </div>
      )}

      {step === 1 && (
      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-10 shadow-sm border border-transparent dark:border-white/5 space-y-10">
        <div className="flex flex-col gap-6">
          <div className="flex gap-6 text-sm text-slate-400 font-bold">
            <span>Global ID: <span className="text-black dark:text-white">#{id}</span></span>
            {problemData?.primaryTestsetId && (
              <span>TestSet ID: <span className="text-black dark:text-white">{problemData.primaryTestsetId}</span></span>
            )}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black italic uppercase text-[#071739] dark:text-white">
              {t('problem_create.step_testcases') || "TestCases"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
              {t('problem_create.upload_zip') || "TestCase File (.zip)"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => zipRef.current?.click()}
            >
              <Upload size={28} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400">
                {zipFile ? zipFile.name : (t('problem_create.upload_instruction') || "Click to select zip file")}
              </span>
              {zipFile && (
                <span className="text-[10px] text-slate-300">{(zipFile.size / 1024).toFixed(1)} KB</span>
              )}
            </div>
            <input
              ref={zipRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => setZipFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <Button
            startContent={<Upload size={16} />}
            onPress={handleUploadTestCase}
            isLoading={isCreatingTestCase}
            isDisabled={!zipFile || isCreatingTestCase}
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black rounded-xl h-12 px-10 uppercase text-[10px] tracking-[0.2em] w-fit"
          >
            {t('problem_create.upload_btn') || "Upload TestCases"}
          </Button>

          {uploadedCases.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                {t('problem_create.upload_history') || "Upload History"} ({uploadedCases.length})
              </h3>
              <div className="flex flex-col gap-2">
                {uploadedCases.map((tc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-white/5 px-5 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-white/70">
                        {tc.name}
                      </span>
                    </div>
                    <Chip size="sm" variant="flat" color="success">{tc.total} {t('problem_create.cases') || "cases"}</Chip>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS STEP 1 */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-white/5">
          <Button
            variant="flat"
            startContent={<ChevronLeft size={18} />}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest px-10 h-12 bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-500 transition-all"
            onClick={() => setStep(0)}
          >
            {t('common.cancel') || "Back"}
          </Button>
          <Button
            startContent={<Save size={20} strokeWidth={3} />}
            onPress={() => router.push(`/Problems/${id}`)}
            className="bg-[#22C55E] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl hover:shadow-green-500/30 transition-all"
          >
            {t('problem_create.finish') || "Finish & View Problem"}
          </Button>
        </div>
      </div>
      )}
    </div>
  );
}
