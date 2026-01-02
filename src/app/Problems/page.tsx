"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Card,
  CardBody,
  Badge,
  Progress,
} from "@heroui/react";
import {
  Search,
  Filter,
  ChevronDown,
  Lock,
  Play,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const companies = [
    { name: "Meta", count: 1352 },
    { name: "Amazon", count: 1903 },
    { name: "Bloomberg", count: 1150 },
    { name: "Microsoft", count: 1327 },
  ];

  return (
    <div className="w-full md:w-[300px] flex flex-col gap-5 shrink-0">
      <Card shadow="sm" className="border-none bg-white">
        <CardBody className="p-4">
          <div className="flex justify-between items-center mb-4 text-sm font-bold">
            <span>December</span>
            <div className="flex gap-1">
              <Button isIconOnly size="sm" variant="light">
                <ChevronLeft size={16} />
              </Button>
              <Button isIconOnly size="sm" variant="light">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="text-gray-400 font-medium">
                {d}
              </div>
            ))}
            <div className="h-6"></div>
            {days.map((day) => (
              <div
                key={day}
                className={`h-7 w-7 flex items-center justify-center rounded-full text-[11px] cursor-pointer ${
                  day === 17
                    ? "bg-green-500 text-white font-bold"
                    : "hover:bg-gray-100"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
              <Flame size={14} fill="currentColor" /> 0
            </div>
            <button className="text-[11px] text-green-600 font-medium hover:underline">
              Redeem
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-[#fff7ed] border-none shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-orange-700 uppercase">
              Weekly Premium
            </span>
            <Lock size={12} className="text-orange-700" />
          </div>
          <span className="text-[10px] text-gray-400">5 days left</span>
        </div>
        <Progress size="sm" value={60} color="warning" className="mb-3" />
        <Button size="sm" className="w-full bg-orange-500 text-white font-bold">
          Unlock Now
        </Button>
      </Card>

      <Card shadow="sm" className="border-none">
        <CardBody className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">Trending Companies</h3>
          </div>
          <div className="mb-4">
            <Input
              size="sm"
              placeholder="Search for a company..."
              startContent={<Search size={14} className="text-gray-400" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {companies.map((co) => (
              <Chip
                key={co.name}
                variant="flat"
                size="sm"
                className="bg-gray-100 hover:bg-gray-200 cursor-pointer border-none py-1"
              >
                <span className="text-gray-700 font-medium">{co.name}</span>
                <span className="ml-1 text-orange-500 font-bold">
                  {co.count}
                </span>
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default function ProblemsPage() {
  const problems = [
    { id: 1, title: "Two Sum", acceptance: "56.7%", difficulty: "Easy" },
    {
      id: 2,
      title: "Add Two Numbers",
      acceptance: "47.5%",
      difficulty: "Medium",
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      acceptance: "38.0%",
      difficulty: "Medium",
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      acceptance: "45.4%",
      difficulty: "Hard",
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      acceptance: "36.9%",
      difficulty: "Medium",
    },
    {
      id: 6,
      title: "Zigzag Conversion",
      acceptance: "53.0%",
      difficulty: "Medium",
    },
  ];

  return (
    <main className="min-h-screen bg-[#CDD5DB]">
      <div className="max-w-[1200px] mx-auto p-6 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Badge content="New" color="primary" size="sm" shape="rectangle">
              <Card className="bg-gray-50 h-32 w-full shadow-none border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                <CardBody className="p-4 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Quest
                  </p>
                  <p className="text-sm font-semibold leading-tight mt-1">
                    Practice Adventure
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 w-fit bg-black text-white"
                    startContent={<Play size={12} fill="white" />}
                  >
                    Begin
                  </Button>
                </CardBody>
              </Card>
            </Badge>
          </div>

          <div className="flex items-center gap-6 py-2 overflow-x-auto border-b border-gray-100 no-scrollbar">
            {[
              "All Topics",
              "Algorithms",
              "Database",
              "Shell",
              "Concurrency",
            ].map((t, i) => (
              <span
                key={t}
                className={`text-sm cursor-pointer whitespace-nowrap pb-2 ${
                  i === 0
                    ? "font-bold border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {t}
              </span>
            ))}
            <span className="text-sm text-gray-400 ml-auto flex items-center gap-1 cursor-pointer">
              Expand <ChevronDown size={14} />
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <Input
              placeholder="Search questions"
              startContent={<Search size={18} className="text-gray-400" />}
              className="max-w-xs"
              variant="flat"
            />
            <Button isIconOnly variant="flat" className="bg-gray-100">
              <Filter size={18} />
            </Button>
          </div>

          <Table aria-label="Problems table" removeWrapper className="mt-2">
            <TableHeader>
              <TableColumn className="bg-transparent border-b uppercase text-xs">
                Title
              </TableColumn>
              <TableColumn className="bg-transparent border-b text-center uppercase text-xs">
                Acceptance
              </TableColumn>
              <TableColumn className="bg-transparent border-b text-center uppercase text-xs">
                Difficulty
              </TableColumn>
            </TableHeader>
            <TableBody>
              {problems.map((p) => (
                <TableRow
                  key={p.id}
                  className="hover:bg-blue-50/50 cursor-pointer border-b border-gray-50 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-900">
                    {p.id}. {p.title}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {p.acceptance}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-sm font-medium ${
                        p.difficulty === "Easy"
                          ? "text-teal-500"
                          : p.difficulty === "Medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="sticky top-6">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
