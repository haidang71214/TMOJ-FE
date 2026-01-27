"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Button, Chip, Select, SelectItem } from "@heroui/react";
import { ImagePlus, Coins, Search, X } from "lucide-react";
import { PracticePackage, Problem } from "@/types";

// Mock problems để chọn
const AVAILABLE_PROBLEMS: Problem[] = [
  { id: "prob1", title: "Two Sum", difficulty: "easy", points: 100 },
  { id: "prob2", title: "Longest Substring Without Repeating Characters", difficulty: "medium", points: 200 },
  { id: "prob3", title: "Median of Two Sorted Arrays", difficulty: "hard", points: 400 },
  { id: "prob4", title: "Regular Expression Matching", difficulty: "hard", points: 500 },
  { id: "prob5", title: "Container With Most Water", difficulty: "medium", points: 150 },
];

export default function StudyPackageModal({
  initialData,
  onClose,
  onCreate,
}: {
  initialData?: PracticePackage;
  onClose: () => void;
  onCreate: (pkg: PracticePackage & { problems: string[] }) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    level: "BEGINNER" as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    image: "",
    problems: [] as string[], // list problem id
  });

  const [searchProblem, setSearchProblem] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      name: initialData.name || "",
      description: initialData.description ?? "",
      price: initialData.price?.toString() ?? "",
      level: initialData.level || "BEGINNER",
      image: initialData.image || "",
      problems: initialData.problems || [],
    });

    if (initialData.problems?.length) {
      const selected = AVAILABLE_PROBLEMS.filter(p => initialData.problems?.includes(p.id));
      setSelectedProblems(selected);
    }
  }, [initialData]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, image: preview }));
  };

  const filteredProblems = AVAILABLE_PROBLEMS.filter(p =>
    p.title.toLowerCase().includes(searchProblem.toLowerCase())
  );

  const addProblem = (prob: Problem) => {
    if (selectedProblems.find(p => p.id === prob.id)) return;
    setSelectedProblems(prev => [...prev, prob]);
    setForm(prev => ({ ...prev, problems: [...prev.problems, prob.id] }));
    setSearchProblem("");
  };

  const removeProblem = (id: string) => {
    setSelectedProblems(prev => prev.filter(p => p.id !== id));
    setForm(prev => ({ ...prev, problems: prev.problems.filter(pid => pid !== id) }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Tên package không được để trống");

    const priceNum = form.price.trim() ? Number(form.price) : undefined;
    if (form.price.trim() && (isNaN(priceNum!) || priceNum! < 0)) {
      return alert("Giá phải là số hợp lệ");
    }

    onCreate({
      id: initialData?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      level: form.level,
      price: 0,
      image: form.image || "",
      problems: form.problems,
      published: initialData?.published ?? false,
      disabled: initialData?.disabled ?? false,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0B0F1A] p-6 space-y-5">
        <h2 className="text-xl font-black uppercase">
          {initialData ? "Edit" : "Create"} Study Package
        </h2>

        {/* IMAGE */}
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
          className="relative h-48 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center cursor-pointer hover:border-[#FF5C00] transition"
        >
          {form.image ? (
            <img src={form.image} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <ImagePlus size={36} />
              <span>Click or drag image here</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>

        <Input label="Package Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        {/* LEVEL - Sửa bằng Select */}
        <Select
          label="Level"
          selectedKeys={[form.level]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
            setForm({ ...form, level: value });
          }}
          classNames={{
            trigger: "rounded-xl h-12 border-2 border-transparent focus-within:border-[#FF5C00] bg-slate-100 dark:bg-white/5",
            value: "text-black dark:text-white font-medium",
            label: "text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400",
            popoverContent: "z-[9999] !bg-white dark:!bg-[#0B0F1A] shadow-xl", // Đảm bảo dropdown không bị che
          }}
        >
          <SelectItem key="BEGINNER">Beginner</SelectItem>
          <SelectItem key="INTERMEDIATE">Intermediate</SelectItem>
          <SelectItem key="ADVANCED">Advanced</SelectItem>
        </Select>

        {/* PRICE */}
        <Input
          label="Price (coins)"
          type="number"
          placeholder="Leave blank = Free"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          min={0}
          startContent={<Coins size={16} className="text-yellow-500" />}
          endContent={<span className="text-slate-500">coins</span>}
          errorMessage={form.price && isNaN(Number(form.price)) ? "Must be a valid number" : undefined}
        />

        {/* ADD PROBLEMS */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-slate-400" />
            <Input
              placeholder="Search problems to add..."
              value={searchProblem}
              onChange={(e) => setSearchProblem(e.target.value)}
              className="flex-1"
            />
          </div>

          {searchProblem && filteredProblems.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-black/20 z-50">
              {filteredProblems
                .filter(p => !selectedProblems.find(sp => sp.id === p.id))
                .map((prob) => (
                  <div
                    key={prob.id}
                    className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer flex justify-between items-center"
                    onClick={() => addProblem(prob)}
                  >
                    <div>
                      <div className="font-medium">{prob.title}</div>
                      <div className="text-xs text-slate-500">
                        {prob.difficulty} • {prob.points} pts
                      </div>
                    </div>
                    <Button size="sm" color="primary" variant="light">
                      Add
                    </Button>
                  </div>
                ))}
            </div>
          )}

          {/* SELECTED PROBLEMS */}
          <div className="space-y-2">
            <p className="text-sm font-black uppercase text-slate-500">Selected Problems ({selectedProblems.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedProblems.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No problems added yet</p>
              ) : (
                selectedProblems.map((prob) => (
                  <Chip
                    key={prob.id}
                    variant="flat"
                    color="primary"
                    endContent={<X size={14} className="cursor-pointer" onClick={() => removeProblem(prob.id)} />}
                  >
                    {prob.title}
                  </Chip>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#FF5C00] text-white font-black"
            onPress={handleSubmit}
            isDisabled={!form.name.trim()}
          >
            {initialData ? "Save Changes" : "Create Package"}
          </Button>
        </div>
      </div>
    </div>
  );
}