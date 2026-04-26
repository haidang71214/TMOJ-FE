"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Maximize } from "lucide-react";
import { Button, Select, SelectItem } from "@heroui/react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

import { useParams, useRouter } from "next/navigation";
import { 
  useGetRuntimeListQuery, 
  useGetRuntimeDetailQuery,
  useGetSubmissionQuery,
} from "@/store/queries/Submittion"
import { useSubmitContestMutation } from "@/store/queries/Contest";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { toast } from "sonner";
import { VerdictCode, ErrorForm } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { addToast } from "@heroui/toast";

const TEMPLATES: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,
  go: `package main

import "fmt"

func main() {
    // Your code here
}`,
  javascript: `const fs = require('fs');

function main() {
    // const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    // Your code here
}

main();`,
  python: `import sys

def main():
    # input_data = sys.stdin.read()
    # Your code here
    pass

if __name__ == '__main__':
    main()`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Your code here
    }
}`
};

export default function SubmitProblemPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { t, language: tLang } = useTranslation();

  const contestId = params.id as string;
  const contestProblemId = params.ProblemInContest as string;

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [hasShownResultToast, setHasShownResultToast] = useState(false);
  const [selectedRuntimeId, setSelectedRuntimeId] = useState<string | null>(null);
  const [pollingIntervalTime, setPollingIntervalTime] = useState(0);

  // Queries
  const { data: user, isLoading: isUserLoading } = useGetUserInformationQuery();
  const isLoggedIn = !!user;

  const { data: runtimeData, isLoading: isRuntimeLoading } = useGetRuntimeListQuery();
  const runtimes = runtimeData?.data ?? [];

  const [submitContest, { isLoading: isSubmitting }] = useSubmitContestMutation();

  // Query lấy submission
  const { data: submissionData, isFetching } = useGetSubmissionQuery(
    { submissionId: submissionId! },
    { 
      skip: !submissionId,
      refetchOnMountOrArgChange: true,
      pollingInterval: pollingIntervalTime,
    }
  );

  // Polling logic
  useEffect(() => {
    if (!submissionId) {
      setPollingIntervalTime(0);
      return;
    }
    if (!submissionData?.data?.verdictCode) {
      setPollingIntervalTime(5000);
    } else {
      setPollingIntervalTime(0);
    }
  }, [submissionId, submissionData?.data?.verdictCode]);

  // Verdict toast
  useEffect(() => {
    if (isFetching || !submissionData?.data?.verdictCode || hasShownResultToast) return;

    const verdict = submissionData.data.verdictCode.toLowerCase();
    let title = verdict;
    let color: "success" | "danger" | "warning" | "default" | "primary" | "secondary" = "danger";

    switch (verdict) {
      case VerdictCode.AC:
      case "accepted":
        title = "Congratulations! Your solution has been accepted.";
        color = "success";
        break;
      case VerdictCode.WA:
        title = "Wrong Answer. Please check your logic!";
        color = "danger";
        break;
      case VerdictCode.RTE:
        title = "Runtime Error. Your code crashed!";
        color = "danger";
        break;
      case VerdictCode.CE:
        title = "Compile Error. Your code could not be compiled!";
        color = "warning";
        break;
      case VerdictCode.TLE:
        title = "Time Limit Exceeded. Your code is too slow!";
        color = "danger";
        break;
      case VerdictCode.MLE:
        title = "Memory Limit Exceeded. Please optimize your memory usage!";
        color = "danger";
        break;
      case VerdictCode.OLE:
        title = "Output Limit Exceeded.";
        color = "danger";
        break;
      case VerdictCode.IE:
      case VerdictCode.IR:
        title = `System Error (${verdict.toUpperCase()}). Please try again later.`;
        color = "warning";
        break;
      default:
        title = `Result: ${verdict.toUpperCase()}`;
        color = "warning";
        break;
    }

    addToast({ title, color });
    setHasShownResultToast(true);
  }, [submissionData?.data?.verdictCode, hasShownResultToast, isFetching]);

  useEffect(() => {
    if (submissionId) {
      setHasShownResultToast(false);
    }
  }, [submissionId]);

  // Default runtime
  useEffect(() => {
    if (runtimes.length > 0 && selectedRuntimeId === null) {
      const preferred = runtimes.find(r => 
        r.runtimeName.toLowerCase().includes("c++") || 
        r.runtimeName.toLowerCase().includes("g++")
      );
      setSelectedRuntimeId(preferred?.id || runtimes[0].id);
    }
  }, [runtimes, selectedRuntimeId]);

  const { 
    data: runtimeDetailData, 
    isLoading: isDetailLoading 
  } = useGetRuntimeDetailQuery(
    { id: selectedRuntimeId! },
    { skip: !selectedRuntimeId }
  );

  const selectedRuntime = runtimes.find(r => r.id === selectedRuntimeId) || runtimeDetailData?.data;
  console.log("selectedRuntime", selectedRuntime)
  const getLanguage = (runtimeName: string = "") => {
    const lower = runtimeName.toLowerCase();
    if (lower.includes("c++") || lower.includes("g++")) return "cpp";
    if (lower.includes("c ") || lower.includes("gcc")) return "c";
    if (lower.includes("go")) return "go";
    if (lower.includes("node") || lower.includes("javascript") || lower.includes("js")) return "javascript";
    if (lower.includes("python")) return "python";
    if (lower.includes("java") && !lower.includes("javascript")) return "java";
    return "cpp";
  };

  const editorLanguage = getLanguage(selectedRuntime?.runtimeName);

  const [code, setCode] = useState(TEMPLATES.cpp);

  useEffect(() => {
    if (!selectedRuntime) return;
    const currentCode = code.trim();
    const isDefaultTemplate = Object.values(TEMPLATES).some(t => t.trim() === currentCode) || currentCode === "";
    
    if (isDefaultTemplate) {
      setCode(TEMPLATES[editorLanguage] || TEMPLATES["cpp"]);
    }
  }, [editorLanguage, selectedRuntime]);

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 pb-10">
      
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TITLE */}
        <h1 className="text-[22px] sm:text-[26px] font-medium text-slate-800 dark:text-white mb-6">
          Submit Code <span className="text-[#F26F21]">Contest Problem - {contestProblemId}</span>
        </h1>

        {/* MAIN EDITOR WRAPPER */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
          
          {/* TOP TOOLBAR (File Upload) */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#1e293b]/50 flex items-center justify-between">
            <div className="flex items-center flex-wrap gap-2 text-slate-700 dark:text-slate-300 text-[14px]">
              <span className="italic">Paste your code here or upload a file:</span>
              <div className="relative group ml-1 inline-block">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept=".cpp,.c,.py,.java,.txt"
                />
                <div className="flex items-center gap-2">
                  <span className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded text-[13px] hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium shadow-sm">
                    Choose file
                  </span>
                  <span className="text-[13px] text-slate-500">No file chosen</span>
                </div>
              </div>
            </div>
            <button className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded transition bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700">
              <Maximize className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* MONACO EDITOR */}
          <div className="w-full h-[550px] border-b border-slate-200 dark:border-slate-800 relative group bg-white dark:bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={editorLanguage}
              value={code}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-mono), Consolas, 'Courier New', monospace",
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 4,
                padding: { top: 16, bottom: 16 },
                cursorBlinking: "smooth",
                smoothScrolling: true,
                formatOnPaste: true,
              }}
              loading={<div className="flex items-center justify-center w-full h-full text-slate-400">Loading Code Editor...</div>}
            />
          </div>

          {/* BOTTOM TOOLBAR (Compiler Config & Submit) */}
          <div className="p-4 bg-white dark:bg-[#1e293b] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-[320px]">
              <Select
                aria-label="Language compiler"
                selectedKeys={selectedRuntimeId ? [selectedRuntimeId] : []}
                onChange={(e) => setSelectedRuntimeId(e.target.value)}
                classNames={{
                  base: "w-full",
                  trigger: "h-11 min-h-11 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a] shadow-sm rounded-md hover:border-slate-400 dark:hover:border-slate-500",
                  value: "text-[14px] font-medium text-slate-700 dark:text-slate-200",
                }}
                size="sm"
                variant="bordered"
              >
                {runtimes.map((runtime) => (
                  <SelectItem key={runtime.id} textValue={runtime.runtimeName}>
                    {runtime.runtimeName}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div className="w-full sm:w-auto flex justify-end pt-4 sm:pt-0 pb-1 sm:pb-0">
              <Button 
                className="w-full sm:w-auto bg-[#F26F21] hover:bg-[#d95b16] text-white font-medium px-8 h-10 shadow-md shadow-orange-500/10 rounded"
                isLoading={isSubmitting}
                disabled={!isLoggedIn || !selectedRuntimeId || !code.trim()}
                onClick={async () => {
                  if (!selectedRuntimeId || !code.trim() || !isLoggedIn) return;
                  setSubmissionId(null);
//aaaaaaaaaaaaaaaaaaaaa
                  try {
                    const result = await submitContest({
                      contestId: contestId,
                      body: {
                        contestId: contestId,
                        contestProblemId: contestProblemId,
                        code: code,
                        language: selectedRuntimeId
                      }
                    }).unwrap();

                    const newSubmissionId = result?.data;
                    if (newSubmissionId) {
                      setSubmissionId(newSubmissionId);
                      toast.success("Code submitted successfully! Waiting for results...");
                    }
                  } catch (error) {
                    const apiError = error as ErrorForm;
                    toast.error(apiError?.data?.data?.message || "Submission failed.");
                  }
                }}
              >
                Submit!
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
