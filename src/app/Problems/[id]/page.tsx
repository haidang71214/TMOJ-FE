"use client";

import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/react";

// Import các Component nhỏ từ folder "coding"
import { Header } from "./coding/Header";
import { EditorPanel } from "./coding/EditorPanel";
import { TestcasePanel } from "./coding/TestcasePanel";

import { ProblemListSidebar } from "./ProblemListSidebar";
// Import các Tab nội dung
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
    <div className="flex flex-col h-screen bg-[#f0f0f0] overflow-hidden font-sans text-[#262626]">
      <ProblemListSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentProblemId={problemId}
      />

      <Header
        problemId={problemId}
        isNoteActive={editorActiveTab === "note"}
        onNoteClick={() => setEditorActiveTab("note")}
        onProblemListClick={() => setIsSidebarOpen(true)}
      />

      <main className="flex flex-1 overflow-hidden p-2 gap-2">
        <div className="w-1/2 bg-white rounded-xl flex flex-col overflow-hidden shadow-sm border border-gray-200">
          <div className="bg-[#fafafa] border-b shrink-0 h-10">
            <Tabs
              aria-label="Content Tabs"
              variant="underlined"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              classNames={{
                tabList: "px-4 gap-6 h-full",
                cursor: "bg-black",
                tab: "text-xs font-bold",
              }}
            >
              <Tab key="description" title="Description" />
              <Tab key="editorial" title="Editorial" />
              <Tab key="solutions" title="Solutions" />
              <Tab key="submissions" title="Submissions" />
            </Tabs>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === "description" && <DescriptionTab />}
            {activeTab === "editorial" && <EditorialTab />}
            {activeTab === "solutions" && <SolutionsTab />}
            {activeTab === "submissions" && <SubmissionsTab />}
          </div>
        </div>

        <div
          ref={editorContainerRef}
          className="w-1/2 flex flex-col gap-2 overflow-hidden"
        >
          <EditorPanel
            activeTab={editorActiveTab}
            setActiveTab={setEditorActiveTab}
            code={code}
            setCode={setCode}
            onMount={handleEditorDidMount}
            onFormat={handleFormatCode}
            onFullScreen={handleFullScreen}
          />

          <TestcasePanel
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            testTab={testTab}
            setTestTab={setTestTab}
            activeCase={activeCase}
            setActiveCase={setActiveCase}
          />
        </div>
      </main>
    </div>
  );
}
