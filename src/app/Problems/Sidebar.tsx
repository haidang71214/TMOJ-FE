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

  // Hook điều khiển trạng thái đóng/mở Modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Danh sách My Lists mẫu (có thể lấy từ API sau này)
  const myLists = [
    { id: "Favorite", title: "Favorite", isPrivate: true, icon: "Heart" },
    { id: "HocDoi", title: "HocDoi", isPrivate: false, icon: "Notebook" },
  ];

  return (
    <div className="w-[200px] flex flex-col gap-6 shrink-0 font-sans">
      {/* 1. Navigation Section */}
      <Listbox
        aria-label="Navigation"
        onAction={(key) => router.push(`/Problems/${String(key)}`
      )}
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

      {/* 2. My Lists Section */}
      <div>
        <div className="flex justify-between items-center px-2 mb-2 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
          <span>My Lists</span>

          {/* Dropdown Menu khi bấm dấu + */}
          <Dropdown
            placement="bottom-start"
            classNames={{ content: "min-w-[150px]" }}
          >
            <DropdownTrigger>
              <Plus
                size={14}
                className="cursor-pointer hover:text-black transition-colors"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Create List Actions"
              onAction={(key) => {
                if (key === "new-list") onOpen(); // Mở Modal khi chọn New List
              }}
            >
              <DropdownItem key="new-list" startContent={<Plus size={16} />}>
                New List
              </DropdownItem>
              <DropdownItem
                key="new-smart-list"
                startContent={
                  <Sparkles size={16} className="text-purple-500" />
                }
                className="text-purple-500"
              >
                New Smart List...
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
                  <Lock size={14} className="text-gray-300" />
                ) : (
                  <Globe size={14} className="text-gray-300" />
                )
              }
              className={`h-10 px-2 transition-colors ${
                pathname.includes(list.id)
                  ? "bg-gray-100 font-bold text-black"
                  : "text-gray-600"
              }`}
            >
              {list.title}
            </ListboxItem>
          ))}
        </Listbox>
      </div>

      {/* 3. Modal tạo danh sách mới */}
      <CreateListModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
