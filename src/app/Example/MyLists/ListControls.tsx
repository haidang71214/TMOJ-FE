"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Checkbox,
} from "@heroui/react";
import {
  Search,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Plus,
  ChevronDown,
} from "lucide-react";

export function ListControls() {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Search Input */}
      <Input
        size="sm"
        placeholder="SEARCH QUESTIONS..."
        startContent={
          <Search size={18} className="text-slate-400" strokeWidth={2.5} />
        }
        className="max-w-[240px]"
        classNames={{
          inputWrapper:
            "bg-white dark:bg-[#1C2737] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-600 dark:hover:border-[#00FF41] group-data-[focus=true]:border-blue-600 dark:group-data-[focus=true]:border-[#00FF41] transition-all",
          input:
            "text-[11px] font-black uppercase tracking-wider text-[#071739] dark:text-white placeholder:text-slate-400 italic",
        }}
        variant="flat"
      />

      {/* Sort Dropdown */}
      <Dropdown
        classNames={{
          content:
            "bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl min-w-[180px]",
        }}
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#00FF41] shadow-sm transition-all"
          >
            <ArrowUpDown size={18} strokeWidth={2.5} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Sort options"
          itemClasses={{
            base: "rounded-xl data-[hover=true]:bg-blue-50 dark:data-[hover=true]:bg-white/5 data-[hover=true]:text-blue-600 dark:data-[hover=true]:text-[#00FF41]",
            title: "text-[11px] font-black uppercase tracking-widest",
          }}
        >
          <DropdownItem key="custom">Custom</DropdownItem>
          <DropdownItem key="difficulty">Difficulty</DropdownItem>
          <DropdownItem key="acceptance">Acceptance</DropdownItem>
          <DropdownItem key="id">Question ID</DropdownItem>
          <DropdownItem key="time">Last Submitted</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Filter Dropdown */}
      <Dropdown
        classNames={{
          content:
            "bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl w-[400px] p-0 overflow-hidden",
        }}
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#00FF41] shadow-sm transition-all"
          >
            <Filter size={18} strokeWidth={2.5} />
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Filter"
          className="p-0"
          itemClasses={{ base: "p-0 data-[hover=true]:bg-transparent" }}
        >
          <DropdownItem
            key="filter-panel"
            isReadOnly
            className="p-0 cursor-default"
          >
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#071739] dark:text-white italic">
                    FILTER ENGINE
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5">
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    Match:
                  </span>
                  <select className="bg-transparent text-[10px] font-black text-[#071739] dark:text-white hover:text-blue-600 dark:hover:text-[#00FF41] outline-none cursor-pointer uppercase transition-colors">
                    <option className="bg-white dark:bg-[#1C2737] text-[#071739] dark:text-white">
                      All
                    </option>
                    <option className="bg-white dark:bg-[#1C2737] text-[#071739] dark:text-white">
                      Any
                    </option>
                  </select>
                </div>
              </div>

              {/* Filter Rows */}
              <div className="space-y-5">
                {[{ label: "STATUS" }, { label: "DIFFICULTY" }].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-4 group/row"
                  >
                    <Checkbox
                      size="sm"
                      classNames={{
                        wrapper:
                          "rounded-md before:border-slate-300 dark:before:border-white/10 after:bg-blue-600 dark:after:bg-[#00FF41]",
                      }}
                    />
                    <span className="w-20 text-[10px] font-black text-slate-400 group-hover/row:text-blue-600 dark:group-hover/row:text-[#00FF41] transition-colors tracking-widest uppercase">
                      {f.label}
                    </span>

                    <div className="relative">
                      <select className="appearance-none border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 pr-8 text-[10px] font-black bg-slate-50 dark:bg-white/5 text-[#071739] dark:text-white outline-none hover:border-blue-600 dark:hover:border-[#00FF41] hover:text-blue-600 dark:hover:text-[#00FF41] transition-all cursor-pointer uppercase min-w-[70px]">
                        <option className="bg-white dark:bg-[#1C2737] text-[#071739] dark:text-white">
                          IS
                        </option>
                        <option className="bg-white dark:bg-[#1C2737] text-[#071739] dark:text-white">
                          NOT
                        </option>
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                      />
                    </div>

                    <Input
                      size="sm"
                      variant="bordered"
                      className="flex-1"
                      classNames={{
                        inputWrapper:
                          "rounded-xl border-slate-200 dark:border-white/10 h-10 hover:border-blue-600 dark:hover:border-[#00FF41] group-data-[focus=true]:border-blue-600 dark:group-data-[focus=true]:border-[#00FF41]",
                        input:
                          "text-[11px] font-bold text-[#071739] dark:text-white",
                      }}
                    />
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Plus size={16} strokeWidth={3} />}
                  className="bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-xl text-slate-500 hover:bg-blue-600 dark:hover:bg-[#00FF41] hover:text-white transition-all w-full mt-2"
                >
                  Add condition
                </Button>
              </div>

              {/* Reset Footer */}
              <div className="flex items-center justify-center pt-6 border-t border-slate-100 dark:border-white/5">
                <Button
                  size="sm"
                  variant="light"
                  startContent={<RotateCcw size={14} strokeWidth={3} />}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 dark:hover:text-[#00FF41] transition-colors"
                >
                  Reset all filters
                </Button>
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
