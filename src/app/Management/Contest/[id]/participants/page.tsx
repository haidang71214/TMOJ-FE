"use client";
import React, { use, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Avatar,
  Chip,
  Spinner,
  User,
  Input,
  Pagination,
} from "@heroui/react";
import { ChevronLeft, Users, Trophy, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetContestParticipantsQuery, useGetContestDetailQuery } from "@/store/queries/Contest";

export default function ParticipantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const { data: response, isLoading } = useGetContestParticipantsQuery(id);
  const { data: contestDetail } = useGetContestDetailQuery(id);
  const participantsData = response?.data;
  const teams = participantsData?.teams || [];

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = useMemo(() => {
    if (!searchQuery) return teams;
    const lowerQuery = searchQuery.toLowerCase();
    return teams.filter((t) => {
      if (t.teamName.toLowerCase().includes(lowerQuery)) return true;
      if (t.members && t.members.some(m =>
        (m.displayName && m.displayName.toLowerCase().includes(lowerQuery)) ||
        (m.username && m.username.toLowerCase().includes(lowerQuery)) ||
        (m.email && m.email.toLowerCase().includes(lowerQuery)) ||
        (m.rollNumber && m.rollNumber.toLowerCase().includes(lowerQuery))
      )) return true;
      return false;
    });
  }, [teams, searchQuery]);

  const pages = Math.ceil(filteredTeams.length / rowsPerPage) || 1;

  const paginatedTeams = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTeams.slice(start, end);
  }, [page, filteredTeams, rowsPerPage]);

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by team, name, email or member ID..."
            startContent={<Search size={18} className="text-[#A4B5C4]" />}
            value={searchQuery}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
            classNames={{
              inputWrapper: "bg-slate-50 dark:bg-white/5 rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/10",
            }}
          />
          <label className="flex items-center text-slate-400 text-xs font-bold gap-2">
            Rows per page:
            <select
              className="bg-transparent outline-none text-slate-500 text-xs font-bold cursor-pointer"
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [searchQuery, rowsPerPage]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
          Total {filteredTeams.length} records
        </span>
        <Pagination
          showControls
          showShadow
          color="primary"
          variant="faded"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-black",
            wrapper: "gap-2",
            item: "font-bold hover:bg-slate-100 dark:hover:bg-white/10",
          }}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
      </div>
    );
  }, [page, pages, filteredTeams.length]);

  return (
    <div className="flex flex-col gap-8 pb-20 p-2 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <Button
          variant="light"
          onPress={() => router.back()}
          className="w-fit font-black text-slate-400 uppercase tracking-widest px-0 hover:text-blue-600 transition-colors h-auto min-w-0 text-[10px]"
          startContent={<ChevronLeft size={16} />}
        >
          Back to Contest List
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none drop-shadow-sm">
              CONTEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] to-[#FF8A00]">PARTICIPANTS</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-slate-100 to-white dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
                <Trophy size={14} className="text-[#FF5C00] drop-shadow-md animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-[#071739] dark:text-white italic">
                  {contestDetail?.data?.title || "FETCHING DATA..."}
                </span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                ID: #{id}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-white dark:bg-[#111c35] px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
              <Users size={20} className="text-[#FF5C00]" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-slate-400">Total Teams</span>
                <span className="text-lg font-black text-[#071739] dark:text-white leading-none">
                  {participantsData?.totalTeams || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-[#111c35] px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
              <Users size={20} className="text-[#22C55E]" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-slate-400">Total Users</span>
                <span className="text-lg font-black text-[#071739] dark:text-white leading-none">
                  {participantsData?.totalUsers || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-[#0A0F1C] rounded-[2.5rem] p-6 shadow-sm border border-transparent dark:border-white/5">
        <Table
          aria-label="Participants Table"
          removeWrapper
          topContent={topContent}
          bottomContent={bottomContent}
          classNames={{
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
          }}
        >
          <TableHeader>
            <TableColumn>TEAM / USER INFO</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>MEMBERS</TableColumn>
            <TableColumn>JOINED AT</TableColumn>
            <TableColumn className="text-right">RANK & SCORE</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading participants..." color="primary" />}
            emptyContent={!isLoading && "Chưa có đội hoặc thành viên nào đăng ký."}
          >
            {paginatedTeams.map((t) => (
              <TableRow key={t.teamId} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <TableCell>
                  <User
                    name={<span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white leading-none">{t.teamName}</span>}
                    description={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {t.teamId.substring(0, 8)}...</span>}
                    avatarProps={{
                      src: t.teamAvatarUrl || t.avatarUrl || `https://ui-avatars.com/api/?name=${t.teamName}&background=random`,
                      size: "md",
                      className: "shadow-sm border border-slate-200 dark:border-white/10 p-0.5",
                    }}
                    className="justify-start"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    className={`font-black uppercase text-[9px] ${t.isPersonal ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"}`}
                  >
                    {t.isPersonal ? "Individual" : "Team"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-3">
                    {t.members && t.members.length > 0 ? (
                      t.members.map((member) => (
                        <User
                          key={member.userId}
                          name={<span className="font-bold text-sm dark:text-white">{member.displayName || member.username}</span>}
                          description={<span className="text-xs font-semibold text-slate-400">{member.rollNumber || member.email}</span>}
                          avatarProps={{
                            src: member.avatarUrl || `https://ui-avatars.com/api/?name=${member.displayName || member.username}&background=random`,
                            size: "sm",
                            className: member.userId === t.leaderId ? "ring-2 ring-warning" : "",
                          }}
                          className="justify-start shadow-sm rounded-xl py-1"
                        />
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No members</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-slate-500">
                    {new Date(t.joinAt).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-end justify-end gap-1">
                    <div className="flex items-center gap-2">
                      {t.rank === 1 && <Trophy size={14} className="text-warning" />}
                      <span className="font-black italic text-sm dark:text-white">
                        {t.rank > 0 ? `Rank #${t.rank}` : "Unranked"}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#FF5C00] tracking-widest">
                      {t.score} PTS • {t.solvedProblem} Solved
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
