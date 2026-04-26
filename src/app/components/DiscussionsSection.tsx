"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Avatar, Card, CardBody, Spinner } from "@heroui/react";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetProblemListPublicQuery } from "@/store/queries/ProblemPublic";
import { useLazyGetProblemDiscussionsQuery } from "@/store/queries/discussion";
import { DiscussionItem } from "@/types";

export default function DiscussionsSection({ brandOrange, brandNavy }: { brandOrange: string; brandNavy: string }) {
  const router = useRouter();
  const [randomDiscussions, setRandomDiscussions] = useState<{ discussion: DiscussionItem; problemId: string; problemTitle: string }[]>([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(true);

  const { data: problemsData } = useGetProblemListPublicQuery({ page: 1, pageSize: 10 });
  const [triggerGetDiscussions] = useLazyGetProblemDiscussionsQuery();

  useEffect(() => {
    async function fetchRandomDiscussions() {
      if (!problemsData?.data || problemsData.data.length === 0) return;

      setLoadingDiscussions(true);
      try {
        // Lấy ngẫu nhiên khoảng một số bài tập để check discussion
        const shuffled = [...problemsData.data].sort(() => 0.5 - Math.random());
        const selectedProblems = shuffled.slice(0, 8); // Tăng số lượng bài tập kiểm tra

        const allDiscussions: { discussion: DiscussionItem; problemId: string; problemTitle: string }[] = [];

        for (const problem of selectedProblems) {
          if (allDiscussions.length >= 5) break; // Lấy tối đa 5 discussion

          try {
            const res = await triggerGetDiscussions({ problemId: problem.id }).unwrap();
            const items = res?.data?.items || [];

            if (items.length > 0) {
              // Lấy discussion mới nhất hoặc ghim của bài đó
              const disc = items[0];
              allDiscussions.push({
                discussion: disc,
                problemId: problem.id,
                problemTitle: problem.title
              });
            }
          } catch (err) {
            console.error(`Failed to fetch discussions for problem ${problem.id}`, err);
          }
        }

        setRandomDiscussions(allDiscussions);
      } finally {
        setLoadingDiscussions(false);
      }
    }

    if (problemsData) {
      fetchRandomDiscussions();
    }
  }, [problemsData, triggerGetDiscussions]);

  const displayDiscussions = randomDiscussions;

  if (!loadingDiscussions && displayDiscussions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 dark:text-white">
        <MessageSquare style={{ color: brandOrange }} size={28} /> Discussions & News
      </h3>

      <div className="flex flex-col gap-5">
        {loadingDiscussions ? (
          <div className="flex justify-center py-10">
            <Spinner color="warning" />
          </div>
        ) : (
          displayDiscussions.map((item, i) => (
            <Card
              key={item.discussion.id || i}
              onPress={() => {
                if (item.problemId !== "default") {
                  router.push(`/Problems/${item.problemId}?tab=description`);
                }
              }}
              isPressable
              className="bg-white/60 dark:bg-[#1C2737]/80 backdrop-blur-md border-none rounded-3xl hover:scale-[1.01] transition-all p-3 shadow-sm group"
            >
              <CardBody className="flex flex-row gap-6 items-center p-4">
                <Avatar
                  name={item.discussion.userDisplayName}
                  src={item.discussion.userAvatarUrl || undefined}
                  size="md"
                  style={{ backgroundColor: brandNavy }}
                  className="text-[#FF5C00] font-black"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#FF5C00]/10 text-[#FF5C00] text-[9px] font-black uppercase italic">
                      {item.problemTitle || "General"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase italic">
                      {new Date(item.discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-black text-lg text-[#071739] dark:text-white group-hover:text-[#FF5C00] transition-colors uppercase italic line-clamp-1">
                    {item.discussion.title}
                  </h4>
                  <div className="flex gap-4 mt-1 font-black text-[9px] text-[#A4B5C4] uppercase italic items-center">
                    <span>By {item.discussion.userDisplayName}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{item.discussion.voteCount || 0} Votes</span>
                  </div>
                </div>
                <ChevronRight style={{ color: brandOrange }} />
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
