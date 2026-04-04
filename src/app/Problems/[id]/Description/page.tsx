"use client";

import React from "react";
import { 
  CheckCircle2,
  Clock,
  Cpu,
  Target,
  FileText,
  Activity,
  AlertCircle
} from "lucide-react";
import { useParams } from "next/navigation";
import { useGetDetailProblemPublicQuery } from "@/store/queries/ProblemPublic";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// Types
interface Problem {
  title: string;
  content?: string;
  difficulty?: string;
  statusCode?: string;
  isActive?: boolean;
  slug?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  createdAt?: string;
  publishedAt?: string;
  acceptancePercent?: number;
}

// Difficulty styles (Light Theme)
const DIFFICULTY_MAP: Record<string, { color: string; bg: string; border: string; label: string }> = {
  easy:   { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Easy" },
  medium: { color: "text-amber-700",   bg: "bg-amber-50", border: "border-amber-200",   label: "Medium" },
  hard:   { color: "text-rose-700",     bg: "bg-rose-50", border: "border-rose-200",     label: "Hard" },
};

const DEFAULT_DIFFICULTY = DIFFICULTY_MAP.easy;

const getDifficulty = (difficulty?: string) => 
  DIFFICULTY_MAP[difficulty?.toLowerCase() ?? "easy"] ?? DEFAULT_DIFFICULTY;

const isHiddenTitle = (children: any) => {
  let text = "";
  if (Array.isArray(children)) {
    text = children.map((c: any) => (typeof c === "string" ? c : "")).join("");
  } else if (typeof children === "string") {
    text = children;
  }
  return text.trim().toLowerCase() === "subtasks";
};

export default function DescriptionTab() {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading, isError } = useGetDetailProblemPublicQuery(
    { id }, 
    { skip: !id }
  );

  const problem = response?.data as Problem | undefined;

  if (isLoading) {
    return (
      <div className="h-full px-8 py-8 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-white">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="animate-pulse">Đang tải mô tả bài toán...</p>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="h-full px-8 py-8 flex flex-col items-center justify-center text-rose-500 space-y-4 bg-white">
        <AlertCircle size={48} className="text-rose-500/50" />
        <p>Không tìm thấy bài toán hoặc đã có lỗi xảy ra.</p>
      </div>
    );
  }

  const diff = getDifficulty(problem.difficulty);

  return (
    <div className="h-full overflow-y-auto px-6 md:px-10 py-8 space-y-10 no-scrollbar bg-slate-50 text-slate-700 selection:bg-orange-500/20">
      
      {/* Header Section */}
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
            {problem.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm font-semibold">
          <span className={`px-3 py-1 rounded-full border ${diff.bg} ${diff.color} ${diff.border} flex items-center gap-1.5 shadow-sm`}>
            <Activity size={14} />
            {diff.label}
          </span>
          
          {problem.statusCode && (
             <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
               {problem.statusCode}
             </span>
          )}
          
          <span className={`px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm
            ${problem.isActive 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-slate-100 text-slate-500 border-slate-200"}`}
          >
            <CheckCircle2 size={14} className={problem.isActive ? "text-emerald-600" : "text-slate-400"} />
            {problem.isActive ? "Đang hoạt động" : "Tạm ngưng"}
          </span>
        </div>
      </div>

      {/* Description Content */}
      <div className="prose prose-slate prose-headings:text-slate-900 prose-headings:font-bold 
                      prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-800 
                      prose-a:text-orange-600 hover:prose-a:text-orange-500 prose-a:transition-colors
                      max-w-none text-[15.5px]
                      animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }: any) {
              return !inline ? (
                <div className="my-6 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                  </div>
                  <pre className="p-4 overflow-auto text-sm bg-transparent !m-0">
                    <code className={`${className} text-slate-800 font-mono`} {...props}>{children}</code>
                  </pre>
                </div>
              ) : (
                <code className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border border-orange-100" {...props}>
                  {children}
                </code>
              );
            },
            // Cắt hẳn table sinh ra từ chuỗi nội dung markdown (để nhường chỗ cho UI tĩnh đẹp hơn ở dưới)
            table: () => null,
            // Sửa lỗi gạch ngang (strikethrough) khi markdown quét trúng ký hiệu `~` trong công thức Toán
            del: ({ children, ...props }: any) => <span {...props}>{children}</span>,
            // Ẩn Title thừa còn sót lại trên giao diện Markdown
            h1: ({ children, ...props }: any) => isHiddenTitle(children) ? null : <h1 {...props}>{children}</h1>,
            h2: ({ children, ...props }: any) => isHiddenTitle(children) ? null : <h2 {...props}>{children}</h2>,
            h3: ({ children, ...props }: any) => isHiddenTitle(children) ? null : <h3 {...props}>{children}</h3>,
            h4: ({ children, ...props }: any) => isHiddenTitle(children) ? null : <h4 {...props}>{children}</h4>,
            p: ({ children, ...props }: any) => isHiddenTitle(children) ? null : <p {...props}>{children}</p>,
          }}
        >
          {problem.content || "Chưa có mô tả cho bài toán này."}
        </ReactMarkdown>
      </div>

      {/* Constraints & Examples Grid */}
      <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
        
        {/* Left Column: Examples */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <FileText size={18} className="text-orange-500" />
            <h2 className="text-xl font-bold text-slate-800">
              Examples
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Example 1 */}
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:border-orange-300 hover:shadow-[0_4px_20px_rgba(249,115,22,0.08)]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full rounded-tr-2xl -z-10 transition-all duration-300 group-hover:bg-orange-100/50"></div>
              <div className="text-orange-600 font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Example 1
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-bold">Input</div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm text-slate-800 selection:bg-orange-500/20">1 5</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-bold">Output</div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm text-slate-800 selection:bg-orange-500/20">2</div>
                </div>
                <div className="pt-3 text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                  <span className="text-slate-800 font-semibold">Giải thích:</span> 1, 4 là các số chính phương.
                </div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:border-orange-300 hover:shadow-[0_4px_20px_rgba(249,115,22,0.08)]">
               <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full rounded-tr-2xl -z-10 transition-all duration-300 group-hover:bg-orange-100/50"></div>
               <div className="text-orange-600 font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Example 2
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-bold">Input</div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm text-slate-800 selection:bg-orange-500/20">10 20</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-bold">Output</div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm text-slate-800 selection:bg-orange-500/20">1</div>
                </div>
                <div className="pt-3 text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                  <span className="text-slate-800 font-semibold">Giải thích:</span> 16 là số chính phương.
                </div>
              </div>
            </div>
            
            {/* Example 3 */}
             <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:border-orange-300 hover:shadow-[0_4px_20px_rgba(249,115,22,0.08)] md:col-span-2">
               <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full rounded-tr-2xl -z-10 transition-all duration-300 group-hover:bg-orange-100/50"></div>
               <div className="text-orange-600 font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Example 3
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-bold">Input</div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm text-slate-800 selection:bg-orange-500/20">5 8</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-bold">Output</div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm text-slate-800 selection:bg-orange-500/20">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Subtasks and Constraints Row */}
      <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          {/* Constraints */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" />
              Constraints
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[calc(100%-2.5rem)] hover:shadow-md transition-shadow">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <code className="bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md text-sm text-amber-700 font-mono tracking-wide">1 ≤ a ≤ b ≤ 10⁹</code>
                </li>
              </ul>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Target size={18} className="text-blue-500" />
               Subtasks
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-[calc(100%-2.5rem)] hover:shadow-md transition-shadow">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Subtask</th>
                    <th className="px-6 py-4">Điểm</th>
                    <th className="px-6 py-4">Ràng buộc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">1</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">4.0</span>
                    </td>
                    <td className="px-6 py-4"><code className="text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-md font-mono text-[13px]">1 ≤ a ≤ b ≤ 10⁶</code></td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">2</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">1.0</span>
                    </td>
                    <td className="px-6 py-4"><code className="text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-md font-mono text-[13px]">10⁶ ≤ a ≤ b ≤ 10⁹</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>

      {/* Bottom Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-orange-200 hover:shadow-[0_4px_20px_rgba(249,115,22,0.08)] transition-all group">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Time Limit</div>
            <div className="text-slate-800 font-bold">{problem.timeLimitMs} ms</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-[0_4px_20px_rgba(59,130,246,0.08)] transition-all group">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-500 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
            <Cpu size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Memory Limit</div>
            <div className="text-slate-800 font-bold">{problem.memoryLimitKb} KB</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-amber-200 hover:shadow-[0_4px_20px_rgba(245,158,11,0.08)] transition-all group">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
            <Target size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Acceptance</div>
            <div className="text-slate-800 font-bold">
              {problem.acceptancePercent?.toFixed(1) ?? "?"}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Padding */}
      <div className="h-4"></div>

    </div>
  );
}
