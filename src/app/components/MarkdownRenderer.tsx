"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import PremiumCodeBlock from "./PremiumCodeBlock";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Normalize newlines and double escaping
  const rawContent = (content || "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "");

  // Smart Detection: If the content looks like raw code but has no code blocks,
  // we attempt to wrap it automatically for a better experience.
  let finalContent = rawContent;
  const hasCodeBlock = rawContent.includes("```");
  
  if (!hasCodeBlock) {
    // Check for common code patterns (C++, Java, Python, braces, imports)
    const codeIndicators = [
      /^C\+\+/m, /^Java/m, /^Python/m, /^def /m, /^class /m, /^#include/m,
      /{[\s\S]*}/, /public\s+class/m, /public\s+static/m, /void\s+main/m,
      /vector<[\w\s,]+>/, /unordered_map/
    ];
    
    const isLikelyCode = codeIndicators.some(regex => regex.test(rawContent));
    
    if (isLikelyCode) {
      // Try to detect language from first line
      const firstLine = rawContent.split('\n')[0].trim().toLowerCase();
      let detectedLang = "";
      if (firstLine.includes("c++") || firstLine.includes("cpp")) detectedLang = "cpp";
      else if (firstLine.includes("python") || firstLine.includes("py")) detectedLang = "python";
      else if (firstLine.includes("java")) detectedLang = "java";
      else if (firstLine.includes("javascript") || firstLine.includes("js")) detectedLang = "javascript";
      
      if (detectedLang) {
        // Strip the language header line and wrap the rest
        const lines = rawContent.split('\n');
        finalContent = "```" + detectedLang + "\n" + lines.slice(1).join('\n') + "\n```";
      } else {
        finalContent = "```cpp\n" + rawContent + "\n```";
      }
    }
  }

  return (
    <div className={className}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const content = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-[#FF5C00]/5 text-[#FF5C00] dark:text-[#FFB800] font-mono text-xs border border-[#FF5C00]/10" {...props}>
                  {children}
                </code>
              );
            }

            return <PremiumCodeBlock blocks={[{ language, content }]} />;
          },
          // Enhance other elements
          h1: ({ children }) => <h1 className="text-3xl font-black uppercase italic tracking-tighter text-[#071739] dark:text-white mb-8 border-l-8 border-[#FF5C00] pl-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-[#071739] dark:text-white mt-12 mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#FF5C00] rounded-full" />
            {children}
          </h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4 border-b-2 border-slate-100 dark:border-white/5 pb-2 text-amber-500 uppercase tracking-widest text-sm">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#FF5C00]/50 bg-[#FF5C00]/5 px-8 py-6 rounded-r-2xl italic my-8 text-slate-600 dark:text-slate-400 shadow-sm border-dashed">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-10 overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0D1B2A]/50">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#FF5C00]/5 dark:bg-[#FF5C00]/10 border-b border-slate-200 dark:border-white/5">{children}</thead>,
          th: ({ children }) => <th className="px-8 py-4 text-left text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5C00] dark:text-amber-500">{children}</th>,
          td: ({ children }) => <td className="px-8 py-5 text-sm border-b border-slate-50 dark:border-white/5 text-slate-600 dark:text-slate-300 font-medium">{children}</td>,
          p: ({ children }) => <p className="mb-6 leading-[1.8] text-[15px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{children}</p>,
          ul: ({ children }) => <ul className="list-none mb-6 space-y-4 text-slate-600 dark:text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-4 text-slate-600 dark:text-slate-300 font-bold">{children}</ol>,
          li: ({ children }) => <li className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-3 before:h-3 before:bg-amber-500/20 before:border-2 before:border-amber-500 before:rounded-full font-normal">
            {children}
          </li>,
          a: ({ children, href }) => <a href={href} className="text-[#FF5C00] hover:text-[#FF7A00] underline underline-offset-4 decoration-2 decoration-[#FF5C00]/30 hover:decoration-[#FF5C00] transition-all font-bold" target="_blank" rel="noopener noreferrer">{children}</a>,
        }}
      >
        {finalContent}
      </ReactMarkdown>
    </div>
  );
}
