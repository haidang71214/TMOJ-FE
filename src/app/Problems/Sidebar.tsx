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
    { id: "Favorite", title: "Favorite", isPrivate: true, icon: "Heart" },
    { id: "HocDoi", title: "HocDoi", isPrivate: false, icon: "Notebook" },
  ];

  // Cập nhật logic: Chữ trắng mặc định, Vàng Cam khi Active
  const getItemClasses = (key: string) => {
    const isActive = pathname.includes(key);
    return `h-10 transition-all duration-200 rounded-xl px-3 ${
      isActive
        ? "bg-gray-100 dark:bg-[#333A45] font-bold text-[#071739] dark:text-[#FFB800]"
        : "text-gray-500 dark:text-white/90 hover:bg-gray-50 dark:hover:bg-[#333A45]/50 hover:text-black dark:hover:text-white"
    }`;
  };

  return (
    <div className="w-[220px] flex flex-col gap-6 shrink-0 font-sans transition-colors duration-500">
      {/* 1. Navigation Section */}
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
          Library
        </ListboxItem>
        <ListboxItem
          key="Quest"
          startContent={<LayoutGrid size={20} />}
          endContent={
            <Chip
              size="sm"
              variant="flat"
              className="h-5 text-[10px] px-1 font-bold bg-[#3F4755]/10 dark:bg-[#FFB800]/20 text-[#3F4755] dark:text-[#FFB800] border-none"
            >
              New
            </Chip>
          }
          className={getItemClasses("Quest")}
        >
          Quest
        </ListboxItem>
        <ListboxItem
          key="StudyPlan"
          startContent={<GraduationCap size={20} />}
          className={getItemClasses("StudyPlan")}
        >
          Study Plan
        </ListboxItem>
      </Listbox>

      {/* 2. My Lists Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-3 mb-1 text-gray-400 dark:text-white/40 font-black uppercase text-[10px] tracking-[0.2em]">
          <span>My Lists</span>

          <Dropdown
            placement="bottom-start"
            classNames={{
              content:
                "bg-white dark:bg-[#282E3A] border border-gray-100 dark:border-[#474F5D] rounded-2xl min-w-[180px]",
            }}
          >
            <DropdownTrigger>
              <div className="p-1 hover:bg-gray-100 dark:hover:bg-[#333A45] rounded-lg cursor-pointer transition-colors group">
                <Plus
                  size={16}
                  className="text-gray-400 group-hover:text-[#071739] dark:group-hover:text-[#FFB800]"
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Create List Actions"
              onAction={(key) => {
                if (key === "new-list") onOpen();
              }}
              className="p-2"
            >
              <DropdownItem
                key="new-list"
                startContent={<Plus size={16} />}
                className="rounded-xl dark:text-white dark:hover:bg-[#333A45]"
              >
                New List
              </DropdownItem>
              <DropdownItem
                key="new-smart-list"
                startContent={
                  <Sparkles size={16} className="text-purple-500" />
                }
                className="text-purple-500 rounded-xl dark:hover:bg-purple-500/10"
              >
                New Smart List...
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Listbox
          aria-label="My Lists"
          onAction={(key) => router.push(`/Problems/MyLists/${String(key)}`)}
          className="p-0 gap-1"
        >
          {myLists.map((list) => (
            <ListboxItem
              key={list.id}
              startContent={
                list.id === "Favorite" ? (
                  <Heart
                    size={18}
                    className="text-orange-400 fill-orange-400"
                  />
                ) : (
                  <Notebook size={18} className="text-blue-400" />
                )
              }
              endContent={
                list.isPrivate ? (
                  <Lock
                    size={14}
                    className="text-gray-300 dark:text-white/30"
                  />
                ) : (
                  <Globe
                    size={14}
                    className="text-gray-300 dark:text-white/30"
                  />
                )
              }
              className={getItemClasses(list.id)}
            >
              {list.title}
            </ListboxItem>
          ))}
        </Listbox>
      </div>

      <CreateListModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
