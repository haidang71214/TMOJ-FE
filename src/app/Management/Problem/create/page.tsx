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
} from "@heroui/react";

import { Save, X, ChevronLeft, ChevronRight, CheckCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { CreateProblemDraftRequest } from "@/types";
import {
  useCreateProblemDraftMutation,
  useCreateTestCaseMutation,
  useCreateTestSetMutation,
} from "@/store/queries/problem";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { RequiredStar } from "@/Common/RequiredStar";

const STEPS = [
  { label: "Problem Info", description: "Basic info & limits" },
  { label: "TestSet", description: "Configure test data set" },
  { label: "TestCases", description: "Upload zip file with test cases" },
];

export default function CreateProblemPage() {
  const router = useRouter();

  const [step, setStep] = React.useState(0);
  const [createdProblemId, setCreatedProblemId] = React.useState<string | null>(null);
  const [createdTestSetId, setCreatedTestSetId] = React.useState<string | null>(null);

  const [createProblemDraft, { isLoading: isCreatingProblem }] = useCreateProblemDraftMutation();
  const [createTestSet, { isLoading: isCreatingTestSet }] = useCreateTestSetMutation();
  const [createTestCase] = useCreateTestCaseMutation();
  const { data: userData, isLoading: isUserLoading } = useGetUserInformationQuery();

  // ── STEP 1: Problem form ──────────────────────────────────────────────────  difficulty: "medium",
  const [form, setForm] = React.useState<CreateProblemDraftRequest>({
    slug: "",
    title: "",
    typeCode: "algorithm",
    visibilityCode: "public",
    scoringCode: "acm",
    descriptionMd: "",
    displayIndex: 1,
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
  });

  // ── STEP 2: TestSet form ──────────────────────────────────────────────────
  const [testset, setTestset] = React.useState({
    type: "public",
    note: "",
  });

  // ── STEP 3: TestCase files ────────────────────────────────────────────────
  const [zipFile, setZipFile] = React.useState<File | null>(null);
  const [uploadedCases, setUploadedCases] = React.useState<{ name: string; total: number }[]>([]);
  const zipRef = React.useRef<HTMLInputElement>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStep1 = async () => {
    if (!userData?.userId) {
      alert("User not loaded yet");
      return;
    }
    if (!form.slug || !form.title) {
      alert("Slug and Title are required");
      return;
    }

    try {
      const formData = new FormData();

      // Thêm tất cả các trường vào FormData
      formData.append("slug", form.slug);
      formData.append("title", form.title);
      // formData.append("difficulty", form.difficulty);
      formData.append("typeCode", form.typeCode);
      formData.append("visibilityCode", form.visibilityCode);
      formData.append("scoringCode", form.scoringCode);
      formData.append("descriptionMd", form.descriptionMd);
      formData.append("timeLimitMs", form.timeLimitMs.toString());
      formData.append("memoryLimitKb", form.memoryLimitKb.toString());
      const problem = await createProblemDraft(formData).unwrap();   // ← Truyền FormData
      console.log(problem); // ok
      setCreatedProblemId(problem.data.id); // đang lấy set problem id
      setStep(1);
    } catch (error) {
      console.error("Create problem failed:", error);
      alert("Create problem failed");
    }
  };

  const handleStep2 = async () => {
    if (!createdProblemId) return;
    if (!testset.type) { alert("TestSet type is required"); return; }

    try {
      const ts = await createTestSet({
        id: createdProblemId,
        body: testset,
      }).unwrap();
     console.log("aaaaaaaaaaaaa",ts); 
     
      setCreatedTestSetId(ts?.data?.id ?? null); // đang lấy testset id
      setStep(2);
    } catch (error) {
      console.error("Create testset failed:", error);
      alert("Create testset failed");
    }
  };

  const handleUploadTestCase = async () => {
    if (!createdProblemId || !createdTestSetId) return;
    if (!zipFile) { alert("Please select a zip file"); return; }
    
    try {
      const formData = new FormData();
      formData.append("file", zipFile);
      formData.append("replaceExisting", "true");
      formData.append("testsetId", createdTestSetId); // lấy testsetDI rồi

      const res = await createTestCase({
        id: createdProblemId, // problemId
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
      alert("Upload testcase failed");
    }
  };

  const handleFinish = () => {
    handleUploadTestCase();
    router.push(`/Problems/${createdProblemId}`);
  };

  // ── UI helpers ────────────────────────────────────────────────────────────

  const StepIndicator = () => (
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
          Back to Repository
        </Button>

        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white">
            CREATE <span className="text-[#FF5C00]">PROBLEM</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
            Define algorithm challenge, testset and testcases
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
      Title
      <RequiredStar rules={["Required field"]} />
    </div>
  } 
  placeholder="Ex: Two Sum"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Input
             label={
    <div className="flex items-center gap-1">
      slug
      <RequiredStar rules={["Required field"]} />
    </div>
  } 
    placeholder="Ex: two-sum-problem"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <Divider />

          <Textarea
                      
 label={
    <div className="flex items-center gap-1">
      Description (Markdown)
      <RequiredStar rules={["Required field"]} />
    </div>
  }
            value={form.descriptionMd}
            onChange={(e) => setForm({ ...form, descriptionMd: e.target.value })}
            minRows={4}
          />

          <div className="grid grid-cols-3 gap-6">
            <Input
             label={
    <div className="flex items-center gap-1">
      Time Limit (ms)
      <RequiredStar rules={["Required field"]} />
    </div>
  }
              type="number"
              value={form.timeLimitMs.toString()}
              onChange={(e) => setForm({ ...form, timeLimitMs: Number(e.target.value) })}
            />

            <Input
              label={
    <div className="flex items-center gap-1">
      Memory Limit (MB)
      <RequiredStar rules={["Required field"]} />
    </div>
  }
              type="number"
              value={(form.memoryLimitKb / 1024).toString()}
              onChange={(e) => setForm({ ...form, memoryLimitKb: Number(e.target.value) * 1024 })}
            />

            {/* <Select
  label={
    <div className="flex items-center gap-1">
      Difficulty
      <RequiredStar rules={["Required field"]} />
    </div>
  }
  placeholder="Example: Easy"
   selectedKeys={[form.difficulty]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as "easy" | "medium" | "hard";
                setForm({ ...form, difficulty: value });
              }}
  labelPlacement="outside"
  variant="bordered"
  classNames={{
    label: "font-black uppercase text-[10px] italic text-slate-500",
    trigger: "rounded-xl",
  }}
>
  <SelectItem key="easy">Easy</SelectItem>
  <SelectItem key="medium">Medium</SelectItem>
  <SelectItem key="hard">Hard</SelectItem>
</Select> */}
          </div>

          <RadioGroup
            label="Scoring Mode"
            value={form.scoringCode}
            onValueChange={(value) => setForm({ ...form, scoringCode: value as "acm" | "oi" })}
          >
            <Radio value="acm">ACM</Radio>
            <Radio value="oi">OI</Radio>
          </RadioGroup>

          <Switch
            isSelected={form.visibilityCode === "public"}
            onValueChange={(checked) =>
              setForm({ ...form, visibilityCode: checked ? "public" : "private" })
            }
          >
            Public Visible
          </Switch>

          <div className="flex justify-between pt-8">
            <Button
              variant="flat"
              startContent={<X size={18} />}
              onPress={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              startContent={<ChevronRight size={20} />}
              onPress={handleStep1}
              isLoading={isCreatingProblem}
              isDisabled={isUserLoading || isCreatingProblem}
              className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em]"
            >
              Next — TestSet
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: TestSet ────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 border border-transparent dark:border-[#474F5D]/30">

          <div className="text-sm text-slate-400 font-bold">
            Problem ID: <span className="text-black dark:text-white">{createdProblemId}</span>
          </div>

          <Select
            label="TestSet Type"
            placeholder="Select type"
            selectedKeys={testset.type ? [testset.type] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              setTestset({ ...testset, type: value });
            }}
          >
            <SelectItem key="public">Public</SelectItem>
            <SelectItem key="private">Private</SelectItem>
            <SelectItem key="sample">Sample</SelectItem>
          </Select>

          <Divider className="my-4 dark:bg-white/10" />

          <Textarea
            label="Note (optional)"
            placeholder="Optional note about this testset..."
            value={testset.note}
            onChange={(e) => setTestset({ ...testset, note: e.target.value })}
          />

          <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-white/5">
            <Button
              variant="flat"
              startContent={<ChevronLeft size={18} />}
              onPress={() => setStep(0)}
            >
              Back
            </Button>

            <Button
              startContent={<ChevronRight size={20} />}
              onPress={handleStep2}
              isLoading={isCreatingTestSet}
              isDisabled={isCreatingTestSet}
              className="bg-[#071739] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl"
            >
              Next — TestCases
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: TestCases ─────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white dark:bg-[#282E3A] rounded-[3rem] p-12 shadow-2xl space-y-10 border border-transparent dark:border-[#474F5D]/30">

          <div className="flex gap-6 text-sm text-slate-400 font-bold">
            <span>Problem ID: <span className="text-black dark:text-white">{createdProblemId}</span></span>
            {createdTestSetId && (
              <span>TestSet ID: <span className="text-black dark:text-white">{createdTestSetId}</span></span>
            )}
          </div>

          {/* Upload area */}
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              TestCase File (.zip)
            </label>
            <div
              className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => zipRef.current?.click()}
            >
              <Upload size={28} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400">
                {zipFile ? zipFile.name : "Click to select zip file"}
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

          <div className="text-[10px] text-slate-400 bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-3 font-mono space-y-1">
            <div>testsetId: <span className="text-blue-400">{createdTestSetId}</span></div>
            <div>replaceExisting: <span className="text-green-400">true</span></div>
          </div>

          {/* <Button
            startContent={<Upload size={16} />}
            onPress={handleUploadTestCase}
            isLoading={isCreatingTestCase}
            isDisabled={!zipFile || isCreatingTestCase}
            className="bg-[#071739] text-white font-black rounded-xl h-12 px-10 uppercase text-[10px] tracking-[0.2em]"
          >
            Upload TestCases
          </Button> */}

          {/* Uploaded list */}
          {uploadedCases.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Upload History ({uploadedCases.length})
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
                    <Chip size="sm" variant="flat" color="success">{tc.total} cases</Chip>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Divider />

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="flat"
              startContent={<ChevronLeft size={18} />}
              onPress={() => setStep(1)}
            >
              Back
            </Button>

            <Button
              startContent={<Save size={20} />}
              onPress={handleFinish}
              className="bg-[#22C55E] text-white font-black rounded-2xl h-14 px-20 uppercase text-[10px] tracking-[0.2em] shadow-xl hover:shadow-green-500/30 transition-all"
            >
              Finish & View Problem
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}