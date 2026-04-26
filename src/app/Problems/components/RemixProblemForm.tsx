"use client";

import React, { useEffect } from "react";
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
  Spinner,
} from "@heroui/react";

import { Save, X, ChevronLeft, ChevronRight, CheckCircle, Upload, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

import { ErrorForm } from "@/types";
import {
  useCreateTestCaseMutation,
  useCreateTestSetMutation,
  useCreateRemixProblemMutation,
} from "@/store/queries/problem";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";
import { useGetTagsQuery } from "@/store/queries/Tags";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

interface RemixProblemFormProps {
  originId: string;
  onCancel?: () => void;
}

export default function RemixProblemForm({ originId, onCancel }: RemixProblemFormProps) {
  const router = useRouter();
  const { t, language } = useTranslation();

  const [step, setStep] = React.useState(0);
  const [createdProblemId, setCreatedProblemId] = React.useState<string | null>(null);
  const [createdTestSetId, setCreatedTestSetId] = React.useState<string | null>(null);

  // Queries & Mutations
  const { data: originResponse, isLoading: isOriginLoading } = useGetDetailProblemPublicQuery({ id: originId });
  const [createRemixProblem, { isLoading: isCreatingProblem }] = useCreateRemixProblemMutation();
  const [createTestSet] = useCreateTestSetMutation();
  const [createTestCase, { isLoading: isCreatingTestCase }] = useCreateTestCaseMutation();
  const { data: userData, isLoading: isUserLoading } = useGetUserInformationQuery();
  const { data: fetchTags, isLoading: isTagsLoading } = useGetTagsQuery();
  
  const isTeacher = userData?.role?.toLowerCase() === "teacher" || userData?.role?.includes("teacher");
  const isManager = userData?.role?.toLowerCase() === "manager" || userData?.role?.includes("manager");

  const [form, setForm] = React.useState<any>({
    slug: "",
    title: "",
    typeCode: "algorithm",
    statusCode: "published",
    visibilityCode: "public",
    scoringCode: "acm",
    descriptionMd: "",
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    difficulty: "medium",
    tagIds: [] as string[],
    problemMode: "amateur",
    originSlug: "",
  });
  const [statementFile, setStatementFile] = React.useState<File | null>(null);

  // Pre-fill form when origin data arrives
  useEffect(() => {
    if (originResponse) {
      const p = originResponse;
      setForm({
        slug: `${p.slug || ""}-remix`,
        title: `${p.title || ""} (Remix)`,
        typeCode: p.typeCode || "algorithm",
        statusCode: "published",
        visibilityCode: p.visibilityCode || "public",
        scoringCode: p.scoringCode || "acm",
        descriptionMd: p.descriptionMd || p.content || "",
        timeLimitMs: p.timeLimitMs || 1000,
        memoryLimitKb: p.memoryLimitKb || 262144,
        difficulty: p.difficulty?.toLowerCase() || "medium",
        tagIds: p.tags?.map((t: any) => (typeof t === "string" ? t : t.id)) || [],
        problemMode: p.problemMode || "amateur",
        originSlug: p.slug || "",
      });
    }
  }, [originResponse]);

  // STEP 3: TestCase files
  const [zipFile, setZipFile] = React.useState<File | null>(null);
  const [uploadedCases, setUploadedCases] = React.useState<{ name: string; total: number }[]>([]);
  const zipRef = React.useRef<HTMLInputElement>(null);

  const handleStep1 = async () => {
    if (!userData?.userId) {
      addToast({ title: "Error", description: "User not loaded", color: "danger" });
      return;
    }
    
    if (!form.slug || !form.title) {
      addToast({ title: "Error", description: "Slug and Title are required", color: "danger" });
      return;
    }

    if (createdProblemId) {
      setStep(1);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("originProblemId", originId);
      formData.append("originProblemSlug", form.originSlug);
      formData.append("slug", form.slug);
      formData.append("title", form.title);
      
      // TitleCase for enums
      formData.append("difficulty", form.difficulty ? form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1).toLowerCase() : "Medium");
      formData.append("typeCode", form.typeCode);
      formData.append("visibilityCode", form.visibilityCode);
      formData.append("scoringCode", form.scoringCode);
      formData.append("timeLimitMs", form.timeLimitMs.toString());
      formData.append("memoryLimitKb", form.memoryLimitKb.toString());
      formData.append("problemMode", form.problemMode);
      
      const finalStatusCode = (isTeacher || isManager) ? "Published" : (form.statusCode ? form.statusCode.charAt(0).toUpperCase() + form.statusCode.slice(1).toLowerCase() : "Draft");
      formData.append("statusCode", finalStatusCode);

      if (form.descriptionMd) {
        formData.append("descriptionMd", form.descriptionMd);
      }
      if (statementFile) {
        formData.append("statementFile", statementFile);
      }

      if (form.tagIds && form.tagIds.length > 0) {
        form.tagIds.forEach((tagId: string) => formData.append("tagIds", tagId));
      }

      const problem = await createRemixProblem(formData).unwrap();
      setCreatedProblemId(problem.data.id);

      try {
        const ts = await createTestSet({
          id: problem.data.id,
          body: { type: "public", note: "Auto-created for remix" },
        }).unwrap();
        setCreatedTestSetId(ts?.data.id ?? null);
      } catch {
        addToast({ title: "Warning", description: "Problem remixed, but failed to create default test set.", color: "warning" });
      }

      setStep(1);
    } catch (error: unknown) {
      const err = error as ErrorForm;
      addToast({
        title: "Remix Failed",
        description: err?.data?.data?.message || "Failed to create remix problem",
        color: "danger"
      });
    }
  };

  const handleUploadTestCase = async (): Promise<boolean> => {
    if (!createdProblemId || !createdTestSetId) return false;
    if (!zipFile) {
      addToast({ title: "Error", description: "Please select a zip file", color: "danger" });
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
      addToast({ title: "Success", description: "Testcases uploaded successfully!", color: "success" });
      return true;
    } catch (error) {
      const err = error as ErrorForm;
      addToast({ title: "Upload Failed", description: err?.data?.data?.message || "Check your zip file format.", color: "danger" });
      return false;
    }
  };

  const handleFinish = async () => {
    if (zipFile) {
      const success = await handleUploadTestCase();
      if (!success) return;
    }

    addToast({ title: "Success", description: "Remix completed successfully!", color: "success" });
    router.push(`/Problems/${createdProblemId}`);
  };

  if (isOriginLoading || isUserLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
        <Spinner size="lg" color="warning" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching original problem data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <Button
          variant="light"
          onPress={() => onCancel ? onCancel() : router.back()}
          startContent={<ChevronLeft size={16} />}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 text-[10px]"
        >
          Cancel Remix
        </Button>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/10 rounded-xl animate-pulse">
                <Flame size={32} className="text-orange-500" />
             </div>
             <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white">
                REMIX <span className="text-[#FF5C00]">PROBLEM</span>
             </h1>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
            Cloning from: <span className="text-orange-500">#{originId}</span> — Customize before saving
          </p>
        </div>

        {/* Step Indicator (Simplified) */}
        <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${step === 0 ? "bg-orange-500 text-white shadow-lg" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
                1. Info & Settings
            </div>
            <div className="w-8 h-px bg-slate-200 dark:bg-white/10" />
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${step === 1 ? "bg-green-500 text-white shadow-lg" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
                2. Testcases
            </div>
        </div>
      </div>

      {step === 0 && (
        <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-12 animate-fade-in-up">
          <Input
            label={t('problem_create.problem_title') || "Title"}
            placeholder="Ex: Two Sum (Remix)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Input
            label={t('problem_create.slug') || "Slug"}
            placeholder="Ex: two-sum-remix"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <Divider />

          <Textarea
            label={t('problem_create.description') || "Description (Markdown)"}
            value={form.descriptionMd}
            onChange={(e) => setForm({ ...form, descriptionMd: e.target.value })}
            minRows={6}
            className="font-mono"
          />

          <div className="flex flex-col gap-2">
            <Autocomplete
              label={t('problem_create.selected_tags') || "Tags"}
              placeholder="Select tags..."
              onSelectionChange={(key) => {
                if (key && !form.tagIds.includes(String(key))) {
                  setForm({ ...form, tagIds: [...form.tagIds, String(key)] });
                }
              }}
              isLoading={isTagsLoading}
            >
              {(fetchTags || []).map((tag) => (
                <AutocompleteItem key={tag.id} textValue={tag.name ?? undefined}>{tag.name || tag.id}</AutocompleteItem>
              ))}
            </Autocomplete>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tagIds.map((tagId: string) => {
                const tagObj = fetchTags?.find(t => t.id === tagId);
                return (
                  <Chip
                    key={tagId}
                    onClose={() => setForm({ ...form, tagIds: form.tagIds.filter((id: string) => id !== tagId) })}
                    variant="flat"
                    color="warning"
                  >
                    {tagObj?.name || tagId}
                  </Chip>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label={t('problem_create.time_limit') || "Time Limit (ms)"}
              type="number"
              value={form.timeLimitMs.toString()}
              onChange={(e) => setForm({ ...form, timeLimitMs: Number(e.target.value) })}
            />
            <Input
              label={t('problem_create.memory_limit') || "Memory Limit (MB)"}
              type="number"
              value={(form.memoryLimitKb / 1024).toString()}
              onChange={(e) => setForm({ ...form, memoryLimitKb: Number(e.target.value) * 1024 })}
            />
            <Select
              label={t('problem_create.difficulty') || "Difficulty"}
              selectedKeys={[form.difficulty]}
              onSelectionChange={(keys) => setForm({ ...form, difficulty: Array.from(keys)[0] as string })}
            >
              <SelectItem key="easy" textValue="Easy">Easy</SelectItem>
              <SelectItem key="medium" textValue="Medium">Medium</SelectItem>
              <SelectItem key="hard" textValue="Hard">Hard</SelectItem>
            </Select>
            <Select
              label={t('problem_create.problem_mode') || "Mode"}
              selectedKeys={[form.problemMode]}
              onSelectionChange={(keys) => setForm({ ...form, problemMode: Array.from(keys)[0] as string })}
            >
              <SelectItem key="amateur" textValue="Amateur">Amateur</SelectItem>
              <SelectItem key="pro" textValue="Pro">Pro</SelectItem>
            </Select>
            <Select
              label={t('problem_create.visibility') || "Visibility"}
              selectedKeys={[form.visibilityCode]}
              onSelectionChange={(keys) => setForm({ ...form, visibilityCode: Array.from(keys)[0] as string })}
            >
              <SelectItem key="public" textValue="Public">Public</SelectItem>
              <SelectItem key="in-bank" textValue="In Bank">In Bank</SelectItem>
            </Select>
          </div>

          <div className="flex justify-between pt-8">
            <Button variant="flat" onPress={() => onCancel ? onCancel() : router.back()}>{t('common.cancel') || "Cancel"}</Button>
            <Button
              className="bg-orange-600 text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-orange-500/20 active-bump"
              onPress={handleStep1}
              isLoading={isCreatingProblem}
              isDisabled={isUserLoading || isCreatingProblem}
            >
              Confirm Remix & Next
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 animate-fade-in-up">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 italic">
            Optional: You can upload new testcases for this remix. If skipped, it may use original data or require manual setup.
          </p>
          <div
            className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-orange-400 transition-all bg-slate-50 dark:bg-white/5"
            onClick={() => zipRef.current?.click()}
          >
            <Upload size={40} className="text-orange-500 opacity-50" />
            <div className="text-center">
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">
                {zipFile ? zipFile.name : "Select NEW Testcases (.zip)"}
              </span>
              <span className="text-[10px] text-slate-400">Drag & drop or click to browse</span>
            </div>
          </div>
          <input
            ref={zipRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => setZipFile(e.target.files?.[0] ?? null)}
          />

          <Button
            onPress={handleUploadTestCase}
            isLoading={isCreatingTestCase}
            isDisabled={!zipFile || isCreatingTestCase}
            className="bg-[#071739] text-white font-black rounded-xl h-12 px-10 uppercase text-[10px] tracking-widest w-fit mx-auto"
          >
            Upload Now
          </Button>

          <Divider />

          <div className="flex justify-between items-center pt-4">
            <Button variant="flat" onPress={() => setStep(0)} startContent={<ChevronLeft size={16} />}>Back</Button>
            <Button
              className="bg-green-600 text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-green-500/20 active-bump"
              onPress={handleFinish}
            >
              Finish Remix
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
