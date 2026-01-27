"use client";

import { useState } from "react";
import { Button, Chip, Image } from "@heroui/react";
import {
  Plus,
  EyeOff,
  Upload,
  Trash2,
  Pencil,
} from "lucide-react";
import PracticePackageModal from "./PracticePackageModal";
import { PracticePackage } from "@/types";
const MOCK_PACKAGES: PracticePackage[] = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    description: "Core JS, variables, loops, functions",
    level: "BEGINNER",
    published: true,
    disabled: false,
    image:"https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    name: "React Mastery",
    description: "Hooks, state, performance & patterns",
    level: "INTERMEDIATE",
    published: false,
    disabled: false,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    createdAt: "2025-12-10",
  },
  {
    id: "3",
    name: "System Design Interview",
    description: "Scalable backend & architecture",
    level: "ADVANCED",
    published: true,
    disabled: true,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    createdAt: "2025-12-20",
  },
];

export default function PracticePackagePage() {
  const [packages, setPackages] =useState<PracticePackage[]>(MOCK_PACKAGES);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] =
    useState<PracticePackage | null>(null);

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

        <Button
          className="bg-[#FF5C00] text-white font-black"
          startContent={<Plus size={16} />}
          onPress={() => setOpen(true)}
        >
          Create Package
        </Button>
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
              <div className="flex justify-between">
                <div>
                  <h3 className="font-black">{pkg.name}</h3>
                  <p className="text-xs text-slate-500">
                    {pkg.description}
                  </p>
                </div>

                <Chip
                  size="sm"
                  className={`text-[9px] font-black
                    ${pkg.published
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-yellow-500/15 text-yellow-400"}`}
                >
                  {pkg.published ? "PUBLISHED" : "DRAFT"}
                </Chip>
              </div>

              <div className="flex gap-2 text-xs">
                <Chip>{pkg.level}</Chip>
                {pkg.disabled && (
                  <Chip className="bg-red-500/15 text-red-400">
                    DISABLED
                  </Chip>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 pt-2">
                {/* EDIT */}
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => setEditing(pkg)}
                >
                  <Pencil size={16} />
                </Button>

                {/* PUBLISH */}
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() =>
                    setPackages((prev) =>
                      prev.map((p) =>
                        p.id === pkg.id
                          ? { ...p, published: true }
                          : p
                      )
                    )
                  }
                >
                  <Upload size={16} />
                </Button>

                {/* DISABLE */}
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() =>
                    setPackages((prev) =>
                      prev.map((p) =>
                        p.id === pkg.id
                          ? { ...p, disabled: !p.disabled }
                          : p
                      )
                    )
                  }
                >
                  <EyeOff size={16} />
                </Button>

                {/* DELETE */}
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  onPress={() =>
                    setPackages((prev) =>
                      prev.filter((p) => p.id !== pkg.id)
                    )
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE */}
      {open && (
        <PracticePackageModal
          onClose={() => setOpen(false)}
          onCreate={(pkg) =>
            setPackages((prev) => [...prev, pkg])
          }
        />
      )}

      {/* EDIT */}
      {editing && (
        <PracticePackageModal
          initialData={editing}
          onClose={() => setEditing(null)}
          onCreate={(updated) =>
            setPackages((prev) =>
              prev.map((p) =>
                p.id === editing.id
                  ? { ...p, ...updated }
                  : p
              )
            )
          }
        />
      )}
    </div>
  );
}
