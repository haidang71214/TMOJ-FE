"use client";
import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Tabs, Tab, Button, Tooltip } from "@heroui/react";

interface CodeBlock {
  language: string;
  content: string;
}

interface PremiumCodeBlockProps {
  blocks: CodeBlock[];
}

export default function PremiumCodeBlock({ blocks }: PremiumCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (content: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        fallbackCopy(content);
      });
    } else {
      fallbackCopy(content);
    }
  };

  const fallbackCopy = (content: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Unable to copy", err);
    }
  };

  if (blocks.length === 0) return null;

  // Single block - just show it beautifully
  if (blocks.length === 1) {
    const block = blocks[0];
    return (
      <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0D1B2A]/50 backdrop-blur-md shadow-xl group transition-all hover:shadow-2xl hover:border-orange-500/30">
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 dark:bg-[#111c35]/80 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getLanguageColor(block.language)} animation-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {block.language || "code"}
            </span>
          </div>
          <Tooltip content="Copy Code" className="font-bold text-[10px]">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => handleCopy(block.content)}
              className="h-8 w-8 rounded-lg bg-white dark:bg-white/5 text-slate-500 hover:text-[#FF5C00] transition-all"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </Button>
          </Tooltip>
        </div>
        <div className="relative">
          <pre className="p-5 overflow-x-auto text-[13px] font-mono leading-relaxed selection:bg-[#FF5C00]/20 scrollbar-hide">
            <code className={`language-${block.language}`}>
              {block.content}
            </code>
          </pre>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }

  // Multi-language tabs
  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0D1B2A]/50 backdrop-blur-md shadow-2xl transition-all hover:border-orange-500/30">
      <Tabs 
        aria-label="Code Languages" 
        variant="underlined"
        classNames={{
          base: "px-4 pt-2 bg-slate-50 dark:bg-[#111c35]/80 border-b border-slate-200 dark:border-white/5",
          tabList: "gap-4 relative rounded-none p-0 border-none",
          cursor: "bg-[#FF5C00] h-0.5",
          tab: "max-w-fit px-0 h-10",
          tabContent: "group-data-[selected=true]:text-[#FF5C00] font-black uppercase tracking-widest text-[10px] transition-colors",
        }}
      >
        {blocks.map((block, idx) => (
          <Tab 
            key={idx} 
            title={
              <div className="flex items-center gap-2 px-2">
                <Terminal size={14} className="opacity-50" />
                <span>{block.language || "code"}</span>
              </div>
            }
          >
            <div className="relative">
              <div className="absolute top-3 right-5 z-10">
                <Tooltip content="Copy Code" className="font-bold text-[10px]">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => handleCopy(block.content)}
                    className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm text-slate-400 hover:text-[#FF5C00] transition-all border border-white/5"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </Button>
                </Tooltip>
              </div>
              <pre className="p-6 overflow-x-auto text-[13px] font-mono leading-relaxed selection:bg-[#FF5C00]/20 min-h-[120px]">
                <code className={`language-${block.language}`}>
                  {block.content}
                </code>
              </pre>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

function getLanguageColor(lang: string) {
  const l = lang.toLowerCase();
  if (l.includes("cpp") || l.includes("c++")) return "bg-blue-500";
  if (l.includes("java")) return "bg-orange-500";
  if (l.includes("python") || l.includes("py")) return "bg-yellow-400";
  if (l.includes("js") || l.includes("ts") || l.includes("javascript")) return "bg-yellow-300";
  return "bg-slate-400";
}
