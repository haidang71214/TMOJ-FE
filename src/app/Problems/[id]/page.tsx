"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  AlignLeft,
  BookOpen,
  Lightbulb,
  Send,
  TriangleAlert,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Settings2,
  FlaskConical,
  CheckSquare,
  Timer,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { SubmissionsTab } from "./Submissions/index";
import SolutionSubmittion from "./Solutions/SolutionSubmittion";
import CompileErrorTab from "./CompileError/page";
import DescriptionTab from "./Description/page";
import EditorialTab from "./Editorial/page";
import SolutionsTab from "./Solutions/page";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";

// ── Tab config ────────────────────────────────────────────────────────────
const LEFT_TABS = [
  { key: "description", tKey: "problem_workspace.description", defaultVi: "Mô tả", defaultEn: "Description", Icon: AlignLeft },
  { key: "editorial", tKey: "problem_workspace.editorial", defaultVi: "Hướng dẫn", defaultEn: "Editorial", Icon: BookOpen },
  { key: "solutions", tKey: "problem_workspace.solutions", defaultVi: "Lời giải", defaultEn: "Solutions", Icon: Lightbulb },
  { key: "submissions", tKey: "problem_workspace.submissions", defaultVi: "Lịch sử nộp", defaultEn: "Submissions", Icon: Send },
  { key: "compileerror", tKey: "problem_workspace.compile_error", defaultVi: "Lỗi biên dịch", defaultEn: "Compile Error", Icon: TriangleAlert },
] as const;

type LeftTabKey = (typeof LEFT_TABS)[number]["key"];

// ── Right bottom tabs ─────────────────────────────────────────────────────
const BOTTOM_TABS = [
  { key: "testcase", tKey: "problem_workspace.testcase", defaultVi: "Bộ Test", defaultEn: "Testcase", Icon: FlaskConical },
  { key: "result", tKey: "problem_workspace.test_result", defaultVi: "Kết quả", defaultEn: "Test Result", Icon: CheckSquare },
] as const;

type BottomTabKey = (typeof BOTTOM_TABS)[number]["key"];

// ── Resizable hook ────────────────────────────────────────────────────────
function useResize(
  initial: number,
  min: number,
  max: number,
  direction: "horizontal" | "vertical"
) {
  const [size, setSize] = useState(initial);
  const dragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(initial);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSize.current = size;

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta =
          direction === "horizontal"
            ? ev.clientX - startPos.current
            : ev.clientY - startPos.current;
        setSize(Math.min(max, Math.max(min, startSize.current + delta)));
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [direction, max, min, size]
  );

  return { size, onMouseDown };
}

