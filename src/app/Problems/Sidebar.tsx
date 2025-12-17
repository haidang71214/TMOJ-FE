"use client";
import React from "react";
import { Listbox, ListboxItem, Chip } from "@heroui/react";
import {
  BookOpen,
  LayoutGrid,
  GraduationCap,
  Heart,
  Lock,
  Plus,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function ProblemsSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-[200px] flex flex-col gap-6 shrink-0">
      <Listbox
        aria-label="Navigation"
        onAction={(key) => router.push(`/Problems/${String(key)}`)}
        className="p-0 gap-1"
      >
        <ListboxItem
          key="Library"
          startContent={<BookOpen size={20} />}
          className={`h-10 ${
            pathname.includes("Library")
              ? "bg-gray-100 font-bold text-black"
              : "text-gray-500"
          }`}
        >
          Library
        </ListboxItem>
        <ListboxItem
          key="Quest"
          startContent={<LayoutGrid size={20} />}
          endContent={
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              className="h-4 text-[9px] px-1 font-bold"
            >
              New
            </Chip>
          }
          className={`h-10 ${
            pathname.includes("Quest")
              ? "bg-gray-100 font-bold text-black"
              : "text-gray-500"
          }`}
        >
          Quest
        </ListboxItem>
        <ListboxItem
          key="StudyPlan"
          startContent={<GraduationCap size={20} />}
          className="h-10 text-gray-500"
        >
          Study Plan
        </ListboxItem>
      </Listbox>

      <div>
        <div className="flex justify-between items-center px-2 mb-2 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
          <span>My Lists</span>
          <Plus size={14} className="cursor-pointer hover:text-black" />
        </div>
        <Listbox
          onAction={(key) => router.push(`/Problems/${String(key)}`)}
          className="p-0"
        >
          <ListboxItem
            key="Favorite"
            startContent={
              <Heart size={18} className="text-orange-400 fill-orange-400" />
            }
            endContent={<Lock size={14} className="text-gray-300" />}
            className="h-10 px-2 text-gray-600"
          >
            Favorite
          </ListboxItem>
        </Listbox>
      </div>
    </div>
  );
}
