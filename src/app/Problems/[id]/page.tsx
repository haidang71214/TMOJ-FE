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

import { ProblemListSidebar } from "./ProblemListSidebar";
import { SubmissionsTab } from "./Submissions/index";
import SolutionSubmittion from "./Solutions/SolutionSubmittion";
import CompileErrorTab from "./CompileError/page";
import DescriptionTab from "./Description/page";
import EditorialTab from "./Editorial/page";
import SolutionsTab from "./Solutions/page";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";

// ── Tab config ────────────────────────────────────────────────────────────
const LEFT_TABS = [
  { key: "description", label: "Description", Icon: AlignLeft },
  { key: "editorial", label: "Editorial", Icon: BookOpen },
  { key: "solutions", label: "Solutions", Icon: Lightbulb },
  { key: "submissions", label: "Submissions", Icon: Send },
  { key: "compileerror", label: "Compile Error", Icon: TriangleAlert },
] as const;

type LeftTabKey = (typeof LEFT_TABS)[number]["key"];

// ── Right bottom tabs ─────────────────────────────────────────────────────
const BOTTOM_TABS = [
  { key: "testcase", label: "Testcase", Icon: FlaskConical },
  { key: "result", label: "Test Result", Icon: CheckSquare },
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
    console.log(response); // mai vào đây check code
    
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<LeftTabKey>("description");
  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabKey>("testcase");
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
      {/* ── TOP NAVBAR ──────────────────────────────────────────── */}
      <header className="h-11 shrink-0 bg-white dark:bg-[#1C2737] border-b dark:border-[#334155] flex items-center px-3 gap-3 shadow-sm">
        {/* Problem list toggle */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-1.5 text-[12px] font-black text-gray-400 dark:text-[#94A3B8] hover:text-black dark:hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828]"
        >
          <AlignLeft size={15} />
          Problem List
        </button>

        <div className="flex items-center">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828] text-gray-400 dark:text-[#667085] hover:text-black dark:hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828] text-gray-400 dark:text-[#667085] hover:text-black dark:hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="h-5 w-px bg-gray-200 dark:bg-[#334155]" />

        {/* Problem title */}
        <span className="text-[13px] font-black text-[#262626] dark:text-[#F9FAFB] truncate max-w-sm">
          1. Two Sum
        </span>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 dark:text-[#667085]">
            <Timer size={13} />
            <span className="font-mono font-bold">0:00</span>
          </div>
          <div className="h-5 w-px bg-gray-200 dark:bg-[#334155]" />
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828] text-gray-400 dark:text-[#667085] hover:text-black dark:hover:text-white transition-colors">
            <Maximize2 size={15} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828] text-gray-400 dark:text-[#667085] hover:text-black dark:hover:text-white transition-colors">
            <Settings2 size={15} />
          </button>
        </div>
      </header>

      {/* Sidebar overlay */}
      <ProblemListSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentProblemId={problemId}
      />

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
          <div className="h-11 shrink-0 bg-[#fafafa] dark:bg-[#162130] border-b dark:border-[#334155] flex items-end px-2 gap-0.5  no-scrollbar">
            {LEFT_TABS.map(({ key, label, Icon }) => {
              const isActive = activeLeftTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveLeftTab(key)}
                  className={`flex items-center gap-1.5 px-3 h-11 text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all relative
                    ${
                      isActive
                        ? "text-[#262626] dark:text-[#E3C39D] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-t-full after:bg-current"
                        : "text-gray-400 dark:text-[#475569] hover:text-[#262626] dark:hover:text-[#94A3B8]"
                    }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
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
            <div className="h-11 shrink-0 bg-[#fafafa] dark:bg-[#162130] border-b dark:border-[#334155] flex items-end px-2">
              {BOTTOM_TABS.map(({ key, label, Icon }) => {
                const isActive = activeBottomTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveBottomTab(key)}
                    className={`flex items-center gap-1.5 px-3 h-11 text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all relative
                      ${
                        isActive
                          ? "text-[#262626] dark:text-[#E3C39D] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-t-full after:bg-current"
                          : "text-gray-400 dark:text-[#475569] hover:text-[#262626] dark:hover:text-[#94A3B8]"
                      }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
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