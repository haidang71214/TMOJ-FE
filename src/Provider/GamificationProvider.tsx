"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetBadgesQuery, useGetGamificationMeQuery, useGetBadgeProgressQuery } from "@/store/queries/gamification";
import BadgeCelebrationModal from "@/components/Gamification/BadgeCelebrationModal";
import { Badge } from "@/types/gamification";

interface GamificationContextType {
  showCelebration: (badge: Badge) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
};

export default function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { data: badges } = useGetBadgesQuery(undefined, {
    pollingInterval: 30000,
  });

  const { data: meResponse } = useGetGamificationMeQuery(undefined, {
    pollingInterval: 30000,
  });

  const { data: progressResponse } = useGetBadgeProgressQuery(undefined, {
    pollingInterval: 30000,
  });

  const stats = meResponse?.data;
  const progressList = (progressResponse as any)?.data || [];

  const [lastBadgeIds, setLastBadgeIds] = useState<string[]>([]);
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initial load: store current badges without celebrating
    if (badges && lastBadgeIds.length === 0) {
      const ids = badges.map((b) => b.badgeId);
      setLastBadgeIds(ids);

      // Save to localStorage to persist across refreshes
      const savedIds = localStorage.getItem("tmoj_badge_ids");
      if (savedIds) {
        setLastBadgeIds(JSON.parse(savedIds));
      } else {
        localStorage.setItem("tmoj_badge_ids", JSON.stringify(ids));
      }
    }
  }, [badges]);

  useEffect(() => {
    if (badges && lastBadgeIds.length > 0) {
      const newBadges = badges.filter((b) => !lastBadgeIds.includes(b.badgeId));

      if (newBadges.length > 0) {
        setCelebrationBadge(newBadges[0]);
        setIsModalOpen(true);

        const updatedIds = [...lastBadgeIds, ...newBadges.map(b => b.badgeId)];
        setLastBadgeIds(updatedIds);
        localStorage.setItem("tmoj_badge_ids", JSON.stringify(updatedIds));
      }
    }
  }, [badges, lastBadgeIds]);

  // Client-side rule check (Fallback if backend is slow/buggy)
  useEffect(() => {
    if (stats && progressList.length > 0) {
      const currentStreak = stats.currentStreak ?? 0;

      // Find badges that should be completed based on streak but aren't yet in earned list
      const pendingStreakBadge = progressList.find((p: any) =>
        p.name.toLowerCase().includes("streak") &&
        currentStreak >= p.targetValue &&
        !p.isCompleted &&
        !lastBadgeIds.includes(p.badgeId)
      );

      if (pendingStreakBadge) {
        showCelebration({
          badgeId: pendingStreakBadge.badgeId,
          name: pendingStreakBadge.name,
          awardedAt: new Date().toISOString()
        });

        // Add to local list so we don't celebrate again for the same session
        setLastBadgeIds(prev => [...prev, pendingStreakBadge.badgeId]);
      }
    }
  }, [stats, progressList, lastBadgeIds]);

  const showCelebration = (badge: Badge) => {
    setCelebrationBadge(badge);
    setIsModalOpen(true);
  };

  return (
    <GamificationContext.Provider value={{ showCelebration }}>
      {children}
      <BadgeCelebrationModal
        badge={celebrationBadge}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </GamificationContext.Provider>
  );
}
