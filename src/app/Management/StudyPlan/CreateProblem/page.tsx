"use client";

import React, { useEffect } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  RadioGroup,
  Radio,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Autocomplete,
  AutocompleteItem,
  addToast,
} from "@heroui/react";

import { Save, ArrowLeft, ArrowRight, Check, UploadCloud } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { CreateProblemDraftRequest } from "@/types";
import {
  useCreateTestCaseMutation,
  useCreateTestSetMutation,
} from "@/store/queries/problem";
import { useCreateProblemInPlanMutation } from "@/store/queries/StudyPlan";
import { useGetTagsQuery } from "@/store/queries/Tags";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

const STEPS = [
  { id: 1, label: "Basic Configuration", description: "Problem details and constraints" },
  { id: 2, label: "Upload Testcases", description: "Upload inputs and outputs" },
];

export default function CreateProblemStudyPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStudyPlanId = searchParams.get("studyPlanId");
  const { t, language } = useTranslation();

  const [step, setStep] = React.useState(0);
  const [createdProblemId, setCreatedProblemId] = React.useState<string | null>(null);
  const [createdTestSetId, setCreatedTestSetId] = React.useState<string | null>(null);

  const [createProblemInPlan, { isLoading: isCreatingProblem }] = useCreateProblemInPlanMutation();
  const [createTestSet, { isLoading: isCreatingTestSet }] = useCreateTestSetMutation();
  const [createTestCase, { isLoading: isCreatingTestCase }] = useCreateTestCaseMutation();
  const { data: userData, isLoading: isUserLoading } = useGetUserInformationQuery();
  const { data: fetchTags, isLoading: isTagsLoading } = useGetTagsQuery();
  const isTeacher = userData?.role?.toLowerCase() === "teacher" || userData?.role?.includes("teacher");

  const [studyPlanId, setStudyPlanId] = React.useState<string>(initialStudyPlanId || "");

  // ── STEP 1: Problem form
  const [form, setForm] = React.useState<CreateProblemDraftRequest | any>({
    slug: "",
    title: "",
    difficulty: "medium",
    typeCode: "algorithm",
    statusCode: "draft",
    scoringCode: "acm",
    descriptionMd: "",
    displayIndex: 1,
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    tagIds: [] as string[],
    problemMode: "amateur",
  });
  const [statementFile, setStatementFile] = React.useState<File | null>(null);

  // ── STEP 2: TestCase files
  const [zipFile, setZipFile] = React.useState<File | null>(null);
  const [uploadedCases, setUploadedCases] = React.useState<{ name: string; total: number }[]>([]);
  const zipRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialStudyPlanId) {
      setStudyPlanId(initialStudyPlanId);
    }
  }, [initialStudyPlanId]);

  const handleStep1 = async () => {
    if (!userData?.userId) {
      addToast({ title: "User not loaded yet", color: "danger" });
      return;
    }

    if (!form.slug || !form.title) {
      addToast({ title: "Slug and Title are required", color: "danger" });
      return;
    }

    try {
      const formData = new FormData();
      console.log(form.statusCode);
      formData.append("studyPlanId", studyPlanId);
      formData.append("slug", form.slug);
      formData.append("title", form.title);
      formData.append("difficulty", form.difficulty ? form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1).toLowerCase() : "Medium");
      formData.append("typeCode", form.typeCode);
      formData.append("scoringCode", form.scoringCode);
      formData.append("descriptionMd", form.descriptionMd || "");
      formData.append("timeLimitMs", form.timeLimitMs.toString());
      formData.append("memoryLimitKb", form.memoryLimitKb.toString());
      const finalStatusCode = isTeacher ? "published" : form.statusCode;
      formData.append("statusCode", finalStatusCode);

      if (form.tagIds && form.tagIds.length > 0) {
        form.tagIds.forEach((tagId: string) => {
          formData.append("TagIds", tagId);
        });
      }

      if (statementFile) {
        formData.append("StatementFile", statementFile);
      }

      const problem = await createProblemInPlan(formData).unwrap();

      setCreatedProblemId(problem.data.id);

      try {
        const ts = await createTestSet({
          id: problem.data.id,
          body: { type: "public", note: "" },
        }).unwrap();
        
        setCreatedTestSetId(ts?.data.id ?? null);
      } catch (testsetError) {
        console.error("Create testset failed:", testsetError);
        addToast({ title: "Problem created, but failed to create default test set", color: "warning" });
      }

      setStep(1);
    } catch (error) {
      console.error("Create problem failed:", error);
      addToast({ title: "Create problem failed", color: "danger" });
    }
  };

  const handleUploadTestCase = async () => {
    if (!createdProblemId || !createdTestSetId) return;
    if (!zipFile) { addToast({ title: "Please select a zip file", color: "warning" }); return; }

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
    } catch (error) {
      console.error("Upload testcase failed:", error);
      addToast({ title: "Upload testcase failed", color: "danger" });
    }
  };



  return (
    <div className="flex w-full flex-col gap-6 mx-auto max-w-5xl pb-10 p-2">
      <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "50ms", animationFillMode: "both" }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Problem to Study Plan</h1>
          <p className="text-sm text-default-500 mt-1">
            Complete the steps below to configure a new problem for the study plan.
          </p>
        </div>
        <Button
          variant="light"
          startContent={<ArrowLeft size={16} />}
          onPress={() => router.back()}
          className="font-medium"
        >
          Cancel & Return
        </Button>
      </div>

      <div className="flex w-full items-center justify-between mb-8 animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-start gap-2 relative">
              <div className={`flex items-center gap-3 ${i <= step ? "text-primary" : "text-default-400"}`}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors
                    ${i < step ? "bg-primary border-primary text-white" : i === step ? "border-primary text-primary" : "border-default-300 text-default-400"}`}
                >
                  {i < step ? <Check size={16} /> : s.id}
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-default-400">{s.description}</p>
                </div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-[2px] flex-1 mx-4 ${i < step ? "bg-primary" : "bg-default-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 0 && (
        <Card className="border-none shadow-sm dark:bg-default-50/50 animate-fade-in-up" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
          <CardHeader className="px-8 pt-8 pb-0">
            <h2 className="text-lg font-semibold">Problem Metadata</h2>
          </CardHeader>
          <CardBody className="p-8 gap-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={<div className="flex items-center gap-1">Problem Title<RequiredStar rules={["Required field"]} /></div>}
                placeholder="e.g. Binary Search"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
              />
              <Input
                label={<div className="flex items-center gap-1">URL Slug<RequiredStar rules={["Required field"]} /></div>}
                placeholder="e.g. binary-search"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
              />
            </div>

            <Textarea
              label={<div className="flex items-center gap-1">Problem Description (Markdown)<RequiredStar rules={["Required field"]} /></div>}
              placeholder="Write the problem statement here..."
              value={form.descriptionMd}
              onChange={(e) => setForm({ ...form, descriptionMd: e.target.value })}
              variant="bordered"
              radius="sm"
              minRows={6}
              labelPlacement="outside"
            />

            <div className="flex flex-col gap-2">
              <Autocomplete
                label="Search & Add Tags (Optional)"
                placeholder="Type to search tags..."
                onSelectionChange={(key) => {
                  if (key && !form.tagIds.includes(String(key))) {
                    setForm({ ...form, tagIds: [...form.tagIds, String(key)] });
                  }
                }}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                isLoading={isTagsLoading}
              >
                {(fetchTags || []).map((tag) => (
                  <AutocompleteItem key={tag.id} textValue={tag.name || tag.id}>{tag.name || tag.id}</AutocompleteItem>
                ))}
              </Autocomplete>
              {form.tagIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
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
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-small font-medium text-foreground">Statement File (.md, .pdf) - Optional</label>
              <input
                type="file"
                accept=".md,.pdf"
                onChange={(e) => setStatementFile(e.target.files?.[0] ?? null)}
                className="text-sm border border-default-200 rounded-md p-2 bg-default-50"
              />
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label={<div className="flex items-center gap-1">Difficulty<RequiredStar rules={["Required field","Import statement will be used if no option value is selected"]} /></div>}
                selectedKeys={[form.difficulty]}
                onSelectionChange={(keys) => setForm({ ...form, difficulty: Array.from(keys)[0] as string })}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
              >
                <SelectItem key="easy">Easy</SelectItem>
                <SelectItem key="medium">Medium</SelectItem>
                <SelectItem key="hard">Hard</SelectItem>
              </Select>
              <Select
                label={<div className="flex items-center gap-1">Problem Mode<RequiredStar rules={["Required field"]} /></div>}
                selectedKeys={[form.problemMode]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as "amateur" | "pro";
                  setForm({ ...form, problemMode: value });
                }}
              >
                <SelectItem key="amateur">Amateur (Cơ bản)</SelectItem>
                <SelectItem key="pro">Pro (Nâng cao)</SelectItem>
              </Select>
              <Select
                label={<div className="flex items-center gap-1">Status<RequiredStar rules={["Required field"]} /></div>}
                selectedKeys={[isTeacher ? "published" : form.statusCode]}
                isDisabled={isTeacher}
                onSelectionChange={(keys) => {
                  if (isTeacher) return;
                  setForm({ ...form, statusCode: Array.from(keys)[0] as string });
                }}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
              >
                <SelectItem key="draft">Draft</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="published">Published</SelectItem>
                <SelectItem key="archived">Archived</SelectItem>
              </Select>
              
              <Input
                label={<div className="flex items-center gap-1">Time Limit (ms)<RequiredStar rules={["Required field"]} /></div>}
                type="number"
                value={form.timeLimitMs.toString()}
                onChange={(e) => setForm({ ...form, timeLimitMs: Number(e.target.value) })}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
              />

              <Input
                label={<div className="flex items-center gap-1">Memory Limit (MB)<RequiredStar rules={["Required field"]} /></div>}
                type="number"
                value={(form.memoryLimitKb / 1024).toString()}
                onChange={(e) => setForm({ ...form, memoryLimitKb: Number(e.target.value) * 1024 })}
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
              />
            </div>

            <div className="flex justify-between items-end border-t border-default-100 pt-6 mt-2">
              <div className="flex gap-8">
                <RadioGroup
                  label="Scoring System"
                  orientation="horizontal"
                  value={form.scoringCode}
                  onValueChange={(val) => setForm({ ...form, scoringCode: val as any })}
                  size="sm"
                >
                  <Radio value="acm">ACM</Radio>
                  <Radio value="oi">OI</Radio>
                </RadioGroup>
                
                {/* REMOVED VISIBILITY CODE AS REQUESTED */}
              </div>

              <Button
                color="primary"
                endContent={<ArrowRight size={16} />}
                onPress={handleStep1}
                isLoading={isCreatingProblem || isCreatingTestSet}
                isDisabled={isUserLoading || isCreatingProblem || isCreatingTestSet}
                radius="sm"
                className="font-semibold"
              >
                Continue to TestCases
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 1 && (
        <Card className="border-none shadow-sm dark:bg-default-50/50 animate-fade-in-right">
          <CardHeader className="px-8 pt-8 pb-0 flex-col items-start gap-1">
            <h2 className="text-lg font-semibold">Upload Testcases</h2>
            <p className="text-sm text-default-500">
              Upload a `.zip` file containing matched `.in` and `.out` files.
            </p>
          </CardHeader>
          <CardBody className="p-8 gap-6">
            <div className="flex gap-4 text-sm bg-default-100 p-3 rounded-md border border-default-200">
              <span className="text-default-600">Problem ID: <strong>{createdProblemId}</strong></span>
              <span className="text-default-400">|</span>
              <span className="text-default-600">Testset ID: <strong>{createdTestSetId}</strong></span>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors
                ${zipFile ? "border-primary bg-primary-50/20" : "border-default-300 hover:border-default-400 bg-default-50/50"}
              `}
              onClick={() => zipRef.current?.click()}
            >
              <div className={`p-3 rounded-full ${zipFile ? "bg-primary-100 text-primary" : "bg-default-200 text-default-500"}`}>
                <UploadCloud size={32} />
              </div>
              <div className="text-center">
                {zipFile ? (
                  <>
                    <p className="text-sm font-semibold text-foreground">{zipFile.name}</p>
                    <p className="text-xs text-default-500 mt-1">{(zipFile.size / 1024).toFixed(2)} KB</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-foreground">Click to browse or drag and drop</p>
                    <p className="text-xs text-default-500 mt-1">ZIP archives only</p>
                  </>
                )}
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
              color="primary"
              variant="flat"
              startContent={<UploadCloud size={18} />}
              onPress={handleUploadTestCase}
              isLoading={isCreatingTestCase}
              isDisabled={!zipFile || isCreatingTestCase}
              radius="sm"
              className="w-full font-medium py-6"
            >
              Upload Archive
            </Button>

            {uploadedCases.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold text-default-600">Upload History</h3>
                <div className="flex flex-col gap-2">
                  {uploadedCases.map((tc, i) => (
                    <div key={i} className="flex items-center justify-between bg-success-50/50 border border-success-200 rounded-md px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Check size={16} className="text-success-600" />
                        <span className="text-sm font-medium text-success-800 dark:text-success-400">{tc.name}</span>
                      </div>
                      <Chip size="sm" color="success" variant="flat" radius="sm">
                        {tc.total} total cases extracted
                      </Chip>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Divider className="my-2" />

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="bordered"
                startContent={<ArrowLeft size={16} />}
                onPress={() => setStep(0)}
                radius="sm"
              >
                Back
              </Button>

              <Button
                color="success"
                startContent={<Save size={18} />}
                onPress={() => router.push("/Management/StudyPlan")}
                radius="sm"
                className="text-white font-semibold"
              >
                Complete & Return
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
