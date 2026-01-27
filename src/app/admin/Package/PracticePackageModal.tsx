"use client";

import { PracticePackage } from "@/types";
import { Input, Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

export default function StudyPackageModal({
  initialData,
  onClose,
  onCreate,
}: {
  initialData?: PracticePackage;
  onClose: () => void;
  onCreate: (pkg: PracticePackage) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    level: "BEGINNER" as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    image: "" as string,
  });

  useEffect(() => {
    if (!initialData) return;

    setForm({
      name: initialData.name,
      description: initialData.description ?? "",
      level: initialData.level,
      image: initialData.image || "",
    });
  }, [initialData]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: preview }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-[440px] rounded-2xl bg-white dark:bg-[#0B0F1A] p-6 space-y-5">
        <h2 className="text-lg font-black uppercase">
          {initialData ? "Edit Practice Package" : "Create Practice Package"}
        </h2>

        {/* IMAGE UPLOAD */}
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="relative h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20
                     flex items-center justify-center cursor-pointer
                     hover:border-[#FF5C00] transition"
        >
          {form.image ? (
            <img
              src={form.image}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
              <ImagePlus size={28} />
              <span>Click or drag image here</span>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* NAME */}
        <Input
          label="Package Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* DESCRIPTION */}
        <Input
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* LEVEL */}
        <select
          className="w-full rounded-xl p-3 bg-slate-100 dark:bg-white/5 text-sm"
          value={form.level}
          onChange={(e) =>
            setForm({
              ...form,
              level: e.target.value as
                | "BEGINNER"
                | "INTERMEDIATE"
                | "ADVANCED",
            })
          }
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-[#FF5C00] text-white font-black"
            onPress={() => {
              onCreate({
                id: initialData?.id ?? crypto.randomUUID(),
                name: form.name,
                description: form.description,
                level: form.level,
                image: form.image,
                published: false,
                disabled: false,
                createdAt:
                  initialData?.createdAt ??
                  new Date().toISOString(),
              });
              onClose();
            }}
          >
            {initialData ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
