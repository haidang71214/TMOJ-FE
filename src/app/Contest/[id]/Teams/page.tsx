"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Users, User, Search, HelpCircle, UserPlus, Clock,
  MapPin, Shield, Star, Mail, Copy, Crown, Camera
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
import { useUpdateTeamAvatarMutation } from "@/store/queries/Team";
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
  const myTeam = myTeamData?.data;

  const [updateTeamAvatar, { isLoading: isUpdatingAvatar }] = useUpdateTeamAvatarMutation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (myTeam?.leaderId === currentUser?.userId) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !myTeam) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await updateTeamAvatar({
          teamId: myTeam.teamId,
          avatarUrl: base64String
        }).unwrap();
        toast.success("Team avatar updated successfully!");
      } catch  {
        toast.error("Failed to update team avatar");
      }
    };
    reader.readAsDataURL(file);
  };

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
                              src={(() => {
                                const url = team.teamAvatarUrl || team.avatarUrl;
                                if (!url) return `https://api.dicebear.com/7.x/identicon/svg?seed=${team.teamName}`;
                                return url.startsWith("http") ? `${url}?t=${new Date().getTime()}` : url;
                              })()}
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
                                  src={m.avatarUrl ? `${m.avatarUrl}?t=${new Date().getTime()}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
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
            {myTeam ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Team Card */}
                <div className="lg:col-span-1">
                  <Card className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border-none shadow-2xl relative overflow-hidden h-fit group/card">
                    {/* Background decoration */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover/card:bg-blue-600/20 transition-all duration-700"></div>

                    <CardBody className="p-8 space-y-8 relative z-10">
                      <div className="flex flex-col items-center text-center space-y-6 pt-4">
                        <div
                          className={`relative ${myTeam.leaderId === currentUser?.userId ? "cursor-pointer group/avatar" : ""}`}
                          onClick={handleAvatarClick}
                        >
                          <Avatar
                            src={myTeam.isPersonal
                              ? (currentUser?.avatarUrl ? (currentUser.avatarUrl.startsWith("http") ? `${currentUser.avatarUrl}?t=${new Date().getTime()}` : currentUser.avatarUrl) : `https://api.dicebear.com/7.x/open-peeps/svg?seed=${currentUser?.username}`)
                              : (() => {
                                const url = myTeam.teamAvatarUrl || myTeam.avatarUrl;
                                if (!url) return `https://api.dicebear.com/7.x/identicon/svg?seed=${myTeam.teamName}`;
                                return url.startsWith("http") ? `${url}?t=${new Date().getTime()}` : url;
                              })()}
                            className="w-32 h-32 rounded-[38px] shadow-2xl border-4 border-white dark:border-slate-800 transition-transform group-hover/card:scale-105 duration-500"
                          />
                          {myTeam.leaderId === currentUser?.userId && (
                            <div className="absolute inset-0 bg-black/40 rounded-[38px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                              <Camera className="text-white w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-lg ring-4 ring-white dark:ring-[#1e293b]">
                            {myTeam.isPersonal ? <User size={18} /> : <Users size={18} />}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          {isUpdatingAvatar && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 rounded-[38px] flex items-center justify-center z-20">
                              <Spinner size="sm" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Chip
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 font-black uppercase italic text-[10px] tracking-widest px-3"
                            size="sm"
                            variant="flat"
                          >
                            {myTeam.isPersonal ? "Solo Participant" : "Team Entry"}
                          </Chip>
                          <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                            {myTeam.isPersonal ? (currentUser?.displayName || currentUser?.username || myTeam.teamName) : myTeam.teamName}
                          </h2>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">{currentUser?.email}</p>
                          <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest pt-2">
                            <Clock className="w-3.5 h-3.5" />
                            Registered {new Date(myTeam.joinedAt || myTeam.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
                          <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-tighter">Team Size</p>
                          <p className="text-[#FF5C00] font-[1000] text-xl uppercase italic">{myTeam.members.length} / {myTeam.teamSize}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
                          <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-tighter">Status</p>
                          <p className="text-emerald-500 font-[1000] text-sm uppercase italic">Confirmed</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Members List */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-[1.2rem] text-white shadow-xl shadow-blue-600/20">
                        <Users className="w-6 h-6" />
                      </div>
                      Team Roster
                    </h3>
                    <Chip variant="dot" color="primary" className="font-black uppercase italic text-[10px]">
                      {myTeam.members.length} Active Members
                    </Chip>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {[...myTeam.members]
                      .sort((a, b) => (a.userId === myTeam.leaderId ? -1 : b.userId === myTeam.leaderId ? 1 : 0))
                      .map((member) => (
                        <div
                          key={member.userId}
                          className={`group bg-white dark:bg-[#1e293b] p-6 rounded-[2.5rem] border hover:shadow-2xl transition-all flex items-center gap-5 relative overflow-hidden ${member.userId === currentUser?.userId
                            ? "border-blue-500 shadow-xl shadow-blue-500/10 dark:border-blue-600"
                            : "border-slate-200 dark:border-slate-800 hover:border-blue-500/50"
                            }`}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/[0.03] rounded-bl-full pointer-events-none group-hover:bg-blue-600/[0.08] transition-colors duration-500"></div>

                          <div className="relative">
                            <Avatar
                              src={member.userId === currentUser?.userId
                                ? (currentUser?.avatarUrl ? `${currentUser.avatarUrl}?t=${new Date().getTime()}` : `https://api.dicebear.com/7.x/open-peeps/svg?seed=${currentUser?.username}`)
                                : (member.avatarUrl ? `${member.avatarUrl}?t=${new Date().getTime()}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`)}
                              className="w-16 h-16 rounded-[22px] shadow-lg ring-4 ring-slate-50 dark:ring-slate-900 group-hover:ring-blue-500/20 transition-all"
                            />
                            {member.userId === myTeam.leaderId && (
                              <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl shadow-lg ring-2 ring-white dark:ring-[#1e293b] z-10">
                                <Crown size={12} className="fill-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 overflow-hidden">
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-[1000] text-slate-900 dark:text-white text-xl tracking-tighter leading-tight truncate">
                                  {member.userId === currentUser?.userId ? (currentUser?.displayName || currentUser?.username) : member.displayName}
                                </span>
                                {member.userId === myTeam.leaderId && (
                                  <Chip size="sm" color="warning" variant="flat" className="h-5 text-[8px] font-black uppercase italic border-none bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">Leader</Chip>
                                )}
                              </div>
                            </div>
                            <span className="text-slate-400 text-xs font-black uppercase italic tracking-wider flex items-center gap-2">
                              @{member.username}
                              {member.userId === currentUser?.userId && (
                                <Chip size="sm" variant="flat" color="secondary" className="h-4 text-[7px] font-black uppercase">You</Chip>
                              )}
                            </span>

                            <div className="mt-4 flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                <Mail className="w-3 h-3 text-blue-500" />
                                <span className="text-[10px] font-bold truncate max-w-[120px]">{member.userId === currentUser?.userId ? currentUser?.email : member.email}</span>
                              </div>
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
