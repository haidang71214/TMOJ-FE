"use client";
import React from "react";
import {
  Listbox,
  ListboxItem,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Button,
} from "@heroui/react";
import {
  BookOpen,
  LayoutGrid,
  GraduationCap,
  Heart,
  Lock,
  Plus,
  Sparkles,
  Globe,
  Notebook,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import CreateListModal from "./MyLists/CreateListModal";

export default function ProblemsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const myLists = [
    {
      id: "Favorite",
      title: "Favorite",
      isPrivate: true,
      icon: <Heart size={20} />,
    },
    {
      id: "HocDoi",
      title: "HocDoi",
      isPrivate: false,
      icon: <Notebook size={20} />,
    },
  ];

  const getItemClasses = (key: string) => {
    const isActive = pathname.includes(key);
    return `h-12 rounded-2xl px-4 transition-all mb-1 ${
      isActive
        ? "bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black shadow-lg shadow-black/20 dark:shadow-orange-500/40"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#FF5C00] dark:hover:text-[#071739]"
    }`;
  };

  return (
    <div className="w-full max-w-[260px] shrink-0 flex flex-col gap-8 py-2">
      {/* 1. EXPLORER SECTION */}
      <div className="flex flex-col gap-3">
        <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Explorer
        </span>
        <Listbox
          aria-label="Navigation"
          onAction={(key) => router.push(`/Problems/${String(key)}`)}
          className="p-0 gap-1"
        >
          <ListboxItem
            key="Library"
            startContent={<BookOpen size={20} />}
            className={getItemClasses("Library")}
          >
            <span className="text-sm font-bold uppercase tracking-wider">
              Library
            </span>
          </ListboxItem>

          <ListboxItem
            key="Quest"
            startContent={<LayoutGrid size={20} />}
            endContent={
              <Chip
                size="sm"
                // CẬP NHẬT: Sử dụng màu solid Cam rực rỡ để không bị loãng
                className="h-5 text-[9px] font-black bg-[#FF5C00] text-white dark:bg-white dark:text-[#FF5C00] border-none px-2 shadow-sm"
              >
                NEW
              </Chip>
            }
            className={getItemClasses("Quest")}
          >
            <span className="text-sm font-bold uppercase tracking-wider">
              Quest
            </span>
          </ListboxItem>

          <ListboxItem
            key="StudyPlan"
            startContent={<GraduationCap size={20} />}
            className={getItemClasses("StudyPlan")}
          >
            <span className="text-sm font-bold uppercase tracking-wider">
              Study Plan
            </span>
          </ListboxItem>
        </Listbox>
      </div>

      {/* 2. COLLECTIONS SECTION */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <span>Collections</span>

          <Dropdown
            placement="bottom-end"
            classNames={{
              content:
                "dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-2xl rounded-2xl min-w-[160px]",
            }}
          >
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="rounded-full w-6 h-6 min-w-0 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Plus size={16} className="text-[#FF5C00]" strokeWidth={3} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Actions"
              onAction={(key) => {
                if (key === "new-list") onOpen();
              }}
              className="p-1"
            >
              <DropdownItem
                key="new-list"
                startContent={<Plus size={16} />}
                className="rounded-xl text-xs font-bold dark:text-white"
              >
                New List
              </DropdownItem>
              <DropdownItem
                key="new-smart-list"
                startContent={<Sparkles size={16} />}
                // CẬP NHẬT: Màu xanh lá neon sáng hơn cho darkmode
                className="text-blue-600 dark:text-[#00FF41] rounded-xl text-xs font-bold"
              >
                Smart List
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Listbox
          aria-label="My Lists"
          onAction={(key) => router.push(`/Problems/MyLists/${String(key)}`)}
          className="p-0 gap-1"
        >
          {myLists.map((list) => {
            const isActive = pathname.includes(list.id);
            return (
              <ListboxItem
                key={list.id}
                startContent={list.icon}
                endContent={
                  list.isPrivate ? (
                    <Lock
                      size={14}
                      className={
                        isActive
                          ? "opacity-100"
                          : "opacity-40 text-slate-400 dark:text-white"
                      }
                    />
                  ) : (
                    <Globe
                      size={14}
                      className={
                        isActive
                          ? "opacity-100"
                          : "opacity-40 text-slate-400 dark:text-white"
                      }
                    />
                  )
                }
                className={getItemClasses(list.id)}
              >
                <span className="text-sm font-bold uppercase tracking-wider truncate block">
                  {list.title}
                </span>
              </ListboxItem>
            );
          })}
        </Listbox>
      </div>

      <CreateListModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
