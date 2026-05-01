"use client";

import React, { createContext, useContext, useState } from "react";
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
  // Polling remains disabled per performance request
  useGetBadgesQuery(undefined);
  useGetGamificationMeQuery(undefined);
  useGetBadgeProgressQuery(undefined);

  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
