"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Users, User, Shield, Info, CheckCircle2, 
  ArrowRight, Plus, X, Laptop, Award,
  Clock, Calendar
} from "lucide-react";
import { 
  Button, Card, CardBody, Input, 
  RadioGroup, Radio, Divider, Chip,
  Avatar, AvatarGroup
} from "@heroui/react";
import { toast } from "sonner"; // Import Sonner Toast
import { useGetContestDetailQuery, useJoinContestMutation } from "@/store/queries/Contest";

export default function ContestRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.id as string;

  // 1. Fetch contest data from API
  const { data: contestResult, isLoading } = useGetContestDetailQuery(contestId);
  const [joinContest, { isLoading: isJoining }] = useJoinContestMutation();

  const contestData = contestResult?.data;

  // 2. Form State Management
  const [regMode, setRegMode] = useState("individual");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([{ name: "", studentId: "" }]);

  // 3. Member Handlers
  const addMember = () => {
    if (members.length < 5)
      setMembers([...members, { name: "", studentId: "" }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  // 4. Registration Submission with API support
  const handleRegister = async () => {
    if (regMode === "team" && !teamName.trim()) {
      toast.error("Team name is required!");
      return;
    }

    try {
      // In real scenario, you'd create a team first if regMode === "team"
      // and then join with teamId. For now, following user's simple join API.
      const result = await joinContest({
        id: contestId,
        body: {
          contestId: contestId,
          teamId: regMode === "team" ? "MOCK_TEAM_ID" : undefined, // Placeholder for team implementation
        },
      }).unwrap();

      toast.success(result.message || "Registered successfully!");
      router.push(`/Contest/${contestId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed. Please try again.");
    }
  };

  if (isLoading) {
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
              <Chip className="bg-[#FF5C00] text-white font-black italic uppercase text-[10px] px-4 py-1.5 shadow-lg border-none" size="sm">
                Registration Open
              </Chip>
              <Chip className="bg-white/20 backdrop-blur-xl text-white font-black italic uppercase text-[10px] px-4 py-1.5 border border-white/20" size="sm">
                Competitive Programing
              </Chip>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase leading-[0.9] tracking-tighter">
              {contestData.title}
            </h1>

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
                  <p className="font-black italic uppercase text-sm leading-none">05 Hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AvatarGroup isBordered max={3} size="sm" className="opacity-80">
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                </AvatarGroup>
                <p className="font-black italic uppercase text-xs">Join {(contestData as any).participants || 1200}+ Students</p>
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
                        Reg<br/><span className="text-[#FF5C00]">Process</span>
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
                        <p className="text-[10px] font-black uppercase italic leading-tight pt-1">Choose your participation mode (Individual/Team)</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <span className="font-black italic">02</span>
                        </div>
                        <p className="text-[10px] font-black uppercase italic leading-tight pt-1 text-white/50">Enter participant details & ID</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <span className="font-black italic">03</span>
                        </div>
                        <p className="text-[10px] font-black uppercase italic leading-tight pt-1 text-white/50">Confirm registration and start prep</p>
                      </div>
                    </div>

                    <div className="pt-10">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-4 h-4 text-[#FF5C00]" />
                          <span className="text-[10px] font-black uppercase italic">Prizes at stake</span>
                        </div>
                        <p className="text-xl font-black italic uppercase leading-none">$2,500 <span className="text-[10px] text-[#FF5C00]">Total pool</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Actual Form Fields */}
                  <div className="md:col-span-8 p-10 dark:bg-[#1e293b]">
                    <div className="space-y-10">
                      
                      {/* Step 1: Mode Selection */}
                      <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center gap-3">
                          <RadioGroup 
                            label={<span className="text-xs font-black italic uppercase text-gray-400">Section 01: Participation Mode</span>}
                            value={regMode}
                            onValueChange={setRegMode}
                            orientation="horizontal"
                            classNames={{ wrapper: "gap-6 pt-2" }}
                          >
                            <div className="flex gap-4">
                              <Radio value="individual" classNames={{
                                base: `inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse 
                                       max-w-[180px] cursor-pointer rounded-2xl gap-4 p-4 border-2 transition-all
                                       ${regMode === "individual" ? "border-[#FF5C00] shadow-lg shadow-[#FF5C00]/10" : "border-transparent"}`,
                                wrapper: "hidden"
                              }}>
                                <div className="flex flex-col gap-1 items-start">
                                  <User className={`w-5 h-5 ${regMode === "individual" ? "text-[#FF5C00]" : "text-gray-400"}`} />
                                  <span className="text-xs font-black uppercase italic">Solo Player</span>
                                </div>
                              </Radio>

                              <Radio value="team" classNames={{
                                base: `inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse 
                                       max-w-[180px] cursor-pointer rounded-2xl gap-4 p-4 border-2 transition-all
                                       ${regMode === "team" ? "border-[#FF5C00] shadow-lg shadow-[#FF5C00]/10" : "border-transparent"}`,
                                wrapper: "hidden"
                              }}>
                                <div className="flex flex-col gap-1 items-start">
                                  <Users className={`w-5 h-5 ${regMode === "team" ? "text-[#FF5C00]" : "text-gray-400"}`} />
                                  <span className="text-xs font-black uppercase italic">Team Force</span>
                                </div>
                              </Radio>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <Divider />

                      {/* Step 2: Member Info */}
                      <div className="space-y-8 animate-in fade-in duration-700">
                        <div>
                          <span className="text-xs font-black italic uppercase text-gray-400">Section 02: Details</span>
                          <h4 className="text-xl font-black italic uppercase mt-1">Participant Info</h4>
                        </div>

                        <div className="space-y-6">
                          {regMode === "team" && (
                            <div className="animate-in zoom-in-95 duration-300">
                              <Input
                                label="TEAM NAME"
                                value={teamName}
                                onValueChange={setTeamName}
                                placeholder="THE AVENGERS"
                                variant="bordered"
                                labelPlacement="outside"
                                classNames={{
                                  inputWrapper: "h-14 rounded-2xl border-2 hover:border-[#FF5C00] focus-within:border-[#FF5C00] transition-colors",
                                  label: "font-black italic uppercase text-[10px] tracking-widest pl-2 mb-2",
                                  input: "font-black uppercase italic text-sm"
                                }}
                              />
                            </div>
                          )}

                          <div className="space-y-4">
                            {members.map((member, index) => (
                              <div key={index} className="flex gap-4 items-end animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                  <Input
                                    label={index === 0 ? "FULL NAME" : ""}
                                    placeholder="LEBRON JAMES"
                                    value={member.name}
                                    onChange={(e) => updateMember(index, "name", e.target.value)}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                      inputWrapper: "h-14 rounded-2xl border-2 hover:border-[#FF5C00] focus-within:border-[#FF5C00] transition-colors",
                                      label: "font-black italic uppercase text-[10px] tracking-widest pl-2 mb-2",
                                      input: "font-black uppercase italic text-sm"
                                    }}
                                  />
                                  <Input
                                    label={index === 0 ? "STUDENT ID" : ""}
                                    placeholder="FPT-12345"
                                    value={member.studentId}
                                    onChange={(e) => updateMember(index, "studentId", e.target.value)}
                                    variant="bordered"
                                    labelPlacement="outside"
                                    classNames={{
                                      inputWrapper: "h-14 rounded-2xl border-2 hover:border-[#FF5C00] focus-within:border-[#FF5C00] transition-colors",
                                      label: "font-black italic uppercase text-[10px] tracking-widest pl-2 mb-2",
                                      input: "font-black uppercase italic text-sm"
                                    }}
                                  />
                                </div>
                                {regMode === "team" && index > 0 && (
                                  <Button isIconOnly variant="flat" color="danger" className="h-14 w-14 rounded-2xl shrink-0" onClick={() => removeMember(index)}>
                                    <X size={20} />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          {regMode === "team" && members.length < 5 && (
                            <Button
                              variant="flat"
                              className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#FF5C00] transition-all bg-transparent font-black uppercase italic italic text-gray-400 hover:text-[#FF5C00]"
                              startContent={<Plus size={18} />}
                              onClick={addMember}
                            >
                              Add Team Member ({members.length}/5)
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* RIGHT: SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
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
                    <span className="text-[10px] font-black italic uppercase">Participation Mode</span>
                    <span className="text-xs font-[1000] italic uppercase bg-white text-[#FF5C00] px-3 py-1 rounded-full">{regMode}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/10 p-4 rounded-2xl">
                    <span className="text-[10px] font-black italic uppercase">Total Members</span>
                    <span className="text-xs font-[1000] italic uppercase bg-white text-[#FF5C00] px-3 py-1 rounded-full">{members.length}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className="w-4 h-4 rounded border-2 border-white flex items-center justify-center">
                        <CheckCircle2 size={10} />
                      </div>
                    </div>
                    <p className="text-[9px] font-black italic uppercase leading-relaxed text-white/80">
                      I understand that by registering I agree to follow the competition rules, honor code, and professional conduct guidelines.
                    </p>
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    isLoading={isJoining}
                    className="bg-[#071739] text-white font-[1000] italic uppercase h-16 rounded-[1.5rem] shadow-[0_15px_40px_rgba(7,23,57,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
                    onPress={handleRegister}
                  >
                    Confirm & Register Now
                  </Button>
                </div>
              </CardBody>
            </Card>

            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border-none shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#FF5C00]" />
                <h4 className="text-sm font-black italic uppercase">Competition Safeguard</h4>
              </div>
              <ul className="space-y-4">
                {[
                  "No plagiarism tolerated",
                  "Single account per person",
                  "Verified university student ID required",
                  "Auto-disqualification on rule breach"
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3 items-center text-[11px] font-black italic uppercase text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
              <Divider />
              <div className="flex items-center gap-4 text-gray-400">
                <Info size={16} />
                <p className="text-[10px] font-black italic uppercase italic">Registration closes 2 hours before start.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
