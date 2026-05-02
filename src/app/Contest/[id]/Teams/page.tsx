"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Users, User, Search, UserPlus, Clock,
  Mail, Crown, Camera, ShieldCheck, Hash, CheckCircle2, Copy
} from "lucide-react";
import {
  Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Avatar, Tooltip, Input, Button, Spinner,
  Card, CardBody, Chip, Divider
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
  const router = useRouter();
  const contestId = params.id as string;

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const role = currentUser?.role?.toLowerCase();
  const isAdminOrAuthorized = role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.TEACHER;

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Spinner size="lg" color="warning" />
        <p className="font-[1000] italic uppercase text-2xl animate-pulse text-[#071739]">Loading Team Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <ContestHeader contestId={contestId} />

      <div className="container mx-auto px-4 md:px-10 -mt-10 relative z-20 pb-20">

        {isAdminOrAuthorized ? (
          <div className="space-y-8 animate-in fade-in duration-700">
            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
              <div className="bg-[#071739] p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] flex items-center justify-center shadow-lg shadow-[#FF5C00]/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-[1000] italic uppercase leading-none mb-1">Contest <span className="text-[#FF5C00]">Participants</span></h2>
                    <p className="text-white/40 text-[10px] font-black uppercase italic tracking-widest">Global roster of teams and competitors</p>
                  </div>
                </div>

                <Input
                  classNames={{
                    base: "max-w-[300px]",
                    inputWrapper: "bg-white/10 text-white font-bold h-12 rounded-xl border-white/10",
                  }}
                  placeholder="SEARCH COMPETITORS..."
                  startContent={<Search className="w-4 h-4 text-white/50" />}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
              </div>

              <Table
                aria-label="Participants table"
                removeWrapper
                classNames={{
                  base: "w-full",
                  table: "w-full",
                  th: "bg-[#071739] text-white/50 font-black italic uppercase text-[10px] py-6 first:pl-10 last:pr-10 border-none",
                  td: "py-5 border-b border-slate-100 dark:border-white/5 px-10 text-sm font-bold",
                  tr: "hover:bg-[#FF5C00]/5 dark:hover:bg-[#FF5C00]/10 transition-all",
                }}
              >
                <TableHeader>
                  <TableColumn>TEAM NAME</TableColumn>
                  <TableColumn>MEMBERS</TableColumn>
                  <TableColumn>JOIN DATE</TableColumn>
                  <TableColumn className="text-center">RANK</TableColumn>
                </TableHeader>
                <TableBody emptyContent="NO PARTICIPANTS FOUND.">
                  {(participantsData?.data.teams || [])
                    .filter(t => t.teamName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((team) => (
                      <TableRow key={team.teamId}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Avatar
                              src={(() => {
                                const url = team.teamAvatarUrl || team.avatarUrl;
                                if (!url) return `https://api.dicebear.com/7.x/identicon/svg?seed=${team.teamName}`;
                                return url.startsWith("http") ? `${url}?t=${new Date().getTime()}` : url;
                              })()}
                              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800"
                            />
                            <div className="flex flex-col">
                              <span className="font-black italic uppercase text-slate-900 dark:text-white leading-none mb-1">{team.teamName}</span>
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                                {team.isPersonal ? "Solo Entry" : `Team Entry • ${team.members.length} Members`}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {team.members.map((m) => (
                              <Tooltip key={m.userId} content={m.displayName} placement="top" className="font-black italic uppercase text-[9px]">
                                <Avatar
                                  src={m.avatarUrl ? `${m.avatarUrl}?t=${new Date().getTime()}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                                  className="w-8 h-8 border-2 border-white dark:border-[#1e293b] rounded-lg"
                                />
                              </Tooltip>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-400 font-bold uppercase">
                            {team.joinAt ? new Date(team.joinAt).toLocaleDateString() : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Chip
                            variant="flat"
                            className="bg-[#FF5C00]/10 text-[#FF5C00] font-black italic h-7 px-4 border-none"
                            size="sm"
                          >
                            #{team.rank || "-"}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {myTeam ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Team Card (Left Sidebar style) */}
                <div className="lg:col-span-4">
                  <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                    <div className="bg-[#071739] p-8 text-white relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5C00]/10 rounded-bl-full blur-2xl"></div>
                      <div className="flex flex-col items-center text-center space-y-6 pt-4 relative z-10">
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
                            className="w-32 h-32 rounded-[2.5rem] shadow-2xl border-4 border-white/10 transition-transform group-hover/avatar:scale-105 duration-500"
                          />
                          {myTeam.leaderId === currentUser?.userId && (
                            <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                              <Camera className="text-white w-8 h-8" />
                            </div>
                          )}
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                          {isUpdatingAvatar && <div className="absolute inset-0 bg-black/50 rounded-[2.5rem] flex items-center justify-center z-20"><Spinner size="sm" color="warning" /></div>}
                        </div>

                        <div className="space-y-3 w-full">
                          <Chip className="bg-[#FF5C00] text-white font-black italic uppercase text-[9px] px-3 tracking-widest h-6 border-none" size="sm">
                            {myTeam.isPersonal ? "Solo Competitor" : "Team Champion"}
                          </Chip>
                          <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter leading-none">
                            {myTeam.isPersonal ? (currentUser?.displayName || currentUser?.username || myTeam.teamName) : myTeam.teamName}
                          </h2>
                          <div className="flex items-center justify-center gap-2 text-white/50 text-[9px] font-black uppercase tracking-widest pt-1 italic">
                            <Clock className="w-3 h-3 text-[#FF5C00]" />
                            Registered {new Date(myTeam.joinedAt || myTeam.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[8px] font-black uppercase text-white/30 mb-1">Roster</p>
                            <p className="text-[#FF5C00] font-[1000] text-lg italic">{myTeam.members.length} / {myTeam.teamSize}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                            <p className="text-[8px] font-black uppercase text-white/30 mb-1">Status</p>
                            <p className="text-green-500 font-[1000] text-[10px] uppercase italic pt-1.5">Confirmed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Members List (Right Side) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-[1000] italic uppercase text-slate-900 dark:text-white">Active <span className="text-[#FF5C00]">Roster</span></h3>
                    <Chip variant="flat" className="bg-[#FF5C00]/10 text-[#FF5C00] font-black italic uppercase border-none h-8 px-5">
                      {myTeam.members.length} Members Verified
                    </Chip>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[...myTeam.members]
                      .sort((a, b) => (a.userId === myTeam.leaderId ? -1 : b.userId === myTeam.leaderId ? 1 : 0))
                      .map((member) => (
                        <div
                          key={member.userId}
                          className={`group bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 relative overflow-hidden ${member.userId === currentUser?.userId
                            ? "border-[#FF5C00]/30 shadow-2xl shadow-[#FF5C00]/5"
                            : "border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-xl"
                            }`}
                        >
                          <div className="relative">
                            <Avatar
                              src={member.userId === currentUser?.userId
                                ? (currentUser?.avatarUrl ? `${currentUser.avatarUrl}?t=${new Date().getTime()}` : `https://api.dicebear.com/7.x/open-peeps/svg?seed=${currentUser?.username}`)
                                : (member.avatarUrl ? `${member.avatarUrl}?t=${new Date().getTime()}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`)}
                              className="w-16 h-16 rounded-[1.2rem] shadow-xl ring-4 ring-slate-50 dark:ring-slate-900 group-hover:ring-[#FF5C00]/20 transition-all"
                            />
                            {member.userId === myTeam.leaderId && (
                              <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl shadow-lg ring-2 ring-white dark:ring-[#071739] z-10">
                                <Crown size={12} className="fill-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-[1000] text-slate-900 dark:text-white text-xl uppercase italic tracking-tighter leading-none">
                                {member.userId === currentUser?.userId ? (currentUser?.displayName || currentUser?.username) : member.displayName}
                              </span>
                              {member.userId === myTeam.leaderId && (
                                <span className="text-[8px] font-black uppercase italic text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">Leader</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <span className="text-slate-400 text-[10px] font-black uppercase italic tracking-widest flex items-center gap-1.5">
                                <Hash size={10} className="text-[#FF5C00]" /> @{member.username}
                              </span>
                              <span className="text-slate-400 text-[10px] font-black uppercase italic tracking-widest flex items-center gap-1.5">
                                <Mail size={10} className="text-[#FF5C00]" /> {member.userId === currentUser?.userId ? currentUser?.email : member.email}
                              </span>
                            </div>
                          </div>

                          <div className="hidden md:flex flex-col items-end gap-1">
                            {member.userId === currentUser?.userId ? (
                              <Chip size="sm" className="bg-blue-500 text-white font-black italic uppercase text-[8px] border-none">YOUR PROFILE</Chip>
                            ) : (
                              <Chip size="sm" className="bg-green-500/10 text-green-500 font-black italic uppercase text-[8px] border-none">ACTIVE MEMBER</Chip>
                            )}
                            <span className="text-[8px] font-bold text-slate-400 uppercase italic">Verified Competitor</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <Card className="rounded-[2rem] border-none shadow-xl bg-white dark:bg-[#1e293b] p-6 border-l-4 border-l-[#FF5C00]">
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="text-[#FF5C00]" size={24} />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase italic text-slate-900 dark:text-white leading-none">Official Team Roster</p>
                        <p className="text-[9px] text-slate-500 font-medium italic">This roster is finalized for the current championship. Any changes must be made via the registration portal.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 px-10 bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl text-center space-y-8 max-w-3xl mx-auto border-2 border-dashed border-slate-200 dark:border-white/10">
                <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300">
                  <Users className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-slate-900 dark:text-white">Not Registered</h2>
                  <p className="text-slate-500 font-medium italic text-lg max-w-md mx-auto leading-relaxed">Bạn chưa đăng ký tham gia đội nào cho cuộc thi này. Hãy hoàn tất đăng ký để xuất hiện trong danh sách.</p>
                </div>
                <Button
                  onPress={() => router.push(`/Contest/${contestId}/register`)}
                  className="bg-[#071739] text-white font-[1000] italic uppercase h-14 px-12 rounded-2xl shadow-2xl shadow-[#071739]/30 text-lg"
                >
                  Go to Registration
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
