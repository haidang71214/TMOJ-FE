"use client";

import React, { createContext, useContext, useState } from "react";
import { useGetBadgesQuery, useGetGamificationMeQuery, useGetBadgeProgressQuery } from "@/store/queries/gamification";
import BadgeCelebrationModal from "@/components/Gamification/BadgeCelebrationModal";
import CoinFlyAnimation from "@/components/Gamification/CoinFlyAnimation";
import { Badge } from "@/types/gamification";

interface GamificationContextType {
  showCelebration: (badge: Badge | null, customTitle?: string, customMessage?: string) => void;
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
  const [customTitle, setCustomTitle] = useState<string | undefined>();
  const [customMessage, setCustomMessage] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  const showCelebration = (badge: Badge | null, title?: string, message?: string) => {
    setCelebrationBadge(badge);
    setCustomTitle(title);
    setCustomMessage(message);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Trigger coin animation for mission rewards or badges
    if (customTitle || customMessage || celebrationBadge) {
      setShowCoinAnimation(true);
    }
  };

  return (
    <GamificationContext.Provider value={{ showCelebration }}>
      {children}
      <BadgeCelebrationModal
        badge={celebrationBadge}
        isOpen={isModalOpen}
        onClose={handleClose}
        customTitle={customTitle}
        customMessage={customMessage}
      />
      <CoinFlyAnimation
        active={showCoinAnimation}
        onComplete={() => {
          setShowCoinAnimation(false);
          setCelebrationBadge(null);
          setCustomTitle(undefined);
          setCustomMessage(undefined);
        }}
      />
    </GamificationContext.Provider>
  );
}
