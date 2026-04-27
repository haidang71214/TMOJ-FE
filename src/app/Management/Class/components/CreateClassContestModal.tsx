"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Input,
  Textarea,
  Listbox,
  ListboxItem,
  Spinner,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import { 
  AlertCircle, 
  Plus, 
  Trash2, 
  Search, 
  Trophy, 
  Calendar, 
  Settings, 
  Database, 
  Globe, 
  CheckCircle2,
  Clock,
  Layout,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { Selection } from "@react-types/shared";
import { useModal } from "@/Provider/ModalProvider";
import { useGetProblemListPublicQuery } from "@/store/queries/ProblemPublic";
import { useGetProblemBankListQuery } from "@/store/queries/problem";
import { useCreateClassContestMutation } from "@/store/queries/ClassContest";
import { CreateClassContestRequest, CreateClassContestProblemItem, Problem } from "@/types";
import { RequiredStar } from "@/Common/RequiredStar";
import { useTranslation } from "@/hooks/useTranslation";

interface CreateClassContestModalProps {
  classSemesterId: string;
  onCreated?: () => void;
}

export default function CreateClassContestModal({ classSemesterId, onCreated }: CreateClassContestModalProps) {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const [createContest, { isLoading: isCreating }] = useCreateClassContestMutation();

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionMd, setDescriptionMd] = useState("");
  const [rules, setRules] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [freezeAt, setFreezeAt] = useState("");
  const [slotNo, setSlotNo] = useState<number | null>(null);
  const [slotTitle, setSlotTitle] = useState("");
  
  // Problems State
  const [selectedProblems, setSelectedProblems] = useState<CreateClassContestProblemItem[]>([]);
  const [activeSource, setActiveSource] = useState<"public" | "bank">("public");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Queries
  const { data: publicProblems, isLoading: isLoadingPublic } = useGetProblemListPublicQuery({ 
    page, 
    pageSize: 6,
    search: debouncedSearch || undefined,
    difficulty: difficultyFilter || undefined
  }, { skip: activeSource !== "public" });

  const { data: bankProblems, isLoading: isLoadingBank } = useGetProblemBankListQuery({ 
    page, 
    pageSize: 6,
    search: debouncedSearch || undefined,
    difficulty: difficultyFilter || undefined
  }, { skip: activeSource !== "bank" });
  
  const currentProblems = useMemo(() => {
    return activeSource === "public" ? publicProblems?.data || [] : bankProblems?.data || [];
  }, [activeSource, publicProblems, bankProblems]);

  const totalPages = useMemo(() => {
    return activeSource === "public" 
      ? publicProblems?.pagination?.totalPages || 1 
      : bankProblems?.pagination?.totalPages || 1;
  }, [activeSource, publicProblems, bankProblems]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = t("contest.titleRequired") || "Contest title is required";
    if (!startAt) newErrors.startAt = t("contest.startAtRequired") || "Start time is required";
    if (!endAt) newErrors.endAt = t("contest.endAtRequired") || "End time is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error(t("common.fixErrors") || "Please fix the errors in the form!");
      return;
    }

    try {
      const body: CreateClassContestRequest = {
        title: title.trim(),
        slug: slug.trim() || null,
        descriptionMd: descriptionMd.trim() || null,
        rules: rules.trim() || null,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        freezeAt: freezeAt ? new Date(freezeAt).toISOString() : null,
        problems: selectedProblems.map((p, index) => ({
          ...p,
          ordinal: index,
        })),
        slotNo: slotNo,
        slotTitle: slotTitle.trim() || null,
      };
      console.log(body);
      
   const res =   await createContest({ classSemesterId, body }).unwrap();
      console.log(res);
      toast.success(t("contest.createSuccess") || "Class contest created successfully!");
      onCreated?.();
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || t("contest.createFailed") || "Failed to create contest");
    }
  };

  const handleSelectionChange = (keys: Selection) => {
    const selectedIds = Array.from(keys) as string[];
    
    // Merge existing selected with new ones, preserving points/alias
    setSelectedProblems(prev => {
      const updated = [...prev];
      
      // Add new ones
      selectedIds.forEach(id => {
        if (!updated.find(p => p.problemId === id)) {
          updated.push({
            problemId: id,
            ordinal: updated.length,
            points: 100,
            alias: "",
          });
        }
      });
      
      // Remove ones not in selectedIds (if they are from the current source)
      // Actually, better to just let users remove manually to avoid accidental loss
      return updated;
    });
  };

  const updateProblem = (problemId: string, fields: Partial<CreateClassContestProblemItem>) => {
    setSelectedProblems((prev) =>
      prev.map((p) => (p.problemId === problemId ? { ...p, ...fields } : p))
    );
  };

  const removeProblem = (problemId: string) => {
    setSelectedProblems(prev => prev.filter(p => p.problemId !== problemId));
  };

  return (
    <div className="w-[1100px] max-w-[95vw] h-[85vh] overflow-hidden rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col m-auto">
      {/* Premium Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🏆
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">
                {t("contest.createClassContest") || "Create Class Contest"}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-blue-100 font-medium text-sm">
                <span className="flex items-center gap-1.5"><Layout size={14} /> Class Semester View</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span className="flex items-center gap-1.5"><Settings size={14} /> Contest Configuration</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">Selected Problems</span>
                <span className="text-white text-2xl font-black tabular-nums">{selectedProblems.length}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Contest Settings */}
        <div className="w-[380px] border-r border-slate-100 dark:border-white/5 overflow-y-auto p-6 space-y-8 bg-slate-50/50 dark:bg-slate-900/20 custom-scrollbar">
          
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Trophy size={14} className="text-blue-500" /> Basic Information
            </h3>
            <div className="space-y-4">
              <Input
                label="Contest Title"
                placeholder="e.g., Midterm Competitive Programming"
                value={title}
                onValueChange={setTitle}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                variant="faded"
                classNames={{ label: "font-bold", input: "font-semibold" }}
              />
              <Input
                label="Slug (optional)"
                placeholder="midterm-2024"
                value={slug}
                onValueChange={setSlug}
                variant="faded"
                startContent={<Globe size={16} className="text-slate-400" />}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-amber-500" /> Timing & Deadlines
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                type="datetime-local"
                label="Start Time"
                value={startAt}
                onValueChange={setStartAt}
                isInvalid={!!errors.startAt}
                errorMessage={errors.startAt}
                variant="faded"
                startContent={<Calendar size={16} className="text-slate-400" />}
              />
              <Input
                type="datetime-local"
                label="End Time"
                value={endAt}
                onValueChange={setEndAt}
                isInvalid={!!errors.endAt}
                errorMessage={errors.endAt}
                variant="faded"
                startContent={<Calendar size={16} className="text-slate-400" />}
              />
              <Input
                type="datetime-local"
                label="Scoreboard Freeze Time (optional)"
                value={freezeAt}
                onValueChange={setFreezeAt}
                startContent={<Calendar size={16} className="text-slate-400" />}
                variant="faded"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Settings size={14} className="text-indigo-500" /> Slot Mapping
            </h3>
            <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 shadow-sm">
              <CardBody className="p-4 space-y-4">
                <p className="text-[11px] text-slate-500 font-medium">Automatically create an exam slot for this contest in the curriculum.</p>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    label="No."
                    placeholder="1"
                    value={slotNo?.toString() || ""}
                    onValueChange={(v) => setSlotNo(v ? Number(v) : null)}
                    variant="bordered"
                    size="sm"
                  />
                  <div className="col-span-2">
                    <Input
                      label="Slot Title"
                      placeholder="Exam Title"
                      value={slotTitle}
                      onValueChange={setSlotTitle}
                      variant="bordered"
                      size="sm"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-500" /> Content
            </h3>
            <Textarea
              label="Description / Instructions"
              placeholder="Provide context for the students..."
              value={descriptionMd}
              onValueChange={setDescriptionMd}
              variant="faded"
              minRows={3}
            />
            <Textarea
              label="Contest Rules"
              placeholder="e.g. No collaboration, Penalty rules..."
              value={rules}
              onValueChange={setRules}
              variant="faded"
              minRows={2}
            />
          </section>
        </div>

        {/* Right Area: Problem Picker & Selected List */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0f172a]">
          <Tabs 
            aria-label="Problem Source" 
            className="px-6 pt-4"
            variant="underlined"
            color="primary"
            selectedKey={activeSource}
            onSelectionChange={(k) => setActiveSource(k as any)}
            classNames={{
                tabList: "gap-6",
                cursor: "w-full bg-blue-600",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-blue-600 font-black uppercase tracking-widest text-[11px]"
            }}
          >
            <Tab 
                key="public" 
                title={<div className="flex items-center gap-2"><Globe size={16} /> Public Library</div>} 
            />
            <Tab 
                key="bank" 
                title={<div className="flex items-center gap-2"><Database size={16} /> Problem Bank</div>} 
            />
          </Tabs>

          <div className="p-6 flex-1 flex flex-col gap-6 overflow-hidden">
            {/* Search and Filter */}
            <div className="flex gap-3">
              <Input
                placeholder={`Search in ${activeSource === "public" ? "Library" : "Bank"}...`}
                value={search}
                onValueChange={setSearch}
                startContent={<Search size={18} className="text-slate-400" />}
                variant="bordered"
                className="flex-1"
                isClearable
              />
              <Select
                placeholder="Difficulty"
                selectedKeys={difficultyFilter ? [difficultyFilter] : []}
                onSelectionChange={(keys) => setDifficultyFilter(Array.from(keys)[0] as string || null)}
                variant="bordered"
                className="w-40"
              >
                <SelectItem key="easy" className="text-emerald-600 font-bold">Easy</SelectItem>
                <SelectItem key="medium" className="text-amber-600 font-bold">Medium</SelectItem>
                <SelectItem key="hard" className="text-rose-600 font-bold">Hard</SelectItem>
              </Select>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden min-w-0">
              {/* Problem List */}
              <div className="flex flex-col border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50/30 dark:bg-slate-900/20">
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                  {isLoadingPublic || isLoadingBank ? (
                    <div className="h-full flex items-center justify-center flex-col gap-4">
                        <Spinner color="primary" />
                        <span className="text-xs font-bold text-slate-400 uppercase animate-pulse">Scanning Archive...</span>
                    </div>
                  ) : currentProblems.length === 0 ? (
                    <div className="h-full flex items-center justify-center flex-col text-slate-400 p-10 text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="font-bold uppercase text-xs">No matching problems found</p>
                        <p className="text-[10px] mt-1">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <Listbox
                      selectionMode="multiple"
                      selectedKeys={new Set(selectedProblems.map(p => p.problemId))}
                      onSelectionChange={handleSelectionChange}
                      className="gap-2"
                    >
                      {currentProblems.map((prob: any) => (
                        <ListboxItem 
                            key={prob.id} 
                            textValue={prob.title}
                            className="p-3 border border-transparent data-[hover=true]:border-blue-200 dark:data-[hover=true]:border-blue-500/30 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-500/10 rounded-xl transition-all"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-sm text-slate-700 dark:text-slate-200 truncate">{prob.title}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Chip size="sm" variant="flat" className={`h-4 text-[9px] font-black uppercase ${
                                    prob.difficulty?.toLowerCase() === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                                    prob.difficulty?.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-rose-100 text-rose-700'
                                }`}>
                                  {prob.difficulty}
                                </Chip>
                                <span className="text-[10px] text-slate-400 font-bold">#{prob.slug?.slice(0, 8)}</span>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-200 group-data-[selected=true]:border-blue-500 group-data-[selected=true]:text-blue-500 transition-colors">
                                <CheckCircle2 size={20} />
                            </div>
                          </div>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/40 flex justify-center">
                  <Pagination total={totalPages} page={page} onChange={setPage} size="sm" color="primary" isCompact showControls />
                </div>
              </div>

              {/* Selected List with Configuration */}
              <div className="flex flex-col gap-3 overflow-hidden min-w-0">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contest Payload</span>
                    <Button size="sm" variant="light" color="danger" className="text-[10px] font-black h-6 min-w-0 px-2" onPress={() => setSelectedProblems([])}>CLEAR ALL</Button>
                 </div>
                 <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-2 custom-scrollbar">
                    {selectedProblems.map((p, idx) => {
                      // Note: We might not have the full prob data if it was from a previous page or different source
                      // We could store the titles too, but for now we display what we can
                      return (
                        <Card key={p.problemId} className="border border-slate-100 dark:border-white/10 shadow-sm overflow-visible bg-white dark:bg-slate-900 group">
                          <CardBody className="p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center text-xs font-black italic">
                                  {idx + 1}
                                </div>
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                                    Problem ID: {p.problemId.slice(0, 8)}...
                                </span>
                              </div>
                              <Button isIconOnly size="sm" color="danger" variant="light" className="opacity-0 group-hover:opacity-100 transition-opacity" onPress={() => removeProblem(p.problemId)}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                size="sm"
                                label="Allocated Points"
                                type="number"
                                value={p.points?.toString()}
                                onValueChange={(v) => updateProblem(p.problemId, { points: Number(v) })}
                                variant="bordered"
                                classNames={{ input: "font-bold text-blue-600 tabular-nums" }}
                              />
                              <Input
                                size="sm"
                                label="Problem Alias"
                                placeholder="e.g. Problem A"
                                value={p.alias || ""}
                                onValueChange={(v) => updateProblem(p.problemId, { alias: v })}
                                variant="bordered"
                              />
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })}
                    {selectedProblems.length === 0 && (
                      <div className="h-full min-h-[200px] flex items-center justify-center flex-col text-slate-300 italic text-sm border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl p-10 text-center">
                        <Database size={40} className="mb-4 opacity-20" />
                        <p className="font-bold uppercase text-[10px] tracking-widest">No problems staged</p>
                        <p className="text-[10px] mt-2 opacity-60">Select problems from the library to build your contest</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <div className="px-8 py-5 flex justify-between items-center bg-slate-50 dark:bg-[#0b1120] border-t border-slate-100 dark:border-white/5 relative z-20">
        <div className="flex items-center gap-6">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Points</span>
                <span className="text-xl font-black text-slate-800 dark:text-white tabular-nums">
                    {selectedProblems.reduce((sum, p) => sum + (p.points || 0), 0)}
                </span>
            </div>
            <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Duration</span>
                <span className="text-slate-600 dark:text-slate-300 font-bold text-sm">
                   {startAt && endAt ? `${Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60000)} min` : "N/A"}
                </span>
            </div>
        </div>
        
        <div className="flex gap-4">
            <Button 
                variant="flat" 
                onPress={closeModal}
                className="px-6 font-bold uppercase tracking-widest text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
                {t("common.cancel") || "Dismiss"}
            </Button>
            <Button
                isLoading={isCreating}
                color="primary"
                onPress={onSubmit}
                className="px-10 font-black uppercase tracking-widest text-[11px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-95"
            >
                {t("contest.createContest") || "Deploy Contest"}
            </Button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
