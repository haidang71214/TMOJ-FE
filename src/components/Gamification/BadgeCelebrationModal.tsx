"use client";

import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Sparkles, X } from "lucide-react";
import { Badge } from "@/types/gamification";

interface BadgeCelebrationModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeCelebrationModal({ badge, isOpen, onClose }: BadgeCelebrationModalProps) {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const colors = ["#FF5C00", "#FFD700", "#00FF41", "#3B5BFF", "#9B3BFF", "#FF3BFF"];
      const newParticles = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: (Math.random() - 0.5) * window.innerHeight * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!badge) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="full"
      hideCloseButton
      backdrop="blur"
      scrollBehavior="outside"
      classNames={{
        base: "bg-black/40 backdrop-blur-md shadow-none border-none overflow-hidden",
        wrapper: "z-[9999] overflow-hidden",
      }}
    >
      <ModalContent>
        <ModalBody className="p-0 overflow-hidden">
          <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
            {/* Background Glows */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-purple-500/10 to-transparent rounded-full blur-[150px] scale-150 animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-blob" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />

            {/* Confetti Particles */}
            <AnimatePresence>
              {isOpen && particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: 0,
                    scale: Math.random() * 1.5 + 0.5,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              ))}
            </AnimatePresence>

            {/* Badge Icon Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.2, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
              className="relative z-10 w-56 h-56 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-white dark:bg-[#111827] rounded-[4rem] rotate-12 shadow-2xl border-4 border-[#FF5C00]/20" />
              <div className="absolute inset-0 bg-[#FF5C00] rounded-[4rem] -rotate-6 shadow-xl" />
              <div className="relative z-20 text-white flex flex-col items-center">
                <Award size={96} strokeWidth={2.5} />
                <Sparkles className="absolute -top-6 -right-6 text-yellow-300 animate-pulse" size={48} />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center z-10"
            >
              <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(255,92,0,0.5)]">
                Badge <span className="text-[#FF5C00]">Earned!</span>
              </h2>
              <p className="text-2xl font-black uppercase italic text-white mt-4 tracking-widest bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">
                {badge.name}
              </p>
              <p className="text-xs text-white/60 uppercase mt-6 max-w-[400px] mx-auto leading-relaxed font-bold tracking-widest">
                Masterpiece Unlocked! You have reached a significant milestone in your coding journey.
              </p>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 z-10"
            >
              <Button
                className="bg-white text-[#FF5C00] font-[1000] uppercase italic tracking-widest px-10 h-12 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                onPress={onClose}
              >
                Awesome!
              </Button>
            </motion.div>

            {/* Close Button */}
            <Button
              isIconOnly
              variant="light"
              className="absolute top-0 right-0 text-white/20 hover:text-white"
              onPress={onClose}
            >
              <X size={24} />
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
