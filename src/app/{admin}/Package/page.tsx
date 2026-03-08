"use client";

import { useState } from "react";
import { Button, Chip, Image } from "@heroui/react";
import {
  EyeOff,
  Upload,
  Trash2,
  Users,
  Activity,
  Layers,
} from "lucide-react";
// import PracticePackageModal from "./PracticePackageModal";
import { PracticePackage } from "@/types";

// Thêm price vào mock (giá trị mặc định)
const MOCK_PACKAGES: PracticePackage[] = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    description: "Core JS, variables, loops, functions",
    level: "BEGINNER",
    published: true,
    disabled: false,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    createdAt: "2025-12-01",
    price: 0,
  },
  {
    id: "2",
    name: "React Mastery",
    description: "Hooks, state, performance & patterns",
    level: "INTERMEDIATE",
    published: false,
    disabled: false,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    createdAt: "2025-12-10",
    price: 350,
  },
  {
    id: "3",
    name: "System Design Interview",
    description: "Scalable backend & architecture",
    level: "ADVANCED",
    published: true,
    disabled: true,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    createdAt: "2025-12-20",
    price: 1200,
  },
  {
    id: "4",
    name: "Data Structures in Java",
    description: "Trees, Graphs, and Heaps",
    level: "INTERMEDIATE",
    published: true,
    disabled: false,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    createdAt: "2026-01-05",
    price: 500,
  },
  {
    id: "5",
    name: "Python for Data Science",
    description: "Pandas, Numpy, and Matplotlib",
    level: "BEGINNER",
    published: true,
    disabled: false,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    createdAt: "2026-02-12",
    price: 0,
  },
];

// Mock Stats Data per package
const MOCK_STATS: Record<string, { enrolled: number; completionRate: number; modules: number }> = {
  "1": { enrolled: 1240, completionRate: 68, modules: 5 },
  "2": { enrolled: 850, completionRate: 45, modules: 8 },
  "3": { enrolled: 320, completionRate: 22, modules: 12 },
  "4": { enrolled: 610, completionRate: 55, modules: 6 },
  "5": { enrolled: 2100, completionRate: 88, modules: 4 },
};

export default function PracticePackagePage() {
  const [packages, setPackages] = useState<PracticePackage[]>(MOCK_PACKAGES);
  // const [open, setOpen] = useState(false);
  // const [editing, setEditing] = useState<PracticePackage | null>(null);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase">
            Practice <span className="text-[#FF5C00]">Packages</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Learning paths & modules
          </p>
        </div>

        {/* <Button
          className="bg-[#FF5C00] text-white font-black"
          startContent={<Plus size={16} />}
          onPress={() => setOpen(true)}
        >
          Create Package
        </Button> */}
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 overflow-hidden shadow-lg"
          >
            {/* IMAGE */}
            <Image
              removeWrapper
              src={pkg.image}
              alt={pkg.name}
              className="h-40 w-full object-cover"
            />

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {pkg.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Chip
                    size="sm"
                    className={`text-[9px] font-black uppercase
                      ${pkg.published
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-yellow-500/15 text-yellow-400"}`}
                  >
                    {pkg.published ? "Published" : "Draft"}
                  </Chip>

                  <Chip
                    size="sm"
                    variant="flat"
                    color={pkg.price === 0 || pkg.price == null ? "success" : "warning"}
                  >
                    {pkg.price == null || pkg.price === 0 ? "Free" : `${pkg.price} coins`}
                  </Chip>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <Chip>{pkg.level}</Chip>
                {pkg.disabled && (
                  <Chip className="bg-red-500/15 text-red-400">
                    DISABLED
                  </Chip>
                )}
              </div>

              {/* PACKAGE STATISTICS */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-white/5">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1"><Users size={10} /> Enrolled</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white">{MOCK_STATS[pkg.id]?.enrolled || 0}</p>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-slate-100 dark:border-white/5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1"><Activity size={10} /> Comp. Rate</p>
                  <p className="text-sm font-black text-emerald-500">{MOCK_STATS[pkg.id]?.completionRate || 0}%</p>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-slate-100 dark:border-white/5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1"><Layers size={10} /> Modules</p>
                  <p className="text-sm font-black text-blue-500">{MOCK_STATS[pkg.id]?.modules || 0}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center pt-2">
                <Button 
                  size="sm" 
                  className="bg-indigo-500/10 text-indigo-500 font-bold hover:bg-indigo-500 hover:text-white transition-colors"
                  isDisabled={pkg.disabled}
                >
                  Edit Modules
                </Button>

                <div className="flex justify-end gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    title={pkg.published ? "Unpublish Package" : "Publish Package"}
                    className={pkg.published ? "bg-emerald-500/20 text-emerald-600" : "bg-slate-100 dark:bg-white/10 text-slate-400"}
                    onPress={() =>
                      setPackages((prev) =>
                        prev.map((p) =>
                          p.id === pkg.id ? { ...p, published: !p.published } : p
                        )
                      )
                    }
                  >
                    <Upload size={16} />
                  </Button>

                <Button
                  isIconOnly
                  size="sm"
                  onPress={() =>
                    setPackages((prev) =>
                      prev.map((p) =>
                        p.id === pkg.id ? { ...p, disabled: !p.disabled } : p
                      )
                    )
                  }
                >
                  <EyeOff size={16} />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  onPress={() =>
                    setPackages((prev) => prev.filter((p) => p.id !== pkg.id))
                  }
                >
                  <Trash2 size={16} />
                </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {/* {open && (
        <PracticePackageModal
          onClose={() => setOpen(false)}
          onCreate={(pkg) => setPackages((prev) => [...prev, pkg])}
        />
      )} */}

      {/* EDIT MODAL */}
      {/* {editing && (
        <PracticePackageModal
          initialData={editing}
          onClose={() => setEditing(null)}
          onCreate={(updated) =>
            setPackages((prev) =>
              prev.map((p) =>
                p.id === editing.id ? { ...p, ...updated } : p
              )
            )
          }
        />
      )} */}
    </div>
  );
}