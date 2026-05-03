"use client";

import { useState, useMemo } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import {
  Trash2,
  Users,
  Activity,
  Layers,
  Plus,
  Edit,
  Search,
  RefreshCw,
  Lock,
  BookOpen,
} from "lucide-react";
import {
  useGetStudyPlansQuery,
  useDeleteStudyPlanMutation,
} from "@/store/queries/StudyPlan";
import { StudyPlan } from "@/types";
import CreateStudyPlanModal from "@/app/Management/StudyPlan/CreateStudyPlanModal";
import EditStudyPlanModal from "./EditStudyPlanModal";
import { useDisclosure, addToast } from "@heroui/react";

export default function PracticePackagePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetStudyPlansQuery();

  const [deleteStudyPlan, { isLoading: isDeleting }] =
    useDeleteStudyPlanMutation();

  const allPlans: StudyPlan[] = apiResponse?.data || [];

  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return allPlans;
    const q = searchQuery.toLowerCase();
    return allPlans.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [allPlans, searchQuery]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa lộ trình "${title}"? Hành động này không thể hoàn tác.`))
      return;
    try {
      await deleteStudyPlan(id).unwrap();
      addToast({
        title: "Đã xóa",
        description: `Lộ trình "${title}" đã được xóa.`,
        color: "success",
      });
    } catch {
      addToast({
        title: "Lỗi",
        description: "Không thể xóa lộ trình.",
        color: "danger",
      });
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-white/40 font-semibold text-sm uppercase tracking-widest">
          Loading study plans...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400 font-black text-xl uppercase">
          Failed to load
        </p>
        <Button
          className="bg-[#3B5BFF] text-white font-bold"
          onPress={refetch}
          startContent={<RefreshCw size={16} />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Study <span style={{ color: "#3B5BFF" }}>Plans</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/35 mt-1">
            Learning paths, curriculum bundles &amp; system modules
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            className="bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            onPress={refetch}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </Button>
          <Button
            className="bg-[#FF5C00] text-white font-black uppercase text-[10px] tracking-widest"
            startContent={<Plus size={16} />}
            onPress={onOpen}
          >
            Create Study Plan
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search study plans..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-white placeholder:text-white/25 focus:outline-none focus:border-[#3B5BFF]/60 transition-colors"
        />
      </div>

      {/* SUMMARY CHIPS */}
      <div className="flex items-center gap-3 flex-wrap">
        <Chip
          size="sm"
          className="bg-white/5 text-white/50 font-bold uppercase text-[9px] border border-white/10"
        >
          {filteredPlans.length} Plans
        </Chip>
        <Chip
          size="sm"
          className="bg-emerald-500/10 text-emerald-400 font-bold uppercase text-[9px] border border-emerald-500/20"
        >
          {filteredPlans.filter((p) => !p.isPaid).length} Free
        </Chip>
        <Chip
          size="sm"
          className="bg-amber-500/10 text-amber-400 font-bold uppercase text-[9px] border border-amber-500/20"
        >
          {filteredPlans.filter((p) => p.isPaid).length} Paid
        </Chip>
        <Chip
          size="sm"
          className="bg-blue-500/10 text-blue-400 font-bold uppercase text-[9px] border border-blue-500/20"
        >
          {filteredPlans.filter((p) => p.isUnlocked).length} Unlocked
        </Chip>
      </div>

      {/* LIST */}
      {filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <BookOpen size={48} className="text-white/10" />
          <p className="text-white/30 font-semibold text-sm uppercase tracking-widest">
            {searchQuery ? "No results found" : "No study plans yet"}
          </p>
          {!searchQuery && (
            <Button
              className="bg-[#FF5C00] text-white font-black uppercase text-[10px] tracking-widest"
              startContent={<Plus size={16} />}
              onPress={onOpen}
            >
              Create first plan
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-white/[0.08] bg-[#162035] overflow-hidden shadow-2xl transition-all hover:translate-y-[-4px] cursor-pointer group"
              style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}

            >
              {/* IMAGE */}
              <div className="relative h-40 overflow-hidden bg-[#0d1525]">
                {plan.imageUrl ? (
                  <img
                    src={plan.imageUrl}
                    alt={plan.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={56} className="text-white/10" />
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-white text-black rounded-full hover:scale-110 transition-transform"
                    onPress={() => setEditingPlan(plan)}
                    onClick={(e) => e.stopPropagation()}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    className="rounded-full hover:scale-110 transition-transform"
                    isLoading={isDeleting}
                    onPress={() => handleDelete(plan.id, plan.title)}
                    onClick={(e) => e.stopPropagation()}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* Lock badge */}
                {!plan.isUnlocked && (
                  <div className="absolute top-2 left-2 z-20">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                      <Lock size={10} className="text-white/60" />
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                        Locked
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white tracking-tight truncate group-hover:text-[#3B5BFF] transition-colors">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-white/40 line-clamp-2 mt-1">
                      {plan.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                    <Chip
                      size="sm"
                      className={`text-[9px] font-black uppercase ${plan.isUnlocked
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-slate-500/15 text-slate-400"
                        }`}
                    >
                      {plan.isUnlocked ? "Unlocked" : "Locked"}
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={plan.isPaid ? "warning" : "success"}
                    >
                      {plan.isPaid ? `${plan.price} coins` : "Free"}
                    </Chip>
                  </div>
                </div>

                {/* STATISTICS */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/[0.05]">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-tighter flex items-center gap-1">
                      <Users size={10} /> Enrolled
                    </p>
                    <p className="text-sm font-black text-white mt-0.5">
                      {plan.enrollmentCount || 0}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-white/[0.05]">
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-tighter flex items-center gap-1">
                      <Activity size={10} /> Completed
                    </p>
                    <p className="text-sm font-black text-emerald-400 mt-0.5">
                      {plan.isCompleted ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-white/[0.05]">
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-tighter flex items-center gap-1">
                      <Layers size={10} /> Problems
                    </p>
                    <p className="text-sm font-black text-blue-400 mt-0.5">
                      {plan.problemCount || 0}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center pt-1">
                  <Button
                    size="sm"
                    className="bg-indigo-500/10 text-indigo-400 font-bold hover:bg-indigo-500 hover:text-white transition-colors"
                    onPress={() => setEditingPlan(plan)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      className="bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                      onPress={() => setEditingPlan(plan)}
                      onClick={(e) => e.stopPropagation()}
                      title="Edit plan"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      isLoading={isDeleting}
                      onPress={() => handleDelete(plan.id, plan.title)}
                      onClick={(e) => e.stopPropagation()}
                      title="Delete plan"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <CreateStudyPlanModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSuccess={refetch}
      />

      {/* EDIT MODAL */}
      {editingPlan && (
        <EditStudyPlanModal
          plan={editingPlan}
          isOpen={!!editingPlan}
          onOpenChange={(open) => { if (!open) setEditingPlan(null); }}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}