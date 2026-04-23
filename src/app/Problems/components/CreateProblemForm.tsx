"use client";

import React from "react";
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
} from "@heroui/react";

import { Save, X, ChevronLeft, ChevronRight, CheckCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { CreateProblemDraftRequest } from "@/types";
import {
  useCreateProblemDraftMutation,
  useCreateTestCaseMutation,
  useCreateTestSetMutation,
} from "@/store/queries/problem";
import { useGetTagsQuery } from "@/store/queries/Tags";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

export default function CreateProblemForm() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const [step, setStep] = React.useState(0);
  const [createdProblemId, setCreatedProblemId] = React.useState<string | null>(null);
  const [createdTestSetId, setCreatedTestSetId] = React.useState<string | null>(null);

  const [createProblemDraft, { isLoading: isCreatingProblem }] = useCreateProblemDraftMutation();
  const [createTestSet, {  }] = useCreateTestSetMutation();
  const [createTestCase, { isLoading: isCreatingTestCase }] = useCreateTestCaseMutation();
  const { data: userData, isLoading: isUserLoading } = useGetUserInformationQuery();
  const { data: fetchTags, isLoading: isTagsLoading } = useGetTagsQuery();
  const isTeacher = userData?.role?.toLowerCase() === "teacher" || userData?.role?.includes("teacher");
  const isManager = userData?.role?.toLowerCase() === "manager" || userData?.role?.includes("manager");
  console.log(isManager, isTeacher);
  
  // ── STEP 1: Problem form ──────────────────────────────────────────────────
  const [form, setForm] = React.useState<CreateProblemDraftRequest | any>({
    slug: "",
    title: "",
    typeCode: "algorithm",
    statusCode: "draft",
    visibilityCode: "public",
    scoringCode: "acm",
    descriptionMd: "",
    displayIndex: 1,
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    difficulty: "medium",
    tagIds: [] as string[],
  });
  const [statementFile, setStatementFile] = React.useState<File | null>(null);

  // ── STEP 3: TestCase files ────────────────────────────────────────────────
  const [zipFile, setZipFile] = React.useState<File | null>(null);
  const [uploadedCases, setUploadedCases] = React.useState<{ name: string; total: number }[]>([]);
  const zipRef = React.useRef<HTMLInputElement>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStep1 = async () => {
    if (!userData?.userId) {
      addToast({ title: t('common.error') || (language === 'vi' ? "Lỗi" : "Error"), description: t('problem_create.user_not_loaded') || (language === 'vi' ? "Chưa tải xong dữ liệu người dùng" : "User not loaded yet"), color: "danger" });
      return;
    }
    if (!form.slug || !form.title) {
      addToast({ title: t('common.error') || (language === 'vi' ? "Lỗi" : "Error"), description: t('problem_create.slug_title_required') || (language === 'vi' ? "Yêu cầu cung cấp Slug và Tiêu đề" : "Slug and Title are required"), color: "danger" });
      return;
    }

    if (createdProblemId) {
      setStep(1);
      return;
    }

    try {
      const formData = new FormData();
      console.log(form.difficulty);
      formData.append("slug", form.slug);
      formData.append("title", form.title);
      formData.append("difficulty", form.difficulty ? form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1).toLowerCase() : "Medium");
      formData.append("typeCode", form.typeCode);
      formData.append("visibilityCode", form.visibilityCode);
      formData.append("scoringCode", form.scoringCode);
      formData.append("descriptionMd", form.descriptionMd);
      formData.append("timeLimitMs", form.timeLimitMs.toString());
      formData.append("memoryLimitKb", form.memoryLimitKb.toString());
      const finalStatusCode = (isTeacher || isManager ) ? "published" : form.statusCode;
      
      formData.append("statusCode", finalStatusCode);
      if (statementFile) {
        formData.append("StatementFile", statementFile);
      }
      if (form.tagIds && form.tagIds.length > 0) {
        form.tagIds.forEach((tagId: string) => {
          formData.append("TagIds", tagId);
        });
      }

      const problem = await createProblemDraft(formData).unwrap();
      console.log(problem);
      setCreatedProblemId(problem.data.id);

      try {
        const ts = await createTestSet({
          id: problem.data.id,
          body: { type: "public", note: "" },
        }).unwrap();
        setCreatedTestSetId(ts?.data.id ?? null);
      } catch (tsError: any) {
        console.error("Create testset failed:", tsError);
        addToast({ title: "Warning", description: "Problem created, but failed to create default test set.", color: "warning" });
      }

      setStep(1);
    } catch (error: any) {
      console.error("Create problem failed:", error);
      addToast({ title: t('problem_create.create_failed') || (language === 'vi' ? "Tạo thất bại" : "Create Failed"), description: error?.data?.message || t('problem_create.failed_draft') || (language === 'vi' ? "Không thể tạo bản nháp bài tập" : "Failed to create problem draft"), color: "danger" });
    }
  };

  const handleUploadTestCase = async (): Promise<boolean> => {
    if (!createdProblemId || !createdTestSetId) return false;
    if (!zipFile) {
      addToast({ title: t('common.error') || (language === 'vi' ? "Lỗi" : "Error"), description: t('problem_create.select_zip') || (language === 'vi' ? "Vui lòng chọn file zip" : "Please select a zip file"), color: "danger" });
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("file", zipFile);
      formData.append("replaceExisting", "true");
      formData.append("testsetId", createdTestSetId);

      const res = await createTestCase({
        id: createdProblemId,
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
    } catch (error: any) {
      console.error("Upload testcase failed:", error);
      addToast({ title: t('problem_create.upload_failed') || (language === 'vi' ? "Tải lên thất bại" : "Upload Failed"), description: error?.data?.message || t('problem_create.check_zip_format') || (language === 'vi' ? "Kiểm tra lại định dạng file zip." : "Check your zip file format."), color: "danger" });
      return false;
    }
  };

  const handleFinish = async () => {
    if (zipFile) {
      const success = await handleUploadTestCase();
      if (!success) return;
    } else {
      if (uploadedCases.length === 0) {
        addToast({ title: t('common.error') || (language === 'vi' ? "Lỗi" : "Error"), description: t('problem_create.must_upload_testcase') || (language === 'vi' ? "Bạn phải tải lên ít nhất một file TestCase zip trước khi hoàn tất." : "You must upload at least one TestCase zip file before finishing."), color: "danger" });
        return;
      }
    }

    addToast({ title: t('common.success') || (language === 'vi' ? "Thành công" : "Success"), description: t('problem_create.problem_created_success') || (language === 'vi' ? "Tạo bài tập thành công!" : "Problem created successfully!"), color: "success" });
    router.push(`/Problems/${createdProblemId}`);
  };

  // ── UI helpers ────────────────────────────────────────────────────────────

  const StepIndicator = () => {
    const { t } = useTranslation();
    const STEPS = [
      { label: t('problem_create.step_info') || "Problem Info", description: t('problem_create.step_info_desc') || "Basic info & limits" },
      { label: t('problem_create.step_testcases') || "TestCases", description: t('problem_create.step_testcases_desc') || "Upload zip file with test cases" },
    ];
    return (
      <div className="flex items-center gap-0 mb-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all
                ${i < step ? "bg-[#22C55E] text-white" : i === step ? "bg-[#071739] text-white" : "bg-slate-100 dark:bg-white/10 text-slate-400"}`}
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
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${i < step ? "bg-[#22C55E]" : "bg-slate-200 dark:bg-white/10"}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <Button
          variant="light"
          onPress={() => router.back()}
          startContent={<ChevronLeft size={16} />}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 text-[10px]"
        >
          {t('problem_create.back_to_repo') || "Back to Repository"}
        </Button>

        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white">
            {t('problem_create.title1') || "CREATE"} <span className="text-[#FF5C00]">{t('problem_create.title2') || "PROBLEM"}</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
            {t('problem_create.subtitle') || "Define algorithm challenge, testset and testcases"}
          </p>
        </div>

        <StepIndicator />
      </div>

      {/* ── STEP 1: Problem Info ───────────────────────────────────────────── */}
      {step === 0 && (
        <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-12">
          <Input
            label={
              <div className="flex items-center gap-1">
                {t('problem_create.problem_title') || "Title"}
                <RequiredStar rules={[t('common.required_field') || "Required field"]} />
              </div>
            }
            placeholder={t('problem_create.slug_placeholder') || "Ex: Two Sum"}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="animate-fade-in-up"
            style={{ animationFillMode: 'both', animationDelay: '100ms' }}
          />

          <Input
            label={
              <div className="flex items-center gap-1">
                {t('problem_create.slug') || "slug"}
                <RequiredStar rules={[t('common.required_field') || "Required field"]} />
              </div>
            }
            placeholder={t('problem_create.slug_placeholder') || "Ex: two-sum-problem"}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="animate-fade-in-up"
            style={{ animationFillMode: 'both', animationDelay: '200ms' }}
          />

          <Divider className="animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '250ms' }} />

          <Textarea

            label={
              <div className="flex items-center gap-1">
                {t('problem_create.description') || "Description (Markdown)"}
              </div>
            }
            value={form.descriptionMd}
            onChange={(e) => setForm({ ...form, descriptionMd: e.target.value })}
            minRows={4}
            className="animate-fade-in-up"
            style={{ animationFillMode: 'both', animationDelay: '300ms' }}
          />

          <div className="flex flex-col gap-2 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '325ms' }}>
            <Autocomplete
              label={
                <div className="flex items-center gap-1">
                  {t('problem_create.selected_tags') || "Selected Tags (Optional)"}
                </div>
              }
              placeholder={form.tagIds.length === 0 ? (t('problem_create.select_tags_placeholder') || "Select auto complete tags") : ""}
              onSelectionChange={(key) => {
                if (key && !form.tagIds.includes(String(key))) {
                  setForm({ ...form, tagIds: [...form.tagIds, String(key)] });
                }
              }}
              className="text-slate-600 dark:text-slate-300"
              isLoading={isTagsLoading}
            >
              {(fetchTags || []).map((tag) => (
                <AutocompleteItem key={tag.id} textValue={tag.name || tag.id}>{tag.name || tag.id}</AutocompleteItem>
              ))}
            </Autocomplete>
            {form.tagIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tagIds.map((tagId: string) => {
                  const tagObj = fetchTags?.find(t => t.id === tagId);
                  return (
                    <Chip
                      key={tagId}
                      onClose={() => setForm({ ...form, tagIds: form.tagIds.filter((id: string) => id !== tagId) })}
                      variant="flat"
                      color="primary"
                    >
                      {tagObj?.name || tagId.substring(0, 8)}
                    </Chip>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '350ms' }}>
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '400ms' }}>
            <Input
              label={
                <div className="flex items-center gap-1">
                  {t('problem_create.time_limit') || "Time Limit (ms)"}
                  <RequiredStar rules={[t('common.required_field') || "Required field"]} />
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
                  <RequiredStar rules={[t('common.required_field') || "Required field"]} />
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
                  <RequiredStar rules={[t('common.required_field') || "Required field"]} />
                </div>
              }
              selectedKeys={[form.difficulty]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as "easy" | "medium" | "hard";
                setForm({ ...form, difficulty: value });
              }}
            >
              <SelectItem key="easy" textValue={t('problem_management.easy') || "Easy"}>{t('problem_management.easy') || "Easy"}</SelectItem>
              <SelectItem key="medium" textValue={t('problem_management.medium') || "Medium"}>{t('problem_management.medium') || "Medium"}</SelectItem>
              <SelectItem key="hard" textValue={t('problem_management.hard') || "Hard"}>{t('problem_management.hard') || "Hard"}</SelectItem>
            </Select>

            <Select
              label={
                <div className="flex items-center gap-1">
                  {t('problem_create.status_code') || "Status"}
                  <RequiredStar rules={[t('common.required_field') || "Required field"]} />
                </div>
              }
              selectedKeys={[(isTeacher || isManager) ? "published" : form.statusCode]}
              isDisabled={isTeacher || isManager}
              onSelectionChange={(keys) => {
                if (isTeacher || isManager) return;
                const value = Array.from(keys)[0] as "draft" | "pending" | "published" | "archived";
                setForm({ ...form, statusCode: value });
              }}
            >
              <SelectItem key="draft" textValue="Draft">Draft</SelectItem>
              <SelectItem key="pending" textValue="Pending">Pending</SelectItem>
              <SelectItem key="published" textValue="Published">Published</SelectItem>
              <SelectItem key="archived" textValue="Archived">Archived</SelectItem>
            </Select>
          </div>

          <RadioGroup
            label={t('problem_create.scoring_method') || "Scoring Mode"}
            value={form.scoringCode}
            onValueChange={(value) => setForm({ ...form, scoringCode: value as "acm" | "oi" })}
            className="animate-fade-in-up"
            style={{ animationFillMode: 'both', animationDelay: '500ms' }}
          >
            <Radio value="acm">ACM</Radio>
            <Radio value="oi">OI</Radio>
          </RadioGroup>

          <Switch
            isSelected={form.visibilityCode === "public"}
            onValueChange={(checked) =>
              setForm({ ...form, visibilityCode: checked ? "public" : "private" })
            }
            className="animate-fade-in-up"
            style={{ animationFillMode: 'both', animationDelay: '600ms' }}
          >
            {t('problem_create.visibility') || "Public Visible"}
          </Switch>

          <div className="flex justify-between pt-8 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '700ms' }}>
            <Button
              variant="flat"
              startContent={<X size={18} />}
              onPress={() => router.back()}
            >
              {t('common.cancel') || "Cancel"}
            </Button>

            <Button
              startContent={<ChevronRight size={20} />}
              onPress={handleStep1}
              isLoading={isCreatingProblem}
              isDisabled={isUserLoading || isCreatingProblem}
              className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em]"
            >
              {t('problem_create.proceed_testcases') || "Next — TestCases"}
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: TestCases ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 border border-transparent dark:border-[#474F5D]/30">
          <div className="flex gap-6 text-sm text-slate-400 font-bold animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '100ms' }}>
            <span>{t('problem_create.problem_id') || "Problem ID:"} <span className="text-black dark:text-white">{createdProblemId}</span></span>
            {createdTestSetId && (
              <span>{t('problem_create.testset_id') || "TestSet ID:"} <span className="text-black dark:text-white">{createdTestSetId}</span></span>
            )}
          </div>

          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '200ms' }}>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              {t('problem_create.upload_zip') || "TestCase File (.zip)"}
            </label>
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

          <div className="text-[10px] text-slate-400 bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-3 font-mono space-y-1 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '300ms' }}>
            <div>{t('problem_create.testset_id') || "testsetId:"} <span className="text-blue-400">{createdTestSetId}</span></div>
            <div>replaceExisting: <span className="text-green-400">true</span></div>
          </div>

          <Button
            startContent={<Upload size={16} />}
            onPress={handleUploadTestCase}
            isLoading={isCreatingTestCase}
            isDisabled={!zipFile || isCreatingTestCase}
            className="bg-[#071739] text-white font-black rounded-xl h-12 px-10 uppercase text-[10px] tracking-[0.2em] animate-fade-in-up"
            style={{ animationFillMode: 'both', animationDelay: '400ms' }}
          >
            {t('problem_create.upload_btn') || "Upload TestCases"}
          </Button>

          {uploadedCases.length > 0 && (
            <div className="space-y-3 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '500ms' }}>
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

          <Divider className="animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '600ms' }} />

          <div className="flex justify-between items-center pt-4 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '700ms' }}>
            <Button
              variant="flat"
              startContent={<ChevronLeft size={18} />}
              onPress={() => setStep(0)}
            >
              {t('common.cancel') || "Back"}
            </Button>

            <Button
              startContent={<Save size={20} />}
              onPress={handleFinish}
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
