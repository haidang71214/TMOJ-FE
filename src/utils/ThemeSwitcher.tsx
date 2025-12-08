"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mx-4">
      {theme === "light" ? (
        <Icon
          className="cursor-pointer"
          color="black"
          height="25"
          icon="mdi:weather-night"
          width="25"
          onClick={() => setTheme("dark")}
        />
      ) : (
        <Icon
          className="cursor-pointer"
          color="white"
          height="25"
          icon="mdi:white-balance-sunny"
          width="25"
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
};
