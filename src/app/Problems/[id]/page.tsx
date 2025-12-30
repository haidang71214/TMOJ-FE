"use client";

import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/react";

import { Header } from "./coding/Header";
import { EditorPanel } from "./coding/EditorPanel";
import { TestcasePanel } from "./coding/TestcasePanel";
import { ProblemListSidebar } from "./ProblemListSidebar";

import { DescriptionTab } from "./Description";
import { EditorialTab } from "./Editorial";
import { SolutionsTab } from "./Solutions";
import { SubmissionsTab } from "./Submissions";

export default function ProblemDetailsPage() {
  const params = useParams();
  const problemId = params.id as string;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoEditorRef = useRef<any>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [editorActiveTab, setEditorActiveTab] = useState("code");

  const [testTab, setTestTab] = useState("testcase");
  const [activeCase, setActiveCase] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [code, setCode] = useState(
    `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    monacoEditorRef.current = editor;
  };

  const handleFormatCode = () => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      editorContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f0f0] dark:bg-[#101828] overflow-hidden font-sans text-[#262626] dark:text-[#F9FAFB] transition-colors duration-500">
      {/* Sidebar danh sách bài tập */}
      <ProblemListSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentProblemId={problemId}
      />

      {/* Header điều hướng chính */}
      <Header
        problemId={problemId}
        isNoteActive={editorActiveTab === "note"}
        onNoteClick={() => setEditorActiveTab("note")}
        onProblemListClick={() => setIsSidebarOpen(true)}
      />

      <main className="flex flex-1 overflow-hidden p-2 gap-2 bg-[#f0f0f0] dark:bg-[#101828]">
        {/* PANEL TRÁI: NỘI DUNG CHI TIẾT (Description, Editorial, v.v.) */}
        <div className="w-1/2 bg-white dark:bg-[#1C2737] rounded-xl flex flex-col overflow-hidden shadow-sm border border-gray-200 dark:border-[#334155] transition-all duration-500">
          {/* Tabs Navigation nội dung */}
          <div className="bg-[#fafafa] dark:bg-[#162130] border-b dark:border-[#334155] shrink-0 h-11 flex items-center">
            <Tabs
              aria-label="Content Tabs"
              variant="underlined"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              classNames={{
                tabList: "px-4 gap-6 h-full border-b-0",
                cursor: "bg-black dark:bg-[#E3C39D] h-[2px]",
                tab: "text-[11px] font-black uppercase tracking-wider dark:text-[#94A3B8] data-[selected=true]:dark:text-[#E3C39D] h-full",
              }}
            >
              <Tab key="description" title="Description" />
              <Tab key="editorial" title="Editorial" />
              <Tab key="solutions" title="Solutions" />
              <Tab key="submissions" title="Submissions" />
            </Tabs>
          </div>

          {/* Vùng hiển thị nội dung các Tab */}
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto no-scrollbar p-1">
              <div className="min-h-full">
                {activeTab === "description" && <DescriptionTab />}
                {activeTab === "editorial" && <EditorialTab />}
                {activeTab === "solutions" && <SolutionsTab />}
                {activeTab === "submissions" && <SubmissionsTab />}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL PHẢI: TRÌNH SOẠN THẢO VÀ TESTCASE */}
        <div
          ref={editorContainerRef}
          className="w-1/2 flex flex-col gap-2 overflow-hidden min-w-0"
        >
          {/* Trình soạn thảo Code */}
          <div className="flex-1 min-h-0 bg-white dark:bg-[#1C2737] rounded-xl border border-gray-200 dark:border-[#334155] overflow-hidden flex flex-col shadow-sm">
            <EditorPanel
              activeTab={editorActiveTab}
              setActiveTab={setEditorActiveTab}
              code={code}
              setCode={setCode}
              onMount={handleEditorDidMount}
              onFormat={handleFormatCode}
              onFullScreen={handleFullScreen}
            />
          </div>

          {/* Panel Testcase / Kết quả */}
          <div className="bg-white dark:bg-[#1C2737] rounded-xl border border-gray-200 dark:border-[#334155] overflow-hidden shadow-sm">
            <TestcasePanel
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              testTab={testTab}
              setTestTab={setTestTab}
              activeCase={activeCase}
              setActiveCase={setActiveCase}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
