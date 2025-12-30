"use client";
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { NoteEditor } from "./NoteEditor";
import { useTheme } from "next-themes";
import type { editor } from "monaco-editor";
import {
  ChevronDown,
  RotateCcw,
  Expand,
  AlignLeft,
  X,
  StickyNote,
  Settings,
} from "lucide-react";
import {
  Button,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

interface EditorPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  code: string;
  setCode: (code: string) => void;
  onMount: (editor: editor.IStandaloneCodeEditor) => void;
  onFormat: () => void;
  onFullScreen: () => void;
}

export const EditorPanel = ({
  activeTab,
  setActiveTab,
  code,
  setCode,
  onMount,
  onFormat,
  onFullScreen,
}: EditorPanelProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedLang, setSelectedLang] = useState("C++");

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    ["C++", "Java", "Python3", "Python", "JavaScript", "TypeScript", "C#", "C"],
    ["Go", "Kotlin", "Swift", "Rust", "Ruby", "PHP", "Dart", "Scala"],
    ["Elixir", "Erlang", "Racket"],
  ];

  if (!mounted) return null;

  return (
    <div className="flex-1 bg-white dark:bg-[#1C2737] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-[#334155] flex flex-col relative transition-colors duration-500">
      <div className="flex bg-[#fafafa] dark:bg-[#162130] border-b dark:border-[#334155] px-2 shrink-0 h-9">
        <div
          onClick={() => setActiveTab("code")}
          className={`px-4 flex items-center gap-2 text-[11px] font-bold cursor-pointer border-b-2 transition-all ${
            activeTab === "code"
              ? "border-green-600 dark:border-[#E3C39D] text-green-600 dark:text-[#E3C39D] bg-white dark:bg-[#1C2737]"
              : "border-transparent text-gray-400 dark:text-[#667085]"
          }`}
        >
          <span className="text-[10px]">{"</>"}</span> Code
        </div>
        <div
          onClick={() => setActiveTab("note")}
          className={`px-4 flex items-center gap-2 text-[11px] font-bold cursor-pointer border-b-2 transition-all ${
            activeTab === "note"
              ? "border-orange-500 text-orange-500 dark:text-orange-400 bg-white dark:bg-[#1C2737]"
              : "border-transparent text-gray-400 dark:text-[#667085]"
          }`}
        >
          <StickyNote size={12} /> Note
          {activeTab === "note" && (
            <X
              size={12}
              className="ml-1 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("code");
              }}
            />
          )}
        </div>
      </div>

      <div className="flex items-center px-4 py-1 border-b dark:border-[#334155] bg-white dark:bg-[#1C2737] justify-between shrink-0 h-10">
        <div className="flex items-center gap-4">
          <Dropdown className="min-w-[500px] dark:bg-[#1C2737] dark:border-[#334155]">
            <DropdownTrigger>
              <Button
                size="sm"
                variant="light"
                className="h-7 text-xs font-black text-gray-600 dark:text-[#F9FAFB] hover:dark:bg-[#101828]"
                endContent={<ChevronDown size={14} />}
              >
                {selectedLang}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Languages" className="p-4">
              <DropdownItem
                key="grid"
                isReadOnly
                className="cursor-default p-0"
              >
                <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-gray-500 dark:text-[#94A3B8]">
                  {languages.map((col, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {col.map((lang) => (
                        <div
                          key={lang}
                          onClick={() => setSelectedLang(lang)}
                          className={`text-[13px] py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#101828] cursor-pointer transition-colors ${
                            selectedLang === lang
                              ? "text-black dark:text-[#E3C39D] font-black bg-gray-50 dark:bg-[#101828]"
                              : ""
                          }`}
                        >
                          {lang}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span className="text-[10px] text-gray-300 dark:text-[#475569] font-bold flex items-center gap-1 uppercase tracking-widest">
            <Settings size={12} /> Auto
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip
            content="Format"
            className="dark:bg-[#101828] dark:text-white"
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400 dark:text-[#94A3B8] hover:dark:text-white"
              onClick={onFormat}
            >
              <AlignLeft size={16} />
            </Button>
          </Tooltip>
          <Tooltip
            content="Reset"
            className="dark:bg-[#101828] dark:text-white"
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400 dark:text-[#94A3B8] hover:dark:text-white"
            >
              <RotateCcw size={16} />
            </Button>
          </Tooltip>
          <Tooltip
            content="Full Screen"
            className="dark:bg-[#101828] dark:text-white"
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400 dark:text-[#94A3B8] hover:dark:text-white"
              onClick={onFullScreen}
            >
              <Expand size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white dark:bg-[#1C2737]">
        {activeTab === "code" ? (
          <Editor
            height="100%"
            defaultLanguage="cpp"
            language={selectedLang.toLowerCase().replace("3", "")}
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            value={code}
            onMount={onMount}
            onChange={(v) => setCode(v || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 10 },
              lineNumbersMinChars: 3,
            }}
          />
        ) : (
          <NoteEditor />
        )}
      </div>
    </div>
  );
};
