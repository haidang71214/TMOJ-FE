"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LoadingPage() {
  const loadingText = "TMOJ LOADING...";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-background overflow-hidden relative">
      {/* Nền Gradient khuếch tán màu cam */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-[350px] w-[350px] rounded-full bg-orange-500/30 blur-[100px]"
        />
      </div>

      <div className="z-10 flex flex-col items-center gap-14 text-center">
        {/* Hình khối Loading mượt mà */}
        <div className="relative flex items-center justify-center">
          {/* Những vòng xoay hình học */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-orange-500/40 rounded-[40%]"
              style={{
                width: 130 + i * 35,
                height: 130 + i * 35,
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Vòng quay lõi */}
          <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
            {/* Spinner 1 */}
            <motion.div
              className="absolute w-20 h-20 rounded-full border-t-[3px] border-r-[3px] border-transparent border-t-orange-500/90 border-r-orange-500/90 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Spinner 2 */}
            <motion.div
              className="absolute w-14 h-14 rounded-full border-b-[3px] border-l-[3px] border-transparent border-b-orange-400 border-l-orange-400 opacity-80"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            {/* Hạt nhân nhịp đập */}
            <motion.div
              className="h-4 w-4 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)]"
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Chữ "TMOJ LOADING..." hiện từng chữ với Wave Effect */}
        <div className="flex flex-col gap-3 items-center mt-4">
          <div className="flex space-x-[2px]">
            {loadingText.split("").map((letter, index) => (
              <motion.span
                key={index}
                className={`text-3xl sm:text-4xl font-black tracking-widest ${
                  letter === " " ? "w-3 sm:w-4" : ""
                } text-orange-500`}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  y: [0, -10, 0],
                  textShadow: [
                    "0px 0px 0px rgba(249,115,22,0)", 
                    "0px 0px 15px rgba(249,115,22,0.9)", 
                    "0px 0px 0px rgba(249,115,22,0)"
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.12, // Dịch chuyển delay tạo thành hiệu ứng lượn sóng hiện từng chữ
                  ease: "easeInOut",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Thanh loading thanh mảnh bên dưới */}
          <div className="w-48 h-[2px] bg-orange-500/20 rounded-full mt-2 overflow-hidden relative">
            <motion.div 
              className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)] absolute left-0"
              initial={{ width: "0%", left: "0%" }}
              animate={{ 
                width: ["0%", "40%", "0%"],
                left: ["0%", "60%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
