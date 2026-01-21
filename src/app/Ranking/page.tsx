"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Select,
  SelectItem,
  Input,
  Pagination,
  Button,
  Progress,
} from "@heroui/react";
import {
  Search,
  Trophy,
  Medal,
  Crown,
  RefreshCw,
  Users,
  BookOpen,
  ArrowUpRight,
  LayoutList,
  BarChart3,
  Timer,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const RANKING_DATA = [
  {
    rank: 1,
    name: "Van Ngoc Thang",
    id: "DE180947",
    class: "SDN302",
    solved: 125,
    points: 1250,
    accuracy: 98,
    time: 45,
  },
  {
    rank: 2,
    name: "Nguyen Duy Rim",
    id: "DE180459",
    class: "WDP301",
    solved: 118,
    points: 1180,
    accuracy: 95,
    time: 52,
  },
  {
    rank: 3,
    name: "Pham Nguyen Hai Dang",
    id: "DE170023",
    class: "SDN302",
    solved: 110,
    points: 1100,
    accuracy: 92,
    time: 48,
  },
  {
    rank: 4,
    name: "Nguyen Thanh Tuan",
    id: "DE180464",
    class: "PRF192",
    solved: 105,
    points: 1050,
    accuracy: 94,
    time: 60,
  },
  {
    rank: 5,
    name: "Nguyen Le Viet Huy",
    id: "DE170254",
    class: "SDN302",
    solved: 98,
    points: 980,
    accuracy: 89,
    time: 55,
  },
];

const CHART_DATA = [
  {
    name: "P1",
    "Van Ngoc Thang": 250,
    "Nguyen Duy Rim": 200,
    "Pham Nguyen Hai Dang": 180,
  },
  {
    name: "P2",
    "Van Ngoc Thang": 500,
    "Nguyen Duy Rim": 450,
    "Pham Nguyen Hai Dang": 400,
  },
  {
    name: "P3",
    "Van Ngoc Thang": 900,
    "Nguyen Duy Rim": 800,
    "Pham Nguyen Hai Dang": 750,
  },
  {
    name: "P4",
    "Van Ngoc Thang": 1250,
    "Nguyen Duy Rim": 1180,
    "Pham Nguyen Hai Dang": 1100,
  },
];

export default function RankingPage() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [chartType, setChartType] = useState("line");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const podium = useMemo(
    () => [RANKING_DATA[1], RANKING_DATA[0], RANKING_DATA[2]],
    []
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] transition-colors duration-500 p-4 lg:p-8 text-[#071739] dark:text-white">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#FF5C00] rounded-xl shadow-lg text-white">
              <Trophy size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-[1000] italic tracking-tighter uppercase leading-none">
              Hall of <span className="text-[#FF5C00]">Fame</span>
            </h1>
          </div>

          <div className="flex bg-white dark:bg-[#1C2737] p-1.5 rounded-2xl shadow-sm border dark:border-white/5">
            <Button
              size="sm"
              onClick={() => setViewMode("table")}
              className={`rounded-xl font-black italic text-[9px] uppercase transition-all ${
                viewMode === "table"
                  ? "bg-[#071739] text-white dark:bg-[#FF5C00]"
                  : "bg-transparent text-slate-400"
              }`}
              startContent={<LayoutList size={16} />}
            >
              Leaderboard
            </Button>
            <Button
              size="sm"
              onClick={() => setViewMode("chart")}
              className={`rounded-xl font-black italic text-[9px] uppercase transition-all ${
                viewMode === "chart"
                  ? "bg-[#071739] text-white dark:bg-[#FF5C00]"
                  : "bg-transparent text-slate-400"
              }`}
              startContent={<BarChart3 size={16} />}
            >
              Analytics
            </Button>
          </div>
        </div>

        {/* PODIUM SECTION */}
        {viewMode === "table" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-[1000px] mx-auto w-full animate-in fade-in zoom-in duration-700 mb-8 pt-10">
            {podium.map((student, index) => {
              const isFirst = index === 1;
              const isSecond = index === 0;
              const isThird = index === 2;

              // Styles cho viền nhất, nhì, ba
              const rankStyles = isFirst
                ? {
                    border: "border-amber-400",
                    shadow: "shadow-[0_0_30px_rgba(251,191,36,0.3)]",
                    badge: "bg-amber-400",
                  }
                : isSecond
                ? {
                    border: "border-slate-300",
                    shadow: "shadow-[0_0_20px_rgba(203,213,225,0.3)]",
                    badge: "bg-slate-300",
                  }
                : {
                    border: "border-orange-700",
                    shadow: "shadow-[0_0_20px_rgba(194,65,12,0.3)]",
                    badge: "bg-orange-700",
                  };

              return (
                <Card
                  key={student.rank}
                  className={`rounded-[3rem] transition-all duration-500 overflow-visible border-4 ${
                    rankStyles.border
                  } ${rankStyles.shadow} ${
                    isFirst
                      ? "bg-gradient-to-br from-[#071739] to-[#1a2a4a] text-white scale-110 z-20 h-[360px]"
                      : "bg-white dark:bg-[#1C2737] h-[280px] z-10"
                  }`}
                >
                  <CardBody className="p-6 flex flex-col items-center justify-center text-center gap-3 relative">
                    <div
                      className={`absolute -top-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 z-30 transform -translate-y-[30%] border-white ${rankStyles.badge} text-white`}
                    >
                      {isFirst ? (
                        <Crown size={24} />
                      ) : isSecond ? (
                        <Medal size={22} />
                      ) : isThird ? (
                        <Medal size={22} />
                      ) : null}
                    </div>

                    <Avatar
                      src={`https://i.pravatar.cc/150?u=${student.id}`}
                      className={`w-20 h-20 ring-4 ${
                        isFirst
                          ? "ring-amber-400/50"
                          : isSecond
                          ? "ring-slate-400/20"
                          : "ring-orange-700/20"
                      }`}
                    />

                    <div className="space-y-0.5">
                      <h3
                        className={`text-lg font-[1000] italic uppercase leading-tight ${
                          isFirst
                            ? "text-white"
                            : "text-[#071739] dark:text-white"
                        }`}
                      >
                        {student.name}
                      </h3>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-widest ${
                          isFirst ? "text-white/70" : "text-slate-400"
                        }`}
                      >
                        {student.id}
                      </p>
                    </div>

                    <div
                      className={`grid grid-cols-2 gap-3 w-full pt-4 border-t ${
                        isFirst
                          ? "border-white/20"
                          : "border-slate-100 dark:border-white/5"
                      }`}
                    >
                      <div className="text-center">
                        <p
                          className={`text-[8px] font-black uppercase italic ${
                            isFirst ? "text-[#FF5C00]" : "text-[#FF5C00]"
                          }`}
                        >
                          Solved
                        </p>
                        <p className="text-lg font-[1000] italic">
                          {student.solved}
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-[8px] font-black uppercase italic ${
                            isFirst ? "text-[#FF5C00]" : "text-[#FF5C00]"
                          }`}
                        >
                          Points
                        </p>
                        <p className="text-lg font-[1000] italic">
                          {student.points}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* FILTERS TOOLBAR */}
        <Card className="bg-white dark:bg-[#1C2737] rounded-[2rem] border-none shadow-sm">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Search name/ID..."
                startContent={<Search size={18} className="text-slate-400" />}
                classNames={{
                  inputWrapper:
                    "bg-[#F0F2F5] dark:bg-[#0A0F1C] rounded-2xl h-12 shadow-none font-bold italic",
                }}
              />
              <Select
                placeholder="Class"
                startContent={<Users size={16} />}
                classNames={{
                  trigger: "bg-[#F0F2F5] dark:bg-[#0A0F1C] rounded-2xl h-12",
                }}
              >
                <SelectItem key="sdn302">SDN302</SelectItem>
                <SelectItem key="prf192">PRF192</SelectItem>
              </Select>
              <Select
                placeholder="Semester"
                startContent={<RefreshCw size={16} />}
                classNames={{
                  trigger: "bg-[#F0F2F5] dark:bg-[#0A0F1C] rounded-2xl h-12",
                }}
              >
                <SelectItem key="sp26">SPRING 2026</SelectItem>
              </Select>
              <Select
                placeholder="Contest"
                startContent={<BookOpen size={16} />}
                classNames={{
                  trigger: "bg-[#F0F2F5] dark:bg-[#0A0F1C] rounded-2xl h-12",
                }}
              >
                <SelectItem key="all">Global Rank</SelectItem>
              </Select>
              <Button className="bg-[#FF5C00] text-white font-[1000] italic h-12 rounded-2xl uppercase text-[11px] shadow-lg">
                Search
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* TABLE VIEW */}
        {viewMode === "table" ? (
          <Card className="bg-white dark:bg-[#1C2737] rounded-[3rem] border-none shadow-xl overflow-hidden mb-10 animate-in slide-in-from-bottom-4 duration-500">
            <CardBody className="p-0">
              <Table removeWrapper aria-label="Ranking table">
                <TableHeader>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 px-10 italic text-slate-400">
                    Rank
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400">
                    Athlete
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Class
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Solved
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-center">
                    Accuracy
                  </TableColumn>
                  <TableColumn className="bg-transparent font-black uppercase text-[10px] h-16 italic text-slate-400 text-right px-10">
                    Score
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {RANKING_DATA.map((row) => (
                    <TableRow
                      key={row.rank}
                      className="border-b border-slate-50 dark:border-white/5 last:border-none hover:bg-[#F0F2F5] dark:hover:bg-[#0A0F1C] transition-all h-20 group"
                    >
                      <TableCell className="px-10 font-[1000] italic text-2xl leading-none">
                        <span
                          className={
                            row.rank === 1
                              ? "text-amber-500"
                              : row.rank === 2
                              ? "text-slate-400"
                              : row.rank === 3
                              ? "text-orange-700"
                              : "text-slate-300"
                          }
                        >
                          {row.rank.toString().padStart(2, "0")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar
                            radius="full"
                            size="sm"
                            src={`https://i.pravatar.cc/150?u=${row.id}`}
                          />
                          <div className="flex flex-col">
                            <span className="font-[1000] uppercase italic text-sm group-hover:text-[#FF5C00] transition-colors">
                              {row.name}
                            </span>
                            <span className="font-bold text-[9px] text-slate-400 uppercase leading-none">
                              {row.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-black uppercase italic text-[10px] text-slate-500">
                        {row.class}
                      </TableCell>
                      <TableCell className="text-center font-black italic text-sm">
                        {row.solved}
                      </TableCell>
                      <TableCell className="text-center font-black italic text-emerald-500">
                        {row.accuracy}%
                      </TableCell>
                      <TableCell className="text-right px-10 font-[1000] italic text-xl text-blue-600 dark:text-[#FF5C00]">
                        {row.points.toLocaleString()}
                        <ArrowUpRight
                          size={18}
                          className="inline-block ml-2 text-slate-300"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-center p-10 border-t border-divider">
                <Pagination
                  total={5}
                  page={page}
                  onChange={setPage}
                  classNames={{
                    cursor:
                      "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic shadow-xl",
                  }}
                />
              </div>
            </CardBody>
          </Card>
        ) : (
          /* ANALYTICS VIEW */
          <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center gap-3">
              <Button
                isIconOnly
                className={`w-12 h-12 rounded-2xl border-2 transition-all ${
                  chartType === "line"
                    ? "border-[#FF5C00] bg-orange-500/10 text-[#FF5C00]"
                    : "border-divider bg-white dark:bg-[#1C2737] text-slate-400"
                }`}
                onClick={() => setChartType("line")}
              >
                <LineChartIcon size={20} />
              </Button>
              <Button
                isIconOnly
                className={`w-12 h-12 rounded-2xl border-2 transition-all ${
                  chartType === "bar"
                    ? "border-blue-600 bg-blue-500/10 text-blue-600"
                    : "border-divider bg-white dark:bg-[#1C2737] text-slate-400"
                }`}
                onClick={() => setChartType("bar")}
              >
                <BarChart3 size={20} />
              </Button>
              <Button
                isIconOnly
                className={`w-12 h-12 rounded-2xl border-2 transition-all ${
                  chartType === "area"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : "border-divider bg-white dark:bg-[#1C2737] text-slate-400"
                }`}
                onClick={() => setChartType("area")}
              >
                <AreaChartIcon size={20} />
              </Button>
            </div>

            <Card className="bg-white dark:bg-[#1C2737] rounded-[3rem] border-none shadow-2xl p-6 lg:p-10">
              <CardBody className="gap-8">
                <div className="flex items-center gap-3 border-b border-divider pb-4">
                  <TrendingUp size={20} className="text-[#FF5C00]" />
                  <h4 className="font-[1000] uppercase italic text-lg leading-none">
                    Point Accumulation Trend
                  </h4>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={CHART_DATA}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          strokeOpacity={0.1}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#888", fontWeight: "bold" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#888", fontWeight: "bold" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#071739",
                            border: "none",
                            borderRadius: "16px",
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend iconType="circle" />
                        <Line
                          type="monotone"
                          dataKey="Van Ngoc Thang"
                          stroke="#FF5C00"
                          strokeWidth={4}
                          dot={{ r: 6, fill: "#FF5C00" }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="Nguyen Duy Rim"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="Pham Nguyen Hai Dang"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    ) : chartType === "bar" ? (
                      <BarChart data={CHART_DATA}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          strokeOpacity={0.1}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: "transparent" }}
                          contentStyle={{
                            backgroundColor: "#071739",
                            border: "none",
                            borderRadius: "16px",
                          }}
                        />
                        <Bar
                          dataKey="Van Ngoc Thang"
                          fill="#FF5C00"
                          radius={[10, 10, 0, 0]}
                          barSize={24}
                        />
                        <Bar
                          dataKey="Nguyen Duy Rim"
                          fill="#3b82f6"
                          radius={[10, 10, 0, 0]}
                          barSize={24}
                        />
                      </BarChart>
                    ) : (
                      <AreaChart data={CHART_DATA}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          strokeOpacity={0.1}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#071739",
                            border: "none",
                            borderRadius: "16px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Van Ngoc Thang"
                          stroke="#FF5C00"
                          fill="#FF5C00"
                          fillOpacity={0.1}
                          strokeWidth={4}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-[#1C2737] rounded-[2.5rem] p-6 border-none shadow-lg">
                <CardBody className="gap-4">
                  <div className="flex items-center gap-2">
                    <Timer size={20} className="text-blue-500" />
                    <h5 className="font-black uppercase italic text-xs">
                      Completion Speed
                    </h5>
                  </div>
                  <div className="space-y-4 pt-2">
                    {RANKING_DATA.map((st) => (
                      <div key={st.id} className="flex items-center gap-4">
                        <span className="w-24 text-[10px] font-black uppercase italic text-slate-400 truncate">
                          {st.name}
                        </span>
                        <div className="flex-1 bg-slate-100 dark:bg-black/20 h-3 rounded-full overflow-hidden">
                          <Progress
                            value={(st.time / 60) * 100}
                            size="sm"
                            classNames={{ indicator: "bg-blue-500" }}
                          />
                        </div>
                        <span className="w-10 text-[10px] font-black italic">
                          {st.time}m
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white dark:bg-[#1C2737] rounded-[2.5rem] p-6 border-none shadow-lg">
                <CardBody className="gap-4">
                  <div className="flex items-center gap-2">
                    <Target size={20} className="text-emerald-500" />
                    <h5 className="font-black uppercase italic text-xs">
                      Mastery Accuracy
                    </h5>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    {RANKING_DATA.slice(0, 3).map((st) => (
                      <div
                        key={st.id}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className="text-slate-100 dark:text-white/5"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke={st.accuracy > 95 ? "#10b981" : "#FF5C00"}
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray={175.9}
                              strokeDashoffset={
                                175.9 - (175.9 * st.accuracy) / 100
                              }
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute font-black italic text-xs">
                            {st.accuracy}%
                          </span>
                        </div>
                        <span className="text-[9px] font-black uppercase italic text-slate-400">
                          {st.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
