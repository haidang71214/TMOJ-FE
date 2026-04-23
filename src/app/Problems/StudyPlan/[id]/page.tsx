"use client";

import { Button, Card, CardBody, Chip, Progress, Spinner } from "@heroui/react";
import { Bookmark, CheckCircle2, ChevronLeft, ChevronRight, Clock, Lock, Play, Trophy } from "lucide-react";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetStudyPlanDetailQuery } from "@/store/queries/StudyPlan";

export default function PackageEnrollPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [isEnrolled, setIsEnrolled] = useState(false);

  const { data: response, isLoading, isError } = useGetStudyPlanDetailQuery(id, { skip: !id });
  const plan = response?.data;
  console.log(response);
  
  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  const handleSaveProgress = () => {
    alert("Learning progress saved successfully!");
  };

  const overallProgress = useMemo(() => {
    if (!plan?.items || plan.items.length === 0) return 0;
    const completed = plan.items.filter((item: any) => item.isCompleted).length;
    return Math.round((completed / plan.items.length) * 100);
  }, [plan]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F2F5] dark:bg-[#0A0F1C]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#F0F2F5] dark:bg-[#0A0F1C]">
        <h2 className="text-2xl font-bold mb-4 text-[#071739] dark:text-white">Failed to load study plan</h2>
        <Button color="primary" onPress={() => router.push('/StudyPlan')}>Back to Study Plans</Button>
      </div>
    );
  }

  const items = [...(plan.items || [])].sort((a: any, b: any) => a.order - b.order);

  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans pb-24">
      {/* HEADER BANNER */}
      <div className="bg-[#071739] dark:bg-[#1a2035] text-white pt-16 pb-12 px-8">
        <div className="max-w-[1000px] mx-auto space-y-6">
          <Button 
            variant="light" 
            className="text-slate-400 hover:text-white -ml-4"
            startContent={<ChevronLeft size={16} />}
            onPress={() => router.push('/StudyPlan')}
          >
            Back to Study Plans
          </Button>

          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <Chip size="sm" className="bg-[#FF5C00]/20 text-[#FF5C00] font-black tracking-widest uppercase">
                  BEGINNER
                </Chip>
                <span className="text-slate-400 text-sm flex items-center gap-1"><Clock size={14} /> Flexible</span>
                <span className="text-slate-400 text-sm flex items-center gap-1"><Trophy size={14} /> {items.length} Problems</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">{plan.title}</h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {plan.description || "Comprehensive problem solving pathway to enhance your skills."}
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              {isEnrolled ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-[#FF5C00] text-white font-black uppercase shadow-xl hover:bg-[#ff7a33]"
                    startContent={<Play size={18} fill="currentColor" />}
                  >
                    Continue Learning
                  </Button>
                  <Button 
                    size="lg" 
                    variant="bordered"
                    className="text-white border-white/20 font-bold hover:bg-white/10"
                    startContent={<Bookmark size={18} />}
                    onPress={handleSaveProgress}
                  >
                    Save Progress
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-[#FF5C00] text-white font-black uppercase text-lg shadow-xl shadow-[#FF5C00]/20 h-16 transition-transform active:scale-95"
                  onPress={handleEnroll}
                >
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-[1000px] mx-auto px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: MODULES */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            Path Items <span className="text-slate-400 text-sm font-medium">({items.length})</span>
          </h2>

          <div className="space-y-4">
            {items.map((item: any, idx: number) => (
              <Card 
                key={item.studyPlanItemId} 
                className={`border-none shadow-sm ${!item.isUnlocked ? "bg-slate-50 dark:bg-black/20 opacity-70" : "bg-white dark:bg-[#1C2737]"}`}
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black flex-shrink-0
                        ${item.isCompleted ? "bg-emerald-100 text-emerald-600" : !item.isUnlocked ? "bg-slate-200 text-slate-400" : "bg-indigo-100 text-indigo-600"}`}
                      >
                        {item.isCompleted ? <CheckCircle2 size={20} /> : !item.isUnlocked ? <Lock size={18} /> : idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Challenge #{item.order + 1}</h3>
                        <p className="text-xs text-slate-500 font-medium font-mono truncate max-w-[150px] sm:max-w-[300px]">ID: {item.problemId}</p>
                      </div>
                    </div>

                    {item.isUnlocked && (
                      <Button 
                        size="sm" 
                        variant="flat" 
                        className="bg-[#071739]/5 dark:bg-white/5 font-bold" 
                        endContent={<ChevronRight size={14} />}
                        onPress={() => {
                          if(isEnrolled) {
                             router.push(`/Problems/${item.problemId}/Description`);
                          } else {
                             alert("Please enroll first to access the challenge!");
                          }
                       }}
                      >
                        Solve
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: OVERALL PROGRESS (Only visible if enrolled) */}
        <div className="space-y-6">
          {isEnrolled && (
            <Card className="bg-white dark:bg-[#1C2737] border-none shadow-xl rounded-3xl overflow-hidden sticky top-32">
              <div className="bg-gradient-to-br from-[#071739] to-[#1a2a4a] p-6 text-white">
                <h3 className="font-black uppercase tracking-widest text-xs mb-6 opacity-80">Your Overall Progress</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black">{overallProgress}%</span>
                  <span className="text-sm font-bold opacity-70 mb-1">COMPLETED</span>
                </div>
                <Progress 
                  value={overallProgress} 
                  className="h-3 bg-white/10" 
                  classNames={{ indicator: "bg-[#FF5C00]" }} 
                />
                <p className="text-xs font-medium opacity-70 mt-4 leading-relaxed">
                  Keep going! Complete the next challenge to increase your progress.
                </p>
              </div>
            </Card>
          )}

          {!isEnrolled && (
            <Card className="bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 shadow-sm p-6 rounded-3xl sticky top-32">
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-4">Package Includes</h3>
              <ul className="space-y-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> {items.length} Curated Challenges</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Step-by-step Progression</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Detailed Editorials</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlockable Content</li>
              </ul>
            </Card>
          )}
        </div>

      </div>
    </main>
  );
}
