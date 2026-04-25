import { 
  useGetRuntimeListQuery, 
  useGetRuntimeDetailQuery,
  usePostSubmissionMutation,
  useGetSubmissionQuery,
} from "@/store/queries/Submittion"

import { useGetUserInformationQuery } from "@/store/queries/usersProfile"
import {  RotateCcw, Settings2, Upload } from "lucide-react"
import React, { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import { addToast } from "@heroui/toast"
import { VerdictCode } from "@/types"
import { useTranslation } from "@/hooks/useTranslation"
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic"

interface SolutionSubmittionProps {
  editorHeight: number;
  problemId: string;
  onSubmitSuccess?: () => void;
  classSlotId?: string;
}

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

export default function SolutionSubmittion({
  editorHeight,
  problemId,
  onSubmitSuccess,
  classSlotId,
}: SolutionSubmittionProps) {
  const { t, language } = useTranslation();
  console.log("classSlotId", classSlotId);
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [hasShownResultToast, setHasShownResultToast] = useState(false)

  // Queries
  const { data: user, isLoading: isUserLoading } = useGetUserInformationQuery()
  const isLoggedIn = !!user

  const { data: runtimeData, isLoading: isRuntimeLoading } = useGetRuntimeListQuery()
  const runtimes = runtimeData?.data ?? []

  const [selectedRuntimeId, setSelectedRuntimeId] = useState<string | null>(null)
  const [code, setCode] = useState("")

  const [postSubmission, { isLoading: isSubmitting }] = usePostSubmissionMutation()

  const [pollingIntervalTime, setPollingIntervalTime] = useState(0);
  const { data: problemData } = useGetDetailProblemPublicQuery({id : problemId });

  // Query lấy submission với cấu hình quan trọng
  const { data: submissionData, isFetching } = useGetSubmissionQuery(
    { submissionId: submissionId! },
    { 
      skip: !submissionId,
      refetchOnMountOrArgChange: true,   // Đảm bảo luôn fetch dữ liệu mới khi submissionId thay đổi
      pollingInterval: pollingIntervalTime,
    }
  )

  // ==================== 1. CẬP NHẬT POLLING ====================
  useEffect(() => {
    if (!submissionId) {
      setPollingIntervalTime(0);
      return;
    }
    
    // Nếu không có verdictCode (null, undefined, rỗng...), tiếp tục polling mỗi 5s
    if (!submissionData?.data?.verdictCode) {
      setPollingIntervalTime(5000);
    } else {
      // Đã có verdictCode, dừng polling
      setPollingIntervalTime(0);
    }
  }, [submissionId, submissionData?.data?.verdictCode]);

  // ==================== 2. HIỂN THỊ TOAST KHI CÓ VERDICT ====================
  useEffect(() => {
    // Tránh in ra toast cũ khi submit lại (isFetching = true)
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

    if ((verdict === VerdictCode.AC || verdict === "accepted") && onSubmitSuccess) {
      onSubmitSuccess();
    }
  }, [submissionData?.data?.verdictCode, hasShownResultToast, onSubmitSuccess, isFetching]);

  // ==================== 3. RESET TOAST KHI NỘP BÀI MỚI ====================
  useEffect(() => {
    if (submissionId) {
      setHasShownResultToast(false);
    }
  }, [submissionId]);

  // Auto chọn runtime C++ mặc định
  useEffect(() => {
      console.log("dasdadsa");
    if (runtimes.length > 0 && selectedRuntimeId === null) {
      const preferred = runtimes.find(r => 
        r.runtimeName.toLowerCase().includes("c++") || 
        r.runtimeName.toLowerCase().includes("g++")
      )
      setSelectedRuntimeId(preferred?.id || runtimes[0].id)
    }
  }, [runtimes, selectedRuntimeId])

  const { 
    data: runtimeDetailData, 
    isLoading: isDetailLoading 
  } = useGetRuntimeDetailQuery(
    { id: selectedRuntimeId! },
    { skip: !selectedRuntimeId }
  )

  const selectedRuntime = runtimes.find(r => r.id === selectedRuntimeId) || runtimeDetailData?.data

  const getLanguage = (runtimeName: string = "") => {
    const lower = runtimeName.toLowerCase()
    if (lower.includes("c++") || lower.includes("g++")) return "cpp"
    if (lower.includes("c ") || lower.includes("gcc")) return "c"
    if (lower.includes("go")) return "go"
    if (lower.includes("node") || lower.includes("javascript") || lower.includes("js")) return "javascript"
    if (lower.includes("python")) return "python"
    if (lower.includes("java") && !lower.includes("javascript")) return "java"
    return "cpp"
  }

  const editorLanguage = getLanguage(selectedRuntime?.runtimeName)

  // Đổi code template khi đổi ngôn ngữ
  // Nếu user đã sửa code thì không đè code của user
  useEffect(() => {
    if (!selectedRuntime) return;
    const currentCode = code.trim();
    // Only update if current code is empty or a known template
    const isDefaultTemplate = currentCode === "" || Object.values(TEMPLATES).some(t => t.trim() === currentCode);
    
    if (isDefaultTemplate) {
      if (problemData?.problemMode === "pro") {
        if (code !== "") setCode("");
      } else {
        const newTemplate = TEMPLATES[editorLanguage] || TEMPLATES["cpp"];
        if (code !== newTemplate) setCode(newTemplate);
      }
    }
  }, [editorLanguage, selectedRuntime, problemData?.problemMode]);

  // ==================== HANDLE SUBMIT ====================

  const handleRun = async () => {
    if (!selectedRuntimeId || !code.trim() || !isLoggedIn || isSubmitting) return

    // Reset submissionId trước để xóa dữ liệu cũ hoàn toàn
    setSubmissionId(null)

    const formData = new FormData()
    formData.append("SourceCode", code)
    formData.append("RuntimeId", selectedRuntimeId)
    formData.append("StopOnFirstFail", "true")

    try {
      const response = await postSubmission({
        problemId,
        body: formData
      }).unwrap()

      const newSubmissionId = response?.data?.submissionId

      if (!newSubmissionId) {
        addToast({
          title: "Không lấy được submissionId",
          color: "warning"
        })
        return
      }

      // Set submissionId mới
      setSubmissionId(newSubmissionId)

      // Toast thông báo đã nộp
      addToast({
        title: "Đã nộp code! Đang chờ kết quả...",
        color: "success"
      })

    } catch {
      addToast({ 
        title: "Run thất bại.", 
        color: "danger" 
      })
    }
  }

  const handleSubmit = async () => {
    await handleRun()
  }

  const handleExaminationSubmit = async () => {
    if (!selectedRuntimeId || !code.trim() || !isLoggedIn || isSubmitting || !classSlotId) return

    setSubmissionId(null)

    const formData = new FormData()
    formData.append("SourceCode", code)
    formData.append("RuntimeId", selectedRuntimeId)
    formData.append("StopOnFirstFail", "false")
    formData.append("ClassSlotId", classSlotId)

    try {
      const response = await postSubmission({
        problemId,
        body: formData
      }).unwrap()

      const newSubmissionId = response?.data?.submissionId

      if (!newSubmissionId) {
        addToast({
          title: "Không lấy được submissionId",
          color: "warning"
        })
        return
      }

      setSubmissionId(newSubmissionId)
      addToast({
        title: "Đã nộp bài cho slot! Đang chờ kết quả...",
        color: "success"
      })

    } catch{
      addToast({ 
        title: "Nộp bài thất bại.", 
        color: "danger" 
      })
    }
  }

  return (
    <div
      style={{ height: editorHeight, minHeight: 160 }}
      className="shrink-0 flex flex-col bg-white dark:bg-[#1C2737] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-[#334155]"
    >
      {/* Toolbar */}
      <div className="h-11 shrink-0 bg-[#fafafa] dark:bg-[#162130] border-b dark:border-[#334155] flex items-center px-3 gap-3">
        <div className="relative">
          <select
            value={selectedRuntimeId || ""}
            onChange={(e) => setSelectedRuntimeId(e.target.value || null)}
            disabled={isRuntimeLoading || runtimes.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#101828] text-[12px] font-black appearance-none pr-8 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#0f1e3a] focus:outline-none transition-colors min-w-[160px]"
          >
            {isRuntimeLoading ? (
              <option>{t("common.loading") || (language === "vi" ? "Đang tải..." : "Loading...")}</option>
            ) : runtimes.length === 0 ? (
              <option>{t("solution.no_runtime") || (language === "vi" ? "Không có dữ liệu" : "No runtime")}</option>
            ) : (
              runtimes.map((runtime) => (
                <option key={runtime.id} value={runtime.id}>
                  {runtime.runtimeName} {!runtime.isActive ? "(inactive)" : ""}
                </option>
              ))
            )}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-500">
            ▾
          </span>
        </div>

        <span className="text-gray-200 dark:text-[#334155]">|</span>

        <button className="text-[11px] font-bold text-gray-400 hover:text-black dark:hover:text-white">
          Auto
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828] hover:text-[#FF5C00] transition-colors active-bump">
            <RotateCcw size={14} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828] hover:text-[#FF5C00] transition-colors active-bump">
            <Settings2 size={14} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative overflow-hidden bg-[#0D1B2A]">
        <Editor
          height="100%"
          language={editorLanguage}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Bottom */}
      <div className="h-11 shrink-0 bg-[#fafafa] dark:bg-[#162130] border-t dark:border-[#334155] flex items-center px-3 gap-2">
        {!isLoggedIn && !isUserLoading && (
          <span className="text-[12px] text-gray-400 mr-auto">
            {t("solution.login_required") || (language === "vi" ? "Bạn cần đăng nhập để nộp bài" : "You need to log in to run or submit")}
          </span>
        )}

        {isLoggedIn && (
          <span className="text-[12px] text-gray-400 mr-auto">
            {isRuntimeLoading || isDetailLoading
              ? (t("common.loading") || (language === "vi" ? "Đang tải..." : "Loading..."))
              : selectedRuntime
                ? `${t("solution.ready_to_run") || (language === "vi" ? "Sẵn sàng chạy với" : "Ready to run with")} ${selectedRuntime.runtimeName}`
                : (language === "vi" ? "Chọn ngôn ngữ để chạy code" : "Select language to run")}
          </span>
        )}

        <button
          disabled={!isLoggedIn || isSubmitting || isRuntimeLoading || !selectedRuntimeId || !code.trim()}
          onClick={handleSubmit}
          className={`flex items-center gap-2 px-6 py-1.5 rounded-lg text-[12px] font-black transition-all active-bump ${
            isLoggedIn && selectedRuntimeId && !isSubmitting
              ? "bg-[#FF5C00] hover:bg-[#FF7222] text-white shadow-md shadow-[#FF5C00]/20"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Upload size={12} />
          {t("solution.submit") || (language === "vi" ? "Run test" : "Run test")}
        </button>

        {classSlotId && (
          <button
            disabled={!isLoggedIn || isSubmitting || isRuntimeLoading || !selectedRuntimeId || !code.trim()}
            onClick={handleExaminationSubmit}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-lg text-[12px] font-black transition-all active-bump ${
              isLoggedIn && selectedRuntimeId && !isSubmitting
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Upload size={12} />
            Submmit examination
          </button>
        )}
      </div>
    </div>
  )
}