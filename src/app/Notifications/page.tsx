"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  Bell,
  Trophy,
  Code2,
  Trash2,
  CheckCheck,
  Search,
  Filter,
  ChevronDown,
  BookOpen,
  Settings,
} from "lucide-react";

// Professional English Mock Data với nhiều Category hơn
const FULL_NOTIFICATIONS = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i + 1}`,
  title: [
    "Weekly Contest #12 Started",
    "New Assignment: Data Structures",
    "System Maintenance Notice",
    "Submission Accepted",
    "Class Enrollment Confirmed",
  ][i % 5],
  message:
    "Stay updated with your academic activity and platform improvements on TMOJ.",
  type: ["contest", "class", "system", "submission", "class"][i % 5],
  is_read: i > 6,
  created_at: `${i + 1} hours ago`,
}));

const getIcon = (type: string) => {
  switch (type) {
    case "contest":
      return <Trophy className="text-[#ff5c00]" />;
    case "class":
      return <BookOpen className="text-purple-500" />;
    case "system":
      return <Settings className="text-blue-500" />;
    case "submission":
      return <Code2 className="text-green-500" />;
    default:
      return <Bell className="text-slate-400" />;
  }
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filterTab, setFilterTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const rowsPerPage = 6;

  // Logic lọc kết hợp giữa Tabs và Category Dropdown
  const filteredData = useMemo(() => {
    return FULL_NOTIFICATIONS.filter((n) => {
      const matchTab =
        filterTab === "all"
          ? true
          : filterTab === "unread"
          ? !n.is_read
          : n.is_read;

      const matchCategory =
        categoryFilter === "all" ? true : n.type === categoryFilter;

      return matchTab && matchCategory;
    });
  }, [filterTab, categoryFilter]);

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, filteredData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071739] transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto p-6 md:p-12 flex flex-col gap-8 pb-20">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end border-b border-divider dark:border-white/10 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none text-[#071739] dark:text-white">
              NOTIFICATIONS<span className="text-[#ff5c00]">.</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic px-1">
              Academic Activity Hub
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="flat"
              size="sm"
              startContent={<CheckCheck size={16} />}
              className="font-black uppercase italic text-[10px] h-10 px-4 rounded-xl dark:bg-[#111c35] dark:text-white border border-divider dark:border-white/10"
            >
              Mark all
            </Button>
            <Button
              variant="flat"
              color="danger"
              size="sm"
              startContent={<Trash2 size={16} />}
              className="font-black uppercase italic text-[10px] h-10 px-4 rounded-xl dark:bg-red-500/10"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 items-center flex-wrap flex-1">
            <Input
              placeholder="Search..."
              startContent={<Search size={18} className="text-[#A4B5C4]" />}
              classNames={{
                inputWrapper:
                  "bg-white dark:bg-[#111c35] rounded-xl h-11 border border-divider dark:border-white/10 shadow-none focus-within:!border-[#ff5c00]",
                input: "dark:text-white font-bold italic",
              }}
              className="max-w-[240px]"
            />

            <Tabs
              variant="underlined"
              selectedKey={filterTab}
              onSelectionChange={(key) => {
                setFilterTab(key.toString());
                setPage(1);
              }}
              classNames={{
                tabList: "gap-6",
                cursor: "w-full bg-[#ff5c00]",
                tab: "max-w-fit px-0 h-11 font-black uppercase italic text-[11px]",
                tabContent:
                  "group-data-[selected=true]:text-[#ff5c00] dark:text-white/60",
              }}
            >
              <Tab key="all" title="All" />
              <Tab key="unread" title="Unread" />
              <Tab key="read" title="Read" />
            </Tabs>
          </div>

          {/* DROPDOWN LỌC CATEGORY */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="h-11 rounded-xl bg-white dark:bg-[#111c35] border border-divider dark:border-white/10 font-black text-[10px] uppercase italic text-[#071739] dark:text-white min-w-[140px]"
                startContent={<Filter size={16} />}
                endContent={<ChevronDown size={14} />}
              >
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filter Categories"
              className="dark:bg-[#111c35]"
              onAction={(key) => {
                setCategoryFilter(key.toString());
                setPage(1);
              }}
            >
              <DropdownItem
                key="all"
                className="font-bold uppercase italic text-[10px] dark:text-white"
              >
                All Categories
              </DropdownItem>
              <DropdownItem
                key="class"
                className="font-bold uppercase italic text-[10px] dark:text-white text-purple-500"
              >
                Class
              </DropdownItem>
              <DropdownItem
                key="contest"
                className="font-bold uppercase italic text-[10px] dark:text-white text-[#ff5c00]"
              >
                Contests
              </DropdownItem>
              <DropdownItem
                key="system"
                className="font-bold uppercase italic text-[10px] dark:text-white text-blue-500"
              >
                System
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* LIST SECTION */}
        <div className="flex flex-col gap-4">
          {items.length > 0 ? (
            items.map((n) => (
              <Card
                key={n.id}
                isPressable
                className={`border-none transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-[2rem] overflow-hidden 
                  ${
                    !n.is_read
                      ? "bg-white dark:bg-[#111c35] border-l-8 border-[#ff5c00]"
                      : "bg-slate-100/50 dark:bg-white/5 opacity-80"
                  }`}
              >
                <CardBody className="p-6 md:px-10 flex flex-row items-center gap-6 text-black dark:text-white text-left">
                  <div
                    className={`p-4 rounded-2xl shrink-0 ${
                      !n.is_read
                        ? "bg-[#ff5c00]/10"
                        : "bg-slate-200 dark:bg-white/5"
                    }`}
                  >
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`text-xl font-[1000] italic uppercase tracking-tight leading-tight ${
                          !n.is_read
                            ? "text-[#071739] dark:text-white"
                            : "text-slate-500"
                        }`}
                      >
                        {n.title}
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase italic whitespace-nowrap ml-4">
                        {n.created_at}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-bold leading-relaxed italic line-clamp-2 ${
                        !n.is_read
                          ? "text-slate-600 dark:text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      {n.message}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center font-black uppercase italic text-slate-500 opacity-50 tracking-widest">
              No results for this category
            </div>
          )}
        </div>

        {/* PAGINATION SECTION */}
        <div className="flex justify-center mt-6">
          <Pagination
            total={pages}
            page={page}
            onChange={setPage}
            showControls
            classNames={{
              cursor:
                "bg-[#071739] dark:bg-[#ff5c00] text-white font-black italic shadow-lg",
              item: "dark:text-white",
            }}
          />
        </div>
      </div>
    </div>
  );
}
