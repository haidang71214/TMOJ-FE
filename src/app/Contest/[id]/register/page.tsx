"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Input,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  Chip,
} from "@heroui/react";
import {
  ChevronLeft,
  Trophy,
  ShieldAlert,
  Users,
  User as UserIcon,
  Coins,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner"; // Import Sonner Toast

/* ---------------- MOCK DATA ---------------- */
const activeContests = [
  {
    id: 1,
    title: "FPTU Coding Master Spring 2026",
    status: "Running",
    endsIn: "02h 45m",
    participants: 1240,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070",
    description:
      "Challenge your limits with top-tier algorithmic problems. An opportunity to shine and earn valuable rewards from TMOJ.",
  },
  {
    id: 2,
    title: "Weekly Challenge #42: Dynamic Programming",
    status: "Upcoming",
    startsIn: "1d 12h",
    participants: 856,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
    description:
      "Practice dynamic programming from basic to advanced levels with the TMOJ community.",
  },
];

export default function ContestRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = Number(params.id);

  // 1. Fetch contest data
  const contestData = useMemo(() => {
    return activeContests.find((c) => c.id === contestId) || activeContests[0];
  }, [contestId]);

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

  // 4. Registration Submission with Sonner & Redirect
  const handleRegister = () => {
    if (regMode === "team" && !teamName.trim()) {
      toast.error("Team name is required!");
      return;
    }

    const payload = {
      contestId: contestData.id,
      mode: regMode,
      teamName: regMode === "team" ? teamName : "Individual",
      participants: members,
    };

    console.log("Submitting Registration:", payload);

    // Sử dụng Sonner Toast đồng bộ
    toast.success(
      `Registered successfully ${
        regMode === "team" ? `for team ${teamName}` : "as Individual"
      }!`
    );

    // Chuyển hướng sang trang Contest/[id]/page.tsx
    router.push(`/Contest/${contestId}`);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] pb-20 transition-colors duration-500">
      {/* 1. BANNER SECTION */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <img
          src={contestData.image}
          alt={contestData.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0F2F5] dark:from-[#0A0F1C] via-black/50 to-transparent" />

        <div className="container mx-auto relative h-full flex flex-col justify-end p-10 text-white pb-32">
          <Button
            isIconOnly
            variant="flat"
            className="absolute top-10 left-10 bg-white/20 backdrop-blur-md text-white border-none z-30"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} />
          </Button>

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Chip
              color="warning"
              variant="shadow"
              className="font-black italic uppercase text-[10px]"
            >
              {contestData.status} Contest
            </Chip>
            <h1 className="text-5xl md:text-6xl font-[1000] italic uppercase tracking-tighter leading-tight max-w-4xl text-white">
              {contestData.title}
            </h1>
            <p className="max-w-2xl text-lg font-medium text-slate-100 italic opacity-90 leading-relaxed">
              {contestData.description}
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <main className="max-w-[1300px] mx-auto mt-[-60px] relative z-20 px-4 flex flex-col lg:flex-row gap-8">
        {/* LEFT: INFORMATION */}
        <div className="flex-1 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] bg-white dark:bg-[#111c35]">
            <CardBody className="p-10 space-y-8">
              <div className="flex items-center gap-4 border-b dark:border-white/5 pb-6">
                <Trophy className="text-[#FFB800]" size={32} />
                <h2 className="text-3xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white leading-none">
                  Prizes & Benefits
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 rounded-3xl border-2 border-yellow-400 bg-yellow-50/50 dark:bg-yellow-400/5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 italic">
                    1st Place
                  </p>
                  <div className="text-2xl font-[1000] text-[#FFB800] italic flex items-center justify-center gap-1">
                    <Coins size={20} /> 5,000
                  </div>
                  <div className="text-xs font-bold text-blue-500 italic">
                    +2,000 EXP Points
                  </div>
                </div>

                <div className="p-6 rounded-3xl border-2 border-slate-300 bg-slate-50 dark:bg-white/5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 italic">
                    2nd Place
                  </p>
                  <div className="text-2xl font-[1000] text-slate-400 italic flex items-center justify-center gap-1">
                    <Coins size={20} /> 3,000
                  </div>
                  <div className="text-xs font-bold text-blue-500 italic">
                    +1,200 EXP Points
                  </div>
                </div>

                <div className="p-6 rounded-3xl border-2 border-orange-400 bg-orange-50/50 dark:bg-orange-400/5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 italic">
                    Top 10
                  </p>
                  <div className="text-2xl font-[1000] text-orange-500 italic flex items-center justify-center gap-1">
                    <Coins size={20} /> 1,000
                  </div>
                  <div className="text-xs font-bold text-blue-500 italic">
                    +500 EXP Points
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem] bg-white dark:bg-[#111c35]">
            <CardBody className="p-10 space-y-8">
              <div className="flex items-center gap-4 border-b dark:border-white/5 pb-6">
                <ShieldAlert className="text-rose-500" size={32} />
                <h2 className="text-3xl font-[1000] italic uppercase tracking-tight text-[#071739] dark:text-white leading-none">
                  Contest Rules
                </h2>
              </div>
              <ul className="space-y-6 font-bold italic text-slate-600 dark:text-slate-400">
                <li className="flex gap-4">
                  <span className="text-rose-500 font-black">01.</span>
                  No external AI tools or unauthorized resources allowed.
                </li>
                <li className="flex gap-4">
                  <span className="text-rose-500 font-black">02.</span>
                  One registration per account (Solo or Team).
                </li>
                <li className="flex gap-4">
                  <span className="text-rose-500 font-black">03.</span>
                  Plagiarism results in a permanent ban.
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT: REGISTRATION FORM */}
        <div className="w-full lg:w-[450px]">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-[#111c35] sticky top-8">
            <CardBody className="p-10 space-y-10">
              <div className="text-center space-y-1">
                <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter leading-none text-[#FF5C00]">
                  Registration
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mt-2">
                  SECURE YOUR SPOT NOW
                </p>
              </div>

              <RadioGroup
                label="PARTICIPANT MODE"
                value={regMode}
                onValueChange={(val) => {
                  setRegMode(val);
                  setMembers([{ name: "", studentId: "" }]);
                }}
                classNames={{
                  label:
                    "font-black italic uppercase text-[10px] mb-3 tracking-widest text-slate-400",
                }}
              >
                <div className="flex gap-4">
                  <Radio
                    value="individual"
                    className="flex-1 border-2 border-divider p-5 rounded-3xl data-[selected=true]:border-[#FF5C00]"
                  >
                    <div className="flex items-center gap-2 font-bold italic">
                      <UserIcon size={16} /> Solo
                    </div>
                  </Radio>
                  <Radio
                    value="team"
                    className="flex-1 border-2 border-divider p-5 rounded-3xl data-[selected=true]:border-[#FF5C00]"
                  >
                    <div className="flex items-center gap-2 font-bold italic">
                      <Users size={16} /> Team
                    </div>
                  </Radio>
                </div>
              </RadioGroup>

              <div className="space-y-6">
                {regMode === "team" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                      label="TEAM NAME"
                      placeholder="Enter team name"
                      labelPlacement="outside"
                      variant="bordered"
                      value={teamName}
                      onValueChange={setTeamName}
                      classNames={{
                        label:
                          "font-black italic text-[10px] text-[#FF5C00] mb-2",
                        input: "font-bold italic uppercase h-12",
                        inputWrapper: "border-2 rounded-2xl",
                      }}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-[10px] font-black italic uppercase text-slate-400 tracking-widest">
                    {regMode === "team" ? "TEAM MEMBERS" : "PARTICIPANT INFO"} (
                    {members.length}/5)
                  </p>

                  {members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-6 border-2 border-divider rounded-[2rem] relative bg-slate-50 dark:bg-black/20 group transition-all"
                    >
                      {regMode === "team" && members.length > 1 && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onPress={() => removeMember(idx)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                      <div className="space-y-6">
                        <Input
                          label="FULL NAME"
                          labelPlacement="outside"
                          placeholder="e.g. JRim"
                          variant="underlined"
                          value={member.name}
                          onValueChange={(val) =>
                            updateMember(idx, "name", val)
                          }
                          classNames={{
                            label: "font-black text-[10px] italic",
                            input: "font-bold italic",
                          }}
                        />
                        <Input
                          label="STUDENT ID"
                          labelPlacement="outside"
                          placeholder="e.g. DE180459"
                          variant="underlined"
                          value={member.studentId}
                          onValueChange={(val) =>
                            updateMember(idx, "studentId", val)
                          }
                          classNames={{
                            label: "font-black text-[10px] italic",
                            input: "font-bold italic",
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {regMode === "team" && members.length < 5 && (
                    <Button
                      fullWidth
                      variant="bordered"
                      startContent={<Plus size={18} strokeWidth={3} />}
                      className="border-2 border-dashed font-[1000] italic uppercase text-xs h-14 rounded-2xl border-slate-300 dark:border-white/10"
                      onPress={addMember}
                    >
                      Add Team Member
                    </Button>
                  )}
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                className="bg-[#FF5C00] text-white font-[1000] italic uppercase h-16 rounded-[1.5rem] shadow-[0_15px_40px_rgba(255,92,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
                onPress={handleRegister}
              >
                Confirm & Register Now
              </Button>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
