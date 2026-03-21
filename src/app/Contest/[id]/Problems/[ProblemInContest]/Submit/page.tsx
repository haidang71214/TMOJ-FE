"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Maximize } from "lucide-react";
import { Button, Select, SelectItem } from "@heroui/react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

export default function SubmitProblemPage() {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  
  const problemId = searchParams.get("problemId") || "A";

  const [code, setCode] = useState<string>("#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    return 0;\n}\n");
  const [language, setLanguage] = useState<string>("cpp20");

  const languages = [
    { key: "cpp20", label: "C++20 (g++20 15.2.0)", editorLang: "cpp" },
    { key: "python3", label: "Python 3.10", editorLang: "python" },
    { key: "java", label: "Java 21", editorLang: "java" },
  ];

  const selectedLangItem = languages.find(l => l.key === language) || languages[0];

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 pb-10">
      
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TITLE */}
        <h1 className="text-[22px] sm:text-[26px] font-medium text-slate-800 dark:text-white mb-6">
          Submit Code <span className="text-[#F26F21]">ICPC 2023 Regional - {problemId}: Area Query</span>
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
              language={selectedLangItem.editorLang}
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
                selectedKeys={[language]}
                onChange={(e) => setLanguage(e.target.value)}
                classNames={{
                  base: "w-full",
                  trigger: "h-11 min-h-11 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a] shadow-sm rounded-md hover:border-slate-400 dark:hover:border-slate-500",
                  value: "text-[14px] font-medium text-slate-700 dark:text-slate-200",
                }}
                size="sm"
                variant="bordered"
              >
                {languages.map((lang) => (
                  <SelectItem key={lang.key} textValue={lang.label}>
                    {lang.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div className="w-full sm:w-auto flex justify-end pt-4 sm:pt-0 pb-1 sm:pb-0">
              <Button 
                className="w-full sm:w-auto bg-[#F26F21] hover:bg-[#d95b16] text-white font-medium px-8 h-10 shadow-md shadow-orange-500/10 rounded"
                onClick={() => {
                  alert("Code submitted. Redirecting to results page!");
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
