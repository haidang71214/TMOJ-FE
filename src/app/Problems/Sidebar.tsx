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
      icon: <Heart size={18} className="text-orange-400 fill-orange-400" />,
    },
    {
      id: "HocDoi",
      title: "HocDoi",
      isPrivate: false,
      icon: <Notebook size={18} className="text-blue-400" />,
    },
  ];

  const getItemClasses = (key: string) => {
    const isActive = pathname.includes(key);
    return `h-11 rounded-xl px-3 transition-all mb-1 ${
      isActive
        ? "bg-black dark:bg-[#FFB800] text-white dark:text-[#071739] font-black shadow-md shadow-[#FFB800]/10"
        : "text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-[#333A45]"
    }`;
  };

  return (
    <div className="w-full max-w-[240px] shrink-0 flex flex-col gap-6 transition-colors duration-500">
      {/* 1. Explorer Section */}
      <div className="flex flex-col gap-2">
        <span className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/20">
          Explorer
        </span>
        <Listbox
          aria-label="Navigation"
          onAction={(key) => router.push(`/Problems/${String(key)}`)}
          className="p-0"
        >
          <ListboxItem
            key="Library"
            startContent={<BookOpen size={18} />}
            className={getItemClasses("Library")}
          >
            <span className="text-xs font-bold uppercase tracking-wide">
              Library
            </span>
          </ListboxItem>
          <ListboxItem
            key="Quest"
            startContent={<LayoutGrid size={18} />}
            endContent={
              <Chip
                size="sm"
                className="h-4 text-[8px] font-black bg-[#FFB800] text-black border-none px-1"
              >
                NEW
              </Chip>
            }
            className={getItemClasses("Quest")}
          >
            <span className="text-xs font-bold uppercase tracking-wide">
              Quest
            </span>
          </ListboxItem>
          <ListboxItem
            key="StudyPlan"
            startContent={<GraduationCap size={18} />}
            className={getItemClasses("StudyPlan")}
          >
            <span className="text-xs font-bold uppercase tracking-wide">
              Study Plan
            </span>
          </ListboxItem>
        </Listbox>
      </div>

      {/* 2. Collections Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/20">
          <span>Collections</span>

          <Dropdown
            placement="bottom-start"
            classNames={{
              content:
                "bg-white dark:bg-[#282E3A] border-none shadow-2xl rounded-2xl min-w-[160px]",
            }}
          >
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="rounded-full w-6 h-6 min-w-0"
              >
                <Plus size={14} className="text-[#FFB800]" />
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
                startContent={<Plus size={14} />}
                className="rounded-lg text-xs font-bold"
              >
                New List
              </DropdownItem>
              <DropdownItem
                key="new-smart-list"
                startContent={<Sparkles size={14} />}
                className="text-purple-500 rounded-lg text-xs font-bold"
              >
                Smart List
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Listbox
          aria-label="My Lists"
          onAction={(key) => router.push(`/Problems/MyLists/${String(key)}`)}
          className="p-0"
        >
          {myLists.map((list) => (
            <ListboxItem
              key={list.id}
              startContent={list.icon}
              endContent={
                list.isPrivate ? (
                  <Lock size={12} className="opacity-30" />
                ) : (
                  <Globe size={12} className="opacity-30" />
                )
              }
              className={getItemClasses(list.id)}
            >
              <span className="text-xs font-bold uppercase tracking-wide truncate block">
                {list.title}
              </span>
            </ListboxItem>
          ))}
        </Listbox>
      </div>

      <CreateListModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
