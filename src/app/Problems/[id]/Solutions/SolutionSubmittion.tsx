import { useGetRuntimeListQuery, useGetRuntimeDetailQuery } from "@/store/queries/Submittion"
import { useGetUserInformationQuery } from "@/store/queries/usersProfile"
import { Play, RotateCcw, Settings2, Upload } from "lucide-react"
import React, { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"

interface SolutionSubmittionProps {
  editorHeight: number
  problemId: string
}

export default function SolutionSubmittion({
  editorHeight,
  problemId,
}: SolutionSubmittionProps) {
  const { data: user, isLoading: isUserLoading } = useGetUserInformationQuery()
  const isLoggedIn = !!user

  const { data: runtimeData, isLoading: isRuntimeLoading } = useGetRuntimeListQuery()
  const runtimes = runtimeData?.data ?? []

  const [selectedRuntimeId, setSelectedRuntimeId] = useState<string | null>(null)
  const [code, setCode] = useState(`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // your solution here
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`)

  // Auto chọn runtime mặc định (ưu tiên C++)
  useEffect(() => {
    if (runtimes.length > 0 && selectedRuntimeId === null) {
      const preferred = runtimes.find(r => 
        r.runtimeName.toLowerCase().includes("c++") || 
        r.runtimeName.toLowerCase().includes("g++")
      )
      setSelectedRuntimeId(preferred?.id || runtimes[0].id)
    }
  }, [runtimes, selectedRuntimeId])

  // Lấy chi tiết runtime (nếu cần dùng thêm limit, memory,... khi submit)
  const { 
    data: runtimeDetailData, 
    isLoading: isDetailLoading 
  } = useGetRuntimeDetailQuery(
    { id: selectedRuntimeId! },
    { skip: !selectedRuntimeId }
  )

  const selectedRuntimeDetail = runtimeDetailData?.data
  const selectedRuntime = runtimes.find(r => r.id === selectedRuntimeId) || selectedRuntimeDetail

  // Map runtimeName -> monaco language
  const getLanguage = (runtimeName: string = "") => {
    const lower = runtimeName.toLowerCase()
    if (lower.includes("c++") || lower.includes("g++")) return "cpp"
    if (lower.includes("c ") || lower.includes("gcc")) return "c"
    return "cpp" // fallback
  }

  const language = getLanguage(selectedRuntime?.runtimeName)

  // Debug (xóa khi ổn)
  console.log("selectedRuntimeId:", selectedRuntimeId)
  console.log("selectedRuntime:", selectedRuntime)
  console.log("language:", language)

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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#101828] text-[12px] font-black appearance-none pr-8 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#0f1e3a] focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            {isRuntimeLoading ? (
              <option>Đang tải runtime...</option>
            ) : runtimes.length === 0 ? (
              <option>Không có runtime nào</option>
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
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828]">
            <RotateCcw size={14} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828]">
            <Settings2 size={14} />
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 relative overflow-hidden bg-[#0D1B2A]">
        <Editor
          height="100%"
          language={language}
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
            padding: { top: 16, bottom: 40 },
            overviewRulerBorder: false,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
            },
          }}
        />

        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-gray-50 dark:bg-[#162130] border-t dark:border-[#334155] flex items-center px-4 justify-between pointer-events-none z-10">
          <span className="text-[10px] font-bold text-emerald-500">
            ✓ Saved
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            Ln 1, Col 1 {/* Có thể update động sau nếu cần */}
          </span>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="h-11 shrink-0 bg-[#fafafa] dark:bg-[#162130] border-t dark:border-[#334155] flex items-center px-3 gap-2">
        {!isLoggedIn && !isUserLoading && (
          <span className="text-[12px] text-gray-400 mr-auto">
            You need to{" "}
            <span className="text-blue-500 font-bold cursor-pointer hover:underline">
              log in / sign up
            </span>{" "}
            to run or submit
          </span>
        )}

        {isLoggedIn && (
          <span className="text-[12px] text-gray-400 mr-auto">
            {isRuntimeLoading || isDetailLoading
              ? "Đang tải runtime..."
              : selectedRuntime
                ? `Ready to run with ${selectedRuntime.runtimeName}`
                : "Chọn runtime để chạy code"}
          </span>
        )}

        <button
          disabled={!isLoggedIn || isRuntimeLoading || runtimes.length === 0 || !selectedRuntimeId}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-black transition-colors ${
            isLoggedIn && selectedRuntimeId && !isRuntimeLoading && !isDetailLoading
              ? "bg-gray-100 hover:bg-gray-200 dark:bg-[#1C2737] dark:hover:bg-[#2a3b55]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Play size={12} className="fill-current" />
          Run
        </button>

        <button
          disabled={!isLoggedIn || isRuntimeLoading || runtimes.length === 0 || !selectedRuntimeId}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-black transition-colors ${
            isLoggedIn && selectedRuntimeId && !isRuntimeLoading && !isDetailLoading
              ? "bg-emerald-500 hover:bg-emerald-400 text-white"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Upload size={12} />
          Submit
        </button>
      </div>
    </div>
  )
}