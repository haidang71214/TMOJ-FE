"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  HelpCircle, BarChart2, Award,
  AlertCircle, Clock, CheckCircle2, Copy, Hash, ShieldCheck
} from "lucide-react";
import {
  Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell, Card, CardBody, Divider, Button,
  Chip
} from "@heroui/react";
import { Check } from "lucide-react";
import { addToast } from "@heroui/toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/types";

import { useGetContestDetailQuery, useGetMyTeamInContestQuery } from "@/store/queries/Contest";
import ContestHeader from "./components/ContestHeader";

export default function ContestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = params.id as string;

  const { data: contestData, isLoading } = useGetContestDetailQuery(contestId);
  const { data: myTeamResult } = useGetMyTeamInContestQuery(contestId, {
    skip: !contestId,
  });
  const isRegistered = contestData?.data?.isRegistered || !!myTeamResult?.data;

  const [selectedTab] = useState("info");
  const [copied, setCopied] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const role = currentUser?.role?.toLowerCase();
  const isAdminOrTeacher = role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.TEACHER;

  if (isLoading) {
    return <div className="text-center py-20 font-black italic uppercase">Loading Contest Details...</div>;
  }

  const contest = contestData?.data;
  // đây nè
  const problems = contest?.problems || [];

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        addToast({
          title: "Invite Code Copied!",
          description: "Code has been copied to your clipboard.",
          color: "success"
        });
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error("Failed to copy using navigator.clipboard: ", err);
        fallbackCopyTextToClipboard(code);
      });
    } else {
      fallbackCopyTextToClipboard(code);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Ensure textarea is not visible
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        addToast({
          title: "Invite Code Copied!",
          description: "Code has been copied to your clipboard (fallback).",
          color: "success"
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  const showInviteCode = contest?.status?.toLowerCase() === "upcoming" && contest?.inviteCode && (
    contest.visibility?.toLowerCase() === "public" || isAdminOrTeacher
  );

  return (
    <div className="w-full">
      <ContestHeader contestId={contestId} />

      {/* MAIN CONTENT AREA */}
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-20">

        {/* INFO TAB CONTENT */}
        <div className="container mx-auto px-4 md:px-10 -mt-10 relative z-20 pb-20">
          {selectedTab === "info" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* MAIN CONTENT: Rules & Description */}
                <div className="lg:col-span-8 space-y-8">
                  <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
                    <CardBody className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* Sidebar Info */}
                        <div className="md:col-span-4 bg-[#071739] p-8 text-white space-y-8">
                          <div>
                            <h3 className="text-xl font-[1000] italic uppercase leading-none mb-3">
                              Contest<br /><span className="text-[#FF5C00]">Rules</span>
                            </h3>
                            <p className="text-gray-400 text-[10px] font-semibold uppercase leading-relaxed">
                              Please read carefully before starting.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex gap-3">
                              <div className="w-6 h-6 rounded bg-[#FF5C00] flex items-center justify-center shrink-0">
                                <span className="font-black italic text-[10px]">01</span>
                              </div>
                              <p className="text-[9px] font-black uppercase italic leading-tight pt-1">Pass all tests for points</p>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0">
                                <span className="font-black italic text-[10px]">02</span>
                              </div>
                              <p className="text-[9px] font-black uppercase italic leading-tight pt-1 text-white/50">20-min penalty per fail</p>
                            </div>
                          </div>

                          {showInviteCode && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Copy className="w-3 h-3 text-[#FF5C00]" />
                                <span className="text-[9px] font-black uppercase italic">Invite Code</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-black italic uppercase text-[#FF5C00]">{contest?.inviteCode}</p>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  className="text-white h-7 w-7 min-w-0"
                                  onPress={() => handleCopyCode(contest?.inviteCode!)}
                                >
                                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Main Details */}
                        <div className="md:col-span-8 p-8 dark:bg-[#1e293b]">
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <span className="text-[10px] font-black italic uppercase text-gray-400">Section 01: Description</span>
                              <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                {contest?.description || "No description provided for this contest."}
                              </div>
                            </div>

                            <Divider className="bg-slate-100 dark:bg-white/10" />

                            <div className="space-y-4">
                              <span className="text-[10px] font-black italic uppercase text-gray-400">Section 02: Registration</span>
                              {contest?.status?.toLowerCase() === "upcoming" && !isRegistered && !isAdminOrTeacher ? (
                                <div className="p-6 bg-[#FF5C00]/5 border border-[#FF5C00]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <p className="text-xs font-black uppercase italic text-[#FF5C00]">You are not registered yet!</p>
                                  <Button
                                    className="bg-[#071739] text-white font-black italic uppercase rounded-xl px-8 h-12 shadow-lg shadow-[#071739]/20"
                                    onPress={() => router.push(`/Contest/${contestId}/register`)}
                                  >
                                    Register Now
                                  </Button>
                                </div>
                              ) : (
                                <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center gap-3">
                                  <CheckCircle2 className="text-green-500" size={20} />
                                  <p className="text-xs font-black uppercase italic text-green-600">You are registered for this contest</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* RIGHT SIDEBAR: System Status */}
                <div className="lg:col-span-4 space-y-6">
                  <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-[#1e293b] p-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-[1000] italic uppercase text-slate-900 dark:text-white">System <span className="text-[#FF5C00]">Status</span></h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                          <div className="w-10 h-10 rounded-xl bg-[#FF5C00]/10 flex items-center justify-center border border-[#FF5C00]/20">
                            <Hash className="w-5 h-5 text-[#FF5C00]" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Scoring</p>
                            <p className="font-black italic uppercase text-sm">{contest?.contestType === 'acm' ? 'ICPC Format' : 'IOI Format'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Access</p>
                            <p className="font-black italic uppercase text-sm">{contest?.visibility || "Public"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* PROBLEM LIST */}
              {contest?.status?.toLowerCase() !== "upcoming" && contest?.status?.toLowerCase() !== "draft" && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-[1000] italic uppercase text-slate-900 dark:text-white">Problem <span className="text-[#FF5C00]">List</span></h3>
                    <Chip size="sm" variant="flat" className="bg-[#FF5C00]/10 text-[#FF5C00] font-black italic uppercase border-none">{problems.length} Challenges</Chip>
                  </div>

                  <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-xl border-none overflow-hidden">
                    <Table
                      aria-label="Problems table"
                      removeWrapper
                      classNames={{
                        base: "min-w-full",
                        table: "min-w-full",
                        th: "bg-[#071739] text-white/50 font-black italic uppercase text-[10px] py-6 first:pl-10 last:pr-10 border-none",
                        td: "py-5 text-sm font-bold border-b border-slate-100 dark:border-white/5 group-last:border-none px-10",
                        tr: "hover:bg-[#FF5C00]/5 dark:hover:bg-[#FF5C00]/10 transition-all cursor-pointer group",
                      }}
                    >
                      <TableHeader>
                        <TableColumn key="ordinal" className="w-[80px] text-center">#</TableColumn>
                        <TableColumn key="title">Challenge Name</TableColumn>
                        <TableColumn key="points" className="text-center w-[120px]">Points</TableColumn>
                      </TableHeader>
                      <TableBody items={problems}>
                        {(item) => (
                          <TableRow key={item.problemId} onClick={() => router.push(`/Contest/${contestId}/Problems/${item.problemId}?contestProblemId=${item.id}`)}>
                            <TableCell className="text-center">
                              <span className="text-slate-400 font-black italic">{item.ordinal}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-black italic uppercase text-slate-800 dark:text-slate-200 group-hover:text-[#FF5C00] transition-colors tracking-tight">
                                {item.title}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Chip size="sm" className="bg-green-500/10 text-green-600 font-[1000] italic border-none h-7 px-4">
                                {item.points} PTS
                              </Chip>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* OTHER TABS PLACEHOLDER */}
        {selectedTab !== "info" && (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center gap-4 animate-in fade-in zoom-in-[0.98] duration-300">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Content is being updated...</p>
          </div>
        )}
      </div>

    </div>
  );
}
