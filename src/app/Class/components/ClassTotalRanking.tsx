"use client";

import React, { useMemo, useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User, 
  Spinner,
  Card,
  CardBody,
  Tooltip,
  Avatar,
  Input
} from "@heroui/react";
import { 
  Trophy, 
  Medal, 
  Target, 
  Clock, 
  Crown,
  Search,
  AlertCircle
} from "lucide-react";
import { useGetClassTotalRankingQuery } from "@/store/queries/Class";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { ClassTotalRankingRow } from "@/types";

interface ClassTotalRankingProps {
  classId: string;
  semesterId: string;
}

export default function ClassTotalRanking({ classId, semesterId }: ClassTotalRankingProps) {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const { data: response, isLoading, isError } = useGetClassTotalRankingQuery({ classId, semesterId });
    console.log(response);
    
  const data = response?.data;
  const rawRankings = data?.rankings || [];
  const slots = data?.slots || [];

  const filteredRankings = useMemo(() => {
    if (!searchInput) return rawRankings;
    const query = searchInput.toLowerCase();
    return rawRankings.filter(r => 
      r.displayName.toLowerCase().includes(query) || 
      r.username.toLowerCase().includes(query)
    );
  }, [rawRankings, searchInput]);

  const podium = useMemo(() => {
    const p1 = rawRankings[0] || null;
    const p2 = rawRankings[1] || null;
    const p3 = rawRankings[2] || null;
    return [p2, p1, p3]; // Order: [Silver, Gold, Bronze]
  }, [rawRankings]);

  // Merge static columns with dynamic slot columns to avoid TS errors
  const columns = useMemo(() => {
    const baseCols = [
      { key: "rank", label: "Rank", align: "start" },
      { key: "athlete", label: "Athlete", align: "start" },
      { key: "solved", label: "Solved", align: "center" },
      { key: "penalty", label: "Penalty", align: "center" },
    ];
    
    const slotCols = slots.map(s => ({
      key: `slot-${s.slotId}`,
      label: s.title,
      align: "center",
      isSlot: true,
      slotId: s.slotId,
      slotNo: s.slotNo
    }));

    return [...baseCols, ...slotCols];
  }, [slots]);

  const renderCell = (row: ClassTotalRankingRow, columnKey: React.Key) => {
    const keyString = columnKey.toString();

    if (keyString === "rank") {
      return (
        <div className="font-[1000] italic text-2xl leading-none px-4">
          <span className={
            row.rank === 1 ? "text-amber-500" : 
            row.rank === 2 ? "text-slate-400" : 
            row.rank === 3 ? "text-orange-700" : "text-slate-300"
          }>
            {row.rank.toString().padStart(2, "0")}
          </span>
        </div>
      );
    }

    if (keyString === "athlete") {
      return (
        <div className="flex items-center gap-4">
          <Avatar radius="full" size="sm" src={row.avatarUrl || undefined} />
          <div className="flex flex-col">
            <span className="font-[1000] uppercase italic text-sm group-hover:text-[#FF5C00] transition-colors">
              {row.displayName}
            </span>
            <span className="font-bold text-[9px] text-slate-400 uppercase leading-none">
              {row.username}
            </span>
          </div>
        </div>
      );
    }

    if (keyString === "solved") {
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="px-4 py-1 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-2">
            <Target size={14} />
            <span className="text-lg font-black">{row.totalSolved}</span>
          </div>
        </div>
      );
    }

    if (keyString === "penalty") {
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="px-4 py-1 bg-red-500/10 text-red-500 rounded-full flex items-center gap-2">
            <Clock size={14} />
            <span className="text-lg font-black">{row.totalPenalty}</span>
          </div>
        </div>
      );
    }

    if (keyString.startsWith("slot-")) {
      const slotId = keyString.replace("slot-", "");
      const stat = row.slotStats.find(s => s.slotId === slotId);
      return (
        <div className="flex flex-col items-center justify-center min-w-[70px]">
          {stat ? (
            <span className={`text-base font-black ${stat.solved > 0 ? "text-emerald-500" : "text-slate-300"}`}>
              {stat.solved} Resolve
            </span>
          ) : (
            <span className="text-slate-200 dark:text-slate-800 font-black">-</span>
          )}
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="relative">
           <Spinner size="lg" color="primary" />
           <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="absolute -inset-4 border-2 border-blue-500/20 rounded-full"
           />
        </div>
        <p className="text-slate-500 font-black animate-pulse uppercase tracking-[0.3em] text-[10px] italic">
          Synchronizing Class Performance...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="p-4 bg-red-500/10 rounded-full text-red-500">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-black uppercase italic text-slate-800 dark:text-white">Data Fetching Failed</h3>
        <p className="text-slate-500 font-bold text-sm max-w-xs">We couldn't retrieve the ranking data for this class.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[#FF5C00] rounded-xl shadow-lg text-white">
            <Trophy size={24} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-[1000] italic tracking-tighter uppercase leading-none">
              Class <span className="text-[#FF5C00]">Leaderboard</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
              {data.className} • {data.subjectName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase italic">Last Sync</span>
              <span className="text-sm font-black italic">{new Date(data.lastUpdated).toLocaleTimeString()}</span>
           </div>
        </div>
      </div>

      {/* PODIUM SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-[1000px] mx-auto w-full pt-10">
        {podium.map((student, index) => {
          if (!student) return <div key={`empty-${index}`} className="hidden md:block h-full" />;
          const isFirst = index === 1;
          const isSecond = index === 0;

          const rankStyles = isFirst
            ? { border: "border-amber-400", shadow: "shadow-[0_0_30px_rgba(251,191,36,0.3)]", badge: "bg-amber-400" }
            : isSecond
              ? { border: "border-slate-300", shadow: "shadow-[0_0_20px_rgba(203,213,225,0.3)]", badge: "bg-slate-300" }
              : { border: "border-orange-700", shadow: "shadow-[0_0_20px_rgba(194,65,12,0.3)]", badge: "bg-orange-700" };

          return (
            <Card
              key={student.userId}
              className={`rounded-[3rem] transition-all duration-500 overflow-visible border-4 ${rankStyles.border
                } ${rankStyles.shadow} ${isFirst
                  ? "bg-gradient-to-br from-[#071739] to-[#1a2a4a] text-white scale-110 z-20 h-[360px]"
                  : "bg-white dark:bg-[#1C2737] h-[280px] z-10"
                }`}
            >
              <CardBody className="p-6 flex flex-col items-center justify-center text-center gap-3 relative">
                <div className={`absolute top-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 z-30 transform -translate-y-[30%] border-white ${rankStyles.badge} text-white`}>
                  {isFirst ? <Crown size={24} /> : <Medal size={22} />}
                </div>

                <Avatar src={student.avatarUrl || undefined} className={`w-20 h-20 ring-4 ${isFirst ? "ring-amber-400/50" : isSecond ? "ring-slate-400/20" : "ring-orange-700/20"}`} />

                <div className="space-y-0.5">
                  <h3 className={`text-lg font-[1000] italic uppercase leading-tight ${isFirst ? "text-white" : "text-[#071739] dark:text-white"}`}>
                    {student.displayName}
                  </h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isFirst ? "text-white/70" : "text-slate-400"}`}>
                    {student.username}
                  </p>
                </div>

                <div className={`grid grid-cols-2 gap-3 w-full pt-4 border-t ${isFirst ? "border-white/20" : "border-slate-100 dark:border-white/5"}`}>
                  <div className="text-center">
                    <p className="text-[8px] font-black uppercase italic text-[#FF5C00]">Solved</p>
                    <p className="text-lg font-[1000] italic">{student.totalSolved}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black uppercase italic text-[#FF5C00]">Penalty</p>
                    <p className="text-lg font-[1000] italic text-red-500">{student.totalPenalty}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* SEARCH TOOLBAR */}
      <Card className="bg-white dark:bg-[#1C2737] rounded-4xl border-none shadow-sm">
        <CardBody className="p-6">
          <Input
            placeholder="Search student by name or username..."
            value={searchInput}
            onValueChange={setSearchInput}
            startContent={<Search size={18} className="text-slate-400" />}
            classNames={{
              inputWrapper: "bg-[#F0F2F5] dark:bg-[#0A0F1C] rounded-2xl h-14 shadow-none font-bold italic border-2 border-transparent focus-within:border-[#FF5C00]/50 transition-all",
            }}
          />
        </CardBody>
      </Card>

      {/* TABLE VIEW - Perfectly matched with /Ranking */}
      <Card className="bg-white dark:bg-[#1C2737] rounded-[3rem] border-none shadow-xl overflow-hidden mb-10 animate-in slide-in-from-bottom-4 duration-500">
        <CardBody className="p-0">
          <Table 
            removeWrapper 
            aria-label="Class Ranking table"
            classNames={{
              base: "max-h-[800px] overflow-auto custom-scrollbar",
              th: "bg-transparent font-black uppercase text-[10px] h-16 px-10 italic text-slate-400 border-b border-divider",
              td: "px-10 py-5 font-bold text-slate-700 dark:text-slate-300 last:border-none",
            }}
          >
            <TableHeader columns={columns}>
              {(column: any) => (
                <TableColumn 
                  key={column.key} 
                  align={column.align}
                  className={`bg-transparent font-black uppercase text-[10px] h-16 px-10 italic text-slate-400 ${column.key === 'rank' ? 'w-24' : ''}`}
                >
                  {column.isSlot ? (
                    <Tooltip content={column.label} placement="top" closeDelay={0}>
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] opacity-60 not-italic font-bold">EXAM {column.slotNo}</span>
                        <span className="truncate max-w-[80px]">{column.label}</span>
                      </div>
                    </Tooltip>
                  ) : (
                    column.label
                  )}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={filteredRankings} emptyContent="No results found matching your search.">
              {(item) => (
                <TableRow key={item.userId} className="border-b border-slate-50 dark:border-white/5 last:border-none hover:bg-[#F0F2F5] dark:hover:bg-[#0A0F1C] transition-all h-24 group">
                  {(columnKey) => (
                    <TableCell className={columnKey === 'rank' ? 'px-10' : ''}>
                      {renderCell(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
}
