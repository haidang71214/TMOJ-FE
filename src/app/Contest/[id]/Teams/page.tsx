"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Users, Search, HelpCircle, UserPlus, Clock,
  MapPin, Shield, Star, Crown, Mail, Copy
} from "lucide-react";
import {
  Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Avatar, Tooltip, Input, Button, Spinner,
  Card, CardBody, Chip
} from "@heroui/react";
import {
  useGetMyTeamInContestQuery,
  useGetContestParticipantsQuery,
  useGetContestDetailQuery
} from "@/store/queries/Contest";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types";
import { toast } from "sonner";
import ContestHeader from "../components/ContestHeader";

export default function TeamsPage() {
  const params = useParams();
  const contestId = params.id as string;

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const role = currentUser?.role?.toLowerCase();
  const isAdminOrAuthorized = role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.TEACHER;

  // Requests
  const { data: myTeamData, isLoading: isLoadingMyTeam } = useGetMyTeamInContestQuery(contestId, {
    skip: isAdminOrAuthorized
  });
  const { data: participantsData, isLoading: isLoadingParticipants } = useGetContestParticipantsQuery(contestId, {
    skip: !isAdminOrAuthorized
  });
  const { data: contestData } = useGetContestDetailQuery(contestId);

  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = isAdminOrAuthorized ? isLoadingParticipants : isLoadingMyTeam;

  if (isLoading) {
    return (
      <div className="w-full">
        <ContestHeader contestId={contestId} />
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-slate-500 font-medium animate-pulse italic">Đang tải dữ liệu đội thi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-800 dark:text-slate-200 pb-20">
      <ContestHeader contestId={contestId} />

      {/* MAIN CONTENT AREA */}
      <div className="w-full max-w-[1500px] mx-auto mt-6 px-4 sm:px-6 lg:px-8">

        {isAdminOrAuthorized ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Contest Participants
                </h2>
                <p className="text-slate-500 text-sm mt-1">Danh sách tất cả các đội thi và thí sinh tham gia.</p>
              </div>

              <Input
                classNames={{
                  base: "max-w-[300px]",
                  inputWrapper: "bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl h-11",
                }}
                placeholder="Search teams or users..."
                startContent={<Search className="w-4 h-4 text-slate-400" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 overflow-hidden">
              <Table
                aria-label="Participants table"
                removeWrapper
                classNames={{
                  th: "bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest py-5 border-b border-slate-100 dark:border-slate-800",
                  td: "py-4 border-b border-slate-50 dark:border-slate-800/50",
                  tr: "hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                }}
              >
                <TableHeader>
                  <TableColumn className="pl-8">TEAM NAME</TableColumn>
                  <TableColumn>MEMBERS</TableColumn>
                  <TableColumn>JOIN DATE</TableColumn>
                  <TableColumn className="text-center pr-8">RANK</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No participants found.">
                  {(participantsData?.data.teams || [])
                    .filter(t => t.teamName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((team) => (
                      <TableRow key={team.teamId}>
                        <TableCell className="pl-8">
                          <div className="flex items-center gap-4">
                            <Avatar
                              src={team.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${team.teamName}`}
                              className="w-10 h-10 rounded-xl"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white capitalize leading-none mb-1">{team.teamName}</span>
                              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">
                                {team.isPersonal ? "Solo Participant" : `Team • ${team.members.length} Members`}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {team.members.map((m) => (
                              <Tooltip key={m.userId} content={m.displayName} placement="top">
                                <Avatar
                                  src={m.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                                  className="w-8 h-8 border-2 border-white dark:border-[#1e293b]"
                                />
                              </Tooltip>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-slate-500">
                            {team.joinAt ? new Date(team.joinAt).toLocaleDateString() : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center pr-8">
                          <Chip
                            variant="flat"
                            color="primary"
                            className="font-bold"
                            size="sm"
                          >
                            #{team.rank || "-"}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {myTeamData?.data ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Team Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 relative overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 p-4">
                      <Chip className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 font-black uppercase italic text-[10px]" size="sm">
                        MY TEAM
                      </Chip>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 pt-4">
                      <Avatar
                        src={myTeamData.data.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${myTeamData.data.teamName}`}
                        className="w-24 h-24 rounded-[32px] shadow-xl border-4 border-white dark:border-slate-800"
                      />
                      <div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                          {myTeamData.data.teamName}
                        </h2>
                        <div className="mt-2 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" />
                          Joined {new Date(myTeamData.data.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Status</p>
                        <p className="text-emerald-500 font-bold text-sm uppercase italic">Confirmed</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Members</p>
                        <p className="text-slate-900 dark:text-white font-bold text-sm italic tracking-tighter">
                          {myTeamData.data?.members.length} / {myTeamData.data?.teamSize}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Invite Code</p>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <span className="font-mono font-bold text-lg text-slate-900 dark:text-white tracking-widest pl-2">
                          {myTeamData.data?.inviteCode}
                        </span>
                        <Button size="sm" isIconOnly variant="light"
                          onClick={() => {
                            if (myTeamData.data?.inviteCode) {
                              navigator.clipboard.writeText(myTeamData.data.inviteCode);
                              toast.success("Mã mời đã được sao chép!");
                            }
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    Team Roster
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myTeamData.data.members.map((member) => (
                      <div key={member.userId} className="group bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.02] rounded-bl-full pointer-events-none group-hover:bg-blue-500/[0.05] transition-colors"></div>
                        <Avatar
                          src={member.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`}
                          className="w-14 h-14 rounded-2xl shadow-md"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-tight">
                            {member.displayName}
                          </span>
                          <span className="text-slate-400 text-xs font-medium">@{member.username}</span>
                          <div className="mt-2">
                            {member.userId === myTeamData.data?.leaderId ? (
                              <Chip color="warning" variant="flat" size="sm" className="text-[9px] font-black uppercase italic" startContent={<Crown className="w-3 h-3" />}>Leader</Chip>
                            ) : (
                              <Chip color="default" variant="flat" size="sm" className="text-[9px] font-black uppercase italic">Member</Chip>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-sky-400">
                  <Users className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">You are not in a team</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">Bạn chưa đăng ký tham gia đội nào cho cuộc thi này. Hãy quay lại trang thông tin để đăng ký.</p>
                </div>
                <Button
                  as="a"
                  href={`/Contest/${contestId}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 shadow-lg shadow-blue-600/20"
                >
                  QUAY LẠI TRANG THÔNG TIN
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
