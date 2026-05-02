"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";

interface CoinFlyAnimationProps {
  active: boolean;
  onComplete: () => void;
  count?: number;
}

export default function CoinFlyAnimation({ active, onComplete, count = 10 }: CoinFlyAnimationProps) {
  const [coins, setCoins] = useState<{ id: number; delay: number; offsetX: number; offsetY: number }[]>([]);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (active) {
      // Get target position (navbar coin)
      const target = document.getElementById("navbar-coin-balance");
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }

      // Generate coins with staggered delays and random starting offsets
      const newCoins = Array.from({ length: count }).map((_, i) => ({
        id: i,
        delay: i * 0.08,
        offsetX: (Math.random() - 0.5) * 100, // Random spread at start
        offsetY: (Math.random() - 0.5) * 100,
      }));
      setCoins(newCoins);

      // Cleanup after animation duration
      const timer = setTimeout(() => {
        setCoins([]);
        onComplete();

        // Trigger "pop" effect on navbar
        const target = document.getElementById("navbar-coin-balance");
        if (target) {
          target.classList.add("scale-125", "brightness-125");
          setTimeout(() => {
            target.classList.remove("scale-125", "brightness-125");
          }, 300);
        }
      }, (count * 0.08 + 0.8) * 1000);

      return () => clearTimeout(timer);
    }
  }, [active, count, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      <AnimatePresence>
        {active &&
          coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{
                x: `calc(50vw + ${coin.offsetX}px)`,
                y: `calc(50vh + ${coin.offsetY}px)`,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: targetPos.x,
                y: targetPos.y,
                scale: [0, 1.5, 1],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.7,
                delay: coin.delay,
                ease: "backIn",
              }}
              className="absolute"
            >
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-yellow-300">
                <Coins size={14} />
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
