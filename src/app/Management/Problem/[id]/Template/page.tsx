"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Tooltip,
} from "@heroui/react";
import { 
  ArrowLeft, 
  Save, 
  Code, 
  Type, 
  Layers, 
  Hash,
  ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import { useGetRuntimeListQuery } from "@/store/queries/Submittion";
import { useCreateProblemTemplateMutation, useGetProblemTemplatesQuery, useUpdateProblemTemplateMutation } from "@/store/queries/problem";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

export default function ProblemTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const problemId = params.id as string;

  const { data: runtimeData, isLoading: isRuntimeLoading } = useGetRuntimeListQuery();
  const runtimes = runtimeData?.data ?? [];

  const { data: templatesData, isLoading: isTemplatesLoading } = useGetProblemTemplatesQuery(problemId);
  const existingTemplates = templatesData?.data ?? [];
  console.log("existingTemplates", existingTemplates);
  const [createTemplate, { isLoading: isCreating }] = useCreateProblemTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateProblemTemplateMutation();

  const [formData, setFormData] = useState({
    runtimeId: "",
    templateCode: "",
    injectionPoint: "__USER_CODE__",
    solutionSignature: "int solve(vector<int>& a)",
  });

  // Track if we are editing an existing template
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const currentTemplate = existingTemplates.find(t => t.runtimeId === formData.runtimeId);

  const getLanguage = (runtimeName: string = "") => {
    const lower = runtimeName.toLowerCase();
    if (lower.includes("c++") || lower.includes("g++")) return "cpp";
    if (lower.includes("java") && !lower.includes("javascript")) return "java";
    if (lower.includes("python")) return "python";
    if (lower.includes("javascript") || lower.includes("node")) return "javascript";
    if (lower.includes("go")) return "go";
    if (lower.includes("c#") || lower.includes("csharp")) return "csharp";
    return "cpp";
  };

  const DEFAULT_TEMPLATES: Record<string, (sig: string, point: string) => string> = {
    cpp: (sig, point) => `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${sig} {\n        ${point}\n    }\n};`,
    java: (sig, point) => `import java.util.*;\n\nclass Solution {\n    public ${sig} {\n        ${point}\n    }\n}`,
    python: (sig, point) => `class Solution:\n    def ${sig}:\n        ${point}`,
    javascript: (sig, point) => `class Solution {\n    ${sig} {\n        ${point}\n    }\n}`,
    go: (sig, point) => `package main\n\nimport "fmt"\n\nfunc ${sig} {\n    ${point}\n}`,
    csharp: (sig, point) => `using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public ${sig} {\n        ${point}\n    }\n}`,
  };

  const selectedRuntime = runtimes.find(r => r.id === formData.runtimeId);
  const lang = getLanguage(selectedRuntime?.runtimeName);

  const lastRuntimeId = React.useRef("");
  const lastLoadedSig = React.useRef("");
  const lastLoadedPoint = React.useRef("");

  // Set default runtime to C++ 17 on load
  useEffect(() => {
    if (runtimes.length > 0 && !formData.runtimeId && !lastRuntimeId.current) {
      const cpp17 = runtimes.find(r => 
        r.runtimeName.toLowerCase().includes("c++ 17") || 
        r.runtimeName.toLowerCase().includes("cpp 17")
      );
      if (cpp17) {
        setFormData(prev => ({ ...prev, runtimeId: cpp17.id }));
      }
    }
  }, [runtimes, formData.runtimeId]);

  // Effect 1: Handle Runtime Selection (Load existing or reset)
  useEffect(() => {
    if (!formData.runtimeId || runtimes.length === 0) return;

    const existing = existingTemplates.find(t => t.runtimeId === formData.runtimeId);
    
    // Always keep mode in sync with data
    setIsEditingExisting(!!existing);

    const runtimeChanged = lastRuntimeId.current !== formData.runtimeId;
    if (runtimeChanged) {
      if (existing) {
        setFormData({
          runtimeId: existing.runtimeId,
          templateCode: existing.templateCode,
          injectionPoint: existing.injectionPoint,
          solutionSignature: existing.solutionSignature,
        });
        lastLoadedSig.current = existing.solutionSignature;
        lastLoadedPoint.current = existing.injectionPoint;
      } else {
        // Load default code for new runtime
        const generator = DEFAULT_TEMPLATES[lang] || DEFAULT_TEMPLATES.cpp;
        const defaultCode = generator(formData.solutionSignature, formData.injectionPoint);
        setFormData(prev => ({ ...prev, templateCode: defaultCode }));
        lastLoadedSig.current = formData.solutionSignature;
        lastLoadedPoint.current = formData.injectionPoint;
      }
      lastRuntimeId.current = formData.runtimeId;
    }
  }, [formData.runtimeId, existingTemplates, runtimes, lang]);

  // Effect 2: Reactive updates for signature/injection point changes
  useEffect(() => {
    // Only auto-generate if the user actually changed the signature or point
    const sigChanged = lastLoadedSig.current !== formData.solutionSignature;
    const pointChanged = lastLoadedPoint.current !== formData.injectionPoint;

    if (sigChanged || pointChanged) {
      const generator = DEFAULT_TEMPLATES[lang] || DEFAULT_TEMPLATES.cpp;
      const newCode = generator(formData.solutionSignature, formData.injectionPoint);
      
      if (formData.templateCode !== newCode) {
        setFormData(prev => ({ ...prev, templateCode: newCode }));
      }
      
      // Update refs to reflect current state as "loaded"
      lastLoadedSig.current = formData.solutionSignature;
      lastLoadedPoint.current = formData.injectionPoint;
    }
  }, [formData.solutionSignature, formData.injectionPoint, lang, formData.templateCode]);

  const handleSubmit = async () => {
     console.log(currentTemplate);
    if (!formData.runtimeId) {
      toast.error("Please select a runtime");
      return;
    }
    console.log("currentTemplate", currentTemplate);
    console.log("formData.templateCode", formData.templateCode);
    console.log("formData.injectionPoint", formData.injectionPoint);
    console.log("formData.solutionSignature", formData.solutionSignature);
    try {
      if (isEditingExisting && currentTemplate) {
       const res =  await updateTemplate({
          codeTemplateId: currentTemplate.codeTemplateId,
          body: {
            templateCode: formData.templateCode,
            injectionPoint: formData.injectionPoint,
            solutionSignature: formData.solutionSignature,
            isActive: true,
          }
        }).unwrap();
        console.log("res", res);
        toast.success("Problem template updated successfully");
      } else {
        await createTemplate({
          problemId,
          body: {
            ...formData,
            version: 1,
          },
        }).unwrap();
        toast.success("Problem template created successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Breadcrumbs */}
        <div className="flex flex-col gap-4">
          <Breadcrumbs variant="light">
            <BreadcrumbItem href="/Management/Problem">Problems</BreadcrumbItem>
            <BreadcrumbItem>Template Management</BreadcrumbItem>
          </Breadcrumbs>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                isIconOnly 
                variant="light" 
                onClick={() => router.back()}
                className="hover:bg-white dark:hover:bg-white/10"
              >
                <ChevronLeft size={24} />
              </Button>
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Configure Problem Template
                </h1>
                
                {existingTemplates.length > 0 && (
                  <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Configured:</span>
                    <div className="flex items-center -space-x-2">
                      {existingTemplates.map(t => {
                        const r = runtimes.find(rt => rt.id === t.runtimeId);
                        const langName = r?.runtimeName || "Unknown";
                        return (
                          <Tooltip key={t.runtimeId}  content={`Existing Template: ${langName}`}>
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0f172a] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:z-10 transition-all cursor-default shadow-sm">
                              {langName.charAt(0).toUpperCase()}
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button 
              color={isEditingExisting ? "warning" : "primary"} 
              startContent={<Save size={18} />}
              onPress={handleSubmit}
              isLoading={isCreating || isUpdating}
              className={`${isEditingExisting ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} shadow-lg px-6 font-medium text-white`}
            >
              {isEditingExisting ? "Update Template" : "Save Template"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm dark:bg-[#1e293b]">
              <CardBody className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="text-blue-500" size={20} />
                  <h3 className="font-semibold text-lg">Template Code</h3>
                </div>
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden h-[500px]">
                  <Editor
                    height="100%"
                    language={lang}
                    value={formData.templateCode}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    onChange={(val) => setFormData(prev => ({ ...prev, templateCode: val || "" }))}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      padding: { top: 16, bottom: 16 },
                    }}
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
                  <div className="bg-blue-500 p-1 rounded text-white mt-0.5">
                    <Hash size={14} />
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    Use the <strong>Injection Point</strong> placeholder (e.g., <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">__USER_CODE__</code>) 
                    inside your template code where the user's submission should be inserted.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Configuration Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm dark:bg-[#1e293b]">
              <CardBody className="p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="text-orange-500" size={20} />
                  <h3 className="font-semibold text-lg">Configuration</h3>
                  <Chip
                    size="sm" 
                    variant="flat" 
                    color={isEditingExisting ? "warning" : "success"}
                    className="ml-auto"
                  >
                    {isEditingExisting ? "Editing Existing" : "New Template"}
                  </Chip>
                </div>

                <Select
                  label="Target Runtime"
                  placeholder="Select language"
                  labelPlacement="outside"
                  selectedKeys={formData.runtimeId ? [formData.runtimeId] : []}
                  onChange={(e) => setFormData(prev => ({ ...prev, runtimeId: e.target.value }))}
                  isLoading={isRuntimeLoading}
                  variant="bordered"
                  classNames={{
                    trigger: "border-slate-200 dark:border-slate-700",
                  }}
                >
                  {runtimes.map((runtime) => (
                    <SelectItem key={runtime.id} textValue={runtime.runtimeName}>
                      {runtime.runtimeName}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Injection Point"
                  placeholder="__USER_CODE__"
                  labelPlacement="outside"
                  value={formData.injectionPoint}
                  onChange={(e) => setFormData(prev => ({ ...prev, injectionPoint: e.target.value }))}
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border-slate-200 dark:border-slate-700",
                  }}
                  startContent={<Type size={18} className="text-slate-400" />}
                />

                <Input
                  label="Solution Signature"
                  placeholder="int solve(vector<int>& a)"
                  labelPlacement="outside"
                  value={formData.solutionSignature}
                  onChange={(e) => setFormData(prev => ({ ...prev, solutionSignature: e.target.value }))}
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border-slate-200 dark:border-slate-700",
                  }}
                  startContent={<Save size={18} className="text-slate-400" />}
                />

                <Divider className="my-2" />

                {existingTemplates.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Existing Templates</p>
                    <div className="flex flex-wrap gap-2">
                      {existingTemplates.map(t => {
                        const r = runtimes.find(rt => rt.id === t.runtimeId);
                        return (
                          <Chip 
                            key={t.runtimeId} 
                            size="sm" 
                            variant="dot" 
                            color="primary"
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            onClick={() => setFormData(prev => ({ ...prev, runtimeId: t.runtimeId }))}
                          >
                            {r?.runtimeName || "Unknown"}
                          </Chip>
                        );
                      })}
                    </div>
                    <Divider className="my-2" />
                  </div>
                )}

                <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg space-y-2">
                  <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Info</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Template ID: <span className="text-slate-900 dark:text-slate-200 font-mono">Auto-generated</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Problem ID: <span className="text-slate-900 dark:text-slate-200 font-mono truncate block" title={problemId}>{problemId}</span>
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-lg">
              <CardBody className="p-6 space-y-3">
                <h4 className="font-bold flex items-center gap-2">
                  <Code size={20} />
                  Pro Tip
                </h4>
                <p className="text-sm text-indigo-100">
                  You can include hidden test code or boilerplate that will be executed alongside the user's code. This is perfect for complex signature requirements.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
