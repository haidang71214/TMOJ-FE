"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Users, User, Shield, Info, CheckCircle2,
  ArrowRight, Plus, X, Laptop, Award,
  Clock, Calendar, Hash, UserPlus, Copy
} from "lucide-react";
import {
  Button, Card, CardBody, Input,
  RadioGroup, Radio, Divider, Chip,
  Avatar, AvatarGroup, Tabs, Tab
} from "@heroui/react";
import { toast } from "sonner";
import { useGetContestDetailQuery, useRegisterContestMutation, useJoinContestTeamByCodeMutation, useGetMyTeamInContestQuery, useJoinContestByCodeMutation } from "@/store/queries/Contest";
import { useCreateTeamMutation, useGetTeamDetailQuery, useAddTeamMemberMutation, useDeleteTeamMemberMutation } from "@/store/queries/Team";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useModal } from "@/Provider/ModalProvider";
import LoginModal from "@/app/Modal/LoginModal";

export default function ContestRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useModal();
  const contestId = params.id as string;
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Form State
  const [regMode, setRegMode] = useState("individual"); // individual, create_team, join_code
  const [teamName, setTeamName] = useState("");
  const [teamAvatarFile, setTeamAvatarFile] = useState<File | null>(null);
  const [teamAvatarPreview, setTeamAvatarPreview] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]); // Synced with teamDetail
  const [newMemberId, setNewMemberId] = useState("");
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const [teamInviteCode, setTeamInviteCode] = useState<string | null>(null);

  // APIs
  const { data: contestResult, isLoading: isContestLoading } = useGetContestDetailQuery(contestId);
  console.log("contestResult", contestResult);
  const [registerContest, { isLoading: isRegistering }] = useRegisterContestMutation();
  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const [joinContestTeamByCode, { isLoading: isJoiningTeamByCode }] = useJoinContestTeamByCodeMutation();
  const [joinContestByCode, { isLoading: isJoiningContestByCode }] = useJoinContestByCodeMutation();
  const [addTeamMember, { isLoading: isAddingMember }] = useAddTeamMemberMutation();
  const [deleteTeamMember, { isLoading: isDeletingMember }] = useDeleteTeamMemberMutation();

  // Load existing team state in this contest
  const { data: myTeamResult, isLoading: isMyTeamLoading } = useGetMyTeamInContestQuery(contestId);
  const myTeamInContest = myTeamResult?.data;

  const { data: teamDetail, refetch: refetchTeam } = useGetTeamDetailQuery(createdTeamId || "", {
    skip: !createdTeamId,
    pollingInterval: createdTeamId ? 5000 : 0, // Auto-update for leader when members join
  });

  useEffect(() => {
    if (teamDetail) {
      console.log("🔍 TEAM DETAIL DATA:", teamDetail);
      if (teamDetail.data.members?.length > 0) {
        console.log("👤 FIRST MEMBER SAMPLE:", teamDetail.data.members[0]);
      }
    }
  }, [teamDetail]);

  const contestData = contestResult?.data;
  const allowTeams = contestData?.allowTeams ?? true;

  const isRegExpired = contestData ? (new Date(contestData.startAt).getTime() - Date.now() < 8 * 60 * 60 * 1000) : false;

  // Restore state if user is already in a team
  useEffect(() => {
    if (myTeamInContest) {
      console.log("♻️ Restoring state from current team:", myTeamInContest);
      setCreatedTeamId(myTeamInContest.teamId || myTeamInContest.id || null);
      setTeamInviteCode(myTeamInContest.inviteCode);
      setTeamName(myTeamInContest.teamName);
      setRegMode(myTeamInContest.isPersonal ? "individual" : "create_team");
    }
  }, [myTeamInContest]);

  // Auto-set Solo mode if contest doesn't allow teams
  useEffect(() => {
    if (contestData && !allowTeams) {
      setRegMode("individual");
      console.log("ℹ️ Contest is Solo-Only. Team modes disabled.");
    }
  }, [contestData, allowTeams]);

  // Sync memberIds based on mode
  useEffect(() => {
    if (regMode === "individual") {
      if (currentUser?.userId) {
        setMemberIds([currentUser.userId]);
      }
    } else if (regMode === "create_team" && teamDetail?.data?.members) {
      setMemberIds(teamDetail.data.members.map(m => m.userId));
    } else if (myTeamInContest?.members) {
      // For members who joined via code
      setMemberIds(myTeamInContest.members.map(m => m.userId));
    }
  }, [teamDetail, regMode, currentUser, myTeamInContest]);

  // Auth Guard
  useEffect(() => {
    if (!isContestLoading && !currentUser) {
      toast.error("Vui lòng đăng nhập để đăng ký Contest!");
      router.push("/Contest"); // Quay lại danh sách thay vì 404
      openModal({ title: "Đăng nhập", content: <LoginModal /> });
    }
  }, [currentUser, isContestLoading, router, openModal]);

  const handleCopyInviteCode = () => {
    if (teamInviteCode) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(teamInviteCode);
        toast.success("Mã mời đã được sao chép!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = teamInviteCode;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success("Mã mời đã được sao chép!");
        } catch (err) {
          toast.error("Không thể sao chép tự động. Vui lòng sao chép thủ công.");
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTeam = async () => {
    if (teamName.trim().length < 3) {
      toast.error("Team name must be at least 3 characters!");
      return;
    }
    try {
      const result = await createTeam({
        teamName: teamName.trim(),
        avatarUrl: teamAvatarPreview || ""
      }).unwrap();
      setCreatedTeamId(result.data.teamId);
      console.log("result", result.data);
      setTeamInviteCode(result.data.inviteCode);
      toast.success("Team created successfully! Now add your members.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create team.");
    }
  };

  const handleAddMember = async () => {
    if (!createdTeamId) return;
    if (!newMemberId.trim()) {
      toast.error("Please enter a User ID to add.");
      return;
    }
    try {
      await addTeamMember({
        teamId: createdTeamId,
        userId: newMemberId.trim()
      }).unwrap();
      setNewMemberId("");
      toast.success("Member added to team!");
      refetchTeam(); // Refresh the list
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add member. Make sure the User ID is correct.");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!createdTeamId) return;
    if (userId === teamDetail?.data?.leaderId) {
      toast.error("Cannot remove the leader from the team!");
      return;
    }
    try {
      await deleteTeamMember({ teamId: createdTeamId, userId }).unwrap();
      toast.success("Member removed from team!");
      refetchTeam();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove member.");
    }
  };

  const handleJoinByCode = async () => {
    if (!inviteCode.trim()) {
      toast.error("Invite code is required!");
      return;
    }
    const code = inviteCode.trim();
    try {
      // First try to join contest (assuming it might be a general contest invite)
      try {
        const res = await joinContestByCode({ inviteCode: code }).unwrap();
        toast.success("Joined contest successfully!");
        const targetId = res?.data?.contestId || res?.data?.id || res?.data || contestId;
        router.push(`/Contest/${targetId}`);
      } catch (err) {
        // If it fails, it might be a specific team invite code
        await joinContestTeamByCode({ contestId, body: { code } }).unwrap();
        toast.success("Joined team! The leader will register for the contest.");
        router.push(`/Contest/${contestId}`);
      }

      // Clear code and state will be recovered by myTeamResult
      setInviteCode("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid invite code or failed to join.");
    }
  };

  const handleRegister = async () => {
    const ids = memberIds.filter(id => id.trim() !== "");
    const count = ids.length;

    if (regMode === "individual") {
      if (count !== 1) {
        toast.error("Solo registration requires exactly 1 player.");
        return;
      }
    } else if (regMode === "create_team") {
      if (count < 1 || count > 3) {
        toast.error(`Team registration requires 1 to 3 members. Current: ${count}`);
        return;
      }
    }

    try {
      const finalTeamName = regMode === "create_team"
        ? (teamDetail?.data?.teamName || teamName)
        : null;

      // Normalize IDs: trimmed, lowercase and unique
      const normalizedIds = Array.from(new Set(ids.map(id => id.trim().toLowerCase())));

      // Ensure Leader ID is at the first position for team registration
      const leaderIdToUse = (teamDetail?.data?.leaderId || currentUser?.userId || "").toLowerCase();
      const sortedMemberIds = regMode === "create_team"
        ? [leaderIdToUse, ...normalizedIds.filter(id => id !== leaderIdToUse)].filter(Boolean) as string[]
        : normalizedIds;

      const payload = {
        contestId,
        isTeam: regMode === "create_team",
        teamName: finalTeamName,
        memberIds: sortedMemberIds
      };

      console.group("🚀 CONTEST REGISTRATION DEBUG");
      console.log("Payload Settings:", { regMode, createdTeamId });
      console.log("Final Payload:", payload);
      console.log("Team Data from Server:", teamDetail?.data);
      console.groupEnd();

      const result = await registerContest({
        contestId,
        body: payload
      }).unwrap();

      toast.success(result.message || "Registered for contest successfully!");
      router.push(`/Contest/${contestId}`);
    } catch (error: any) {
      console.error("❌ REGISTRATION ERROR:", error);
      const serverMsg = error?.data?.message || error?.data?.title || error?.data?.detail;
      toast.error(serverMsg || "Registration failed. Verify all members (including leader) are in the team.");
    }
  };



  if (isContestLoading) {
    return <div className="min-h-screen flex items-center justify-center font-[1000] italic text-4xl uppercase animate-pulse">Loading Contest Info...</div>;
  }

  if (!contestData) {
    return <div className="min-h-screen flex items-center justify-center font-[1000] italic text-4xl uppercase">Contest Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] pb-20 transition-colors duration-500">
      {/* 1. BANNER SECTION */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <img
          src={(contestData as any).image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070"}
          alt={contestData.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0F2F5] dark:from-[#0A0F1C] via-black/50 to-transparent" />

        <div className="container mx-auto relative h-full flex flex-col justify-end p-10 text-white pb-32">
          <div className="max-w-4xl space-y-6 animate-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-wrap gap-3">
              <Chip className={`text-white font-black italic uppercase text-[10px] px-4 py-1.5 shadow-lg border-none ${contestData.status?.toLowerCase() === 'running' ? 'bg-green-500' : contestData.status?.toLowerCase() === 'upcoming' ? 'bg-[#FF5C00]' : 'bg-gray-500'}`} size="sm">
                {contestData.status || "Upcoming"}
              </Chip>
              <Chip className="bg-white/20 backdrop-blur-xl text-white font-black italic uppercase text-[10px] px-4 py-1.5 border border-white/20" size="sm">
                {contestData.visibility || "Public"}
              </Chip>
              <Chip className="bg-white/20 backdrop-blur-xl text-white font-black italic uppercase text-[10px] px-4 py-1.5 border border-[#FF5C00] text-[#FF5C00]" size="sm">
                {contestData.contestType === 'acm' ? 'ACM Format' : (contestData.contestType || "Standard")}
              </Chip>
            </div>

            <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase leading-[0.9] tracking-tighter">
              {contestData.title}
            </h1>
            {contestData.description && (
              <p className="text-white/80 font-medium text-lg max-w-2xl border-l-4 border-[#FF5C00] pl-4 italic">
                {contestData.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/20">
                  <Calendar className="w-5 h-5 text-[#FF5C00]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/50 leading-none mb-1 text-left">Starts At</p>
                  <p className="font-black italic uppercase text-sm leading-none">{new Date(contestData.startAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center border border-white/20">
                  <Clock className="w-5 h-5 text-[#FF5C00]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/50 leading-none mb-1 text-left">Duration</p>
                  <p className="font-black italic uppercase text-sm leading-none">{contestData.durationMinutes} Minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AvatarGroup isBordered max={3} size="sm" className="opacity-80">
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                </AvatarGroup>
                <p className="font-black italic uppercase text-xs">{(contestData as any).participants}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REGISTRATION FORM SECTION */}
      <div className="container mx-auto -mt-24 relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: FORM SIDE */}
          <div className="lg:col-span-8">
            <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
              <CardBody className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-12">

                  {/* Form Sidebar Info */}
                  <div className="md:col-span-4 bg-[#071739] p-10 text-white space-y-10">
                    <div>
                      <h3 className="text-2xl font-[1000] italic uppercase leading-none mb-4">
                        Reg<br /><span className="text-[#FF5C00]">Process</span>
                      </h3>
                      <p className="text-gray-400 text-xs font-semibold uppercase leading-relaxed">
                        Complete all information to secure your spot in this championship.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-[#FF5C00] flex items-center justify-center shrink-0">
                          <span className="font-black italic">01</span>
                        </div>
                        <p className="text-[10px] font-black uppercase italic leading-tight pt-1">Choose participation mode</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <span className="font-black italic">02</span>
                        </div>
                        <p className="text-[10px] font-black uppercase italic leading-tight pt-1 text-white/50">Setup Team / Join with Code</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <span className="font-black italic">03</span>
                        </div>
                        <p className="text-[10px] font-black uppercase italic leading-tight pt-1 text-white/50">Finalize Contest Registration</p>
                      </div>
                    </div>

                    <div className="pt-10">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-4 h-4 text-[#FF5C00]" />
                          <span className="text-[10px] font-black uppercase italic">Prizes at stake</span>
                        </div>
                        <p className="text-xl font-black italic uppercase leading-none">{contestData.totalPoints || 0} <span className="text-[10px] text-[#FF5C00]">Total Points Pool</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Actual Form Fields */}
                  <div className="md:col-span-8 p-10 dark:bg-[#1e293b]">
                    <div className="space-y-10">

                      {/* Step 1: Mode Selection */}
                      <div className="space-y-6 animate-in fade-in duration-500">
                        <RadioGroup
                          label={<span className="text-xs font-black italic uppercase text-gray-400">Section 01: Participation Mode</span>}
                          value={regMode}
                          onValueChange={setRegMode}
                          orientation="horizontal"
                          classNames={{ wrapper: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2" }}
                        >
                          <Radio value="individual" classNames={{
                            base: `inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse 
                                   w-full cursor-pointer rounded-2xl gap-4 p-4 border-2 transition-all
                                   ${regMode === "individual" ? "border-[#FF5C00] shadow-lg shadow-[#FF5C00]/10" : "border-transparent"}`,
                            wrapper: "hidden"
                          }}>
                            <div className="flex flex-col gap-1 items-start">
                              <User className={`w-5 h-5 ${regMode === "individual" ? "text-[#FF5C00]" : "text-gray-400"}`} />
                              <span className="text-[10px] font-black uppercase italic">Solo Player</span>
                            </div>
                          </Radio>

                          {allowTeams && (
                            <>
                              <Radio value="create_team" classNames={{
                                base: `inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse 
                                       w-full cursor-pointer rounded-2xl gap-4 p-4 border-2 transition-all
                                       ${regMode === "create_team" ? "border-[#FF5C00] shadow-lg shadow-[#FF5C00]/10" : "border-transparent"}`,
                                wrapper: "hidden"
                              }}>
                                <div className="flex flex-col gap-1 items-start">
                                  <Users className={`w-5 h-5 ${regMode === "create_team" ? "text-[#FF5C00]" : "text-gray-400"}`} />
                                  <span className="text-[10px] font-black uppercase italic">Create Team</span>
                                </div>
                              </Radio>

                              <Radio value="join_code" classNames={{
                                base: `inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse 
                                       w-full cursor-pointer rounded-2xl gap-4 p-4 border-2 transition-all
                                       ${regMode === "join_code" ? "border-[#FF5C00] shadow-lg shadow-[#FF5C00]/10" : "border-transparent"}`,
                                wrapper: "hidden"
                              }}>
                                <div className="flex flex-col gap-1 items-start">
                                  <Hash className={`w-5 h-5 ${regMode === "join_code" ? "text-[#FF5C00]" : "text-gray-400"}`} />
                                  <span className="text-[10px] font-black uppercase italic">Join by Code</span>
                                </div>
                              </Radio>
                            </>
                          )}
                        </RadioGroup>

                        {!allowTeams && (
                          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3 animate-in-fade-in">
                            <Info className="text-orange-500" size={16} />
                            <p className="text-[10px] font-black text-orange-600 uppercase italic">This contest only supports Solo Registration.</p>
                          </div>
                        )}
                      </div>

                      <Divider />

                      {/* Step 2: Content based on Mode */}
                      <div className="space-y-8 animate-in fade-in duration-700">
                        {regMode === "individual" && (
                          <div className="space-y-4">
                            <span className="text-xs font-black italic uppercase text-gray-400">Section 02: Solo Registration</span>
                            <div className="p-6 bg-content1 rounded-2xl border-2 border-dashed border-[#FF5C00]/20 flex items-center gap-4">
                              <Avatar src={currentUser?.avatarUrl || undefined} name={currentUser?.displayName || currentUser?.username} size="lg" isBordered color="warning" />
                              <div>
                                <p className="text-sm font-black italic uppercase">{currentUser?.displayName || currentUser?.username}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">{currentUser?.email}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {regMode === "create_team" && (
                          <div className="space-y-6">
                            <span className="text-xs font-black italic uppercase text-gray-400">Section 02: Setup Your Team</span>

                            {!createdTeamId ? (
                              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    label="TEAM NAME (MIN 3 CHARS)"
                                    value={teamName}
                                    onValueChange={setTeamName}
                                    placeholder="E.g. PRO PE 1"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                      inputWrapper: `h-14 rounded-2xl border-2 transition-colors ${teamName.length > 0 && teamName.length < 3 ? "border-danger" : "hover:border-[#FF5C00]"}`,
                                      label: "font-black italic uppercase text-[10px] pl-2 mb-2",
                                      input: "font-black uppercase italic text-sm"
                                    }}
                                  />
                                  <div className="flex flex-col gap-2">
                                    <label className="font-black italic uppercase text-[10px] pl-2">
                                      TEAM AVATAR (OPTIONAL)
                                    </label>
                                    <div className="flex items-center gap-4 h-14 px-4 bg-white dark:bg-[#1C2737] rounded-2xl border-2 border-dashed border-[#FF5C00]/20 hover:border-[#FF5C00]/50 transition-all cursor-pointer relative overflow-hidden group">
                                      {teamAvatarPreview ? (
                                        <Avatar src={teamAvatarPreview} size="sm" className="border-2 border-[#FF5C00]" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#FF5C00]/10 flex items-center justify-center border-2 border-dashed border-[#FF5C00]/30 group-hover:bg-[#FF5C00]/20 transition-all">
                                          <Plus className="text-[#FF5C00]" size={16} />
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase italic leading-none mb-0.5 truncate">
                                          {teamAvatarFile ? teamAvatarFile.name : "Click to upload image"}
                                        </p>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase">
                                          PNG, JPG, WEBP (Max 2MB)
                                        </p>
                                      </div>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  fullWidth
                                  className="h-16 bg-[#071739] text-white font-black italic uppercase rounded-2xl text-lg shadow-xl shadow-[#071739]/20"
                                  onPress={handleCreateTeam}
                                  isLoading={isCreatingTeam}
                                >
                                  Create Team
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                <div className="p-6 bg-green-50 dark:bg-green-900/10 border-2 border-green-500/20 rounded-[2rem] flex justify-between items-center animate-in zoom-in-95">
                                  <div className="flex items-center gap-4">
                                    <Avatar src={teamAvatarPreview || undefined} name={teamName} size="lg" className="border-2 border-green-500" />
                                    <div>
                                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Team ID: {createdTeamId.slice(0, 8)}...</p>
                                      <p className="text-2xl font-[1000] italic text-green-700 uppercase leading-none">{teamName}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm font-black italic text-green-600/70 uppercase tracking-tighter">Invite Code: {teamInviteCode}</p>
                                        <Button
                                          isIconOnly
                                          size="sm"
                                          variant="light"
                                          className="text-green-600 h-6 w-6 min-w-0"
                                          onPress={handleCopyInviteCode}
                                        >
                                          <Copy size={12} />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <Chip color="success" variant="flat" className="font-black italic border-none h-10 px-6">ACTIVE</Chip>
                                </div>

                                <Divider />

                                <div className="space-y-4">
                                  <div className="flex justify-between items-end">
                                    <p className="text-xs font-black uppercase text-gray-400">Add Team Members ({memberIds.length}/3)</p>
                                    < Chip size="sm" variant="dot" color={memberIds.length < 1 ? "warning" : "success"} className="font-black italic text-[9px] uppercase">
                                      {memberIds.length < 1 ? "Needs members" : "Ready to register"}
                                    </Chip>
                                  </div>

                                  <div className="flex gap-3">
                                    <Input
                                      value={newMemberId}
                                      onValueChange={setNewMemberId}
                                      placeholder="ENTER USER ID (UUID)"
                                      variant="bordered"
                                      className="flex-1"
                                      classNames={{
                                        inputWrapper: "h-14 rounded-2xl border-2",
                                        input: "font-bold text-xs"
                                      }}
                                      startContent={<UserPlus size={18} className="text-[#FF5C00]" />}
                                    />
                                    <Button
                                      className="h-14 bg-[#FF5C00] text-white font-black italic uppercase rounded-2xl px-8"
                                      onPress={handleAddMember}
                                      isLoading={isAddingMember}
                                      isDisabled={memberIds.length >= 3}
                                    >
                                      Add
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3 pt-4">
                                    {teamDetail?.data?.members?.map((m: any, index: number) => {
                                      // Priority: displayName > userName > (firstName + lastName) > username > Member ID
                                      const fullName = m.displayName || m.user?.displayName || m.userName || (m.firstName || m.lastName ? `${m.firstName || ""} ${m.lastName || ""}`.trim() : null) || m.username || m.user?.username || `Member ${m.userId?.slice(0, 4) || "????"}`;
                                      const emailDisplay = m.email || m.user?.email || "Email not public";

                                      return (
                                        <div key={m.userId} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 group animate-in slide-in-from-left-2 transition-all hover:border-[#FF5C00]/30 shadow-sm">
                                          <div className="flex items-center gap-4">
                                            <Avatar
                                              src={m.avatarUrl || m.user?.avatarUrl || undefined}
                                              name={fullName}
                                              className="w-10 h-10 border-2 border-[#071739]"
                                            />
                                            <div className="text-left">
                                              <p className="text-xs font-black uppercase italic leading-none truncate max-w-[200px]">
                                                {m.userId === currentUser?.userId ? (currentUser?.displayName || currentUser?.username) : fullName}
                                              </p>
                                              <p className="text-[9px] text-gray-400 font-bold lowercase truncate max-w-[200px]">
                                                {m.userId === currentUser?.userId ? currentUser?.email : emailDisplay}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {m.userId !== teamDetail.data.leaderId && (
                                              <div className="flex items-center gap-2">
                                                <div className="text-[9px] font-black italic text-green-500 uppercase">Verified Member</div>
                                                <Button
                                                  isIconOnly
                                                  size="sm"
                                                  variant="flat"
                                                  color="danger"
                                                  className="h-7 w-7 min-w-0 rounded-lg group-hover:bg-danger group-hover:text-white transition-all shadow-sm"
                                                  onPress={() => handleRemoveMember(m.userId)}
                                                  isLoading={isDeletingMember}
                                                >
                                                  <X size={14} />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>



                                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 mt-2">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase italic leading-relaxed">
                                      * Important: Every member must be added to the team system before you can register for the contest.
                                      You can register with <span className="text-[#FF5C00]">up to 3 members</span>.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {regMode === "join_code" && (
                          <div className="space-y-6">
                            <span className="text-xs font-black italic uppercase text-gray-400">Section 02: Join Existing Team / Contest</span>
                            <div className="flex gap-4">
                              <Input
                                label="ENTER INVITE CODE"
                                value={inviteCode}
                                onValueChange={setInviteCode}
                                placeholder="E.g. ac2009b2"
                                variant="bordered"
                                labelPlacement="outside"
                                className="flex-1"
                                classNames={{
                                  inputWrapper: "h-14 rounded-2xl border-2 hover:border-[#FF5C00] focus-within:border-[#FF5C00] transition-colors",
                                  label: "font-black italic uppercase text-[10px] pl-2 mb-2",
                                  input: "font-[1000] uppercase italic text-lg tracking-widest"
                                }}
                              />
                              <Button
                                className="h-14 mt-6 bg-[#FF5C00] text-white font-black italic uppercase rounded-2xl px-10 shadow-lg shadow-[#FF5C00]/20"
                                onPress={handleJoinByCode}
                                isLoading={isJoiningTeamByCode || isJoiningContestByCode}
                              >
                                Join Now
                              </Button>
                            </div>

                            {myTeamInContest && !myTeamInContest.isPersonal && (
                              <div className="p-6 bg-green-50 dark:bg-green-900/10 border-2 border-green-500/20 rounded-[2rem] animate-in zoom-in-95">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <Avatar src={myTeamInContest.avatarUrl || undefined} name={myTeamInContest.teamName} size="lg" className="border-2 border-green-500" />
                                    <div>
                                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none mb-1">You Joined Team</p>
                                      <p className="text-2xl font-[1000] italic text-green-700 uppercase leading-none">{myTeamInContest.teamName}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Leader: {myTeamInContest.members.find(m => m.userId === myTeamInContest.leaderId)?.displayName || "Team Leader"}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <Chip color="success" variant="solid" className="font-black italic border-none text-white">READY</Chip>
                                </div>
                                <div className="mt-4 flex gap-2">
                                  <AvatarGroup max={5} size="sm" isBordered>
                                    {myTeamInContest.members.map(m => (
                                      <Avatar key={m.userId} src={m.avatarUrl || undefined} name={m.displayName} />
                                    ))}
                                  </AvatarGroup>
                                  <p className="text-[10px] font-bold text-gray-500 uppercase self-center italic">Leader will handle the registration.</p>
                                </div>
                              </div>
                            )}

                            <div className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-300">
                              <p className="text-[11px] font-black uppercase text-gray-500 leading-relaxed text-center">
                                Once you join a team or contest, the system will prepare your participant profile.
                                Team leaders are responsible for final contest registration.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* RIGHT: SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <Card className="rounded-[2.5rem] bg-[#FF5C00] text-white p-6 shadow-[0_32px_64px_-12px_rgba(255,92,0,0.3)] border-none">
              <CardBody className="p-0 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase italic opacity-60">Selected Contest</p>
                    <h4 className="text-xl font-black italic uppercase leading-none">{contestData.title}</h4>
                  </div>
                  <Laptop className="w-8 h-8 opacity-40 shrink-0" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black/10 p-4 rounded-2xl">
                    <span className="text-[10px] font-black italic uppercase">Mode</span>
                    <span className="text-xs font-[1000] italic uppercase bg-white text-[#FF5C00] px-3 py-1 rounded-full">{regMode.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/10 p-4 rounded-2xl">
                    <span className="text-[10px] font-black italic uppercase">Total Members</span>
                    <span className="text-xs font-[1000] italic uppercase bg-white text-[#FF5C00] px-3 py-1 rounded-full">
                      {regMode === 'individual' ? 1 : memberIds.length}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-4 h-4 rounded border-2 border-white flex items-center justify-center">
                        <CheckCircle2 size={10} />
                      </div>
                    </div>
                    <p className="text-[9px] font-black italic uppercase leading-relaxed text-white/80">
                      I agree to the competition rules and honor code. Team leaders handle registration for the entire team.
                    </p>
                  </div>

                  {regMode !== "join_code" && (
                    <Button
                      fullWidth
                      size="lg"
                      isLoading={isRegistering}
                      isDisabled={(regMode === "individual" && memberIds.length !== 1) || (regMode === "create_team" && (memberIds.length < 1 || memberIds.length > 3)) || isRegExpired}
                      className={`font-[1000] italic uppercase h-16 rounded-[1.5rem] shadow-lg transition-all ${isRegExpired ? "bg-gray-500 text-gray-300" : "bg-[#071739] text-white shadow-[#071739]/40 hover:scale-[1.02] active:scale-95"}`}
                      onPress={handleRegister}
                    >
                      {isRegExpired ? "Registration Closed" : "Confirm Registration"}
                    </Button>
                  )}
                  {regMode === "join_code" && (
                    <div className="bg-black/20 p-4 rounded-2xl text-center">
                      <p className="text-[10px] font-black italic uppercase">Registration is handled by your Team Leader after you join.</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border-none shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#FF5C00]" />
                <h4 className="text-sm font-black italic uppercase">Official Requirements</h4>
              </div>
              <ul className="space-y-4">
                {[
                  "Solo: Exactly 1 player",
                  "Team: 1 to 3 members",
                  "Leader handles registration",
                  "Verified IDs required",
                  "Registration deadline: 8h before start"
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3 items-center text-[11px] font-black italic uppercase text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
              <Divider />
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-4 text-gray-400">
                  <Info size={16} />
                  <p className="text-[10px] font-black italic uppercase">Registration changes lock 2h before start.</p>
                </div>
                <div className="flex items-center gap-4 text-red-500/80">
                  <Clock size={16} />
                  <p className="text-[10px] font-black italic uppercase">Registration closes 8h before start.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
