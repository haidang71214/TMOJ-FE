"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { 
  FileText, AlertTriangle, FileDown, Clock, Search,
  Check, Hash, BookOpen, Tag, Code, PenTool, MonitorPlay,
  Download, Printer, ChevronRight, Share, ZoomIn, ZoomOut,
  CheckCircle2
} from "lucide-react";
import { 
  Button, Card, CardBody, Divider, Chip
} from "@heroui/react";

export default function ProblemInContestPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params.id as string;
  const problemId = params.ProblemInContest as string;

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 pb-20">

      {/* PROBLEM SPECIFIC SUB-HEADER */}
      <div className="bg-white dark:bg-[#1e293b]/70 border-b border-slate-200 dark:border-slate-800 py-3 sm:py-4 shadow-sm relative z-10 transition-all">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            A: Area Query
          </h1>
          <Button 
            variant="light" 
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium px-4 h-9 w-fit shrink-0"
            startContent={<FileDown className="w-4 h-4" />}
          >
            Xem dạng PDF
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ALERT BANNER */}
        <div className="mb-6 bg-orange-50 dark:bg-[#F26F21]/10 border border-orange-200 dark:border-[#F26F21]/30 rounded-lg p-3 sm:px-4 flex items-start sm:items-center gap-3 text-[14.5px] text-slate-700 dark:text-slate-300">
          <AlertTriangle className="w-5 h-5 text-[#F26F21] dark:text-[#F26F21] shrink-0 mt-0.5 sm:mt-0" />
          <p>
            If the problem statement is not displaying correctly, you can download it here:{" "}
            <a href="#" className="font-medium text-[#F26F21] hover:underline underline-offset-2">Problem Statement</a>
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: PDF VIEWER MOCK */}
          <div className="lg:col-span-9 w-full">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-[#323639] flex flex-col h-[800px]">
              
              {/* PDF TOOLBAR */}
              <div className="bg-[#323639] border-b border-[#202224] h-12 px-4 flex items-center justify-between text-slate-300 selection:bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span className="text-[13px] font-medium tracking-wide">2023regional</span>
                  </div>
                </div>
                
                <div className="flex flex-1 justify-center items-center gap-4">
                  <span className="text-[13px]">1 / 4</span>
                  <div className="h-4 w-[1px] bg-slate-600"></div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-white/10 rounded transition-colors"><ZoomOut className="w-[15px] h-[15px]" /></button>
                    <span className="text-[13px] w-12 text-center">95%</span>
                    <button className="p-1.5 hover:bg-white/10 rounded transition-colors"><ZoomIn className="w-[15px] h-[15px]" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-white/10 rounded transition-colors"><Download className="w-[17px] h-[17px]" /></button>
                  <button className="p-2 hover:bg-white/10 rounded transition-colors"><Printer className="w-[17px] h-[17px]" /></button>
                </div>
              </div>

              {/* PDF CONTENT AREA */}
              <div className="flex-1 overflow-y-auto w-full flex justify-center py-6 styled-scrollbar relative">
                
                {/* Thumbnails Sidebar (decorative) */}
                <div className="absolute left-6 top-6 flex flex-col gap-4 opacity-70 hidden md:flex">
                  <div className="w-24 h-[135px] bg-white border-2 border-[#F26F21] shadow flex items-center justify-center p-2 rounded-sm cursor-pointer">
                    <div className="w-full h-full border border-slate-100 bg-slate-50 flex items-start justify-center p-1">
                      <div className="w-10 h-1 bg-[#F26F21]/30 rounded-full mt-2"></div>
                    </div>
                  </div>
                  <div className="w-24 h-[135px] bg-white opacity-50 shadow flex items-center justify-center p-2 rounded-sm cursor-pointer hover:opacity-100 transition-opacity">
                    <div className="w-full h-full border border-slate-100 bg-slate-50"></div>
                  </div>
                </div>

                {/* Main PDF Page */}
                <div className="bg-white w-full max-w-[800px] min-h-[1000px] shadow-lg rounded-sm p-12 md:p-20 text-slate-900 pb-32">
                  <div className="text-center space-y-4 mb-10">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold border-b border-black pb-4">
                      <span className="text-[#F26F21]">■</span> ICPC Asia Pacific - Hue City Regional Contest <span className="text-[#F26F21]">■</span>
                      <br/>
                      <span className="text-lg font-medium tracking-wide block mt-2">Hue University of Sciences – 8 December 2023</span>
                    </h2>
                    
                    <div className="pt-8">
                      <h3 className="text-[28px] font-bold">Problem A<br/>Area Query</h3>
                    </div>
                  </div>

                  <div className="space-y-6 text-[15.5px] leading-relaxed font-serif">
                    <p>
                      You are given a convex polygon with <span className="font-mono italic text-[14px]">n</span> vertices on the Cartesian plane. Its vertices are numbered from 1 to <span className="font-mono italic text-[14px]">n</span> in clockwise order. The <span className="font-mono italic text-[14px]">i</span>-th vertex has coordinates (<span className="font-mono italic text-[14px]">x_i, y_i</span>).
                    </p>
                    <p>
                      At the beginning, no diagonals of this polygon exist.
                    </p>
                    <p>
                      Your task is to process <span className="font-mono italic text-[14px]">q</span> queries of three following types:
                    </p>

                    <ul className="pl-6 space-y-4 list-disc marker:text-slate-400">
                      <li>
                        <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[14px]">A i j</span>: draw a new diagonal connecting the <span className="font-mono italic text-[14px]">i</span>-th vertex to the <span className="font-mono italic text-[14px]">j</span>-th vertex. It is guaranteed that the <span className="font-mono italic text-[14px]">i</span>-th vertex is not adjacent to the <span className="font-mono italic text-[14px]">j</span>-th vertex, the diagonal connecting these two vertices does not exist right before this query, and this diagonal does not intersect with any existing diagonals except at endpoints.
                      </li>
                      <li>
                        <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[14px]">R i j</span>: erase the diagonal connecting the <span className="font-mono italic text-[14px]">i</span>-th vertex to the <span className="font-mono italic text-[14px]">j</span>-th vertex. It is guaranteed that this diagonal exists right before this query.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Submit Action */}
            <Card className="shadow-sm border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#1e293b]/50">
              <CardBody className="p-4 space-y-3">
                <Button 
                  className="w-full bg-[#F26F21] hover:bg-[#d95b16] text-white font-medium shadow-md shadow-orange-500/20 text-[15px] h-11"
                  radius="sm"
                  onClick={() => router.push(`/Contest/${contestId}/Problems/${problemId}/Submit`)}
                >
                  Submit Code
                </Button>
                <div className="space-y-1">
                  <a href="#" className="flex items-center text-[#185adb] dark:text-sky-400 hover:underline px-2 py-1.5 text-[14.5px] font-medium transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <BookOpen className="w-[18px] h-[18px] mr-2.5 opacity-70" />
                    Submissions
                  </a>
                  <a href="#" className="flex items-center text-[#185adb] dark:text-sky-400 hover:underline px-2 py-1.5 text-[14.5px] font-medium transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <CheckCircle2 className="w-[18px] h-[18px] mr-2.5 opacity-70" />
                    Best Submission
                  </a>
                </div>
              </CardBody>
            </Card>

            {/* Meta Info */}
            <Card className="shadow-sm border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#1e293b]/50">
              <CardBody className="p-4">
                <ul className="space-y-4 text-[14px] text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Score:</span> 
                    <span>2.00</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Time Limit:</span> 
                    <span>5.0s</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MonitorPlay className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Memory Limit:</span> 
                    <span>512M</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FileDown className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Input:</span> 
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[13px]">stdin</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Share className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Output:</span> 
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[13px]">stdout</span>
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Accordion / Info blocks */}
            <div className="space-y-4 pt-1 text-[14.5px]">
              
              {/* Nguồn bài */}
              <div className="border-l-2 border-[#F26F21] pl-3 py-1">
                <h4 className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100 mb-1">
                  <PenTool className="w-[18px] h-[18px] text-slate-400" />
                  Source:
                </h4>
                <p className="text-slate-600 dark:text-slate-400 ml-6 hover:text-[#F26F21] dark:hover:text-[#F26F21] cursor-pointer transition-colors leading-relaxed">
                  ICPC 2023 Regional
                </p>
              </div>

              {/* Dạng bài */}
              <div className="border-l-2 border-slate-300 dark:border-slate-700 hover:border-[#F26F21] dark:hover:border-[#F26F21] transition-colors pl-3 py-1 group">
                <h4 className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#F26F21] transition-colors cursor-pointer">
                  <ChevronRight className="w-[18px] h-[18px] text-slate-400 group-hover:text-[#F26F21] transition-colors" />
                  Problem Type
                </h4>
              </div>

              {/* Ngôn ngữ cho phép */}
              <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-3 py-1">
                <h4 className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100 mb-2 cursor-pointer transition-colors group">
                  <ChevronRight className="w-[18px] h-[18px] text-slate-400 transform rotate-90 transition-transform" />
                  Allowed Languages
                </h4>
                <div className="ml-6 flex flex-wrap gap-1.5">
                  {["C", "C++", "Go", "Java", "Kotlin", "Pascal", "PyPy", "Python", "Rust", "Scratch"].map(lang => (
                    <span key={lang} className="text-[12px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono tracking-tight hover:border-[#F26F21] dark:hover:border-[#F26F21] cursor-default transition-colors">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
