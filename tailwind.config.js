// tailwind.config.js
import { heroui } from "@heroui/theme";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
  extend: {},
  heroui: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          foreground: "#111827",
          background: "#f9fafb",
          primary: "#4f46e5",
          secondary: "#10b981",
        },
        layout: {
          borderRadius: "0.5rem",
          spacing: "1rem",
        },
      },
      dark: {
        colors: {
          foreground: "#f9fafb",
          background: "#1f2937",
          primary: "#6366f1",
          secondary: "#22c55e",
        },
        layout: {
          borderRadius: "0.5rem",
          spacing: "1rem",
        },
      },
    },
  },
},
  plugins: [heroui(), animate], // ← animate đã hỗ trợ ESM ở v1.0.7+
};

export default config;