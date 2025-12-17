"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { NoteEditor } from "./NoteEditor";
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

export const EditorPanel = ({
  activeTab,
  setActiveTab,
  code,
  setCode,
  onMount,
  onFormat,
  onFullScreen,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const [selectedLang, setSelectedLang] = useState("C++");
  const languages = [
    ["C++", "Java", "Python3", "Python", "JavaScript", "TypeScript", "C#", "C"],
    ["Go", "Kotlin", "Swift", "Rust", "Ruby", "PHP", "Dart", "Scala"],
    ["Elixir", "Erlang", "Racket"],
  ];

  return (
    <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col relative">
      {/* Tabs nội bộ: Code | Note */}
      <div className="flex bg-[#fafafa] border-b px-2 shrink-0 h-9">
        <div
          onClick={() => setActiveTab("code")}
          className={`px-3 flex items-center gap-2 text-[11px] font-bold cursor-pointer border-b-2 transition-all ${
            activeTab === "code"
              ? "border-green-600 text-green-600 bg-white"
              : "border-transparent text-gray-400"
          }`}
        >
          <span className="text-[10px]">{"</>"}</span> Code
        </div>
        <div
          onClick={() => setActiveTab("note")}
          className={`px-3 flex items-center gap-2 text-[11px] font-bold cursor-pointer border-b-2 transition-all ${
            activeTab === "note"
              ? "border-orange-500 text-orange-500 bg-white"
              : "border-transparent text-gray-400"
          }`}
        >
          <StickyNote size={12} /> Note
          {activeTab === "note" && (
            <X
              size={10}
              className="ml-1 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("code");
              }}
            />
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center px-4 py-1 border-b bg-white justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Dropdown className="min-w-[500px]">
            <DropdownTrigger>
              <Button
                size="sm"
                variant="light"
                className="h-7 text-xs font-medium text-gray-600"
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
                <div className="grid grid-cols-3 gap-x-8 gap-y-1 text-gray-500">
                  {languages.map((col, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {col.map((lang) => (
                        <div
                          key={lang}
                          onClick={() => setSelectedLang(lang)}
                          className={`text-[13px] py-1 px-2 rounded hover:bg-gray-100 cursor-pointer ${
                            selectedLang === lang
                              ? "text-black font-bold bg-gray-50"
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
          <span className="text-[10px] text-gray-300 flex items-center gap-1">
            <Settings size={12} /> Auto
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Format">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400"
              onClick={onFormat}
            >
              <AlignLeft size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Reset">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400"
            >
              <RotateCcw size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Full Screen">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400"
              onClick={onFullScreen}
            >
              <Expand size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "code" ? (
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-light"
            value={code}
            onMount={onMount}
            onChange={(v) => setCode(v || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              automaticLayout: true,
            }}
          />
        ) : (
          <NoteEditor />
        )}
      </div>
    </div>
  );
};