// ─────────────────────────────────────────────────────────────────────────
export default function ProblemDetailsPage() {
  const params = useParams();
  const problemId = params.id as string;
  const { data: response, isLoading, isError } = useGetDetailProblemPublicQuery({id : problemId})
  const { t, language } = useTranslation();
  
  const [activeLeftTab, setActiveLeftTab] = useState<LeftTabKey>("description");
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTabKey>("testcase");
  const [activeCase, setActiveCase] = useState(0);

  // Horizontal split: left panel width
  const containerRef = useRef<HTMLDivElement>(null);
  const { size: leftWidth, onMouseDown: onHDrag } = useResize(
    520,
    260,
    900,
    "horizontal"
  );

  // Vertical split in right panel: editor height (top portion)
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const { size: editorHeight, onMouseDown: onVDrag } = useResize(
    500,
    160,
    700,
    "vertical"
  );

  // Reset tab when navigating to a new problem
  useEffect(() => {
    setActiveLeftTab("description");
  }, [problemId]);

  const renderLeftContent = () => {
    switch (activeLeftTab) {
      case "description":
        return <DescriptionTab />;
      case "editorial":
        return <EditorialTab />;
      case "solutions":
        return <SolutionsTab />;
      case "submissions":
        return (
          <SubmissionsTab
            onRowClick={() => setActiveLeftTab("compileerror")}
          />
        );
      case "compileerror":
        return <CompileErrorTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#EBEBEB] dark:bg-[#101828] overflow-hidden font-sans text-[#262626] dark:text-[#F9FAFB] transition-colors duration-300">
      {/* ── MAIN AREA ───────────────────────────────────────────── */}
      <main
        ref={containerRef}
        className="flex flex-1 overflow-hidden p-2 gap-2"
      >
        {/* ═══ PANEL LEFT ═══════════════════════════════════════ */}
        <div
          style={{ width: leftWidth, minWidth: 260, maxWidth: 900 }}
          className="flex flex-col bg-white dark:bg-[#1C2737] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-[#334155] shrink-0"
        >
          {/* Tab bar */}
          <div className="h-12 shrink-0 bg-slate-50 dark:bg-[#111c35]/80 border-b border-slate-200 dark:border-[#334155]/50 flex items-center px-2 gap-1.5 overflow-x-auto no-scrollbar">
            {LEFT_TABS.map(({ key, tKey, defaultVi, defaultEn, Icon }, index) => {
              const isActive = activeLeftTab === key;
              const label = t(tKey) || (language === 'vi' ? defaultVi : defaultEn);
              return (
                <div key={key} className="animate-fade-in-right" style={{ animationFillMode: 'both', animationDelay: `${100 + index * 50}ms` }}>
                  <button
                    onClick={() => setActiveLeftTab(key)}
                    className={`relative flex items-center gap-2 px-4 h-8 rounded-lg text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 active-bump
                      ${
                        isActive
                          ? "bg-white dark:bg-[#1C2737] text-[#FF5C00] dark:text-[#E3C39D] shadow-md border border-orange-100 dark:border-white/10 -translate-y-[2px]"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
                      }
                      after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 hover:after:w-[70%] after:bg-[#FF5C00] after:transition-all after:duration-300 after:rounded-full`}
                  >
                    <Icon size={14} className={isActive ? "text-[#FF5C00] dark:text-[#E3C39D]" : "opacity-70 group-hover:opacity-100"} />
                    {label}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">{renderLeftContent()}</div>
        </div>

        {/* ── HORIZONTAL DRAG HANDLE ── */}
        <div
          onMouseDown={onHDrag}
          className="w-1.5 shrink-0 cursor-col-resize group flex items-center justify-center"
        >
          <div className="w-1 h-12 rounded-full bg-gray-300 dark:bg-[#334155] group-hover:bg-blue-400 dark:group-hover:bg-[#E3C39D] transition-colors" />
        </div>

        {/* ═══ PANEL RIGHT ══════════════════════════════════════ */}
        <div
          ref={rightPanelRef}
          className="flex-1 flex flex-col gap-2 overflow-hidden min-w-0"
        >
          {/* ── RIGHT-TOP: CODE EDITOR ── */}
<SolutionSubmittion
  editorHeight={editorHeight}
  problemId={problemId}
  onSubmitSuccess={() => setActiveLeftTab("submissions")}  // ← thêm dòng này
/>

          {/* ── VERTICAL DRAG HANDLE ── */}
          <div
            onMouseDown={onVDrag}
            className="h-1.5 shrink-0 cursor-row-resize group flex items-center justify-center"
          >
            <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-[#334155] group-hover:bg-blue-400 dark:group-hover:bg-[#E3C39D] transition-colors" />
          </div>

          {/* ── RIGHT-BOTTOM: TESTCASE ── */}
          <div className="flex-1 flex flex-col bg-white dark:bg-[#1C2737] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-[#334155] min-h-0">
            {/* Bottom Tab bar */}
            <div className="h-12 shrink-0 bg-slate-50 dark:bg-[#111c35]/80 border-b border-slate-200 dark:border-[#334155]/50 flex items-center px-2 gap-1.5 overflow-x-auto no-scrollbar">
              {BOTTOM_TABS.map(({ key, tKey, defaultVi, defaultEn, Icon }, index) => {
                const isActive = activeBottomTab === key;
                const label = t(tKey) || (language === 'vi' ? defaultVi : defaultEn);
                return (
                  <div key={key} className="animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: `${200 + index * 50}ms` }}>
                    <button
                      onClick={() => setActiveBottomTab(key)}
                      className={`relative flex items-center gap-2 px-4 h-8 rounded-lg text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 active-bump
                        ${
                          isActive
                            ? "bg-white dark:bg-[#1C2737] text-[#FF5C00] dark:text-[#E3C39D] shadow-md border border-orange-100 dark:border-white/10 -translate-y-[2px]"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
                        }
                        after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 hover:after:w-[70%] after:bg-[#FF5C00] after:transition-all after:duration-300 after:rounded-full`}
                    >
                      <Icon size={14} className={isActive ? "text-[#FF5C00] dark:text-[#E3C39D]" : "opacity-70 group-hover:opacity-100"} />
                      {label}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Testcase content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
              {activeBottomTab === "testcase" ? (
                <div className="space-y-4">
                  {/* Case selector */}
                  <div className="flex items-center gap-2">
                    {["Case 1", "Case 2", "Case 3"].map((c, i) => (
                      <button
                        key={c}
                        onClick={() => setActiveCase(i)}
                        className={`px-3.5 py-1.5 rounded-lg text-[12px] font-black transition-all ${
                          activeCase === i
                            ? "bg-gray-900 dark:bg-[#E3C39D] text-white dark:text-[#101828] shadow-md"
                            : "bg-gray-100 dark:bg-[#101828] text-gray-500 dark:text-[#667085] border dark:border-[#334155] hover:bg-gray-200 dark:hover:bg-[#0D1B2A]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                    <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#101828] border dark:border-[#334155] text-gray-400 dark:text-[#667085] hover:text-black dark:hover:text-white transition-colors text-[14px] font-black">
                      +
                    </button>
                  </div>

                  {/* Input fields */}
                  {[
                    {
                      label: "nums =",
                      values: ["[2,7,11,15]", "[3,2,4]", "[3,3]"],
                    },
                    { label: "target =", values: ["9", "6", "6"] },
                  ].map(({ label, values }) => (
                    <div key={label}>
                      <p className="text-[11px] font-black text-gray-400 dark:text-[#667085] mb-1.5 uppercase tracking-wider">
                        {label}
                      </p>
                      <div className="w-full bg-gray-50 dark:bg-[#0D1B2A] border dark:border-[#334155] rounded-xl px-4 py-3 font-mono text-[13px] text-[#262626] dark:text-[#CDD5DB] focus-within:border-blue-400 dark:focus-within:border-[#E3C39D] transition-colors">
                        {values[activeCase]}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Test Result placeholder */
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                  <CheckSquare size={36} strokeWidth={1.5} />
                  <p className="text-[12px] font-bold uppercase tracking-widest">
                    Run your code to see results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}