"use client";

import React, { useState, useRef } from "react";
import { Button, Chip } from "@heroui/react";
import { X, Eye, Eraser, Send, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner"; // Sử dụng sonner của Rim

// Import component bộ công cụ dùng chung
import { MarkdownToolbar } from "../../../components/MarkdownToolbar";

interface PostSolutionProps {
  onClose: () => void;
  initialCode?: string;
}

interface CodeBlockProps {
  children: React.ReactNode;
  lang: string;
}

export const PostSolution = ({
  onClose,
  initialCode = "",
}: PostSolutionProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(
    `# Intuition\n\n\n# Approach\n\n\n# Complexity\n- Time complexity:\n\n\n- Space complexity:\n\n\n# Code\n\`\`\`cpp\n${initialCode}\n\`\`\``
  );

  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Xử lý Post với Sonner Toast
  const handlePost = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your solution");
      return;
    }

    setIsPosting(true);

    // Giả lập gọi API nộp bài
    setTimeout(() => {
      setIsPosting(false);
      toast.success("Solution posted successfully!", {
        description: "Your post is now live in the Solutions tab.",
      });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 z-[40] flex flex-col bg-white dark:bg-[#1C2737] transition-all duration-500 overflow-hidden font-sans border-t border-gray-200 dark:border-[#334155] shadow-2xl animate-in slide-in-from-bottom-4">
      {/* 1. TOP HEADER BAR */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1C2737] shrink-0">
        <div className="flex-1 max-w-xl">
          <input
            placeholder="Enter your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-[1000] bg-transparent outline-none placeholder:text-slate-300 dark:text-white italic tracking-tight"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            onPress={onClose}
            className="font-black text-[11px] uppercase text-slate-500 rounded-xl h-9 px-6"
          >
            Cancel
          </Button>
          <Button
            isLoading={isPosting}
            onPress={handlePost}
            className="bg-[#2cbb5d] text-white font-[1000] text-[11px] uppercase rounded-xl h-9 px-6 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
            startContent={!isPosting && <Send size={14} />}
          >
            Post
          </Button>
        </div>
      </div>

      {/* 2. TOOLBAR & TAGS AREA */}
      <div className="px-4 py-2 flex flex-col gap-3 border-b border-gray-50 dark:border-[#334155] bg-slate-50/50 dark:bg-black/10 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <Button
            size="sm"
            variant="flat"
            className="rounded-lg h-7 font-black text-[10px] uppercase text-slate-500 bg-gray-200 dark:bg-[#101828]"
          >
            + Tag
          </Button>
          <Chip
            className="bg-slate-200 dark:bg-[#334155] text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 h-7"
            onClose={() => {}}
          >
            C++
          </Chip>
        </div>
        <MarkdownToolbar
          textareaRef={textareaRef}
          content={content}
          setContent={setContent}
        />
      </div>

      {/* 3. MAIN EDITOR & PREVIEW AREA */}
      <div className="flex flex-1 overflow-hidden divide-x dark:divide-[#334155]">
        {/* CỘT TRÁI: EDITOR */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1C2737]">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-6 font-mono text-[14px] leading-relaxed outline-none resize-none bg-transparent dark:text-slate-300 no-scrollbar"
            spellCheck={false}
          />
          <div className="px-6 py-2 bg-slate-50 dark:bg-black/20 border-t border-gray-50 dark:border-[#334155] flex justify-between items-center shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase italic">
              Markdown Supported
            </span>
            <div className="flex gap-4">
              <Eraser
                size={14}
                className="text-slate-300 cursor-pointer hover:text-rose-500 transition-colors"
                onClick={() => setContent("")}
              />
              <X
                size={14}
                className="text-slate-300 cursor-pointer hover:text-rose-500 transition-colors"
                onClick={onClose}
              />
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: LIVE PREVIEW */}
        <div className="flex-1 h-full overflow-y-auto p-10 bg-[#fafafa] dark:bg-[#101828]/40 no-scrollbar">
          <div className="flex items-center gap-2 text-slate-400 mb-6 border-b dark:border-white/5 pb-2">
            <Eye size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest italic decoration-[#FF5C00] decoration-2 underline underline-offset-4">
              Live Preview
            </span>
          </div>
          <div className="prose dark:prose-invert max-w-none prose-h1:text-2xl prose-h1:font-black prose-pre:p-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className="text-3xl font-[1000] dark:text-white tracking-tight italic mt-6 mb-4"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p className="my-2 leading-relaxed" {...props} />
                ),
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const lang = match ? match[1] : "C++";
                  const isBlock = /n/.test(String(children));

                  return isBlock ? (
                    <CodeBlock lang={lang}>{children}</CodeBlock>
                  ) : (
                    <code
                      className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[#FF5C00] font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeBlock = ({ children, lang }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = React.Children.toArray(children).join("");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Code copied to clipboard!"); // Dùng sonner cho copy
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden bg-white dark:bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-[#334155] bg-gray-50/50 dark:bg-[#161b22]">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-slate-400"
        >
          {copied ? (
            <Check size={14} className="text-emerald-500" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
      <div className="p-5 overflow-x-auto no-scrollbar font-mono text-[13px] leading-relaxed text-[#FF5C00]">
        {children}
      </div>
    </div>
  );
};
